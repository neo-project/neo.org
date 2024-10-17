using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Threading.Tasks;

namespace NeoWeb.Services
{
    public class EmailSender(IOptions<AuthMessageSenderOptions> optionsAccessor) : IEmailSender
    {
        public AuthMessageSenderOptions Options { get; } = optionsAccessor.Value;

        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(Options.FromDisplayName, Options.FromAddress));
            message.To.Add(new MailboxAddress(email, email));
            message.Subject = subject;
            message.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = htmlMessage
            };
            using var client = new SmtpClient();
            client.Connect(Options.Host, Options.Port, false);
            client.Authenticate(Options.EmailUserName, Options.EmailPassword);
            client.Send(message);
            client.Disconnect(true);
            return Task.Delay(0);
        }
    }
}
