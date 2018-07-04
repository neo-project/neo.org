using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Models
{
    //Abandoned
    public class ICO2
    {
        [Key]
        public string NeoAddress { get; set; }

        [Required]
        public double GiveBackCNY { get; set; }

        [NotMapped]
        public Choose Choose { get; set; }

        [MinLength(2)]
        [MaxLength(8)]
        public string Name { get; set; }

        [MinLength(15)]
        [MaxLength(19)]
        public string BankAccount { get; set; }

        [MinLength(5)]
        [MaxLength(30)]
        public string BankName { get; set; }

        public string GivebackNeoAddress { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public DateTime? CommitTime { get; set; }
    }
}
