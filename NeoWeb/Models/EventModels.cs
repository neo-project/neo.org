using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Models
{
    public class Event
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public virtual Country Country { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public EventType Type { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        public string Cover { get; set; }

        public string Details { get; set; }

        [Required]
        public string Organizers { get; set; }

        [Required]
        public bool IsFree { get; set; }

        public string ThirdPartyLink { get; set; }
    }

    public enum EventType
    {
        DevCon,
        Meetup,
        Workshop,
        Hackathon
    }
}
