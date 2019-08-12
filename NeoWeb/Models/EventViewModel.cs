using System;

namespace NeoWeb.Models
{
    public class EventViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Country { get; set; }

        public string City { get; set; }

        public int Type { get; set; }

        public string Address { get; set; }

        //public DateTime CreateTime { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string Cover { get; set; }

        public string Details { get; set; }

        public string Organizers { get; set; }

        public bool IsFree { get; set; }

        public string ThirdPartyLink { get; set; }

        public EventViewModel()
        {

        }

        public EventViewModel(Event evt, bool isZh)
        {
            if (isZh)
            {
                Id = evt.Id;
                Name = evt.ChineseName;
                Type = (int)evt.Type;
                Country = evt.Country.ZhName;
                City = evt.ChineseCity;
                Address = evt.ChineseAddress;
                StartTime = evt.StartTime;
                EndTime = evt.EndTime;
                Cover = evt.Cover;
                Details = evt.ChineseDetails;
                Organizers = evt.ChineseOrganizers;
                IsFree = evt.IsFree;
                ThirdPartyLink = evt.ThirdPartyLink;
            }
            else
            {
                Id = evt.Id;
                Name = evt.EnglishName;
                Type = (int)evt.Type;
                Country = evt.Country.Name;
                City = evt.EnglishCity;
                Address = evt.EnglishAddress;
                StartTime = evt.StartTime;
                EndTime = evt.EndTime;
                Cover = evt.Cover;
                Details = evt.EnglishDetails;
                Organizers = evt.EnglishOrganizers;
                IsFree = evt.IsFree;
                ThirdPartyLink = evt.ThirdPartyLink;
            }
        }
    }
}
