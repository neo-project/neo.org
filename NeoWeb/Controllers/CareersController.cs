using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using NeoWeb.Models;
using System.Security.Claims;
using Microsoft.Extensions.Localization;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CareersController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly string _userId;
        private readonly bool _userRules;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;

        public CareersController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IStringLocalizer<SharedResource> sharedLocalizer)
        {
            _context = context;
            _sharedLocalizer = sharedLocalizer;
            _userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (_userId != null)
            {
                _userRules = _context.UserRoles.Any(p => p.UserId == _userId);
            }
        }

        // GET: Careers
        [AllowAnonymous]
        public async Task<IActionResult> Index(string group = "")
        {
            ViewBag.UserRules = _userRules;
            var isZh = _sharedLocalizer["en"] == "zh";
            ViewBag.Group = group;
            ViewBag.Groups = _context.Careers.GroupBy(p => isZh ? p.ChineseGroup.ToLower() : p.EnglishGroup.ToLower()).Select(p => p.Key).ToList();
            if (group.Length > 0)
            {
                return View(await _context.Careers.Where(p => p.ChineseGroup.ToLower() == group || p.EnglishGroup.ToLower() == group).OrderByDescending(p => p.CreateTime).ToListAsync());
            }
            return View(await _context.Careers.OrderByDescending(p => p.CreateTime).ToListAsync());
        }

        // GET: Careers/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Careers/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Number,ChineseTitle,EnglishTitle,ChineseContent,EnglishContent,ChineseGroup,EnglishGroup,IsShow")] Job job)
        {
            if (ModelState.IsValid)
            {
                job.CreateTime = DateTime.Now;
                job.EditTime = DateTime.Now;
                _context.Add(job);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(job);
        }

        // GET: Careers/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var job = await _context.Careers.FindAsync(id);
            if (job == null)
            {
                return NotFound();
            }
            return View(job);
        }

        // POST: Careers/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Number,ChineseTitle,EnglishTitle,ChineseContent,EnglishContent,ChineseGroup,EnglishGroup,IsShow")] Job job)
        {
            if (id != job.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    job.EditTime = DateTime.Now;
                    _context.Update(job);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!JobExists(job.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(job);
        }

        // GET: Careers/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var job = await _context.Careers
                .FirstOrDefaultAsync(m => m.Id == id);
            if (job == null)
            {
                return NotFound();
            }

            return View(job);
        }

        // POST: Careers/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var job = await _context.Careers.FindAsync(id);
            _context.Careers.Remove(job);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool JobExists(int id)
        {
            return _context.Careers.Any(e => e.Id == id);
        }
    }
}
