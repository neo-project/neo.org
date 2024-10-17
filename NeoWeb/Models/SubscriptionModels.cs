using System;
using System.ComponentModel.DataAnnotations;

namespace NeoWeb.Models
{
    public class Subscription
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string Group { get; set; }

        public bool IsSubscription { get; set; }

        public DateTime SubscriptionTime { get; set; }
    }
}
