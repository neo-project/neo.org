using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace NeoWeb.Data.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260407091500_FixNewsMediaCompatibility")]
    public class FixNewsMediaCompatibility : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                IF OBJECT_ID(N'[dbo].[Media]', N'U') IS NULL
                   AND OBJECT_ID(N'[dbo].[News]', N'U') IS NOT NULL
                BEGIN
                    EXEC sp_rename N'[dbo].[News]', N'Media';
                END;

                IF OBJECT_ID(N'[dbo].[Media]', N'U') IS NOT NULL
                   AND EXISTS (
                       SELECT 1
                       FROM sys.key_constraints
                       WHERE parent_object_id = OBJECT_ID(N'[dbo].[Media]')
                         AND [type] = N'PK'
                         AND [name] = N'PK_News'
                   )
                   AND NOT EXISTS (
                       SELECT 1
                       FROM sys.key_constraints
                       WHERE parent_object_id = OBJECT_ID(N'[dbo].[Media]')
                         AND [type] = N'PK'
                         AND [name] = N'PK_Media'
                   )
                BEGIN
                    EXEC sp_rename N'[dbo].[PK_News]', N'PK_Media', N'OBJECT';
                END;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                IF OBJECT_ID(N'[dbo].[News]', N'U') IS NULL
                   AND OBJECT_ID(N'[dbo].[Media]', N'U') IS NOT NULL
                BEGIN
                    EXEC sp_rename N'[dbo].[Media]', N'News';
                END;

                IF OBJECT_ID(N'[dbo].[News]', N'U') IS NOT NULL
                   AND EXISTS (
                       SELECT 1
                       FROM sys.key_constraints
                       WHERE parent_object_id = OBJECT_ID(N'[dbo].[News]')
                         AND [type] = N'PK'
                         AND [name] = N'PK_Media'
                   )
                   AND NOT EXISTS (
                       SELECT 1
                       FROM sys.key_constraints
                       WHERE parent_object_id = OBJECT_ID(N'[dbo].[News]')
                         AND [type] = N'PK'
                         AND [name] = N'PK_News'
                   )
                BEGIN
                    EXEC sp_rename N'[dbo].[PK_Media]', N'PK_News', N'OBJECT';
                END;
                """);
        }
    }
}
