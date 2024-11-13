using System.ComponentModel.DataAnnotations;

namespace NeoWeb.Models
{
    public class Top
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public NewsViewModelType Type { get; set; }

        [Required]
        public int ItemId { get; set; }
    }
}
