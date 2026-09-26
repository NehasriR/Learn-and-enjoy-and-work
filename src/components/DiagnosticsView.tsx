import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  RotateCcw,
  Zap,
  BarChart,
  Brain,
  Filter
} from 'lucide-react';
import { UserProfile, SkillDetail } from '../types';
import { addTask } from '../services/storage';

interface DiagnosticsViewProps {
  profile: UserProfile;
  skills: SkillDetail[];
  onRetakeQuiz: () => void;
  onNavigate: (tab: any) => void;
}

export const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({
  profile,
  skills,
  onRetakeQuiz,
  onNavigate,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [addedTaskId, setAddedTaskId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Skills' },
    { id: 'core_cs', label: 'Core CS (OS, DBMS, DSA)' },
    { id: 'programming', label: 'Programming & Langs' },
    { id: 'role_specific', label: 'Role Specific (ML/AI/Web)' },
    { id: 'soft_skills', label: 'Communication & Mock Interview' },
    { id: 'aptitude', label: 'Aptitude & Logic' },
  ];

  const filteredSkills = skills.filter((s) => {
    if (filterCategory === 'all') return true;
    return s.category === filterCategory;
  });

  const handleAddSkillToPlan = (skill: SkillDetail) => {
    addTask({
      title: `Practice ${skill.name} fundamentals`,
      durationMinutes: 30,
      category: skill.name,
      priority: skill.priority,
      day: 'Monday',
      completed: false,
      skipped: false,
      whyRecommended: `Added from Skill Diagnostics to close the ${skill.gap}% gap toward target placement readiness.`,
    });
    setAddedTaskId(skill.id);
    setTimeout(() => setAddedTaskId(null), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <span>Diagnostic Audit</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-400">{profile.targetRole}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Where You Stand: Skill Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Verified competence benchmarks vs production hiring standards for {profile.targetRole}.
          </p>
        </div>

        <button
          onClick={onRetakeQuiz}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 self-start md:self-center transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Retake Diagnostic Assessment</span>
        </button>
      </div>

      {/* High Level Readiness Multi-Dimension Grid (Requirement 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
        {[
          { label: 'Technical', val: profile.skillReadiness.technical, color: 'text-indigo-400' },
          { label: 'Coding / DSA', val: profile.skillReadiness.coding, color: 'text-blue-400' },
          { label: 'Aptitude', val: profile.skillReadiness.aptitude, color: 'text-emerald-400' },
          { label: 'Communication', val: profile.skillReadiness.communication, color: 'text-amber-400' },
          { label: 'Mock Interview', val: profile.skillReadiness.interview, color: 'text-purple-400' },
          { label: 'Project Depth', val: profile.skillReadiness.project, color: 'text-rose-400' },
          { label: 'Resume ATS', val: profile.skillReadiness.resume, color: 'text-cyan-400' },
          { label: 'Role Specific', val: profile.skillReadiness.roleSpecific, color: 'text-teal-400' },
        ].map((dim) => (
          <div key={dim.label} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <span className="text-[11px] font-medium text-slate-400 block truncate">{dim.label}</span>
            <span className={`text-xl font-black ${dim.color} block mt-1`}>{dim.val}%</span>
            <div className="w-full bg-slate-800 rounded-full h-1 mt-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-1 rounded-full transition-all duration-700"
                style={{ width: `${dim.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
        <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterCategory === cat.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Detailed Skill Cards with Gaps and WHY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((skill) => {
          const isHighPriority = skill.priority === 'High';
          return (
            <div
              key={skill.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-sm"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">{skill.name}</h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 capitalize mt-0.5">
                    <span>{skill.category.replace('_', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-semibold ${
                        isHighPriority
                          ? 'text-rose-400'
                          : skill.priority === 'Medium'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {skill.priority} Priority
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bars & comparison */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current: <strong className="text-slate-100">{skill.currentLevel}%</strong></span>
                  <span className="text-indigo-300">Target Benchmark: <strong>{skill.targetLevel}%</strong></span>
                  <span className="text-rose-400 font-semibold">Gap: -{skill.gap}%</span>
                </div>

                <div className="relative w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  {/* Current progress */}
                  <div
                    className="absolute top-0 left-0 bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${skill.currentLevel}%` }}
                  />
                  {/* Target marker line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 shadow-sm"
                    style={{ left: `${skill.targetLevel}%` }}
                    title={`Target: ${skill.targetLevel}%`}
                  />
                </div>
              </div>

              {/* Recommendation & WHY explanation */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-200">Recommended Action: </span>
                  <span className="text-slate-300">{skill.recommendation}</span>
                </div>
                <div className="pt-2 border-t border-slate-700/40 text-[11px] text-slate-400">
                  <span className="font-semibold text-amber-300/90">Why It Matters: </span>
                  {skill.whyItMatters}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-1 flex items-center justify-between">
                <button
                  onClick={() => handleAddSkillToPlan(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    addedTaskId === skill.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30'
                  }`}
                >
                  {addedTaskId === skill.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Added to Plan!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Study Schedule</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onNavigate('roadmap')}
                  className="text-xs text-slate-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  View in Roadmap →
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
