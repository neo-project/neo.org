using Microsoft.AspNetCore.Mvc;
using System.IO;

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