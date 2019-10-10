using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class PressKitController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Demo()
        {
            return View();
        }
    }
}