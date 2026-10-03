using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YourApp.Models.DTOs;
using YourApp.Services;

namespace YourApp.Controllers;

[ApiController]
[Route("api/courses")]
public sealed class CoursesController(ICourseService courseService) : ControllerBase
{
    [HttpGet, HttpGet("recommendations"), HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] CourseSearchRequest request, CancellationToken cancellationToken) =>
        Ok(await courseService.SearchCoursesAsync(request, cancellationToken));

    [Authorize, HttpGet("recommendations/personalized")]
    public async Task<IActionResult> Personalized([FromQuery, Range(1, 20)] int count = 5, CancellationToken cancellationToken = default)
    {
        // Subject comes ONLY from the verified token, not a caller-supplied user ID.
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!, System.Globalization.CultureInfo.InvariantCulture);
        return Ok(await courseService.GetPersonalizedRecommendationsAsync(userId, count, cancellationToken));
    }

    [HttpGet("trending")]
    public async Task<IActionResult> Trending([FromQuery, Range(1, 20)] int count = 10, CancellationToken cancellationToken = default) =>
        Ok(await courseService.GetTrendingCoursesAsync(count, cancellationToken));

    [HttpGet("{courseId:int:min(1)}")]
    public async Task<IActionResult> Details(int courseId, CancellationToken cancellationToken)
    {
        var result = await courseService.GetCourseByIdAsync(courseId, cancellationToken);
        return result.Success ? Ok(result) : NotFound(result);
    }
}
