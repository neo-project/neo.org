using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using NeoWeb.Models;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CareersController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly string _userId;
        private readonly bool _userRules;

        public  CareersController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (_userId != null)
            {
                _userRules = _context.UserRoles.Any(p => p.UserId == _userId);
            }
        }

        // GET: careers
        [HttpGet]
        //[AllowAnonymous]
        public IActionResult Index()
        {
            IQueryable<Careers> models = null;
            models = _context.Careers.Select(p => new Careers()
            {
                Id = p.Id,
                Title = p.Title,
                Lang = p.Title.GetLanguage(),
                IsShow = p.IsShow,
                Type = p.Type,
                Description = p.Description
            });
            ViewBag.UserRules = _userRules;
            return View(models);
        }

        // GET: careers/create
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: careers/create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Title,Lang,IsShow,Type,Description")] Careers careers)
        {
            if (ModelState.IsValid)
            {
                careers.Description = Convert(careers.Description);
                _context.Add(careers);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(careers);
        }

        // GET: careers/edit/5
        public IActionResult Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var careers = _context.Careers.SingleOrDefault(m => m.Id == id);
            if (careers == null)
            {
                return NotFound();
            }
            return View(careers);
        }

        // POST: careers/edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Title,Lang,IsShow,Type,Description")] Careers careers)
        {
            if (id != careers.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    careers.Description = Convert(careers.Description);
                    _context.Update(careers);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CareerExists(careers.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Index");
            }
            return View(careers);
        }

        private bool CareerExists(int id)
        {
            return _context.Careers.Any(e => e.Id == id);
        }

        private string Convert(string input)
        {
            input = input.Replace("\r\n", "<br/>"); 
            return input;
        }
    }
}
