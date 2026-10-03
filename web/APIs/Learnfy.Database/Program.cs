using YourApp.Data;

if (args.Length != 1 || args[0] is not ("migrate" or "seed-development" or "status"))
{
    Console.Error.WriteLine("Usage: dotnet run --project web/APIs/Learnfy.Database -- migrate|seed-development|status");
    return 2;
}
try
{
    var provider = Environment.GetEnvironmentVariable("Database__Provider") ?? "SqlServer";
    var connection = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
        ?? throw new InvalidOperationException("Set ConnectionStrings__DefaultConnection. Never pass secrets on the command line.");
    var options = new Microsoft.EntityFrameworkCore.DbContextOptionsBuilder<AppDbContext>();
    DatabaseSetup.Configure(options, provider, connection);
    await using var db = new AppDbContext(options.Options);
    switch (args[0])
    {
        case "migrate":
            await DatabaseSetup.MigrateEmptyOrVersionedDatabaseAsync(db);
            Console.WriteLine("Versioned migrations applied successfully.");
            break;
        case "seed-development":
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            if (environment is not ("Development" or "Testing"))
                throw new InvalidOperationException("Sample catalog seeding is allowed only in Development/Testing, never Production.");
            await DevelopmentCatalog.SeedAsync(db);
            Console.WriteLine("Recovered sample catalog inserted. Development data, not production offerings.");
            break;
        case "status":
            var applied = await Microsoft.EntityFrameworkCore.RelationalDatabaseFacadeExtensions.GetAppliedMigrationsAsync(db.Database);
            var pending = await Microsoft.EntityFrameworkCore.RelationalDatabaseFacadeExtensions.GetPendingMigrationsAsync(db.Database);
            Console.WriteLine("Applied: " + string.Join(", ", applied));
            Console.WriteLine("Pending: " + string.Join(", ", pending));
            break;
    }
    return 0;
}
catch (Exception exception)
{
    // Do not dump configuration or raw connection strings.
    Console.Error.WriteLine($"Database operation failed ({exception.GetType().Name}): {exception.Message}");
    return 1;
}
