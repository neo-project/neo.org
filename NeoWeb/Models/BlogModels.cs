using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;

namespace NeoWeb.Models
{
    public class Blog
    {
        [Key]
        public int Id { get; set; }

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

        [Display(Name = "Chinese Summary")]
        public string ChineseSummary { get; set; }

        [Display(Name = "English Summary")]
        public string EnglishSummary { get; set; }

        [Display(Name = "Chinese Tags")]
        public string ChineseTags { get; set; }

        [Display(Name = "English Tags")]
        public string EnglishTags { get; set; }

        [Display(Name = "Chinese Cover")]
        public string ChineseCover { get; set; }

        [Display(Name = "English Cover")]
        public string EnglishCover { get; set; }

        public DateTime CreateTime { get; set; }

        public DateTime EditTime { get; set; }

        public int ReadCount { get; set; }

        public virtual IdentityUser User { get; set; }

        public string Editor { get; set; }

        public bool IsShow { get; set; }

        public int? OldId { get; set; }
    }
}
