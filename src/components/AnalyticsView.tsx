import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import { UserProfile, SkillDetail } from '../types';

interface AnalyticsViewProps {
  profile: UserProfile;
  skills: SkillDetail[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ profile, skills }) => {
  const downloadReport = () => {
    const reportText = `=====================================================
LEARN, ENJOY & WORK - AI PLACEMENT COPILOT REPORT
Student: ${profile.name}
College: ${profile.college} (${profile.degree} - ${profile.branch})
Graduation Year: ${profile.graduationYear}
Target Role: ${profile.targetRole}
Overall Placement Readiness: ${profile.overallReadiness}%
Current Streak: ${profile.streak.currentDays} Days | XP: ${profile.xp} (Level ${profile.level})
Date Generated: ${new Date().toLocaleDateString()}
=====================================================

SKILLS STATUS & BENCHMARKS:
${skills.map((s) => `- ${s.name}: ${s.currentLevel}% (Target: ${s.targetLevel}%, Gap: ${s.gap}%, Priority: ${s.priority})`).join('\n')}

MULTI-DIMENSIONAL READINESS:
- Technical Fundamentals: ${profile.skillReadiness.technical}%
- Coding / DSA: ${profile.skillReadiness.coding}%
- Quantitative Aptitude: ${profile.skillReadiness.aptitude}%
- Verbal Communication: ${profile.skillReadiness.communication}%
- Mock Interview Confidence: ${profile.skillReadiness.interview}%
- Project Architectural Depth: ${profile.skillReadiness.project}%
- Resume ATS Optimization: ${profile.skillReadiness.resume}%

TIMELINE PROJECTION:
- Current Baseline: ${profile.overallReadiness}%
- In 30 Days: ~${Math.min(95, profile.overallReadiness + 14)}%
- In 60 Days: ~${Math.min(98, profile.overallReadiness + 26)}% (Placement Ready)

KEY RECOMMENDATION:
"Consistent small daily progress creates massive confidence on interview day."
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Placement_Report_${profile.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Velocity & Analytics
            </span>
            <span className="text-xs text-slate-400">Weekly Performance Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Progress Analytics & Readiness Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Track weekly study velocity, problem-solving accuracy, and projected readiness timeline toward placement drives.
          </p>
        </div>

        <button
          onClick={downloadReport}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center space-x-2 self-start md:self-center transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Placement Report</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 flex items-center space-x-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Weekly Study Time</span>
          </span>
          <p className="text-2xl font-black text-white">14.5 hrs</p>
          <p className="text-[11px] text-emerald-400 font-semibold">+2.1 hrs vs last week</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 flex items-center space-x-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Quiz Accuracy</span>
          </span>
          <p className="text-2xl font-black text-emerald-400">84%</p>
          <p className="text-[11px] text-emerald-400 font-semibold">+12% in SQL & DSA</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 flex items-center space-x-1.5 font-medium">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Active Streak</span>
          </span>
          <p className="text-2xl font-black text-orange-400">{profile.streak.currentDays} Days</p>
          <p className="text-[11px] text-slate-400">Best: {profile.streak.bestDays} days</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 flex items-center space-x-1.5 font-medium">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Mocks Taken</span>
          </span>
          <p className="text-2xl font-black text-purple-400">6 Sessions</p>
          <p className="text-[11px] text-purple-300 font-semibold">Avg Score: 7.6/10</p>
        </div>
      </div>

      {/* Requirement 38: Placement Readiness Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-sm">
        <h3 className="font-bold text-white text-base">Placement Readiness Timeline Projection</h3>
        <p className="text-xs text-slate-400">
          Estimated trajectory based on maintaining your 2.5 hours/day study schedule:
        </p>

        <div className="relative pt-4 pb-2">
          {/* Timeline Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-2 rounded-full transition-all duration-700"
              style={{ width: `${profile.overallReadiness}%` }}
            />
          </div>

          {/* Timeline Milestones */}
          <div className="grid grid-cols-4 gap-2 pt-6 text-center text-xs">
            <div className="space-y-1">
              <span className="w-3 h-3 rounded-full bg-indigo-500 mx-auto block" />
              <p className="font-bold text-white">Baseline</p>
              <p className="text-[11px] text-indigo-400 font-semibold">45%</p>
              <p className="text-[10px] text-slate-500">Day 1</p>
            </div>

            <div className="space-y-1">
              <span className="w-3 h-3 rounded-full bg-indigo-400 mx-auto block animate-pulse" />
              <p className="font-bold text-white">Current</p>
              <p className="text-[11px] text-indigo-300 font-bold">{profile.overallReadiness}%</p>
              <p className="text-[10px] text-slate-400">Today</p>
            </div>

            <div className="space-y-1">
              <span className="w-3 h-3 rounded-full bg-purple-400 mx-auto block" />
              <p className="font-bold text-white">In 30 Days</p>
              <p className="text-[11px] text-purple-300 font-semibold">~78%</p>
              <p className="text-[10px] text-slate-400">Core CS Locked</p>
            </div>

            <div className="space-y-1">
              <span className="w-3 h-3 rounded-full bg-emerald-400 mx-auto block" />
              <p className="font-bold text-emerald-300 font-semibold">In 60 Days</p>
              <p className="text-[11px] text-emerald-400 font-bold">~90%+</p>
              <p className="text-[10px] text-emerald-400/80">Placement Ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Heatmap / Bar simulation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base">Weekly Study Velocity</h3>

        <div className="grid grid-cols-7 gap-3 text-center text-xs pt-4">
          {[
            { day: 'Mon', mins: 120, pct: '80%' },
            { day: 'Tue', mins: 140, pct: '95%' },
            { day: 'Wed', mins: 90, pct: '60%' },
            { day: 'Thu', mins: 150, pct: '100%' },
            { day: 'Fri', mins: 110, pct: '75%' },
            { day: 'Sat', mins: 180, pct: '120%' },
            { day: 'Sun', mins: 45, pct: '30%' },
          ].map((bar) => (
            <div key={bar.day} className="flex flex-col items-center space-y-2">
              <div className="w-full bg-slate-800 rounded-xl h-28 flex items-end p-1 justify-center">
                <div
                  className="w-full rounded-lg bg-indigo-500 hover:bg-indigo-400 transition-all"
                  style={{ height: bar.pct }}
                  title={`${bar.mins} minutes studied`}
                />
              </div>
              <span className="font-bold text-slate-300 text-xs">{bar.day}</span>
              <span className="text-[10px] text-slate-400">{bar.mins}m</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
