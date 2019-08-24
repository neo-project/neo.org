using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;

namespace NeoWeb.Models
{
    public class Blog
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "必须填写中文标题")]
        [Display(Name = "标题")]
        public string ChineseTitle { get; set; }

        [Required(ErrorMessage = "必须填写英文标题")]
        [Display(Name = "Title")]
        public string EnglishTitle { get; set; }

        [Display(Name = "正文")]
        [Required(ErrorMessage = "必须填写中文内容")]
        public string ChineseContent { get; set; }

        [Display(Name = "Content")]
        [Required(ErrorMessage = "必须填写英文内容")]
        public string EnglishContent { get; set; }

        public string ChineseSummary { get; set; }

        public string ChineseTags { get; set; }

        public string ChineseCover { get; set; }

        public string EnglishSummary { get; set; }

        public string EnglishTags { get; set; }

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
