import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Github,
  Chrome,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { getStoredProfile, saveStoredProfile } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (profile: UserProfile) => void;
}

const DEMO_STUDENTS = [
  {
    name: 'Alex Chen',
    email: 'alex.chen@campus.edu',
    college: 'National Institute of Tech',
    targetRole: 'Full Stack Developer',
    degree: 'B.Tech Computer Science',
    year: '4th Year (Senior)',
    readiness: 68
  },
  {
    name: 'Priya Nair',
    email: 'priya.nair@campus.edu',
    college: 'Indian Institute of Tech',
    targetRole: 'AI / Machine Learning Engineer',
    degree: 'B.Tech AI & Data Science',
    year: '4th Year (Senior)',
    readiness: 76
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.vance@campus.edu',
    college: 'University Institute of Tech',
    targetRole: 'Cloud & DevOps Engineer',
    degree: 'B.Tech Information Tech',
    year: '3rd Year (Junior)',
    readiness: 62
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign in state
  const [email, setEmail] = useState('alex.chen@campus.edu');
  const [password, setPassword] = useState('Placement@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [degree, setDegree] = useState('B.Tech Computer Science');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both your student email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const current = getStoredProfile();
      const updated: UserProfile = {
        ...current,
        name: current.name || 'Alex Chen',
        isOnboarded: true,
        isLoggedIn: true,
        email: email
      };
      saveStoredProfile(updated);

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

      if (onSuccess) onSuccess(updated);
      setSuccessMsg('Welcome back! Signed in successfully.');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 900);
    }, 600);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName || !email || !password || !collegeName) {
      setErrorMsg('Please fill in your name, college, email, and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const current = getStoredProfile();
      const updated: UserProfile = {
        ...current,
        name: fullName,
        college: collegeName,
        targetRole: targetRole,
        degree: degree,
        isOnboarded: true,
        isLoggedIn: true,
        email: email
      };
      saveStoredProfile(updated);

      try {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      if (onSuccess) onSuccess(updated);
      setSuccessMsg('Account created! Welcome to Placement Copilot.');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 900);
    }, 700);
  };

  const handleQuickDemoSelect = (demo: typeof DEMO_STUDENTS[0]) => {
    setEmail(demo.email);
    setPassword('Campus@2026!');
    const current = getStoredProfile();
    const updated: UserProfile = {
      ...current,
      name: demo.name,
      college: demo.college,
      targetRole: demo.targetRole,
      degree: demo.degree,
      year: demo.year,
      isOnboarded: true,
      isLoggedIn: true,
      email: demo.email,
      overallReadiness: demo.readiness
    };
    saveStoredProfile(updated);
    if (onSuccess) onSuccess(updated);

    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}

    setSuccessMsg(`Switched to ${demo.name} profile!`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Top Header & Close Button */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              ⚡
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">
                {mode === 'signin' ? 'Welcome Back' : 'Create Student Account'}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'signin'
                  ? 'Access your personalized placement roadmaps and mock interviews'
                  : 'Start your adaptive placement preparation journey'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex p-1 rounded-2xl bg-slate-950 border border-slate-800 relative z-10">
          <button
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status / Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Container */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4 relative z-10">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Campus Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <a href="#reset" onClick={(e) => { e.preventDefault(); setErrorMsg('Password reset link sent to registered email.'); }} className="text-[11px] text-indigo-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded accent-indigo-500"
                />
                <span>Remember on this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Placement Copilot'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-3.5 relative z-10 max-h-[55vh] overflow-y-auto pr-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">College / University</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. National Institute of Technology"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Target Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option>Software Developer</option>
                  <option>Full Stack Developer</option>
                  <option>Data Scientist</option>
                  <option>Machine Learning Engineer</option>
                  <option>Cloud / DevOps</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Degree</label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option>B.Tech Computer Science</option>
                  <option>B.Tech Information Tech</option>
                  <option>B.Tech AI / Data Science</option>
                  <option>MCA / M.Tech</option>
                  <option>B.Sc / BCA</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Campus Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? 'Creating Student Profile...' : 'Complete Registration & Start Preparing'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Quick Demo Switcher Section */}
        <div className="pt-2 border-t border-slate-800 relative z-10 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Instant One-Click Demo Profiles:</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {DEMO_STUDENTS.map((demo) => (
              <button
                key={demo.name}
                type="button"
                onClick={() => handleQuickDemoSelect(demo)}
                className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 text-left transition-all cursor-pointer group"
              >
                <span className="font-bold text-xs text-slate-200 group-hover:text-indigo-300 block truncate">
                  {demo.name}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">{demo.targetRole.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
