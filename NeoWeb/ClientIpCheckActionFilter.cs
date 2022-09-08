using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace NeoWeb
{
    public class ClientIpCheckActionFilter : ActionFilterAttribute
    {
        public ClientIpCheckActionFilter(string fileName)
        {
            if (Helper.Banlist.Count > 0) return;
            var temp = System.IO.File.ReadAllLines(fileName).ToList();
            foreach (var item in temp)
            {
                var start = item.Split('\t')[0].IPToInteger();
                var end = item.Split('\t')[1].IPToInteger();
                Helper.Banlist.Add(new IPZone(start, end));
            }
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var remoteIp = context.HttpContext.Connection.RemoteIpAddress;

            remoteIp = remoteIp.IsIPv4MappedToIPv6 ? remoteIp.MapToIPv4() : remoteIp;
            var ipInteger = remoteIp.IPToInteger();

            if (Helper.Banlist.Any(p => ipInteger > p.Start && ipInteger < p.End))
            {
                context.Result = new ViewResult() { ViewName = "403", StatusCode = 403 };
                return;
            }

            base.OnActionExecuting(context);
        }
    }

    public class IPZone
    {
        public IPZone(long start, long end)
        {
            Start = start;
            End = end;
        }

        public long Start { get; set; }
        public long End { get; set; }
    }
}
