using System;
using System.ComponentModel.DataAnnotations;

namespace NeoWeb.Models
{
    public class News
    {
        [Key]
        public int Id { get; set; }

        [Display(Name = "标题")]
        [Required(ErrorMessage = "必须填写新闻标题")]
        public string ChineseTitle { get; set; }

        [Display(Name = "Title")]
        [Required(ErrorMessage = "Title is required")]
        public string EnglishTitle { get; set; }

        public string ChineseCover { get; set; }

        public string EnglishCover { get; set; }

        [Required(ErrorMessage = "Link is required")]
        public string Link { get; set; }

        public DateTime Time { get; set; }
    }
}
