import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  Award, 
  ArrowLeft,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';
import { Course, Lesson } from '../types';
import { useApp } from '../context/AppContext';
import { VideoPlayer } from '../components/VideoPlayer';

interface CoursePlayerViewProps {
  courseId: string;
  onNavigate: (view: string, courseId?: string) => void;
}

export const CoursePlayerView: React.FC<CoursePlayerViewProps> = ({ courseId, onNavigate }) => {
  const { courses, enrolledCourseIds, courseProgress, setIsAiModalOpen } = useApp();

  const course = courses.find(c => c.id === courseId) || courses[0];
  const isEnrolled = enrolledCourseIds.includes(course.id);
  const progress = courseProgress[course.id];

  // Flatten lessons to navigate prev/next
  const allLessons: Lesson[] = course.sections.flatMap(s => s.lessons);
  
  // Default to last accessed lesson or first lesson
  const initialLesson = allLessons.find(l => l.id === progress?.lastAccessedLessonId) || allLessons[0];
  const [activeLesson, setActiveLesson] = useState<Lesson>(initialLesson);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
  const hasNext = currentIndex < allLessons.length - 1;
  const hasPrev = currentIndex > 0;

  const toggleSectionCollapse = (secId: string) => {
    setCollapsedSections(prev => ({ ...prev, [secId]: !prev[secId] }));
  };

  const completedCount = progress?.completedLessonIds.length || 0;
  const percent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
  const isFinished = percent >= 100;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-12">
      
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-16 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('library')}
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded hover:bg-gray-100 flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> My Library
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-xs font-bold text-gray-900 truncate max-w-xs sm:max-w-md">
            {course.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-600">
            <span>Overall Progress:</span>
            <span className="text-red-600 font-bold">{percent}%</span>
            <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-red-600 h-full rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
            </div>
          </div>

          {progress?.certificateIssued && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>Certificate Unlocked</span>
            </button>
          )}

          <button
            onClick={() => setIsAiModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-700 bg-[#FAF8F5] border border-gray-300 rounded-lg hover:border-gray-400"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">Ask AI About Lesson</span>
          </button>
        </div>
      </div>

      {/* Main Learning Workspace - Desktop Two-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main 2 Cols: Streaming Player */}
          <div className="lg:col-span-2">
            {(!isEnrolled && !activeLesson.isPreview) ? (
              <div className="aspect-video w-full bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 text-center shadow-xs">
                <Lock className="w-12 h-12 text-red-600 mb-3" />
                <h3 className="text-base font-bold text-gray-900 mb-1">Lesson Protected by Entitlement Access</h3>
                <p className="text-xs text-gray-600 max-w-md mb-6 leading-relaxed">
                  This lesson is part of the full "{course.title}" curriculum. Enroll or complete checkout to unlock high-definition streaming, resources, and credentials.
                </p>
                <button
                  onClick={() => onNavigate('course-detail', course.id)}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                >
                  Unlock Full Course Access
                </button>
              </div>
            ) : (
              <VideoPlayer
                lesson={activeLesson}
                courseId={course.id}
                isEnrolled={isEnrolled}
                hasNext={hasNext}
                hasPrev={hasPrev}
                onNextLesson={() => {
                  if (hasNext) setActiveLesson(allLessons[currentIndex + 1]);
                }}
                onPrevLesson={() => {
                  if (hasPrev) setActiveLesson(allLessons[currentIndex - 1]);
                }}
              />
            )}
          </div>

          {/* Right Col: Course Curriculum Navigation Sidebar */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs sticky top-32">
            <div className="p-4 border-b border-gray-200 bg-[#FAF8F5] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Curriculum Syllabus</h3>
                <p className="text-[11px] text-gray-500">
                  {completedCount} of {allLessons.length} lessons completed ({percent}%)
                </p>
              </div>
              <Layers className="w-4 h-4 text-gray-400" />
            </div>

            <div className="max-h-[70vh] overflow-y-auto divide-y divide-gray-100">
              {course.sections.map((sec, secIdx) => {
                const isCollapsed = collapsedSections[sec.id];
                return (
                  <div key={sec.id} className="bg-white">
                    <button
                      onClick={() => toggleSectionCollapse(sec.id)}
                      className="w-full px-4 py-3 bg-gray-50/70 hover:bg-gray-100/70 flex items-center justify-between text-left transition-colors"
                    >
                      <span className="text-xs font-bold text-gray-800">
                        {sec.title}
                      </span>
                      {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                    </button>

                    {!isCollapsed && (
                      <div className="divide-y divide-gray-50">
                        {sec.lessons.map((les) => {
                          const isCurrent = les.id === activeLesson.id;
                          const isDone = progress?.completedLessonIds.includes(les.id);
                          const isLocked = !isEnrolled && !les.isPreview;

                          return (
                            <button
                              key={les.id}
                              onClick={() => setActiveLesson(les)}
                              className={`w-full px-4 py-3 flex items-start gap-3 text-left transition-colors ${
                                isCurrent 
                                  ? 'bg-red-50/70 border-l-4 border-red-600' 
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="mt-0.5">
                                {isDone ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                                ) : isLocked ? (
                                  <Lock className="w-4 h-4 text-gray-300" />
                                ) : (
                                  <Play className={`w-3.5 h-3.5 ${isCurrent ? 'text-red-600 fill-red-600' : 'text-gray-400'}`} />
                                )}
                              </div>

                              <div className="flex-1">
                                <p className={`text-xs leading-snug ${isCurrent ? 'font-bold text-red-900' : 'text-gray-800 font-medium'}`}>
                                  {les.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                                  <span>{les.durationMinutes} mins</span>
                                  {les.isPreview && (
                                    <span className="text-red-600 font-bold uppercase tracking-wider">Preview</span>
                                  )}
                                  {les.quiz && les.quiz.length > 0 && (
                                    <span>• Quiz</span>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Completion Certificate Banner */}
            {isFinished && (
              <div className="p-4 bg-amber-50 border-t border-amber-200 text-center">
                <Award className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
                <h4 className="text-xs font-bold text-amber-900">Curriculum Completed!</h4>
                <p className="text-[10px] text-amber-700 mt-0.5 mb-2">
                  You have successfully finished all required lessons and knowledge checks.
                </p>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  View Verified Certificate
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
