using Microsoft.AspNetCore.Mvc;
using NeoWeb.Models;

namespace NeoWeb.Controllers
{
    public class RedirectController : Controller
    {
        [Route("testnet")]
        [Route("testnet/index")]
        public IActionResult DevIndex()
        {
            return RedirectToAction("index", "dev");
        }
        
        [Route("testnet/list")]
        public IActionResult TestCoinList()
        {
            return RedirectToAction("list", "testcoin");
        }

        [Route("download")]
        [Route("download/index")]
        public IActionResult ClientIndex()
        {
            return RedirectToAction("index", "client");
        }

        [Route("testcoin")]
        [Route("testnet/create")]
        [Route("testnet/apply")]
        public IActionResult TestCoinApply()
        {
            return RedirectToAction("apply", "testcoin");
        }
        
        [Route("testnet/bounty")]
        public IActionResult DevBounty()
        {
            return RedirectToAction("bounty", "dev");
        }

        [Route("home/team")]
        public IActionResult Team()
        {
            return RedirectToAction("index", "team");
        }

        [Route("blog")]
        [Route("blog/index")]
        public IActionResult Blog()
        {
            return RedirectToAction("index", "discover", new { type = (int)DiscoverViewModelType.Blog });
        }

        [Route("event")]
        [Route("event/index")]
        public IActionResult Event()
        {
            return RedirectToAction("index", "discover", new { type = (int)DiscoverViewModelType.Event });
        }

        [Route("news")]
        [Route("news/index")]
        public IActionResult News()
        {
            return RedirectToAction("index", "discover", new { type = (int)DiscoverViewModelType.News });
        }

        [Route("dapp")]
        [Route("dapps")]
        public IActionResult Dapps()
        {
            return Redirect("http://ndapp.org");
        }
    }
}