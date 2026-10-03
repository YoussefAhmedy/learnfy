using System.Data;
using Microsoft.EntityFrameworkCore;

namespace YourApp.Data;

public static class DatabaseSetup
{
    public static void Configure(DbContextOptionsBuilder options, string provider, string connection)
    {
        if (string.IsNullOrWhiteSpace(connection)) throw new InvalidOperationException("Configure ConnectionStrings:DefaultConnection.");
        switch (provider)
        {
            case "SqlServer": options.UseSqlServer(connection, sql => sql.MigrationsAssembly("Learnfy.Migrations.SqlServer")); break;
            case "Sqlite": options.UseSqlite(connection, sqlite => sqlite.MigrationsAssembly("Learnfy.Migrations.Sqlite")); break;
            default: throw new InvalidOperationException("Database:Provider must be SqlServer or Sqlite.");
        }
    }

    public static async Task MigrateEmptyOrVersionedDatabaseAsync(AppDbContext db, CancellationToken cancellationToken = default)
    {
        // Refuse to 'adopt' unknown pre-existing tables: legacy recovery needs an explicit import plan.
        if (await db.Database.CanConnectAsync(cancellationToken) && !(await db.Database.GetAppliedMigrationsAsync(cancellationToken)).Any())
        {
            var connection = db.Database.GetDbConnection();
            var close = connection.State != ConnectionState.Open;
            if (close) await connection.OpenAsync(cancellationToken);
            try
            {
                using var command = connection.CreateCommand();
                command.CommandText = db.Database.IsSqlite()
                    ? "SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name <> '__EFMigrationsHistory'"
                    : "SELECT COUNT(*) FROM sys.tables WHERE is_ms_shipped = 0 AND name <> '__EFMigrationsHistory'";
                var count = Convert.ToInt64(await command.ExecuteScalarAsync(cancellationToken), System.Globalization.CultureInfo.InvariantCulture);
                if (count > 0) throw new InvalidOperationException("Refusing migration: this database contains unversioned tables. Back up and follow docs/DATABASE.md before importing legacy data.");
            }
            finally { if (close) await connection.CloseAsync(); }
        }
        await db.Database.MigrateAsync(cancellationToken);
    }
}
