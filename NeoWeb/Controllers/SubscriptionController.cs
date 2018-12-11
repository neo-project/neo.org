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
                if (_context.Subscription.Any(e => e.Email == subscription.Email))
                    return "Email has been submitted, do not repeat the submission."; //重复提交
                if (!Helper.CCAttack(_accessor.HttpContext.Connection.RemoteIpAddress, "consensus_post", 3600, 10))
                    return "Protecting from overposting attacks now!"; //IP被禁止访问
                subscription.IsSubscription = true;
                subscription.SubscriptionTime = DateTime.Now;
                _context.Add(subscription);
                _context.SaveChanges();
                return "Email sucessfully sumbitted!"; //成功
            }
            return "Please check your email format and entry again."; //格式错误
        }
    }
}
