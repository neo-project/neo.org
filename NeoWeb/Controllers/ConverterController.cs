using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace NeoWeb.Controllers
{
    public class ConverterController : Controller
    {
        [HttpGet]
        [HttpPost]
        public IActionResult Index(string input)
        {
            if(string.IsNullOrEmpty(input)) return View();

            var result = new List<string>();

            //可能是公钥
            if (new Regex("^0[23][0-9a-f]{64}$").IsMatch(input))
            {
                try
                {
                    var output = ConverterHelper.PublicKeyToAddress(input);
                    result.Add("公钥转 Neo3 地址：");
                    result.Add(output);
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.AddressToScriptHash(ConverterHelper.PublicKeyToAddress(input)).big;
                    result.Add("公钥转脚本哈希（大端序）:");
                    result.Add(output);
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.AddressToScriptHash(ConverterHelper.PublicKeyToAddress(input)).little;
                    result.Add("公钥转脚本哈希（小端序）:");
                    result.Add(output);
                }
                catch (Exception) { }
            }
            //可能是 16 进制小端序字符串
            else if (new Regex("^([0-9a-f]{2})+$").IsMatch(input))
            {
                try
                {
                    var output = ConverterHelper.HexNumberToBigInteger(input);
                    if (new Regex("^[0-9]{1,16}$").IsMatch(output))
                    {
                        result.Add("16 进制小端序字符串转大整数：");
                        result.Add(output);
                    }
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.HexStringToUTF8(input);
                    if (IsSupportedAsciiString(output))
                    {
                        result.Add("16 进制小端序字符串转 UTF8 字符串：");
                        result.Add(output);
                    }
                }
                catch (Exception)
                { }
                try
                {
                    var output = ConverterHelper.BigLittleEndConversion(input);
                    result.Add("小端序转大端序：");
                    result.Add(output);
                }
                catch (Exception) { }
            }
            //可能是 16 进制大端序字符串
            else if (new Regex("^0x([0-9a-f]{2})+$").IsMatch(input))
            {
                try
                {
                    var output = ConverterHelper.ScriptHashToAddress(input);
                    result.Add("脚本哈希转 Neo3 地址：");
                    result.Add(output);
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.BigLittleEndConversion(input);
                    result.Add("大端序转小端序：");
                    result.Add(output);
                }
                catch (Exception) { }
            }
            //可能是 Neo3 地址
            else if (new Regex("^N[K-Za-j][1-9a-km-zA-HJ-Z]{32}$").IsMatch(input))
            {
                try
                {
                    var output = ConverterHelper.AddressToScriptHash(input).big;
                    result.Add("Neo 3 地址转脚本哈希（大端序）:");
                    result.Add(output);
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.AddressToScriptHash(input).little;
                    result.Add("Neo 3 地址转脚本哈希（小端序）:");
                    result.Add(output);
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.AddressToBase64String(input);
                    result.Add("Neo 3 地址转 Base64 脚本哈希：");
                    result.Add(output);
                }
                catch (Exception) { }
            }
            //可能是正整数
            else if (new Regex("^\\d+$").IsMatch(input))
            {
                try
                {
                    var output = ConverterHelper.BigIntegerToHexNumber(input);
                    result.Add("正整数转十六进制字符串：");
                    result.Add(output);
                }
                catch (Exception) { }
                try
                {
                    var output = ConverterHelper.BigIntegerToBase64String(input);
                    result.Add("正整数转 Base64 字符串：");
                    result.Add(output);
                }
                catch (Exception) { }
            }
            else
            {
                //可能是 Base64 格式的字符串 或 普通字符串
                if (new Regex("^([0-9a-zA-Z/+=]{4})+$").IsMatch(input))
                {
                    try
                    {
                        var output = ConverterHelper.Base64StringToAddress(input);
                        result.Add("Base64 脚本哈希转 Neo 3 地址：");
                        result.Add(output);
                    }
                    catch (Exception) { }
                    try
                    {
                        var output = ConverterHelper.AddressToScriptHash(ConverterHelper.Base64StringToAddress(input)).little;
                        result.Add("Base64 脚本哈希转脚本哈希（小端序）:");
                        result.Add(output);
                    }
                    catch (Exception) { }
                    try
                    {
                        var output = ConverterHelper.AddressToScriptHash(ConverterHelper.Base64StringToAddress(input)).big;
                        result.Add("Base64 脚本哈希转脚本哈希（大端序）:");
                        result.Add(output);
                    }
                    catch (Exception) { }
                    try
                    {
                        var output = ConverterHelper.Base64StringToBigInteger(input);
                        if (new Regex("^[0-9]{1,20}$").IsMatch(output))
                        {
                            result.Add("Base64 格式的字符串转大整数：");
                            result.Add(output);
                        }
                    }
                    catch (Exception) { }
                    try
                    {
                        var output = ConverterHelper.Base64StringToString(input);
                        if (IsSupportedAsciiString(output))
                        {
                            result.Add("Base64 解码：");
                            result.Add(output);
                        }
                    }
                    catch (Exception) { }
                    try
                    {
                        var output = ConverterHelper.ScriptsToOpCode(input);
                        if (output.Count > 0)
                        {
                            result.Add("脚本转 OpCode：");
                            output.ForEach(p => result.Add(p));
                        }
                    }
                    catch (Exception) { }
                }

                //当做普通字符串处理
                if (true)
                {
                    try
                    {
                        var output = ConverterHelper.UTF8ToHexString(input);
                        result.Add("UTF8 字符串转十六进制字符串：");
                        result.Add(output);
                    }
                    catch (Exception) { }
                    try
                    {
                        var output = ConverterHelper.StringToBase64String(input);
                        result.Add("Base64 编码：");
                        result.Add(output);
                    }
                    catch (Exception) { }
                }
            }
            ViewBag.Result = result;
            ViewBag.Input = input;
            return View();
        }

        private static bool IsSupportedAsciiString(string input)
        {
            return input.All(p => p >= ' ' && p <= '~' || p == '\r' || p == '\n');
        }
    }
}
