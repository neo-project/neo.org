using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Models
{
    public class Media
    {
        [Key]
        public int Id { get; set; }

        [Url]
        [Required]
        public string Link { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string Image { get; set; }

        public DateTime Time { get; set; }
    }
}
