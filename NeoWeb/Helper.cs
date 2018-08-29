using NeoWeb.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net.Http;
using System.Text;
using static System.Text.RegularExpressions.Regex;
using NeoWeb.Data;
using System.IO;
using System.Net;
using System.Linq;
using System.Security.Cryptography;
using Neo;

namespace NeoWeb
{
    public static class Helper
    {
        public static string ClearHtmlTag(this string html)
        {
            html = Replace(html, @"<!\-\-\[if gte mso 9\]>[\s\S]*<!\[endif\]\-\->", "");
            html = Replace(html, "<[^>]+>", "");
            html = Replace(html, "&[^;]+;", "");
            return html;
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
            System.Security.Cryptography.SHA256 obj = System.Security.Cryptography.SHA256.Create();
            return BitConverter.ToString(obj.ComputeHash(Encoding.UTF8.GetBytes(input))).Replace("-", "");
        }

        public static string PostWebRequest(string postUrl, string paramData)
        {
            try
            {
                byte[] byteArray = Encoding.UTF8.GetBytes(paramData);
                WebRequest webReq = WebRequest.Create(postUrl);
                webReq.Method = "POST";
                using (Stream newStream = webReq.GetRequestStream())
                {
                    newStream.Write(byteArray, 0, byteArray.Length);
                }
                using (WebResponse response = webReq.GetResponse())
                {
                    using (StreamReader sr = new StreamReader(response.GetResponseStream(), Encoding.UTF8))
                    {
                        return sr.ReadToEnd();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return "";
        }

        public static string ToHexString(this byte[] bytes) => BitConverter.ToString(bytes).Replace("-", "");

        public static bool VerifySignature(string message, string signature, string pubkey)
        {
            var msg = System.Text.Encoding.Default.GetBytes(message);
            try
            {
                return VerifySignature(msg, signature.HexToBytes(), pubkey.HexToBytes());
            }
            catch (Exception)
            {
                return false;
            }
        }

        //reference https://github.com/neo-project/neo/blob/master/neo/Cryptography/Crypto.cs
        public static bool VerifySignature(byte[] message, byte[] signature, byte[] pubkey)
        {
            if (pubkey.Length == 33 && (pubkey[0] == 0x02 || pubkey[0] == 0x03))
            {
                try
                {
                    pubkey = Neo.Cryptography.ECC.ECPoint.DecodePoint(pubkey, Neo.Cryptography.ECC.ECCurve.Secp256r1).EncodePoint(false).Skip(1).ToArray();
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
    
    }
}
