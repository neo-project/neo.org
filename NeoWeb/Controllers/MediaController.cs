using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using NeoWeb.Models;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class MediaController : Controller
    {
        private readonly ApplicationDbContext _context;

        public MediaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Media
        [AllowAnonymous]
        public async Task<IActionResult> Index()
        {
            return View(await _context.Media.ToListAsync());
        }

        // GET: Media/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Media/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Link")] Media media)
        {
            if (ModelState.IsValid)
            {
                string html;
                try
                {
                    WebClient wc = new WebClient();
                    html = wc.DownloadString(media.Link);

                }
                catch (WebException e)
                {
                    ModelState.AddModelError("Link", "因为无法打开链接（被墙了？），所以不能自动识别");
                    return View(media);
                }
                try
                {
                    var desIndex = html.IndexOf("twitter:description\" content=\"");
                    var description = html.Substring(desIndex + 30, html.IndexOf(">", desIndex) - desIndex - 30).TrimEnd(new char[] { ' ', '"', '\\', '/' });
                    var titIndex = html.IndexOf("twitter:title\" content=\"");
                    var title = html.Substring(titIndex + 24, html.IndexOf(">", titIndex) - titIndex - 24).TrimEnd(new char[] { ' ', '"', '\\', '/' });
                    var imgIndex = html.IndexOf("twitter:image\" content=\"");
                    var image = html.Substring(imgIndex + 24, html.IndexOf(">", imgIndex) - imgIndex - 24).TrimEnd(new char[] { ' ', '"', '\\', '/' });
                    media.Title = title;
                    media.Image = image;
                    media.Description = description;
                    _context.Add(media);
                }
                catch (Exception)
                {
                    ModelState.AddModelError("Link", "未能自动抓取标题、简介及封面图片。");
                    return View(media);
                }
                
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(media);
        }

        // GET: Media/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var media = await _context.Media.SingleOrDefaultAsync(m => m.Id == id);
            if (media == null)
            {
                return NotFound();
            }
            return View(media);
        }

        // POST: Media/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Link")] Media media)
        {
            if (id != media.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(media);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MediaExists(media.Id))
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
            return View(media);
        }

        // GET: Media/Delete/5
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

        // POST: Media/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var media = await _context.Media.SingleOrDefaultAsync(m => m.Id == id);
            _context.Media.Remove(media);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MediaExists(int id)
        {
            return _context.Media.Any(e => e.Id == id);
        }
    }
}
