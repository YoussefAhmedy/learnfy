using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using YourApp.Models;

namespace IBSRA.Models;

public sealed class Category
{
    public int ID { get; set; }
    [Required, MaxLength(100)] public string Name { get; set; } = string.Empty;
    [MaxLength(500)] public string? Description { get; set; }
    [MaxLength(300)] public string? IconUrl { get; set; }
    [MaxLength(20)] public string Color { get; set; } = "#A3319E";
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Course> Courses { get; set; } = new List<Course>();
    // Populated by repository SQL projection, not a stale counter or capped navigation count.
    [NotMapped] public int CourseCount { get; set; }
}
