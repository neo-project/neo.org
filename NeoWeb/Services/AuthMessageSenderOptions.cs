namespace NeoWeb.Services
{
    public class AuthMessageSenderOptions
    {
        public string FromAddress { get; set; }
        public string FromDisplayName { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public string EmailUserName { get; set; }
        public string EmailPassword { get; set; }
    }
}
