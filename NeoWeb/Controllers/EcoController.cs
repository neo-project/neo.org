using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class EcoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
