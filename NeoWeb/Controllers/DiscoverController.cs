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
    [Authorize(Roles = "Admin")]
    public class DiscoverController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly string _userId;
        private readonly bool _userRules;
        private readonly IWebHostEnvironment _env;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;

        public DiscoverController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IStringLocalizer<SharedResource> sharedLocalizer, IWebHostEnvironment env)
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

        // GET: discover
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Index(int? type = null, int? year = null, string keywords = null)
        {
            IQueryable<Blog> blogs = _context.Blogs;
            IQueryable<Event> events = _context.Events;
            IQueryable<News> news = _context.News;

            var viewModels = new List<DiscoverViewModel>();

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
                    blogs = blogs.Where(p => p.ChineseTitle.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.ChineseContent.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.ChineseTags != null && p.ChineseTags.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.ChineseSummary != null && p.ChineseSummary.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.EnglishTitle.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.EnglishContent.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.EnglishTags != null && p.EnglishTags.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.EnglishSummary != null && p.EnglishSummary.Contains(item, StringComparison.OrdinalIgnoreCase));
                    if (blogs == null) break;
                }
                foreach (var item in keywords.Split(" "))
                {
                    events = events.Where(p => p.ChineseAddress.Contains(item, StringComparison.OrdinalIgnoreCase)
                                || p.ChineseCity.Contains(item, StringComparison.OrdinalIgnoreCase)
                                || p.ChineseDetails.Contains(item, StringComparison.OrdinalIgnoreCase)
                                || p.ChineseName.Contains(item, StringComparison.OrdinalIgnoreCase)
                                || p.ChineseOrganizers.Contains(item, StringComparison.OrdinalIgnoreCase)
                                || p.Country != null && p.Country.ZhName.Contains(item, StringComparison.OrdinalIgnoreCase)
                                || p.Country != null && p.Country.Name.Contains(item, StringComparison.OrdinalIgnoreCase)
                                || p.EnglishAddress.Contains(item, StringComparison.OrdinalIgnoreCase)
                                || p.EnglishCity.Contains(item, StringComparison.OrdinalIgnoreCase)
                                || p.EnglishDetails.Contains(item, StringComparison.OrdinalIgnoreCase)
                                || p.EnglishName.Contains(item, StringComparison.OrdinalIgnoreCase)
                                || p.EnglishOrganizers.Contains(item, StringComparison.OrdinalIgnoreCase));
                    if (events == null) break;
                }
                foreach (var item in keywords.Split(" "))
                {
                    news = news.Where(p => p.ChineseTitle.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.EnglishTitle.Contains(item, StringComparison.OrdinalIgnoreCase)
                        || p.Link.Contains(item, StringComparison.OrdinalIgnoreCase));
                    if (news == null) break;
                }
            }

            var isZh = _sharedLocalizer["en"] == "zh";
            // type filter
            switch (type)
            {
                case (int)DiscoverViewModelType.Blog:
                    Helper.AddBlogs(blogs, viewModels, isZh);
                    break;
                case (int)DiscoverViewModelType.Event:
                    Helper.AddEvents(events, viewModels, isZh);
                    break;
                case (int)DiscoverViewModelType.News:
                    Helper.AddNews(news, viewModels, isZh);
                    break;
                default:
                    Helper.AddBlogs(blogs, viewModels, isZh);
                    Helper.AddEvents(events, viewModels, isZh);
                    Helper.AddNews(news, viewModels, isZh);
                    break;
            }

            viewModels = viewModels.OrderByDescending(p => p.Time).ToList();

            // 添加置顶内容
            if (type == null && year == null && string.IsNullOrEmpty(keywords))
            {
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
            }

            var blogYear = _context.Blogs.Select(p => p.CreateTime.Year).Distinct();
            var eventYear = _context.Events.Select(p => p.StartTime.Year).Distinct();
            var newsYear = _context.News.Select(p => p.Time.Year).Distinct();
            var allYear = blogYear.Concat(eventYear).Concat(newsYear).Distinct().OrderByDescending(p => p).Select(p => new SelectListItem { Value = p.ToString(), Text = p.ToString() }).ToList();
            allYear.Insert(0, new SelectListItem("All Year", ""));

            ViewBag.AllYear = allYear;
            ViewBag.AllType = new List<SelectListItem>() {
                new SelectListItem { Value = "0", Text = "All Type" },
                new SelectListItem { Value = "1", Text = "Blog" },
                new SelectListItem { Value = "2", Text = "Event" },
                new SelectListItem { Value = "3", Text = "News" }
            };

            ViewBag.Year = year;
            ViewBag.KeyWords = keywords;
            ViewBag.Type = type;

            ViewBag.UserRules = _userRules;

            return View(viewModels);
        }
    }
}