import React, { useState, useEffect } from 'react';
import {
  Flame,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Video,
  Users,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  SlidersHorizontal,
  Swords,
  Sparkles,
  Zap,
  FolderGit2,
  Gamepad2,
  FileText,
  Volume2,
  ShieldCheck,
  Award,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  LayoutGrid,
  Code,
  Layers,
  Building,
  Target
} from 'lucide-react';
import { UserProfile, SkillDetail, StudyTask, DailyChallenge, StudyFriend } from '../types';
import { toggleTask, completeDailyChallenge, addXp, recordActivityStreak } from '../services/storage';
import { initialFriends } from '../data/friendsData';

import { LiveTickerBlock } from './InteractiveBlocks/LiveTickerBlock';
import { RadarMatrixBlock } from './InteractiveBlocks/RadarMatrixBlock';
import { AlgorithmVisualizerBlock } from './InteractiveBlocks/AlgorithmVisualizerBlock';
import { SystemDesignSandboxBlock } from './InteractiveBlocks/SystemDesignSandboxBlock';
import { CompanyMatcherBlock } from './InteractiveBlocks/CompanyMatcherBlock';

interface DashboardProps {
  profile: UserProfile;
  skills: SkillDetail[];
  tasks: StudyTask[];
  dailyChallenge: DailyChallenge;
  onNavigate: (tab: any) => void;
  onOpenCoach: () => void;
}

export type BlockId =
  | 'ticker'
  | 'metrics'
  | 'focus_chamber'
  | 'algo_engine'
  | 'system_design'
  | 'radar_matrix'
  | 'company_matcher'
  | 'virtual_interview'
  | 'friends_circle'
  | 'daily_tasks'
  | 'career_tiles';

export interface BlockConfig {
  id: BlockId;
  title: string;
  enabled: boolean;
  category: 'core' | 'engineering' | 'interview' | 'social';
}

const DEFAULT_BLOCKS: BlockConfig[] = [
  { id: 'ticker', title: 'Live Placement & Peer Activity Ticker', enabled: true, category: 'core' },
  { id: 'metrics', title: 'Placement Key Metrics', enabled: true, category: 'core' },
  { id: 'focus_chamber', title: 'Self-Paced Focus Chamber', enabled: true, category: 'core' },
  { id: 'virtual_interview', title: 'AI Virtual Interview Chamber', enabled: true, category: 'interview' },
  { id: 'radar_matrix', title: 'Neural Readiness Radar Polygon', enabled: true, category: 'interview' },
  { id: 'algo_engine', title: 'Interactive Algorithm & Pointer Engine', enabled: true, category: 'engineering' },
  { id: 'system_design', title: 'System Architecture Sandbox', enabled: true, category: 'engineering' },
  { id: 'company_matcher', title: 'Tier-1 Company Calibrator', enabled: true, category: 'interview' },
  { id: 'friends_circle', title: 'Friends in Learning Study Circle', enabled: true, category: 'social' },
  { id: 'daily_tasks', title: "Today's Tasks & Diagnostic Question", enabled: true, category: 'core' },
  { id: 'career_tiles', title: 'Career Acceleration Tiles', enabled: true, category: 'core' },
];

const PRESET_DURATIONS = [
  { label: '15m', mins: 15, tag: 'Sprint' },
  { label: '25m', mins: 25, tag: 'Pomodoro' },
  { label: '45m', mins: 45, tag: 'Deep Work' },
  { label: '60m', mins: 60, tag: 'Power Hour' },
  { label: '90m', mins: 90, tag: 'Mock Exam' },
];

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  skills,
  tasks,
  dailyChallenge,
  onNavigate,
  onOpenCoach,
}) => {
  // Modular Moving Blocks Order & Visibility State
  const [blocks, setBlocks] = useState<BlockConfig[]>(() => {
    try {
      const saved = localStorage.getItem('lew_dashboard_blocks_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_BLOCKS;
  });

  const [filterMode, setFilterMode] = useState<'all' | 'engineering' | 'interview'>('all');
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Focus Timer Self-Paced State
  const [focusMinutes, setFocusMinutes] = useState<number>(25);
  const [focusSecondsLeft, setFocusSecondsLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [focusSubject, setFocusSubject] = useState<string>('Data Structures & Algorithms');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  // Daily Challenge State
  const [selectedChallengeOption, setSelectedChallengeOption] = useState<number | null>(null);
  const [challengeDone, setChallengeDone] = useState(dailyChallenge.completed);

  // Study Friends state & Nudge toast
  const [friendsList, setFriendsList] = useState<StudyFriend[]>(initialFriends.slice(0, 4));
  const [nudgedFriendId, setNudgedFriendId] = useState<string | null>(null);

  // Save blocks to storage on change
  useEffect(() => {
    try {
      localStorage.setItem('lew_dashboard_blocks_v2', JSON.stringify(blocks));
    } catch (e) {}
  }, [blocks]);

  // Countdown timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && focusSecondsLeft > 0) {
      interval = setInterval(() => {
        setFocusSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (focusSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      addXp(50);
      recordActivityStreak('coding');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, focusSecondsLeft]);

  // Move block up in sequence
  const moveBlockUp = (index: number) => {
    if (index === 0) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setBlocks(updated);
  };

  // Move block down in sequence
  const moveBlockDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setBlocks(updated);
  };

  const toggleBlockVisibility = (id: BlockId) => {
    setBlocks(
      blocks.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
  };

  const handleResetBlocks = () => {
    setBlocks(DEFAULT_BLOCKS);
    setFilterMode('all');
  };

  const handleSelectPreset = (mins: number) => {
    setFocusMinutes(mins);
    setFocusSecondsLeft(mins * 60);
    setIsTimerRunning(false);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setFocusMinutes(val);
    setFocusSecondsLeft(val * 60);
    setIsTimerRunning(false);
  };

  const toggleFocusTimer = () => {
    if (!isTimerRunning && focusSecondsLeft === 0) {
      setFocusSecondsLeft(focusMinutes * 60);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetFocusTimer = () => {
    setIsTimerRunning(false);
    setFocusSecondsLeft(focusMinutes * 60);
  };

  const formatTimer = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNudgeFriend = (friend: StudyFriend) => {
    setNudgedFriendId(friend.id);
    setTimeout(() => setNudgedFriendId(null), 2500);
  };

  const handleChallengeSubmit = () => {
    if (selectedChallengeOption === null) return;
    setChallengeDone(true);
    if (selectedChallengeOption === dailyChallenge.correctIndex) {
      completeDailyChallenge();
    }
  };

  const todaysTasks = tasks.slice(0, 3);
  const completedCount = todaysTasks.filter((t) => t.completed).length;

  const sortedGap = [...skills].sort((a, b) => b.gap - a.gap);
  const topGap = sortedGap[0] || { name: 'DSA', gap: 32 };

  // Zen Mode Overlay
  if (isZenMode) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-8 sm:p-14 text-slate-100 font-sans">
        <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold uppercase tracking-wider text-indigo-400">Zen Focus Chamber</span>
            <span>·</span>
            <span>{focusSubject}</span>
          </div>
          <button
            onClick={() => setIsZenMode(false)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
          >
            Exit Zen Mode
          </button>
        </div>

        <div className="text-center space-y-6 my-auto max-w-xl mx-auto">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {focusSubject}
          </p>
          <div className="text-8xl sm:text-9xl font-mono font-black text-white tracking-tight">
            {formatTimer(focusSecondsLeft)}
          </div>
          <div className="flex items-center justify-center space-x-4 pt-4">
            <button
              onClick={toggleFocusTimer}
              className={`px-8 py-3.5 rounded-2xl text-sm font-bold shadow-xl transition-all flex items-center space-x-2 cursor-pointer ${
                isTimerRunning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isTimerRunning ? 'Pause Session' : 'Start Focus'}</span>
            </button>
            <button
              onClick={resetFocusTimer}
              className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Tip: Quiet study environment increases retention by up to 40%.
        </div>
      </div>
    );
  }

  // Filter blocks according to selected filterMode
  const visibleBlocks = blocks.filter((b) => {
    if (!b.enabled) return false;
    if (filterMode === 'all') return true;
    if (filterMode === 'engineering') return b.category === 'engineering' || b.category === 'core';
    if (filterMode === 'interview') return b.category === 'interview' || b.category === 'core';
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      
      {/* Top Moving Marquee Feed */}
      <LiveTickerBlock />

      {/* Executive Clean Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <span>{profile.college}</span>
            <span>·</span>
            <span className="text-indigo-400 font-semibold">{profile.targetRole}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1 flex items-center space-x-2">
            <span>Engineering Command Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold font-mono">
              Live Modular
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Placement readiness index: <strong className="text-white">{profile.overallReadiness}%</strong>. All moving modules active and calibrated.
          </p>
        </div>

        {/* Dynamic Mode Switcher & Block Customizer */}
        <div className="flex items-center space-x-2 self-start md:self-center">
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filterMode === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Blocks
            </button>
            <button
              onClick={() => setFilterMode('engineering')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filterMode === 'engineering' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Engineering Lab
            </button>
            <button
              onClick={() => setFilterMode('interview')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filterMode === 'interview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Interview Sprint
            </button>
          </div>

          <button
            onClick={() => setShowConfigModal(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Rearrange & Customize Moving Blocks"
          >
            <LayoutGrid className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </div>

      {/* RENDER MODULAR MOVING BLOCKS IN SEQUENCE */}
      <div className="space-y-6">
        {visibleBlocks.map((block, index) => {
          const isFirst = index === 0;
          const isLast = index === visibleBlocks.length - 1;

          // Header action buttons for moving blocks up/down
          const BlockActionControls = (
            <div className="flex items-center space-x-1 opacity-70 hover:opacity-100 transition-opacity">
              <button
                disabled={isFirst}
                onClick={() => moveBlockUp(index)}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                title="Move Block Up"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={isLast}
                onClick={() => moveBlockDown(index)}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                title="Move Block Down"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          );

          // Render corresponding block based on id
          switch (block.id) {
            case 'metrics':
              return (
                <div key={block.id} className="relative group">
                  <div className="absolute top-2 right-2 z-10 hidden group-hover:flex">
                    {BlockActionControls}
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400 font-medium">Placement Readiness</span>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-white">{profile.overallReadiness}%</span>
                        <span className="text-xs text-emerald-400 font-semibold">+8%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${profile.overallReadiness}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400 font-medium">Active Streak</span>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-white">{profile.streak.currentDays}d</span>
                        <span className="text-xs text-orange-400 flex items-center space-x-0.5 font-medium">
                          <Flame className="w-3.5 h-3.5 fill-orange-500" />
                          <span>Streak</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 pt-1">
                        {profile.streak.restDaysLeft} freeze token(s) safe
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400 font-medium">Highest Priority Gap</span>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-bold text-white truncate">{topGap.name}</span>
                        <span className="text-xs text-rose-400 font-medium">-{topGap.gap}%</span>
                      </div>
                      <p className="text-[11px] text-slate-500 pt-1">
                        Target benchmark: 80%
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-xs text-slate-400 font-medium">Experience & Level</span>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-white">{profile.xp}</span>
                        <span className="text-xs text-indigo-400 font-semibold">Lvl {profile.level}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 pt-1">
                        Next unlock at {profile.level * 400} XP
                      </p>
                    </div>
                  </div>
                </div>
              );

            case 'focus_chamber':
              return (
                <div key={block.id} className="relative group">
                  <div className="absolute top-4 right-4 z-10 hidden group-hover:flex">
                    {BlockActionControls}
                  </div>
                  <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-white flex items-center space-x-2">
                            <span>Self-Paced Focus Chamber</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                              Set Your Own Time
                            </span>
                          </h2>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Set your custom time, eliminate distractions, and earn +50 XP upon session completion.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsZenMode(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Zen Fullscreen</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center space-y-3 text-center">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          {focusSubject}
                        </span>
                        <div className="text-5xl sm:text-6xl font-mono font-black text-white tracking-tight">
                          {formatTimer(focusSecondsLeft)}
                        </div>

                        <div className="flex items-center space-x-3 pt-1">
                          <button
                            onClick={toggleFocusTimer}
                            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                              isTimerRunning
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                            }`}
                          >
                            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            <span>{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
                          </button>

                          <button
                            onClick={resetFocusTimer}
                            className="p-2 rounded-xl bg-slate-855 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                            title="Reset Timer"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-7 space-y-4">
                        <div className="space-y-1.5">
                          <span className="text-xs font-semibold text-slate-300">Quick Presets:</span>
                          <div className="grid grid-cols-5 gap-2">
                            {PRESET_DURATIONS.map((preset) => {
                              const active = focusMinutes === preset.mins;
                              return (
                                <button
                                  key={preset.mins}
                                  onClick={() => handleSelectPreset(preset.mins)}
                                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                                    active
                                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                                      : 'bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  <span className="font-bold text-xs block">{preset.label}</span>
                                  <span className="text-[10px] text-slate-400 block truncate">{preset.tag}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Custom Time by Yourself:</span>
                            </span>
                            <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                              {focusMinutes} minutes
                            </span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="120"
                            step="5"
                            value={focusMinutes}
                            onChange={handleSliderChange}
                            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>5m</span>
                            <span>30m</span>
                            <span>60m</span>
                            <span>90m</span>
                            <span>120m</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-slate-400">Subject:</span>
                          <select
                            value={focusSubject}
                            onChange={(e) => setFocusSubject(e.target.value)}
                            className="px-2.5 py-1 rounded-lg bg-slate-850 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            <option value="Data Structures & Algorithms">DSA Practice</option>
                            <option value="System Design & Concurrency">System Design</option>
                            <option value="SQL & DBMS Optimization">SQL & Databases</option>
                            <option value="Virtual Interview Prep">Mock Interview Prep</option>
                            <option value="Core OS & Networks">Operating Systems</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );

            case 'radar_matrix':
              return (
                <div key={block.id} className="relative group">
                  <div className="absolute top-4 right-4 z-10 hidden group-hover:flex">
                    {BlockActionControls}
                  </div>
                  <RadarMatrixBlock />
                </div>
              );

            case 'algo_engine':
              return (
                <div key={block.id} className="relative group">
                  <div className="absolute top-4 right-4 z-10 hidden group-hover:flex">
                    {BlockActionControls}
                  </div>
                  <AlgorithmVisualizerBlock />
                </div>
              );

            case 'system_design':
              return (
                <div key={block.id} className="relative group">
                  <div className="absolute top-4 right-4 z-10 hidden group-hover:flex">
                    {BlockActionControls}
                  </div>
                  <SystemDesignSandboxBlock />
                </div>
              );

            case 'company_matcher':
              return (
                <div key={block.id} className="relative group">
                  <div className="absolute top-4 right-4 z-10 hidden group-hover:flex">
                    {BlockActionControls}
                  </div>
                  <CompanyMatcherBlock
                    studentReadiness={profile.overallReadiness}
                    onLaunchInterview={() => onNavigate('interview')}
                  />
                </div>
              );

            case 'virtual_interview':
              return (
                <div key={block.id} className="relative group">
                  <div className="absolute top-4 right-4 z-10 hidden group-hover:flex">
                    {BlockActionControls}
                  </div>
                  <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400">
                        <Video className="w-4 h-4" />
                        <span className="uppercase tracking-wider">Virtual Interaction Arena</span>
                      </div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live Voice & Video Ready</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-8 space-y-2">
                        <h3 className="text-xl font-bold text-white">Full-Fidelity AI Video Interview Chamber</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Conduct realistic mock interviews with Dr. Evelyn Vance, Marcus Sterling, or Priya Sharma. Features automated voice questions, real-time speech transcription, optional webcam mirror, and instant STAR scoring with follow-ups.
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
                            Dr. Evelyn Vance (Nexus Systems)
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
                            Marcus Sterling (Enterprise Arch)
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
                            Priya Sharma (HR & Culture)
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-4 flex flex-col space-y-2">
                        <button
                          onClick={() => onNavigate('interview')}
                          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <Video className="w-4 h-4" />
                          <span>Launch Virtual Interview</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );

            case 'friends_circle':
              return (
                <div key={block.id} className="relative group">
                  <div className="absolute top-4 right-4 z-10 hidden group-hover:flex">
                    {BlockActionControls}
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                        <Users className="w-4 h-4" />
                        <span className="uppercase tracking-wider">Friends in Learning Study Circle</span>
                      </div>
                      <button
                        onClick={() => onNavigate('friends')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                      >
                        Open Full Study Hub →
                      </button>
                    </div>

                    <p className="text-xs text-slate-400">
                      Co-work together in quiet synchronized rooms, send daily streak nudges, and engage in 3-minute technical duels.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                      {friendsList.map((friend) => (
                        <div
                          key={friend.id}
                          className="p-3 rounded-2xl bg-slate-850/80 border border-slate-800 flex flex-col justify-between space-y-2"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-xl bg-slate-750 text-indigo-400 font-bold flex items-center justify-center text-xs">
                              {friend.avatar}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-xs text-slate-200 truncate">{friend.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{friend.targetRole}</p>
                            </div>
                          </div>

                          <p className="text-[10px] text-slate-400 line-clamp-1 italic">
                            "{friend.currentActivity}"
                          </p>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
                            <span className="text-orange-400 font-mono flex items-center space-x-0.5">
                              <Flame className="w-3 h-3 fill-orange-500" />
                              <span>{friend.streakDays}d streak</span>
                            </span>
                            <button
                              onClick={() => handleNudgeFriend(friend)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                                nudgedFriendId === friend.id
                                  ? 'bg-orange-500/20 text-orange-300'
                                  : 'bg-slate-750 hover:bg-slate-700 text-slate-300'
                              }`}
                            >
                              {nudgedFriendId === friend.id ? 'Nudged! 🔥' : 'Nudge'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => onNavigate('friends')}
                        className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Swords className="w-3.5 h-3.5 text-amber-400" />
                        <span>Start 1v1 Skill Duel</span>
                      </button>
                      <button
                        onClick={() => onNavigate('friends')}
                        className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
                      >
                        <span>Join Silent Study Room</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );

            case 'daily_tasks':
              return (
                <div key={block.id} className="relative group">
                  <div className="absolute top-4 right-4 z-10 hidden group-hover:flex">
                    {BlockActionControls}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div>
                          <h2 className="text-base font-bold text-white">Today's Focus Tasks</h2>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {completedCount} of {todaysTasks.length} tasks completed
                          </p>
                        </div>
                        <button
                          onClick={() => onNavigate('study_plan')}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                        >
                          Full Study Plan →
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {todaysTasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              task.completed
                                ? 'bg-slate-950/40 border-emerald-500/30'
                                : 'bg-slate-850 hover:bg-slate-800 border-slate-800'
                            }`}
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <button
                                type="button"
                                className="text-slate-500 hover:text-emerald-400 transition-colors flex-shrink-0"
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-600" />
                                )}
                              </button>
                              <div className="min-w-0">
                                <p
                                  className={`text-sm font-semibold truncate ${
                                    task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                                  }`}
                                >
                                  {task.title}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                  {task.whyRecommended}
                                </p>
                              </div>
                            </div>

                            <span className="text-xs text-slate-400 flex items-center space-x-1 flex-shrink-0 bg-slate-800 px-2 py-1 rounded-lg">
                              <Clock className="w-3 h-3" />
                              <span>{task.durationMinutes}m</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div>
                          <h2 className="text-base font-bold text-white">Daily Diagnostic Question</h2>
                          <p className="text-xs text-slate-400 mt-0.5">{dailyChallenge.category}</p>
                        </div>
                        <span className="text-xs font-bold text-amber-400">+{dailyChallenge.xp} XP</span>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {dailyChallenge.problemPrompt}
                      </p>

                      {dailyChallenge.options && !challengeDone && (
                        <div className="space-y-1.5 pt-1">
                          {dailyChallenge.options.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedChallengeOption(idx)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                                selectedChallengeOption === idx
                                  ? 'bg-indigo-600/30 border-indigo-500 text-white'
                                  : 'bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {!challengeDone ? (
                        <button
                          disabled={selectedChallengeOption === null}
                          onClick={handleChallengeSubmit}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/30"
                        >
                          Submit & Verify
                        </button>
                      ) : (
                        <p className="text-xs text-emerald-400 font-semibold flex items-center space-x-1.5 py-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Correctly completed! +{dailyChallenge.xp} XP added</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );

            case 'career_tiles':
              return (
                <div key={block.id} className="relative group">
                  <div className="absolute top-2 right-2 z-10 hidden group-hover:flex">
                    {BlockActionControls}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div
                      onClick={() => onNavigate('interview')}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                        <Video className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-white">Virtual Interview</h3>
                      <p className="text-xs text-slate-400">Live technical & HR video simulation.</p>
                    </div>

                    <div
                      onClick={() => onNavigate('projects')}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                        <FolderGit2 className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-white">Project Analyzer</h3>
                      <p className="text-xs text-slate-400">30s, 1m, and 3m elevator pitches.</p>
                    </div>

                    <div
                      onClick={() => onNavigate('games')}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                        <Gamepad2 className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-white">Learning Games</h3>
                      <p className="text-xs text-slate-400">8 interactive gamified coding modules.</p>
                    </div>

                    <div
                      onClick={() => onNavigate('resume')}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-white">Resume ATS Audit</h3>
                      <p className="text-xs text-slate-400">Google XYZ formula bullet points.</p>
                    </div>
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* BLOCK CUSTOMIZER & REORDER MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <LayoutGrid className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-white text-base">Customize Moving Blocks</h3>
                  <p className="text-xs text-slate-400">Toggle visibility and reorder dashboard widgets</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Done
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {blocks.map((block, idx) => (
                <div
                  key={block.id}
                  className="p-3 rounded-2xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleBlockVisibility(block.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        block.enabled ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 bg-slate-800'
                      }`}
                    >
                      {block.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <div>
                      <p className={`font-semibold ${block.enabled ? 'text-white' : 'text-slate-500'}`}>
                        {block.title}
                      </p>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{block.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveBlockUp(idx)}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={idx === blocks.length - 1}
                      onClick={() => moveBlockDown(idx)}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={handleResetBlocks}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default Layout</span>
              </button>

              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/30"
              >
                Save Layout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
