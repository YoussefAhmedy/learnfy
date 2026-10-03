using IBSRA.DTOs;

namespace IBSRA.Services;

public interface ICategoryService
{
    Task<ApiResponse<List<CategorySummaryDto>>> GetAllCategoriesAsync(bool includeInactive = false, CancellationToken cancellationToken = default);
    Task<ApiResponse<List<CategorySummaryDto>>> GetPopularCategoriesAsync(int count = 5, CancellationToken cancellationToken = default);
    Task<ApiResponse<CategoryDetailsDto>> GetCategoryByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<ApiResponse<CategoryDetailsDto>> GetCategoryByNameAsync(string name, CancellationToken cancellationToken = default);
}
