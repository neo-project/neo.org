using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class AboutController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
