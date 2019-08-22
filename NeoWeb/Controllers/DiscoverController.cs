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
        private readonly IHostingEnvironment _env;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;

        public DiscoverController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IStringLocalizer<SharedResource> sharedLocalizer, IHostingEnvironment env)
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

            List<DiscoverViewModel> viewModels = new List<DiscoverViewModel>();

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

            var maxCount = 30;
            if (string.IsNullOrEmpty(keywords) && year == null)
            {
                blogs = blogs.OrderByDescending(p => p.CreateTime).Take(maxCount);
                events = events.OrderByDescending(p => p.StartTime).Take(maxCount);
                news = news.OrderByDescending(p => p.Time).Take(maxCount);
            }

            bool isZh = _sharedLocalizer["en"] == "zh";
            // type filter
            switch (type)
            {
                case (int)DiscoverViewModelType.Blog:
                    AddBlogs(blogs, viewModels, isZh);
                    break;
                case (int)DiscoverViewModelType.Event:
                    AddEvents(events, viewModels, isZh);
                    break;
                case (int)DiscoverViewModelType.News:
                    AddNews(news, viewModels, isZh);
                    break;
                default:
                    AddBlogs(blogs, viewModels, isZh);
                    AddEvents(events, viewModels, isZh);
                    AddNews(news, viewModels, isZh);
                    break;
            }

            viewModels = viewModels.OrderByDescending(p => p.Time).Take(maxCount).ToList();

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
                            AddBlogs(_context.Blogs.Where(p => p.Id == top.ItemId), topItems, isZh); break;
                        case DiscoverViewModelType.Event:
                            AddEvents(_context.Events.Where(p => p.Id == top.ItemId), topItems, isZh); break;
                        case DiscoverViewModelType.News:
                            AddNews(_context.News.Where(p => p.Id == top.ItemId), topItems, isZh); break;
                    }
                    ViewBag.OnTop = topItems?[0];
                }
            }

            var blogYear = _context.Blogs.Select(p => p.CreateTime.Year).Distinct();
            var eventYear = _context.Events.Select(p => p.StartTime.Year).Distinct();
            var newsYear = _context.News.Select(p => p.Time.Year).Distinct();
            var allYear = blogYear.Concat(eventYear).Concat(newsYear).Distinct().OrderByDescending(p => p).Select(p => new SelectListItem { Value = p.ToString(), Text = p.ToString() }).ToList();
            allYear.Add(new SelectListItem("All Year", ""));
            ViewBag.Year = allYear;

            ViewBag.UserRules = _userRules;

            return View(viewModels);
        }

        private void AddBlogs(IQueryable<Blog> blogs, List<DiscoverViewModel> viewModels, bool isZh)
        {
            blogs.Select(p => new BlogViewModel()
            {
                Id = p.Id,
                CreateTime = p.CreateTime,
                Title = isZh ? p.ChineseTitle : p.EnglishTitle,
                Tags = isZh ? p.ChineseTags : p.EnglishTags,
                Cover = isZh ? p.ChineseCover : p.EnglishCover,
                IsShow = p.IsShow
            }).ToList().ForEach(p => viewModels.Add(new DiscoverViewModel()
            {
                Type = DiscoverViewModelType.Blog,
                Blog = p,
                Time = p.CreateTime
            }));
        }

        private void AddEvents(IQueryable<Event> events, List<DiscoverViewModel> viewModels, bool isZh)
        {
            events.Select(p => new EventViewModel()
            {
                Id = p.Id,
                StartTime = p.StartTime,
                EndTime = p.EndTime,
                Name = isZh ? p.ChineseName : p.EnglishName,
                Tags = isZh ? p.ChineseTags : p.EnglishTags,
                Country = isZh ? p.Country.ZhName : p.Country.Name,
                City = isZh ? p.ChineseCity : p.EnglishCity,
                Cover = isZh ? p.ChineseCover : p.EnglishCover
            }).ToList().ForEach(p => viewModels.Add(new DiscoverViewModel()
            {
                Type = DiscoverViewModelType.Event,
                Event = p,
                Time = p.StartTime
            }));
        }

        private void AddNews(IQueryable<News> news, List<DiscoverViewModel> viewModels, bool isZh)
        {
            news.Select(p => new NewsViewModel()
            {
                Id = p.Id,
                Time = p.Time,
                Link = p.Link,
                Cover = isZh ? p.ChineseCover : p.EnglishCover,
                Title = isZh ? p.ChineseTitle : p.EnglishTitle,
                Tags = isZh ? p.ChineseTags : p.EnglishTags
            }).ToList().ForEach(p => viewModels.Add(new DiscoverViewModel()
            {
                Type = DiscoverViewModelType.News,
                News = p,
                Time = p.Time
            }));
        }
    }
}