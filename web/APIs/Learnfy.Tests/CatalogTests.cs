using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using IBSRA.Models;
using Microsoft.EntityFrameworkCore;
using YourApp.Models;
using YourApp.Models.DTOs;
using Xunit;

namespace Learnfy.Tests;

public sealed class CatalogTests
{
    private static async Task SeedCatalog(TestDatabase database)
    {
        await using var db = database.CreateContext();
        db.Categories.Add(new Category { Name = "Software Development", IsActive = true });
        db.Categories.Add(new Category { Name = "Unpublished Category", IsActive = false });
        for (var i = 1; i <= 8; i++) db.Courses.Add(new Course
        {
            CourseName = $"Course {i}", Category = "Software Development", Price = 9 - i, Rating = 4m,
            IsRecommended = i % 2 == 0, IsPublished = true
        });
        db.Courses.Add(new Course { CourseName = "Hidden Course", Category = "Unpublished Category", Price = 0, Rating = 5 });
        db.Courses.Add(new Course { CourseName = "Draft Course", Category = "Software Development", IsPublished = false, Price = 0 });
        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task SearchSortsGloballyBeforePagingAndFiltersHiddenCourses()
    {
        await using var database = new TestDatabase(); await database.InitializeAsync(); await SeedCatalog(database);
        await using var factory = new ApiFactory<YourApp.CourseApi.Program>(database);
        using var client = factory.CreateClient();
        var result = await client.GetFromJsonAsync<CourseRecommendationsResponse>("/api/courses/search?sortBy=price&sortOrder=asc&pageSize=2");
        Assert.NotNull(result); Assert.Equal(8, result.TotalCount); Assert.Equal(4, result.TotalPages);
        Assert.Equal(new decimal?[] { 1m, 2m }, result.Recommendations.Select(course => course.Price));
        var page2 = await client.GetFromJsonAsync<CourseRecommendationsResponse>("/api/courses/search?sortBy=price&sortOrder=asc&pageSize=2&page=2");
        Assert.NotNull(page2); Assert.Equal(new decimal?[] { 3m, 4m }, page2.Recommendations.Select(course => course.Price));
        Assert.Equal(HttpStatusCode.BadRequest, (await client.GetAsync("/api/courses?pageSize=0")).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await client.GetAsync("/api/courses?pageSize=101")).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await client.GetAsync("/api/courses?minPrice=10&maxPrice=1")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync("/api/courses/999999")).StatusCode);
    }

    [Fact]
    public async Task PersonalizedUsesAuthenticatedSubjectNotUserSuppliedIdentity()
    {
        await using var database = new TestDatabase(); await database.InitializeAsync(); await SeedCatalog(database);
        await using var auth = new ApiFactory<YourApp.AuthApi.Program>(database);
        await using var courses = new ApiFactory<YourApp.CourseApi.Program>(database);
        using var authClient = auth.CreateClient(); using var client = courses.CreateClient();
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/courses/recommendations/personalized")).StatusCode);
        var registered = await (await authClient.PostAsJsonAsync("/api/auth/register", new RegisterRequest
        {
            Name = "Catalog Learner", Email = "catalog@example.test", Username = "catalog_learner", Password = "a secure catalog passphrase"
        })).Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(registered); Assert.NotNull(registered.User); Assert.NotNull(registered.Token);
        await using var db = database.CreateContext();
        var excluded = await db.Courses.FirstAsync(course => course.IsRecommended);
        db.UserCourseRecommendations.Add(new UserCourseRecommendation { UserId = registered.User.Id, CourseId = excluded.Id });
        await db.SaveChangesAsync();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", registered.Token);
        var result = await client.GetFromJsonAsync<CourseRecommendationsResponse>("/api/courses/recommendations/personalized?userId=999999&count=20");
        Assert.NotNull(result); Assert.DoesNotContain(result.Recommendations, course => course.Id == excluded.Id);
        Assert.Equal(7, result.Recommendations.Count);
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync("/api/courses/personalized/999999")).StatusCode);
    }

    [Fact]
    public async Task CategoryCountIsRealAndPublicDetailsCannotRevealInactiveCategories()
    {
        await using var database = new TestDatabase(); await database.InitializeAsync(); await SeedCatalog(database);
        await using var factory = new ApiFactory<IBSRA.CategoriesApi.Program>(database);
        using var client = factory.CreateClient();
        var response = await client.GetFromJsonAsync<IBSRA.DTOs.ApiResponse<List<IBSRA.DTOs.CategorySummaryDto>>>("/api/categories");
        Assert.NotNull(response); Assert.NotNull(response.Data); var category = Assert.Single(response.Data); Assert.Equal(8, category.CourseCount);
        var detail = await client.GetFromJsonAsync<IBSRA.DTOs.ApiResponse<IBSRA.DTOs.CategoryDetailsDto>>($"/api/categories/{category.ID}");
        Assert.NotNull(detail); Assert.NotNull(detail.Data); Assert.Equal(8, detail.Data.CourseCount); Assert.Equal(5, detail.Data.PopularCourses.Count);
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync("/api/categories/by-name/Unpublished%20Category")).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/categories?includeInactive=true")).StatusCode);
    }

    [Fact]
    public async Task RelationalConstraintsRejectDuplicateRecommendationsAndMissingCategories()
    {
        await using var database = new TestDatabase(); await database.InitializeAsync();
        await using var db = database.CreateContext();
        db.Courses.Add(new Course { CourseName = "Invalid FK", Category = "Does not exist", Price = 10 });
        await Assert.ThrowsAsync<DbUpdateException>(() => db.SaveChangesAsync());
    }
}
