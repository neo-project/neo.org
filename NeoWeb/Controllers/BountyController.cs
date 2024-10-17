using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class BountyController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
