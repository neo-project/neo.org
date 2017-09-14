using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using NeoWeb.Models;
using Microsoft.AspNetCore.Authorization;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class TestnetController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TestnetController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Testnet
        public async Task<IActionResult> Index()
        {
            return View(await _context.Testnets.ToListAsync());
        }

        // GET: Testnet/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var testnet = await _context.Testnets
                .SingleOrDefaultAsync(m => m.Id == id);
            if (testnet == null)
            {
                return NotFound();
            }

            return View(testnet);
        }

        // GET: Testnet/Create
        [AllowAnonymous]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Testnet/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,Email,Phone,QQ,Company,Reason,ANSCount,ANCCount,PubKey,Remark")] Testnet testnet)
        {
            if (ModelState.IsValid)
            {
                _context.Add(testnet);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(testnet);
        }

        // GET: Testnet/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var testnet = await _context.Testnets.SingleOrDefaultAsync(m => m.Id == id);
            if (testnet == null)
            {
                return NotFound();
            }
            return View(testnet);
        }

        // POST: Testnet/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Email,Phone,QQ,Company,Reason,ANSCount,ANCCount,PubKey,Remark")] Testnet testnet)
        {
            if (id != testnet.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(testnet);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TestnetExists(testnet.Id))
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
            return View(testnet);
        }

        // GET: Testnet/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var testnet = await _context.Testnets
                .SingleOrDefaultAsync(m => m.Id == id);
            if (testnet == null)
            {
                return NotFound();
            }

            return View(testnet);
        }

        // POST: Testnet/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var testnet = await _context.Testnets.SingleOrDefaultAsync(m => m.Id == id);
            _context.Testnets.Remove(testnet);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool TestnetExists(int id)
        {
            return _context.Testnets.Any(e => e.Id == id);
        }
    }
}
