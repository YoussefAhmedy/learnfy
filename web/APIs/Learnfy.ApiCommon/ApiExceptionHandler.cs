using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Learnfy.ApiCommon;

public sealed class ApiExceptionHandler(ILogger<ApiExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        var unavailable = exception is ConfigurationRequiredException;
        if (!unavailable) logger.LogError(exception, "Unhandled API error. Trace: {TraceId}", context.TraceIdentifier);
        await Results.Problem(
            statusCode: unavailable ? StatusCodes.Status503ServiceUnavailable : StatusCodes.Status500InternalServerError,
            title: unavailable ? "Service configuration required" : "An unexpected error occurred",
            detail: unavailable ? exception.Message : "Please retry later and provide the trace ID to support.",
            extensions: new Dictionary<string, object?> { ["traceId"] = context.TraceIdentifier }
        ).ExecuteAsync(context);
        return true;
    }
}
