using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NeoWeb.Models
{
    public class Blog
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "必须填写博客标题")]
        [Display(Name = "文章标题")]
        public string Title { get; set; }

        [Display(Name = "文章正文")]
        [Required(ErrorMessage = "必须填写博客正文")]
        public string Content { get; set; }

        public string Summary { get; set; }

        [Display(Name = "博客语言")]
        public string Lang { get; set; }         
        
        public DateTime CreateTime { get; set; }

        public DateTime EditTime { get; set; }

        public int ReadCount { get; set; }

        public virtual ApplicationUser User { get; set; }
    }
}



