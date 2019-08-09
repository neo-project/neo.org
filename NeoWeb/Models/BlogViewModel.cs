using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Models
{
    public class BlogViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public string Content { get; set; }

        public string Summary { get; set; }

        public string Tags { get; set; }

        public DateTime CreateTime { get; set; }

        public int ReadCount { get; set; }
        
        public bool IsShow { get; set; }

        public BlogViewModel()
        {

        }

        public BlogViewModel(Blog blog, bool isZh)
        {
            if (isZh)
            {
                Id = blog.Id;
                Content = blog.ChineseContent;
                CreateTime = blog.CreateTime;
                IsShow = blog.IsShow;
                ReadCount = blog.ReadCount;
                Summary = blog.ChineseSummary;
                Tags = blog.ChineseTags;
                Title = blog.ChineseTitle;
            }
            else
            {
                Id = blog.Id;
                Content = blog.EnglishContent;
                CreateTime = blog.CreateTime;
                IsShow = blog.IsShow;
                ReadCount = blog.ReadCount;
                Summary = blog.EnglishSummary;
                Tags = blog.EnglishTags;
                Title = blog.EnglishTitle;
            }
        }
    }
}