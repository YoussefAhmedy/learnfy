using Learnfy.ApiCommon;
using YourApp.Repositories;
using YourApp.Services;

namespace YourApp.CourseApi;

public sealed class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddLearnfyApi(builder.Configuration);
        builder.Services.AddScoped<ICourseRepository, CourseRepository>();
        builder.Services.AddScoped<ICourseService, CourseService>();
        var app = builder.Build();
        app.UseLearnfyApi();
        await app.RunAsync();
    }
}
