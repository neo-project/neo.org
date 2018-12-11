using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    public partial class BlogTag : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Tags",
                table: "Blogs",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Tags",
                table: "Blogs");
        }
    }
}
