using IBSRA.Repositories;
using IBSRA.Services;
using Learnfy.ApiCommon;

namespace IBSRA.CategoriesApi;

public sealed class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddLearnfyApi(builder.Configuration);
        builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
        builder.Services.AddScoped<ICategoryService, CategoryService>();
        var app = builder.Build();
        app.UseLearnfyApi();
        await app.RunAsync();
    }
}
