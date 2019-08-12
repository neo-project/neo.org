using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using NeoWeb.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Collections.Generic;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class NewsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly string _userId;
        private readonly bool _userRules;
        private readonly IHostingEnvironment _env;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;

        public NewsController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IHostingEnvironment env, 
            IStringLocalizer<SharedResource> sharedLocalizer)
        {
            _context = context;
            _userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            _env = env;
            _sharedLocalizer = sharedLocalizer;
            if (_userId != null)
            {
                _userRules = _context.UserRoles.Any(p => p.UserId == _userId);
            }
        }

        // GET: news
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Index()
        {
            IQueryable<News> news = _context.News;
            //中英文切换
            List<NewsViewModel> viewModels = news.OrderByDescending(p => p.Time).Select(p => new NewsViewModel(p, _sharedLocalizer["en"] == "zh")).ToList();
            
            return View(viewModels);
        }
        
        // GET: news/details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            News news = await _context.News.SingleOrDefaultAsync(m => m.Id == id);
            if (news == null)
            {
                return NotFound();
            }

            NewsViewModel viewModel = new NewsViewModel(news, _sharedLocalizer["en"] == "zh");
            
            ViewBag.UserRules = _userRules;
            ViewBag.Language = _sharedLocalizer["en"];
            return View(news);
        }

        // GET: news/create
        public IActionResult Create()
        {
            return View();
        }

        // POST: news/create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,ChineseTitle,EnglishTitle,Link")] News news)
        {
            if (ModelState.IsValid)
            {
                news.Time = DateTime.Now;
                _context.Add(news);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(news);
        }

        // GET: news/edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var news = await _context.News.SingleOrDefaultAsync(m => m.Id == id);
            if (news == null)
            {
                return NotFound();
            }
            return View(news);
        }

        // POST: news/edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,ChineseTitle,EnglishTitle,Link")] News news)
        {
            if (id != news.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                news.Time = DateTime.Now;
                try
                {
                    _context.Update(news);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!NewsExists(news.Id))
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
            return View(news);
        }

        // GET: news/delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var news = await _context.News
                .SingleOrDefaultAsync(m => m.Id == id);
            if (news == null)
            {
                return NotFound();
            }

            return View(news);
        }

        // POST: news/delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var news = await _context.News.SingleOrDefaultAsync(m => m.Id == id);
            _context.News.Remove(news);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool NewsExists(int id)
        {
            return _context.News.Any(e => e.Id == id);
        }
    }
}
