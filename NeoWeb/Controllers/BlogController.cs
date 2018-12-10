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

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class BlogController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly string _userId;
        private readonly bool _userRules;
        private readonly IStringLocalizer<BlogController> _localizer;

        public BlogController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IStringLocalizer<BlogController> localizer)
        {
            _context = context;
            _localizer = localizer;
            _userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (_userId != null)
            {
                _userRules = _context.UserRoles.Any(p => p.UserId == _userId);
            }
        }

        // GET: blog
        [AllowAnonymous]
        public IActionResult Index(int? y = null, int? m = null, string k = null, string t = null)
        {
            IQueryable<Blog> models = null;

            if (k != null) //��������ʾ�������Բ���
            {
                var keywords = k.Split(" ");
                foreach (var item in keywords) //�Թؼ��ʽ�������
                {
                    if (models == null)
                        models = _context.Blogs.Where(p => p.Title.Contains(item, StringComparison.OrdinalIgnoreCase) || p.Content.Contains(item, StringComparison.OrdinalIgnoreCase) || p.Tags != null && p.Tags.Contains(item, StringComparison.OrdinalIgnoreCase));
                    else
                        models = models.Where(p => p.Title.Contains(item, StringComparison.OrdinalIgnoreCase) || p.Content.Contains(item, StringComparison.OrdinalIgnoreCase) || p.Tags != null && p.Tags.Contains(item, StringComparison.OrdinalIgnoreCase));
                    if (models == null) break;
                }
            }
            if (t != null) //ɸѡ��ǩ
            {
                if (models == null)
                    models = _context.Blogs.Where(p => p.Tags != null && p.Tags.Contains(t, StringComparison.OrdinalIgnoreCase));
                else
                    models = models.Where(p => p.Tags != null && p.Tags.Contains(t, StringComparison.OrdinalIgnoreCase));
            }
            if (k == null && t == null) //����ʾ��ǰ���Բ��ͣ����������ǩ�ĳ���
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
            if (blog == null)
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

            ViewBag.UserId = _userId;
            ViewBag.UserRules = _userRules;
            
            if(string.IsNullOrEmpty(Request.Cookies[blog.Id.ToString()]))
            {
                blog.ReadCount++;
            }
            await _context.SaveChangesAsync();

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
        public async Task<IActionResult> Create([Bind("Id,Title,Content,Summary,Lang,IsShow,Tags")] Blog blog)
        {
            if (ModelState.IsValid)
            {
                blog.Content = Convert(blog.Content);
                blog.Summary = blog.Content.ClearHtmlTag(150);
                blog.CreateTime = DateTime.Now;
                blog.EditTime = DateTime.Now;
                blog.User = _context.Users.Find(_userId);
                blog.Tags = blog.Tags?.Replace(", ",",").Replace("��", ",").Replace("�� ", ",");
                _context.Add(blog);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(blog);
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
        public async Task<IActionResult> Edit(int id, [Bind("Id,Title,Lang,Content,IsShow,Tags")] Blog blog)
        {
            if (id != blog.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                var item = _context.Blogs.FirstOrDefault(p => p.Id == blog.Id);
                try
                {
                    item.Title = blog.Title;
                    item.Content = Convert(blog.Content);
                    item.Summary = blog.Content.ClearHtmlTag(150);
                    item.Lang = blog.Lang;
                    item.IsShow = blog.IsShow;
                    item.EditTime = DateTime.Now;
                    item.Tags = blog.Tags?.Replace(", ", ",").Replace("��", ",").Replace("�� ", ",");
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

            using (Image<Rgba32> image = Image.Load(filePath))
            {
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new Size(1600, 1600 * image.Height / image.Width),
                    Mode = ResizeMode.Max
                }));
                image.Save(filePath);
            }
            return $"{{\"location\":\"/upload/{newName}\"}}";
        }


        private bool BlogExists(int id)
        {
            return _context.Blogs.Any(e => e.Id == id);
        }

        private string Convert(string input)
        {
            input = Regex.Replace(input, @"<!\-\-\[if gte mso 9\]>[\s\S]*<!\[endif\]\-\->", ""); //ɾ�� ms office ע��
            input = Regex.Replace(input, "src=\".*/upload", "src=\"/upload"); //�滻�ϴ�ͼƬ������
            input = Regex.Replace(input, @"<p>((&nbsp;\s)|(&nbsp;)|\s)+", "<p>"); //ɾ�������ɿո���ɵ�����
            input = Regex.Replace(input, @"\sstyle="".*?""", ""); //ɾ�� Style ��ʽ
            input = Regex.Replace(input, @"\sclass="".*?""", ""); //ɾ�� Class ��ʽ
            return input;
        }
    }
}
