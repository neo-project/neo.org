using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NeoWeb.Models
{
    public class Careers
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [NotMapped]
        public string Lang { get; set; }

        [Required]
        public bool IsShow { get; set; }

        [Required]
        public CareersType Type { get; set; }

        [Required]
        public string Description { get; set; }

    }

    public enum CareersType
    {
        RandD,
        Marketing,
        EcosystemGrowth,
        HRandAdmin
    }
}
