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
    public class GovController() : Controller
    {

        // GET: consensus
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
    }
}
