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
            // Select mapped columns too: an old Users table is not sufficient readiness.
            await db.Users.AsNoTracking().Take(1).ToListAsync(cancellationToken);
            await db.Categories.AsNoTracking().Take(1).ToListAsync(cancellationToken);
            await db.Courses.AsNoTracking().Take(1).ToListAsync(cancellationToken);
            await db.UserCourseRecommendations.AsNoTracking().Take(1).ToListAsync(cancellationToken);
            await db.EmailOutboxMessages.AsNoTracking().Take(1).ToListAsync(cancellationToken);
            return HealthCheckResult.Healthy();
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            return HealthCheckResult.Unhealthy("Database/schema is unavailable.", exception);
        }
    }
}
