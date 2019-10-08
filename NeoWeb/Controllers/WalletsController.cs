using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class WalletsController : Controller
    {
        // GET: client
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
    }
}