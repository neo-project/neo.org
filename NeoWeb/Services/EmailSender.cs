using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Services
{
    public class EmailSender : IEmailSender
    {
        public AuthMessageSenderOptions SenderOptions { get; } // set only via Secret Manager

        public EmailSender(IOptions<AuthMessageSenderOptions> optionsAccessor)
        {
            SenderOptions = optionsAccessor.Value;
        }

        public Task SendEmailAsync(string email, string subject, string message)
        {
            return Execute(SenderOptions.SendGridKey, email, subject, message);
        }

        public Task Execute(string apiKey, string email, string subject, string message)
        {
            SendGridClient client = new SendGridClient(apiKey);

            SendGridMessage msg = new SendGridMessage()
            {
                From = new EmailAddress(SenderOptions.SendGridUser),
                Subject = subject,
                PlainTextContent = message,
                HtmlContent = message
            };
            msg.AddTo(new EmailAddress(email));

            //msg.SetClickTracking(false, false);

            return client.SendEmailAsync(msg);
        }
    }
}
