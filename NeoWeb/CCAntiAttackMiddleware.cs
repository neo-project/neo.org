using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb
{
    public class CCAntiAttackMiddleware(RequestDelegate next)
    {
        private readonly List<RequestItem> _requestList = [];
        private readonly List<BlockItem> _blockList = [];

        private const int MaxRequestsPerMinute = 10;
        private const int BlockDurationMinutes = 10;

        public async Task Invoke(HttpContext context)
        {
            var ipAddress = context.Connection.RemoteIpAddress?.ToString();
            if (!string.IsNullOrEmpty(ipAddress) && System.IO.File.ReadAllLines("whitelist.txt").All(p => p != ipAddress))
            {
                CleanUpExpiredRequestsAndBlocks();

                var block = _blockList.FirstOrDefault(p => p?.IP == ipAddress);
                var requestsPerMinute = _requestList.Count(p => p?.IP == ipAddress);

                if (block is not null)
                {
                    await HandleBlockedRequest(context, block);
                    return;
                }

                if (requestsPerMinute > MaxRequestsPerMinute * 2 /*Request & Response*/)
                {
                    await HandleExceededRequestLimit(context, ipAddress);
                    return;
                }

                _requestList.Add(new RequestItem { IP = ipAddress, DateTime = DateTime.UtcNow });
            }

            await next(context);
        }

        private void CleanUpExpiredRequestsAndBlocks()
        {
            var utcNow = DateTime.UtcNow;
            _requestList.RemoveAll(p => p == null || p?.DateTime < utcNow.AddMinutes(-1));
            _blockList.RemoveAll(p => p == null || p?.DateTime < utcNow);
        }

        private static async Task HandleBlockedRequest(HttpContext context, BlockItem block)
        {
            context.Response.StatusCode = 429; // Too Many Requests
            context.Response.Headers.Append("Retry-After", block.DateTime.ToString("R"));
            context.Response.ContentType = "text/html";
            await context.Response.WriteAsync(string.Format(System.IO.File.ReadAllText("wwwroot/429.html"), (int)(block.DateTime - DateTime.UtcNow).TotalSeconds, block.IP, block.DateTime.ToString("R")));
        }

        private async Task HandleExceededRequestLimit(HttpContext context, string ipAddress)
        {
            var blockTime = DateTime.UtcNow.AddMinutes(BlockDurationMinutes);
            _blockList.Add(new BlockItem { IP = ipAddress, DateTime = blockTime });
            context.Response.StatusCode = 429; // Too Many Requests
            context.Response.Headers.Append("Retry-After", blockTime.ToString("R"));
            context.Response.ContentType = "text/html";
            await context.Response.WriteAsync(string.Format(System.IO.File.ReadAllText("wwwroot/429.html"), (int)(blockTime - DateTime.UtcNow).TotalSeconds, ipAddress, blockTime.ToString("R")));
        }
    }

    public class RequestItem
    {
        public string IP { get; set; }
        public DateTime DateTime { get; set; } //访问时间
    }

    public class BlockItem
    {
        public string IP { get; set; }
        public DateTime DateTime { get; set; } //阻止访问的截止时间
    }
}
