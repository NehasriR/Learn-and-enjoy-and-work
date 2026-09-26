import React, { useState } from 'react';
import {
  Flame,
  TrendingUp,
  Building,
  Trophy,
  Zap,
  Calendar,
  AlertCircle,
  Radio,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export interface TickerItem {
  id: string;
  type: 'drive' | 'peer' | 'contest' | 'insight';
  tag: string;
  title: string;
  detail: string;
  timeAgo: string;
  urgent?: boolean;
}

const TICKER_ITEMS: TickerItem[] = [
  {
    id: 't-1',
    type: 'drive',
    tag: 'CAMPUS DRIVE',
    title: 'Amazon SDE-1 OA',
    detail: 'Registration deadline in 48 hours · 2026 Batch eligible (CGPA > 7.0)',
    timeAgo: 'Closing Soon',
    urgent: true
  },
  {
    id: 't-2',
    type: 'peer',
    tag: 'PEER MILESTONE',
    title: 'Maya Patel (NIT)',
    detail: 'Solved LeetCode Hard (Trapping Rain Water) & reached 7-day streak',
    timeAgo: '2m ago'
  },
  {
    id: 't-3',
    type: 'drive',
    tag: 'OPENING',
    title: 'Microsoft Accelerate',
    detail: 'Internship & FTE applications live on career portal for Cloud & AI tracks',
    timeAgo: 'Just now'
  },
  {
    id: 't-4',
    type: 'contest',
    tag: 'LIVE MOCK CONTEST',
    title: 'Bi-Weekly Placement Sprint #14',
    detail: '3 DSA questions + 1 SQL query · Starts Saturday 8:00 PM IST',
    timeAgo: 'In 2 days'
  },
  {
    id: 't-5',
    type: 'peer',
    tag: 'STUDY CIRCLE',
    title: 'Vikram Patel',
    detail: 'Scored 9.4/10 in Virtual System Design Interview with Dr. Evelyn Vance',
    timeAgo: '8m ago'
  },
  {
    id: 't-6',
    type: 'insight',
    tag: 'HIRING INTEL',
    title: 'Top Pattern Alert',
    detail: '78% of Tier-1 placement rounds this season featured Binary Search on Answer',
    timeAgo: 'Updated Today'
  },
];

export const LiveTickerBlock: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TickerItem | null>(null);

  return (
    <div className="relative w-full rounded-2xl bg-slate-900/90 border border-slate-800/90 overflow-hidden shadow-md">
      
      {/* Moving Marquee Container */}
      <div className="flex items-center">
        
        {/* Fixed Left Header Badge */}
        <div className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-950 border-r border-slate-800 z-10 flex-shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-white tracking-wider uppercase">Live Stream</span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">|</span>
          <span className="text-[10px] text-indigo-400 font-mono hidden sm:inline">60 FPS Feed</span>
        </div>

        {/* Continuous Animated Ticker Track */}
        <div
          className="flex-1 overflow-hidden py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="animate-marquee flex items-center space-x-8"
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          >
            {/* Double the array for seamless infinite looping */}
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => setSelectedItem(item)}
                className="flex items-center space-x-2.5 text-xs whitespace-nowrap cursor-pointer hover:bg-slate-800/80 px-3 py-1 rounded-xl transition-colors border border-transparent hover:border-slate-700"
              >
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider ${
                    item.urgent
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : item.type === 'drive'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : item.type === 'contest'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {item.tag}
                </span>

                <span className="font-semibold text-slate-100">{item.title}</span>
                <span className="text-slate-400 hidden md:inline">· {item.detail}</span>
                <span className="text-[10px] text-slate-500 font-mono">({item.timeAgo})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal on Click for quick inspection */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {selectedItem.tag}
              </span>
              <span className="text-xs text-slate-400 font-mono">{selectedItem.timeAgo}</span>
            </div>

            <h3 className="text-lg font-bold text-white">{selectedItem.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedItem.detail}</p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
