import React from 'react';
import { BookOpen, Play, Award, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LibraryViewProps {
  onNavigate: (view: string, courseId?: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onNavigate }) => {
  const { courses, enrolledCourseIds, courseProgress } = useApp();

  const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Personal Entitlements</span>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-1">
            My Learning Library
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Access all courses you own, resume playback positions, and verify certificates.
          </p>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(course => {
              const progress = courseProgress[course.id];
              const totalLessons = course.sections.flatMap(s => s.lessons).length;
              const completedCount = progress?.completedLessonIds.length || 0;
              const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
              const isDone = percent >= 100;

              return (
                <div 
                  key={course.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div 
                      onClick={() => onNavigate('player', course.id)}
                      className="aspect-video w-full relative bg-gray-100 cursor-pointer group"
                    >
                      <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                        <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center pl-0.5 shadow-md">
                          <Play className="w-5 h-5 fill-white" />
                        </div>
                      </div>
                      {isDone && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                          <Award className="w-3 h-3" /> Completed
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="text-red-600 font-bold uppercase text-[10px] tracking-wider">{course.category}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                        </div>
                      </div>

                      <h3 
                        onClick={() => onNavigate('player', course.id)}
                        className="text-base font-bold text-gray-900 hover:text-red-600 cursor-pointer line-clamp-2 leading-snug"
                      >
                        {course.title}
                      </h3>

                      <p className="text-xs text-gray-500">
                        Instructor: <strong className="text-gray-700">{course.instructor.name}</strong>
                      </p>

                      {/* Progress bar */}
                      <div className="pt-2">
                        <div className="flex justify-between items-center text-xs font-medium text-gray-600 mb-1.5">
                          <span>Progress</span>
                          <span className="font-bold text-gray-900">{percent}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${isDone ? 'bg-amber-500' : 'bg-red-600'}`} 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-gray-100 mt-2">
                    <button
                      onClick={() => onNavigate('player', course.id)}
                      className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      {isDone ? 'Review Course' : 'Continue Learning'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-dashed border-gray-300 rounded-2xl max-w-xl mx-auto p-8">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h2 className="text-base font-bold text-gray-900">Your library is currently empty</h2>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              When you enroll in courses or purchase them through checkout, they will appear here with synchronized progress and streaming authorization.
            </p>
            <button
              onClick={() => onNavigate('catalog')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors"
            >
              <span>Explore Course Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
