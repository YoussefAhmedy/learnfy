using Learnfy.ApiCommon;
using YourApp.Repositories;
using YourApp.Services;

namespace YourApp.AuthApi;

public sealed class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddLearnfyApi(builder.Configuration);
        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddLearnfyEmail(builder.Configuration, builder.Environment);
        var app = builder.Build();
        app.UseLearnfyApi();
        await app.RunAsync();
    }
}
