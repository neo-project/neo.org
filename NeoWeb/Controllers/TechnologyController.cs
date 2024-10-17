using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class TechnologyController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
