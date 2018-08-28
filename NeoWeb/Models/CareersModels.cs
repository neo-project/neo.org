using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Models
{
    public class Careers
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Lang { get; set; }

        [Required]
        public Boolean IsShow { get; set; }

        [Required]
        public CareersType Type { get; set; }

        [Required]
        public string Description { get; set; }

    }


    public enum CareersType
    {
        RandD,
        Marketing,
        Ecosystem,
        HR
    }
}
