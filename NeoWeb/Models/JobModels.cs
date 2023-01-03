using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Models
{
    public class Job
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Job No.")]
        public string Number { get; set; }

        [Required]
        [Display(Name = "Chinese Title")]
        public string ChineseTitle { get; set; }

        [Required]
        [Display(Name = "English Title")]
        public string EnglishTitle { get; set; }

        [Required]
        [Display(Name = "Chinese Content")]
        public string ChineseContent { get; set; }

        [Required]
        [Display(Name = "English Content")]
        public string EnglishContent { get; set; }

        [Required]
        [Display(Name = "Chinese Group")]
        public string ChineseGroup { get; set; }

        [Required]
        [Display(Name = "English Group")]
        public string EnglishGroup { get; set; }

        public DateTime CreateTime { get; set; }

        public DateTime EditTime { get; set; }

        public bool IsShow { get; set; }
    }
}
