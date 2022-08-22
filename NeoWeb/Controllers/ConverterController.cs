using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;

namespace NeoWeb.Controllers
{
    public class ConverterController : Controller
    {
        private readonly IStringLocalizer<ConverterController> _localizer;

        public ConverterController(IStringLocalizer<ConverterController> localizer)
        {
            _localizer = localizer;
        }

        [HttpGet]
        [HttpPost]
        public IActionResult Index(string input)
        {
            if (string.IsNullOrEmpty(input)) return View();
            input = input.Trim();
            ViewBag.Input = input;

            var result = new Dictionary<string, List<string>>();
            input = ConverterHelper.Base64Fixed(input);
            if (input.Length > 102400)
            {
                ViewBag.Input = "Too large!";
                return View();
            }
            //彩蛋
            if (input == "I love you")
            {
                result.Add("Neo:", new List<string>() { "I love you too!" });
                ViewBag.Result = result;
                return View();
            }
            if (input == "我喜欢你")
            {
                result.Add("Neo:", new List<string>() { "我也喜欢你！" });
                ViewBag.Result = result;
                return View();
            }

            //可能是公钥
            if (new Regex("^0[23][0-9a-f]{64}$").IsMatch(input.ToLower()))
            {
                try
                {
                    var output = ConverterHelper.PublicKeyToAddress(input);
                    result.Add(_localizer["Public key to Neo3 Address:"], new List<string>() { output });
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.AddressToScriptHash(ConverterHelper.PublicKeyToAddress(input)).big;
                    result.Add(_localizer["Public key to script hash (big endian):"], new List<string>() { output });
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.AddressToScriptHash(ConverterHelper.PublicKeyToAddress(input)).little;
                    result.Add(_localizer["Public key to script hash (little endian):"], new List<string>() { output });

                }
                catch (Exception) { }
            }
            //可能是 16 进制小端序字符串
            else if (new Regex("^([0-9a-f]{2})+$").IsMatch(input.ToLower()))
            {
                //可能是 16 进制私钥
                if (new Regex("^[0-9a-f]{64}$").IsMatch(input.ToLower()))
                {
                    try
                    {
                        var output = ConverterHelper.HexPrivateKeyToWIF(input);
                        result.Add(_localizer["Hexadecimal private key to WIF private key:"], new List<string>() { output });
                    }
                    catch (Exception) { }
                }
                try
                {
                    var output = ConverterHelper.ScriptHashToAddress(input);
                    result.Add(_localizer["Script hash to Neo3 address:"], new List<string>() { output });
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.HexNumberToBigInteger(input);
                    if (new Regex("^[0-9]{1,16}$").IsMatch(output))
                    {
                        result.Add(_localizer["Hexadecimal little-endian string to big integer:"], new List<string>() { output });

                    }
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.HexStringToUTF8(input);
                    if (IsSupportedAsciiString(output))
                    {
                        result.Add(_localizer["Hexadecimal little-endian string to UTF8 string:"], new List<string>() { output });
                    }
                }
                catch (Exception)
                { }
                try
                {
                    var output = ConverterHelper.BigLittleEndConversion(input);
                    result.Add(_localizer["Little-endian to big-endian:"], new List<string>() { output });

                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.HexStringToBase64String(input);
                    result.Add(_localizer["Hexadecimal little-endian string to Base64 string:"], new List<string>() { output });
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.HexScriptsToOpCode(input);
                    if (output.Count > 0)
                    {
                        result.Add(_localizer["Smart contract script analysis:"], output);
                    }
                }
                catch (Exception) { }
            }
            //可能是 16 进制大端序字符串
            else if (new Regex("^0x([0-9a-f]{2})+$").IsMatch(input.ToLower()))
            {
                try
                {
                    var output = ConverterHelper.HexStringToUTF8(input);
                    if (IsSupportedAsciiString(output))
                    {
                        result.Add(_localizer["Hexadecimal big-endian string to UTF8 string:"], new List<string>() { output });
                    }
                }
                catch (Exception)
                { }
                try
                {
                    var output = ConverterHelper.ScriptHashToAddress(input);
                    result.Add(_localizer["Script hash to Neo3 address:"], new List<string>() { output });

                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.BigLittleEndConversion(input);
                    result.Add(_localizer["Big-endian to little-endian:"], new List<string>() { output });

                }
                catch (Exception) { }
            }
            //可能是 Neo3 地址
            else if (new Regex("^N[K-Za-j][1-9a-km-zA-HJ-Z]{32}$").IsMatch(input))
            {
                try
                {
                    var output = ConverterHelper.AddressToScriptHash(input).big;
                    result.Add(_localizer["Neo 3 address to script hash (big-endian):"], new List<string>() { output });

                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.AddressToScriptHash(input).little;
                    result.Add(_localizer["Neo 3 address to script hash (little-endian):"], new List<string>() { output });

                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.AddressToBase64String(input);
                    result.Add(_localizer["Neo 3 address to Base64 script hash:"], new List<string>() { output });

                }
                catch (Exception) { }
            }
            //可能是 WIF 私钥
            else if (new Regex("^(L|K)[1-9a-km-zA-HJ-Z]{51}$").IsMatch(input))
            {
                try
                {
                    var output = ConverterHelper.PrivateKeyToPublicKey(input);
                    result.Add(_localizer["Private key to public key:"], new List<string>() { output });
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.PrivateKeyToAddress(input);
                    result.Add(_localizer["Private key to Neo3 address:"], new List<string>() { output });
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.AddressToScriptHash(ConverterHelper.PublicKeyToAddress(ConverterHelper.PrivateKeyToPublicKey(input))).big;
                    result.Add(_localizer["Private key to script hash (big-endian):"], new List<string>() { output });
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.AddressToScriptHash(ConverterHelper.PublicKeyToAddress(ConverterHelper.PrivateKeyToPublicKey(input))).little;
                    result.Add(_localizer["Private key to script hash (little-endian):"], new List<string>() { output });
                }
                catch (Exception) { }
            }
            //可能是 Base64 格式的字符串 或 普通字符串
            else if (new Regex("^([0-9a-zA-Z/+=]{4})+$").IsMatch(input))
            {
                try
                {
                    var output = ConverterHelper.Base64StringToAddress(input);
                    result.Add(_localizer["Base64 script hash to Neo 3 address:"], new List<string>() { output });

                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.AddressToScriptHash(ConverterHelper.Base64StringToAddress(input)).little;
                    result.Add(_localizer["Base64 script hash to script hash (little-endian):"], new List<string>() { output });

                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.AddressToScriptHash(ConverterHelper.Base64StringToAddress(input)).big;
                    result.Add(_localizer["Base64 script hash to script hash (big-endian):"], new List<string>() { output });

                }
                catch (Exception) { }

                if (input.Length <= 1024)
                {
                    try
                    {
                        var output = ConverterHelper.Base64StringToBigInteger(input);
                        if (new Regex("^[0-9]{1,20}$").IsMatch(output))
                        {
                            result.Add(_localizer["Base64 string to big integer:"], new List<string>() { output });

                        }
                    }
                    catch (Exception) { }
                }
                try
                {
                    var output = ConverterHelper.Base64StringToString(input);
                    if (IsSupportedAsciiString(output))
                    {
                        result.Add(_localizer["Base64 decoding:"], new List<string>() { output });
                    }
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.ScriptsToOpCode(input);
                    if (output.Count > 0)
                    {
                        result.Add(_localizer["Smart contract script analysis:"], output);
                    }
                    //可能是合约脚本
                    if (output.Any(p => p.Contains("CheckSig") || p.Contains("CheckMultisig")))
                    {
                        try
                        {
                            var output1 = ConverterHelper.ScriptsToScriptHash(input).big;
                            result.Add(_localizer["Base64 contract script to scripthash (big-endian):"], new List<string>() { output1 });

                        }
                        catch (Exception) { }
                        try
                        {
                            var output2 = ConverterHelper.ScriptsToScriptHash(input).little;
                            result.Add(_localizer["Base64 contract script to scripthash (little-endian):"], new List<string>() { output2 });
                            try
                            {
                                var output3 = ConverterHelper.ScriptHashToAddress(output2);
                                result.Add(_localizer["Base64 contract script to Neo3 address:"], new List<string>() { output3 });
                            }
                            catch (Exception) { }
                        }
                        catch (Exception) { }
                    }
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.Base64StringToHexString(input);
                    result.Add(_localizer["Base64 string to hexadecimal string:"], new List<string>() { output });

                }
                catch (Exception) { }
            }
            //可能是正整数
            if (new Regex("^\\d+$").IsMatch(input) && !input.StartsWith("0"))
            {
                try
                {
                    var output = ConverterHelper.BigIntegerToHexNumber(input);
                    result.Add(_localizer["Big integer to hexadecimal string:"], new List<string>() { output });

                }
                catch (Exception) { }
                try
                {
                    var temp = ConverterHelper.BigIntegerToHexNumber(input);
                    var output = ConverterHelper.HexStringToUTF8(temp);
                    if (IsSupportedAsciiString(output))
                    {
                        result.Add(_localizer["Big integer to hexadecimal string to UTF8 string:"], new List<string>() { output });
                    }
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.BigIntegerToBase64String(input);
                    result.Add(_localizer["Big integer to Base64 string:"], new List<string>() { output });

                }
                catch (Exception) { }
            }
            //可能是助记词
            if (new Regex("((\\w){3,8}\\s){11}((\\w){3,8})").IsMatch(input))
            {
                try
                {
                    var output = ConverterHelper.MnemonicToWIF(input);
                    result.Add(_localizer["Mnemonic to Neo3 private key:"], new List<string>() { output });
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.MnemonicToAddress(input);
                    result.Add(_localizer["Mnemonic to Neo3 address:"], new List<string>() { output });
                }
                catch (Exception) { }
            }
            //当做普通字符串处理
            if (input.Length <= 1024)
            {
                try
                {
                    var output = ConverterHelper.UTF8ToHexString(input);
                    result.Add(_localizer["UTF8 string to hexadecimal string:"], new List<string>() { output });
                }
                catch (Exception) { }
                try
                {
                    var temp = ConverterHelper.UTF8ToHexString(input);
                    var output = ConverterHelper.HexNumberToBigInteger(temp);
                    result.Add(_localizer["UTF8 string to hexadecimal string to big integer:"], new List<string>() { output });
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.StringToBase64String(input);
                    result.Add(_localizer["Base64 encoding:"], new List<string>() { output });
                }
                catch (Exception) { }
            }
            ViewBag.Result = result;
            return View();
        }

        private static bool IsSupportedAsciiString(string input)
        {
            return input.All(p => p >= ' ' && p <= '~' || p == '\r' || p == '\n');
        }
    }
}
