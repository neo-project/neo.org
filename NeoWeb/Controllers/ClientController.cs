using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class ClientController : Controller
    {
        // GET: client
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
    }
}