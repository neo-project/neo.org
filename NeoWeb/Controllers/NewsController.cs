using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using NeoWeb.Data;
using NeoWeb.Models;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class NewsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IHostingEnvironment _env;

        public NewsController(ApplicationDbContext context, IHostingEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: news/create
        public IActionResult Create()
        {
            return View();
        }

        // POST: news/create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,ChineseTitle,EnglishTitle,Link")] News news,
            IFormFile chineseCover, IFormFile englishCover, string isTop)
        {
            ViewBag.IsTop = isTop != null;
            if (ModelState.IsValid)
            {
                if (chineseCover != null)
                {
                    var fileName = Helper.UploadMedia(chineseCover, _env, 1000);
                    if (Helper.ValidateCover(_env, fileName))
                        news.ChineseCover = fileName;
                    else
                        ModelState.AddModelError("ChineseCover", "Cover size must be 16:9");
                }
                if (englishCover != null)
                {
                    var fileName = Helper.UploadMedia(englishCover, _env, 1000);
                    if (Helper.ValidateCover(_env, fileName))
                        news.ChineseCover = fileName;
                    else
                        ModelState.AddModelError("EnglishCover", "Cover size must be 16:9");
                }
                if (!ModelState.IsValid) return View(news);
                news.Time = DateTime.Now;
                _context.Add(news);
                if (isTop != null)
                {
                    _context.Top.ToList().ForEach(p => _context.Top.Remove(p));
                    _context.Add(new Top() { ItemId = news.Id, Type = DiscoverViewModelType.News });
                }
                await _context.SaveChangesAsync();
                return RedirectToAction("index", "discover", new { type = DiscoverViewModelType.News });
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
        public async Task<IActionResult> Edit(int id, [Bind("Id,ChineseTitle,EnglishTitle,ChineseTags,EnglishTags,Link")] News news,
            IFormFile chineseCover, IFormFile englishCover, string isTop)
        {
            ViewBag.IsTop = isTop != null;
            if (id != news.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                if (chineseCover != null)
                {
                    var fileName = Helper.UploadMedia(chineseCover, _env, 1000);
                    if (Helper.ValidateCover(_env, fileName))
                    {
                        if (!string.IsNullOrEmpty(news.ChineseCover))
                            System.IO.File.Delete(Path.Combine(_env.ContentRootPath, "wwwroot/upload", news.ChineseCover));
                        news.ChineseCover = fileName;
                    }
                    else
                    {
                        ModelState.AddModelError("ChineseCover", "Cover size must be 16:9");
                    }
                }
                if (englishCover != null)
                {
                    var fileName = Helper.UploadMedia(englishCover, _env, 1000);
                    if (Helper.ValidateCover(_env, fileName))
                    {
                        if (!string.IsNullOrEmpty(news.EnglishCover))
                            System.IO.File.Delete(Path.Combine(_env.ContentRootPath, "wwwroot/upload", news.EnglishCover));
                        news.ChineseCover = fileName;
                    }
                    else
                    {
                        ModelState.AddModelError("EnglishCover", "Cover size must be 16:9");
                    }
                }
                if (!ModelState.IsValid) return View(news);
                try
                {
                    if (isTop != null)
                    {
                        _context.Top.ToList().ForEach(p => _context.Top.Remove(p));
                        _context.Add(new Top() { ItemId = news.Id, Type = DiscoverViewModelType.News });
                    }
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
            return RedirectToAction("index", "discover", new { type = DiscoverViewModelType.News });
        }

        private bool NewsExists(int id)
        {
            return _context.News.Any(e => e.Id == id);
        }
    }
}
