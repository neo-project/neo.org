using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    public partial class TwoLanguageCovers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Cover",
                table: "Events",
                newName: "EnglishCover");

            migrationBuilder.AddColumn<string>(
                name: "ChineseCover",
                table: "News",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EnglishCover",
                table: "News",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ChineseCover",
                table: "Events",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChineseCover",
                table: "News");

            migrationBuilder.DropColumn(
                name: "EnglishCover",
                table: "News");

            migrationBuilder.DropColumn(
                name: "ChineseCover",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "EnglishCover",
                table: "Events",
                newName: "Cover");
        }
    }
}
