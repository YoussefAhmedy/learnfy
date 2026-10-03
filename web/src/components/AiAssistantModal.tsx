import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  BookOpen, 
  Send, 
  Loader2, 
  Terminal,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AiAssistantModalProps {
  onNavigateCourse?: (courseId: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ onNavigateCourse }) => {
  const { isAiModalOpen, setIsAiModalOpen, courses } = useApp();
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [conversation, setConversation] = useState<Array<{ sender: 'user' | 'ai'; text: string; matchedCourseId?: string }>>([
    {
      sender: 'ai',
      text: 'Hello. I am the Learnfy Curriculum Navigator. Tell me what technical or design discipline you are looking to master, and I will recommend direct learning pathways without unnecessary marketing fluff.'
    }
  ]);

  if (!isAiModalOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || prompt;
    if (!query.trim()) return;

    setConversation(prev => [...prev, { sender: 'user', text: query }]);
    setPrompt('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const lower = query.toLowerCase();

      let reply = '';
      let matchedId: string | undefined = undefined;

      if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('typography') || lower.includes('clean')) {
        matchedId = 'course-2';
        reply = 'For brutal visual cleanliness and Swiss typography discipline, I recommend "Brutally Clean Design Systems: Typography, Layout & Mobile First". It teaches you how to design without tacky neon glowing gradients.';
      } else if (lower.includes('cloud') || lower.includes('scale') || lower.includes('backend') || lower.includes('distribut') || lower.includes('docker')) {
        matchedId = 'course-3';
        reply = 'For enterprise reliability and high-throughput transaction consistency, explore "Enterprise Distributed Systems & Event Streaming" by Tariq Al-Mansoor.';
      } else if (lower.includes('business') || lower.includes('pricing') || lower.includes('product') || lower.includes('growth')) {
        matchedId = 'course-4';
        reply = 'To master digital ed-tech economics and user retention funnels, see "Product Leadership & Digital Monetization Strategy".';
      } else {
        matchedId = 'course-1';
        reply = 'The flagship course "Modern Fullstack Architecture: Next.js, TypeScript & Scalable APIs" covers complete end-to-end web engineering, video streaming players, and secure checkout patterns.';
      }

      setConversation(prev => [...prev, { sender: 'ai', text: reply, matchedCourseId: matchedId }]);
    }, 600);
  };

  const samplePrompts = [
    'I want to build brutal, clean UI without generic AI neon glow',
    'How do I architect video streaming with adaptive bitrates?',
    'Show me cloud systems and backend distributed patterns'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Curriculum & Architecture Assistant</h3>
              <p className="text-[11px] text-gray-500">Deterministic contextual course & topic synthesis</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {conversation.map((msg, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] text-xs sm:text-sm p-3.5 rounded-xl leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-red-600 text-white font-medium' 
                    : 'bg-[#FAF8F5] text-gray-800 border border-gray-200'
                }`}
              >
                {msg.text}

                {msg.matchedCourseId && (
                  <div className="mt-3 pt-3 border-t border-gray-200/60">
                    {(() => {
                      const c = courses.find(item => item.id === msg.matchedCourseId);
                      if (!c) return null;
                      return (
                        <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2.5">
                            <img src={c.thumbnailUrl} alt="" className="w-9 h-9 rounded object-cover" />
                            <div className="text-left">
                              <p className="text-xs font-bold text-gray-900 line-clamp-1">{c.title}</p>
                              <p className="text-[10px] text-gray-500">${c.discountPrice || c.price} • {c.duration}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setIsAiModalOpen(false);
                              if (onNavigateCourse) onNavigateCourse(c.id);
                            }}
                            className="px-2.5 py-1 text-xs font-bold bg-red-600 text-white rounded hover:bg-red-700 transition-colors shrink-0"
                          >
                            Explore →
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-gray-500 italic p-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
              Synthesizing learning path...
            </div>
          )}
        </div>

        {/* Suggestion Prompts */}
        <div className="px-5 py-2 bg-gray-50/70 border-t border-gray-100 flex flex-wrap gap-2">
          {samplePrompts.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              className="text-[11px] text-gray-600 bg-white border border-gray-200 hover:border-gray-400 px-2.5 py-1 rounded-md transition-colors truncate max-w-xs"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Composer */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about curriculum, topics, or engineering paths..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-[#FAF8F5] border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-red-600 transition-colors"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isThinking}
              className="p-2.5 bg-red-600 disabled:bg-gray-200 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
