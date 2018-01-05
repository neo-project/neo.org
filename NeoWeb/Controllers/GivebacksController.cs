using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using NeoWeb.Models;
using System.Security.Cryptography;
using Neo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Localization;

namespace NeoWeb.Controllers
{
    public class GivebackController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IHtmlLocalizer<GivebackController> _localizer;

        public GivebackController(ApplicationDbContext context, IHtmlLocalizer<GivebackController> localizer)
        {
            _context = context;
            _localizer = localizer;
        }

        // GET: Giveback
        public IActionResult Index()
        {
            return View();
        }

        // GET: Giveback/ICO1
        public IActionResult ICO1()
        {
            return View();
        }

        // GET: Giveback/ICO2
        public IActionResult ICO2()
        {
            return View();
        }

        // GET: Giveback/List1
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> List1()
        {
            return View(await _context.ICO1.Where(p => p.CommitTime != null).ToListAsync());
        }

        // GET: Giveback/List2
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> List2()
        {
            return View(await _context.ICO2.Where(p => p.CommitTime != null).ToListAsync());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult ICO1([Bind("Email,RedeemCode,Choose,Name,BankAccount,BankName,GivebackNeoAddress")] ICO1 giveback)
        {
            if (DateTime.Now > new DateTime(2018, 3, 15, 0, 0, 0))
            {
                ViewBag.Message = "回馈计划已截止";
                return View(giveback);
            }
            if (ModelState.IsValid)
            {
                var item = _context.ICO1.FirstOrDefault(p => p.Email == giveback.Email);
                if (item == null)
                {
                    ModelState.AddModelError("Email", "该用户未参与过ICO1");
                    return View(giveback);
                }
                item = _context.ICO1.FirstOrDefault(p => p.Email == giveback.Email && p.RedeemCode == giveback.RedeemCode);
                if (item == null)
                {
                    ModelState.AddModelError("RedeemCode", "兑换码错误");
                    return View(giveback);
                }
                if (giveback.Choose == Choose.RMB)
                {
                    item.GivebackNeoAddress = null;
                    item.BankAccount = giveback.BankAccount;
                    item.BankName = giveback.BankName;
                    item.Name = giveback.Name;
                }
                else
                {
                    try
                    {
                        Neo.Wallets.Wallet.ToScriptHash(giveback.GivebackNeoAddress);
                    }
                    catch (Exception)
                    {
                        ModelState.AddModelError("GivebackNeoAddress", "NEO地址错误");
                        return View(giveback);
                    }
                    item.GivebackNeoAddress = giveback.GivebackNeoAddress;
                    item.BankAccount = null;
                    item.BankName = null;
                    item.Name = null;
                }
                item.CommitTime = DateTime.Now;
                _context.SaveChanges();
                return View("completed");
            }
            return View(giveback);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult ICO2(string signature, string pubkey,
            [Bind("Email,Choose,Name,BankAccount,BankName,GivebackNeoAddress")] ICO2 giveback)
        {
            if (DateTime.Now > new DateTime(2018, 3, 15, 0, 0, 0))
            {
                ViewBag.Message = _localizer["The giveback plan has expired"];
                return View(giveback);
            }
            if (ModelState.IsValid)
            {
                var publicKey = Neo.Cryptography.ECC.ECPoint.FromBytes(pubkey.HexToBytes(), Neo.Cryptography.ECC.ECCurve.Secp256r1);
                var sc = Neo.SmartContract.Contract.CreateSignatureContract(publicKey);
                var message = "giveback" + giveback.BankAccount + giveback.GivebackNeoAddress;
                if (!VerifySignature(message, signature, pubkey))
                {
                    ViewBag.Message = _localizer["Signature Verification Failure"];
                    return View(giveback);
                }
                var item = _context.ICO2.FirstOrDefault(p => p.NeoAddress == sc.Address);
                if (item == null)
                {
                    ViewBag.Message = _localizer["You have not participated in ICO2"];
                    return View(giveback);
                }
                if (giveback.Choose == Choose.RMB)
                {
                    item.GivebackNeoAddress = null;
                    item.BankAccount = giveback.BankAccount;
                    item.BankName = giveback.BankName;
                    item.Name = giveback.Name;
                }
                else
                {
                    try
                    {
                        Neo.Wallets.Wallet.ToScriptHash(giveback.GivebackNeoAddress);
                    }
                    catch (Exception)
                    {
                        ModelState.AddModelError("GivebackNeoAddress", "Incorrect NEO address");
                        return View(giveback);
                    }
                    item.GivebackNeoAddress = giveback.GivebackNeoAddress;
                    item.BankAccount = null;
                    item.BankName = null;
                    item.Name = null;
                }
                item.Email = giveback.Email;
                item.CommitTime = DateTime.Now;
                _context.SaveChanges();
                return View("completed");
            }
            return View(giveback);
        }
        
        private bool VerifySignature(string message, string signature, string pubkey)
        {
            var msg = System.Text.Encoding.Default.GetBytes(message);
            return VerifySignature(msg, signature.HexToBytes(), pubkey.HexToBytes());
        }

        //reference https://github.com/neo-project/neo/blob/master/neo/Cryptography/Crypto.cs
        private bool VerifySignature(byte[] message, byte[] signature, byte[] pubkey)
        {
            if (pubkey.Length == 33 && (pubkey[0] == 0x02 || pubkey[0] == 0x03))
            {
                try
                {
                    pubkey = Neo.Cryptography.ECC.ECPoint.DecodePoint(pubkey, Neo.Cryptography.ECC.ECCurve.Secp256r1).EncodePoint(false).Skip(1).ToArray();
                }
                catch
                {
                    return false;
                }
            }
            else if (pubkey.Length == 65 && pubkey[0] == 0x04)
            {
                pubkey = pubkey.Skip(1).ToArray();
            }
            else if (pubkey.Length != 64)
            {
                throw new ArgumentException();
            }
            using (var ecdsa = ECDsa.Create(new ECParameters
            {
                Curve = ECCurve.NamedCurves.nistP256,
                Q = new ECPoint
                {
                    X = pubkey.Take(32).ToArray(),
                    Y = pubkey.Skip(32).ToArray()
                }
            }))
            {
                return ecdsa.VerifyData(message, signature, HashAlgorithmName.SHA256);
            }
        }
    }
}
