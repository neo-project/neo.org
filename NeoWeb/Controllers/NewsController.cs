using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Localization;
using NeoWeb.Data;
using NeoWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace NeoWeb.Controllers
{
    [Route("news")]
    [Authorize(Roles = "Admin")]
    public class NewsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly string _userId;
        private readonly bool _userRules;
        private readonly IWebHostEnvironment _env;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;

        public NewsController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IStringLocalizer<SharedResource> sharedLocalizer, IWebHostEnvironment env)
        {
            _context = context;
            _sharedLocalizer = sharedLocalizer;
            _userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            _env = env;
            if (_userId != null)
            {
                _userRules = _context.UserRoles.Any(p => p.UserId == _userId);
            }
        }

        // GET: news
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Index(int? type = null, int? year = null, string keywords = null)
        {
            IQueryable<Blog> blogs = _context.Blogs;
            IQueryable<Event> events = _context.Events;
            IQueryable<Media> news = _context.Media;

            var viewModels = new List<NewsViewModel>();

            // year filter
            if (year != null)
            {
                blogs = blogs.Where(p => p.CreateTime.Year == year);
                events = events.Where(p => p.StartTime.Year == year);
                news = news.Where(p => p.Time.Year == year);
            }

            // keywords filter
            if (!string.IsNullOrEmpty(keywords))
            {
                foreach (var item in keywords.Split(" "))
                {
                    blogs = blogs.Where(p => p.ChineseTitle.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                        || p.ChineseContent.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                        || !p.ChineseTags.Equals(null, StringComparison.CurrentCultureIgnoreCase) && p.ChineseTags.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                        || !p.ChineseSummary.Equals(null, StringComparison.CurrentCultureIgnoreCase) && p.ChineseSummary.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                        || p.EnglishTitle.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                        || p.EnglishContent.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                        || p.EnglishTags != null && p.EnglishTags.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                        || p.EnglishSummary != null && p.EnglishSummary.Contains(item, StringComparison.CurrentCultureIgnoreCase));
                    if (blogs == null) break;
                }
                foreach (var item in keywords.Split(" "))
                {
                    events = events.Where(p => p.ChineseAddress.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                                || p.ChineseCity.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                                || p.ChineseDetails.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                                || p.ChineseName.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                                || p.ChineseOrganizers.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                                || p.Country != null && p.Country.ZhName.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                                || p.Country != null && p.Country.Name.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                                || p.EnglishAddress.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                                || p.EnglishCity.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                                || p.EnglishDetails.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                                || p.EnglishName.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                                || p.EnglishOrganizers.Contains(item, StringComparison.CurrentCultureIgnoreCase));
                    if (events == null) break;
                }
                foreach (var item in keywords.Split(" "))
                {
                    news = news.Where(p => p.ChineseTitle.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                        || p.EnglishTitle.Contains(item, StringComparison.CurrentCultureIgnoreCase)
                        || p.Link.Contains(item, StringComparison.CurrentCultureIgnoreCase));
                    if (news == null) break;
                }
            }

            var isZh = _sharedLocalizer["en"] == "zh";
            // type filter
            switch (type)
            {
                case (int)NewsViewModelType.Blog:
                    Helper.AddBlogs(blogs, viewModels, isZh);
                    break;
                case (int)NewsViewModelType.Event:
                    Helper.AddEvents(events, viewModels, isZh);
                    break;
                case (int)NewsViewModelType.Media:
                    Helper.AddMedia(news, viewModels, isZh);
                    break;
                default:
                    Helper.AddBlogs(blogs, viewModels, isZh);
                    Helper.AddEvents(events, viewModels, isZh);
                    Helper.AddMedia(news, viewModels, isZh);
                    break;
            }

            viewModels = [.. viewModels.OrderByDescending(p => p.Time)];

            // 添加置顶内容
            if (type == null && year == null && string.IsNullOrEmpty(keywords))
            {
                var top = _context.Top.FirstOrDefault();
                var topItems = new List<NewsViewModel>();
                if (top != null)
                {
                    switch (top.Type)
                    {
                        case NewsViewModelType.Blog:
                            Helper.AddBlogs(_context.Blogs.Where(p => p.Id == top.ItemId), topItems, isZh);
                            viewModels.RemoveAll(p => p.Type == top.Type && p.Blog.Id == top.ItemId);
                            break;
                        case NewsViewModelType.Event:
                            Helper.AddEvents(_context.Events.Where(p => p.Id == top.ItemId), topItems, isZh);
                            viewModels.RemoveAll(p => p.Type == top.Type && p.Event.Id == top.ItemId);
                            break;
                        case NewsViewModelType.Media:
                            Helper.AddMedia(_context.Media.Where(p => p.Id == top.ItemId), topItems, isZh);
                            viewModels.RemoveAll(p => p.Type == top.Type && p.Media.Id == top.ItemId);
                            break;
                    }
                    ViewBag.OnTop = topItems.Count > 0 ? topItems[0] : null;
                }
            }

            var blogYear = _context.Blogs.Select(p => p.CreateTime.Year).Distinct();
            var eventYear = _context.Events.Select(p => p.StartTime.Year).Distinct();
            var newsYear = _context.Media.Select(p => p.Time.Year).Distinct();
            var allYear = blogYear.Concat(eventYear).Concat(newsYear).Distinct().OrderByDescending(p => p).Select(p => new SelectListItem { Value = p.ToString(), Text = p.ToString() }).ToList();
            allYear.Insert(0, new SelectListItem("All Year", ""));

            ViewBag.AllYear = allYear;
            List<SelectListItem> selectListItems = [
                new() { Value = "0", Text = "All Type" },
                new() { Value = "1", Text = "Blog" },
                new() { Value = "2", Text = "Event" },
                new() { Value = "3", Text = "News" }
            ];
            ViewBag.AllType = selectListItems;

            ViewBag.Year = year;
            ViewBag.KeyWords = keywords;
            ViewBag.Type = type;

            ViewBag.UserRules = _userRules;

            return View(viewModels);
        }
    }
}
