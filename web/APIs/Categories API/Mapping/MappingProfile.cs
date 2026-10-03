using IBSRA.Models;
using IBSRA.DTOs;

namespace IBSRA.Mapping;

public static class CategoryMapping
{
    public static CategorySummaryDto ToSummary(Category category) => new()
    {
        ID = category.ID, Name = category.Name, Description = category.Description, IconUrl = category.IconUrl,
        Color = category.Color, CourseCount = category.CourseCount
    };
    public static CategoryDetailsDto ToDetails(Category category) => new()
    {
        ID = category.ID, Name = category.Name, Description = category.Description, IconUrl = category.IconUrl,
        Color = category.Color, CourseCount = category.CourseCount, IsActive = category.IsActive, DisplayOrder = category.DisplayOrder,
        PopularCourses = category.Courses.Select(course => new CourseDto(course.Id, course.CourseName, course.Description,
            course.ImageUrl, course.Instructor, course.Duration, course.Rating, course.Price)).ToList()
    };
}
