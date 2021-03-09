using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class Platform : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
