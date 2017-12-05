using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class DownloadController : Controller
    {
        // GET: Download  
        public IActionResult Index()
        {
            return View();
        }
    }
}