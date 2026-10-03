using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Options;
using YourApp.Data;
using YourApp.Models;

namespace YourApp.Services;

public interface IEmailQueue
{
    bool IsConfigured { get; }
    void EnqueuePasswordReset(string recipient, string token, DateTime expiresAt);
}

public sealed class EmailSettings
{
    public string ApiKey { get; set; } = string.Empty;
    public string From { get; set; } = string.Empty;
    public string PublicWebUrl { get; set; } = string.Empty;
    public bool IsConfigured => !string.IsNullOrWhiteSpace(ApiKey) && !string.IsNullOrWhiteSpace(From) &&
        Uri.TryCreate(PublicWebUrl, UriKind.Absolute, out var uri) && uri.Scheme is "http" or "https";
}

public sealed class EmailQueue(AppDbContext db, IDataProtectionProvider protection, IOptions<EmailSettings> settings, TimeProvider clock) : IEmailQueue
{
    public const string ProtectionPurpose = "Learnfy.EmailOutbox.v1";
    public bool IsConfigured => settings.Value.IsConfigured;

    public void EnqueuePasswordReset(string recipient, string token, DateTime expiresAt)
    {
        if (!IsConfigured) throw new Learnfy.ApiCommon.ConfigurationRequiredException("Email delivery is not configured.");
        // Fragment avoids placing a reset credential into access logs or the Referer header.
        var link = $"{settings.Value.PublicWebUrl.TrimEnd('/')}/reset-password#token={Uri.EscapeDataString(token)}";
        var body = $"A password reset was requested for your Learnfy account.\n\n{link}\n\nThis link expires in one hour and can be used once. If you did not request it, ignore this email.";
        var now = clock.GetUtcNow().UtcDateTime;
        db.EmailOutboxMessages.Add(new EmailOutboxMessage
        {
            Recipient = recipient, Subject = "Reset your Learnfy password",
            ProtectedBody = protection.CreateProtector(ProtectionPurpose).Protect(body),
            CreatedAt = now, NextAttemptAt = now, ExpiresAt = expiresAt
        });
    }
}
