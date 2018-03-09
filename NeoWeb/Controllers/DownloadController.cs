using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace NeoWeb.Controllers
{
    public class DownloadController : Controller
    {
        // GET: Download  
        public IActionResult Index()
        {
            FileInfo fi = new FileInfo(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/client/chain.acc.zip"));
            ViewBag.MainNetCreationTime = fi.Exists ? fi.LastWriteTime.ToString() : "";

            fi = new FileInfo(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/client/chain.acc.test.zip"));
            ViewBag.TestNetCreationTime = fi.Exists ? fi.LastWriteTime.ToString() : "";
            return View();
        }
    }
}