using System;

namespace NeoWeb.Models
{
    public class NewsViewModel
    {
        public NewsViewModelType Type { get; set; }

        public DateTime Time { get; set; }

        public BlogViewModel Blog { get; set; }
        public EventViewModel Event { get; set; }
        public MediaViewModel News { get; set; }

        public NewsViewModel()
        { }

        public NewsViewModel(NewsViewModelType type, object data, bool isZh)
        {
            try
            {
                switch (type)
                {
                    case NewsViewModelType.Blog:
                        Blog = new BlogViewModel((Blog)data, isZh);
                        Time = Blog.CreateTime;
                        break;
                    case NewsViewModelType.Event:
                        Event = new EventViewModel((Event)data, isZh);
                        Time = Event.StartTime;
                        break;
                    case NewsViewModelType.Media:
                        News = new MediaViewModel((Media)data, isZh);
                        Time = News.Time;
                        break;
                    default:
                        throw new ArgumentException("Type does not match.");
                        //break;
                }
            }
            catch (InvalidCastException)
            {
                // re-throwing the exception
                throw;
            }
        }
    }

    public enum NewsViewModelType
    {
        Blog = 1,
        Event = 2,
        Media = 3
    }
}
