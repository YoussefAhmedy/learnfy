using IBSRA.Models;
using Microsoft.EntityFrameworkCore;
using YourApp.Data;
using YourApp.Models;

namespace YourApp.Data;

public static class DevelopmentCatalog
{
    public static async Task SeedAsync(AppDbContext db, CancellationToken cancellationToken = default)
    {
        if (await db.Categories.AnyAsync(cancellationToken) || await db.Courses.AnyAsync(cancellationToken))
            throw new InvalidOperationException("Refusing sample seed: catalog is not empty. Existing records will not be overwritten.");
        // Recovered category descriptions and course metadata from preserved August 2025 SQL.
        // Cached fake counts and invalid sample user/password rows deliberately are not seeded.
        db.Categories.AddRange(
            new Category { Name = "Software Development", Description = "Learn programming languages, frameworks, and development tools", Color = "#A3319E", DisplayOrder = 1 },
            new Category { Name = "Data Science", Description = "Master data analysis, machine learning, and statistics", Color = "#287C59", DisplayOrder = 2 },
            new Category { Name = "Mathematics", Description = "Explore mathematical concepts from basics to advanced topics", Color = "#A34D31", DisplayOrder = 3 });
        var data = new[]
        {
            ("Complete Python Programming", "Software Development", "Learn Python from scratch to advanced level", "Dr. Ahmed Hassan", "40 hours", 4.8m, 99.99m, true, "photo-1526379879527-8559ecfcaec0"),
            ("Data Science with R", "Data Science", "Master data analysis and visualization with R", "Sarah Johnson", "35 hours", 4.6m, 89.99m, true, "photo-1551288049-bebda4e38f71"),
            ("Calculus I - Fundamentals", "Mathematics", "Complete introduction to differential calculus", "Prof. Mohamed Ali", "30 hours", 4.7m, 79.99m, true, "photo-1635070041078-e363dbe005cb"),
            ("Machine Learning Basics", "Data Science", "Introduction to ML algorithms and applications", "Dr. Lisa Chen", "45 hours", 4.9m, 129.99m, true, "photo-1555949963-aa79dcee981c"),
            ("Web Development with React", "Software Development", "Build modern web applications with React", "John Smith", "50 hours", 4.5m, 109.99m, true, "photo-1633356122544-f134324a6cee"),
            ("Statistics for Beginners", "Mathematics", "Essential statistical concepts and methods", "Dr. Emma Wilson", "25 hours", 4.4m, 69.99m, false, "photo-1543286386-713bdd548da4"),
            ("Advanced JavaScript", "Software Development", "Master advanced JavaScript concepts", "Mike Johnson", "38 hours", 4.7m, 94.99m, true, "photo-1579468118864-1b9ea3c0db4a"),
            ("Linear Algebra", "Mathematics", "Comprehensive linear algebra course", "Prof. David Lee", "42 hours", 4.8m, 84.99m, false, "photo-1596495578065-6e0763fa1178"),
            ("Deep Learning with TensorFlow", "Data Science", "Build neural networks with TensorFlow", "Dr. Anna Rodriguez", "55 hours", 4.9m, 149.99m, true, "photo-1555949963-f7c13c6b9eba"),
            ("Mobile App Development", "Software Development", "Create mobile apps for iOS and Android", "Robert Brown", "60 hours", 4.6m, 119.99m, false, "photo-1512941937669-90a1b58e7e9c")
        };
        db.Courses.AddRange(data.Select(item => new Course
        {
            CourseName = item.Item1, Category = item.Item2, Description = item.Item3, Instructor = item.Item4,
            Duration = item.Item5, Rating = item.Item6, Price = item.Item7, IsRecommended = item.Item8,
            ImageUrl = $"https://images.unsplash.com/{item.Item9}?w=640&auto=format&fit=crop"
        }));
        await db.SaveChangesAsync(cancellationToken);
    }
}
