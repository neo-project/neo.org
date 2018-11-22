using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Models
{
    public class Subscription
    {
        [Key]
        [EmailAddress]
        public string Email { get; set; }

        public bool IsSubscription { get; set; }
        
        public DateTime SubscriptionTime { get; set; }
    }
}
