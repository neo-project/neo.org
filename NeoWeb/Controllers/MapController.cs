using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class MapController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
