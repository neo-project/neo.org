using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace NeoWeb.Services
{
    public class EmailSender : IEmailSender
    {
        public AuthMessageSenderOptions Options { get; } // set only via Secret Manager

        public EmailSender(IOptions<AuthMessageSenderOptions> optionsAccessor)
        {
            Options = optionsAccessor.Value;
        }

        public Task SendEmailAsync(string email, string subject, string message)
        {
            using (MailMessage mail = new MailMessage
            {
                From = new MailAddress(Options.FromAddress, Options.FromDisplayName),
                Subject = subject,
                BodyEncoding = Encoding.UTF8,
                Body = message,
                IsBodyHtml = true
            })
            {
                mail.To.Add(email);
                using (SmtpClient smtp = new SmtpClient(Options.Host, Options.Port)
                {
                    EnableSsl = true,
                    UseDefaultCredentials = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    Credentials = new System.Net.NetworkCredential(Options.EmailUserName, Options.EmailPassword)
                })
                {
                    smtp.Send(mail);
                }
            }
            return Task.Delay(0);
        }
    }
}
