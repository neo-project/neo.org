using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Models
{
    public class BlogViewModels
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public string Content { get; set; }

        public string Summary { get; set; }

        public string Tags { get; set; }

        public DateTime CreateTime { get; set; }

        public int ReadCount { get; set; }
        
        public bool IsShow { get; set; }
    }
}