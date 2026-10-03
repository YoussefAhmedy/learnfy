using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Learnfy.ApiCommon;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using YourApp.Data;
using YourApp.Mapping;
using YourApp.Models;
using YourApp.Models.DTOs;
using YourApp.Repositories;

namespace YourApp.Services;

public sealed class AuthService(IUserRepository users, IOptions<JwtSettings> settings, IEmailQueue emails, TimeProvider clock) : IAuthService
{
    private static readonly string DummyHash = BCrypt.Net.BCrypt.HashPassword(Convert.ToHexString(RandomNumberGenerator.GetBytes(16)), workFactor: 12);
    private const string RecoveryMessage = "If an account exists, a password reset email has been requested.";

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        if (Encoding.UTF8.GetByteCount(request.Password) > 72) return new(false, "Invalid email or password");
        var user = await users.GetByEmailAsync(request.Email, cancellationToken);
        var valid = BCrypt.Net.BCrypt.Verify(request.Password, user?.PasswordHash ?? DummyHash);
        if (user is null || !valid) return new(false, "Invalid email or password");
        return CreateSession(user, "Login successful");
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        if (PasswordPolicy.Validate(request.Password).Any()) return new(false, "Password does not meet the password policy.");
        if (await users.EmailOrUsernameExistsAsync(request.Email, request.Username, cancellationToken))
            return new(false, "An account with that email or username already exists.");
        var user = new User
        {
            Name = request.Name.Trim(), Age = request.Age, PhoneNumber = request.PhoneNumber?.Trim(),
            Email = request.Email.Trim(), Username = request.Username.Trim(),
            NormalizedEmail = UserRepository.Normalize(request.Email), NormalizedUsername = UserRepository.Normalize(request.Username),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12),
            CreatedAt = clock.GetUtcNow().UtcDateTime
        };
        try { await users.CreateAsync(user, cancellationToken); }
        catch (DbUpdateException exception) when (DatabaseErrors.IsUniqueViolation(exception))
        {
            return new(false, "An account with that email or username already exists.");
        }
        return CreateSession(user, "Registration successful");
    }

    public async Task<AuthResponse> ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken = default)
    {
        // Configuration failure is uniform; never reveal account existence or a reset token.
        if (!emails.IsConfigured) throw new ConfigurationRequiredException("Password reset delivery is unavailable. Configure the email provider and public web URL.");
        var user = await users.GetByEmailAsync(request.Email, cancellationToken);
        if (user is null) return new(true, RecoveryMessage);
        var token = Base64UrlEncoder.Encode(RandomNumberGenerator.GetBytes(32));
        var now = clock.GetUtcNow().UtcDateTime;
        user.ResetTokenHash = HashToken(token);
        user.ResetTokenExpiry = now.AddHours(1);
        await users.UpdateAsync(user, cancellationToken);
        emails.EnqueuePasswordReset(user.Email, token, user.ResetTokenExpiry.Value);
        // Token hash and encrypted mail are committed together. Success means requested, NOT sent.
        await users.SaveChangesAsync(cancellationToken);
        return new(true, RecoveryMessage);
    }

    public async Task<AuthResponse> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default)
    {
        if (PasswordPolicy.Validate(request.NewPassword, nameof(request.NewPassword)).Any())
            return new(false, "Password does not meet the password policy.");
        var hash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, workFactor: 12);
        var consumed = await users.ConsumeResetTokenAsync(HashToken(request.ResetToken), hash, clock.GetUtcNow().UtcDateTime, cancellationToken);
        return consumed ? new(true, "Password reset successful. Please sign in again.") : new(false, "Invalid or expired reset token");
    }

    public async Task<UserDto?> GetCurrentUserAsync(int userId, CancellationToken cancellationToken = default)
    {
        var user = await users.GetByIdAsync(userId, cancellationToken);
        return user is null ? null : UserMapping.ToDto(user);
    }

    public async Task<UserDto?> UpdateProfileAsync(int userId, UpdateProfileRequest request, CancellationToken cancellationToken = default)
    {
        var user = await users.GetByIdAsync(userId, cancellationToken);
        if (user is null) return null;
        // Identity, roles and credential fields are immutable through this profile operation.
        user.Name = request.Name.Trim();
        user.Age = request.Age;
        user.PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber) ? null : request.PhoneNumber.Trim();
        await users.UpdateAsync(user, cancellationToken);
        await users.SaveChangesAsync(cancellationToken);
        return UserMapping.ToDto(user);
    }

    public async Task LogoutAsync(int userId, CancellationToken cancellationToken = default)
    {
        var user = await users.GetByIdAsync(userId, cancellationToken);
        if (user is null) return;
        user.SecurityStamp = Guid.NewGuid().ToString("N");
        await users.UpdateAsync(user, cancellationToken);
        await users.SaveChangesAsync(cancellationToken);
    }

    private AuthResponse CreateSession(User user, string message)
    {
        var jwt = settings.Value;
        var now = clock.GetUtcNow().UtcDateTime;
        var expires = now.AddMinutes(jwt.ExpiryMinutes);
        var token = new JwtSecurityToken(jwt.Issuer, jwt.Audience,
            [new Claim(ClaimTypes.NameIdentifier, user.Id.ToString(System.Globalization.CultureInfo.InvariantCulture)),
             new Claim(ClaimTypes.Name, user.Username), new Claim(ClaimTypes.Role, user.Role),
             new Claim("security_stamp", user.SecurityStamp), new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))],
            notBefore: now, expires: expires,
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)), SecurityAlgorithms.HmacSha256));
        return new(true, message, new JwtSecurityTokenHandler().WriteToken(token), UserMapping.ToDto(user), expires);
    }

    public static string HashToken(string token) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
}
