using YourApp.Mapping;
using YourApp.Models.DTOs;
using YourApp.Repositories;

namespace YourApp.Services;

public sealed class CourseService(ICourseRepository courses) : ICourseService
{
    public Task<CourseRecommendationsResponse> GetCourseRecommendationsAsync(CourseSearchRequest request, CancellationToken cancellationToken = default) =>
        SearchCoursesAsync(request, cancellationToken);

    public async Task<CourseRecommendationsResponse> SearchCoursesAsync(CourseSearchRequest request, CancellationToken cancellationToken = default)
    {
        var totalCount = await courses.GetSearchCountAsync(request, cancellationToken);
        var results = await courses.SearchCoursesAsync(request, cancellationToken);
        return new(true, "Courses retrieved successfully", results.Select(course => CourseMapping.ToRecommendation(course)).ToList(),
            totalCount, request.Page, (int)Math.Ceiling(totalCount / (double)request.PageSize));
    }

    public async Task<CourseRecommendationsResponse> GetPersonalizedRecommendationsAsync(int userId, int count = 5, CancellationToken cancellationToken = default)
    {
        var excluded = await courses.GetUserRecommendedCourseIdsAsync(userId, cancellationToken);
        var results = await courses.GetExcludingCourseIdsAsync(excluded, Math.Clamp(count, 1, 20), cancellationToken);
        var recommendations = results.Select(course => CourseMapping.ToRecommendation(course, personalized: true)).ToList();
        return new(true, "Recommendations ranked by rating and editorial selection, excluding your stored recommendations.",
            recommendations, recommendations.Count, 1, recommendations.Count > 0 ? 1 : 0);
    }

    public async Task<CourseRecommendationsResponse> GetTrendingCoursesAsync(int count = 10, CancellationToken cancellationToken = default)
    {
        var results = await courses.GetTopRatedAsync(Math.Clamp(count, 1, 20), cancellationToken);
        var recommendations = results.Select(course => CourseMapping.ToRecommendation(course)).ToList();
        return new(true, "Top-rated courses retrieved successfully", recommendations, recommendations.Count, 1, recommendations.Count > 0 ? 1 : 0);
    }

    public async Task<ApiResponse<CourseDto>> GetCourseByIdAsync(int courseId, CancellationToken cancellationToken = default)
    {
        var course = await courses.GetByIdAsync(courseId, cancellationToken);
        return course is null ? new(false, "Course not found") : new(true, "Course details retrieved successfully", CourseMapping.ToDto(course));
    }
}
