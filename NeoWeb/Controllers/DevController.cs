using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class DevController : Controller
    {

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Bounty()
        {
            return View();
        }
    }
}