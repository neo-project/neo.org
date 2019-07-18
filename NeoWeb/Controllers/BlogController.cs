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
using System.Xml;

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
                        models = _context.Blogs.Where(p => p.ChineseTitle.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.ChineseContent.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.ChineseTags != null && p.ChineseTags.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.EnglishTitle.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.EnglishContent.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.EnglishTags != null && p.EnglishTags.Contains(item, StringComparison.OrdinalIgnoreCase));
                    else
                        models = models.Where(p => p.ChineseTitle.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.ChineseContent.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.ChineseTags != null && p.ChineseTags.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.EnglishTitle.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.EnglishContent.Contains(item, StringComparison.OrdinalIgnoreCase));
                    if (models == null) break;
                }
            }
            if (t != null) //筛选标签
            {
                if (models == null)
                    models = _context.Blogs.Where(p => p.ChineseTags != null && p.ChineseTags.Contains(t, StringComparison.OrdinalIgnoreCase)
                    || p.EnglishTags != null && p.EnglishTags.Contains(t, StringComparison.OrdinalIgnoreCase));
                else
                    models = models.Where(p => p.ChineseTags != null && p.ChineseTags.Contains(t, StringComparison.OrdinalIgnoreCase)
                    || p.EnglishTags != null && p.EnglishTags.Contains(t, StringComparison.OrdinalIgnoreCase));
            }

            if (k == null && t == null)
            {
                models = _context.Blogs;
            }
            models = models.OrderByDescending(o => o.CreateTime).Select(p => new Blog()
            {
                Id = p.Id,
                ChineseTitle = p.ChineseTitle,
                ChineseSummary = p.ChineseSummary,
                ChineseTags = p.ChineseTags,
                EnglishTitle = p.EnglishTitle,
                EnglishSummary = p.EnglishSummary,
                EnglishTags = p.EnglishTags,
                CreateTime = p.CreateTime,
                EditTime = p.EditTime,
                ReadCount = p.ReadCount,
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
            ViewBag.Language = _localizer["en"];
            return View(models);
        }

        // GET: blog/details/5
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Details(int? id, string language = null)
        {
            if (id == null)
            {
                return RedirectToAction("Index");
            }

            var blog = await _context.Blogs.Include(m => m.User)
                .SingleOrDefaultAsync(m => m.Id == id || m.OldId == id);
            if (blog == null || (!blog.IsShow && !_userRules))
            {
                return RedirectToAction("Index");
            }

            #region Previous article and  Next article
            var blogs = _context.Blogs.Select(p => new Blog()
            {
                Id = p.Id,
                CreateTime = p.CreateTime
            }).OrderByDescending(o => o.CreateTime).ToList();

            var idList = blogs.Select(p => p.Id).ToList();
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
                _context.Update(blog);
                await _context.SaveChangesAsync();
            }
            if (!string.IsNullOrEmpty(language))
                ViewBag.Language = language;
            else
                ViewBag.Language = _localizer["en"];
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
        public async Task<IActionResult> Create([Bind("Id,ChineseTitle,ChineseContent,ChineseTags,EnglishTitle,EnglishContent,EnglishTags,IsShow")] Blog blog)
        {
            if (ModelState.IsValid)
            {
                blog.ChineseContent = Convert(blog.ChineseContent);
                blog.EnglishContent = Convert(blog.EnglishContent);
                blog.ChineseSummary = blog.ChineseContent.ClearHtmlTag(150);
                blog.EnglishSummary = blog.EnglishContent.ClearHtmlTag(150);
                blog.ChineseTags = blog.ChineseTags?.Replace(", ", ",").Replace("，", ",").Replace("， ", ",");
                blog.EnglishTags = blog.EnglishTags?.Replace(", ", ",").Replace("，", ",").Replace("， ", ",");
                blog.CreateTime = DateTime.Now;
                blog.EditTime = DateTime.Now;
                blog.User = _context.Users.Find(_userId);
                _context.Add(blog);
                await _context.SaveChangesAsync();
                UpdateRSS();
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
        public async Task<IActionResult> Edit(int id, [Bind("Id,ChineseTitle,ChineseContent,ChineseTags,EnglishTitle,EnglishContent,EnglishTags,IsShow")] Blog blog)
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
                    item.ChineseContent = Convert(blog.ChineseContent);
                    item.EnglishContent = Convert(blog.EnglishContent);
                    item.ChineseSummary = blog.ChineseContent.ClearHtmlTag(150);
                    item.EnglishSummary = blog.EnglishContent.ClearHtmlTag(150);
                    item.ChineseTags = blog.ChineseTags?.Replace(", ", ",").Replace("，", ",").Replace("， ", ",");
                    item.EnglishTags = blog.EnglishTags?.Replace(", ", ",").Replace("，", ",").Replace("， ", ",");
                    item.EditTime = DateTime.Now;
                    item.IsShow = blog.IsShow;
                    _context.Update(item);
                    await _context.SaveChangesAsync();
                    UpdateRSS();
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
        private void UpdateRSS()
        {
            UpdateRssChinese();
            UpdateRssEnglish();
        }

        private void UpdateRssChinese()
        {
            var xml = new XmlDocument();
            XmlDeclaration xmldecl = xml.CreateXmlDeclaration("1.0", "utf-8", null);
            XmlElement root = xml.DocumentElement;
            xml.InsertBefore(xmldecl, root);

            var rss = xml.CreateElement("rss");
            var version = xml.CreateAttribute("version");
            version.Value = "2.0";
            rss.Attributes.Append(version);

            var channel = xml.CreateElement("channel");

            var title = xml.CreateElement("title");
            title.InnerText = "NEO blog posts list";
            channel.AppendChild(title);

            var link = xml.CreateElement("link");
            link.InnerText = "https://neo.org/blog";
            channel.AppendChild(link);

            var pubDate = xml.CreateElement("pubDate");
            pubDate.InnerText = DateTime.Now.ToPubDate();
            channel.AppendChild(pubDate);

            var description = xml.CreateElement("description");
            description.InnerText = "Latest posts from NEO blog";
            channel.AppendChild(description);

            var blogs = _context.Blogs.OrderByDescending(p => p.CreateTime).Take(20).Select(p => new Blog()
            {
                ChineseTitle = XmlEncode(p.ChineseTitle),
                ChineseSummary = XmlEncode(p.ChineseSummary) + "...",
                ChineseTags = XmlEncode(p.ChineseTags),
                Id = p.Id,
                CreateTime = p.CreateTime
            });
            foreach (var blog in blogs)
            {
                var blogItem = xml.CreateElement("item");

                var blogTitle = xml.CreateElement("title");
                blogTitle.InnerText = blog.ChineseTitle;
                blogItem.AppendChild(blogTitle);

                var blogLink = xml.CreateElement("link");
                blogLink.InnerText = $"https://neo.org/blog/details/{blog.Id}?language=zh";
                blogItem.AppendChild(blogLink);

                var blogDescription = xml.CreateElement("description");
                blogDescription.InnerText = blog.ChineseSummary;
                blogItem.AppendChild(blogDescription);

                var category = xml.CreateElement("category");
                category.InnerText = blog.ChineseTags;
                blogItem.AppendChild(category);

                var blogPubDate = xml.CreateElement("pubDate");
                blogPubDate.InnerText = blog.CreateTime.ToPubDate();
                blogItem.AppendChild(blogPubDate);

                channel.AppendChild(blogItem);
            }
            rss.AppendChild(channel);
            xml.AppendChild(rss);
            RssModel.Chinese = xml.OuterXml;
            
        }

        private void UpdateRssEnglish()
        {
            var xml = new XmlDocument();
            XmlDeclaration xmldecl = xml.CreateXmlDeclaration("1.0", "utf-8", null);
            XmlElement root = xml.DocumentElement;
            xml.InsertBefore(xmldecl, root);

            var rss = xml.CreateElement("rss");
            var version = xml.CreateAttribute("version");
            version.Value = "2.0";
            rss.Attributes.Append(version);

            var channel = xml.CreateElement("channel");

            var title = xml.CreateElement("title");
            title.InnerText = "NEO blog posts list";
            channel.AppendChild(title);

            var link = xml.CreateElement("link");
            link.InnerText = "https://neo.org/blog";
            channel.AppendChild(link);

            var pubDate = xml.CreateElement("pubDate");
            pubDate.InnerText = DateTime.Now.ToPubDate();
            channel.AppendChild(pubDate);

            var description = xml.CreateElement("description");
            description.InnerText = "Latest posts from NEO blog";
            channel.AppendChild(description);

            var blogs = _context.Blogs.OrderByDescending(p => p.CreateTime).Take(20).Select(p => new Blog()
            {
                EnglishTitle = XmlEncode(p.EnglishTitle),
                EnglishSummary = XmlEncode(p.EnglishSummary) + "...",
                EnglishTags = XmlEncode(p.EnglishTags),
                Id = p.Id,
                CreateTime = p.CreateTime
            });
            foreach (var blog in blogs)
            {
                var blogItem = xml.CreateElement("item");

                var blogTitle = xml.CreateElement("title");
                blogTitle.InnerText = blog.EnglishTitle;
                blogItem.AppendChild(blogTitle);

                var blogLink = xml.CreateElement("link");
                blogLink.InnerText = $"https://neo.org/blog/details/{blog.Id}?language=en";
                blogItem.AppendChild(blogLink);

                var blogDescription = xml.CreateElement("description");
                blogDescription.InnerText = blog.EnglishSummary;
                blogItem.AppendChild(blogDescription);

                var category = xml.CreateElement("category");
                category.InnerText = blog.EnglishTags;
                blogItem.AppendChild(category);

                var blogPubDate = xml.CreateElement("pubDate");
                blogPubDate.InnerText = blog.CreateTime.ToPubDate();
                blogItem.AppendChild(blogPubDate);

                channel.AppendChild(blogItem);
            }
            rss.AppendChild(channel);
            xml.AppendChild(rss);
            RssModel.English = xml.OuterXml;
        }
        [AllowAnonymous]
        public IActionResult RSS(string language)
        {
            if (string.IsNullOrEmpty(RssModel.Chinese) || string.IsNullOrEmpty(RssModel.English))
                UpdateRSS();
            if (language == "zh")
            {
                return Content(RssModel.Chinese, "text/xml");
            }
            else
            {
                return Content(RssModel.English, "text/xml");
            }
        }

        // POST: blog/upload
        [HttpPost]
        public string Upload(IFormFile file)
        {
            try
            {
                var fileName = Helper.UploadMedia(file, _env);
                Task.Run(() =>
                {
                    var filePath = Path.Combine(_env.ContentRootPath, "wwwroot/upload", fileName);
                    using (Image<Rgba32> image = Image.Load(filePath))
                    {
                        image.Mutate(x => x.Resize(new ResizeOptions
                        {
                            Size = new Size(1000, 1000 * image.Height / image.Width),
                            Mode = ResizeMode.Max
                        }));
                        image.Save(filePath);
                    }
                });
                return $"{{\"location\":\"/upload/{fileName}\"}}";
            }
            catch (ArgumentException)
            {
                Response.StatusCode = 502;
                return "";
            }
        }


        private bool BlogExists(int id)
        {
            return _context.Blogs.Any(e => e.Id == id);
        }

        private string Convert(string input)
        {
            input = Regex.Replace(input, @"<!\-\-\[if gte mso 9\]>[\s\S]*<!\[endif\]\-\->", ""); //删除 ms office 注解
            input = Regex.Replace(input, "src=\".*/upload", "data-original=\"/upload"); //替换上传图片的链接
            input = Regex.Replace(input, "<img src=", "<img data-original="); //替换外部图片的链接
            input = Regex.Replace(input, @"<p>((&nbsp;\s)|(&nbsp;)|\s)+", "<p>"); //删除段首由空格造成的缩进
            input = Regex.Replace(input, @"\sstyle="".*?""", ""); //删除 Style 样式
            input = Regex.Replace(input, @"\sclass="".*?""", ""); //删除 Class 样式
            return input;
        }

        private string XmlEncode(string input)
        {
            return input?.Replace(">", "&gt;").Replace("<", "&lt;").Replace("&", "&amp;").Replace("'", "&apos;").Replace("\"", "&quot;");
        }
    }
}
