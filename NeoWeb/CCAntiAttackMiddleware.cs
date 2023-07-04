
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using NBitcoin;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb
{
    public class CCAntiAttackMiddleware
    {
        private RequestDelegate _next;
        private List<RequestItem> _requestList;
        private List<BlockItem> _blockList;

        private const int MaxRequestsPerMinute = 20;
        private const int BlockDurationMinutes = 10;

        public CCAntiAttackMiddleware(RequestDelegate next, IMemoryCache cache)
        {
            _next = next;
            _requestList = new List<RequestItem> { };
            _blockList = new List<BlockItem> { };
        }

        public async Task Invoke(HttpContext context)
        {
            var ipAddress = context.Connection.RemoteIpAddress?.ToString();
            _requestList.RemoveAll(p => p?.DateTime < DateTime.UtcNow.AddMinutes(-1));
            _blockList.RemoveAll(p => p?.DateTime < DateTime.UtcNow);

            if (!string.IsNullOrEmpty(ipAddress))
            {
                var block = _blockList.FirstOrDefault(p => p?.IP == ipAddress);
                _requestList.Add(new RequestItem() { IP = ipAddress, DateTime = DateTime.UtcNow });
                var requestsPerMinute = _requestList.Count(p => p?.IP == ipAddress);
                if (block is not null)
                {
                    context.Response.StatusCode = 429; // Too Many Requests
                    context.Response.Headers.Add("Retry-After", block.DateTime.ToString("R"));
                    context.Response.ContentType = "text/html";
                    await context.Response.WriteAsync(string.Format(System.IO.File.ReadAllText("wwwroot/429.html"), (int)(block.DateTime - DateTime.UtcNow).TotalSeconds, ipAddress, block.DateTime.ToString("R")));
                    return;
                }
                else if (requestsPerMinute > MaxRequestsPerMinute)
                {
                    var blockTime = DateTime.UtcNow.AddMinutes(BlockDurationMinutes);
                    _blockList.Add(new BlockItem() { IP = ipAddress, DateTime = blockTime });
                    context.Response.StatusCode = 429; // Too Many Requests
                    context.Response.Headers.Add("Retry-After", blockTime.ToString("R"));
                    context.Response.ContentType = "text/html";
                    await context.Response.WriteAsync(string.Format(System.IO.File.ReadAllText("wwwroot/429.html"), (int)(blockTime - DateTime.UtcNow).TotalSeconds, ipAddress, blockTime.ToString("R")));
                    return;
                }
            }

            await _next(context);
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

    public static class CCAntiAttackMiddlewareExtensions
    {
        public static IApplicationBuilder UseCCAntiAttackMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<CCAntiAttackMiddleware>();
        }
    }

}
