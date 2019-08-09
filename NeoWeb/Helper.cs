using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;
using static System.Text.RegularExpressions.Regex;

namespace NeoWeb
{
    public static class Helper
    {
        public static string CurrentDirectory;

        public static string ClearHtmlTag(this string html)
        {
            html = Replace(html, @"<!\-\-\[if gte mso 9\]>[\s\S]*<!\[endif\]\-\->", "");
            html = Replace(html, "<[^>]+>", "");
            html = Replace(html, "&[^;]+;", "");
            return html;
        }

        public static string ToPubDate(this DateTime Date)
        {
            string ReturnString = Date.DayOfWeek.ToString().Substring(0, 3) + ", ";
            ReturnString += Date.Day + " ";
            ReturnString += CultureInfo.CreateSpecificCulture("en-us").DateTimeFormat.GetAbbreviatedMonthName(Date.Month) + " ";
            ReturnString += Date.Year + " ";
            ReturnString += $"{Date.TimeOfDay.Hours}:{Date.TimeOfDay.Minutes}:{Date.TimeOfDay.Seconds} GMT";
            return ReturnString;
        }

        public static string UploadMedia(IFormFile cover, IHostingEnvironment env, int? maxWidth = null)
        {
            if (cover.Length > 1024 * 1024 * 25 || // 25Mb
                !new string[]
                {
                    ".gif",
                    ".jpg",
                    ".png"
                }
                .Contains(Path.GetExtension(cover.FileName).ToLowerInvariant()))
            {
                throw new ArgumentException(nameof(cover));
            }

            var random = new Random();
            var bytes = new byte[10];
            random.NextBytes(bytes);
            var newName = bytes.ToHexString() + Path.GetExtension(cover.FileName);
            var filePath = Path.Combine(env.ContentRootPath, "wwwroot/upload", newName);
            if (cover.Length > 0)
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    cover.CopyTo(stream);
                }
            }
            if (maxWidth != null)
            {
                Task.Run(() =>
                {
                    using (Image<Rgba32> image = Image.Load(filePath))
                    {
                        image.Mutate(x => x.Resize(new ResizeOptions
                        {
                            Size = new Size((int)maxWidth, (int)maxWidth * image.Height / image.Width),
                            Mode = ResizeMode.Max
                        }));
                        image.Save(filePath);
                    }
                });
            }
            return newName;
        }

        public static bool Contains(this string source, string toCheck, StringComparison comp)
        {
            return source.IndexOf(toCheck, comp) >= 0;
        }

        public static string ClearHtmlTag(this string html, int length)
        {
            html = html.ClearHtmlTag();
            if (length > 0 && html.Length > length)
            {
                html = html.Substring(0, length);
            }
            return html;
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
            string[] months = { "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" };
            return (month > 12 || month < 1) ? "ERROR" : months[month - 1];
        }

        public static string Sha256(this string input)
        {
            SHA256 obj = SHA256.Create();
            return BitConverter.ToString(obj.ComputeHash(Encoding.UTF8.GetBytes(input))).Replace("-", "");
        }

        class IPItem
        {
            public string IP;
            public string Action;
            public DateTime Time;
        }

        private static List<IPItem> IPList = new List<IPItem>();

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

        public static string ToHexString(this byte[] bytes) => BitConverter.ToString(bytes).Replace("-", "");

        public static bool VerifySignature(string message, string signature, string pubkey)
        {
            var msg = Encoding.Default.GetBytes(message);
            try
            {
                return VerifySignature(msg, signature.HexToBytes(), pubkey.HexToBytes());
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static byte[] HexToBytes(this string value)
        {
            if (value == null || value.Length == 0)
                return new byte[0];
            if (value.Length % 2 == 1)
                throw new FormatException();
            byte[] result = new byte[value.Length / 2];
            for (int i = 0; i < result.Length; i++)
                result[i] = byte.Parse(value.Substring(i * 2, 2), NumberStyles.AllowHexSpecifier);
            return result;
        }

        //reference https://github.com/neo-project/neo/blob/master/neo/Cryptography/Crypto.cs
        public static bool VerifySignature(byte[] message, byte[] signature, byte[] pubkey)
        {
            if (pubkey.Length == 33 && (pubkey[0] == 0x02 || pubkey[0] == 0x03))
            {
                try
                {
                    pubkey = ThinNeo.Cryptography.ECC.ECPoint.DecodePoint(pubkey, ThinNeo.Cryptography.ECC.ECCurve.Secp256r1).EncodePoint(false).Skip(1).ToArray();
                }
                catch
                {
                    return false;
                }
            }
            else if (pubkey.Length == 65 && pubkey[0] == 0x04)
            {
                pubkey = pubkey.Skip(1).ToArray();
            }
            else if (pubkey.Length != 64)
            {
                throw new ArgumentException();
            }
            using (var ecdsa = ECDsa.Create(new ECParameters
            {
                Curve = ECCurve.NamedCurves.nistP256,
                Q = new ECPoint
                {
                    X = pubkey.Take(32).ToArray(),
                    Y = pubkey.Skip(32).ToArray()
                }
            }))
            {
                return ecdsa.VerifyData(message, signature, HashAlgorithmName.SHA256);
            }
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
                return "";
#endif

#if !DEBUG
            return "https://neo-cdn.azureedge.net";
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

    }
}
