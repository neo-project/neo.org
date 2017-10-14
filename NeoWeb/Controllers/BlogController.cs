using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using NeoWeb.Models;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.IO;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class BlogController : Controller
    {
        private readonly ApplicationDbContext _context;
        private string _userId;

        public BlogController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        // GET: Blog
        [AllowAnonymous]
        public IActionResult Index(int? y = null, int? m = null)
        {
            var models = _context.Blogs.OrderByDescending(o => o.CreateTime).Select(p => new
            {
                p.Id,
                p.Title,
                p.Summary,
                p.CreateTime,
                p.EditTime,
                p.ReadCount,
                p.Lang
            }).ToList().Select(p => new Blog()
            {
                Id = p.Id,
                Title = p.Title,
                Summary = p.Summary,
                CreateTime = p.CreateTime,
                EditTime = p.EditTime,
                ReadCount = p.ReadCount,
                Lang = p.Lang
            });

            ViewBag.CreateTime = models.Select(p => new BlogDateTimeViewModels
            {
                Year = p.CreateTime.Year,
                Month = p.CreateTime.Month
            }).Distinct();

            if (y != null)
            {
                models = models.Where(p => p.CreateTime.Year == y);
                if (m != null)
                {
                    models = models.Where(p => p.CreateTime.Month == m);
                }
            }
            else
            {
                models = models.Take(30);
            }
            return View(models);
        }

        // GET: Blog/Details/5
        [AllowAnonymous]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return RedirectToAction("Index");
            }

            var blogs = _context.Blogs.OrderByDescending(o => o.CreateTime).Select(p => new
            {
                p.Id,
                p.CreateTime
            }).ToList().Select(p => new Blog()
            {
                Id = p.Id,
                CreateTime = p.CreateTime
            });

            var idList = blogs.Select(p => p.Id).ToList();
            ViewBag.NextBlogId = idList[Math.Max(idList.IndexOf((int)id) - 1, 0)];
            ViewBag.PrevBlogId = idList[Math.Min(idList.IndexOf((int)id) + 1, idList.Count - 1)];

            ViewBag.CreateTime = blogs.Select(p => new BlogDateTimeViewModels
            {
                Year = p.CreateTime.Year,
                Month = p.CreateTime.Month
            }).Distinct();

            var blog = await _context.Blogs.Include(m => m.User)
                .SingleOrDefaultAsync(m => m.Id == id);
            ViewBag.UserId = _userId;
            if (blog == null)
            {
                return NotFound();
            }

            var match = Regex.Match(blog.Content, "<img.*/>");
            if (match.Success && match.Value.Length > 0)
            {
                ViewBag.Cover = match.Value.Insert(4, " class=\"img-cover\" ");
            }

            return View(blog);
        }

        // GET: Blog/Create

        public IActionResult Create()
        {
            return View();
        }
        // POST: Blog/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Title,Content,Summary,Lang")] Blog blog)
        {
            if (ModelState.IsValid)
            {
                blog.Content = Convert(blog.Content);
                blog.Summary = blog.Content.ClearHtmlTag(150);
                blog.CreateTime = DateTime.Now;
                blog.EditTime = DateTime.Now;
                blog.User = _context.Users.Find(_userId);
                _context.Add(blog);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(blog);
        }

        // GET: Blog/Edit/5
        public IActionResult Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var blog = _context.Blogs.SingleOrDefault(m => m.Id == id);
            if (blog == null)
            {
                return NotFound();
            }
            return View(blog);
        }

        // POST: Blog/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Title,Content,Summary,Lang,CreateTime,EditTime,ReadCount")] Blog blog)
        {
            if (id != blog.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    blog.Content = Convert(blog.Content);
                    blog.Summary = blog.Content.ClearHtmlTag(150);
                    blog.EditTime = DateTime.Now;
                    _context.Update(blog);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BlogExists(blog.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Details", new { id = id });
            }
            return View(blog);
        }

        // GET: Blog/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var blog = await _context.Blogs
                .SingleOrDefaultAsync(m => m.Id == id);
            if (blog == null)
            {
                return NotFound();
            }

            return View(blog);
        }

        // POST: Blog/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var blog = await _context.Blogs.SingleOrDefaultAsync(m => m.Id == id);
            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        // POST: Blog/Upload
        [HttpPost]
        public string Upload(IFormFile file)
        {
            var random = new Random();
            var bytes = new byte[10];
            random.NextBytes(bytes);
            var newName = bytes.ToHexString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/upload", newName);

            if (file.Length > 0)
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
            }
            return $"{{\"location\":\"/upload/{newName}\"}}";
        }


        private bool BlogExists(int id)
        {
            return _context.Blogs.Any(e => e.Id == id);
        }

        private string Convert(string input)
        {
            var deleteMso = Regex.Replace(input, @"<!\-\-\[if gte mso 9\]>[\s\S]*<!\[endif\]\-\->", "");
            var deleteRel = Regex.Replace(deleteMso, "src=\".*/upload", "src=\"/upload");
            return deleteRel;
        }
    }
}
