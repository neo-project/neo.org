using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    public partial class Consensus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Logo",
                table: "Candidates",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Organization",
                table: "Candidates",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Logo",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Organization",
                table: "Candidates");
        }
    }
}
