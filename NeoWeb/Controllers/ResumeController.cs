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
using Neo;
using NeoWeb.Data;
using NeoWeb.Models;
using reCAPTCHA.AspNetCore;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class ResumeController(ApplicationDbContext context, IWebHostEnvironment env, IStringLocalizer<ResumeController> localizer, IRecaptchaService recaptcha) : Controller
    {

        // GET: Resume
        public async Task<IActionResult> Index(int? jobId, int page = 1)
        {
            var countPerPage = 20;
            var dataBasePage = page - 1;
            var list = new List<Resume>();
            if (jobId is not null)
            {
                list = await context.Resume.Include(p => p.Job).Where(p => p.Job.Id == jobId).OrderByDescending(p => p.DateTime).Skip(dataBasePage * countPerPage).Take(countPerPage).ToListAsync();
                ViewBag.Pages = Math.Ceiling(context.Resume.Include(p => p.Job).Where(p => p.Job.Id == jobId).Count() / (double)countPerPage);
            }
            else
            {
                list = await context.Resume.Include(p => p.Job).Where(p => p.Job != null).OrderByDescending(p => p.DateTime).Skip(dataBasePage * countPerPage).Take(countPerPage).ToListAsync();
                ViewBag.Pages = Math.Ceiling(context.Resume.Include(p => p.Job).Where(p => p.Job != null).Count() / (double)countPerPage);
            }
            ViewBag.Job = context.Jobs.FirstOrDefault(p => p.Id == jobId);
            ViewBag.Page = page;
            ViewBag.JobId = jobId;
            return View(list);
        }

        public Task<IActionResult> ReferralCode(string code)
        {
            var person = context.Resume.FirstOrDefault(p => p.MyReferralCode == code);
            return Task.FromResult<IActionResult>(View(person));
        }

        [AllowAnonymous]
        // GET: Resume/Create
        public IActionResult Create(int jobId)
        {
            var job = context.Jobs.FirstOrDefault(p => p.Id == jobId);
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
            var job = context.Jobs.FirstOrDefault(p => p.Id == jobId);
            if (job == null)
                return NotFound();
            ViewBag.Job = job;

            if (ModelState.IsValid)
            {
                if (file == null)
                {
                    ViewBag.Error = localizer["Please upload your resume."];
                    return View(resume);
                }
                if (job == null)
                {
                    ModelState.AddModelError("Job", localizer["The selected job does not exist."]);
                    return View(resume);
                }
                if(!string.IsNullOrEmpty(resume.ReferralCode) && !context.Resume.Any(p => resume.ReferralCode == p.MyReferralCode))
                {
                    ModelState.AddModelError("ReferralCode", localizer["The referral code does not exist."]);
                    return View(resume);
                }
                var recaptchaReault = await recaptcha.Validate(resume.GoogleToken);

                if (!recaptchaReault.Success || recaptchaReault.Score < .5m)
                {
                    ModelState.AddModelError(string.Empty, "人机验证失败，请稍后重试");
                    return View(resume);
                }
                resume.Job = job;
                resume.Path = Helper.UploadFile(file, env);
                var random = new Random();
                var bytes = new byte[10];
                random.NextBytes(bytes);
                resume.MyReferralCode = bytes.ToHexString()[..10];
                resume.DateTime = DateTime.Now;
                context.Add(resume);
                await context.SaveChangesAsync();
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
