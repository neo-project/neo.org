using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    public partial class BlogEditorAndNewsTags : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThirdPartyLink",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Events");

            migrationBuilder.AddColumn<string>(
                name: "ChineseTags",
                table: "News",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EnglishTags",
                table: "News",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Editor",
                table: "Blogs",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChineseTags",
                table: "News");

            migrationBuilder.DropColumn(
                name: "EnglishTags",
                table: "News");

            migrationBuilder.DropColumn(
                name: "Editor",
                table: "Blogs");

            migrationBuilder.AddColumn<string>(
                name: "ThirdPartyLink",
                table: "Events",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Events",
                nullable: false,
                defaultValue: 0);
        }
    }
}
