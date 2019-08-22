using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    public partial class EventTags : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChineseTags",
                table: "Events",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EnglishTags",
                table: "Events",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChineseTags",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EnglishTags",
                table: "Events");
        }
    }
}
