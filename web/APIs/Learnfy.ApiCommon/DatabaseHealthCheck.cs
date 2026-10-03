using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using YourApp.Data;

namespace Learnfy.ApiCommon;

public sealed class DatabaseHealthCheck(AppDbContext db) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            // A TCP connection alone does not prove that the schema has been deployed.
            await db.Users.AsNoTracking().Select(x => x.Id).Take(1).ToListAsync(cancellationToken);
            return HealthCheckResult.Healthy();
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            return HealthCheckResult.Unhealthy("Database/schema is unavailable.", exception);
        }
    }
}
