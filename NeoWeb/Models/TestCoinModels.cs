using System;
using System.ComponentModel.DataAnnotations;

namespace NeoWeb.Models
{
    public class TestCoin
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "姓名")]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [Display(Name = "邮箱")]
        public string Email { get; set; }

        [Phone]
        [Display(Name = "电话")]
        public string Phone { get; set; }

        [Display(Name = "QQ")]
        public string QQ { get; set; }

        [Required]
        [Display(Name = "公司名/项目名")]
        public string Company { get; set; }

        [Required]
        [Display(Name = "申请理由")]
        [StringLength(300, MinimumLength = 50, ErrorMessage = "申请理由至少50字，最多300字")]
        public string Reason { get; set; }

        [Required]
        [Display(Name = "申请数量 (NEO)")]
        [RegularExpression("\\d+", ErrorMessage = "申请数量必须为整数")]
        public string NeoCount { get; set; }

        [Required]
        [Display(Name = "申请数量 (GAS)")]
        [RegularExpression("\\d+", ErrorMessage = "申请数量必须为整数")]
        public string GasCount { get; set; }

        [Display(Name = "申请日期")]
        public DateTime Time { get; set; }

        [Required]
        [Display(Name = "NEO公钥")]
        [RegularExpression("0[0-9|abcdef]{65}", ErrorMessage = "不正确的NEO公钥")]
        public string PubKey { get; set; }

        [Display(Name = "备注")]
        public string Remark { get; set; }
    }
}