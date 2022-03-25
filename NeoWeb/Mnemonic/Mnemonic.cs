using System;
using System.Collections.Generic;
using System.Text;
using System.Security.Cryptography;
using Neo.Cryptography;
using System.Linq;
using NBitcoin;
using Neo;

namespace NeoWeb
{
    public static class Mnemonic
    {
        private const string saltHeader = "mnemonic"; //这是盐的第一部分，如 BIP39 规范中所述
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
            var checksumString = ToBinaryString(checksum).Substring(0, entropyBytes.Count / 4);
            if (!entcsString.EndsWith(checksumString)) throw new ArgumentException($"The mnemonic verification doesn't pass!");
            return true;
        }

        /// <summary>
        /// 通过助记词和口令（可选）生成种子
        /// </summary>
        /// <param name="mnemonic">助记词</param>
        /// <param name="passphrase">口令</param>
        /// <returns></returns>
        public static byte[] MnemonicToSeed(string mnemonic, string passphrase = "") 
        {
            if (!Verification(mnemonic)) return null;
            Rfc2898DeriveBytes pbkdf2 = new(Encoding.UTF8.GetBytes(mnemonic), Encoding.UTF8.GetBytes(saltHeader + passphrase), 2048, HashAlgorithmName.SHA512); ;
            var counterBytes = pbkdf2.GetBytes(64);
            return counterBytes;
        }

        public static byte[] SeedToPrivateKey(byte[] seed, int coinType)
        {
            //coinType: BTC 0, ETH 60, NEO 888, ONT 1024
            //see https://github.com/satoshilabs/slips/blob/master/slip-0044.md
            var derivePath = KeyPath.Parse($"m/44'/{coinType}'/0'/0/0");
            var paymentKey = new ExtKey(seed.ToHexString()).Derive(derivePath);
            return paymentKey.PrivateKey.ToBytes();
        }

        public static string SeedToWIF(byte[] seed, int coinType)
        {
            if (seed == null) throw new ArgumentNullException(nameof(seed));
            var account = new Neo.Wallets.KeyPair(SeedToPrivateKey(seed, coinType));
            return account.Export();
        }

        /// <summary>
        /// 生成强随机数字节数组
        /// </summary>
        /// <param name="length">字节数组长度</param>
        /// <returns>强随机数字节数组</returns>
        private static byte[] GetRandom(int length)
        {
            var rndSeries = new byte[length];
            RandomNumberGenerator.Create().GetBytes(rndSeries);
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
