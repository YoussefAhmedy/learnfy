using Microsoft.EntityFrameworkCore;
using YourApp.Data;
using YourApp.Models;
using YourApp.Models.DTOs;

namespace YourApp.Repositories;

public sealed class CourseRepository(AppDbContext context) : ICourseRepository
{
    private IQueryable<Course> Published => context.Courses.AsNoTracking().Where(course => course.IsPublished && course.CategoryInfo.IsActive);

    public Task<Course?> GetByIdAsync(int courseId, CancellationToken cancellationToken = default) =>
        Published.FirstOrDefaultAsync(course => course.Id == courseId, cancellationToken);

    public Task<List<Course>> GetExcludingCourseIdsAsync(List<int> excludedCourseIds, int count, CancellationToken cancellationToken = default) =>
        Published.Where(course => !excludedCourseIds.Contains(course.Id))
            .OrderByDescending(course => (double)(course.Rating ?? 0) * 1.5d + (course.IsRecommended ? 2d : 0d))
            .ThenBy(course => course.Id).Take(count).ToListAsync(cancellationToken);

    public Task<List<Course>> GetTopRatedAsync(int count, CancellationToken cancellationToken = default) =>
        Published.OrderByDescending(course => course.Rating).ThenBy(course => course.Id).Take(count).ToListAsync(cancellationToken);

    public Task<List<Course>> SearchCoursesAsync(CourseSearchRequest request, CancellationToken cancellationToken = default)
    {
        var query = BuildSearch(request);
        var descending = request.SortOrder == "desc";
        var sorted = request.SortBy switch
        {
            "price" => descending ? query.OrderByDescending(course => course.Price) : query.OrderBy(course => course.Price),
            "name" => descending ? query.OrderByDescending(course => course.CourseName) : query.OrderBy(course => course.CourseName),
            "newest" => descending ? query.OrderByDescending(course => course.CreatedAt) : query.OrderBy(course => course.CreatedAt),
            "recommended" => descending
                ? query.OrderByDescending(course => (double)(course.Rating ?? 0) * (course.IsRecommended ? 1.2d : 1d))
                : query.OrderBy(course => (double)(course.Rating ?? 0) * (course.IsRecommended ? 1.2d : 1d)),
            _ => descending ? query.OrderByDescending(course => course.Rating) : query.OrderBy(course => course.Rating)
        };
        // Global, deterministic ordering MUST precede pagination.
        return sorted.ThenBy(course => course.Id).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);
    }

    public Task<int> GetSearchCountAsync(CourseSearchRequest request, CancellationToken cancellationToken = default) =>
        BuildSearch(request).CountAsync(cancellationToken);

    public Task<List<int>> GetUserRecommendedCourseIdsAsync(int userId, CancellationToken cancellationToken = default) =>
        context.UserCourseRecommendations.AsNoTracking().Where(item => item.UserId == userId)
            .Select(item => item.CourseId).ToListAsync(cancellationToken);

    private IQueryable<Course> BuildSearch(CourseSearchRequest request)
    {
        var query = Published;
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.Trim().ToLowerInvariant();
            query = query.Where(course => course.CourseName.ToLower().Contains(term) ||
                (course.Description != null && course.Description.ToLower().Contains(term)) ||
                (course.Instructor != null && course.Instructor.ToLower().Contains(term)));
        }
        if (!string.IsNullOrWhiteSpace(request.Category)) query = query.Where(course => course.Category == request.Category.Trim());
        if (!string.IsNullOrWhiteSpace(request.Instructor)) query = query.Where(course => course.Instructor == request.Instructor.Trim());
        if (request.MinPrice.HasValue) query = query.Where(course => course.Price >= request.MinPrice.Value);
        if (request.MaxPrice.HasValue) query = query.Where(course => course.Price <= request.MaxPrice.Value);
        if (request.MinRating.HasValue) query = query.Where(course => course.Rating >= request.MinRating.Value);
        return query;
    }
}
