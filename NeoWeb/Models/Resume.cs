using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Models
{
    public class Resume
    {
        public int Id { get; set; }

        [DisplayName("Position")]
        public virtual Job Job { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        [DisplayName("Name")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        [DisplayName("Phone number")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        [DisplayName("Scool")]
        public string Scool { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        [DisplayName("Specialty")]
        public string Specialty { get; set; }

        public string Path { get; set; }

        [DisplayName("Referral code")]
        public string ReferralCode { get; set; }

        [DisplayName("My referral code")]
        public string MyReferralCode { get; set; }

        public DateTime DateTime { get; set; }
    }
}
