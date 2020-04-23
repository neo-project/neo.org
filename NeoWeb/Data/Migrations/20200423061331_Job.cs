using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    public partial class Job : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Careers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Number = table.Column<string>(nullable: false),
                    ChineseTitle = table.Column<string>(nullable: false),
                    EnglishTitle = table.Column<string>(nullable: false),
                    ChineseContent = table.Column<string>(nullable: false),
                    EnglishContent = table.Column<string>(nullable: false),
                    ChineseGroup = table.Column<string>(nullable: false),
                    EnglishGroup = table.Column<string>(nullable: false),
                    CreateTime = table.Column<DateTime>(nullable: false),
                    EditTime = table.Column<DateTime>(nullable: false),
                    IsShow = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Careers", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Careers");
        }
    }
}
