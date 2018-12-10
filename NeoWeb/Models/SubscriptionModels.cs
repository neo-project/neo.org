using System;
using System.ComponentModel.DataAnnotations;

namespace NeoWeb.Models
{
    public class Subscription
    {
        [Key]
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public bool IsSubscription { get; set; }
        
        public DateTime SubscriptionTime { get; set; }
    }
}
