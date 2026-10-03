import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  Settings, 
  Subtitles, 
  CheckCircle,
  HelpCircle,
  FileText
} from 'lucide-react';
import { Lesson, QuizQuestion } from '../types';
import { useApp } from '../context/AppContext';

interface VideoPlayerProps {
  lesson: Lesson;
  courseId: string;
  isEnrolled: boolean;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  lesson,
  courseId,
  isEnrolled,
  onNextLesson,
  onPrevLesson,
  hasNext,
  hasPrev
}) => {
  const { courseProgress, updateLessonProgress, saveQuizScore } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState('1080p');
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'quiz'>('notes');
  const [captionsActive, setCaptionsActive] = useState(true);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const currentProgress = courseProgress[courseId];
  const isLessonCompleted = currentProgress?.completedLessonIds.includes(lesson.id);

  // Restore saved timestamp
  useEffect(() => {
    if (videoRef.current && currentProgress?.playbackPositionSeconds[lesson.id]) {
      videoRef.current.currentTime = currentProgress.playbackPositionSeconds[lesson.id];
    }
    setQuizSubmitted(false);
    setSelectedAnswers({});
  }, [lesson.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(cur);
    setDuration(dur);

    // Save playback position periodically
    if (Math.floor(cur) % 5 === 0) {
      updateLessonProgress(courseId, lesson.id, isLessonCompleted || cur / dur > 0.9, Math.floor(cur));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const target = !isMuted;
    setIsMuted(target);
    videoRef.current.muted = target;
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
    setIsSpeedMenuOpen(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleMarkComplete = () => {
    updateLessonProgress(courseId, lesson.id, !isLessonCompleted, Math.floor(currentTime));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // Keyboard controls (space/k = play, f = fullscreen, m = mute, left/right = seek)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.code === 'Space' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'ArrowRight' && videoRef.current) {
        e.preventDefault();
        videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
      } else if (e.key === 'ArrowLeft' && videoRef.current) {
        e.preventDefault();
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted]);

  // Quiz submission evaluation
  const handleQuizSubmit = () => {
    if (!lesson.quiz) return;
    let correct = 0;
    lesson.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const scorePct = Math.round((correct / lesson.quiz.length) * 100);
    saveQuizScore(courseId, lesson.id, scorePct);
    setQuizSubmitted(true);
    if (scorePct >= 70) {
      updateLessonProgress(courseId, lesson.id, true, Math.floor(duration));
    }
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
      
      {/* Video Streaming Stage */}
      <div 
        ref={containerRef}
        className="relative aspect-video w-full bg-black group select-none flex items-center justify-center overflow-hidden"
      >
        <video
          ref={videoRef}
          src={lesson.videoUrl}
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration);
          }}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => {
            setIsBuffering(false);
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          playsInline
        />

        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Big Center Play Button Overlay on Pause */}
        {!isPlaying && !isBuffering && (
          <button 
            onClick={togglePlay}
            className="absolute w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center pl-1 hover:scale-105 transition-transform shadow-lg hover:bg-red-600"
          >
            <Play className="w-8 h-8 fill-white" />
          </button>
        )}

        {/* Captions Overlay Simulation */}
        {captionsActive && isPlaying && (
          <div className="absolute bottom-16 bg-black/80 text-white text-xs sm:text-sm px-3 py-1 rounded max-w-xl text-center pointer-events-none tracking-wide">
            "In high-scale learning architectures, media delivery must be separated from transactional business domains."
          </div>
        )}

        {/* Video Player Floating Bar (Twitch / YouTube Quality Benchmark) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex flex-col gap-2">
          
          {/* Scrubber Bar */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer focus:outline-none accent-red-600"
            />
          </div>

          {/* Player Action Controls */}
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="hover:text-red-500 transition-colors">
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button 
                onClick={() => {
                  if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                }} 
                className="hover:text-red-500 transition-colors"
                title="Rewind 10s"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5 group/vol">
                <button onClick={toggleMute} className="hover:text-red-500 transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-gray-600 appearance-none rounded cursor-pointer accent-red-600"
                />
              </div>

              <span className="text-[11px] font-mono text-gray-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3 relative">
              {/* Captions Toggle */}
              <button 
                onClick={() => setCaptionsActive(!captionsActive)}
                className={`transition-colors ${captionsActive ? 'text-red-500 font-bold' : 'text-gray-400 hover:text-white'}`}
                title="Subtitles/Captions"
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Speed Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                  className="text-[11px] font-mono hover:text-red-500 px-1 py-0.5 rounded border border-gray-600/50"
                >
                  {speed}x
                </button>
                {isSpeedMenuOpen && (
                  <div className="absolute bottom-7 right-0 bg-gray-900 border border-gray-700 rounded py-1 w-20 z-20 text-center shadow-lg">
                    {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpeedChange(s)}
                        className={`block w-full py-1 text-xs hover:bg-gray-800 ${speed === s ? 'text-red-500 font-bold' : 'text-gray-200'}`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Resolution / Quality Pill */}
              <span className="text-[10px] bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded font-mono border border-gray-700">
                {quality}
              </span>

              {/* Fullscreen Button */}
              <button onClick={toggleFullscreen} className="hover:text-red-500 transition-colors">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Metadata Bar */}
      <div className="p-4 sm:p-5 border-b border-gray-200 bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-100 text-red-700 rounded">
              {lesson.durationMinutes} Minutes
            </span>
            {lesson.isPreview && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-200 text-gray-700 rounded">
                Free Preview
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
            {lesson.title}
          </h2>
        </div>

        {/* Complete Lesson & Navigation Controls */}
        <div className="flex items-center gap-2">
          {hasPrev && (
            <button
              onClick={onPrevLesson}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Previous
            </button>
          )}

          {isEnrolled && (
            <button
              onClick={handleMarkComplete}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                isLessonCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-white border border-gray-300 text-gray-800 hover:border-gray-400'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {isLessonCompleted ? 'Completed' : 'Mark as Complete'}
            </button>
          )}

          {hasNext && (
            <button
              onClick={onNextLesson}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Next Lesson →
            </button>
          )}
        </div>
      </div>

      {/* Tabbed Interactive Section (Notes, Resources, Assessment Quiz) */}
      <div className="p-4 sm:p-6">
        <div className="flex border-b border-gray-200 gap-6 text-sm font-semibold mb-4">
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'notes' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" /> Lesson Notes & Summary
          </button>

          {lesson.resources && lesson.resources.length > 0 && (
            <button
              onClick={() => setActiveTab('resources')}
              className={`pb-2.5 flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'resources' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>Downloadable Resources ({lesson.resources.length})</span>
            </button>
          )}

          {lesson.quiz && lesson.quiz.length > 0 && (
            <button
              onClick={() => setActiveTab('quiz')}
              className={`pb-2.5 flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'quiz' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" /> Knowledge Check Quiz
            </button>
          )}
        </div>

        {/* Tab 1: Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-4 max-w-3xl">
            <p className="text-sm text-gray-700 leading-relaxed font-normal">
              {lesson.summary}
            </p>
            {lesson.notes && (
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-gray-200 text-xs font-mono whitespace-pre-wrap text-gray-800 leading-relaxed">
                {lesson.notes}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Resources */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            {lesson.resources?.map((res) => (
              <div 
                key={res.id} 
                className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 bg-white flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs uppercase">
                    {res.type}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-gray-900 truncate">{res.title}</p>
                    <p className="text-[10px] text-gray-400">{res.size}</p>
                  </div>
                </div>
                <a
                  href={res.url}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Simulating secure download for verified student: ${res.title}`);
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded border border-red-200 transition-colors"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Interactive Quiz Assessment */}
        {activeTab === 'quiz' && lesson.quiz && (
          <div className="space-y-6 max-w-3xl">
            <div className="border border-gray-200 rounded-xl p-4 sm:p-5 bg-[#FAF8F5]">
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                Module Understanding Assessment
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                Score 70% or higher to automatically verify lesson completion and unlock the next module.
              </p>

              <div className="space-y-5">
                {lesson.quiz.map((q, qIndex) => (
                  <div key={q.id} className="p-4 rounded-lg bg-white border border-gray-200">
                    <p className="text-xs font-bold text-gray-900 mb-3">
                      {qIndex + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = selectedAnswers[q.id] === optIndex;
                        const isCorrect = q.correctIndex === optIndex;
                        let optStyle = 'border-gray-200 hover:bg-gray-50';

                        if (quizSubmitted) {
                          if (isCorrect) optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                          else if (isSelected && !isCorrect) optStyle = 'border-red-500 bg-red-50 text-red-900';
                        } else if (isSelected) {
                          optStyle = 'border-red-600 bg-red-50 text-red-900 font-semibold';
                        }

                        return (
                          <label
                            key={optIndex}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setSelectedAnswers(prev => ({ ...prev, [q.id]: optIndex }));
                              }
                            }}
                            className={`flex items-center gap-3 p-2.5 rounded-md border text-xs cursor-pointer transition-colors ${optStyle}`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={isSelected}
                              disabled={quizSubmitted}
                              onChange={() => {}}
                              className="accent-red-600"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="text-[11px] text-gray-600 mt-2.5 pt-2 border-t border-gray-100">
                        <strong className="text-gray-800">Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length < lesson.quiz.length}
                    className="px-4 py-2 bg-red-600 disabled:bg-gray-300 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Submit Quiz Answers
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-900">
                      Score: {courseProgress[courseId]?.quizScores?.[lesson.id] || 0}%
                    </span>
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setSelectedAnswers({});
                      }}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Retake Quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
