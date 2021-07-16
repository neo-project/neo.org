using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class TechnologyController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
