import React, { useState } from 'react';
import { 
  Star, 
  Clock, 
  Globe, 
  ShieldCheck, 
  Play, 
  Check, 
  ShoppingBag, 
  Share2, 
  Bookmark,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CourseDetailViewProps {
  courseId: string;
  onNavigate: (view: string, courseId?: string) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({ courseId, onNavigate }) => {
  const { 
    courses, 
    cart, 
    addToCart, 
    enrolledCourseIds, 
    wishlist, 
    toggleWishlist 
  } = useApp();

  const [expandedSection, setExpandedSection] = useState<string | null>('sec-1-1');

  const course = courses.find(c => c.id === courseId) || courses[0];
  const isEnrolled = enrolledCourseIds.includes(course.id);
  const isInCart = cart.some(item => item.courseId === course.id);
  const isWishlisted = wishlist.includes(course.id);

  const totalLessons = course.sections.flatMap(s => s.lessons).length;

  return (
    <div className="min-h-screen bg-white pb-16">
      
      {/* Course Header Banner */}
      <div className="bg-[#FAF8F5] border-b border-gray-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* Left 2 Cols: Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-red-100 text-red-700 rounded">
                  {course.category}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-xs text-gray-600 font-medium">{course.level}</span>
                <span className="text-gray-400">•</span>
                <span className="text-xs text-gray-500">Updated {course.lastUpdated}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                {course.description}
              </p>

              {/* Rating & Learners metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium pt-2">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="text-sm">{course.rating.toFixed(1)}</span>
                  <span className="text-gray-500 font-normal">({course.reviewsCount.toLocaleString()} reviews)</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-700 font-semibold">{course.studentsCount.toLocaleString()} students enrolled</span>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1 text-gray-600">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{course.language}</span>
                </div>
              </div>

              {/* Instructor badge */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200/80">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Created by</p>
                  <p className="text-sm font-bold text-gray-900">{course.instructor.name}</p>
                </div>
              </div>
            </div>

            {/* Right Col: Checkout Box / Ownership Status */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24 space-y-5">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 relative">
                <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => onNavigate('player', course.id)}
                  className="absolute inset-0 bg-black/30 hover:bg-black/40 flex items-center justify-center transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center pl-1 group-hover:scale-110 transition-transform shadow-md">
                    <Play className="w-6 h-6 fill-white" />
                  </div>
                </button>
                <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Preview Available
                </div>
              </div>

              {/* Pricing or Enrolled status */}
              {isEnrolled ? (
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-700 text-xs font-bold">
                    <Check className="w-4 h-4" /> You own this course
                  </div>
                  <button
                    onClick={() => onNavigate('player', course.id)}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" /> Start / Continue Learning
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-gray-900">
                      ${course.discountPrice ? course.discountPrice.toFixed(2) : course.price.toFixed(2)}
                    </span>
                    {course.discountPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${course.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {isInCart ? (
                      <button
                        onClick={() => onNavigate('cart')}
                        className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" /> Go to Cart ({cart.length})
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(course.id)}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </button>
                    )}

                    <button
                      onClick={() => {
                        addToCart(course.id);
                        onNavigate('checkout');
                      }}
                      className="w-full py-3 bg-[#FAF8F5] border border-gray-300 hover:border-gray-400 text-gray-900 font-bold text-sm rounded-xl transition-colors"
                    >
                      Instant Buy Now
                    </button>
                  </div>
                </div>
              )}

              {/* Value checklist */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-red-600" />
                  <span>{course.duration} on-demand streaming</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-red-600" />
                  <span>Downloadable source materials</span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-red-600" />
                  <span>Interactive quizzes & tests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-red-600" />
                  <span>Verifiable Certificate of Completion</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
                <button 
                  onClick={() => toggleWishlist(course.id)}
                  className="inline-flex items-center gap-1.5 hover:text-red-600 font-medium"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
                  {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Course link copied to clipboard!');
                  }}
                  className="inline-flex items-center gap-1.5 hover:text-gray-900 font-medium"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Main Body Curriculum & Learning Outcomes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
            
            {/* What you'll learn */}
            <div className="border border-gray-200 rounded-2xl p-6 bg-white">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                What you'll master in this program
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum & Lessons */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Course Curriculum</h2>
                  <p className="text-xs text-gray-500">
                    {course.sections.length} sections • {totalLessons} lectures • {course.duration} total length
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-200">
                {course.sections.map((section) => {
                  const isSecOpen = expandedSection === section.id;
                  return (
                    <div key={section.id} className="bg-white">
                      <button
                        onClick={() => setExpandedSection(isSecOpen ? null : section.id)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-bold text-sm text-gray-900">
                          {section.title}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{section.lessons.length} lessons</span>
                          {isSecOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isSecOpen && (
                        <div className="bg-[#FAF8F5] divide-y divide-gray-100 border-t border-gray-100">
                          {section.lessons.map((lesson) => (
                            <div 
                              key={lesson.id}
                              className="px-5 py-3 flex items-center justify-between text-xs text-gray-800 hover:bg-white transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Play className="w-3.5 h-3.5 text-gray-400" />
                                <span className="font-medium">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                {lesson.isPreview && (
                                  <button
                                    onClick={() => onNavigate('player', course.id)}
                                    className="text-red-600 hover:underline font-bold text-[11px]"
                                  >
                                    Preview
                                  </button>
                                )}
                                <span className="text-gray-400 font-mono">{lesson.durationMinutes}m</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Student Reviews */}
            {course.reviews && course.reviews.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Learner Feedback & Reviews</h2>
                <div className="space-y-3">
                  {course.reviews.map(r => (
                    <div key={r.id} className="p-4 border border-gray-200 rounded-xl bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">{r.userName}</span>
                          {r.verifiedPurchase && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">
                              Verified Enrollment
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400">{r.date}</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Instructor Bio Box */}
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-2xl p-6 bg-[#FAF8F5]">
              <h3 className="text-sm font-bold text-gray-900 mb-3">About the Instructor</h3>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{course.instructor.name}</h4>
                  <p className="text-xs text-gray-500">{course.instructor.title}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {course.instructor.bio}
              </p>
              <div className="grid grid-cols-2 gap-2 text-center pt-3 border-t border-gray-200">
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                  <p className="text-sm font-bold text-gray-900">{course.instructor.rating}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Instructor Rating</p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                  <p className="text-sm font-bold text-gray-900">{course.instructor.studentsCount.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Students</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
