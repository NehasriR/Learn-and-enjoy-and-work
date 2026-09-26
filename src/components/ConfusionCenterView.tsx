import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  Send,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Compass,
  Lightbulb,
  Clock,
  Heart
} from 'lucide-react';
import { UserProfile } from '../types';
import { confusionTopics } from '../data/gamesAndQuestions';
import { getConfusionAdviceWithAI } from '../services/aiService';

interface ConfusionCenterViewProps {
  profile: UserProfile;
}

export const ConfusionCenterView: React.FC<ConfusionCenterViewProps> = ({ profile }) => {
  const [selectedTopic, setSelectedTopic] = useState(confusionTopics[0]);
  const [customQuery, setCustomQuery] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const handleConsultAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim() || isConsulting) return;

    setIsConsulting(true);
    try {
      const advice = await getConfusionAdviceWithAI(customQuery, profile);
      setAiAdvice(advice);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              Student Clarity Sanctuary
            </span>
            <span className="text-xs text-slate-400">Zero Fluff Mentorship</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            "I'm Confused" Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Every college student hits periods of confusion, self-doubt, or choice paralysis. Get clear, realistic answers and concrete 3-step action plans.
          </p>
        </div>
      </div>

      {/* Custom Dilemma Ask Input */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 space-y-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white text-base">Ask Your Own Placement Dilemma</h3>
        </div>

        <form onSubmit={handleConsultAI} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              required
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="e.g. 'I am weak in coding and campus placements start in 45 days. What should I prioritize?'"
              className="w-full p-4 pr-32 rounded-2xl bg-slate-800/90 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={isConsulting || !customQuery.trim()}
              className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              {isConsulting ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Get Clarity</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {aiAdvice && (
          <div className="p-5 rounded-2xl bg-slate-800/90 border border-amber-500/40 space-y-3 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center space-x-1.5 text-amber-300 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>AI Placement Mentor Guidance:</span>
            </div>
            <div className="leading-relaxed whitespace-pre-wrap font-sans">
              {aiAdvice}
            </div>
          </div>
        )}
      </div>

      {/* Common College Dilemmas Grid (Requirement 20) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Frequently Asked Placement Dilemmas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {confusionTopics.map((topic) => {
            const isSelected = selectedTopic.id === topic.id;

            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-4 ${
                  isSelected
                    ? 'bg-slate-850 border-amber-500/40 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-amber-300 border border-slate-700">
                    {topic.category}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] text-amber-400 font-semibold">Active Dilemma</span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  "{topic.question}"
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {topic.summary}
                </p>

                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <span className="font-bold text-amber-300 block">Immediate 3-Step Action Plan:</span>
                  <ul className="space-y-1.5 text-slate-300">
                    {topic.actionPlan.map((act, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
