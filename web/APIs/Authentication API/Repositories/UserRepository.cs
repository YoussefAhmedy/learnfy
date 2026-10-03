using Microsoft.EntityFrameworkCore;
using YourApp.Data;
using YourApp.Models;

namespace YourApp.Repositories;

public sealed class UserRepository(AppDbContext context) : IUserRepository
{
    public Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        context.Users.FirstOrDefaultAsync(user => user.Id == id && user.IsActive, cancellationToken);

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalized = Normalize(email);
        return context.Users.FirstOrDefaultAsync(user => user.NormalizedEmail == normalized && user.IsActive, cancellationToken);
    }

    public Task<bool> EmailOrUsernameExistsAsync(string email, string username, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = Normalize(email);
        var normalizedUsername = Normalize(username);
        return context.Users.AnyAsync(user => user.NormalizedEmail == normalizedEmail || user.NormalizedUsername == normalizedUsername, cancellationToken);
    }

    public async Task<User> CreateAsync(User user, CancellationToken cancellationToken = default)
    {
        context.Users.Add(user);
        await context.SaveChangesAsync(cancellationToken);
        return user;
    }

    public Task UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        context.Users.Update(user);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) => context.SaveChangesAsync(cancellationToken);

    public async Task<bool> ConsumeResetTokenAsync(string tokenHash, string passwordHash, DateTime now, CancellationToken cancellationToken = default)
    {
        var stamp = Guid.NewGuid().ToString("N");
        // Atomic compare-and-consume: even simultaneous requests cannot reuse a reset token.
        var changed = await context.Users.Where(user => user.IsActive && user.ResetTokenHash == tokenHash && user.ResetTokenExpiry > now)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(user => user.PasswordHash, passwordHash)
                .SetProperty(user => user.SecurityStamp, stamp)
                .SetProperty(user => user.ResetTokenHash, (string?)null)
                .SetProperty(user => user.ResetTokenExpiry, (DateTime?)null), cancellationToken);
        return changed == 1;
    }

    public static string Normalize(string value) => value.Trim().ToUpperInvariant();
}
