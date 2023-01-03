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
using reCAPTCHA.AspNetCore;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ResumeController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IRecaptchaService _recaptcha;

        private readonly IWebHostEnvironment _env;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;
        private readonly IStringLocalizer<ResumeController> _localizer;

        public ResumeController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IStringLocalizer<SharedResource> sharedLocalizer, IWebHostEnvironment env, IStringLocalizer<ResumeController> localizer, IRecaptchaService recaptcha)
        {
            _context = context;
            _sharedLocalizer = sharedLocalizer;
            _localizer = localizer;
            _env = env;
            _recaptcha = recaptcha;
        }

        // GET: Resume
        public async Task<IActionResult> Index(int? jobId, int page = 1)
        {
            var countPerPage = 20;
            var dataBasePage = page - 1;
            var list = new List<Resume>();
            if (jobId is not null)
            {
                list = await _context.Resume.Include(p => p.Job).Where(p => p.Job.Id == jobId).OrderByDescending(p => p.DateTime).Skip(dataBasePage * countPerPage).Take(countPerPage).ToListAsync();
                ViewBag.Pages = Math.Ceiling(_context.Resume.Include(p => p.Job).Where(p => p.Job.Id == jobId).Count() / (double)countPerPage);
            }
            else
            {
                list = await _context.Resume.Include(p => p.Job).Where(p => p.Job != null).OrderByDescending(p => p.DateTime).Skip(dataBasePage * countPerPage).Take(countPerPage).ToListAsync();
                ViewBag.Pages = Math.Ceiling(_context.Resume.Include(p => p.Job).Where(p => p.Job != null).Count() / (double)countPerPage);
            }
            ViewBag.Job = _context.Jobs.FirstOrDefault(p => p.Id == jobId);
            ViewBag.Page = page;
            ViewBag.JobId = jobId;
            return View(list);
        }

        public async Task<IActionResult> ReferralCode(string code)
        {
            var person = _context.Resume.FirstOrDefault(p => p.MyReferralCode == code);
            return View(person);
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
        public async Task<IActionResult> Create([Bind("Id,Name,Phone,Email,Scool,Specialty,ReferralCode,MyReferralCode,GoogleToken")] Resume resume, int jobId, IFormFile file)
        {
            var job = _context.Jobs.FirstOrDefault(p => p.Id == jobId);
            if (job == null)
                return NotFound();
            ViewBag.Job = job;

            if (ModelState.IsValid)
            {
                if (file == null)
                {
                    ViewBag.Error = _localizer["Please upload your resume."];
                    return View(resume);
                }
                if (job == null)
                {
                    ModelState.AddModelError("Job", _localizer["The selected job does not exist."]);
                    return View(resume);
                }
                if(!string.IsNullOrEmpty(resume.ReferralCode) && !_context.Resume.Any(p => resume.ReferralCode == p.MyReferralCode))
                {
                    ModelState.AddModelError("ReferralCode", _localizer["The referral code does not exist."]);
                    return View(resume);
                }
                var recaptchaReault = await _recaptcha.Validate(resume.GoogleToken);

                if (!recaptchaReault.Success || recaptchaReault.Score < .5m)
                {
                    ModelState.AddModelError(string.Empty, "人机验证失败，请稍后重试");
                    return View(resume);
                }
                resume.Job = job;
                resume.Path = Helper.UploadFile(file, _env);
                resume.MyReferralCode = resume.Path.Substring(0, 10);
                resume.DateTime = DateTime.Now;
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
