using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Models
{
    public class NewsViewModel
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Link { get; set; }

        public DateTime Time { get; set; }

        public string Cover { get; set; }

        public NewsViewModel()
        { }

        public NewsViewModel(News news, bool isZh)
        {
            if (isZh)
            {
                Id = news.Id;
                Title = news.ChineseTitle;
                Time = news.Time;
                Link = news.Link;
                Cover = news.ChineseCover;
            }
            else
            {
                Id = news.Id;
                Title = news.EnglishTitle;
                Time = news.Time;
                Link = news.Link;
                Cover = news.EnglishCover;
            }
        }
    }
}
