import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Building,
  Check
} from 'lucide-react';
import { JobOpportunity, UserProfile } from '../types';
import { addTask, upsertApplication } from '../services/storage';

interface OpportunitiesViewProps {
  jobs: JobOpportunity[];
  profile: UserProfile;
  onNavigate: (tab: any) => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  jobs,
  profile,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [filledJobId, setFilledJobId] = useState<string | null>(null);
  const [appliedJobId, setAppliedJobId] = useState<string | null>(null);

  const filteredJobs = jobs.filter((job) => {
    if (filterType !== 'All' && job.type !== filterType) return false;
    if (remoteOnly && !job.isRemote) return false;
    return true;
  });

  const handleFillSkillGap = (job: JobOpportunity) => {
    // Add micro tasks to study plan for each missing skill
    job.missingSkills.forEach((skill, idx) => {
      addTask({
        title: `Fast-Track ${skill} for ${job.company}`,
        durationMinutes: 30,
        category: skill,
        priority: 'High',
        day: idx === 0 ? 'Monday' : 'Tuesday',
        completed: false,
        skipped: false,
        whyRecommended: `Required by ${job.title} at ${job.company}. Filling this gap elevates your profile to a 95%+ match.`,
      });
    });

    setFilledJobId(job.id);
    setTimeout(() => setFilledJobId(null), 3000);
  };

  const handleTrackApplication = (job: JobOpportunity) => {
    upsertApplication({
      id: `app-${Date.now()}`,
      company: job.company,
      role: job.title,
      applyDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      ctcOrStipend: job.stipendOrSalary,
      notes: `Applied via Placement Portal. Target deadline: ${job.deadline}`,
      nextFollowUp: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    });

    setAppliedJobId(job.id);
    setTimeout(() => setAppliedJobId(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Opportunities & Matchmaker
            </span>
            <span className="text-xs text-slate-400">Curated Placement & Internship Pool</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Internships & Jobs For You
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            AI-matched against your skills and projects. See exactly why you match, detect missing requirements, and generate a 3-day micro study plan to qualify.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Internship', 'Full-Time'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 text-xs font-medium text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="accent-indigo-500 rounded"
            />
            <span>Remote / Hybrid Only</span>
          </label>
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-5">
        {filteredJobs.map((job) => {
          const isClose = job.matchPercentage >= 75;
          const hasMissingSkills = job.missingSkills.length > 0;

          return (
            <div
              key={job.id}
              className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-5 shadow-sm"
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-indigo-400">{job.company}</span>
                    <span className="text-slate-500">•</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {job.type}
                    </span>
                    {job.isRemote && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Remote
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.stipendOrSalary}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Deadline: {job.deadline}</span>
                    </span>
                  </div>
                </div>

                {/* Match Percentage Pill */}
                <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-right self-start">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Skill Match</span>
                  <span className={`text-xl font-black ${job.matchPercentage >= 85 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                    {job.matchPercentage}%
                  </span>
                </div>
              </div>

              {/* Requirement 19: Skill Gap → Opportunity Connection */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">Why this job matches you:</span>
                  {isClose && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>You are very close to this opportunity!</span>
                    </span>
                  )}
                </div>

                {/* Skills Matched vs Missing */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {job.matchedSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium"
                    >
                      ✓ {sk}
                    </span>
                  ))}

                  {job.missingSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-medium flex items-center space-x-1"
                    >
                      <AlertCircle className="w-3 h-3 text-rose-400" />
                      <span>{sk} (Gap)</span>
                    </span>
                  ))}
                </div>

                {/* 1-Click Gap Closer Action */}
                {hasMissingSkills && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-700/50">
                    <p className="text-[11px] text-slate-400">
                      Missing: <strong className="text-rose-300">{job.missingSkills.join(', ')}</strong>. A quick 3-day targeted sprint will qualify your application.
                    </p>
                    <button
                      onClick={() => handleFillSkillGap(job)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        filledJobId === job.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600/30 text-indigo-200 hover:bg-indigo-600 hover:text-white border border-indigo-500/40'
                      }`}
                    >
                      {filledJobId === job.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added Sprint to Study Plan!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Generate 3-Day Plan to Fill Gap</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400">
                  Eligibility: <strong className="text-slate-300">{job.eligibility}</strong>
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTrackApplication(job)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      appliedJobId === job.id
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {appliedJobId === job.id ? '✓ Tracked in Applications' : '+ Track in My Applications'}
                  </button>

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all"
                  >
                    <span>Apply on Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
