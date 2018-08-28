using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using NeoWeb.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CareersController : Controller
    {
        private readonly ApplicationDbContext _context;
        private string _userId;
        private bool _userRules;

        public  CareersController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (_userId != null)
            {
                _userRules = _context.UserRoles.Any(p => p.UserId == _userId);
            }
        }

        [AllowAnonymous]
        public IActionResult Index()
        {
            IQueryable<Careers> models = null;
            models = _context.Careers.Select(p => new Careers()
            {
                Id = p.Id,
                Title = p.Title,
                Lang = p.Lang,
                IsShow = p.IsShow,
                Type = p.Type,
                Description = p.Description
            });
            ViewBag.UserRules = _userRules;
            return View(models);
        }

        // GET: Careers/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Careers/Create
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

        // GET: Careers/Edit/5
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

        // POST: Careers/Edit/5
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
                var item = _context.Careers.FirstOrDefault(p => p.Id == careers.Id);
                try
                {
                    item.Title = careers.Title;
                    item.Lang = careers.Lang;
                    item.IsShow = careers.IsShow;
                    item.Type = careers.Type;
                    item.Description = Convert(careers.Description);
                    _context.Update(item);
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
            input = Regex.Replace(input, @"<!\-\-\[if gte mso 9\]>[\s\S]*<!\[endif\]\-\->", ""); //删除 ms office 注解
            input = Regex.Replace(input, "src=\".*/upload", "src=\"/upload"); //替换上传图片的链接
            input = Regex.Replace(input, @"<p>((&nbsp;\s)|(&nbsp;)|\s)+", "<p>"); //删除段首由空格造成的缩进
            input = Regex.Replace(input, @"\sstyle="".*?""", ""); //删除 Style 样式
            input = Regex.Replace(input, @"\sclass="".*?""", ""); //删除 Class 样式
            return input;
        }
    }
}
