using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using NeoWeb.Data;
using NeoWeb.Models;
using Newtonsoft.Json.Linq;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class GovController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _accessor;
        private readonly IStringLocalizer<GovController> _localizer;
        private readonly IWebHostEnvironment _env;

        public GovController(ApplicationDbContext context, IStringLocalizer<GovController> localizer, IHttpContextAccessor accessor, IWebHostEnvironment env)
        {
            _context = context;
            _accessor = accessor;
            _localizer = localizer;
            _env = env;
        }

        // GET: consensus
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
    }
}
