using System.Net.Mail;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Options;

namespace YourApp.Services;

public static class EmailBootstrap
{
    public static IServiceCollection AddLearnfyEmail(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        services.AddOptions<EmailSettings>().Bind(configuration.GetSection("Email"))
            .Validate(settings => !settings.IsConfigured || MailAddress.TryCreate(settings.From, out _), "Email:From must be a valid sender address.")
            .Validate(settings => !settings.IsConfigured || !environment.IsProduction() ||
                (Uri.TryCreate(settings.PublicWebUrl, UriKind.Absolute, out var uri) && uri.Scheme == "https"),
                "Email:PublicWebUrl must use HTTPS in production.")
            .Validate(settings => !settings.IsConfigured || !environment.IsProduction() ||
                !string.IsNullOrWhiteSpace(configuration["DataProtection:KeyDirectory"]),
                "Persist DataProtection:KeyDirectory when email delivery is enabled in production.")
            .ValidateOnStart();
        var protection = services.AddDataProtection().SetApplicationName("Learnfy.Email");
        var keyDirectory = configuration["DataProtection:KeyDirectory"];
        if (!string.IsNullOrWhiteSpace(keyDirectory)) protection.PersistKeysToFileSystem(new DirectoryInfo(keyDirectory));
        services.AddScoped<IEmailQueue, EmailQueue>();
        services.AddHttpClient<ResendEmailSender>(client =>
        {
            client.BaseAddress = new Uri("https://api.resend.com/");
            client.Timeout = TimeSpan.FromSeconds(15);
        }).RemoveAllLoggers();
        services.AddHostedService<EmailDispatcher>();
        return services;
    }
}
