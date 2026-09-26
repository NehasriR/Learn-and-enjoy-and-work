import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Code,
  HelpCircle,
  Zap,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { RoadmapPhase, RoadmapTopic } from '../types';
import { toggleRoadmapTopic } from '../services/storage';

interface RoadmapViewProps {
  roadmap: RoadmapPhase[];
  targetRole: string;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap, targetRole }) => {
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>('p1-t1');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizChecked, setQuizChecked] = useState<Record<string, boolean>>({});

  const handleQuizSelect = (topicId: string, optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [topicId]: optionIdx }));
    setQuizChecked((prev) => ({ ...prev, [topicId]: true }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <span>Curriculum Roadmap</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-400">{targetRole}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Preparation Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            A structured 5-phase progressive curriculum from fundamentals to production interviews.
          </p>
        </div>
      </div>

      {/* Phases Accordion / List */}
      <div className="space-y-6">
        {roadmap.map((phase) => {
          const completedCount = phase.topics.filter((t) => t.completed).length;
          const totalCount = phase.topics.length;
          const phasePercent = Math.round((completedCount / (totalCount || 1)) * 100);

          return (
            <div
              key={phase.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm"
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
                    <span>Phase {phase.phaseNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>{phase.duration}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-400">{completedCount}/{totalCount} Completed</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">{phase.title}</h2>
                  <p className="text-xs text-slate-400">{phase.description}</p>
                </div>

                {/* Phase Progress bar */}
                <div className="w-full sm:w-44 flex flex-col space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Mastery</span>
                    <span className="font-semibold text-indigo-400">{phasePercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${phasePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Topics List in Phase */}
              <div className="space-y-3">
                {phase.topics.map((topic) => {
                  const isExpanded = expandedTopicId === topic.id;
                  const selectedQuizOpt = quizAnswers[topic.id];
                  const isChecked = quizChecked[topic.id];

                  return (
                    <div
                      key={topic.id}
                      className={`rounded-2xl border transition-all ${
                        isExpanded
                          ? 'bg-slate-850 border-indigo-500/40 shadow-md'
                          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                      }`}
                    >
                      {/* Topic Title Row */}
                      <div
                        onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRoadmapTopic(topic.id);
                            }}
                            className="text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0"
                          >
                            {topic.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <p
                              className={`text-sm sm:text-base font-semibold truncate ${
                                topic.completed ? 'line-through text-slate-400' : 'text-slate-100'
                              }`}
                            >
                              {topic.title}
                            </p>
                            <span className="text-[11px] text-slate-400">Duration: {topic.duration}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 flex-shrink-0">
                          {topic.completed && (
                            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Mastered (+25 XP)
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Expandable Topic Details (Requirement 4) */}
                      {isExpanded && (
                        <div className="p-4 sm:p-6 pt-0 border-t border-slate-700/50 space-y-5 text-xs sm:text-sm text-slate-300">
                          
                          {/* Why It Matters */}
                          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200">
                            <span className="font-bold text-indigo-300">Why It Matters in Interviews: </span>
                            {topic.whyItMatters}
                          </div>

                          {/* Beginner Explanation */}
                          <div className="space-y-1.5">
                            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                              Core Explanation:
                            </h4>
                            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                              {topic.explanation}
                            </p>
                          </div>

                          {/* Code Example (if available) */}
                          {topic.codeExample && (
                            <div className="space-y-1.5">
                              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                                <Code className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Code Pattern:</span>
                              </h4>
                              <pre className="p-4 rounded-xl bg-slate-950 text-indigo-200 font-mono text-xs overflow-x-auto border border-slate-800">
                                {topic.codeExample}
                              </pre>
                            </div>
                          )}

                          {/* Key Interview Questions */}
                          <div className="space-y-2">
                            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                              Frequent Interview Questions:
                            </h4>
                            <ul className="space-y-1.5">
                              {topic.keyInterviewQuestions.map((iq, idx) => (
                                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                                  <span className="text-indigo-400 font-bold">•</span>
                                  <span>{iq}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Mini Challenge */}
                          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-1">
                            <span className="font-bold text-emerald-300">⚡ Mini Challenge: </span>
                            <span className="text-slate-200">{topic.miniChallenge}</span>
                          </div>

                          {/* Interactive Mini Quiz */}
                          {topic.quizQuestion && (
                            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-3">
                              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>Quick Topic Check:</span>
                              </div>
                              <p className="text-xs font-medium text-slate-200">
                                {topic.quizQuestion.question}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                {topic.quizQuestion.options.map((opt, oIdx) => {
                                  const isSelected = selectedQuizOpt === oIdx;
                                  const isCorrect = oIdx === topic.quizQuestion.correctIndex;
                                  let optClass = 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600';

                                  if (isChecked) {
                                    if (isCorrect) optClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                                    else if (isSelected) optClass = 'bg-rose-950/40 border-rose-500 text-rose-200';
                                  }

                                  return (
                                    <button
                                      key={oIdx}
                                      type="button"
                                      onClick={() => handleQuizSelect(topic.id, oIdx)}
                                      className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${optClass}`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {isChecked && (
                                <p className="text-[11px] text-slate-400 pt-1">
                                  <span className="font-bold text-slate-300">Explanation: </span>
                                  {topic.quizQuestion.explanation}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Completion Action */}
                          <div className="pt-2 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => toggleRoadmapTopic(topic.id)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                                topic.completed
                                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{topic.completed ? 'Mark as Incomplete' : 'Mark Topic as Mastered (+25 XP)'}</span>
                            </button>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
