using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using NeoWeb.Data;
using NeoWeb.Models;

namespace NeoWeb.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;

        public HomeController(ApplicationDbContext context, IStringLocalizer<SharedResource> sharedLocalizer)
        {
            _context = context;
            _sharedLocalizer = sharedLocalizer;
        }

        public IActionResult Index()
        {
            var count = 3;
            var blogs = _context.Blogs.OrderByDescending(p => p.CreateTime).Take(count);
            var events = _context.Events.OrderByDescending(p => p.StartTime).Take(count);
            var news = _context.News.OrderByDescending(p => p.Time).Take(count);
            var viewModels = new List<DiscoverViewModel>();
            var isZh = _sharedLocalizer["en"] == "zh";
            Helper.AddBlogs(blogs, viewModels, isZh);
            Helper.AddEvents(events, viewModels, isZh);
            Helper.AddNews(news, viewModels, isZh);

            // 添加置顶内容
            var top = _context.Top.FirstOrDefault();
            var topItems = new List<DiscoverViewModel>();
            if (top != null)
            {
                switch (top.Type)
                {
                    case DiscoverViewModelType.Blog:
                        Helper.AddBlogs(_context.Blogs.Where(p => p.Id == top.ItemId), topItems, isZh);
                        viewModels.RemoveAll(p => p.Type == top.Type && p.Blog.Id == top.ItemId);
                        break;
                    case DiscoverViewModelType.Event:
                        Helper.AddEvents(_context.Events.Where(p => p.Id == top.ItemId), topItems, isZh);
                        viewModels.RemoveAll(p => p.Type == top.Type && p.Event.Id == top.ItemId);
                        break;
                    case DiscoverViewModelType.News:
                        Helper.AddNews(_context.News.Where(p => p.Id == top.ItemId), topItems, isZh);
                        viewModels.RemoveAll(p => p.Type == top.Type && p.News.Id == top.ItemId);
                        break;
                }
                ViewBag.OnTop = topItems.Count > 0 ? topItems[0] : null;
            }

            return View(viewModels.OrderByDescending(p => p.Time).Take(count).ToList());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult SetLanguage(string culture, string returnUrl)
        {
            if (string.IsNullOrEmpty(culture) || string.IsNullOrEmpty(returnUrl))
                return RedirectToAction("Index");
            try
            {
                Response.Cookies.Append(
                        CookieRequestCultureProvider.DefaultCookieName,
                        CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
                        new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
                    );
            }
            catch (InvalidOperationException)
            {
                return RedirectToAction("Index"); ;
            }
            catch (CultureNotFoundException)
            {
                return RedirectToAction("Index");
            }

            return LocalRedirect(returnUrl);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
