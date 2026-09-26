import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  CalendarCheck,
  Target,
  Gamepad2,
  Mic,
  MessageSquare,
  FolderGit2,
  FileText,
  Briefcase,
  Layers,
  HelpCircle,
  BarChart3,
  Settings,
  Bot,
  Sparkles,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Video,
  Users,
  Menu,
  X
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'roadmap'
  | 'study_plan'
  | 'diagnostics'
  | 'games'
  | 'interview'
  | 'friends'
  | 'communication'
  | 'projects'
  | 'resume'
  | 'opportunities'
  | 'applications'
  | 'confusion'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  targetRole: string;
  readinessPercentage: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  targetRole,
  readinessPercentage,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navSections = [
    {
      group: 'Preparation',
      items: [
        { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'roadmap' as TabType, label: 'Roadmap', icon: Compass },
        { id: 'study_plan' as TabType, label: 'Daily Study Plan', icon: CalendarCheck },
        { id: 'diagnostics' as TabType, label: 'Where You Stand', icon: Target },
      ],
    },
    {
      group: 'Practice Arena',
      items: [
        { id: 'interview' as TabType, label: 'Virtual Interview', icon: Video, live: true },
        { id: 'friends' as TabType, label: 'Friends in Learning', icon: Users },
        { id: 'games' as TabType, label: 'Learning Games', icon: Gamepad2 },
        { id: 'communication' as TabType, label: 'Communication Lab', icon: Mic },
      ],
    },
    {
      group: 'Career Assets',
      items: [
        { id: 'projects' as TabType, label: 'Project Analyzer', icon: FolderGit2 },
        { id: 'resume' as TabType, label: 'Resume Analyzer', icon: FileText },
        { id: 'opportunities' as TabType, label: 'Internships & Jobs', icon: Briefcase },
        { id: 'applications' as TabType, label: 'Application Tracker', icon: Layers },
      ],
    },
    {
      group: 'Guidance',
      items: [
        { id: 'confusion' as TabType, label: "I'm Confused", icon: HelpCircle },
        { id: 'analytics' as TabType, label: 'Progress Analytics', icon: BarChart3 },
        { id: 'settings' as TabType, label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
      
      {/* Mobile Toggle Bar (< lg) */}
      <div className="lg:hidden p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900">
        <div className="flex items-center space-x-2 min-w-0">
          <span className="text-xs text-slate-400 font-medium">Viewing:</span>
          <span className="text-xs font-bold text-indigo-300 truncate capitalize">
            {currentTab.replace('_', ' ')}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
            {readinessPercentage}%
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
        >
          {isMobileOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          <span>{isMobileOpen ? 'Close Menu' : 'All Sections'}</span>
        </button>
      </div>

      {/* Student Role Header Pill (Desktop always, mobile when open) */}
      <div className={`${isMobileOpen ? 'block' : 'hidden lg:block'} p-4 border-b border-slate-800/80 bg-slate-900/50`}>
        <div className="p-3 rounded-xl bg-gradient-to-r from-slate-800 to-indigo-950/40 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>TARGET ROLE</span>
            <span className="font-semibold text-indigo-400">{readinessPercentage}% Ready</span>
          </div>
          <p className="font-bold text-sm text-slate-100 truncate">{targetRole}</p>
          <div className="w-full bg-slate-700/60 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, readinessPercentage))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className={`${isMobileOpen ? 'block' : 'hidden lg:block'} flex-1 overflow-y-auto p-3 space-y-6 text-sm`}>
        {navSections.map((section) => (
          <div key={section.group}>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              {section.group}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onSelectTab(item.id);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-xs font-semibold text-left cursor-pointer group ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {(item as any).live && (
                        <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Call</span>
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Helpful quote / Student principle */}
      <div className={`${isMobileOpen ? 'block' : 'hidden lg:block'} p-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-900/60`}>
        <div className="flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="italic text-[11px] leading-relaxed text-slate-300">
            "Small consistent daily progress creates massive confidence on interview day."
          </p>
        </div>
      </div>
    </aside>
  );
};
