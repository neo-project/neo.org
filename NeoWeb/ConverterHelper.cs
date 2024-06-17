using Neo;
using Neo.Cryptography.ECC;
using Neo.IO;
using Neo.SmartContract;
using Neo.VM;
using Neo.Wallets;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Text.RegularExpressions;

namespace NeoWeb
{
    public static class ConverterHelper
    {
        /// <summary>
        /// 将 16 进制的字符串转为 UTF8 字符串
        /// </summary>
        /// <param name="hex">eg:7472616e73666572</param>
        /// <returns>eg:transfer</returns>
        public static string HexStringToUTF8(string hex)
        {
            hex = hex.ToLower().Trim();
            if (!new Regex("^(0x)?([0-9a-f]{2})+$").IsMatch(hex)) throw new FormatException();

            if (new Regex("^([0-9a-f]{2})+$").IsMatch(hex))
            {
                return Encoding.UTF8.GetString(hex.HexToBytes());
            }
            else
            {
                return Encoding.UTF8.GetString(hex[2..].HexToBytes().Reverse().ToArray());
            }
        }

        /// <summary>
        /// 将 UTF8 格式的字符串转为 16 进制的字符串
        /// </summary>
        /// <param name="str">eg:transfer</param>
        /// <returns>eg:7472616e73666572</returns>
        public static string UTF8ToHexString(string str)
        {
            return Encoding.UTF8.GetBytes(str.Trim()).ToHexString();
        }

        /// <summary>
        /// 计算 UTF8 字符串的 Sha256 哈希
        /// </summary>
        /// <param name="str">eg:All in one, All in neo.</param>
        /// <returns>eg:0758c9e9f2514a6e87e893af15b31c26b0f9f69300ac27820d5991cc8eb0bb20</returns>
        public static string UTF8StringToHash(string str)
        {
            return str.Trim().Sha256().ToLower();
        }

        /// <summary>
        /// 将 16 进制的小端序大整数转为十进制的大整数
        /// </summary>
        /// <param name="hex">eg:00a3e111</param>
        /// <returns>eg:300000000</returns>
        public static string HexNumberToBigInteger(string hex)
        {
            hex = hex.ToLower().Trim();
            if (!new Regex("^([0-9a-f]{2})+$").IsMatch(hex)) throw new FormatException();

            return new BigInteger(hex.HexToBytes().ToArray()).ToString();
        }

        /// <summary>
        /// 将十进制的大整数转为 16 进制的小端序大整数
        /// </summary>
        /// <param name="integer">eg:300000000</param>
        /// <returns>eg:00a3e111</returns>
        public static string BigIntegerToHexNumber(string integer)
        {
            BigInteger bigInteger;
            try
            {
                bigInteger = BigInteger.Parse(integer.Trim());
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return bigInteger.ToByteArray().ToHexString(); // little endian
        }

        /// <summary>
        /// 将地址转为脚本哈希（大小端序）
        /// </summary>
        /// <param name="address">eg:NejD7DJWzD48ZG4gXKDVZt3QLf1fpNe1PF</param>
        /// <returns>eg:0x3ff68d232a60f23a5805b8c40f7e61747f6f61ce and ce616f7f74617e0fc4b805583af2602a238df63f</returns>
        public static (string big, string little) AddressToScriptHash(string address)
        {
            UInt160 scriptHash;
            try
            {
                scriptHash = address.Trim().ToScriptHash(0x35);
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return (scriptHash.ToString(), scriptHash.ToArray().ToHexString()); // big, little
        }

        /// <summary>
        /// 将脚本哈希（大小端序）转为地址
        /// </summary>
        /// <param name="scriptHash">eg:0x3ff68d232a60f23a5805b8c40f7e61747f6f61ce or ce616f7f74617e0fc4b805583af2602a238df63f</param>
        /// <returns>eg:NejD7DJWzD48ZG4gXKDVZt3QLf1fpNe1PF</returns>
        public static string ScriptHashToAddress(string scriptHash)
        {
            scriptHash = scriptHash.ToLower().Trim();
            if (!new Regex("^(0x)?[0-9a-f]{40}$").IsMatch(scriptHash)) throw new FormatException();

            byte[] data;
            if (scriptHash.StartsWith("0x"))
            {
                scriptHash = scriptHash[2..]; // big endian
                data = scriptHash.HexToBytes();
                Array.Reverse(data);
            }
            else
            {
                data = scriptHash.HexToBytes(); // little endian
            }
            return new UInt160(data).ToAddress(0x35);
        }

        /// <summary>
        /// 大小端序的 16 进制字节数组互转
        /// </summary>
        /// <param name="hex">eg:0x3ff68d232a60f23a5805b8c40f7e61747f6f61ce</param>
        /// <returns>eg:ce616f7f74617e0fc4b805583af2602a238df63f</returns>
        public static string BigLittleEndConversion(string hex)
        {
            hex = hex.ToLower().Trim();
            if (!new Regex("^(0x)?([0-9a-f]{2})+$").IsMatch(hex)) throw new FormatException();

            string result;
            if (hex.StartsWith("0x"))
                result = hex[2..].HexToBytes().Reverse().ToArray().ToHexString(); // big => little
            else
                result = "0x" + hex.HexToBytes().Reverse().ToArray().ToHexString();
            return result;
        }

        /// <summary>
        /// Base64 格式的字符串转为 UTF8 字符串
        /// </summary>
        /// <param name="base64">eg:SGVsbG8gV29ybGQh</param>
        /// <returns>eg:Hello World!</returns>
        public static string Base64StringToString(string base64)
        {
            byte[] bytes;
            try
            {
                bytes = Convert.FromBase64String(base64.Trim());
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return Encoding.UTF8.GetString(bytes);
        }

        public static string Base64Fixed(string str)
        {
            MatchCollection mc = Regex.Matches(str, @"\\u([\w]{2})([\w]{2})", RegexOptions.Compiled | RegexOptions.IgnoreCase);
            byte[] bts = new byte[2];
            foreach (Match m in mc)
            {
                bts[0] = (byte)int.Parse(m.Groups[2].Value, NumberStyles.HexNumber);
                bts[1] = (byte)int.Parse(m.Groups[1].Value, NumberStyles.HexNumber);
                str = str.Replace(m.ToString(), Encoding.Unicode.GetString(bts));
            }
            return str;
        }

        /// <summary>
        /// Base64 格式的字符串转为 HEX 字符串
        /// </summary>
        /// <param name="base64">eg:SGVsbG8gV29ybGQh</param>
        /// <returns>eg:48656c6c6f20576f726c6421</returns>
        public static string Base64StringToHexString(string base64)
        {
            byte[] bytes;
            try
            {
                bytes = Convert.FromBase64String(base64.Trim());
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return bytes.ToHexString();
        }

        /// <summary>
        /// 计算 Base64 格式字符串的 Sha256 哈希
        /// </summary>
        /// <param name="base64">eg:SGVsbG8gV29ybGQh</param>
        /// <returns>eg:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</returns>
        public static string Base64StringToHash(string base64)
        {
            try
            {
                var bytes = Convert.FromBase64String(base64.Trim());
                return BitConverter.ToString(System.Security.Cryptography.SHA256.HashData(bytes)).Replace("-", "").ToLower();
            }
            catch (Exception)
            {
                throw new FormatException();
            }
        }

        /// <summary>
        /// HEX 字符串 转为 Base64 格式的字符串
        /// </summary>
        /// <param name="base64">eg:48656c6c6f20576f726c6421</param>
        /// <returns>eg:SGVsbG8gV29ybGQh</returns>
        public static string HexStringToBase64String(string hex)
        {
            string base64;
            try
            {
                var bytes = hex.Trim().HexToBytes();
                base64 = Convert.ToBase64String(hex.Trim().HexToBytes());
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return base64;
        }

        /// <summary>
        /// 计算 16 进制的字符串的 Sha256 哈希
        /// </summary>
        /// <param name="base64">eg:7472616e73666572</param>
        /// <returns>eg:27f576cafbb263ed44be8bd094f66114da26877706f96c4c31d5a97ffebf2e29</returns>
        public static string HexStringToHash(string hex)
        {
            hex = hex.ToLower().Trim();
            if (!new Regex("^(0x)?([0-9a-f]{2})+$").IsMatch(hex)) throw new FormatException();

            if (new Regex("^([0-9a-f]{2})+$").IsMatch(hex))
            {
                var bytes = hex.HexToBytes();
                return BitConverter.ToString(System.Security.Cryptography.SHA256.HashData(bytes)).Replace("-", "").ToLower();
            }
            else
            {
                var bytes = hex[2..].HexToBytes().Reverse().ToArray();
                return BitConverter.ToString(System.Security.Cryptography.SHA256.HashData(bytes)).Replace("-", "").ToLower();
            }
        }

        /// <summary>
        /// UTF8 字符串转为 Base64 格式的字符串
        /// </summary>
        /// <param name="str">eg:Hello World!</param>
        /// <returns>eg:SGVsbG8gV29ybGQh</returns>
        public static string StringToBase64String(string str)
        {
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(str.Trim()));
        }

        /// <summary>
        /// Base64 格式的脚本哈希转为 Neo3 地址
        /// </summary>
        /// <param name="base64">eg:NejD7DJWzD48ZG4gXKDVZt3QLf1fpNe1PF</param>
        /// <returns>eg:zmFvf3Rhfg/EuAVYOvJgKiON9j8=</returns>
        public static string Base64StringToAddress(string base64)
        {
            byte[] bytes;
            try
            {
                bytes = Convert.FromBase64String(base64.Trim());
                if (bytes.Length != 20) throw new FormatException();
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return new UInt160(bytes).ToAddress(0x35);
        }

        public static string MnemonicToWIF(string mnemonic)
        {
            string output;
            try
            {
                if (!Mnemonic.Verification(mnemonic)) throw new FormatException();
                var seed = Mnemonic.MnemonicToSeed(mnemonic);
                output = Mnemonic.SeedToWIF(seed, 888);
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return output;
        }

        public static string MnemonicToAddress(string mnemonic)
        {
            string output;
            try
            {
                var pubKey = PrivateKeyToPublicKey(MnemonicToWIF(mnemonic));
                output = Contract.CreateSignatureContract(ECPoint.Parse(pubKey, ECCurve.Secp256r1)).ScriptHash.ToAddress(0x35);
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return output;
        }

        /// <summary>
        /// 公钥转为 Neo3 地址
        /// </summary>
        /// <param name="pubKey">eg:03dab84c1243ec01ab2500e1a8c7a1546a26d734628180b0cf64e72bf776536997</param>
        /// <returns>eg:Nd9NceysETPT9PZdWRTeQXJix68WM2x6Wv</returns>
        public static string PublicKeyToAddress(string pubKey)
        {
            pubKey = pubKey.ToLower().Trim();
            if (!new Regex("^(0[23][0-9a-f]{64})+$").IsMatch(pubKey)) throw new FormatException();

            return Contract.CreateSignatureContract(ECPoint.Parse(pubKey, ECCurve.Secp256r1)).ScriptHash.ToAddress(0x35);
        }

        public static string PublicKeyToMultiSignAddress(string pubKey)
        {
            pubKey = pubKey.ToLower().Trim();
            if (!new Regex("^(0[23][0-9a-f]{64})+$").IsMatch(pubKey)) throw new FormatException();

            return Contract.CreateMultiSigContract(1, [ECPoint.Parse(pubKey, ECCurve.Secp256r1)]).ScriptHash.ToAddress(0x35);
        }

        /// <summary>
        ///  Neo3 地址转为 Base64 格式的脚本哈希
        /// </summary>
        /// <param name="address">eg:NejD7DJWzD48ZG4gXKDVZt3QLf1fpNe1PF</param>
        /// <returns>eg:zmFvf3Rhfg/EuAVYOvJgKiON9j8=</returns>
        public static string AddressToBase64String(string address)
        {
            return Convert.ToBase64String(address.Trim().ToScriptHash(0x35).ToArray());
        }

        /// <summary>
        /// Base64 字符串转为十进制大整数
        /// </summary>
        /// <param name="base64">eg:AHVYXVTcKw==</param>
        /// <returns>eg:12345678900000000</returns>
        public static string Base64StringToBigInteger(string base64)
        {
            byte[] bytes;
            try
            {
                bytes = Convert.FromBase64String(base64.Trim());
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return new BigInteger(bytes).ToString();
        }

        /// <summary>
        /// 十进制大整数转为 Base64 字符串
        /// </summary>
        /// <param name="integer">eg:12345678900000000</param>
        public static string BigIntegerToBase64String(string integer)
        {
            BigInteger bigInteger;
            try
            {
                bigInteger = BigInteger.Parse(integer.Trim());
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return Convert.ToBase64String(bigInteger.ToByteArray());
        }

        /// <summary>
        /// WIF 私钥转公钥
        /// </summary>
        /// <param name="wif">WIF 格式的私钥</param>
        /// <returns>小端序公钥</returns>
        public static string PrivateKeyToPublicKey(string wif)
        {
            string output;
            try
            {
                var privateKey = Wallet.GetPrivateKeyFromWIF(wif);
                var account = new KeyPair(privateKey);
                output = account.PublicKey.ToArray().ToHexString();
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return output;
        }

        public static string PrivateKeyToAddress(string wif)
        {
            string output;
            try
            {
                var pubKey = PrivateKeyToPublicKey(wif);
                output = Contract.CreateSignatureContract(ECPoint.Parse(pubKey, ECCurve.Secp256r1)).ScriptHash.ToAddress(0x35);
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return output;
        }

        public static string PrivateKeyToMultiSignAddress(string wif)
        {
            string output;
            try
            {
                var pubKey = PrivateKeyToPublicKey(wif);
                output = Contract.CreateMultiSigContract(1, [ECPoint.Parse(pubKey, ECCurve.Secp256r1)]).ScriptHash.ToAddress(0x35);
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return output;
        }

        /// <summary>
        /// HEX 私钥转 WIF
        /// </summary>
        /// <param name="hex">HEX 格式的私钥</param>
        /// <returns>WIF 格式的私钥</returns>
        public static string HexPrivateKeyToWIF(string hex)
        {
            string output;
            try
            {
                var account = new KeyPair(hex.HexToBytes());
                output = account.Export();
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return output;
        }

        /// <summary>
        /// WIF 转 HEX 私钥
        /// </summary>
        /// <param name="wif">WIF 格式的私钥</param>
        /// <returns>HEX 格式的私钥</returns>
        public static string WIFToHexPrivateKey(string wif)
        {
            string output;
            try
            {
                var privateKey = Wallet.GetPrivateKeyFromWIF(wif);
                output = privateKey.ToHexString();
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return output;
        }

        /// <summary>
        /// 将 Base64 格式的合约脚本转为脚本哈希
        /// <param name="base64">
        /// Base64 编码的 scripts
        /// e.g. DCECbzTesnBofh/Xng1SofChKkBC7jhVmLxCN1vk\u002B49xa2pBVuezJw==
        /// </param>
        /// <returns>eg:0xce2588a0135ea78a732f852506b05ee2760f1953 and 53190f76e25eb00625852f738aa75e13a08825ce</returns>
        public static (string big, string little) ScriptsToScriptHash(string base64)
        {
            Contract contract;
            try
            {
                contract = new()
                {
                    Script = Convert.FromBase64String(base64)
                };
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return (contract.ScriptHash.ToString(), contract.ScriptHash.ToArray().ToHexString()); // big, little
        }

        /// <summary>
        /// 将 Base64 格式的脚本转为易读的 OpCode
        /// </summary>
        /// <param name="base64">Base64 编码的 scripts</param>
        /// <returns>List&lt;string&gt; 类型的 OpCode 及操作数</returns>
        public static List<string> ScriptsToOpCode(string base64)
        {
            Script script;
            try
            {
                var scriptData = Convert.FromBase64String(base64);
                script = new Script(scriptData.ToArray(), true);
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return ScriptsToOpCode(script);
        }

        /// <summary>
        /// 将 16 进制的脚本转为易读的 OpCode
        /// </summary>
        /// <param name="hex"> 16 进制的脚本</param>
        /// <returns>List&lt;string&gt; 类型的 OpCode 及操作数</returns>
        public static List<string> HexScriptsToOpCode(string hex)
        {
            Script script;
            try
            {
                var scriptData = hex.HexToBytes().ToArray();
                script = new Script(hex.HexToBytes(), true);
            }
            catch (Exception)
            {
                throw new FormatException();
            }
            return ScriptsToOpCode(script);
        }

        private static List<string> ScriptsToOpCode(Script script)
        {
            //Initialize all InteropService
            var dic = new Dictionary<uint, string>();
            ApplicationEngine.Services.ToList().ForEach(p => dic.Add(p.Value.Hash, p.Value.Name));

            //Analyzing Scripts
            var ip = 0;
            Instruction instruction;
            var result = new List<string>();
            while (ip < script.Length && (instruction = script.GetInstruction(ip)) != null)
            {
                ip += instruction.Size;

                var op = instruction.OpCode;

                if (op.ToString().StartsWith("PUSHINT"))
                {
                    var operand = instruction.Operand.ToArray();
                    result.Add($"{op} {new BigInteger(operand)}");
                }
                else if (op == OpCode.SYSCALL)
                {
                    var operand = instruction.Operand.ToArray();
                    result.Add($"{op} {dic[BitConverter.ToUInt32(operand)]}");
                }
                else
                {
                    if (!instruction.Operand.IsEmpty && instruction.Operand.Length > 0)
                    {
                        var operand = instruction.Operand.ToArray();
                        var ascii = Encoding.Default.GetString(operand);
                        ascii = ascii.Any(p => p < '0' || p > 'z') ? operand.ToHexString() : ascii;

                        result.Add($"{op} {(operand.Length == 20 ? new UInt160(operand).ToString() : ascii)}");
                    }
                    else
                    {
                        result.Add($"{op}");
                    }
                }
            }
            return result.ToArray().ToList();
        }
    }
}
