import React, { useState } from 'react';
import {
  Settings,
  Bell,
  User,
  Shield,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';
import { UserProfile, ReminderItem } from '../types';
import {
  saveStoredProfile,
  resetToDemo,
  saveStoredReminders,
} from '../services/storage';

interface SettingsViewProps {
  profile: UserProfile;
  reminders: ReminderItem[];
  onOpenOnboarding: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  reminders,
  onOpenOnboarding,
}) => {
  const [name, setName] = useState(profile.name);
  const [college, setCollege] = useState(profile.college);
  const [targetRole, setTargetRole] = useState(profile.targetRole);
  const [localReminders, setLocalReminders] = useState(reminders);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      name,
      college,
      targetRole,
    };
    saveStoredProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const toggleReminder = (id: string) => {
    const updated = localReminders.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    setLocalReminders(updated);
    saveStoredReminders(updated);
  };

  const handleExportJSON = () => {
    const state = {
      profile,
      reminders: localReminders,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learn_and_enjoy_backup_${profile.name.replace(/\s+/g, '_')}.json`;
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
              System Settings
            </span>
            <span className="text-xs text-slate-400">Configuration & Data Portability</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Settings & Smart Reminders
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Manage your personal profile, notification triggers, streak tokens, and local data persistence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Profile Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <User className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Student Information</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">College / University</label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Primary Target Role</label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="text-xs text-indigo-400 hover:underline cursor-pointer"
              >
                Re-run Full Onboarding Wizard
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                {isSaved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
                <span>{isSaved ? 'Saved!' : 'Update Profile'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Smart Reminders (Requirement 16) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Smart Reminders</h3>
          </div>

          <div className="space-y-3">
            {localReminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">{rem.title}</span>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{rem.time}</span>
                    </span>
                    <span>• {rem.frequency}</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rem.enabled}
                    onChange={() => toggleReminder(rem.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Demo Reset & Data Management (Requirement 30 & 34) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base">Data Storage & Demo State</h3>
        <p className="text-xs text-slate-400">
          All progress is safely persisted in your browser's LocalStorage. You can reset to the preloaded sample student (Alex Chen, ML Engineer, 62%) or export a JSON backup at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => {
              if (confirm('Reset profile, tasks, roadmap, and jobs back to Alex Chen demo defaults?')) {
                resetToDemo();
                window.location.reload();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Reset to Alex Chen Demo Data</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Progress JSON Backup</span>
          </button>
        </div>
      </div>

    </div>
  );
};
