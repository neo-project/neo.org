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
        [DisplayName("Contact Number")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        [DisplayName("Mail Address")]
        [EmailAddress(ErrorMessage = "The {0} field is not a valid e-mail address.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        [DisplayName("University")]
        public string Scool { get; set; }

        [Required(ErrorMessage = "The {0} field is required.")]
        [DisplayName("Major")]
        public string Specialty { get; set; }

        public string Path { get; set; }

        [DisplayName("Referral Code")]
        public string ReferralCode { get; set; }

        [DisplayName("My referral code")]
        public string MyReferralCode { get; set; }

        [DisplayName("Submit Date")]
        public DateTime DateTime { get; set; }
    }
}
