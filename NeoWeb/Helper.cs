using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Neo;
using NeoWeb.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using static System.Text.RegularExpressions.Regex;

namespace NeoWeb
{
    public static class Helper
    {
        public static string CurrentDirectory { set; get; }

        public static List<IPZone> Banlist = [];

        public static void AddBlogs(IQueryable<Blog> blogs, List<NewsViewModel> viewModels, bool isZh)
        {
            blogs.Select(p => new BlogViewModel()
            {
                Id = p.Id,
                CreateTime = p.CreateTime,
                Title = isZh ? p.ChineseTitle : p.EnglishTitle,
                Summary = isZh ? p.ChineseSummary : p.EnglishSummary,
                Tags = isZh ? p.ChineseTags : p.EnglishTags,
                Cover = isZh ? p.ChineseCover : p.EnglishCover,
                IsShow = p.IsShow
            }).ToList().ForEach(p => viewModels.Add(new NewsViewModel()
            {
                Type = NewsViewModelType.Blog,
                Blog = p,
                Time = p.CreateTime
            }));
        }

        public static void AddEvents(IQueryable<Event> events, List<NewsViewModel> viewModels, bool isZh)
        {
            events.Select(p => new EventViewModel()
            {
                Id = p.Id,
                StartTime = p.StartTime,
                EndTime = p.EndTime,
                Name = isZh ? p.ChineseName : p.EnglishName,
                Tags = isZh ? p.ChineseTags : p.EnglishTags,
                Country = isZh ? p.Country.ZhName : p.Country.Name,
                City = isZh ? p.ChineseCity : p.EnglishCity,
                Cover = isZh ? p.ChineseCover : p.EnglishCover
            }).ToList().ForEach(p => viewModels.Add(new NewsViewModel()
            {
                Type = NewsViewModelType.Event,
                Event = p,
                Time = p.StartTime
            }));
        }

        public static void AddMedia(IQueryable<Media> media, List<NewsViewModel> viewModels, bool isZh)
        {
            media.Select(p => new MediaViewModel()
            {
                Id = p.Id,
                Time = p.Time,
                Link = p.Link,
                Cover = isZh ? p.ChineseCover : p.EnglishCover,
                Title = isZh ? p.ChineseTitle : p.EnglishTitle,
                Tags = isZh ? p.ChineseTags : p.EnglishTags
            }).ToList().ForEach(p => viewModels.Add(new NewsViewModel()
            {
                Type = NewsViewModelType.Media,
                Media = p,
                Time = p.Time
            }));
        }

        public static string ClearHtmlTag(this string html)
        {
            html = Replace(html, @"<!\-\-\[if gte mso 9\]>[\s\S]*<!\[endif\]\-\->", "");
            html = Replace(html, "<[^>]+>", "");
            html = Replace(html, "&[^;]+;", "");
            return html;
        }

        public static string ToPubDate(this DateTime Date)
        {
            string ReturnString = string.Concat(Date.DayOfWeek.ToString().AsSpan(0, 3), ", ");
            ReturnString += Date.Day + " ";
            ReturnString += CultureInfo.CreateSpecificCulture("en-us").DateTimeFormat.GetAbbreviatedMonthName(Date.Month) + " ";
            ReturnString += Date.Year + " ";
            ReturnString += $"{Date.TimeOfDay.Hours}:{Date.TimeOfDay.Minutes}:{Date.TimeOfDay.Seconds} GMT";
            return ReturnString;
        }

        public static string UploadMedia(IFormFile cover, IWebHostEnvironment env, int? maxWidth = null)
        {
            if (cover.Length > 1024 * 1024 * 10 || // 10Mb
                !new string[]
                {
                    ".gif",
                    ".jpeg",
                    ".jpg",
                    ".png"
                }
                .Contains(Path.GetExtension(cover.FileName).ToLowerInvariant()))
            {
                throw new ArgumentException(null, nameof(cover));
            }
            var bytes = new byte[10];
            string newName, filePath;
            do
            {
                new Random().NextBytes(bytes);
                newName = $"{bytes.ToHexString()}.jpg";
                filePath = Path.Combine(env.ContentRootPath, "wwwroot/upload", newName);
            }
            while (File.Exists(filePath));

            if (cover.Length > 0)
            {
                using var stream = new FileStream(filePath, FileMode.CreateNew);
                cover.CopyTo(stream);
            }
            if (maxWidth != null)
            {
                using var image = Image.Load(filePath);
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new Size((int)maxWidth, (int)maxWidth * image.Height / image.Width),
                    Mode = ResizeMode.Max
                }));
                image.Save(filePath, new JpegEncoder() { Quality = 75, SkipMetadata = true });
            }
            return newName;
        }

        public static string UploadFile(IFormFile file, IWebHostEnvironment env)
        {
            if (file.Length > 1024 * 1024 * 10 || // 10Mb
                !new string[]
                {
                    ".pdf",
                    ".docx",
                    ".doc",
                    ".jpeg",
                    ".jpg",
                    ".png",
                    ".zip",
                    ".rar"
                }
                .Contains(Path.GetExtension(file.FileName).ToLowerInvariant()))
            {
                throw new ArgumentException(null, nameof(file));
            }
            var bytes = new byte[10];
            string newName, filePath;
            do
            {
                new Random().NextBytes(bytes);
                newName = bytes.ToHexString() + Path.GetExtension(file.FileName);
                filePath = Path.Combine(env.ContentRootPath, "wwwroot/upload", newName);
            }
            while (File.Exists(filePath));

            if (file.Length > 0)
            {
                using var stream = new FileStream(filePath, FileMode.CreateNew);
                file.CopyTo(stream);
            }
            return newName;
        }

        public static bool ValidateCover(IWebHostEnvironment env, string fileName)
        {
            var filePath = Path.Combine(env.ContentRootPath, "wwwroot/upload", fileName);
            using var image = Image.Load(filePath);
            return Math.Abs(image.Height - image.Width / 16.0 * 9) < 1;
        }

        public static string ClearHtmlTag(this string html, int length)
        {
            html = html.ClearHtmlTag();
            if (length > 0 && html.Length > length)
            {
                html = html[..length];
            }
            return html.Trim();
        }

        public static string GetLanguage(this string text)
        {
            var lang = "en";
            foreach (var c in text)
            {
                if (c >= 0x4e00 && c <= 0x9fbb)
                    return "zh";
            }
            return lang;
        }

        public static string ToMonth(this int month)
        {
            string[] months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return (month > 12 || month < 1) ? "ERROR" : months[month - 1];
        }

        public static string Sha256(this string input) => BitConverter.ToString(SHA256.HashData(Encoding.UTF8.GetBytes(input))).Replace("-", "");

        private class IPItem
        {
            public string IP;
            public string Action;
            public DateTime Time;
        }

        private static readonly List<IPItem> IPList = [];

        internal static bool CCAttack(IPAddress ip, string action, int interval, int times)
        {
            var ipv4 = ip.MapToIPv4().ToString();
            for (int i = 0; i < IPList.Count; i++)
            {
                var item = IPList[i];
                if (item.Action == action && item.IP == ipv4)
                {
                    if ((DateTime.Now - item.Time).TotalSeconds > interval)
                        IPList.RemoveAt(i--);
                    else
                        continue;
                }
            }
            if (IPList.Count(p => p.IP == ipv4 && p.Action == action) > times)
                return false;
            IPList.Add(new IPItem() { IP = ipv4, Action = action, Time = DateTime.Now });
            return true;
        }

        public static byte[] HexToBytes(this string value)
        {
            if (value == null || value.Length == 0)
                return [];
            if (value.Length % 2 == 1)
                throw new FormatException();
            byte[] result = new byte[value.Length / 2];
            for (int i = 0; i < result.Length; i++)
                result[i] = byte.Parse(value.Substring(i * 2, 2), NumberStyles.AllowHexSpecifier);
            return result;
        }

        /// <summary>
        /// 发布测试版本：在.pubxml文件中添加EnvironmentName元素，并使用Debug模式发布
        /// 发布正式版本：移除.pubxml中的EnvironmentName元素，并使用Release模式发布
        /// http://t.cn/EJ3a5d3
        /// </summary>
        public static string CDN
        {
            get
            {
#if DEBUG
                return string.Empty;
#endif

#if !DEBUG
            return "https://neo-web.azureedge.net";
#endif
            }
        }

        public static string ToCDN(string url, bool appendVersion = false)
        {
            var path = CurrentDirectory + "/wwwroot" + url;
            if (File.Exists(path))
            {
                return appendVersion ? $"{CDN}{url}?v={File.ReadAllText(path).Sha256()}" : $"{CDN}{url}";
            }
            return url;
        }

        public static long IPToInteger(this string ip)
        {
            var x = 3;
            long o = 0;
            ip.Split('.').ToList().ForEach(p => o += Convert.ToInt64(p) << 8 * x--);
            return o;
        }

        public static long IPToInteger(this IPAddress ip)
        {
            var x = 3;
            long o = 0;
            ip.GetAddressBytes().ToList().ForEach(p => o += (long)p << 8 * x--);
            return o;
        }

        public static string Sanitizer(string input)
        {
            input = Replace(input, @"<!\-\-\[if gte mso 9\]>[\s\S]*<!\[endif\]\-\->", ""); //删除 ms office 注解
            input = Replace(input, "src=\".*/upload", "data-original=\"/upload"); //替换上传图片的链接
            input = Replace(input, "<img src=", "<img data-original="); //替换外部图片的链接
            input = Replace(input, @"<p>((&nbsp;\s)|(&nbsp;)|\s)+", "<p>"); //删除段首由空格造成的缩进
            var sanitizer = new Ganss.Xss.HtmlSanitizer();
            sanitizer.AllowedAttributes.Remove("style");
            input = sanitizer.Sanitize(input);
            return input;
        }
    }
}
