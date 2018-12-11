using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class TeamController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}