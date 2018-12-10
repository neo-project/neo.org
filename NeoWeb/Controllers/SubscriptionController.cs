using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using NeoWeb.Models;

namespace NeoWeb.Controllers
{
    public class SubscriptionController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _accessor;

        public SubscriptionController(ApplicationDbContext context, IHttpContextAccessor accessor)
        {
            _context = context;
            _accessor = accessor;
        }

        // GET: subscription
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Index()
        {
            return View(await _context.Subscription.ToListAsync());
        }

        [HttpGet]
        [HttpPost]
        public string Add([Bind("Email")] Subscription subscription)
        {
            if (ModelState.IsValid)
            {
                if (!Helper.CCAttack(_accessor.HttpContext.Connection.RemoteIpAddress, "consensus_post", 3600, 10))
                    return "Protecting from overposting attacks now!";
                subscription.IsSubscription = true;
                subscription.SubscriptionTime = DateTime.Now;
                if (_context.Subscription.Any(e => e.Email == subscription.Email))
                    return "true";
                _context.Add(subscription);
                _context.SaveChanges();
                return "true";
            }
            return "false";
        }
    }
}
