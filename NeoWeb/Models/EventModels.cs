using System;
using System.ComponentModel.DataAnnotations;

namespace NeoWeb.Models
{
    public class Event
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Chinese Name")]
        public string ChineseName { get; set; }

        [Required]
        [Display(Name = "English Name")]
        public string EnglishName { get; set; }

        public virtual Country Country { get; set; }

        [Required]
        [Display(Name = "Chinese City")]
        public string ChineseCity { get; set; }

        [Required]
        [Display(Name = "English City")]
        public string EnglishCity { get; set; }

        [Required]
        [Display(Name = "Chinese Address")]
        public string ChineseAddress { get; set; }

        [Required]
        [Display(Name = "English Address")]
        public string EnglishAddress { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [Display(Name = "Chinese Details")]
        public string ChineseDetails { get; set; }

        [Display(Name = "English Details")]
        public string EnglishDetails { get; set; }

        [Required]
        [Display(Name = "Chinese Organizers")]
        public string ChineseOrganizers { get; set; }

        [Required]
        [Display(Name = "English Organizers")]
        public string EnglishOrganizers { get; set; }

        [Display(Name = "Chinese Cover")]
        public string ChineseCover { get; set; }

        [Display(Name = "English Cover")]
        public string EnglishCover { get; set; }

        [Display(Name = "Chinese Tags")]
        public string ChineseTags { get; set; }

        [Display(Name = "English Tags")]
        public string EnglishTags { get; set; }

        [Required]
        public bool IsFree { get; set; }
    }
}
