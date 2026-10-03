using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using YourApp.Data;

namespace Learnfy.Tests;

public sealed class TestDatabase : IAsyncDisposable
{
    public SqliteConnection Connection { get; } = new("Data Source=:memory:");
    public AppDbContext CreateContext() => new(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(Connection).Options);
    public async Task InitializeAsync()
    {
        await Connection.OpenAsync();
        await using var db = CreateContext();
        await db.Database.EnsureCreatedAsync(); // Test isolation only; never a production migration substitute.
    }
    public ValueTask DisposeAsync() => Connection.DisposeAsync();
}
