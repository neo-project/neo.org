using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    public partial class BlogCover : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChineseCover",
                table: "Blogs",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EnglishCover",
                table: "Blogs",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChineseCover",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "EnglishCover",
                table: "Blogs");
        }
    }
}
