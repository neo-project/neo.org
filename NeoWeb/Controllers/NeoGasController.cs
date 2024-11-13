using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class NeoGasController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
