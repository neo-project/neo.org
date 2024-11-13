using System;

namespace NeoWeb.Models
{
    public class BlogViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public string Content { get; set; }

        public string Summary { get; set; }

        public string Tags { get; set; }

        public string Cover { get; set; }

        public DateTime CreateTime { get; set; }

        public int ReadCount { get; set; }

        public bool IsShow { get; set; }
        public string Editor { get; set; }

        public BlogViewModel()
        { }

        public BlogViewModel(Blog blog, bool isZh)
        {
            Id = blog.Id;
            CreateTime = blog.CreateTime;
            IsShow = blog.IsShow;
            ReadCount = blog.ReadCount;
            Editor = blog.Editor;
            Content = isZh ? blog.ChineseContent : blog.EnglishContent;
            Summary = isZh ? blog.ChineseSummary : blog.EnglishSummary;
            Tags = isZh ? blog.ChineseTags : blog.EnglishTags;
            Title = isZh ? blog.ChineseTitle : blog.EnglishTitle;
            Cover = isZh ? blog.ChineseCover : blog.EnglishCover;
        }
    }
}
