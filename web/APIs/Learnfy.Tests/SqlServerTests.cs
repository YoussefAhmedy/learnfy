using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using YourApp.Data;
using YourApp.Models;
using Xunit;

namespace Learnfy.Tests;

public sealed class SqlServerTests
{
    [Fact, Trait("Category", "SqlServer")]
    public async Task ActualSqlServerMigrationIsCurrentExactReversibleAndPreservesUnknownTables()
    {
        var configured = Environment.GetEnvironmentVariable("LEARNFY_TEST_SQLSERVER")
            ?? throw new InvalidOperationException("Set LEARNFY_TEST_SQLSERVER for SQL Server integration tests. For SQLite-only checks use --filter 'Category!=SqlServer'. CI always runs this test.");
        // Override catalog with a freshly generated name. Never delete the supplied database.
        var connection = new SqlConnectionStringBuilder(configured)
        {
            InitialCatalog = $"learnfy_ci_{Guid.NewGuid():N}", TrustServerCertificate = true
        };
        var options = new DbContextOptionsBuilder<AppDbContext>();
        DatabaseSetup.Configure(options, "SqlServer", connection.ConnectionString);
        await using var db = new AppDbContext(options.Options);
        try
        {
            await DatabaseSetup.MigrateEmptyOrVersionedDatabaseAsync(db);
            Assert.Single(await db.Database.GetAppliedMigrationsAsync());
            Assert.False(db.Database.HasPendingModelChanges());
            db.Categories.Add(new IBSRA.Models.Category { Name = "SQL Price Test" });
            db.Courses.Add(new Course { CourseName = "Actual SQL Product", Category = "SQL Price Test", Price = 99.99m, Rating = 4.8m });
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();
            var course = await db.Courses.SingleAsync();
            Assert.Equal(99.99m, course.Price);
            Assert.Equal(4.8m, course.Rating);
            await DatabaseSetup.MigrateEmptyOrVersionedDatabaseAsync(db);
            await db.GetService<IMigrator>().MigrateAsync("0");
            Assert.Empty(await db.Database.GetAppliedMigrationsAsync());
            await db.Database.ExecuteSqlRawAsync("CREATE TABLE LegacyUsers (Name nvarchar(100) NOT NULL)");
            await db.Database.ExecuteSqlRawAsync("INSERT INTO LegacyUsers VALUES ('Do not erase this row')");
            await Assert.ThrowsAsync<InvalidOperationException>(() => DatabaseSetup.MigrateEmptyOrVersionedDatabaseAsync(db));
            await db.Database.OpenConnectionAsync();
            using var command = db.Database.GetDbConnection().CreateCommand();
            command.CommandText = "SELECT Name FROM LegacyUsers";
            Assert.Equal("Do not erase this row", await command.ExecuteScalarAsync());
        }
        finally
        {
            await db.Database.CloseConnectionAsync();
            await db.Database.EnsureDeletedAsync(); // Only the generated learnfy_ci_<GUID> catalog.
        }
    }
}
