using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class DAppsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}