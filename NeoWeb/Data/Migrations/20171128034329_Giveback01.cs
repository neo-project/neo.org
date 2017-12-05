using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace NeoWeb.Data.Migrations
{
    public partial class Giveback01 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ICO1",
                columns: table => new
                {
                    RedeemCode = table.Column<string>(nullable: false),
                    BankAccount = table.Column<string>(maxLength: 19, nullable: true),
                    BankName = table.Column<string>(maxLength: 30, nullable: true),
                    CommitTime = table.Column<DateTime>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    GiveBackCNY = table.Column<decimal>(nullable: false),
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
                    GiveBackCNY = table.Column<decimal>(nullable: false),
                    GivebackNeoAddress = table.Column<string>(nullable: true),
                    Name = table.Column<string>(maxLength: 8, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ICO2", x => x.NeoAddress);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ICO1");

            migrationBuilder.DropTable(
                name: "ICO2");
        }
    }
}
