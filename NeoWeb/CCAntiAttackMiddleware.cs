
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace NeoWeb
{
    public class CCAntiAttackMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IMemoryCache _cache;
        private readonly ConcurrentDictionary<string, int> _requestCounts;

        private const int MaxRequestsPerMinute = 20;
        private const int BlockDurationMinutes = 10;

        public CCAntiAttackMiddleware(RequestDelegate next, IMemoryCache cache)
        {
            _next = next;
            _cache = cache;
            _requestCounts = new ConcurrentDictionary<string, int>();
        }

        public async Task Invoke(HttpContext context)
        {
            var ipAddress = context.Connection.RemoteIpAddress?.ToString();

            if (!string.IsNullOrEmpty(ipAddress))
            {
                var requestCount = _requestCounts.AddOrUpdate(ipAddress, 1, (_, count) => count + 1);

                if (requestCount > MaxRequestsPerMinute)
                {
                    var blockExpiration = _cache.Get<DateTimeOffset?>(ipAddress);

                    if (blockExpiration == null || blockExpiration <= DateTimeOffset.Now)
                    {
                        blockExpiration = DateTimeOffset.Now.AddMinutes(BlockDurationMinutes);
                        _cache.Set(ipAddress, blockExpiration, blockExpiration.Value);
                    }

                    context.Response.StatusCode = 429; // Too Many Requests
                    context.Response.Headers.Add("Retry-After", blockExpiration.Value.ToString("R"));
                    context.Response.ContentType = "text/html";
                    await context.Response.WriteAsync(System.IO.File.ReadAllText("Views/Shared/429.cshtml"));

                    return;
                }
            }

            await _next(context);
        }
    }

    public static class CCAntiAttackMiddlewareExtensions
    {
        public static IApplicationBuilder UseCCAntiAttackMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<CCAntiAttackMiddleware>();
        }
    }

}
