using IBSRA.Models;

namespace IBSRA.Repositories;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Category?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Category?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<List<Category>> GetActiveCategoriesAsync(CancellationToken cancellationToken = default);
    Task<List<Category>> GetPopularCategoriesAsync(int count, CancellationToken cancellationToken = default);
}
