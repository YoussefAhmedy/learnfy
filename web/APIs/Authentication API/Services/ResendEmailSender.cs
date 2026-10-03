using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.Extensions.Options;

namespace YourApp.Services;

public sealed class ResendEmailSender(HttpClient client, IOptions<EmailSettings> settings)
{
    public async Task SendAsync(Guid id, string recipient, string subject, string body, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "emails");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", settings.Value.ApiKey);
        request.Headers.Add("Idempotency-Key", $"learnfy-email-{id:N}");
        request.Content = JsonContent.Create(new { from = settings.Value.From, to = new[] { recipient }, subject, text = body });
        using var response = await client.SendAsync(request, cancellationToken);
        // Do not log provider response bodies: they may contain a reset URL or recipient.
        if (!response.IsSuccessStatusCode)
            throw new HttpRequestException("Email provider rejected the request.", null, response.StatusCode);
    }
}
