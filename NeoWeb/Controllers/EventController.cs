using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using NeoWeb.Data;
using NeoWeb.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class EventController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly string _userId;
        private readonly bool _userRules;
        private readonly IHostingEnvironment _env;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;

        public EventController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IHostingEnvironment env, 
             IStringLocalizer<SharedResource> sharedLocalizer)
        {
            _context = context;
            _userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            _env = env;
            _sharedLocalizer = sharedLocalizer;
            if (_userId != null)
            {
                _userRules = _context.UserRoles.Any(p => p.UserId == _userId);
            }
        }

        // GET: event
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Index(string k = null, int c = 0, int d = 0, string z = null)
        {
            IQueryable<Event> models = _context.Events;
            

            //对关键词进行筛选
            if (!string.IsNullOrEmpty(k))
            {
                foreach (var item in k.Split(" "))
                {
                    switch (item.ToLower())
                    {
                        case "conference": models = models.Where(p => p.Type == EventType.Conference); break;
                        case "meetup": models = models.Where(p => p.Type == EventType.Meetup); break;
                        case "workshop": models = models.Where(p => p.Type == EventType.Workshop); break;
                        case "hackathon": models = models.Where(p => p.Type == EventType.Hackathon); break;
                        default:
                            models = models.Where(p => p.ChineseAddress.Contains(item, StringComparison.OrdinalIgnoreCase)
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
                    if (models == null) break;
                }
            }
            //对国家进行筛选
            if (c > 0)
            {
                models = models.Where(p => p.Country.Id == c);
            }
            //对日期进行筛选
            switch (d)
            {
                //本周内（非7天内）的未结束的活动
                case 1: models = models.Where(p => IsInSameWeek(DateTime.Now, p.StartTime) || IsInSameWeek(DateTime.Now, p.EndTime)).Where(p => p.EndTime >= DateTime.Now); break;
                //本月内（非30天内）的未结束的活动
                case 2: models = models.Where(p => IsInSameMonth(DateTime.Now, p.StartTime) || IsInSameMonth(DateTime.Now, p.EndTime)).Where(p => p.EndTime >= DateTime.Now); break;
                //已经结束的活动
                case 3: models = models.Where(p => p.EndTime < DateTime.Now); break;
            }
            //对具体日期进行查找
            if (DateTime.TryParse(z, out DateTime date))
                models = models.Where(p => p.StartTime.Date <= date && p.EndTime.Date >= date);
            //中英文切换
            List<EventViewModel> viewModels;
            if (_sharedLocalizer["en"] == "zh")
            {
                viewModels = models.OrderByDescending(p => p.StartTime).Select(p => new EventViewModel()
                {
                    Id = p.Id,
                    Name = p.ChineseName,
                    Type = (int)p.Type,
                    Country = p.Country.ZhName,
                    City = p.ChineseCity,
                    Address = p.ChineseAddress,
                    StartTime = p.StartTime,
                    EndTime = p.EndTime,
                    Cover = p.ChineseCover,
                    Organizers = p.ChineseOrganizers,
                    IsFree = p.IsFree,
                    ThirdPartyLink = p.ThirdPartyLink
                }).ToList();
            }
            else
            {
                viewModels = models.OrderByDescending(p => p.StartTime).Select(p => new EventViewModel()
                {
                    Id = p.Id,
                    Name = p.EnglishName,
                    Type = (int)p.Type,
                    Country = p.Country.ZhName,
                    City = p.ChineseCity,
                    Address = p.ChineseAddress,
                    StartTime = p.StartTime,
                    EndTime = p.EndTime,
                    Cover = p.EnglishCover,
                    Organizers = p.ChineseOrganizers,
                    IsFree = p.IsFree,
                    ThirdPartyLink = p.ThirdPartyLink
                }).ToList();
            }
            
            //全部筛选列表（可能弃用）
            ViewBag.Countries = viewModels.Select(p => p.Country).Distinct();
            ViewBag.Types = viewModels.Select(p => p.Type).Distinct();
            ViewBag.Dates = new string[] { "All Dates", "This Week", "This Month", "Past Events" };
            //筛选列表中的默认选项（可能弃用）
            ViewBag.Keywords = k;
            ViewBag.CountryId = c;
            ViewBag.Date = d;
            
            ViewBag.UserRules = _userRules;
            return View(viewModels);
        }

        [HttpGet]
        [AllowAnonymous]
        public JsonResult Date(int year, int month)
        {
            var obj = _context.Events.Where(p => p.StartTime.Year == year && p.StartTime.Month == month).OrderBy(p => p.StartTime).Select(p => p.StartTime.ToString("yyyy/MM/dd")).ToList().Distinct();
            return Json(obj);
        }

        /// <summary>   
        /// 判断两个日期是否在同一周   
        /// </summary>    
        private bool IsInSameWeek(DateTime x, DateTime y)
        {
            if (x > y)
            {
                var temp = x;
                x = y;
                y = temp;
            }
            int days = (y.Date - x.Date).Days;
            int dayOfWeek = Convert.ToInt32(y.DayOfWeek);
            return days <= dayOfWeek;
        }

        /// <summary>
        /// 判断两个日期是否在同一月  
        /// </summary>
        private bool IsInSameMonth(DateTime x, DateTime y)
        {
            return x.Year == y.Year && x.Month == y.Month;
        }

        // GET: event/details/5
        [AllowAnonymous]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            Event evt = await _context.Events.SingleOrDefaultAsync(p => p.Id == id);

            if (evt == null)
            {
                return NotFound();
            }

            EventViewModel viewModel = new EventViewModel(evt, _sharedLocalizer["en"] == "zh");
            
            ViewBag.UserRules = _userRules;

            return View(viewModel);
        }

        // GET: event/create
        public IActionResult Create()
        {
            ViewBag.Countries = _context.Countries.ToList();
            return View();
        }

        // POST: event/create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(
            [Bind("Id,ChineseName,EnglishName,ChineseCity,EnglishCity,Type,ChineseAddress,EnglishAddress," +
            "StartTime,EndTime,ChineseCover,EnglishCover,ChineseDetails,EnglishDetails,ChineseOrganizers,EnglishOrganizers,IsFree,ThirdPartyLink")] Event evt, 
            int countryId, IFormFile chineseCover, IFormFile EnglishCover)
        {
            var country = _context.Countries.FirstOrDefault(p => p.Id == countryId);
            if (country == null)
            {
                ModelState.AddModelError("Country", "国家错误");
            }
            evt.Country = country;
            if (evt.EndTime <= evt.StartTime)
            {
                ModelState.AddModelError("EndTime", "截止时间错误");
            }
            if (!evt.IsFree && evt.ThirdPartyLink == null)
            {
                ModelState.AddModelError("ThirdPartyLink", "付费活动需要填写购票链接");
            }
            if (ModelState.IsValid)
            {
                if (chineseCover != null)
                    evt.ChineseCover = Upload(chineseCover);
                if (EnglishCover != null)
                    evt.EnglishCover = Upload(EnglishCover);
                evt.ChineseDetails = EventConvert(evt.ChineseDetails);
                evt.EnglishDetails = EventConvert(evt.EnglishDetails);
                _context.Add(evt);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewBag.Countries = _context.Countries.ToList();
            return View(evt);
        }

        private string Upload(IFormFile cover)
        {
            try
            {
                return Helper.UploadMedia(cover, _env, 600);
            }
            catch (ArgumentException)
            {
                Response.StatusCode = 502;
                return "";
            }
        }

        // GET: event/edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            ViewBag.Countries = _context.Countries.ToList();
            if (id == null)
            {
                return NotFound();
            }

            var evt = await _context.Events.SingleOrDefaultAsync(m => m.Id == id);
            if (evt == null)
            {
                return NotFound();
            }
            return View(evt);
        }

        // POST: event/edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,ChineseName,EnglishName,ChineseCity,EnglishCity,Type,ChineseAddress,EnglishAddress," +
            "StartTime,EndTime,ChineseCover,EnglishCover,ChineseDetails,EnglishDetails,ChineseOrganizers,EnglishOrganizers,IsFree,ThirdPartyLink")] Event evt, 
            int countryId, IFormFile chineseCover, IFormFile englishCover)
        {
            if (id != evt.Id)
            {
                return NotFound();
            }
            var country = _context.Countries.FirstOrDefault(p => p.Id == countryId);
            if (country == null)
            {
                ModelState.AddModelError("Country", "国家错误");
            }
            evt.Country = country;
            //var oldCover = _context.Events.FirstOrDefault(p => p.Id == @event.Id).Cover;
            if (evt.EndTime <= evt.StartTime)
            {
                ModelState.AddModelError("EndTime", "截止时间错误");
            }
            if (!evt.IsFree && evt.ThirdPartyLink == null)
            {
                ModelState.AddModelError("ThirdPartyLink", "付费活动需要填写购票链接");
            }
            if (ModelState.IsValid)
            {
                try
                {
                    if (chineseCover != null)
                    {
                        if (!string.IsNullOrEmpty(evt.ChineseCover))
                            System.IO.File.Delete(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/upload", evt.ChineseCover));
                        evt.ChineseCover = Upload(chineseCover);
                    }
                    if (englishCover != null)
                    {
                        if (!string.IsNullOrEmpty(evt.EnglishCover))
                            System.IO.File.Delete(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/upload", evt.EnglishCover));
                        evt.EnglishCover = Upload(englishCover);
                    }
                    evt.ChineseDetails = EventConvert(evt.ChineseDetails);
                    evt.EnglishDetails = EventConvert(evt.EnglishDetails);
                    _context.Update(evt);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EventExists(evt.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewBag.Countries = _context.Countries.ToList();
            return View(evt);
        }

        // GET: event/delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var @event = await _context.Events.Include(m => m.Country)
                .SingleOrDefaultAsync(m => m.Id == id);
            if (@event == null)
            {
                return NotFound();
            }

            return View(@event);
        }

        // POST: event/delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var @event = await _context.Events.SingleOrDefaultAsync(m => m.Id == id);
            _context.Events.Remove(@event);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool EventExists(int id)
        {
            return _context.Events.Any(e => e.Id == id);
        }

        private string EventConvert(string input)
        {
            input = Regex.Replace(input, @"<!\-\-\[if gte mso 9\]>[\s\S]*<!\[endif\]\-\->", ""); //删除 ms office 注解
            input = Regex.Replace(input, "src=\".*/upload", "data-original=\"/upload"); //替换上传图片的链接
            input = Regex.Replace(input, "<img src=", "<img data-original="); //替换外部图片的链接
            return input;
        }
    }
}
