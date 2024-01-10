using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using NeoWeb.Data;
using NeoWeb.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class JoinUSController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly string _userId;
        private readonly bool _userRules;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;

        public JoinUSController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IStringLocalizer<SharedResource> sharedLocalizer)
        {
            _context = context;
            _sharedLocalizer = sharedLocalizer;
            _userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (_userId != null)
            {
                _userRules = _context.UserRoles.Any(p => p.UserId == _userId);
            }
        }

        [AllowAnonymous]
        public async Task<IActionResult> Index(string group = "")
        {
            ViewBag.UserRules = _userRules;
            var isZh = _sharedLocalizer["en"] == "zh";
            ViewBag.Group = group;
            ViewBag.Groups = _context.Jobs.Where(p => p.IsShow).GroupBy(p => isZh ? p.ChineseGroup : p.EnglishGroup).Select(p => p.Key).ToList();
            if (group.Length > 0)
            {
                return View(await _context.Jobs.Where(p => p.IsShow).Where(p => p.ChineseGroup == group || p.EnglishGroup == group).OrderBy(p => p.EnglishTitle).ToListAsync());
            }
            return View(await _context.Jobs.Where(p => p.IsShow).OrderBy(p => p.EnglishTitle).ToListAsync());
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Number,ChineseTitle,EnglishTitle,ChineseContent,EnglishContent,ChineseGroup,EnglishGroup,IsShow")] Job job)
        {
            if (ModelState.IsValid)
            {
                job.CreateTime = DateTime.Now;
                job.EditTime = DateTime.Now;
                job.IsShow = true;
                _context.Add(job);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(job);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                return NotFound();
            }
            return View(job);
        }

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
                var item = _context.Jobs.FirstOrDefault(p => p.Id == job.Id);
                try
                {
                    item.Number = job.Number;
                    item.ChineseTitle = job.ChineseTitle;
                    item.ChineseGroup = job.ChineseGroup;
                    item.ChineseContent = job.ChineseContent;
                    item.EnglishTitle = job.EnglishTitle;
                    item.EnglishGroup = job.EnglishGroup;
                    item.EnglishContent = job.EnglishContent;
                    item.IsShow = true;
                    item.EditTime = DateTime.Now;
                    _context.Update(item);
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

        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var job = await _context.Jobs
                .FirstOrDefaultAsync(m => m.Id == id);
            if (job == null)
            {
                return NotFound();
            }

            return View(job);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            job.IsShow = false;
            _context.Update(job);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool JobExists(int id)
        {
            return _context.Jobs.Any(e => e.Id == id);
        }
    }
}
