import React, { useState } from 'react';
import { 
  Plus, 
  Video, 
  Users, 
  DollarSign, 
  BarChart2, 
  CheckCircle2, 
  Upload, 
  Settings,
  Layers,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminCmsView: React.FC = () => {
  const { courses } = useApp();
  const [activeTab, setActiveTab] = useState<'courses' | 'upload' | 'analytics'>('courses');
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStatus('Transcoding video asset into adaptive HLS manifests (1080p, 720p, 480p)...');
    setTimeout(() => {
      setUploadStatus('CDN signed distribution generated successfully! Lecture is now ready.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded">
              Operational Management
            </span>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-1">
              Instructor Studio & CMS
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage curriculum, publish new video lectures, and monitor platform throughput.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Video Lecture</span>
            </button>
          </div>
        </div>

        {/* Operational Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-gray-900">$184,920</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">+14.2% vs last month</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold">Active Enrollments</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-gray-900">18,440</p>
            <p className="text-[10px] text-gray-400 mt-1">Across 4 published tracks</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold">Streaming Hours</span>
              <Video className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-2xl font-black text-gray-900">428,100 hrs</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">99.98% delivery uptime</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-semibold">Certificates Issued</span>
              <FileCheck className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-gray-900">4,912</p>
            <p className="text-[10px] text-gray-400 mt-1">100% cryptographically verified</p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-gray-200 gap-6 text-xs sm:text-sm font-bold mb-6">
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'courses' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Curriculum Registry
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'upload' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Media Transcoding Pipeline
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'analytics' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Security & Entitlements Audit
          </button>
        </div>

        {/* Tab 1: Course Management List */}
        {activeTab === 'courses' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs divide-y divide-gray-200">
            {courses.map(course => (
              <div key={course.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={course.thumbnailUrl} alt="" className="w-16 h-12 object-cover rounded-lg" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{course.title}</h4>
                    <p className="text-xs text-gray-500">
                      {course.category} • {course.sections.length} Sections • {course.duration} • ${course.discountPrice || course.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    Published
                  </span>
                  <button 
                    onClick={() => alert(`Opening curriculum editor for ${course.title}`)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-[#FAF8F5] border border-gray-300 rounded-lg hover:border-gray-400"
                  >
                    Edit Curriculum
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Upload / Transcode */}
        {activeTab === 'upload' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Upload & Package Video Asset</h3>
            <p className="text-xs text-gray-500 mb-6">
              Assets are securely transcoded into multi-bitrate HLS streams with signed media authorization tokens.
            </p>

            <form onSubmit={handleSimulateUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target Course</label>
                <select className="w-full bg-[#FAF8F5] border border-gray-300 rounded-lg p-2 text-xs">
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Lecture Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Section 3: Distributed State Machines"
                  className="w-full bg-[#FAF8F5] border border-gray-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-[#FAF8F5]">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-800">Select MP4, ProRes, or WebM media file</p>
                <p className="text-[10px] text-gray-500 mt-1">Maximum 5GB per asset</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Start Ingestion & Transcoding
              </button>

              {uploadStatus && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{uploadStatus}</span>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Tab 3: Security & Entitlements Audit */}
        {activeTab === 'analytics' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Streaming Authorization & Entitlement Policy</h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
              All media endpoints strictly require valid JWT authorization headers mapped against the student's explicit digital entitlement record. Client-side URL extraction attacks are blocked via short-lived playback signing tokens.
            </p>
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-gray-200 font-mono text-[11px] text-gray-700 space-y-1">
              <p>• Auth Scheme: Bearer JWT + HMAC-SHA256 Media Token</p>
              <p>• Entitlement Verification: Synchronous server lookup per playback request</p>
              <p>• Rate Limiting: 120 req/min for media segment manifests</p>
              <p>• Token Expiration: 3600 seconds with rolling refresh</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
