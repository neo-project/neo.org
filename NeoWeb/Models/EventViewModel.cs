using System;

namespace NeoWeb.Models
{
    public class EventViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Country { get; set; }

        public string City { get; set; }

        public string Address { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string Cover { get; set; }

        public string Details { get; set; }

        public string Organizers { get; set; }

        public string Tags { get; set; }

        public bool IsFree { get; set; }

        public string ThirdPartyLink { get; set; }

        public EventViewModel()
        { }

        public EventViewModel(Event evt, bool isZh)
        {
            Id = evt.Id;
            IsFree = evt.IsFree;
            StartTime = evt.StartTime;
            EndTime = evt.EndTime;
            Country = evt.Country?.ZhName;
            Name = isZh ? evt.ChineseName : evt.EnglishName;
            City = isZh ? evt.ChineseCity : evt.EnglishCity;
            Address = isZh ? evt.ChineseAddress : evt.EnglishAddress;
            Cover = isZh ? evt.ChineseCover : evt.EnglishCover;
            Details = isZh ? evt.ChineseDetails : evt.EnglishDetails;
            Organizers = isZh ? evt.ChineseOrganizers : evt.EnglishOrganizers;
            Tags = isZh ? evt.ChineseTags : evt.EnglishTags;
        }
    }
}
