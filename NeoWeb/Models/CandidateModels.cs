using System.ComponentModel.DataAnnotations;

namespace NeoWeb.Models
{
    public class Candidate
    {
        [Key]
        [Required]
        [RegularExpression("0[0-9a-f]{65}")]
        public string PublicKey { get; set; }

        [Required]
        [MaxLength(50)]
        public string Organization { get; set; }

        public string Logo { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        [MaxLength(50)]
        [RegularExpression("^(?=^.{3,255}$)(http(s)?:\\/\\/)?(www\\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\\d+)*(\\/\\w+\\.\\w+)*$")]
        public string Website { get; set; }

        [MaxLength(200)]
        public string SocialAccount { get; set; }

        [MaxLength(500)]
        public string Summary { get; set; }

    }
}
