using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SendGridTest
{
    class Program
    {
        static void Main(string[] args)
        {
            ////Execute().Wait();
            //string[] vs = new string[]
            //{
            //    "qz@neo.org",
            //    "1_@neo.org",
            //    "__@neo.org",
            //    "_-_-@neo.org",
            //    "qz@ngd.neo.org",

            //    "qz@ngdneo.org",
            //    "qz@neo.ngd.org",
            //    "qz@neongd.org",
            //    "qz@neo.orgngd",
            //    "qz@neo.org.ngd"
            //};

            ////TestRegEx(vs);
            //DateTime x = new DateTime(2019, 8, 4, 23, 30, 0);
            //DateTime y = new DateTime(2019, 8, 4, 0, 0, 5);

            //int? a = null;

            //switch (a)
            //{
            //    default:
            //        break;
            //}

            //Console.WriteLine(TestIsInSameWeek(x, y));

            Random random = new Random();
            byte[] b = new byte[10];
            random.NextBytes(b);
            string s = BitConverter.ToString(b);

            Console.WriteLine(s);

            Console.ReadLine();
        }

        static void TestRegEx(string[] vs)
        {
            //Regex regex = new Regex("^\\w+([\\.-]?\\w+)*@([a-zA-Z0-9-_]+\\.)*neo\\.org$");

            Regex regex = new Regex(@"^\w+([\.-]?\w+)*@(\w+([\.-]?\w+)*\.)*neo\.org$");

            foreach (var s in vs)
            {
                if (regex.IsMatch(s))
                    Console.WriteLine("{0} is a match", s);
                else
                    Console.WriteLine("{0} is not a match", s);
            }
        }

        static async Task Execute()
        {
            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("admin@neo.org");
            var subject = "Sending with SendGrid is Fun";
            var to = new EmailAddress("qianzhuo@ngd.neo.org");
            var plainTextContent = "and easy to do anywhere, even with C#";
            var htmlContent = "<strong>and easy to do anywhere, even with C#</strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }

        static bool TestIsInSameWeek(DateTime x, DateTime y)
        {
            if (x > y)
            {
                var temp = x;
                x = y;
                y = temp;
            }

            int days = (y.Date - x.Date).Days;
            int dayOfWeek = Convert.ToInt32(y.DayOfWeek);
            return days <= dayOfWeek;
        }
    }
}
