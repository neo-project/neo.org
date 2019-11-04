using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    public partial class Top : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FwLInk_AspNetUsers_UserId",
                table: "FwLInk");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FwLInk",
                table: "FwLInk");

            migrationBuilder.RenameTable(
                name: "FwLInk",
                newName: "FwLink");

            migrationBuilder.RenameIndex(
                name: "IX_FwLInk_UserId",
                table: "FwLink",
                newName: "IX_FwLink_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FwLink",
                table: "FwLink",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Top",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Type = table.Column<int>(nullable: false),
                    ItemId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Top", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_FwLink_AspNetUsers_UserId",
                table: "FwLink",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FwLink_AspNetUsers_UserId",
                table: "FwLink");

            migrationBuilder.DropTable(
                name: "Top");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FwLink",
                table: "FwLink");

            migrationBuilder.RenameTable(
                name: "FwLink",
                newName: "FwLInk");

            migrationBuilder.RenameIndex(
                name: "IX_FwLink_UserId",
                table: "FwLInk",
                newName: "IX_FwLInk_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FwLInk",
                table: "FwLInk",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FwLInk_AspNetUsers_UserId",
                table: "FwLInk",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
