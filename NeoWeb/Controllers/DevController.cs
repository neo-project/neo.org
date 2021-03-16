using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class DevController : Controller
    {

        [HttpGet]
        public IActionResult Index()
        {
            ViewBag.MenuIndex = 0;
            return View();
        }

        [HttpGet]
        public IActionResult Tooling()
        {
            ViewBag.MenuIndex = 1;
            return View();
        }

        [HttpGet]
        public IActionResult Tutorials()
        {
            ViewBag.MenuIndex = 2;
            return View();
        }

    }
}
