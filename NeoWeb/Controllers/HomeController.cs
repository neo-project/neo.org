using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using NeoWeb.Data;
using NeoWeb.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class HomeController(ApplicationDbContext context, IStringLocalizer<SharedResource> sharedLocalizer, IWebHostEnvironment env) : Controller
    {
        public IActionResult Index()
        {
            var count = 3;
            var blogs = context.Blogs.OrderByDescending(p => p.CreateTime).Take(count);
            var events = context.Events.OrderByDescending(p => p.StartTime).Take(count);
            var news = context.Media.OrderByDescending(p => p.Time).Take(count);
            var viewModels = new List<NewsViewModel>();
            var isZh = sharedLocalizer["en"] == "zh";
            Helper.AddBlogs(blogs, viewModels, isZh);
            Helper.AddEvents(events, viewModels, isZh);
            Helper.AddMedia(news, viewModels, isZh);

            // 添加置顶内容
            var top = context.Top.FirstOrDefault();
            var topItems = new List<NewsViewModel>();
            if (top != null)
            {
                switch (top.Type)
                {
                    case NewsViewModelType.Blog:
                        Helper.AddBlogs(context.Blogs.Where(p => p.Id == top.ItemId), topItems, isZh);
                        break;
                    case NewsViewModelType.Event:
                        Helper.AddEvents(context.Events.Where(p => p.Id == top.ItemId), topItems, isZh);
                        break;
                    case NewsViewModelType.Media:
                        Helper.AddMedia(context.Media.Where(p => p.Id == top.ItemId), topItems, isZh);
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

        static string status;
        static DateTime lastRequest;
        public async Task<IActionResult> GitHubStatus()
        {
            try
            {
                if (string.IsNullOrEmpty(status) || (DateTime.Now - lastRequest).TotalHours > 24)
                {
                    using var client = new HttpClient();
                    client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76");
                    HttpResponseMessage response = await client.GetAsync("https://api.github.com/repos/neo-project/neo");
                    status = response.IsSuccessStatusCode ? await response.Content.ReadAsStringAsync() : System.IO.File.ReadAllText(Path.Combine(env.ContentRootPath, "GitHubStatus/neo.json"));
                    lastRequest = DateTime.Now;
                }
            }
            catch (IOException)
            {
            }
            return Content(status, "application/json");
        }
    }
}
