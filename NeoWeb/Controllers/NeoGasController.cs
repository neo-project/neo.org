using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class NeoGasController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
