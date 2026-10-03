using System.ComponentModel.DataAnnotations;

namespace YourApp.Models.DTOs;

public sealed record CourseDto(int Id, string CourseName, string Category, string? ImageUrl, string? Description,
    string? Instructor, string? Duration, decimal? Rating, decimal? Price, bool IsRecommended);
public sealed record CourseRecommendationDto(int Id, string CourseName, string Category, string? ImageUrl, string? Description,
    string? Instructor, string? Duration, decimal? Rating, decimal? Price, decimal RecommendationScore);

public sealed record CourseSearchRequest : IValidatableObject
{
    [StringLength(200)] public string? SearchTerm { get; init; }
    [StringLength(100)] public string? Category { get; init; }
    [Range(typeof(decimal), "0", "1000000")] public decimal? MinPrice { get; init; }
    [Range(typeof(decimal), "0", "1000000")] public decimal? MaxPrice { get; init; }
    [Range(typeof(decimal), "0", "5")] public decimal? MinRating { get; init; }
    [StringLength(100)] public string? Instructor { get; init; }
    [Range(1, 100000)] public int Page { get; init; } = 1;
    [Range(1, 100)] public int PageSize { get; init; } = 12;
    [RegularExpression("^(rating|price|name|newest|recommended)$")] public string SortBy { get; init; } = "rating";
    [RegularExpression("^(asc|desc)$")] public string SortOrder { get; init; } = "desc";
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (MinPrice.HasValue && decimal.Round(MinPrice.Value, 2) != MinPrice.Value)
            yield return new ValidationResult("MinPrice supports at most two decimal places.", [nameof(MinPrice)]);
        if (MaxPrice.HasValue && decimal.Round(MaxPrice.Value, 2) != MaxPrice.Value)
            yield return new ValidationResult("MaxPrice supports at most two decimal places.", [nameof(MaxPrice)]);
        if (MinPrice > MaxPrice) yield return new ValidationResult("MinPrice cannot exceed MaxPrice.", [nameof(MinPrice), nameof(MaxPrice)]);
    }
}

public sealed record CourseRecommendationsResponse(bool Success, string Message, List<CourseRecommendationDto> Recommendations,
    int TotalCount, int CurrentPage, int TotalPages);
public sealed record ApiResponse<T>(bool Success, string Message, T? Data = default);
