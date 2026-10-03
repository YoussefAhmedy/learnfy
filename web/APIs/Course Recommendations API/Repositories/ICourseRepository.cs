using YourApp.Models;
using YourApp.Models.DTOs;

namespace YourApp.Repositories;

public interface ICourseRepository
{
    Task<Course?> GetByIdAsync(int courseId, CancellationToken cancellationToken = default);
    Task<List<Course>> SearchCoursesAsync(CourseSearchRequest request, CancellationToken cancellationToken = default);
    Task<int> GetSearchCountAsync(CourseSearchRequest request, CancellationToken cancellationToken = default);
    Task<List<Course>> GetExcludingCourseIdsAsync(List<int> excludedCourseIds, int count, CancellationToken cancellationToken = default);
    Task<List<Course>> GetTopRatedAsync(int count, CancellationToken cancellationToken = default);
    Task<List<int>> GetUserRecommendedCourseIdsAsync(int userId, CancellationToken cancellationToken = default);
}
