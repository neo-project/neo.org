using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Neo;
using Neo.IO.Json;
using NeoWeb.Data;
using NeoWeb.Models;

namespace NeoWeb.Controllers
{
    public class CandidateController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IStringLocalizer<CandidateController> _localizer;

        public CandidateController(ApplicationDbContext context, IStringLocalizer<CandidateController> localizer)
        {
            _context = context;
            _localizer = localizer;
        }

        // GET: Candidate
        public async Task<IActionResult> Index()
        {
            return View(await _context.Candidates.ToListAsync());
        }

        [HttpGet]
        public JsonResult Getvalidators()
        {
            var response = Helper.PostWebRequest("http://localhost:10332", "{'jsonrpc': '2.0', 'method': 'getvalidators', 'params': [],  'id': 1}");
            var json = JObject.Parse(response)["result"];
            JArray list = (JArray)json;
            var result = new List<CandidateViewModels>();
            foreach (var item in list)
            {
                var c = CandidateViewModels.FromJson(item);
                c.Info = _context.Candidates.FirstOrDefault(p => p.PublicKey == c.PublicKey);
                result.Add(c);
            }
            return Json(result);
        }

        // GET: Candidate/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var Candidate = await _context.Candidates
                .FirstOrDefaultAsync(m => m.PublicKey == id);
            if (Candidate == null)
            {
                return NotFound();
            }

            return View(Candidate);
        }

        // GET: Candidate/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Candidate/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(string signature, string pubkey, [Bind("PublicKey,Email,IP,Website,Details,Location,SocialAccount,Telegram,Summary,")] Candidate c)
        {
            if (ModelState.IsValid)
            {
                //VerifySignature
                var publicKey = Neo.Cryptography.ECC.ECPoint.FromBytes(pubkey.HexToBytes(), Neo.Cryptography.ECC.ECCurve.Secp256r1);
                var sc = Neo.SmartContract.Contract.CreateSignatureContract(publicKey);
                var message = "candidate" + c.Email + c.Details;
                if (!VerifySignature(message, signature, pubkey))
                {
                    ViewBag.Message = _localizer["Signature Verification Failure"];
                    return View(c);
                }
                //Insert or Update
                var item = _context.Candidates.FirstOrDefault(p => p.PublicKey == c.PublicKey);
                if (item == null) 
                {
                    _context.Add(c);
                }
                else
                {
                    item = c;
                    _context.Update(item);
                }
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(c);
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
