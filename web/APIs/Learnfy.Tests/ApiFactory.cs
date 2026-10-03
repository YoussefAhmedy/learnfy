using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using YourApp.Data;
using YourApp.Services;

namespace Learnfy.Tests;

public sealed class ApiFactory<TProgram>(TestDatabase database) : WebApplicationFactory<TProgram> where TProgram : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration((_, config) => config.AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["Database:Provider"] = "Sqlite", ["ConnectionStrings:DefaultConnection"] = "Data Source=:memory:",
            ["Jwt:Key"] = "test-only-signing-key-not-for-production-0000000000000000",
            ["Jwt:Issuer"] = "learnfy-test", ["Jwt:Audience"] = "learnfy-test-clients", ["Jwt:ExpiryMinutes"] = "15",
            ["Email:ApiKey"] = "test-only-provider-key", ["Email:From"] = "Learnfy Tests <no-reply@example.test>",
            ["Email:PublicWebUrl"] = "https://learnfy.example.test"
        }));
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<AppDbContext>>();
            services.RemoveAll<IDbContextOptionsConfiguration<AppDbContext>>();
            services.AddDbContext<AppDbContext>(options => options.UseSqlite(database.Connection));
            services.AddSingleton<IDataProtectionProvider>(new EphemeralDataProtectionProvider());
            // Disable external DELIVERY in tests only; retain real outbox/database behavior.
            foreach (var descriptor in services.Where(service => service.ServiceType == typeof(IHostedService) && service.ImplementationType == typeof(EmailDispatcher)).ToList())
                services.Remove(descriptor);
        });
    }
}
