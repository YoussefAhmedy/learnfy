using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using YourApp.Data;
using YourApp.Models;
using Xunit;

namespace Learnfy.Tests;

public sealed class DatabaseTests
{
    private static AppDbContext MigrationContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>();
        DatabaseSetup.Configure(options, "Sqlite", "Data Source=:memory:");
        return new AppDbContext(options.Options);
    }

    [Fact]
    public async Task SqliteMigrationAppliesIsCurrentAndRollsBackInIsolatedDatabase()
    {
        await using var db = MigrationContext();
        await db.Database.OpenConnectionAsync();
        await DatabaseSetup.MigrateEmptyOrVersionedDatabaseAsync(db);
        Assert.Single(await db.Database.GetAppliedMigrationsAsync());
        Assert.False(db.Database.HasPendingModelChanges());
        db.Categories.Add(new IBSRA.Models.Category { Name = "Money Test" });
        db.Courses.Add(new Course { CourseName = "Exact Price", Category = "Money Test", Price = 99.99m });
        await db.SaveChangesAsync();
        using var command = db.Database.GetDbConnection().CreateCommand();
        command.CommandText = "SELECT Price FROM Courses";
        Assert.Equal(9999L, Convert.ToInt64(await command.ExecuteScalarAsync()));
        db.ChangeTracker.Clear();
        Assert.Equal(99.99m, (await db.Courses.SingleAsync()).Price);
        await DatabaseSetup.MigrateEmptyOrVersionedDatabaseAsync(db); // Reapplying is idempotent.
        await db.GetService<IMigrator>().MigrateAsync("0"); // Fresh, isolated test database only.
        Assert.Empty(await db.Database.GetAppliedMigrationsAsync());
    }

    [Fact]
    public async Task UnknownLegacySchemaIsNeverSilentlyMigratedOrDeleted()
    {
        await using var db = MigrationContext();
        await db.Database.OpenConnectionAsync();
        await db.Database.ExecuteSqlRawAsync("CREATE TABLE LegacyUsers (Name TEXT NOT NULL)");
        await db.Database.ExecuteSqlRawAsync("INSERT INTO LegacyUsers VALUES ('Preserve this record')");
        var failure = await Assert.ThrowsAsync<InvalidOperationException>(() => DatabaseSetup.MigrateEmptyOrVersionedDatabaseAsync(db));
        Assert.Contains("unversioned", failure.Message);
        using var command = db.Database.GetDbConnection().CreateCommand();
        command.CommandText = "SELECT Name FROM LegacyUsers";
        Assert.Equal("Preserve this record", await command.ExecuteScalarAsync());
    }

    [Theory]
    [InlineData("99.99", 9999L)]
    [InlineData("0", 0L)]
    [InlineData("0.01", 1L)]
    public void MoneyIsExact(string value, long expected) => Assert.Equal(expected,
        Money.ToMinorUnits(decimal.Parse(value, System.Globalization.CultureInfo.InvariantCulture)));

    [Theory]
    [InlineData("1.001")]
    [InlineData("-1")]
    public void InvalidMoneyIsRejectedInsteadOfTruncated(string value) => Assert.Throws<ArgumentOutOfRangeException>(() =>
        Money.ToMinorUnits(decimal.Parse(value, System.Globalization.CultureInfo.InvariantCulture)));
}
