using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using NeoWeb.Models;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;
using SixLabors.ImageSharp.PixelFormats;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Hosting;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class BlogController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly string _userId;
        private readonly bool _userRules;
        private readonly IStringLocalizer<BlogController> _localizer;
        private readonly IHostingEnvironment _env;

        public BlogController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IStringLocalizer<BlogController> localizer, IHostingEnvironment env)
        {
            _context = context;
            _localizer = localizer;
            _userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            _env = env;
            if (_userId != null)
            {
                _userRules = _context.UserRoles.Any(p => p.UserId == _userId);
                var asfs = _context.UserRoles.Where(p => p.UserId == _userId).ToList();
            }
        }

        // GET: blog
        [AllowAnonymous]
        public IActionResult Index(int? y = null, int? m = null, string k = null, string t = null)
        {
            IQueryable<Blog> models = null;

            if (k != null) //搜索，显示所有语言博客
            {
                var keywords = k.Split(" ");
                foreach (var item in keywords) //对关键词进行搜索
                {
                    if (models == null)
                        models = _context.Blogs.Where(p => p.Title.Contains(item, StringComparison.OrdinalIgnoreCase) || p.Content.Contains(item, StringComparison.OrdinalIgnoreCase) || p.Tags != null && p.Tags.Contains(item, StringComparison.OrdinalIgnoreCase));
                    else
                        models = models.Where(p => p.Title.Contains(item, StringComparison.OrdinalIgnoreCase) || p.Content.Contains(item, StringComparison.OrdinalIgnoreCase) || p.Tags != null && p.Tags.Contains(item, StringComparison.OrdinalIgnoreCase));
                    if (models == null) break;
                }
            }
            if (t != null) //筛选标签
            {
                if (models == null)
                    models = _context.Blogs.Where(p => p.Tags != null && p.Tags.Contains(t, StringComparison.OrdinalIgnoreCase));
                else
                    models = models.Where(p => p.Tags != null && p.Tags.Contains(t, StringComparison.OrdinalIgnoreCase));
            }
            if (k == null && t == null) //仅显示当前语言博客，有搜索或标签的除外
            {
                models = _context.Blogs.Where(p => p.Lang == _localizer["en"]);
            }
            models = models.OrderByDescending(o => o.CreateTime).Select(p => new Blog()
            {
                Id = p.Id,
                Title = p.Title,
                Summary = p.Summary,
                CreateTime = p.CreateTime,
                EditTime = p.EditTime,
                ReadCount = p.ReadCount,
                Tags = p.Tags,
                Lang = p.Lang,
                User = p.User,
                IsShow = p.IsShow
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
            models = models.Take(30);
            ViewBag.UserRules = _userRules;
            return View(models);
        }

        // GET: blog/details/5
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return RedirectToAction("Index");
            }

            var blog = await _context.Blogs.Include(m => m.User)
                .SingleOrDefaultAsync(m => m.Id == id);
            if (blog == null || (!blog.IsShow && !_userRules))
            {
                return RedirectToAction("Index");
            }

            #region Previous article and  Next article
            var blogs = _context.Blogs.OrderByDescending(o => o.CreateTime).Select(p => new Blog()
            {
                Id = p.Id,
                CreateTime = p.CreateTime,
                Lang = p.Lang
            });

            var idList = blogs.Where(p => p.Lang == _localizer["en"]).Select(p => p.Id).ToList();

            if (idList.Count == 0)
            {
                ViewBag.NextBlogId = blog.Id;
                ViewBag.PrevBlogId = blog.Id;
            }
            else
            {
                ViewBag.NextBlogId = idList[Math.Max(idList.IndexOf((int)id) - 1, 0)];
                ViewBag.PrevBlogId = idList[Math.Min(idList.IndexOf((int)id) + 1, idList.Count - 1)];
            }
            #endregion

            if (!_userRules && blog.Lang != _localizer["en"] && blog.BrotherBlogId != null)
            {
                var brotherBlog = _context.Blogs.FirstOrDefault(p => p.Id == blog.BrotherBlogId);
                if (brotherBlog != null && brotherBlog.IsShow)
                {
                    blog.Title = brotherBlog.Title;
                    blog.Summary = brotherBlog.Summary;
                    blog.Content = brotherBlog.Content;
                }
            }

            ViewBag.CreateTime = blogs.Select(p => new BlogDateTimeViewModels
            {
                Year = p.CreateTime.Year,
                Month = p.CreateTime.Month
            }).Distinct();

            ViewBag.UserId = _userId;
            ViewBag.UserRules = _userRules;

            if (blog.ReadCount < int.MaxValue && string.IsNullOrEmpty(Request.Cookies[blog.Id.ToString()]) && Request.Cookies.Count >= 1)
            {
                blog.ReadCount++;
                await _context.SaveChangesAsync();
            }

            var content = blog.Content.Replace("<div>", "").Replace("<p>", "");
            var match = Regex.Match(content, "\\A\\W*<img.*/>");
            if (match.Success && match.Value.Length > 0)
            {
                ViewBag.Cover = match.Value.Insert(4, " class=\"img-cover\" ");
                blog.Content = blog.Content.Replace(match.Value, "");
            }

            return View(blog);
        }

        // GET: Blog/Create
        public IActionResult Create()
        {
            return View();
        }
        // POST: blog/create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Title,Content,BrotherBlogId,Summary,IsShow,Tags")] Blog blog)
        {
            if (ModelState.IsValid)
            {
                //Verify same content blog in other languages
                if (blog.BrotherBlogId != null)
                {
                    var brotherBlog = _context.Blogs.FirstOrDefault(p => p.Id == blog.BrotherBlogId);
                    if (brotherBlog == null)
                    {
                        ModelState.AddModelError("BrotherBlogId", "This blog does not exist!");
                        return View(blog);
                    }
                }

                blog.Content = Convert(blog.Content);
                blog.Summary = blog.Content.ClearHtmlTag(150);
                blog.CreateTime = DateTime.Now;
                blog.EditTime = DateTime.Now;
                blog.Lang = GetLanguage(blog);
                blog.User = _context.Users.Find(_userId);
                blog.Tags = blog.Tags?.Replace(", ",",").Replace("，", ",").Replace("， ", ",");
                _context.Add(blog);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(blog);
        }

        private string GetLanguage(Blog blog)
        {
            Regex regChina = new Regex("[\u4e00-\u9fa5]");
            return regChina.IsMatch(blog.Title + blog.Content) ? "zh" : "en";
        }

        // GET: blog/edit/5
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

        // POST: blog/edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Title,Content,BrotherBlogId,IsShow,Tags")] Blog blog)
        {
            if (id != blog.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                //Verify same content blog in other languages
                if (blog.BrotherBlogId != null)
                {
                    var brotherBlog = _context.Blogs.FirstOrDefault(p => p.Id == blog.BrotherBlogId);
                    if (brotherBlog == null)
                    {
                        ModelState.AddModelError("BrotherBlogId", "This blog does not exist!");
                        return View(blog);
                    }
                }

                var item = _context.Blogs.FirstOrDefault(p => p.Id == blog.Id);
                try
                {
                    item.Title = blog.Title;
                    item.Content = Convert(blog.Content);
                    item.Summary = blog.Content.ClearHtmlTag(150);
                    item.Lang = GetLanguage(blog);
                    item.IsShow = blog.IsShow;
                    item.EditTime = DateTime.Now;
                    item.Tags = blog.Tags?.Replace(", ", ",").Replace("，", ",").Replace("， ", ",");
                    item.BrotherBlogId = blog.BrotherBlogId;
                    _context.Update(item);
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
                return RedirectToAction("Details", new { id });
            }
            return View(blog);
        }

        // GET: blog/delete/5
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

        // POST: blog/delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var blog = await _context.Blogs.SingleOrDefaultAsync(m => m.Id == id);
            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        // POST: blog/upload
        [HttpPost]
        public string Upload(IFormFile file)
        {
            var fileName = Helper.UploadMedia(file, _env);
            Task.Run(() => {
                var filePath = Path.Combine(_env.ContentRootPath, "wwwroot/upload", fileName);
                using (Image<Rgba32> image = Image.Load(filePath))
                {
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Size = new Size(1600, 1600 * image.Height / image.Width),
                        Mode = ResizeMode.Max
                    }));
                    image.Save(filePath);
                }
            });
            return $"{{\"location\":\"/upload/{fileName}\"}}";
        }


        private bool BlogExists(int id)
        {
            return _context.Blogs.Any(e => e.Id == id);
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
