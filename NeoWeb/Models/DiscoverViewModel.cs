using System;

namespace NeoWeb.Models
{
    public class DiscoverViewModel
    {
        public DiscoverViewModelType Type { get; set; }

        public DateTime Time { get; set; }

        public BlogViewModel Blog { get; set; }
        public EventViewModel Event { get; set; }
        public MediaViewModel News { get; set; }

        public DiscoverViewModel()
        { }

        public DiscoverViewModel(DiscoverViewModelType type, object data, bool isZh)
        {
            try
            {
                switch (type)
                {
                    case DiscoverViewModelType.Blog:
                        Blog = new BlogViewModel((Blog)data, isZh);
                        Time = Blog.CreateTime;
                        break;
                    case DiscoverViewModelType.Event:
                        Event = new EventViewModel((Event)data, isZh);
                        Time = Event.StartTime;
                        break;
                    case DiscoverViewModelType.Media:
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

    public enum DiscoverViewModelType
    {
        Blog = 1,
        Event = 2,
        Media = 3
    }
}
