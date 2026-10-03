using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Learnfy.ApiCommon;

public sealed class JwtSettings
{
    [Required] public string Key { get; set; } = string.Empty;
    [Required] public string Issuer { get; set; } = "learnfy";
    [Required] public string Audience { get; set; } = "learnfy-clients";
    [Range(5, 60)] public int ExpiryMinutes { get; set; } = 15;

    public bool HasSafeKey() => Encoding.UTF8.GetByteCount(Key) >= 32 &&
        !Key.Contains("your-super-secret", StringComparison.OrdinalIgnoreCase) &&
        !Key.Contains("change-me", StringComparison.OrdinalIgnoreCase);
}

public sealed class ConfigurationRequiredException(string message) : Exception(message);
