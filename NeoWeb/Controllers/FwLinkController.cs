using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using NeoWeb.Models;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class FwLinkController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly string _userId;

        public FwLinkController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        // GET: FwLink
        [AllowAnonymous]
        public IActionResult Index(int id)
        {
            var link = _context.FwLInk.FirstOrDefault(p => p.Id == id);
            if (link == null)
                return RedirectToAction("Index", "Home");
            return Redirect(link.Link);
        }

        public async Task<IActionResult> List()
        {
            return View(await _context.FwLInk.ToListAsync());
        }

        // GET: FwLink/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: FwLink/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Link,Name")] FwLink fwLink)
        {
            if (ModelState.IsValid)
            {
                if (_context.FwLInk.Any(p => p.Id != fwLink.Id && p.Link == fwLink.Link))
                {
                    ModelState.AddModelError("Link", "链接已存在");
                    return View(fwLink);
                }
                if (_context.FwLInk.Any(p => p.Id != fwLink.Id && p.Name == fwLink.Name))
                {
                    ModelState.AddModelError("Name", "链接名称已存在");
                    return View(fwLink);
                }
                fwLink.User = _context.Users.Find(_userId);
                fwLink.CreateTime = DateTime.Now;
                fwLink.EditTime = fwLink.CreateTime;
                _context.Add(fwLink);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(List));
            }
            return View(fwLink);
        }

        // GET: FwLink/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var fwLink = await _context.FwLInk.FindAsync(id);
            if (fwLink == null)
            {
                return NotFound();
            }
            return View(fwLink);
        }

        // POST: FwLink/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Link,Name")] FwLink fwLink)
        {
            if (id != fwLink.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                if (_context.FwLInk.Any(p => p.Id != fwLink.Id && p.Link == fwLink.Link))
                {
                    ModelState.AddModelError("Link", "链接已存在");
                    return View(fwLink);
                }
                if (_context.FwLInk.Any(p => p.Id != fwLink.Id && p.Name == fwLink.Name))
                {
                    ModelState.AddModelError("Name", "链接名称已存在");
                    return View(fwLink);
                }
                var item = _context.FwLInk.FirstOrDefault(p => p.Id == fwLink.Id);
                try
                {
                    item.Link = fwLink.Link;
                    item.Name = fwLink.Name;
                    item.EditTime = DateTime.Now;
                    _context.Update(item);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!FwLinkExists(fwLink.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(List));
            }
            return View(fwLink);
        }

        // GET: FwLink/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var fwLink = await _context.FwLInk
                .FirstOrDefaultAsync(m => m.Id == id);
            if (fwLink == null)
            {
                return NotFound();
            }

            return View(fwLink);
        }

        // POST: FwLink/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var fwLink = await _context.FwLInk.FindAsync(id);
            _context.FwLInk.Remove(fwLink);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(List));
        }

        private bool FwLinkExists(int id)
        {
            return _context.FwLInk.Any(e => e.Id == id);
        }
    }
}
