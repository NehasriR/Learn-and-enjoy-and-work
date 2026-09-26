import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  User,
  Coffee,
  Brain,
  HelpCircle,
  Zap,
  Target
} from 'lucide-react';
import { UserProfile } from '../types';
import { askAICoach } from '../services/aiService';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

const QUICK_PROMPTS = [
  'What should I study today?',
  'Why am I weak in DSA?',
  'Give me a tricky Python question.',
  'Explain database normalization simply.',
  'How do I explain my project in 60s?',
  'I am losing motivation and feeling overwhelmed.',
];

export const AICoachModal: React.FC<AICoachModalProps> = ({ isOpen, onClose, profile }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello ${profile.name}! 👋 I am your dedicated Placement Copilot for **${profile.targetRole}**. How can I support your preparation right now? You can ask for a quick concept explanation, personalized study priorities, or interview answer reviews.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg = { sender: 'user' as const, text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await askAICoach(textToSend, profile, 'DSA', 'Python');
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Focus on your core priorities for today: Spend 30 minutes practicing 2 core problems, review 1 system concept, and practice answering one question out loud. Consistent daily effort is the key!`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-sm">Placement Copilot AI Mentor</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400">Context: {profile.targetRole} • {profile.overallReadiness}% Readiness</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 text-xs font-bold">
                  ⚡
                </div>
              )}

              <div
                className={`max-w-[82%] p-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 shadow-sm'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-white flex-shrink-0 text-xs font-bold">
                  {profile.name ? profile.name[0] : 'U'}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Analyzing student profile & formulating answer...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800/60 overflow-x-auto flex items-center space-x-2">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors border border-slate-700/60 flex-shrink-0 cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask placement questions, request quiz, or check roadmap for ${profile.targetRole}...`}
            className="flex-1 p-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
