using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using YourApp.Models.DTOs;
using YourApp.Services;

namespace YourApp.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("login"), EnableRateLimiting("auth")]
    public async Task<IActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await authService.LoginAsync(request, cancellationToken);
        return result.Success ? Ok(result) : Unauthorized(result);
    }

    [HttpPost("register"), EnableRateLimiting("auth")]
    public async Task<IActionResult> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        var result = await authService.RegisterAsync(request, cancellationToken);
        return result.Success ? StatusCode(StatusCodes.Status201Created, result) : Conflict(result);
    }

    [HttpPost("forgot-password"), EnableRateLimiting("auth")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request, CancellationToken cancellationToken)
    {
        var result = await authService.ForgotPasswordAsync(request, cancellationToken);
        return Accepted(result);
    }

    [HttpPost("reset-password"), EnableRateLimiting("auth")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        var result = await authService.ResetPasswordAsync(request, cancellationToken);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [Authorize, HttpGet("me")]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        var user = await authService.GetCurrentUserAsync(CurrentUserId(), cancellationToken);
        return user is null ? Unauthorized() : Ok(user);
    }

    [Authorize, HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        await authService.LogoutAsync(CurrentUserId(), cancellationToken);
        return NoContent();
    }

    private int CurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!, System.Globalization.CultureInfo.InvariantCulture);
}
