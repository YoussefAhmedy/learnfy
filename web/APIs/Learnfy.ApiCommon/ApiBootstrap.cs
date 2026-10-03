using System.Security.Claims;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using YourApp.Data;

namespace Learnfy.ApiCommon;

public static class ApiBootstrap
{
    public static IServiceCollection AddLearnfyApi(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddControllers();
        services.AddOpenApi();
        services.AddProblemDetails(options => options.CustomizeProblemDetails = context =>
            context.ProblemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier);
        services.AddExceptionHandler<ApiExceptionHandler>();
        services.AddSingleton(TimeProvider.System);
        services.AddOptions<JwtSettings>().Bind(configuration.GetSection("Jwt"))
            .ValidateDataAnnotations().Validate(settings => settings.HasSafeKey(),
                "Jwt:Key must be a non-placeholder secret of at least 32 UTF-8 bytes.").ValidateOnStart();

        services.AddDbContext<AppDbContext>(options =>
        {
            DatabaseSetup.Configure(options, configuration["Database:Provider"] ?? "SqlServer",
                configuration.GetConnectionString("DefaultConnection") ?? string.Empty);
        });

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();
        services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
            .Configure<IOptions<JwtSettings>>((options, settings) =>
            {
                var jwt = settings.Value;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
                    ValidateIssuer = true, ValidIssuer = jwt.Issuer,
                    ValidateAudience = true, ValidAudience = jwt.Audience,
                    ValidateLifetime = true, ClockSkew = TimeSpan.FromSeconds(15),
                    ValidAlgorithms = [SecurityAlgorithms.HmacSha256]
                };
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var subject = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
                        var stamp = context.Principal?.FindFirstValue("security_stamp");
                        if (!int.TryParse(subject, out var id) || string.IsNullOrEmpty(stamp))
                        {
                            context.Fail("Invalid token subject.");
                            return;
                        }
                        var db = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                        var valid = await db.Users.AsNoTracking().AnyAsync(
                            user => user.Id == id && user.SecurityStamp == stamp && user.IsActive,
                            context.HttpContext.RequestAborted);
                        if (!valid) context.Fail("This session is no longer valid.");
                    }
                };
            });
        services.AddAuthorization(options => options.AddPolicy("Admin", policy => policy.RequireRole("Admin")));

        var origins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
        if (origins.Any(origin => origin.Contains('*') || !Uri.TryCreate(origin, UriKind.Absolute, out var uri) ||
            uri.Scheme is not ("https" or "http") || uri.AbsolutePath != "/" || !string.IsNullOrEmpty(uri.Query)))
            throw new InvalidOperationException("Cors:AllowedOrigins must contain exact HTTP(S) origins, not wildcards or paths.");
        services.AddCors(options => options.AddDefaultPolicy(policy =>
        {
            if (origins.Length > 0) policy.WithOrigins(origins).WithMethods("GET", "POST", "PUT", "PATCH", "DELETE")
                .WithHeaders("Authorization", "Content-Type");
        }));

        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                RateLimitPartition.GetFixedWindowLimiter(context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions { PermitLimit = 120, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
            options.AddPolicy("auth", context => RateLimitPartition.GetFixedWindowLimiter(
                context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions { PermitLimit = 10, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
            options.OnRejected = async (context, cancellationToken) =>
            {
                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retry))
                    context.HttpContext.Response.Headers.RetryAfter = Math.Ceiling(retry.TotalSeconds).ToString(System.Globalization.CultureInfo.InvariantCulture);
                await Results.Problem(statusCode: 429, title: "Too many requests", detail: "Please wait before trying again.")
                    .ExecuteAsync(context.HttpContext);
            };
        });
        services.AddHealthChecks().AddCheck<DatabaseHealthCheck>("database");
        return services;
    }

    public static WebApplication UseLearnfyApi(this WebApplication app)
    {
        app.UseExceptionHandler();
        app.Use(async (context, next) =>
        {
            context.Response.Headers.XContentTypeOptions = "nosniff";
            context.Response.Headers["Referrer-Policy"] = "no-referrer";
            context.Response.Headers["X-Request-ID"] = context.TraceIdentifier;
            context.Response.Headers.CacheControl = "no-store";
            await next();
        });
        if (!app.Environment.IsDevelopment() && !app.Environment.IsEnvironment("Testing")) app.UseHsts();
        app.UseRouting();
        app.UseCors();
        app.UseAuthentication();
        app.UseRateLimiter();
        app.UseAuthorization();
        if (app.Environment.IsDevelopment()) app.MapOpenApi();
        app.MapControllers();
        app.MapGet("/health/live", () => Results.Ok(new { status = "ok" }));
        app.MapHealthChecks("/health/ready");
        return app;
    }
}
