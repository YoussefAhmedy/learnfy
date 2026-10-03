using System.ComponentModel.DataAnnotations;
using System.Text;

namespace YourApp.Models.DTOs;

public sealed record LoginRequest
{
    [Required, EmailAddress, StringLength(255)] public string Email { get; init; } = string.Empty;
    [Required, StringLength(72)] public string Password { get; init; } = string.Empty;
}

public sealed record RegisterRequest : IValidatableObject
{
    [Required, StringLength(100, MinimumLength = 2)] public string Name { get; init; } = string.Empty;
    [Range(0, 120)] public int Age { get; init; }
    [Phone, StringLength(20)] public string? PhoneNumber { get; init; }
    [Required, EmailAddress, StringLength(255)] public string Email { get; init; } = string.Empty;
    [Required, RegularExpression("^[a-zA-Z0-9_]{3,30}$")] public string Username { get; init; } = string.Empty;
    [Required, StringLength(72, MinimumLength = 12)] public string Password { get; init; } = string.Empty;
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) => PasswordPolicy.Validate(Password);
}

public sealed record ForgotPasswordRequest
{
    [Required, EmailAddress, StringLength(255)] public string Email { get; init; } = string.Empty;
}

public sealed record ResetPasswordRequest : IValidatableObject
{
    [Required, StringLength(100, MinimumLength = 32)] public string ResetToken { get; init; } = string.Empty;
    [Required, StringLength(72, MinimumLength = 12)] public string NewPassword { get; init; } = string.Empty;
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext) => PasswordPolicy.Validate(NewPassword, nameof(NewPassword));
}

public static class PasswordPolicy
{
    public static IEnumerable<ValidationResult> Validate(string password, string field = "Password")
    {
        if (string.IsNullOrEmpty(password) || password.Length < 12 || Encoding.UTF8.GetByteCount(password) > 72)
            yield return new ValidationResult("Use at least 12 characters and no more than 72 UTF-8 bytes.", [field]);
    }
}

public sealed record AuthResponse(bool Success, string Message, string? Token = null, UserDto? User = null, DateTime? ExpiresAt = null);
public sealed record UserDto(int Id, string Name, string Username, string Email, string Role, int Age = 0, string? PhoneNumber = null);

public sealed record UpdateProfileRequest
{
    [Required, StringLength(100, MinimumLength = 2)] public string Name { get; init; } = string.Empty;
    [Range(0, 120)] public int Age { get; init; }
    [Phone, StringLength(20)] public string? PhoneNumber { get; init; }
}
