using System;
using System.ComponentModel.DataAnnotations;

namespace NeoWeb.Models
{
    public class News
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Link { get; set; }

        public DateTime Time { get; set; }
    }
}
