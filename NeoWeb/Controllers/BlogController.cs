using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using NeoWeb.Data;
using NeoWeb.Models;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class BlogController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly string _userId;
        private readonly bool _userRules;
        private readonly IWebHostEnvironment _env;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;

        public BlogController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IStringLocalizer<SharedResource> sharedLocalizer, IWebHostEnvironment env)
        {
            _context = context;
            _sharedLocalizer = sharedLocalizer;
            _userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            _env = env;
            if (_userId != null)
            {
                _userRules = _context.UserRoles.Any(p => p.UserId == _userId);
                var asfs = _context.UserRoles.Where(p => p.UserId == _userId).ToList();
            }
        }

        // GET: blog/details/5
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Details(int? id, string language = null)
        {
            if (id == null)
            {
                return NotFound();
            }
            var blog = await _context.Blogs.SingleOrDefaultAsync(m => m.Id == id || m.OldId == id);

            if (blog == null || (!blog.IsShow && !_userRules))
            {
                return NotFound();
            }

            language = !string.IsNullOrEmpty(language) ? language : _sharedLocalizer["en"];

            #region Previous and  Next
            var idList = _context.Blogs.OrderByDescending(o => o.CreateTime).Select(p => p.Id).ToList();
            ViewBag.NextBlogId = idList.Count == 0 ? id: idList[Math.Max(idList.IndexOf((int)id) - 1, 0)];
            ViewBag.PrevBlogId = idList.Count == 0 ? id : idList[Math.Min(idList.IndexOf((int)id) + 1, idList.Count - 1)];
            #endregion

            ViewBag.UserRules = _userRules;

            //update ReadCount
            if (blog.ReadCount < int.MaxValue && string.IsNullOrEmpty(Request.Cookies[blog.Id.ToString()]) && Request.Cookies.Count >= 1)
            {
                blog.ReadCount++;
                _context.Update(blog);
                await _context.SaveChangesAsync();
            }
            return View(new BlogViewModel(blog, language == "zh"));
        }

        // GET: Blog/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: blog/create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(
            [Bind("Id,ChineseTitle,ChineseContent,Editor,ChineseTags,EnglishTitle,EnglishContent,EnglishTags,IsShow")] Blog blog,
            IFormFile chineseCover, IFormFile englishCover, string isTop)
        {
            ViewBag.IsTop = isTop != null;
            if (ModelState.IsValid)
            {
                if (chineseCover != null)
                {
                    var fileName = Helper.UploadMedia(chineseCover, _env, 1000);
                    if (Helper.ValidateCover(_env, fileName))
                        blog.ChineseCover = fileName;
                    else
                        ModelState.AddModelError("ChineseCover", "Cover size must be 16:9.");
                }
                if (englishCover != null)
                {
                    var fileName = Helper.UploadMedia(englishCover, _env, 1000);
                    if (Helper.ValidateCover(_env, fileName))
                        blog.EnglishCover = fileName;
                    else
                        ModelState.AddModelError("EnglishCover", "Cover size must be 16:9.");
                }
                if(!ModelState.IsValid) return View(blog);

                blog.ChineseContent = Convert(blog.ChineseContent);
                blog.EnglishContent = Convert(blog.EnglishContent);
                blog.ChineseSummary = blog.ChineseContent.ClearHtmlTag(150);
                blog.EnglishSummary = blog.EnglishContent.ClearHtmlTag(150);
                blog.ChineseTags = blog.ChineseTags?.Replace(", ", ",").Replace("，", ",").Replace("， ", ",");
                blog.EnglishTags = blog.EnglishTags?.Replace(", ", ",").Replace("，", ",").Replace("， ", ",");
                blog.CreateTime = DateTime.Now;
                blog.EditTime = DateTime.Now;
                blog.IsShow = true;
                blog.User = _context.Users.Find(_userId);
                _context.Add(blog);
                await _context.SaveChangesAsync();
                if (isTop != null)
                {
                    _context.Top.ToList().ForEach(p => _context.Top.Remove(p));
                    _context.Add(new Top() { ItemId = blog.Id, Type = DiscoverViewModelType.Blog });
                }
                await _context.SaveChangesAsync();
                await UpdateRSSAsync();
                return RedirectToAction("index", "discover", new { type = DiscoverViewModelType.Blog });
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
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(
            int id, [Bind("Id,ChineseTitle,ChineseContent,Editor,ChineseTags,EnglishTitle,EnglishContent,EnglishTags,IsShow")] Blog blog,
            IFormFile chineseCover, IFormFile englishCover, string isTop)
        {
            if (id != blog.Id)
            {
                return NotFound();
            }
            ViewBag.IsTop = isTop != null;
            if (ModelState.IsValid)
            {
                var item = _context.Blogs.FirstOrDefault(p => p.Id == blog.Id);
                if (chineseCover != null)
                {
                    var fileName = Helper.UploadMedia(chineseCover, _env, 1000);
                    if (Helper.ValidateCover(_env, fileName))
                    {
                        if (!string.IsNullOrEmpty(blog.ChineseCover))
                            System.IO.File.Delete(Path.Combine(_env.ContentRootPath, "wwwroot/upload", blog.ChineseCover));
                        item.ChineseCover = fileName;
                    }
                    else
                    {
                        ModelState.AddModelError("ChineseCover", "Cover size must be 16:9");
                    }
                }
                if (englishCover != null)
                {
                    var fileName = Helper.UploadMedia(englishCover, _env, 1000);
                    if (Helper.ValidateCover(_env, fileName))
                    {
                        if (!string.IsNullOrEmpty(blog.EnglishCover))
                            System.IO.File.Delete(Path.Combine(_env.ContentRootPath, "wwwroot/upload", blog.EnglishCover));
                        item.EnglishCover = fileName;
                    }
                    else
                    {
                        ModelState.AddModelError("EnglishCover", "Cover size must be 16:9");
                    }
                }
                if (!ModelState.IsValid) return View(blog);
                try
                {
                    item.ChineseContent = Convert(blog.ChineseContent);
                    item.EnglishContent = Convert(blog.EnglishContent);
                    item.ChineseSummary = blog.ChineseContent.ClearHtmlTag(150);
                    item.EnglishSummary = blog.EnglishContent.ClearHtmlTag(150);
                    item.ChineseTags = blog.ChineseTags?.Replace(", ", ",").Replace("，", ",").Replace("， ", ",");
                    item.EnglishTags = blog.EnglishTags?.Replace(", ", ",").Replace("，", ",").Replace("， ", ",");
                    item.EnglishTitle = blog.EnglishTitle;
                    item.ChineseTitle = blog.ChineseTitle;
                    item.Editor = blog.Editor;
                    item.EditTime = DateTime.Now;
                    item.IsShow = blog.IsShow;
                    
                    _context.Update(item);
                    if (isTop != null)
                    {
                        _context.Top.ToList().ForEach(p => _context.Top.Remove(p));
                        _context.Add(new Top() { ItemId = blog.Id, Type = DiscoverViewModelType.Blog });
                    }
                    await _context.SaveChangesAsync();
                    await UpdateRSSAsync();
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

            var blog = await _context.Blogs.SingleOrDefaultAsync(m => m.Id == id);
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
            return RedirectToAction("index", "discover", new { type = DiscoverViewModelType.Blog });
        }
        private async Task UpdateRSSAsync()
        {
            await Task.Run(() =>
            {
                UpdateRssChinese();
                UpdateRssEnglish();
            });
        }

        private void UpdateRssChinese()
        {
            var xml = new XmlDocument() { XmlResolver = null };
            XmlDeclaration xmldecl = xml.CreateXmlDeclaration("1.0", "utf-8", null);
            XmlElement root = xml.DocumentElement;
            xml.InsertBefore(xmldecl, root);

            var rss = xml.CreateElement("rss");
            var version = xml.CreateAttribute("version");
            version.Value = "2.0";
            rss.Attributes.Append(version);

            var channel = xml.CreateElement("channel");

            var title = xml.CreateElement("title");
            title.InnerText = "Neo blog posts list";
            channel.AppendChild(title);

            var link = xml.CreateElement("link");
            link.InnerText = "https://neo.org/blog";
            channel.AppendChild(link);

            var pubDate = xml.CreateElement("pubDate");
            pubDate.InnerText = DateTime.Now.ToPubDate();
            channel.AppendChild(pubDate);

            var description = xml.CreateElement("description");
            description.InnerText = "Latest posts from Neo blog";
            channel.AppendChild(description);

            var blogs = _context.Blogs.Where(p => p.IsShow).OrderByDescending(p => p.CreateTime).Take(20).ToList().Select(p => new Blog()
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
            var xml = new XmlDocument() { XmlResolver = null };
            XmlDeclaration xmldecl = xml.CreateXmlDeclaration("1.0", "utf-8", null);
            XmlElement root = xml.DocumentElement;
            xml.InsertBefore(xmldecl, root);

            var rss = xml.CreateElement("rss");
            var version = xml.CreateAttribute("version");
            version.Value = "2.0";
            rss.Attributes.Append(version);

            var channel = xml.CreateElement("channel");

            var title = xml.CreateElement("title");
            title.InnerText = "Neo blog posts list";
            channel.AppendChild(title);

            var link = xml.CreateElement("link");
            link.InnerText = "https://neo.org/blog";
            channel.AppendChild(link);

            var pubDate = xml.CreateElement("pubDate");
            pubDate.InnerText = DateTime.Now.ToPubDate();
            channel.AppendChild(pubDate);

            var description = xml.CreateElement("description");
            description.InnerText = "Latest posts from Neo blog";
            channel.AppendChild(description);

            var blogs = _context.Blogs.Where(p => p.IsShow).OrderByDescending(p => p.CreateTime).Take(20).ToList().Select(p => new Blog()
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
        public async Task<IActionResult> RSS(string language)
        {
            if (string.IsNullOrEmpty(RssModel.Chinese) || string.IsNullOrEmpty(RssModel.English))
                await UpdateRSSAsync();
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
                var fileName = Helper.UploadMedia(file, _env, 1000);
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

        private static string Convert(string input)
        {
            input = Regex.Replace(input, @"<!\-\-\[if gte mso 9\]>[\s\S]*<!\[endif\]\-\->", ""); //删除 ms office 注解
            input = Regex.Replace(input, "src=\".*/upload", "data-original=\"/upload"); //替换上传图片的链接
            input = Regex.Replace(input, "<img src=", "<img data-original="); //替换外部图片的链接
            input = Regex.Replace(input, @"<p>((&nbsp;\s)|(&nbsp;)|\s)+", "<p>"); //删除段首由空格造成的缩进
            input = Regex.Replace(input, @"\sstyle="".*?""", ""); //删除 Style 样式
            input = Regex.Replace(input, @"\sclass="".*?""", ""); //删除 Class 样式
            return input;
        }

        private static string XmlEncode(string input)
        {
            return input?.Replace(">", "&gt;").Replace("<", "&lt;").Replace("&", "&amp;").Replace("'", "&apos;").Replace("\"", "&quot;");
        }
    }
}
