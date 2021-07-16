using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class AboutController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
