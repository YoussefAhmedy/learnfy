using YourApp.Models.DTOs;

namespace YourApp.Services;

public interface ICourseService
{
    Task<CourseRecommendationsResponse> GetCourseRecommendationsAsync(CourseSearchRequest request, CancellationToken cancellationToken = default);
    Task<CourseRecommendationsResponse> GetPersonalizedRecommendationsAsync(int userId, int count = 5, CancellationToken cancellationToken = default);
    Task<CourseRecommendationsResponse> GetTrendingCoursesAsync(int count = 10, CancellationToken cancellationToken = default);
    Task<ApiResponse<CourseDto>> GetCourseByIdAsync(int courseId, CancellationToken cancellationToken = default);
    Task<CourseRecommendationsResponse> SearchCoursesAsync(CourseSearchRequest request, CancellationToken cancellationToken = default);
}
