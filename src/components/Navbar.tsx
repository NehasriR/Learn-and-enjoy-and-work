import React, { useState, useEffect } from 'react';
import {
  Flame,
  Zap,
  Clock,
  Heart,
  Bot,
  User,
  Coffee,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from '../types';
import { resetToDemo } from '../services/storage';
import { FocusTimerModal } from './FocusTimerModal';

interface NavbarProps {
  profile: UserProfile;
  onOpenCoach: () => void;
  onOpenBreak: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenCoach,
  onOpenBreak,
  onOpenProfile,
}) => {
  const [studyMinutes, setStudyMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('lew_focus_duration');
      if (saved) return Number(saved);
    } catch (e) {}
    return 25;
  });
  const [timerActive, setTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(studyMinutes * 60);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && timerActive) {
      setTimerActive(false);
      onOpenBreak();
    }
    return () => clearInterval(interval);
  }, [timerActive, secondsLeft, onOpenBreak]);

  const toggleTimer = () => {
    if (!timerActive && secondsLeft === 0) {
      setSecondsLeft(studyMinutes * 60);
    }
    setTimerActive(!timerActive);
  };

  const handleUpdateDuration = (mins: number) => {
    setStudyMinutes(mins);
    setSecondsLeft(mins * 60);
    setTimerActive(false);
    try {
      localStorage.setItem('lew_focus_duration', mins.toString());
    } catch (e) {}
  };

  const handleResetTimer = () => {
    setSecondsLeft(studyMinutes * 60);
    setTimerActive(false);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            ⚡
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white">
              Learn, Enjoy & Work
            </span>
            <span className="text-xs text-slate-400 block font-normal leading-none mt-0.5">
              Placement Copilot
            </span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Streak Indicator (Clean, unboxed) */}
          <div
            title={`Active streak: ${profile.streak.currentDays} days`}
            className="flex items-center space-x-1.5 text-xs text-orange-400 font-semibold"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>{profile.streak.currentDays}d</span>
          </div>

          {/* XP & Level */}
          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-300 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{profile.xp} XP</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Lvl {profile.level}</span>
          </div>

          {/* Focus Timer / Pomodoro Widget with Custom Duration Trigger */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs font-medium">
            <button
              onClick={() => setIsFocusModalOpen(true)}
              className="flex items-center space-x-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Click to set custom focus duration (presets or custom minutes)"
            >
              <Clock className={`w-3.5 h-3.5 ${timerActive ? 'text-indigo-400 animate-spin' : 'text-slate-400'}`} />
              <span className="font-mono text-slate-200">{formatTimer(secondsLeft)}</span>
              <SlidersHorizontal className="w-3 h-3 text-slate-400 hover:text-indigo-400" />
            </button>
            <button
              onClick={toggleTimer}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                timerActive
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {timerActive ? 'Pause' : 'Focus'}
            </button>
          </div>

          {/* Well-being / Break Reminder button */}
          <button
            onClick={onOpenBreak}
            title="Smart Break & Well-Being"
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5 text-xs cursor-pointer"
          >
            <Coffee className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Break</span>
          </button>

          {/* AI Coach Trigger */}
          <button
            onClick={onOpenCoach}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-all cursor-pointer shadow-sm"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Coach</span>
          </button>

          {/* Student Profile Quick View / Edit */}
          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-white text-xs font-bold">
              {profile.name ? profile.name[0] : 'S'}
            </div>
            <span className="hidden xl:inline text-xs font-semibold text-slate-200 truncate max-w-[90px]">
              {profile.name}
            </span>
          </button>

        </div>
      </div>

      {/* Focus Timer Setting Modal */}
      <FocusTimerModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        studyMinutes={studyMinutes}
        secondsLeft={secondsLeft}
        timerActive={timerActive}
        onUpdateDuration={handleUpdateDuration}
        onToggleTimer={toggleTimer}
        onResetTimer={handleResetTimer}
        targetRole={profile.targetRole}
      />
    </header>
  );
};
