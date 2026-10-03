using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace YourApp.Data;

public sealed class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var provider = Environment.GetEnvironmentVariable("Database__Provider") ?? "SqlServer";
        var connection = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? throw new InvalidOperationException("Set ConnectionStrings__DefaultConnection before running migration commands.");
        var options = new DbContextOptionsBuilder<AppDbContext>();
        if (provider == "Sqlite") options.UseSqlite(connection);
        else if (provider == "SqlServer") options.UseSqlServer(connection);
        else throw new InvalidOperationException("Database__Provider must be SqlServer or Sqlite.");
        return new AppDbContext(options.Options);
    }
}
