using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;

namespace NeoWeb.Models
{
    public class Blog
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "必须填写博客中文标题")]
        [Display(Name = "中文标题")]
        public string ChineseTitle { get; set; }

        [Display(Name = "中文正文")]
        [Required(ErrorMessage = "必须填写博客中文正文")]
        public string ChineseContent { get; set; }

        public string ChineseSummary { get; set; }

        public string ChineseTags { get; set; }

        [Required(ErrorMessage = "必须填写博客英文标题")]
        [Display(Name = "英文标题")]
        public string EnglishTitle { get; set; }

        [Display(Name = "英文正文")]
        [Required(ErrorMessage = "必须填写博客英文正文")]
        public string EnglishContent { get; set; }

        public string EnglishSummary { get; set; }

        public string EnglishTags { get; set; }

        public DateTime CreateTime { get; set; }

        public DateTime EditTime { get; set; }

        public int ReadCount { get; set; }

        public virtual IdentityUser User { get; set; }

        public bool IsShow { get; set; }

        public int? OldId { get; set; }
    }
}



