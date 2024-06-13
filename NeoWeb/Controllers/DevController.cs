using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class DevController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            ViewBag.MenuIndex = 0;
            return View();
        }
    }
}
