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
    public class MediaController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public MediaController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: media/create
        public IActionResult Create()
        {
            return View();
        }

        // POST: media/create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,ChineseTitle,EnglishTitle,Link")] Media media,
            IFormFile chineseCover, IFormFile englishCover, string isTop)
        {
            ViewBag.IsTop = isTop != null;
            if (ModelState.IsValid)
            {
                if (chineseCover != null)
                {
                    var fileName = Helper.UploadMedia(chineseCover, _env, 1000);
                    if (Helper.ValidateCover(_env, fileName))
                        media.ChineseCover = fileName;
                    else
                        ModelState.AddModelError("ChineseCover", "Cover size must be 16:9");
                }
                if (englishCover != null)
                {
                    var fileName = Helper.UploadMedia(englishCover, _env, 1000);
                    if (Helper.ValidateCover(_env, fileName))
                        media.EnglishCover = fileName;
                    else
                        ModelState.AddModelError("EnglishCover", "Cover size must be 16:9");
                }
                if (!ModelState.IsValid) return View(media);
                media.Time = DateTime.Now;
                _context.Add(media);
                await _context.SaveChangesAsync();
                if (isTop != null)
                {
                    _context.Top.ToList().ForEach(p => _context.Top.Remove(p));
                    _context.Add(new Top() { ItemId = media.Id, Type = DiscoverViewModelType.Media });
                }
                await _context.SaveChangesAsync();
                return RedirectToAction("index", "discover", new { type = DiscoverViewModelType.Media });
            }
            return View(media);
        }

        // GET: media/edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var meida = await _context.Media.SingleOrDefaultAsync(m => m.Id == id);
            if (meida == null)
            {
                return NotFound();
            }
            return View(meida);
        }

        // POST: media/edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,ChineseTitle,EnglishTitle,ChineseTags,EnglishTags,Link")] Media media,
            IFormFile chineseCover, IFormFile englishCover, string isTop)
        {
            ViewBag.IsTop = isTop != null;
            if (id != media.Id)
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
                        if (!string.IsNullOrEmpty(media.ChineseCover))
                            System.IO.File.Delete(Path.Combine(_env.ContentRootPath, "wwwroot/upload", media.ChineseCover));
                        media.ChineseCover = fileName;
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
                        if (!string.IsNullOrEmpty(media.EnglishCover))
                            System.IO.File.Delete(Path.Combine(_env.ContentRootPath, "wwwroot/upload", media.EnglishCover));
                        media.EnglishCover = fileName;
                    }
                    else
                    {
                        ModelState.AddModelError("EnglishCover", "Cover size must be 16:9");
                    }
                }
                if (!ModelState.IsValid) return View(media);
                try
                {
                    if (isTop != null)
                    {
                        _context.Top.ToList().ForEach(p => _context.Top.Remove(p));
                        _context.Add(new Top() { ItemId = media.Id, Type = DiscoverViewModelType.Media });
                    }
                    _context.Update(media);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!NewsExists(media.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("index", "discover", new { type = DiscoverViewModelType.Media });
            }
            return View(media);
        }

        // GET: media/delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var media = await _context.Media
                .SingleOrDefaultAsync(m => m.Id == id);
            if (media == null)
            {
                return NotFound();
            }

            return View(media);
        }

        // POST: media/delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var media = await _context.Media.SingleOrDefaultAsync(m => m.Id == id);
            _context.Media.Remove(media);
            await _context.SaveChangesAsync();
            return RedirectToAction("index", "discover", new { type = DiscoverViewModelType.Media });
        }

        private bool NewsExists(int id)
        {
            return _context.Media.Any(e => e.Id == id);
        }
    }
}
