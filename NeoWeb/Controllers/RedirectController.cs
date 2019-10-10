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
        [Route("client")]
        [Route("client/index")]
        [Route("wallet")]
        [Route("wallet/index")]
        public IActionResult WalletsIndex()
        {
            return RedirectToAction("index", "wallets");
        }

        [Route("testcoin")]
        [Route("testnet/create")]
        [Route("testnet/apply")]
        public IActionResult TestCoinApply()
        {
            return RedirectToAction("apply", "testcoin");
        }
        
        [Route("testnet/bounty")]
        [Route("dev/bounty")]
        public IActionResult DevBounty()
        {
            return RedirectToAction("index", "bounty");
        }

        [Route("home/team")]
        [Route("team")]
        [Route("team/index")]
        public IActionResult Team()
        {
            return RedirectToAction("index", "contributors");
        }

        [Route("blog")]
        [Route("blog/index")]
        public IActionResult Blog()
        {
            return RedirectToAction("index", "discover", new { type = (int)DiscoverViewModelType.Blog });
        }

        [Route("logo")]
        [Route("logo/index")]
        public IActionResult PressKit()
        {
            return RedirectToAction("index", "presskit");
        }

        [Route("eco/ecoboost")]
        public IActionResult EcoBoost()
        {
            return RedirectToAction("index", "ecoboost");
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