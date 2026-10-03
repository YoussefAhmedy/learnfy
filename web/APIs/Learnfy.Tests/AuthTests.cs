using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using YourApp.Models.DTOs;
using YourApp.Services;
using Xunit;

namespace Learnfy.Tests;

public sealed class AuthTests
{
    private const string Password = "a long unique test passphrase";
    private static RegisterRequest Registration(string email = "student@example.test", string username = "test_student") => new()
    {
        Name = "Test Student", Age = 25, Email = email, Username = username, Password = Password
    };

    [Fact]
    public async Task RegistrationIsPersistedHashedAndDoesNotLeakPrivateFields()
    {
        await using var database = new TestDatabase(); await database.InitializeAsync();
        await using var factory = new ApiFactory<YourApp.AuthApi.Program>(database);
        using var client = factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/register", Registration());
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(result); Assert.True(result.Success); Assert.NotNull(result.Token); Assert.Equal("Student", result.User?.Role);
        var json = await response.Content.ReadAsStringAsync();
        Assert.DoesNotContain("passwordHash", json); Assert.DoesNotContain("securityStamp", json);
        await using var db = database.CreateContext();
        var user = await db.Users.SingleAsync();
        Assert.NotEqual(Password, user.PasswordHash); Assert.True(BCrypt.Net.BCrypt.Verify(Password, user.PasswordHash));
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.Token);
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/api/auth/me")).StatusCode);
    }

    [Fact]
    public async Task CaseInsensitiveDuplicateIsConflictAndInvalidPasswordIsRejected()
    {
        await using var database = new TestDatabase(); await database.InitializeAsync();
        await using var factory = new ApiFactory<YourApp.AuthApi.Program>(database);
        using var client = factory.CreateClient();
        Assert.Equal(HttpStatusCode.Created, (await client.PostAsJsonAsync("/api/auth/register", Registration())).StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, (await client.PostAsJsonAsync("/api/auth/register", Registration("STUDENT@example.test", "different_name"))).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await client.PostAsJsonAsync("/api/auth/register", Registration("another@example.test", "another") with { Password = "short" })).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.PostAsJsonAsync("/api/auth/login", new LoginRequest { Email = "student@example.test", Password = "wrong password" })).StatusCode);
    }

    [Fact]
    public async Task RecoveryIsGenericEncryptedSingleUseAndRevokesExistingTokens()
    {
        await using var database = new TestDatabase(); await database.InitializeAsync();
        await using var factory = new ApiFactory<YourApp.AuthApi.Program>(database);
        using var client = factory.CreateClient();
        var registered = await (await client.PostAsJsonAsync("/api/auth/register", Registration())).Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(registered); Assert.NotNull(registered.Token);
        var known = await client.PostAsJsonAsync("/api/auth/forgot-password", new ForgotPasswordRequest { Email = "student@example.test" });
        var unknown = await client.PostAsJsonAsync("/api/auth/forgot-password", new ForgotPasswordRequest { Email = "unknown@example.test" });
        Assert.Equal(HttpStatusCode.Accepted, known.StatusCode);
        Assert.Equal(await known.Content.ReadAsStringAsync(), await unknown.Content.ReadAsStringAsync());
        await using var db = database.CreateContext();
        var mail = await db.EmailOutboxMessages.SingleAsync();
        Assert.DoesNotContain("#token=", mail.ProtectedBody);
        var body = factory.Services.GetRequiredService<IDataProtectionProvider>().CreateProtector(EmailQueue.ProtectionPurpose).Unprotect(mail.ProtectedBody);
        var token = Regex.Match(body, "token=([A-Za-z0-9_-]+)").Groups[1].Value;
        Assert.NotEmpty(token);
        Assert.DoesNotContain(token, await known.Content.ReadAsStringAsync());
        Assert.NotEqual(token, (await db.Users.SingleAsync()).ResetTokenHash);
        var reset = new ResetPasswordRequest { ResetToken = token, NewPassword = "a different secure passphrase" };
        Assert.Equal(HttpStatusCode.OK, (await client.PostAsJsonAsync("/api/auth/reset-password", reset)).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await client.PostAsJsonAsync("/api/auth/reset-password", reset)).StatusCode);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", registered.Token);
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/auth/me")).StatusCode);
        var login = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest { Email = "student@example.test", Password = reset.NewPassword });
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);
    }

    [Fact]
    public async Task LogoutAndAnonymousMeAreEnforced()
    {
        await using var database = new TestDatabase(); await database.InitializeAsync();
        await using var factory = new ApiFactory<YourApp.AuthApi.Program>(database);
        using var client = factory.CreateClient();
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/auth/me")).StatusCode);
        var registered = await (await client.PostAsJsonAsync("/api/auth/register", Registration())).Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(registered); Assert.NotNull(registered.Token);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", registered.Token);
        Assert.Equal(HttpStatusCode.NoContent, (await client.PostAsync("/api/auth/logout", null)).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/auth/me")).StatusCode);
    }

    [Fact]
    public async Task RegistrationCannotSetAdminRoleAndUnicodeTruncationIsRejected()
    {
        await using var database = new TestDatabase(); await database.InitializeAsync();
        await using var factory = new ApiFactory<YourApp.AuthApi.Program>(database);
        using var client = factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/register", new
        {
            name = "Test Learner", age = 20, email = "learner@example.test", username = "learner",
            password = Password, role = "Admin"
        });
        Assert.Equal("Student", (await response.Content.ReadFromJsonAsync<AuthResponse>())?.User?.Role);
        var tooManyBytes = string.Concat(Enumerable.Repeat("🔒", 20));
        var rejected = await client.PostAsJsonAsync("/api/auth/register", Registration("utf8@example.test", "utf8_user") with { Password = tooManyBytes });
        Assert.Equal(HttpStatusCode.BadRequest, rejected.StatusCode);
    }
}
