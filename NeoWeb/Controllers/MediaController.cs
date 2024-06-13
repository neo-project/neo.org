using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using NeoWeb.Models;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class MediaController(ApplicationDbContext context, IWebHostEnvironment env) : Controller
    {
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
                    var fileName = Helper.UploadMedia(chineseCover, env, 1000);
                    if (Helper.ValidateCover(env, fileName))
                        media.ChineseCover = fileName;
                    else
                        ModelState.AddModelError("ChineseCover", "Cover size must be 16:9");
                }
                if (englishCover != null)
                {
                    var fileName = Helper.UploadMedia(englishCover, env, 1000);
                    if (Helper.ValidateCover(env, fileName))
                        media.EnglishCover = fileName;
                    else
                        ModelState.AddModelError("EnglishCover", "Cover size must be 16:9");
                }
                if (!ModelState.IsValid) return View(media);
                media.Link = Helper.Sanitizer(media.Link);
                media.Time = DateTime.Now;
                context.Add(media);
                await context.SaveChangesAsync();
                if (isTop != null)
                {
                    context.Top.ToList().ForEach(p => context.Top.Remove(p));
                    context.Add(new Top() { ItemId = media.Id, Type = NewsViewModelType.Media });
                }
                await context.SaveChangesAsync();
                return RedirectToAction("index", "news", new { type = NewsViewModelType.Media });
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

            var meida = await context.Media.SingleOrDefaultAsync(m => m.Id == id);
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
                    var fileName = Helper.UploadMedia(chineseCover, env, 1000);
                    if (Helper.ValidateCover(env, fileName))
                    {
                        if (!string.IsNullOrEmpty(media.ChineseCover))
                            System.IO.File.Delete(Path.Combine(env.ContentRootPath, "wwwroot/upload", media.ChineseCover));
                        media.ChineseCover = fileName;
                    }
                    else
                    {
                        ModelState.AddModelError("ChineseCover", "Cover size must be 16:9");
                    }
                }
                if (englishCover != null)
                {
                    var fileName = Helper.UploadMedia(englishCover, env, 1000);
                    if (Helper.ValidateCover(env, fileName))
                    {
                        if (!string.IsNullOrEmpty(media.EnglishCover))
                            System.IO.File.Delete(Path.Combine(env.ContentRootPath, "wwwroot/upload", media.EnglishCover));
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
                        context.Top.ToList().ForEach(p => context.Top.Remove(p));
                        context.Add(new Top() { ItemId = media.Id, Type = NewsViewModelType.Media });
                    }
                    media.Link = Helper.Sanitizer(media.Link);
                    context.Update(media);
                    await context.SaveChangesAsync();
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
                return RedirectToAction("index", "news", new { type = NewsViewModelType.Media });
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

            var media = await context.Media
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
            var media = await context.Media.SingleOrDefaultAsync(m => m.Id == id);
            context.Media.Remove(media);
            await context.SaveChangesAsync();
            return RedirectToAction("index", "news", new { type = NewsViewModelType.Media });
        }

        private bool NewsExists(int id)
        {
            return context.Media.Any(e => e.Id == id);
        }
    }
}
