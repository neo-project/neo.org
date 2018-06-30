using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Models
{
    public class Candidate
    {
        [Key]
        [Required]
        [RegularExpression("03[0-9a-f]{64}")]
        public string PublicKey { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        [RegularExpression("((?:(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d))))")]
        public string IP { get; set; }
        
        [Required]
        [MaxLength(50)]
        [RegularExpression("^(?=^.{3,255}$)(http(s)?:\\/\\/)?(www\\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\\d+)*(\\/\\w+\\.\\w+)*$")]
        public string Website { get; set; }

        [MaxLength(100)]
        public string Details { get; set; }

        [MaxLength(50)]
        public virtual Country Country { get; set; }

        [MaxLength(50)]
        public string SocialAccount { get; set; }

        [MaxLength(50)]
        public string Telegram { get; set; }

        [MaxLength(100)]
        public string Summary { get; set; }

    }
}
