using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using NeoWeb.Data;
using NeoWeb.Models;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ResumeController : Controller
    {
        private readonly ApplicationDbContext _context;

        private readonly IWebHostEnvironment _env;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;

        public ResumeController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IStringLocalizer<SharedResource> sharedLocalizer, IWebHostEnvironment env)
        {
            _context = context;
            _sharedLocalizer = sharedLocalizer;
            _env = env;
        }

        // GET: Resume
        public IActionResult Index()
        {
            var list = _context.Resume.Include(p => p.Job).Where(p => p.Job != null).ToList();
            return View(list.Where(p => (DateTime.Now - p.DateTime).TotalDays < 30));
        }

        [AllowAnonymous]
        // GET: Resume/Create
        public IActionResult Create(int jobId)
        {
            var job = _context.Jobs.FirstOrDefault(p => p.Id == jobId);
            if (job == null)
                return NotFound();
            ViewBag.Job = job;
            return View();
        }

        // POST: Resume/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,Phone,Scool,Specialty,ReferralCode,MyReferralCode")] Resume resume, int jobId, IFormFile file)
        {
            var job = _context.Jobs.FirstOrDefault(p => p.Id == jobId);
            if (job == null)
                return NotFound();
            ViewBag.Job = job;

            if (ModelState.IsValid)
            {
                if (file == null)
                {
                    ViewBag.Error = "Please upload your resume.";
                    return View(resume);
                }
                if (job == null)
                {
                    ModelState.AddModelError("Job", "The selected job does not exist.");
                    return View(resume);
                }
                if(!string.IsNullOrEmpty(resume.ReferralCode) && !_context.Resume.Any(p => resume.ReferralCode == p.MyReferralCode))
                {
                    ModelState.AddModelError("ReferralCode", "The referral code does not exist.");
                    return View(resume);
                }
                resume.Job = job;
                resume.Path = Helper.UploadFile(file, _env);
                resume.MyReferralCode = resume.Path.Substring(0, 10);
                _context.Add(resume);
                await _context.SaveChangesAsync();
                return Complete(resume.MyReferralCode);
            }
            return View(resume);
        }

        public IActionResult Complete(string code)
        {
            return View("complete", code);
        }
    }
}
