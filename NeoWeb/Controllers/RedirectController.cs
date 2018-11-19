using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

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

        [Route("dapp")]
        [Route("dapps")]
        public IActionResult Dapps()
        {
            return Redirect("http://ndapp.org");
        }
    }
}