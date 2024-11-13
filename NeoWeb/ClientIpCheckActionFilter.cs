using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;

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

    public class IPZone(long start, long end)
    {
        public long Start { get; set; } = start;
        public long End { get; set; } = end;
    }
}
