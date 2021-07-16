using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Models
{
    public class MediaViewModel
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Link { get; set; }

        public DateTime Time { get; set; }

        public string Cover { get; set; }

        public string Tags { get; set; }

        public MediaViewModel()
        { }

        public MediaViewModel(Media news, bool isZh)
        {
            Id = news.Id;
            Time = news.Time;
            Link = news.Link;
            Title = isZh ? news.ChineseTitle : news.EnglishTitle;
            Cover = isZh ? news.ChineseCover : news.EnglishCover;
            Tags = isZh ? news.ChineseTags : news.EnglishTags;
        }
    }
}
