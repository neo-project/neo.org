using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    public partial class Candidate3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Candidates_Countries_CountryId",
                table: "Candidates");

            migrationBuilder.DropIndex(
                name: "IX_Candidates_CountryId",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Details",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "IP",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "Telegram",
                table: "Candidates");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "Candidates",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Details",
                table: "Candidates",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IP",
                table: "Candidates",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Telegram",
                table: "Candidates",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Candidates_CountryId",
                table: "Candidates",
                column: "CountryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Candidates_Countries_CountryId",
                table: "Candidates",
                column: "CountryId",
                principalTable: "Countries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
