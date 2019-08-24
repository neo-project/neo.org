using System;
using System.ComponentModel.DataAnnotations;

namespace NeoWeb.Models
{
    public class News
    {
        [Key]
        public int Id { get; set; }

        [Display(Name = "标题")]
        [Required(ErrorMessage = "必须填写中文标题")]
        public string ChineseTitle { get; set; }

        [Display(Name = "Title")]
        [Required(ErrorMessage = "必须填写英文标题")]
        public string EnglishTitle { get; set; }

        public string ChineseCover { get; set; }

        public string EnglishCover { get; set; }

        [Required(ErrorMessage = "必须填写英文链接")]
        public string Link { get; set; }

        public string ChineseTags { get; set; }

        public string EnglishTags { get; set; }

        public DateTime Time { get; set; }
    }
}
