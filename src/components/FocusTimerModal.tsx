import React, { useState } from 'react';
import {
  Clock,
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Flame,
  Volume2
} from 'lucide-react';
import { addXp, recordActivityStreak } from '../services/storage';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyMinutes: number;
  secondsLeft: number;
  timerActive: boolean;
  onUpdateDuration: (minutes: number) => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  targetRole: string;
}

const PRESET_DURATIONS = [
  { label: '15 min', mins: 15, tag: 'Quick Sprint' },
  { label: '25 min', mins: 25, tag: 'Classic Pomodoro' },
  { label: '45 min', mins: 45, tag: 'Deep Work' },
  { label: '50 min', mins: 50, tag: 'Standard Lecture' },
  { label: '60 min', mins: 60, tag: 'Full Hour Sprint' },
  { label: '90 min', mins: 90, tag: 'Mock Assessment' },
];

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  studyMinutes,
  secondsLeft,
  timerActive,
  onUpdateDuration,
  onToggleTimer,
  onResetTimer,
  targetRole,
}) => {
  const [customInput, setCustomInput] = useState<number>(studyMinutes);
  const [focusSubject, setFocusSubject] = useState('Data Structures & Algorithms');
  const [isZenMode, setIsZenMode] = useState(false);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleApplyPreset = (mins: number) => {
    onUpdateDuration(mins);
    setCustomInput(mins);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput > 0 && customInput <= 360) {
      onUpdateDuration(customInput);
    }
  };

  // Full Screen Zen Focus Mode
  if (isZenMode) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-8 sm:p-12 text-slate-100 font-sans selection:bg-indigo-500">
        <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="font-semibold uppercase tracking-wider text-indigo-400">Zen Focus Chamber</span>
            <span aria-hidden="true">·</span>
            <span>{targetRole}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsZenMode(false)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center space-x-1.5 text-xs font-semibold"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Exit Zen Mode</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Huge Centered Clock */}
        <div className="text-center space-y-6 my-auto max-w-xl mx-auto">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
            {focusSubject}
          </p>

          <div className="text-7xl sm:text-9xl font-mono font-black tracking-tight text-white select-none">
            {formatTime(secondsLeft)}
          </div>

          <div className="flex items-center justify-center space-x-4 pt-4">
            <button
              onClick={onToggleTimer}
              className={`px-8 py-3.5 rounded-2xl text-sm font-bold shadow-xl transition-all flex items-center space-x-2 cursor-pointer ${
                timerActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {timerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{timerActive ? 'Pause Session' : 'Resume Focus'}</span>
            </button>

            <button
              onClick={onResetTimer}
              className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Tip: Put your phone on silent. Zero distractions create maximum retention.
        </div>
      </div>
    );
  }

  // Standard Modal dialog
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Custom Focus Timer</h3>
              <p className="text-[11px] text-slate-400">Set your preferred deep study duration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Timer Display in Modal */}
        <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 text-center space-y-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Time Remaining
          </span>
          <div className="text-5xl font-mono font-black text-white tracking-tight">
            {formatTime(secondsLeft)}
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={onToggleTimer}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                timerActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{timerActive ? 'Pause' : 'Start Focus'}</span>
            </button>

            <button
              onClick={onResetTimer}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsZenMode(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-slate-700 transition-colors cursor-pointer"
              title="Full-Screen Zen Focus Mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 block">
            Quick Duration Presets:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_DURATIONS.map((preset) => {
              const isSelected = studyMinutes === preset.mins;
              return (
                <button
                  key={preset.mins}
                  type="button"
                  onClick={() => handleApplyPreset(preset.mins)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold text-xs block">{preset.label}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{preset.tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Exact Minute Input */}
        <form onSubmit={handleApplyCustom} className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Set Exact Duration (1 to 180 Minutes):
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={1}
              max={180}
              value={customInput}
              onChange={(e) => setCustomInput(Number(e.target.value))}
              className="flex-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. 35"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Apply Time
            </button>
          </div>
        </form>

        {/* Focus Subject */}
        <div className="text-xs space-y-1">
          <label className="font-semibold text-slate-300 block">Focus Topic Tag:</label>
          <input
            type="text"
            value={focusSubject}
            onChange={(e) => setFocusSubject(e.target.value)}
            placeholder="e.g. Dynamic Programming, SQL Aggregations..."
            className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
