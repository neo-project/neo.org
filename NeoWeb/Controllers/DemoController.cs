using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class DemoController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
    }
}