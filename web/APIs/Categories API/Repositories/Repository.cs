using IBSRA.Models;
using Microsoft.EntityFrameworkCore;
using YourApp.Data;

namespace IBSRA.Repositories;

public sealed class CategoryRepository(AppDbContext context) : ICategoryRepository
{
    public Task<List<Category>> GetAllAsync(CancellationToken cancellationToken = default) =>
        Project(context.Categories.AsNoTracking().OrderBy(category => category.DisplayOrder).ThenBy(category => category.Name))
            .ToListAsync(cancellationToken);
    public Task<List<Category>> GetActiveCategoriesAsync(CancellationToken cancellationToken = default) =>
        Project(context.Categories.AsNoTracking().Where(category => category.IsActive)
            .OrderBy(category => category.DisplayOrder).ThenBy(category => category.Name)).ToListAsync(cancellationToken);
    public Task<Category?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        Project(context.Categories.AsNoTracking().Where(category => category.IsActive && category.ID == id)).FirstOrDefaultAsync(cancellationToken);
    public Task<Category?> GetByNameAsync(string name, CancellationToken cancellationToken = default) =>
        Project(context.Categories.AsNoTracking().Where(category => category.IsActive && category.Name == name.Trim())).FirstOrDefaultAsync(cancellationToken);
    public Task<List<Category>> GetPopularCategoriesAsync(int count, CancellationToken cancellationToken = default) =>
        Project(context.Categories.AsNoTracking().Where(category => category.IsActive)
            .OrderByDescending(category => category.Courses.Count(course => course.IsPublished))
            .ThenBy(category => category.ID).Take(count)).ToListAsync(cancellationToken);

    private static IQueryable<Category> Project(IQueryable<Category> query) => query.Select(category => new Category
    {
        ID = category.ID, Name = category.Name, Description = category.Description, IconUrl = category.IconUrl,
        Color = category.Color, IsActive = category.IsActive, DisplayOrder = category.DisplayOrder,
        CreatedAt = category.CreatedAt, UpdatedAt = category.UpdatedAt,
        CourseCount = category.Courses.Count(course => course.IsPublished),
        Courses = category.Courses.Where(course => course.IsPublished).OrderByDescending(course => course.Rating)
            .ThenBy(course => course.Id).Take(5).ToList()
    });
}
