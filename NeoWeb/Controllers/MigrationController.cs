using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class MigrationController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
