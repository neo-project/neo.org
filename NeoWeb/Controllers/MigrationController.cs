using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class MigrationController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
