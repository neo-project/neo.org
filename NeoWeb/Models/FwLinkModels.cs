using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NeoWeb.Models
{
    public class FwLink
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "必须填写链接地址")]
        [RegularExpression(@"((http|ftp|https)://)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*.*", ErrorMessage = "不正确的链接格式")]
        public string Link { get; set; }
        [Required(ErrorMessage = "必须填写链接名称")]
        public string Name { get; set; }

        public virtual IdentityUser User { get; set; }

        public DateTime CreateTime { get; set; }
        public DateTime EditTime { get; set; }
    }
}
