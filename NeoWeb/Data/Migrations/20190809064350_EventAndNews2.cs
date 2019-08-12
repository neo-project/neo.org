using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    public partial class EventAndNews2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "News",
                newName: "EnglishTitle");

            migrationBuilder.RenameColumn(
                name: "Organizers",
                table: "Events",
                newName: "EnglishOrganizers");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Events",
                newName: "EnglishName");

            migrationBuilder.RenameColumn(
                name: "Details",
                table: "Events",
                newName: "EnglishDetails");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "Events",
                newName: "EnglishCity");

            migrationBuilder.RenameColumn(
                name: "Address",
                table: "Events",
                newName: "EnglishAddress");

            migrationBuilder.AddColumn<string>(
                name: "ChineseTitle",
                table: "News",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ChineseAddress",
                table: "Events",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ChineseCity",
                table: "Events",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ChineseDetails",
                table: "Events",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ChineseName",
                table: "Events",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ChineseOrganizers",
                table: "Events",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChineseTitle",
                table: "News");

            migrationBuilder.DropColumn(
                name: "ChineseAddress",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "ChineseCity",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "ChineseDetails",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "ChineseName",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "ChineseOrganizers",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "EnglishTitle",
                table: "News",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "EnglishOrganizers",
                table: "Events",
                newName: "Organizers");

            migrationBuilder.RenameColumn(
                name: "EnglishName",
                table: "Events",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "EnglishDetails",
                table: "Events",
                newName: "Details");

            migrationBuilder.RenameColumn(
                name: "EnglishCity",
                table: "Events",
                newName: "City");

            migrationBuilder.RenameColumn(
                name: "EnglishAddress",
                table: "Events",
                newName: "Address");
        }
    }
}
