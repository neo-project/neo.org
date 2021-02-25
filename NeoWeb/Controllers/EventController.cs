using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
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

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class EventController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly string _userId;
        private readonly bool _userRules;
        private readonly IWebHostEnvironment _env;
        private readonly IStringLocalizer<SharedResource> _sharedLocalizer;

        public EventController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment env, 
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

        // GET: event/details/5
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Details(int? id, string language = null)
        {
            if (id == null)
            {
                return NotFound();
            }

            var evt = await _context.Events.Include(p => p.Country).SingleOrDefaultAsync(p => p.Id == id);

            if (evt == null)
            {
                return NotFound();
            }

            language = !string.IsNullOrEmpty(language) ? language : _sharedLocalizer["en"];

            #region Previous and  Next
            var idList = _context.Events.OrderByDescending(o => o.StartTime).Select(p => p.Id).ToList();
            ViewBag.NextEventId = idList.Count == 0 ? id : idList[Math.Max(idList.IndexOf((int)id) - 1, 0)];
            ViewBag.PrevEventId = idList.Count == 0 ? id : idList[Math.Min(idList.IndexOf((int)id) + 1, idList.Count - 1)];
            #endregion

            ViewBag.UserRules = _userRules;

            return View(new EventViewModel(evt, language == "zh"));
        }

        // GET: event/create
        public IActionResult Create()
        {
            ViewBag.Countries = _context.Countries.Select(c => new SelectListItem { Value = c.Id.ToString(), Text = $"{c.Name} - {c.ZhName}" }).ToList();
            return View();
        }

        // POST: event/create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(
            [Bind("Id,ChineseName,EnglishName,ChineseCity,EnglishCity,ChineseAddress,EnglishAddress,StartTime,EndTime," +
            "ChineseCover,EnglishCover,ChineseDetails,EnglishDetails,ChineseOrganizers,EnglishOrganizers,ChineseTags,EnglishTags,IsFree")] Event evt, 
            int countryId, IFormFile chineseCover, IFormFile englishCover, string isTop)
        {
            ViewBag.IsTop = isTop != null;
            var country = _context.Countries.FirstOrDefault(p => p.Id == countryId);
            if (country == null)
            {
                ModelState.AddModelError("Country", "The Country field is required.");
            }
            evt.Country = country;
            if (ModelState.IsValid)
            {
                if (evt.EndTime <= evt.StartTime)
                {
                    ModelState.AddModelError("EndTime", "End Time must be after the Start Time.");
                }
                if (chineseCover != null)
                {
                    var fileName = Helper.UploadMedia(chineseCover, _env, 1000);
                    if (Helper.ValidateCover(_env, fileName))
                        evt.ChineseCover = fileName;
                    else
                        ModelState.AddModelError("ChineseCover", "Cover size must be 16:9");
                }
                if (englishCover != null)
                {
                    var fileName = Helper.UploadMedia(englishCover, _env, 1000);
                    if (Helper.ValidateCover(_env, fileName))
                        evt.EnglishCover = fileName;
                    else
                        ModelState.AddModelError("EnglishCover", "Cover size must be 16:9");
                }
                if (!ModelState.IsValid) return View(evt);

                evt.ChineseDetails = EventConvert(evt.ChineseDetails);
                evt.EnglishDetails = EventConvert(evt.EnglishDetails);
                evt.ChineseTags = evt.ChineseTags?.Replace(", ", ",").Replace("，", ",").Replace("， ", ",");
                evt.EnglishTags = evt.EnglishTags?.Replace(", ", ",").Replace("，", ",").Replace("， ", ",");
                _context.Add(evt);
                await _context.SaveChangesAsync();
                if (isTop != null)
                {
                    _context.Top.ToList().ForEach(p => _context.Top.Remove(p));
                    _context.Add(new Top() { ItemId = evt.Id, Type = DiscoverViewModelType.Event });
                }
                await _context.SaveChangesAsync();
                return RedirectToAction("index", "discover", new { type = DiscoverViewModelType.Event });
            }
            ViewBag.Countries = _context.Countries.Select(c => new SelectListItem { Value = c.Id.ToString(), Text = $"{c.Name} - {c.ZhName}" }).ToList();
            return View(evt);
        }

        // GET: event/edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var evt = await _context.Events.Include(p => p.Country).SingleOrDefaultAsync(m => m.Id == id);
            ViewBag.Countries = _context.Countries.Select(c => new SelectListItem { Value = c.Id.ToString(), Text = $"{c.Name} - {c.ZhName}", Selected = c.Id == evt.Country.Id }).ToList();
            if (evt == null)
            {
                return NotFound();
            }
            return View(evt);
        }

        // POST: event/edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(
            int id, [Bind("Id,ChineseName,EnglishName,ChineseCity,EnglishCity,ChineseAddress,EnglishAddress,StartTime,EndTime," +
            "ChineseCover,EnglishCover,ChineseDetails,EnglishDetails,ChineseOrganizers,EnglishOrganizers,ChineseTags,EnglishTags,IsFree")] Event evt, 
            int countryId, IFormFile chineseCover, IFormFile englishCover, string isTop)
        {
            if (id != evt.Id)
            {
                return NotFound();
            }
            ViewBag.IsTop = isTop != null;
            var country = _context.Countries.FirstOrDefault(p => p.Id == countryId);
            if (country == null)
            {
                ModelState.AddModelError("Country", "The Country field is required.");
            }
            evt.Country = country;
            if (ModelState.IsValid)
            {
                if (evt.EndTime <= evt.StartTime)
                {
                    ModelState.AddModelError("EndTime", "End Time must be after the Start Time.");
                }
                if (chineseCover != null)
                {
                    var fileName = Helper.UploadMedia(chineseCover, _env, 1000);
                    if (Helper.ValidateCover(_env, fileName))
                    {
                        if (!string.IsNullOrEmpty(evt.ChineseCover))
                            System.IO.File.Delete(Path.Combine(_env.ContentRootPath, "wwwroot/upload", evt.ChineseCover));
                        evt.ChineseCover = fileName;
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
                        if (!string.IsNullOrEmpty(evt.EnglishCover))
                            System.IO.File.Delete(Path.Combine(_env.ContentRootPath, "wwwroot/upload", evt.EnglishCover));
                        evt.EnglishCover = fileName;
                    }
                    else
                    {
                        ModelState.AddModelError("EnglishCover", "Cover size must be 16:9");
                    }
                }
                if (!ModelState.IsValid) return View(evt);
                try
                {
                    evt.ChineseDetails = EventConvert(evt.ChineseDetails);
                    evt.EnglishDetails = EventConvert(evt.EnglishDetails);
                    evt.ChineseTags = evt.ChineseTags?.Replace(", ", ",").Replace("，", ",").Replace("， ", ",");
                    evt.EnglishTags = evt.EnglishTags?.Replace(", ", ",").Replace("，", ",").Replace("， ", ",");
                    
                    _context.Update(evt);
                    if (isTop != null)
                    {
                        _context.Top.ToList().ForEach(p => _context.Top.Remove(p));
                        _context.Add(new Top() { ItemId = evt.Id, Type = DiscoverViewModelType.Event });
                    }
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
                return RedirectToAction("Details", new { id });
            }
            ViewBag.Countries = _context.Countries.Select(c => new SelectListItem { Value = c.Id.ToString(), Text = $"{c.Name} - {c.ZhName}" }).ToList();
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
            return RedirectToAction("index", "discover", new { type = DiscoverViewModelType.Event });
        }

        private bool EventExists(int id)
        {
            return _context.Events.Any(e => e.Id == id);
        }

        private static string EventConvert(string input)
        {
            input = Regex.Replace(input, @"<!\-\-\[if gte mso 9\]>[\s\S]*<!\[endif\]\-\->", ""); //删除 ms office 注解
            input = Regex.Replace(input, "src=\".*/upload", "data-original=\"/upload"); //替换上传图片的链接
            input = Regex.Replace(input, "<img src=", "<img data-original="); //替换外部图片的链接
            return input;
        }
    }
}
