using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
                    switch (item.ToLower())
                    {
                        case "conference": events = events.Where(p => p.Type == EventType.Conference); break;
                        case "meetup": events = events.Where(p => p.Type == EventType.Meetup); break;
                        case "workshop": events = events.Where(p => p.Type == EventType.Workshop); break;
                        case "hackathon": events = events.Where(p => p.Type == EventType.Hackathon); break;
                        default:
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
                                || p.EnglishOrganizers.Contains(item, StringComparison.OrdinalIgnoreCase)
                                || p.ThirdPartyLink != null && p.ThirdPartyLink.Contains(item, StringComparison.OrdinalIgnoreCase)); break;
                    }
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

            // 中英文切换
            if (_sharedLocalizer["en"] == "zh")
            {
                // type filter
                switch (type)
                {
                    case (int)DiscoverViewModelType.Blog:
                        foreach (var item in blogs)
                            viewModels.Add(new DiscoverViewModel()
                            {
                                Type = DiscoverViewModelType.Blog,
                                Blog = new BlogViewModel()
                                {
                                    Id = item.Id,
                                    CreateTime = item.CreateTime,
                                    Title = item.ChineseTitle,
                                    Tags = item.ChineseTags
                                },
                                Time = item.CreateTime
                            });
                        break;
                    case (int)DiscoverViewModelType.Event:
                        foreach (var item in events)
                            viewModels.Add(new DiscoverViewModel()
                            {
                                Type = DiscoverViewModelType.Event,
                                Event = new EventViewModel()
                                {
                                    Id = item.Id,
                                    StartTime = item.StartTime,
                                    EndTime = item.EndTime,
                                    Name = item.ChineseName,
                                    Country = item.Country.ZhName,
                                    City = item.ChineseCity
                                },
                                Time = item.StartTime
                            });
                        break;
                    case (int)DiscoverViewModelType.News:
                        foreach (var item in news)
                            viewModels.Add(new DiscoverViewModel(DiscoverViewModelType.News, item, _sharedLocalizer["en"] == "zh"));
                        break;
                    default:
                        foreach (var item in blogs)
                            viewModels.Add(new DiscoverViewModel()
                            {
                                Type = DiscoverViewModelType.Blog,
                                Blog = new BlogViewModel()
                                {
                                    Id = item.Id,
                                    CreateTime = item.CreateTime,
                                    Title = item.ChineseTitle,
                                    Tags = item.ChineseTags
                                },
                                Time = item.CreateTime
                            });
                        foreach (var item in events)
                            viewModels.Add(new DiscoverViewModel()
                            {
                                Type = DiscoverViewModelType.Event,
                                Event = new EventViewModel()
                                {
                                    Id = item.Id,
                                    StartTime = item.StartTime,
                                    EndTime = item.EndTime,
                                    Name = item.ChineseName,
                                    Country = item.Country.ZhName,
                                    City = item.ChineseCity
                                },
                                Time = item.StartTime
                            });
                        foreach (var item in news)
                            viewModels.Add(new DiscoverViewModel(DiscoverViewModelType.News, item, _sharedLocalizer["en"] == "zh"));
                        break;
                }
            }

            viewModels = viewModels.OrderByDescending(p => p.Time).ToList();
            ViewBag.UserRules = _userRules;

            return View(viewModels);
        }
    }
}