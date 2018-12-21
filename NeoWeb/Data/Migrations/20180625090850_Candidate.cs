using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    public partial class Candidate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Media");

            migrationBuilder.AlterColumn<double>(
                name: "GiveBackCNY",
                table: "ICO2",
                nullable: false,
                oldClrType: typeof(decimal));

            migrationBuilder.AlterColumn<double>(
                name: "GiveBackCNY",
                table: "ICO1",
                nullable: false,
                oldClrType: typeof(decimal));

            migrationBuilder.CreateTable(
                name: "Candidates",
                columns: table => new
                {
                    PublicKey = table.Column<string>(nullable: false),
                    Email = table.Column<string>(nullable: false),
                    IP = table.Column<string>(nullable: false),
                    Website = table.Column<string>(maxLength: 50, nullable: false),
                    Details = table.Column<string>(maxLength: 100, nullable: true),
                    Location = table.Column<string>(maxLength: 50, nullable: true),
                    SocialAccount = table.Column<string>(maxLength: 50, nullable: true),
                    Telegram = table.Column<string>(maxLength: 50, nullable: true),
                    Summary = table.Column<string>(maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Candidates", x => x.PublicKey);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Candidates");

            migrationBuilder.AlterColumn<decimal>(
                name: "GiveBackCNY",
                table: "ICO2",
                nullable: false,
                oldClrType: typeof(double));

            migrationBuilder.AlterColumn<decimal>(
                name: "GiveBackCNY",
                table: "ICO1",
                nullable: false,
                oldClrType: typeof(double));

            migrationBuilder.CreateTable(
                name: "Media",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Description = table.Column<string>(nullable: true),
                    Image = table.Column<string>(nullable: true),
                    Link = table.Column<string>(nullable: false),
                    Time = table.Column<DateTime>(nullable: false),
                    Title = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Media", x => x.Id);
                });
        }
    }
}
