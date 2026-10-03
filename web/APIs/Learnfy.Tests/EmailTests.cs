using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using YourApp.Data;
using YourApp.Services;
using Xunit;

namespace Learnfy.Tests;

public sealed class EmailTests
{
    private sealed class ProviderHandler(HttpStatusCode status, object acknowledgement) : HttpMessageHandler
    {
        public int Requests { get; private set; }
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Requests++;
            Assert.Contains("learnfy-email-", request.Headers.GetValues("Idempotency-Key").Single());
            return Task.FromResult(new HttpResponseMessage(status) { Content = JsonContent.Create(acknowledgement) });
        }
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task WorkerOnlyMarksAcknowledgedMailAndSchedulesRealFailures(bool accepted)
    {
        await using var database = new TestDatabase(); await database.InitializeAsync();
        var settings = Options.Create(new EmailSettings
        {
            ApiKey = "test-only-provider-key", From = "no-reply@example.test", PublicWebUrl = "https://learnfy.example.test"
        });
        var protection = new EphemeralDataProtectionProvider();
        var handler = new ProviderHandler(accepted ? HttpStatusCode.OK : HttpStatusCode.ServiceUnavailable, new { id = "test-provider-ack" });
        using var client = new HttpClient(handler) { BaseAddress = new Uri("https://provider.example.test/") };
        var services = new ServiceCollection();
        services.AddDbContext<AppDbContext>(options => options.UseSqlite(database.Connection));
        services.AddSingleton<IDataProtectionProvider>(protection);
        services.AddSingleton(new ResendEmailSender(client, settings));
        await using var provider = services.BuildServiceProvider();
        await using (var db = database.CreateContext())
        {
            new EmailQueue(db, protection, settings, TimeProvider.System).EnqueuePasswordReset("learner@example.test", "test-only-reset-token", DateTime.UtcNow.AddHours(1));
            await db.SaveChangesAsync();
        }
        var dispatcher = new EmailDispatcher(provider.GetRequiredService<IServiceScopeFactory>(), settings, TimeProvider.System, NullLogger<EmailDispatcher>.Instance);
        await dispatcher.DispatchBatchAsync(CancellationToken.None);
        await using var check = database.CreateContext();
        var mail = await check.EmailOutboxMessages.SingleAsync();
        Assert.Equal(1, mail.Attempts);
        if (accepted)
        {
            Assert.NotNull(mail.SentAt); Assert.Empty(mail.ProtectedBody); Assert.Null(mail.LastErrorCode);
        }
        else
        {
            Assert.Null(mail.SentAt); Assert.NotEmpty(mail.ProtectedBody); Assert.Equal("provider_unavailable", mail.LastErrorCode);
            Assert.True(mail.NextAttemptAt > DateTime.UtcNow);
        }
        await dispatcher.DispatchBatchAsync(CancellationToken.None);
        Assert.Equal(1, handler.Requests); // Sent messages / deferred retries cannot be immediately redelivered.
    }

    [Fact]
    public async Task HttpSuccessWithoutProviderAcknowledgementIsNotFakeDelivery()
    {
        var settings = Options.Create(new EmailSettings { ApiKey = "test-only", From = "test@example.test", PublicWebUrl = "https://example.test" });
        using var handler = new ProviderHandler(HttpStatusCode.OK, new { unexpected = true });
        using var client = new HttpClient(handler) { BaseAddress = new Uri("https://provider.example.test/") };
        var sender = new ResendEmailSender(client, settings);
        await Assert.ThrowsAsync<HttpRequestException>(() => sender.SendAsync(Guid.NewGuid(), "learner@example.test", "Subject", "Body", CancellationToken.None));
    }
}
