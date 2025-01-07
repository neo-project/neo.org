using NBitcoin;
using Neo;
using Neo.Cryptography;
using Neo.IO;
using Neo.SmartContract;
using Neo.Wallets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Security.Cryptography;
using System.Text;

namespace NeoWeb
{
    public class Key
    {
        public uint ChildNumber { get; set; }
        public byte[] ChainCode { get; set; }
        public byte[] K { get; set; }
        public byte[] Fingerprint { get; set; }
        public bool IsPrivate { get; set; }
    }

    public static class Mnemonic
    {
        public enum Language { English, ChineseSimplified, ChineseTraditional, Unknown };

        /// <summary>
        /// 生成助记词
        /// </summary>
        /// <param name="entLength">随机序列(熵)的长度，为了防止错误，可选范围为 {128, 160, 192, 224, 256}</param>
        /// <param name="language">助词词语言</param>
        /// <returns>助记词列表</returns>
        public static string GenerateMnemonic(EntropyLength entLength = EntropyLength._128, Language language = Language.English)
        {
            //创建一个 128 到 256 位的随机序列(熵)
            var entropyBytes = GetRandom((int)entLength / 8);
            var entropyString = ToBinaryString(entropyBytes);
            //提出 SHA256 哈希前几位(ENT/ 32)，就可以创造一个随机序列的校验和
            var checksum = entropyBytes.Sha256();
            var checksumString = ToBinaryString(checksum).Substring(0, (int)entLength / 32);
            //将校验和添加到随机序列的末尾。
            var entcsString = entropyString + checksumString;
            //将序列划分为包含 11 位的不同部分。
            if (entcsString.Length % 11 != 0) throw new Exception();
            //将每个包含 11 位部分的值与一个已经预先定义 2048 个单词的字典做对应
            var index = new List<int>();
            for (int i = 0; i < entcsString.Length / 11; i++)
            {
                var binaryString = new string(entcsString.Skip(11 * i).Take(11).Reverse().ToArray());
                var temp = 0;
                for (int j = 0; j < binaryString.Length; j++)
                {
                    temp += (int)Math.Pow(2, j) * (binaryString[j] == '1' ? 1 : 0);
                }
                index.Add(temp);
            }
            //生成的有顺序的单词组就是助记码
            var words = new List<string>();
            Wordlist wordList;
            if (language == Language.ChineseSimplified)
                wordList = new ChineseSimplified();
            else
                wordList = new English();
            index.ForEach(p => words.Add(wordList.WordList[p]));
            return string.Join(' ', words);
        }

        public static bool Verification(string mnemonic)
        {
            var words = mnemonic.Trim().Split(' ');
            //判断助记词的单数数是否合法
            var allowLength = new int[] { 12, 15, 18, 21, 24 };
            if (!allowLength.Contains(words.Length)) throw new ArgumentException("Mnemonic words count error!");

            //检测助记语言
            Wordlist wordList = new English();
            if (words.ToList().All(p => new ChineseSimplified().WordList.Contains(p)))
                wordList = new ChineseSimplified();

            //将助记词转为二进制字符串（每个单词转为 11 位的二进制数）
            var sb = new StringBuilder();
            foreach (var item in words)
            {
                var index = wordList.WordList.IndexOf(item);
                if (index < 0) throw new ArgumentException($"The \"{item}\" isn't the correct mnemonic word!");
                var str = Convert.ToString(index, 2);
                while (str.Length < 11)
                {
                    str = "0" + str;
                }
                sb.Append(str);
            }
            var entcsString = sb.ToString();
            var entropyString = entcsString.Substring(0, sb.Length * 32 / 33);
            //将二进制字符串转了字节数组
            var entropyBytes = new List<byte>();
            for (int i = 0; i < entropyString.Length / 8; i++)
            {
                var binaryString = new string(entropyString.Substring(i * 8, 8).Reverse().ToArray());
                var temp = 0;
                for (int j = 0; j < binaryString.Length; j++)
                {
                    temp += (int)Math.Pow(2, j) * (binaryString[j] == '1' ? 1 : 0);
                }
                entropyBytes.Add((byte)temp);
            }
            var checksum = entropyBytes.ToArray().Sha256();
            var checksumString = ToBinaryString(checksum).Substring(0, entropyBytes.Count() / 4);
            if (!entcsString.EndsWith(checksumString)) throw new ArgumentException($"The mnemonic verification doesn't pass!");
            return true;
        }

        /// <summary>
        /// 通过助记词和口令（可选）生成种子，这段各钱包和SDK的结果均一致，兼容性良好
        /// </summary>
        /// <param name="mnemonic">助记词</param>
        /// <param name="passphrase">口令</param>
        /// <returns></returns>
        public static byte[] MnemonicToSeed(string mnemonic, string passphrase = "")
        {
            if (!Verification(mnemonic)) return null;
            using Rfc2898DeriveBytes pbkdf2 = new Rfc2898DeriveBytes(Encoding.UTF8.GetBytes(mnemonic), Encoding.UTF8.GetBytes("mnemonic" + passphrase), 2048, HashAlgorithmName.SHA512);
            return pbkdf2.GetBytes(64);
        }

        /// <summary>
        /// 这段是兼容比特币和OneGate的种子转私钥算法，其中HMACSHA512密钥为默认的"Bitcoin seed"，初始Fingerprint为0
        /// </summary>
        /// <param name="seed">由助记词生成的seed</param>
        /// <param name="derivationPath">派生路径</param>
        /// <returns></returns>
        public static byte[] SeedToPrivateKey_1(byte[] seed, string derivationPath = "m/44'/888'/0'/0/0")
        {
            var paymentKey = new ExtKey(seed.ToHexString()).Derive(KeyPath.Parse(derivationPath));
            return paymentKey.PrivateKey.ToBytes();
        }

        public static string SeedToWIF_1(byte[] seed)
        {
            if (seed == null) throw new ArgumentNullException("seed");
            var account = new Neo.Wallets.KeyPair(SeedToPrivateKey_1(seed));
            return account.Export();
        }

        /// <summary>
        /// 这是兼容neon和ledger的种子转私钥算法
        /// </summary>
        /// <param name="seed"></param>
        /// <returns></returns>
        public static string SeedToWIF_2(byte[] seed)
        {
            var hmac = new HMACSHA512(Encoding.UTF8.GetBytes("Nist256p1 seed")).ComputeHash(seed);

            var masterKey = new Key
            {
                ChildNumber = 0,
                ChainCode = hmac.Skip(32).Take(32).ToArray(), // 初始化链码
                K = hmac.Take(32).ToArray(), // 初始化私钥
                Fingerprint = [(byte)'0'], // 初始化fingerprint，按照规范应该是 [0,0,0,0]，但为了兼容，改为 [(byte)'0']
                IsPrivate = true
            };
            var account = new Neo.Wallets.KeyPair(GenerateChildKey(masterKey).K);
            return account.Export();
        }

        // 派生子私钥的方法
        public static Key GenerateChildKey(Key parentKey, string derivationPath = "m/44'/888'/0'/0/0")
        {
            var pathArray = derivationPath.Split('/');
            if (pathArray[0] != "m")
            {
                throw new Exception("Derivation path must be of format: m/x/x...");
            }
            pathArray = pathArray.Skip(1).ToArray(); // 去掉 m，继续处理后面的部分
            var childKey = parentKey;
            foreach (var stringIdx in pathArray)
            {
                var childIdx = 0u;
                if (stringIdx.EndsWith('\''))
                {
                    childIdx = uint.Parse(stringIdx[..^1]) + 0x80000000;
                }
                else
                {
                    childIdx = uint.Parse(stringIdx);
                }
                childKey = NewChildKey(childKey, childIdx);
            }

            return childKey;
        }

        // 生成一个新的子私钥
        private static Key NewChildKey(Key parentKey, uint childIdx)
        {
            var hardenedChild = childIdx >= 0x80000000;
            byte[] data;
            // 如果是硬化子密钥
            if (hardenedChild)
            {
                data = [0x00, .. parentKey.K];
            }
            else
            {
                if (parentKey.K.Length == 33)
                    data = parentKey.K;
                else
                    data = new Neo.Wallets.KeyPair(parentKey.K).PublicKey.ToArray();
            }

            var childIdBuffer = BitConverter.GetBytes(childIdx);
            if (BitConverter.IsLittleEndian)
            {
                Array.Reverse(childIdBuffer); // 转换字节顺序
            }
            data = [.. data, .. childIdBuffer];

            // 使用 HMAC-SHA512 进行计算
            using var hmac = new HMACSHA512(parentKey.ChainCode);
            var intermediary = hmac.ComputeHash(data);

            byte[] newKey;
            if (parentKey.IsPrivate)
            {
                // 使用前32个字节生成私钥
                //var k1 = new BigInteger(intermediary.Take(32).ToArray()); 这种写法与TS库中的不一致，为了兼容，改为下面的写法

                var k1 = BigInteger.Parse("0" + intermediary.Take(32).ToArray().ToHexString(), System.Globalization.NumberStyles.HexNumber);
                var k2 = BigInteger.Parse("0" + parentKey.K.ToHexString(), System.Globalization.NumberStyles.HexNumber);
                var n = Neo.Cryptography.ECC.ECCurve.Secp256r1.N; // 这里使用曲线阶（假设使用secp256k1）

                // 使用 HMAC 得到新的私钥，k1 + k2 mod n
                BigInteger protoKey = (k1 + k2) % n;

                newKey = protoKey.ToByteArray().Take(32).Reverse().ToArray();
            }
            else
            {
                throw new Exception("Only private keys are supported for key generation.");
            }

            return new Key
            {
                ChildNumber = childIdx,
                ChainCode = intermediary.Skip(32).ToArray(),
                K = newKey,
                Fingerprint = newKey.Sha256(),
                IsPrivate = parentKey.IsPrivate
            };
        }

        /// <summary>
        /// 生成强随机数字节数组
        /// </summary>
        /// <param name="length">字节数组长度</param>
        /// <returns>强随机数字节数组</returns>
        private static byte[] GetRandom(int length)
        {
            var rndSeries = new byte[length];
            RandomNumberGenerator.Fill(rndSeries);
            return rndSeries;
        }

        /// <summary>
        /// 将字节数组转为二进制字符串，如 {128, 255, 1} 转换为 "1000000001111111100000001"
        /// </summary>
        /// <param name="byteArray">字节数组</param>
        /// <returns>二进制字符串</returns>
        private static string ToBinaryString(IEnumerable<byte> byteArray)
        {
            var sb = new StringBuilder();
            foreach (var item in byteArray)
            {
                var str = Convert.ToString(item, 2);
                while (str.Length < 8)
                {
                    str = "0" + str;
                }
                sb.Append(str);
            }
            return sb.ToString();
        }
    }
}
