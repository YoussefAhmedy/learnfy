using YourApp.Models;
using YourApp.Models.DTOs;

namespace YourApp.Mapping;

public static class CourseMapping
{
    public static CourseDto ToDto(Course course) => new(course.Id, course.CourseName, course.Category, course.ImageUrl,
        course.Description, course.Instructor, course.Duration, course.Rating, course.Price, course.IsRecommended);
    public static CourseRecommendationDto ToRecommendation(Course course, bool personalized = false) => new(
        course.Id, course.CourseName, course.Category, course.ImageUrl, course.Description, course.Instructor, course.Duration,
        course.Rating, course.Price, personalized ? (course.Rating ?? 0) * 1.5m + (course.IsRecommended ? 2m : 0m)
            : (course.Rating ?? 0) * (course.IsRecommended ? 1.2m : 1m));
}
