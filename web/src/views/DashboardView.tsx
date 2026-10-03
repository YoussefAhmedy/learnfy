import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Award, 
  CreditCard, 
  Bookmark, 
  Settings, 
  Clock, 
  Play, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DashboardViewProps {
  onNavigate: (view: string, courseId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    courses, 
    enrolledCourseIds, 
    courseProgress, 
    orders, 
    wishlist 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'certificates' | 'orders' | 'wishlist'>('overview');

  const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
  const wishlistedCourses = courses.filter(c => wishlist.includes(c.id));

  // Find certificates issued
  const certificates = Object.values(courseProgress).filter(p => p.certificateIssued).map(p => {
    const course = courses.find(c => c.id === p.courseId);
    return {
      certificateId: p.certificateId || 'CERT-LFY-884',
      date: p.certificateDate || 'October 2026',
      course
    };
  }).filter(c => Boolean(c.course));

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Profile Banner - LearnSpring Soft Cream & Clean Card Aesthetic */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-red-600 shadow-xs"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">{currentUser?.name}</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-100 text-red-700 rounded">
                  {currentUser?.role}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{currentUser?.email} • @{currentUser?.username}</p>
              <p className="text-xs text-gray-600 mt-2 max-w-md">
                Continuous learner focusing on high-concurrency systems, video delivery infrastructure, and Swiss design typography.
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto justify-center">
            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-2 text-xs font-bold bg-[#FAF8F5] border border-gray-300 hover:border-gray-400 rounded-lg text-gray-800 transition-colors"
            >
              Instructor Studio & Admin CMS
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-gray-200 gap-6 text-xs sm:text-sm font-bold mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'overview' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Continue Learning ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'certificates' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Digital Certificates ({certificates.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'orders' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Order Receipts ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'wishlist' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Saved Wishlist ({wishlistedCourses.length})
          </button>
        </div>

        {/* Tab 1: Overview / Enrolled */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.map(course => {
                const progress = courseProgress[course.id];
                const totalLessons = course.sections.flatMap(s => s.lessons).length;
                const completedCount = progress?.completedLessonIds.length || 0;
                const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

                return (
                  <div key={course.id} className="p-5 bg-white border border-gray-200 rounded-2xl flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span className="font-bold text-red-600 uppercase text-[10px]">{course.category}</span>
                        <span>{course.duration}</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
                        <span>Curriculum Progress</span>
                        <span className="text-red-600">{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
                        <div className="bg-red-600 h-full rounded-full" style={{ width: `${percent}%` }} />
                      </div>

                      <button
                        onClick={() => onNavigate('player', course.id)}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" /> Resume Streaming
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Digital Certificates */}
        {activeTab === 'certificates' && (
          <div className="space-y-4">
            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map(cert => (
                  <div key={cert.certificateId} className="bg-white border-2 border-amber-300 rounded-2xl p-6 relative overflow-hidden shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          Official Completion Credential
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mt-2">{cert.course?.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">Conferred to <strong>{currentUser?.name}</strong></p>
                      </div>
                      <Award className="w-10 h-10 text-amber-500 shrink-0" />
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-mono">Certificate ID</p>
                        <p className="font-mono font-bold text-gray-800">{cert.certificateId}</p>
                      </div>
                      <button
                        onClick={() => alert(`Certificate ${cert.certificateId} is verified on the public Learnfy Registry.`)}
                        className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <span>Verify Record</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl p-6">
                <Award className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-gray-900">No Certificates Earned Yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Finish 100% of lectures and pass module quizzes in any enrolled program to unlock verifiable cryptographic certificates.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Order Receipts */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-200">
            {orders.map(order => (
              <div key={order.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-900">{order.id}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })} • {order.paymentMethod}
                  </p>
                  <div className="mt-2 text-xs font-medium text-gray-700">
                    {order.items.map(i => i.courseTitle).join(', ')}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-base font-bold text-gray-900">${order.total.toFixed(2)} USD</p>
                  <p className="text-[10px] text-gray-400 font-mono">{order.paymentReference}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            {wishlistedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistedCourses.map(c => (
                  <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <img src={c.thumbnailUrl} alt="" className="w-full aspect-video object-cover rounded-xl mb-3" />
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{c.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">${c.discountPrice || c.price}</p>
                    </div>
                    <button
                      onClick={() => onNavigate('course-detail', c.id)}
                      className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl p-6">
                <Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-gray-900">Your Wishlist is Empty</h3>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
