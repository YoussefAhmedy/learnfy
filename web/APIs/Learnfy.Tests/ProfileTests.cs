using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using YourApp.Models.DTOs;
using Xunit;

namespace Learnfy.Tests;

public sealed class ProfileTests
{
    [Fact]
    public async Task ProfileUpdatesOnlyAuthenticatedSubjectAndNeverRoleOrCredentials()
    {
        await using var database = new TestDatabase(); await database.InitializeAsync();
        await using var factory = new ApiFactory<YourApp.AuthApi.Program>(database);
        using var client = factory.CreateClient();
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.PatchAsJsonAsync("/api/auth/profile", new UpdateProfileRequest { Name = "Anonymous" })).StatusCode);
        async Task<AuthResponse> Register(string email, string username) =>
            (await (await client.PostAsJsonAsync("/api/auth/register", new RegisterRequest
            {
                Name = "Original Name", Email = email, Username = username, Password = "profile-test-passphrase"
            })).Content.ReadFromJsonAsync<AuthResponse>())!;
        var first = await Register("first@example.test", "first_user");
        var second = await Register("second@example.test", "second_user");
        Assert.NotNull(first.Token); Assert.NotNull(first.User); Assert.NotNull(second.User);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", first.Token);
        var response = await client.PatchAsJsonAsync("/api/auth/profile", new
        {
            name = "Updated Learner", age = 28, phoneNumber = "+201234567890",
            userId = second.User.Id, email = "hijacked@example.test", role = "Admin", passwordHash = "injected"
        });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<UserDto>();
        Assert.NotNull(result); Assert.Equal(first.User.Id, result.Id); Assert.Equal("Student", result.Role);
        Assert.Equal("Updated Learner", result.Name); Assert.Equal(28, result.Age); Assert.Equal("first@example.test", result.Email);
        await using var db = database.CreateContext();
        Assert.Equal("Original Name", (await db.Users.SingleAsync(user => user.Id == second.User.Id)).Name);
        Assert.NotEqual("injected", (await db.Users.SingleAsync(user => user.Id == first.User.Id)).PasswordHash);
        Assert.Equal(HttpStatusCode.BadRequest, (await client.PatchAsJsonAsync("/api/auth/profile", new UpdateProfileRequest { Name = "A", Age = 999 })).StatusCode);
    }
}
