import React from 'react';
import { Star, Clock, User, Check, Play, Bookmark } from 'lucide-react';
import { Course } from '../types';
import { useApp } from '../context/AppContext';

interface CourseCardProps {
  course: Course;
  onSelectCourse: (courseId: string) => void;
  onStartLearning?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onSelectCourse,
  onStartLearning
}) => {
  const { enrolledCourseIds, wishlist, toggleWishlist, courseProgress } = useApp();
  const isEnrolled = enrolledCourseIds.includes(course.id);
  const isWishlisted = wishlist.includes(course.id);

  // calculate progress percentage if enrolled
  const progress = courseProgress[course.id];
  const totalLessons = course.sections.flatMap(s => s.lessons).length;
  const completedCount = progress?.completedLessonIds.length || 0;
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all duration-200 flex flex-col justify-between shadow-xs">
      <div>
        {/* Course Thumbnail Container */}
        <div 
          onClick={() => isEnrolled && onStartLearning ? onStartLearning(course.id) : onSelectCourse(course.id)}
          className="relative aspect-video w-full bg-gray-100 overflow-hidden cursor-pointer"
        >
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />

          {/* Level Badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-semibold text-gray-800 tracking-wide border border-gray-200 shadow-xs">
            {course.level}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(course.id);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors shadow-xs"
            title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Bookmark className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
          </button>

          {/* Enrolled Indicator Overlay */}
          {isEnrolled && (
            <div className="absolute bottom-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
              <Check className="w-3 h-3" /> Enrolled
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5 flex flex-col space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
            <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded uppercase font-bold tracking-wider text-[10px]">
              {course.category}
            </span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span>{course.duration}</span>
            </div>
          </div>

          <h3 
            onClick={() => onSelectCourse(course.id)}
            className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {course.title}
          </h3>

          <p className="text-xs text-gray-600 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-5 h-5 rounded-full object-cover border border-gray-200"
            />
            <span className="text-xs text-gray-700 font-medium truncate">
              {course.instructor.name}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs">
            <div className="flex items-center text-amber-600 font-bold gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400">({course.reviewsCount.toLocaleString()})</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500 text-[11px]">{course.studentsCount.toLocaleString()} learners</span>
          </div>
        </div>
      </div>

      {/* Footer / Action row */}
      <div className="p-4 sm:p-5 pt-0 border-t border-gray-100 flex items-center justify-between mt-2">
        {isEnrolled ? (
          <div className="w-full">
            <div className="flex justify-between items-center text-xs text-gray-600 mb-1.5 font-medium">
              <span>Progress</span>
              <span className="text-red-600 font-bold">{percent}%</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-red-600 h-full rounded-full transition-all duration-300" 
                style={{ width: `${percent}%` }}
              />
            </div>
            <button
              onClick={() => onStartLearning ? onStartLearning(course.id) : onSelectCourse(course.id)}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Continue Learning
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                ${course.discountPrice ? course.discountPrice.toFixed(2) : course.price.toFixed(2)}
              </span>
              {course.discountPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${course.price.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={() => onSelectCourse(course.id)}
              className="text-xs font-semibold px-3.5 py-2 text-gray-800 bg-[#FAF8F5] border border-gray-300 hover:border-gray-400 hover:bg-white rounded-lg transition-colors"
            >
              View Curriculum
            </button>
          </>
        )}
      </div>
    </div>
  );
};
