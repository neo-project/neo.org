using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    public partial class NewBlog : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Blogs",
                newName: "EnglishTitle");

            migrationBuilder.RenameColumn(
                name: "Tags",
                table: "Blogs",
                newName: "EnglishTags");

            migrationBuilder.RenameColumn(
                name: "Summary",
                table: "Blogs",
                newName: "EnglishSummary");

            migrationBuilder.RenameColumn(
                name: "Lang",
                table: "Blogs",
                newName: "ChineseTags");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Blogs",
                newName: "EnglishContent");

            migrationBuilder.RenameColumn(
                name: "BrotherBlogId",
                table: "Blogs",
                newName: "OldId");

            migrationBuilder.AddColumn<string>(
                name: "ChineseContent",
                table: "Blogs",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ChineseSummary",
                table: "Blogs",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ChineseTitle",
                table: "Blogs",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChineseContent",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "ChineseSummary",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "ChineseTitle",
                table: "Blogs");

            migrationBuilder.RenameColumn(
                name: "OldId",
                table: "Blogs",
                newName: "BrotherBlogId");

            migrationBuilder.RenameColumn(
                name: "EnglishTitle",
                table: "Blogs",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "EnglishTags",
                table: "Blogs",
                newName: "Tags");

            migrationBuilder.RenameColumn(
                name: "EnglishSummary",
                table: "Blogs",
                newName: "Summary");

            migrationBuilder.RenameColumn(
                name: "EnglishContent",
                table: "Blogs",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "ChineseTags",
                table: "Blogs",
                newName: "Lang");
        }
    }
}
