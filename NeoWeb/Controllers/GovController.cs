using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class GovController() : Controller
    {
        // GET: consensus
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
    }
}
