using System;
using System.ComponentModel.DataAnnotations;

namespace NeoWeb.Models
{
    public class Media
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Chinese Title")]
        public string ChineseTitle { get; set; }

        [Required]
        [Display(Name = "English Title")]
        public string EnglishTitle { get; set; }

        [Display(Name = "Chinese Cover")]
        public string ChineseCover { get; set; }

        [Display(Name = "English Cover")]
        public string EnglishCover { get; set; }

        [Required]
        public string Link { get; set; }

        [Display(Name = "Chinese Tags")]
        public string ChineseTags { get; set; }

        [Display(Name = "English Tags")]
        public string EnglishTags { get; set; }

        public DateTime Time { get; set; }
    }
}
