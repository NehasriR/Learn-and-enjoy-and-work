/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  SkillDetail,
  RoadmapPhase,
  StudyTask,
  Project,
  JobOpportunity,
  ApplicationItem,
  DailyChallenge,
  ReminderItem,
} from './types';
import {
  getStoredProfile,
  getStoredSkills,
  getStoredRoadmap,
  getStoredTasks,
  getStoredProjects,
  getStoredJobs,
  getStoredApplications,
  getStoredDailyChallenge,
  getStoredReminders,
} from './services/storage';

import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { RoadmapView } from './components/RoadmapView';
import { StudyPlanView } from './components/StudyPlanView';
import { DiagnosticsView } from './components/DiagnosticsView';
import { GamesHubView } from './components/GamesHubView';
import { InterviewArenaView } from './components/InterviewArenaView';
import { FriendsLearningView } from './components/FriendsLearningView';
import { CommunicationLabView } from './components/CommunicationLabView';
import { ProjectAnalyzerView } from './components/ProjectAnalyzerView';
import { ResumeAnalyzerView } from './components/ResumeAnalyzerView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { ApplicationTrackerView } from './components/ApplicationTrackerView';
import { ConfusionCenterView } from './components/ConfusionCenterView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';

import { OnboardingModal } from './components/OnboardingModal';
import { AICoachModal } from './components/AICoachModal';
import { BreakReminderModal } from './components/BreakReminderModal';
import { AuthModal } from './components/AuthModal';
import { CheatSheetView } from './components/CheatSheetView';
import { Bot, Sparkles } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  const [skills, setSkills] = useState<SkillDetail[]>(getStoredSkills());
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>(getStoredRoadmap());
  const [tasks, setTasks] = useState<StudyTask[]>(getStoredTasks());
  const [projects, setProjects] = useState<Project[]>(getStoredProjects());
  const [jobs, setJobs] = useState<JobOpportunity[]>(getStoredJobs());
  const [applications, setApplications] = useState<ApplicationItem[]>(getStoredApplications());
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>(getStoredDailyChallenge());
  const [reminders, setReminders] = useState<ReminderItem[]>(getStoredReminders());

  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!profile.isOnboarded);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isBreakOpen, setIsBreakOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Sync state when storage changes
  useEffect(() => {
    const handleStorageUpdate = () => {
      setProfile(getStoredProfile());
      setSkills(getStoredSkills());
      setRoadmap(getStoredRoadmap());
      setTasks(getStoredTasks());
      setProjects(getStoredProjects());
      setJobs(getStoredJobs());
      setApplications(getStoredApplications());
      setDailyChallenge(getStoredDailyChallenge());
      setReminders(getStoredReminders());
    };

    window.addEventListener('lew-data-updated', handleStorageUpdate);
    return () => window.removeEventListener('lew-data-updated', handleStorageUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        profile={profile}
        onOpenCoach={() => setIsCoachOpen(true)}
        onOpenBreak={() => setIsBreakOpen(true)}
        onOpenProfile={() => setCurrentTab('settings')}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCheatSheet={() => setCurrentTab('cheatsheet')}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto">
        
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          targetRole={profile.targetRole}
          readinessPercentage={profile.overallReadiness}
        />

        {/* Primary Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              profile={profile}
              skills={skills}
              tasks={tasks}
              dailyChallenge={dailyChallenge}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenCoach={() => setIsCoachOpen(true)}
            />
          )}

          {currentTab === 'cheatsheet' && <CheatSheetView />}

          {currentTab === 'roadmap' && (
            <RoadmapView roadmap={roadmap} targetRole={profile.targetRole} />
          )}

          {currentTab === 'study_plan' && (
            <StudyPlanView profile={profile} tasks={tasks} />
          )}

          {currentTab === 'diagnostics' && (
            <DiagnosticsView
              profile={profile}
              skills={skills}
              onRetakeQuiz={() => setIsOnboardingOpen(true)}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'games' && <GamesHubView />}

          {currentTab === 'interview' && (
            <InterviewArenaView targetRole={profile.targetRole} />
          )}

          {currentTab === 'friends' && (
            <FriendsLearningView profile={profile} />
          )}

          {currentTab === 'communication' && <CommunicationLabView />}

          {currentTab === 'projects' && (
            <ProjectAnalyzerView projects={projects} targetRole={profile.targetRole} />
          )}

          {currentTab === 'resume' && (
            <ResumeAnalyzerView targetRole={profile.targetRole} />
          )}

          {currentTab === 'opportunities' && (
            <OpportunitiesView
              jobs={jobs}
              profile={profile}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'applications' && (
            <ApplicationTrackerView applications={applications} />
          )}

          {currentTab === 'confusion' && <ConfusionCenterView profile={profile} />}

          {currentTab === 'analytics' && (
            <AnalyticsView profile={profile} skills={skills} />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              profile={profile}
              reminders={reminders}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Floating AI Coach Button (Available across all screens) */}
      <button
        onClick={() => setIsCoachOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer group"
        title="Ask Placement Copilot"
      >
        <Bot className="w-5 h-5 text-white" />
        <span className="font-bold text-xs hidden sm:inline">Ask Copilot</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
      </button>

      {/* Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={() => setIsOnboardingOpen(false)}
        currentProfile={profile}
      />

      <AICoachModal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        profile={profile}
      />

      <BreakReminderModal
        isOpen={isBreakOpen}
        onClose={() => setIsBreakOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(updated) => setProfile(updated)}
      />

    </div>
  );
}
