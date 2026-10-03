using IBSRA.DTOs;
using IBSRA.Mapping;
using IBSRA.Repositories;

namespace IBSRA.Services;

public sealed class CategoryService(ICategoryRepository categories) : ICategoryService
{
    public async Task<ApiResponse<List<CategorySummaryDto>>> GetAllCategoriesAsync(bool includeInactive = false, CancellationToken cancellationToken = default)
    {
        var values = includeInactive ? await categories.GetAllAsync(cancellationToken) : await categories.GetActiveCategoriesAsync(cancellationToken);
        var data = values.Select(CategoryMapping.ToSummary).ToList();
        return new() { Success = true, Message = "Categories retrieved successfully", Data = data, TotalCount = data.Count };
    }
    public async Task<ApiResponse<List<CategorySummaryDto>>> GetPopularCategoriesAsync(int count = 5, CancellationToken cancellationToken = default)
    {
        var data = (await categories.GetPopularCategoriesAsync(Math.Clamp(count, 1, 20), cancellationToken)).Select(CategoryMapping.ToSummary).ToList();
        return new() { Success = true, Message = "Popular categories retrieved successfully", Data = data, TotalCount = data.Count };
    }
    public async Task<ApiResponse<CategoryDetailsDto>> GetCategoryByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var category = id > 0 ? await categories.GetByIdAsync(id, cancellationToken) : null;
        return category is null ? new() { Success = false, Message = "Category not found" }
            : new() { Success = true, Message = "Category retrieved successfully", Data = CategoryMapping.ToDetails(category) };
    }
    public async Task<ApiResponse<CategoryDetailsDto>> GetCategoryByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        var category = string.IsNullOrWhiteSpace(name) ? null : await categories.GetByNameAsync(name, cancellationToken);
        return category is null ? new() { Success = false, Message = "Category not found" }
            : new() { Success = true, Message = "Category retrieved successfully", Data = CategoryMapping.ToDetails(category) };
    }
}
