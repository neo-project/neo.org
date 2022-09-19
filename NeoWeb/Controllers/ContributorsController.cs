using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class ContributorsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}