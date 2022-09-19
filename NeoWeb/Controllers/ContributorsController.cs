using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    [ServiceFilter(typeof(ClientIpCheckActionFilter))]
    public class ContributorsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
