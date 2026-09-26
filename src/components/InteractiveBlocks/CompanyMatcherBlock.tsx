import React, { useState } from 'react';
import {
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

interface CompanyProfile {
  id: string;
  name: string;
  badge: string;
  color: string;
  hiringBar: number;
  dsaWeight: number;
  sysDesignWeight: number;
  coreWeight: number;
  behavioralWeight: number;
  frequentTopics: string[];
  recentQuestion: string;
}

const COMPANIES: CompanyProfile[] = [
  {
    id: 'google',
    name: 'Google',
    badge: 'L3 Software Engineer',
    color: '#4285F4',
    hiringBar: 88,
    dsaWeight: 50,
    sysDesignWeight: 15,
    coreWeight: 20,
    behavioralWeight: 15,
    frequentTopics: ['Dynamic Programming', 'Graph BFS/DFS', 'Trie / Segment Trees'],
    recentQuestion: 'Given a stream of words, find the top K frequent elements within a sliding window of size W.'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    badge: 'SDE-1 (AWS / Retail)',
    color: '#FF9900',
    hiringBar: 82,
    dsaWeight: 40,
    sysDesignWeight: 20,
    coreWeight: 15,
    behavioralWeight: 25,
    frequentTopics: ['14 Leadership Principles', 'BFS / Dijkstra', 'LRU Cache Design'],
    recentQuestion: 'Design an inventory replenishment queue that handles concurrent fulfillment workers without race conditions.'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    badge: 'Software Engineer (Azure)',
    color: '#00A4EF',
    hiringBar: 80,
    dsaWeight: 45,
    sysDesignWeight: 15,
    coreWeight: 25,
    behavioralWeight: 15,
    frequentTopics: ['Binary Trees & BST', 'Strings & Parsing', 'Concurrency Primitives'],
    recentQuestion: 'Serialize and deserialize a binary tree with duplicate keys and evaluate subtree sums in O(1).'
  },
  {
    id: 'uber',
    name: 'Uber',
    badge: 'Software Engineer II',
    color: '#000000',
    hiringBar: 85,
    dsaWeight: 40,
    sysDesignWeight: 30,
    coreWeight: 15,
    behavioralWeight: 15,
    frequentTopics: ['Geohashing / QuadTrees', 'Distributed Rate Limiting', 'Heap / Priority Queue'],
    recentQuestion: 'Design a distributed geospatial matching engine that assigns riders to the nearest 5 available drivers.'
  }
];

interface CompanyMatcherProps {
  studentReadiness: number;
  onLaunchInterview: () => void;
}

export const CompanyMatcherBlock: React.FC<CompanyMatcherProps> = ({
  studentReadiness,
  onLaunchInterview
}) => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile>(COMPANIES[0]);

  // Compute live match score based on student readiness vs company hiring bar
  const matchDelta = Math.max(0, Math.min(100, Math.round(studentReadiness * (100 / selectedCompany.hiringBar))));

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <span>Company Readiness Matcher</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold font-mono">
                Hiring Bar Calibrator
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Calibrate your profile against specific Tier-1 company hiring expectations.
            </p>
          </div>
        </div>

        {/* Company Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {COMPANIES.map((comp) => {
            const isSelected = comp.id === selectedCompany.id;
            return (
              <button
                key={comp.id}
                onClick={() => setSelectedCompany(comp)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
                }`}
              >
                {comp.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split: Company Profile + Match Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Left Column: Match Overview (5 cols) */}
        <div className="md:col-span-5 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">{selectedCompany.name} Target:</span>
            <span className="text-xs font-bold text-indigo-400">{selectedCompany.badge}</span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-black text-white">{matchDelta}%</span>
            <span className="text-xs font-semibold text-slate-400">Match Readiness</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                matchDelta >= 80 ? 'bg-emerald-400' : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.min(100, matchDelta)}%` }}
            />
          </div>

          <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Hiring Bar: <strong className="text-slate-200">{selectedCompany.hiringBar}%</strong></span>
            <span>Your Score: <strong className="text-slate-200">{studentReadiness}%</strong></span>
          </div>
        </div>

        {/* Right Column: Round Distribution & Top Topics (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-300">Round Weight Distribution:</span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-850 border border-slate-800">
                <span className="block text-[10px] text-slate-400">DSA</span>
                <span className="font-mono font-bold text-indigo-400">{selectedCompany.dsaWeight}%</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-850 border border-slate-800">
                <span className="block text-[10px] text-slate-400">Design</span>
                <span className="font-mono font-bold text-purple-400">{selectedCompany.sysDesignWeight}%</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-850 border border-slate-800">
                <span className="block text-[10px] text-slate-400">Core CS</span>
                <span className="font-mono font-bold text-cyan-400">{selectedCompany.coreWeight}%</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-850 border border-slate-800">
                <span className="block text-[10px] text-slate-400">Behavioral</span>
                <span className="font-mono font-bold text-emerald-400">{selectedCompany.behavioralWeight}%</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center space-x-1.5 text-amber-300 font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Archetype Question Asked by {selectedCompany.name}:</span>
            </div>
            <p className="text-slate-300 italic text-[11px] leading-relaxed">
              "{selectedCompany.recentQuestion}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
              <span className="text-slate-500">Key Tags:</span>
              {selectedCompany.frequentTopics.slice(0, 2).map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {t}
                </span>
              ))}
            </div>

            <button
              onClick={onLaunchInterview}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-all shadow-sm"
            >
              <span>Simulate {selectedCompany.name} Mock</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
