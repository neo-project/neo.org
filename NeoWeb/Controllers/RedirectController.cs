using Microsoft.AspNetCore.Mvc;
using NeoWeb.Models;

namespace NeoWeb.Controllers
{
    public class RedirectController : Controller
    {
        [Route("testnet")]
        [Route("testnet/index")]
        public IActionResult DevIndex() => RedirectToAction("index", "dev");

        [Route("testnet/list")]
        public IActionResult TestCoinList() => RedirectToAction("list", "testcoin");

        [Route("download")]
        [Route("download/index")]
        [Route("client")]
        [Route("client/index")]
        [Route("wallet")]
        [Route("wallet/index")]
        public IActionResult WalletsIndex() => RedirectToAction("index", "wallets");

        [Route("testcoin")]
        [Route("testnet/create")]
        [Route("testnet/apply")]
        public IActionResult TestCoinApply() => RedirectToAction("apply", "testcoin");

        [Route("testnet/bounty")]
        [Route("dev/bounty")]
        public IActionResult DevBounty() => RedirectToAction("index", "bounty");

        [Route("home/team")]
        [Route("team")]
        [Route("team/index")]
        [Route("contributor")]
        [Route("contributor/index")]
        public IActionResult Team() => RedirectToAction("index", "contributors");

        [Route("blog")]
        [Route("blog/index")]
        public IActionResult Blog() => RedirectToAction("index", "discover", new { type = (int)DiscoverViewModelType.Blog });

        [Route("logo")]
        [Route("logo/index")]
        public IActionResult PressKit() => RedirectToAction("index", "presskit");

        [Route("eco/ecoboost")]
        [Route("ecoboost")]
        [Route("ecoboost/index")]
        public IActionResult Eco() => RedirectToAction("index", "eco");

        [Route("event")]
        [Route("event/index")]
        public IActionResult Event() => RedirectToAction("index", "discover", new { type = (int)DiscoverViewModelType.Event });

        [Route("news")]
        [Route("news/index")]
        public IActionResult News() => RedirectToAction("index", "discover", new { type = (int)DiscoverViewModelType.News });

        [Route("dapp")]
        [Route("dapps")]
        public IActionResult Dapps() => Redirect("http://ndapp.org");

        [Route("consensus")]
        [Route("consensus/index")]
        public IActionResult Gov() => RedirectToAction("index", "gov");
    }
}
