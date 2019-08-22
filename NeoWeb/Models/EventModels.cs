using System;
using System.ComponentModel.DataAnnotations;

namespace NeoWeb.Models
{
    public class Event
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "必须填写事件名称")]
        [Display(Name = "名称")]
        public string ChineseName { get; set; }

        [Required(ErrorMessage = "Event name is required")]
        [Display(Name = "Name")]
        public string EnglishName { get; set; }

        public virtual Country Country { get; set; }

        [Required(ErrorMessage = "必须填写城市")]
        [Display(Name = "城市")]
        public string ChineseCity { get; set; }

        [Required(ErrorMessage = "City is required")]
        [Display(Name = "City")]
        public string EnglishCity { get; set; }

        [Required(ErrorMessage = "必须填写地址")]
        [Display(Name = "地址")]
        public string ChineseAddress { get; set; }

        [Required(ErrorMessage = "Address is required")]
        [Display(Name = "Address")]
        public string EnglishAddress { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [Display(Name = "详情")]
        public string ChineseDetails { get; set; }

        [Display(Name = "Details")]
        public string EnglishDetails { get; set; }

        [Required(ErrorMessage = "必须填写组织者")]
        [Display(Name = "组织者")]
        public string ChineseOrganizers { get; set; }

        [Required(ErrorMessage = "Organizers is required")]
        [Display(Name = "Organizers")]
        public string EnglishOrganizers { get; set; }

        public string ChineseCover { get; set; }

        public string EnglishCover { get; set; }

        public string ChineseTags { get; set; }

        public string EnglishTags { get; set; }

        [Required]
        public bool IsFree { get; set; }
    }
}
