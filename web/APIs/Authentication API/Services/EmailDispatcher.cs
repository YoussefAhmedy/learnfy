using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using YourApp.Data;

namespace YourApp.Services;

public sealed class EmailDispatcher(IServiceScopeFactory scopes, IOptions<EmailSettings> settings, TimeProvider clock, ILogger<EmailDispatcher> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!settings.Value.IsConfigured)
        {
            logger.LogWarning("Email delivery disabled: configure Email:ApiKey, Email:From and Email:PublicWebUrl.");
            return;
        }
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(5));
        do
        {
            try { await DispatchBatchAsync(stoppingToken); }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) { return; }
            catch (Exception exception)
            {
                // Type only: do not put recipient, protected payload or provider body in logs.
                logger.LogError("Email dispatch batch failed ({ErrorType}).", exception.GetType().Name);
            }
        } while (await timer.WaitForNextTickAsync(stoppingToken));
    }

    public async Task DispatchBatchAsync(CancellationToken cancellationToken)
    {
        using var scope = scopes.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var sender = scope.ServiceProvider.GetRequiredService<ResendEmailSender>();
        var protector = scope.ServiceProvider.GetRequiredService<IDataProtectionProvider>().CreateProtector(EmailQueue.ProtectionPurpose);
        var now = clock.GetUtcNow().UtcDateTime;
        var ids = await db.EmailOutboxMessages.AsNoTracking().Where(message => message.SentAt == null && message.Attempts < 5 &&
                message.ExpiresAt > now && message.NextAttemptAt <= now && (message.LeaseUntil == null || message.LeaseUntil <= now))
            .OrderBy(message => message.CreatedAt).Take(20).Select(message => message.Id).ToListAsync(cancellationToken);
        foreach (var id in ids)
        {
            var lease = Guid.NewGuid();
            now = clock.GetUtcNow().UtcDateTime;
            var changed = await db.EmailOutboxMessages.Where(message => message.Id == id && message.SentAt == null &&
                    message.Attempts < 5 && message.ExpiresAt > now && message.NextAttemptAt <= now && (message.LeaseUntil == null || message.LeaseUntil <= now))
                .ExecuteUpdateAsync(setters => setters.SetProperty(message => message.LeaseId, lease)
                    .SetProperty(message => message.LeaseUntil, now.AddMinutes(1))
                    .SetProperty(message => message.Attempts, message => message.Attempts + 1), cancellationToken);
            if (changed == 0) continue;
            var message = await db.EmailOutboxMessages.SingleAsync(item => item.Id == id && item.LeaseId == lease, cancellationToken);
            try
            {
                await sender.SendAsync(message.Id, message.Recipient, message.Subject, protector.Unprotect(message.ProtectedBody), cancellationToken);
                message.SentAt = clock.GetUtcNow().UtcDateTime;
                message.ProtectedBody = string.Empty; // Erase credential-bearing payload after confirmed delivery.
                message.LastErrorCode = null;
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested) { throw; }
            catch (Exception exception) when (exception is HttpRequestException or TaskCanceledException or System.Security.Cryptography.CryptographicException)
            {
                message.LastErrorCode = exception is System.Security.Cryptography.CryptographicException ? "payload_unreadable" : "provider_unavailable";
                message.NextAttemptAt = clock.GetUtcNow().UtcDateTime.AddSeconds(Math.Min(600, 30 * Math.Pow(2, message.Attempts)));
                logger.LogWarning("Email {MessageId} delivery attempt {Attempt} failed ({ErrorCode}).", message.Id, message.Attempts, message.LastErrorCode);
            }
            message.LeaseUntil = null;
            message.LeaseId = null;
            await db.SaveChangesAsync(cancellationToken);
            db.Entry(message).State = EntityState.Detached;
        }
    }
}
