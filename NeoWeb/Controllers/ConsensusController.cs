using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Timers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using Neo;
using Neo.IO.Json;
using NeoWeb.Data;
using NeoWeb.Models;

namespace NeoWeb.Controllers
{
    public class ConsensusController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IStringLocalizer<ConsensusController> _localizer;

        public ConsensusController(ApplicationDbContext context, IStringLocalizer<ConsensusController> localizer)
        {
            _context = context;
            _localizer = localizer;
        }

        // GET: Candidate
        public IActionResult Index()
        {
            ViewBag.Countries = _context.Countries.ToList();
            return View();
        }

        [HttpGet]
        public string Getvalidators()
        {
            return System.IO.File.ReadAllText("CandidateBackgrounder/validators.json");
        }

        [HttpGet]
        public string GetTxCount()
        {
            return System.IO.File.ReadAllText("CandidateBackgrounder/txcount.json");
        }

        // POST: Candidate/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(string signature, [Bind("PublicKey,Email,Website,SocialAccount,Summary,")] Candidate c)
        {
            if (ModelState.IsValid)
            {
                ViewBag.Countries = _context.Countries.ToList();
                //VerifySignature
                var message = ("candidate" + c.Email + c.Website + c.SocialAccount + c.Summary).Sha256().ToLower();
                if (!Helper.VerifySignature(message, signature, c.PublicKey))
                {
                    ViewBag.Message = _localizer["Signature Verification Failure"];
                    return View("Index", c);
                }
                //Insert or Update
                if (_context.Candidates.Any(p => p.PublicKey == c.PublicKey))
                {
                    _context.Update(c);
                }
                else
                {
                    _context.Add(c);
                }
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View("Index", c);
        }
        
        
    }
}
