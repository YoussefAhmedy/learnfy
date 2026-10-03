using System.ComponentModel.DataAnnotations;

namespace YourApp.Models;

public sealed class User
{
    public int Id { get; set; }
    [Required, MaxLength(100)] public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    [MaxLength(20)] public string? PhoneNumber { get; set; }
    [Required, EmailAddress, MaxLength(255)] public string Email { get; set; } = string.Empty;
    [Required, MaxLength(255)] public string NormalizedEmail { get; set; } = string.Empty;
    [Required, MaxLength(100)] public string Username { get; set; } = string.Empty;
    [Required, MaxLength(100)] public string NormalizedUsername { get; set; } = string.Empty;
    [Required, MaxLength(100)] public string PasswordHash { get; set; } = string.Empty;
    [MaxLength(64)] public string? ResetTokenHash { get; set; }
    public DateTime? ResetTokenExpiry { get; set; }
    [Required, MaxLength(64)] public string SecurityStamp { get; set; } = Guid.NewGuid().ToString("N");
    [Required, MaxLength(20)] public string Role { get; set; } = "Student";
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
