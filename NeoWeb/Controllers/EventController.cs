using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NeoWeb.Data;
using NeoWeb.Models;

namespace NeoWeb.Controllers
{
    [Authorize(Roles = "Admin")]
    public class EventController : Controller
    {
        private readonly ApplicationDbContext _context;
        private string _userId;
        private bool _userRules;

        public EventController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (_userId != null)
            {
                _userRules = _context.UserRoles.Any(p => p.UserId == _userId);
            }
        }

        // GET: Event
        [AllowAnonymous]
        public IActionResult Index(string id)
        {
            var models = _context.Events.OrderBy(o => o.StartTime).Select(p => new
            {
                p.Id,
                p.Name,
                p.Type,
                p.Country,
                p.City,
                p.Address,
                p.StartTime,
                p.EndTime,
                p.Cover,
                p.Organizers,
                p.IsFree,
                p.ThirdPartyLink
            }).ToList().Select(p => new Event()
            {
                Id = p.Id,
                Name = p.Name,
                Type = p.Type,
                Country = p.Country,
                City = p.City,
                Address = p.Address,
                StartTime = p.StartTime,
                EndTime = p.EndTime,
                Cover = p.Cover,
                Organizers = p.Organizers,
                IsFree = p.IsFree,
                ThirdPartyLink = p.ThirdPartyLink
            });
            ViewBag.AllFeatureEvent = models.Where(p => p.EndTime.Date >= DateTime.Now);
            ViewBag.UserRules = _userRules;
            switch (id)
            {
                case "showall": break;
                case "devcon": models = models.Where(p => p.Type == EventType.DevCon); break;
                case "meetup": models = models.Where(p => p.Type == EventType.Meetup); break;
                case "workshop": models = models.Where(p => p.Type == EventType.Workshop); break;
                case "hackathon": models = models.Where(p => p.Type == EventType.Hackathon); break;
                default: models = models.Where(p => p.EndTime >= DateTime.Now); break;
            }
            models = int.TryParse(id, out int month) ? models.Where(p => p.EndTime.Date >= DateTime.Now && p.StartTime.Month == month) : models;
            return View(models);
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public IActionResult Search(string keyword)
        {
            var models = _context.Events.OrderBy(o => o.StartTime).Select(p => new
            {
                p.Id,
                p.Name,
                p.Type,
                p.Country,
                p.City,
                p.Address,
                p.StartTime,
                p.EndTime,
                p.Cover,
                p.Organizers,
                p.IsFree,
                p.ThirdPartyLink
            }).ToList().Select(p => new Event()
            {
                Id = p.Id,
                Name = p.Name,
                Type = p.Type,
                Country = p.Country,
                City = p.City,
                Address = p.Address,
                StartTime = p.StartTime,
                EndTime = p.EndTime,
                Cover = p.Cover,
                Organizers = p.Organizers,
                IsFree = p.IsFree,
                ThirdPartyLink = p.ThirdPartyLink
            });
            var keywords = keyword.Split(" ");
            foreach (var item in keywords)
            {
                switch (item)
                {
                    case "devcon": models = models.Where(p => p.Type == EventType.DevCon); break;
                    case "meetup": models = models.Where(p => p.Type == EventType.Meetup); break;
                    case "workshop": models = models.Where(p => p.Type == EventType.Workshop); break;
                    case "hackathon": models = models.Where(p => p.Type == EventType.Hackathon); break;
                    default: models = models.Where(p => p.Name.Contains(item) 
                    || p.Country.Name.Contains(item)
                    || p.Country.ZhName.Contains(item)
                    || p.City.Contains(item)
                    || p.Address.Contains(item)
                    || p.Organizers.Contains(item)); break;
                }
            }
            ViewBag.UserRules = _userRules;
            return View(models);
        }

        // GET: Event/Details/5
        [AllowAnonymous]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            ViewBag.UserRules = _userRules;
            var @event = await _context.Events.Include(m => m.Country)
                .SingleOrDefaultAsync(m => m.Id == id);
            if (@event == null)
            {
                return NotFound();
            }

            return View(@event);
        }

        // GET: Event/Create
        public IActionResult Create()
        {
            ViewBag.Countries = _context.Countries.ToList();
            return View();
        }

        // POST: Event/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,City,Type,Address,StartTime,EndTime,Cover,Details,Organizers,IsFree,ThirdPartyLink")] Event @event, int countryId, IFormFile cover)
        {
            var country = _context.Countries.FirstOrDefault(p => p.Id == countryId);
            if (country == null)
            {
                ModelState.AddModelError("Country", "国家错误");
            }
            @event.Country = country;
            if (@event.EndTime <= @event.StartTime)
            {
                ModelState.AddModelError("EndTime", "截止时间错误");
            }
            if (!@event.IsFree && @event.ThirdPartyLink == null)
            {
                ModelState.AddModelError("ThirdPartyLink", "付费活动需要填写购票链接");
            }
            if (ModelState.IsValid)
            {
                if(cover != null)
                {
                    @event.Cover = Upload(cover);
                }
                _context.Add(@event);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewBag.Countries = _context.Countries.ToList();
            return View(@event);
        }

        public string Upload(IFormFile cover)
        {
            var random = new Random();
            var bytes = new byte[10];
            random.NextBytes(bytes);
            var newName = bytes.ToHexString() + Path.GetExtension(cover.FileName);
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/upload", newName);
            if (cover.Length > 0)
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    cover.CopyTo(stream);
                }
            }
            return newName;
        }

        // GET: Event/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            ViewBag.Countries = _context.Countries.ToList();
            if (id == null)
            {
                return NotFound();
            }

            var @event = await _context.Events.SingleOrDefaultAsync(m => m.Id == id);
            if (@event == null)
            {
                return NotFound();
            }
            return View(@event);
        }

        // POST: Event/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,City,Type,Address,StartTime,EndTime,Cover,Details,Organizers,IsFree,ThirdPartyLink")] Event @event, int countryId, IFormFile cover)
        {
            if (id != @event.Id)
            {
                return NotFound();
            }
            var country = _context.Countries.FirstOrDefault(p => p.Id == countryId);
            if (country == null)
            {
                ModelState.AddModelError("Country", "国家错误");
            }
            @event.Country = country;
            if (@event.EndTime <= @event.StartTime)
            {
                ModelState.AddModelError("EndTime", "截止时间错误");
            }
            if (!@event.IsFree && @event.ThirdPartyLink == null)
            {
                ModelState.AddModelError("ThirdPartyLink", "付费活动需要填写购票链接");
            }
            if (ModelState.IsValid)
            {
                try
                {
                    if (cover != null)
                    {
                        if(!String.IsNullOrEmpty(@event.Cover))
                            System.IO.File.Delete(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/upload", @event.Cover));
                        @event.Cover = Upload(cover);
                    }
                    _context.Update(@event);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EventExists(@event.Id))
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
            return View(@event);
        }

        // GET: Event/Delete/5
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

        // POST: Event/Delete/5
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
    }
}
