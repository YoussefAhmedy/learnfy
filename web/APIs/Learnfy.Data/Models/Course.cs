using System.ComponentModel.DataAnnotations;

namespace YourApp.Models;

public sealed class Course
{
    public int Id { get; set; }
    [Required, MaxLength(200)] public string CourseName { get; set; } = string.Empty;
    [Required, MaxLength(100)] public string Category { get; set; } = string.Empty;
    [MaxLength(500)] public string? ImageUrl { get; set; }
    [MaxLength(1000)] public string? Description { get; set; }
    [MaxLength(100)] public string? Instructor { get; set; }
    [MaxLength(50)] public string? Duration { get; set; }
    [Range(0, 5)] public decimal? Rating { get; set; }
    [Range(0, double.MaxValue)] public decimal? Price { get; set; }
    public bool IsRecommended { get; set; }
    public bool IsPublished { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public IBSRA.Models.Category CategoryInfo { get; set; } = null!;
    public ICollection<UserCourseRecommendation> UserRecommendations { get; set; } = new List<UserCourseRecommendation>();
}

public sealed class UserCourseRecommendation
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CourseId { get; set; }
    public decimal RecommendationScore { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
    public Course Course { get; set; } = null!;
}
