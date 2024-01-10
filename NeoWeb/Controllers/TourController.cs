using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class TourController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
