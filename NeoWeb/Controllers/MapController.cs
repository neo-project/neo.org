using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class MapController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
