using System.ComponentModel.DataAnnotations;

namespace YourApp.Models;

public sealed class EmailOutboxMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required, MaxLength(255)] public string Recipient { get; set; } = string.Empty;
    [Required, MaxLength(200)] public string Subject { get; set; } = string.Empty;
    [Required] public string ProtectedBody { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime NextAttemptAt { get; set; } = DateTime.UtcNow;
    public int Attempts { get; set; }
    public DateTime? SentAt { get; set; }
    public DateTime? LeaseUntil { get; set; }
    public Guid? LeaseId { get; set; }
    [MaxLength(40)] public string? LastErrorCode { get; set; }
}
