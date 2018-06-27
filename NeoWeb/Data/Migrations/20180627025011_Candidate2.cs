using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    public partial class Candidate2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "Candidates");

            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "Candidates",
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

        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Candidates",
                maxLength: 50,
                nullable: true);
        }
    }
}
