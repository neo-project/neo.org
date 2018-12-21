using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    public partial class Refactoring : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ICO1");

            migrationBuilder.DropTable(
                name: "ICO2");

            migrationBuilder.DropTable(
                name: "Testnets");

            migrationBuilder.CreateTable(
                name: "TestCoins",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: false),
                    Email = table.Column<string>(nullable: false),
                    Phone = table.Column<string>(nullable: true),
                    QQ = table.Column<string>(nullable: true),
                    Company = table.Column<string>(nullable: false),
                    Reason = table.Column<string>(maxLength: 300, nullable: false),
                    NeoCount = table.Column<string>(nullable: false),
                    GasCount = table.Column<string>(nullable: false),
                    Time = table.Column<DateTime>(nullable: false),
                    PubKey = table.Column<string>(nullable: false),
                    Remark = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestCoins", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TestCoins");

            migrationBuilder.CreateTable(
                name: "ICO1",
                columns: table => new
                {
                    RedeemCode = table.Column<string>(nullable: false),
                    BankAccount = table.Column<string>(maxLength: 19, nullable: true),
                    BankName = table.Column<string>(maxLength: 30, nullable: true),
                    CommitTime = table.Column<DateTime>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    GiveBackCNY = table.Column<double>(nullable: false),
                    GivebackNeoAddress = table.Column<string>(nullable: true),
                    Name = table.Column<string>(maxLength: 8, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ICO1", x => x.RedeemCode);
                });

            migrationBuilder.CreateTable(
                name: "ICO2",
                columns: table => new
                {
                    NeoAddress = table.Column<string>(nullable: false),
                    BankAccount = table.Column<string>(maxLength: 19, nullable: true),
                    BankName = table.Column<string>(maxLength: 30, nullable: true),
                    CommitTime = table.Column<DateTime>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    GiveBackCNY = table.Column<double>(nullable: false),
                    GivebackNeoAddress = table.Column<string>(nullable: true),
                    Name = table.Column<string>(maxLength: 8, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ICO2", x => x.NeoAddress);
                });

            migrationBuilder.CreateTable(
                name: "Testnets",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ANCCount = table.Column<string>(nullable: false),
                    ANSCount = table.Column<string>(nullable: false),
                    Company = table.Column<string>(nullable: false),
                    Email = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Phone = table.Column<string>(nullable: true),
                    PubKey = table.Column<string>(nullable: false),
                    QQ = table.Column<string>(nullable: true),
                    Reason = table.Column<string>(maxLength: 300, nullable: false),
                    Remark = table.Column<string>(nullable: true),
                    Time = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Testnets", x => x.Id);
                });
        }
    }
}
