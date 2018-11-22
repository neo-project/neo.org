using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Timers;
using Microsoft.AspNetCore.Http;
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
        private readonly IHttpContextAccessor _accessor;
        private readonly IStringLocalizer<ConsensusController> _localizer;

        public ConsensusController(ApplicationDbContext context, IStringLocalizer<ConsensusController> localizer, IHttpContextAccessor accessor)
        {
            _context = context;
            _accessor = accessor;
            _localizer = localizer;
        }

        // GET: consensus
        [HttpGet]
        public IActionResult Index()
        {
            ViewBag.Countries = _context.Countries.ToList();
            JArray list = (JArray)JObject.Parse(System.IO.File.ReadAllText("CandidateBackgrounder/validators.json"));
            ViewBag.PubKeys = new List<string>();
            foreach (JObject item in list)
            {
                ViewBag.PubKeys.Add(item["PublicKey"].AsString());
            }
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

        // POST: consensus/create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(string signature, [Bind("PublicKey,Organization,Email,Website,SocialAccount,Summary,")] Candidate c, IFormFile logo)
        {
            if (ModelState.IsValid && !string.IsNullOrEmpty(signature))
            {
                if(!Helper.CCAttack(_accessor.HttpContext.Connection.RemoteIpAddress, "consensus_post", 3600, 5))
                    return Content("Protecting from overposting attacks now!");
                ViewBag.Countries = _context.Countries.ToList();
                JArray list = (JArray)JObject.Parse(System.IO.File.ReadAllText("CandidateBackgrounder/validators.json"));
                ViewBag.PubKeys = new List<string>();
                foreach (JObject item in list)
                {
                    ViewBag.PubKeys.Add(item["PublicKey"].AsString());
                }
                //VerifySignature
                var message = ("candidate" + c.Email + c.Website + c.SocialAccount + c.Summary).Sha256().ToLower();
                if (!Helper.VerifySignature(message, signature, c.PublicKey))
                {
                    ViewBag.Message = _localizer["Signature Verification Failure"];
                    return View("Index", c);
                }
                if (logo != null)
                {
                    c.Logo = "~/upload/" + Upload(logo);
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

        private string Upload(IFormFile cover)
        {
            var random = new Random();
            var bytes = new byte[10];
            random.NextBytes(bytes);
            var newName = bytes.ToHexString() + Path.GetExtension(cover.FileName);
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/upload", newName);
            if (cover.Length > 0)
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    cover.CopyTo(stream);
                }
            }
            return newName;
        }
    }
}