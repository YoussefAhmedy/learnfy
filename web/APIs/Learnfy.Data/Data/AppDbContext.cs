using IBSRA.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using YourApp.Models;

namespace YourApp.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<UserCourseRecommendation> UserCourseRecommendations => Set<UserCourseRecommendation>();
    public DbSet<EmailOutboxMessage> EmailOutboxMessages => Set<EmailOutboxMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(x => x.NormalizedEmail).IsUnique();
            entity.HasIndex(x => x.NormalizedUsername).IsUnique();
            entity.HasIndex(x => x.ResetTokenHash).IsUnique().HasFilter("[ResetTokenHash] IS NOT NULL");
            entity.ToTable("Users", table => table.HasCheckConstraint("CK_Users_Age", "[Age] >= 0 AND [Age] <= 120"));
        });
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(x => x.ID);
            entity.HasAlternateKey(x => x.Name);
            entity.HasIndex(x => new { x.IsActive, x.DisplayOrder });
        });
        modelBuilder.Entity<Course>(entity =>
        {
            // Integer minor units preserve money exactly and allow relational sorting on SQLite.
            entity.Property(x => x.Price).HasConversion(new ValueConverter<decimal, long>(
                amount => checked((long)(amount * 100m)), minorUnits => minorUnits / 100m));
            entity.Property(x => x.Rating).HasConversion<double>();
            entity.HasOne(x => x.CategoryInfo).WithMany(x => x.Courses)
                .HasForeignKey(x => x.Category).HasPrincipalKey(x => x.Name).OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(x => new { x.IsPublished, x.Category, x.Price });
            entity.HasIndex(x => new { x.IsPublished, x.Rating });
            entity.ToTable("Courses", table =>
            {
                table.HasCheckConstraint("CK_Courses_Price", "[Price] IS NULL OR [Price] >= 0");
                table.HasCheckConstraint("CK_Courses_Rating", "[Rating] IS NULL OR ([Rating] >= 0 AND [Rating] <= 5)");
            });
        });
        modelBuilder.Entity<UserCourseRecommendation>(entity =>
        {
            entity.HasIndex(x => new { x.UserId, x.CourseId }).IsUnique();
            entity.Property(x => x.RecommendationScore).HasConversion<double>();
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Course).WithMany(x => x.UserRecommendations)
                .HasForeignKey(x => x.CourseId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<EmailOutboxMessage>(entity =>
        {
            entity.HasIndex(x => new { x.SentAt, x.NextAttemptAt });
            entity.Property(x => x.LeaseId).IsConcurrencyToken();
        });
    }
}
