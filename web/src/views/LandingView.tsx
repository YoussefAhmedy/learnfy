import React from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Play, 
  ShieldCheck, 
  Zap, 
  Monitor, 
  Award, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { useApp } from '../context/AppContext';

interface LandingViewProps {
  onNavigate: (view: string, courseId?: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { courses, enrolledCourseIds, setIsAiModalOpen } = useApp();

  const featuredCourses = courses.filter(c => c.isFeatured || c.isTrending);
  const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. Hero Section - Exact Clean Swiss Geometric Aesthetic from Reference Blueprint */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-gray-200 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl">
            {/* Minimal Subtitle Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF8F5] border border-gray-200 rounded-full text-xs font-semibold text-gray-800 tracking-wide mb-6">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>Next-Gen Online Education & Streaming Platform</span>
            </div>

            {/* Brutal Bold Typography */}
            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[1.08] mb-6">
              Learn deeper. <br />
              <span className="text-red-600">Build faster.</span> Zero noise.
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-normal mb-8 max-w-2xl">
              An enterprise digital academy for software architecture, production design systems, and resilient engineering. Polished video streaming, real-world projects, and direct peer outcomes.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('catalog')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm hover:translate-y-[-1px]"
              >
                <span>Explore All Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsAiModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FAF8F5] hover:bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl border border-gray-300 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-red-600" />
                <span>Smart Course Navigator</span>
              </button>
            </div>
          </div>

          {/* Minimal Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 mt-16 border-t border-gray-100">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">64K+</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Active Students</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">4.92</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Average Rating</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">100%</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Ad-Free Playback</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Verified</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Credentials Issued</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. "Continue Learning" Quick Resume for Authenticated Student */}
      {enrolledCourses.length > 0 && (
        <section className="py-10 bg-[#FAF8F5] border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Continue Learning</h2>
                <p className="text-xs text-gray-500">Pick up right where you left off</p>
              </div>
              <button
                onClick={() => onNavigate('library')}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                View Library ({enrolledCourses.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.slice(0, 2).map(c => (
                <div key={c.id} className="p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={c.thumbnailUrl} alt="" className="w-16 h-12 object-cover rounded-lg" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{c.title}</h4>
                      <p className="text-xs text-gray-500">{c.duration} • Next: Section 1, Lesson 2</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('player', c.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shrink-0 flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Resume
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Featured Courses Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Handpicked Curriculum</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
                Featured & Trending Programs
              </h2>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="text-xs font-bold text-gray-800 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              Browse complete catalog →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onSelectCourse={(id) => onNavigate('course-detail', id)}
                onStartLearning={(id) => onNavigate('player', id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Platform Architectural Pillars */}
      <section className="py-16 bg-[#FAF8F5] border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Crafted for deliberate mastery
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              We stripped away the noise and generic AI marketing clutter to engineer an uncompromising learning environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Streaming Platform Quality</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Custom low-latency video player with adaptive resolutions (1080p, 720p, 480p), custom scrubber, theater mode, and full keyboard ergonomics.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Verified Entitlements & Progress</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Zero client-side spoofing. Lesson progress, quiz scores, and verified completion credentials are authenticated and recorded securely server-side.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Cryptographic Certificates</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Upon passing quizzes and finishing curriculum milestones, generate a unique, verifiable digital credential that can be shared publicly or added to LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Minimal Footer */}
      <footer className="bg-white py-12 border-t border-gray-200 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-600 text-white flex items-center justify-center font-bold text-xs">
              L
            </div>
            <span className="font-bold text-gray-900">Learnfy Learning Platform</span>
            <span>• Powered by LearnSpring Engine</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <button onClick={() => onNavigate('catalog')} className="hover:text-gray-900">Courses</button>
            <button onClick={() => onNavigate('library')} className="hover:text-gray-900">My Learning</button>
            <button onClick={() => onNavigate('dashboard')} className="hover:text-gray-900">Settings</button>
            <button onClick={() => onNavigate('admin')} className="text-red-600 hover:underline">Instructor Studio</button>
          </div>

          <p>© 2026 Learnfy Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};
