using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class EcoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
