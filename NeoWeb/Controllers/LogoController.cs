using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class LogoController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
    }
}