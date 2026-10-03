namespace IBSRA.DTOs;

public record CategorySummaryDto
{
    public int ID { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? IconUrl { get; init; }
    public string Color { get; init; } = string.Empty;
    public int CourseCount { get; init; }
}
public sealed record CategoryDetailsDto : CategorySummaryDto
{
    public bool IsActive { get; init; }
    public int DisplayOrder { get; init; }
    public List<CourseDto> PopularCourses { get; init; } = [];
}
public sealed record CourseDto(int ID, string CourseName, string? Description, string? ImageUrl,
    string? Instructor, string? Duration, decimal? Rating, decimal? Price);
public sealed record ApiResponse<T>
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
    public T? Data { get; init; }
    public int? TotalCount { get; init; }
}
