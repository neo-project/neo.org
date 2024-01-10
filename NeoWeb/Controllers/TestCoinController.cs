using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using NeoWeb.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Http;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class TestCoinController(ApplicationDbContext context, IStringLocalizer<TestCoinController> localizer, IHttpContextAccessor accessor) : Controller
    {

        // GET: testcoin/List
        public async Task<IActionResult> List(string version)
        {
            var fromDate = DateTime.Now - new TimeSpan(15, 0, 0, 0);
            var result = await context.TestCoins.OrderByDescending(p => p.Time).Where(p => p.Time > fromDate).ToListAsync();
            if (version == "2")
                result = result.Where(p => p.Version == Models.Version.NEO2).ToList();
            else if (version == "3")
                result = result.Where(p => p.Version == Models.Version.NEO3).ToList();
            return View(result);
        }

        // GET: testcoin/details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var testcoin = await context.TestCoins
                .SingleOrDefaultAsync(m => m.Id == id);
            if (testcoin == null)
            {
                return NotFound();
            }

            return View(testcoin);
        }

        // GET: testcoin/apply
        [AllowAnonymous]
        public IActionResult Apply()
        {
            return View();
        }

        // GET: testcoin/completed
        [AllowAnonymous]
        public IActionResult Completed()
        {
            return View();
        }

        // POST: testcoin/create
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Apply([Bind("Id,Name,Email,Phone,QQ,Company,Reason,NeoCount,GasCount,PubKey,Remark,Version")] TestCoin testcoin)
        {
            if (ModelState.IsValid)
            {
                if (context.TestCoins.Any(p => p.PubKey == testcoin.PubKey))
                {
                    ModelState.AddModelError("PubKey", localizer["Please do not repeat the request."]);
                    return View();
                }
                if (!Helper.CCAttack(accessor.HttpContext.Connection.RemoteIpAddress, "testcoin_apply", 86400, 5))
                    return Content("Protecting from overposting attacks now!");
                testcoin.Time = DateTime.Now;
                context.Add(testcoin);
                await context.SaveChangesAsync();
                return View("completed");
            }
            return View(testcoin);
        }

        // GET: testcoin/edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var testcoin = await context.TestCoins.SingleOrDefaultAsync(m => m.Id == id);
            if (testcoin == null)
            {
                return NotFound();
            }
            return View(testcoin);
        }

        // POST: testcoin/edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Remark")] TestCoin testcoin)
        {
            if (id != testcoin.Id)
            {
                return NotFound();
            }
            var item = context.TestCoins.FirstOrDefault(p => p.Id == testcoin.Id);
            if (item != null)
            {
                try
                {
                    item.Remark = testcoin.Remark;
                    context.Update(item);
                    await context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TestCoinExists(testcoin.Id))
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
            return View(testcoin);
        }

        // GET: testcoin/delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var testcoin = await context.TestCoins
                .SingleOrDefaultAsync(m => m.Id == id);
            if (testcoin == null)
            {
                return NotFound();
            }

            return View(testcoin);
        }

        // POST: testcoin/delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var testcoin = await context.TestCoins.SingleOrDefaultAsync(m => m.Id == id);
            context.TestCoins.Remove(testcoin);
            await context.SaveChangesAsync();
            return RedirectToAction(nameof(List));
        }

        private bool TestCoinExists(int id)
        {
            return context.TestCoins.Any(e => e.Id == id);
        }
    }
}
