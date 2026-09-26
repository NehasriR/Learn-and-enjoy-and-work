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
  InterviewSession,
} from '../types';
import {
  initialUserProfile,
  initialSkills,
  initialRoadmapPhases,
  initialStudyTasks,
  initialProjects,
  initialJobs,
  initialApplications,
  initialDailyChallenge,
  initialReminders,
} from '../data/demoData';

const STORAGE_KEYS = {
  USER_PROFILE: 'lew_user_profile',
  SKILLS: 'lew_skills',
  ROADMAP: 'lew_roadmap',
  STUDY_TASKS: 'lew_study_tasks',
  PROJECTS: 'lew_projects',
  JOBS: 'lew_jobs',
  APPLICATIONS: 'lew_applications',
  DAILY_CHALLENGE: 'lew_daily_challenge',
  REMINDERS: 'lew_reminders',
  INTERVIEWS: 'lew_interview_sessions',
};

// Event dispatcher for reactive updates
export const notifyDataChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('lew-data-updated'));
  }
};

// Profile
export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading profile', e);
  }
  return initialUserProfile;
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    notifyDataChanged();
  } catch (e) {
    console.error('Error saving profile', e);
  }
}

// Skills
export function getStoredSkills(): SkillDetail[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SKILLS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading skills', e);
  }
  return initialSkills;
}

export function saveStoredSkills(skills: SkillDetail[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
    // Recalculate overall readiness
    const avg = Math.round(skills.reduce((acc, s) => acc + s.currentLevel, 0) / (skills.length || 1));
    const profile = getStoredProfile();
    profile.overallReadiness = avg;
    saveStoredProfile(profile);
  } catch (e) {
    console.error('Error saving skills', e);
  }
}

// Roadmap
export function getStoredRoadmap(): RoadmapPhase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROADMAP);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading roadmap', e);
  }
  return initialRoadmapPhases;
}

export function saveStoredRoadmap(roadmap: RoadmapPhase[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmap));
    notifyDataChanged();
  } catch (e) {
    console.error('Error saving roadmap', e);
  }
}

export function toggleRoadmapTopic(topicId: string): void {
  const roadmap = getStoredRoadmap();
  let found = false;
  for (const phase of roadmap) {
    for (const t of phase.topics) {
      if (t.id === topicId) {
        t.completed = !t.completed;
        found = true;
        break;
      }
    }
    if (found) break;
  }
  saveStoredRoadmap(roadmap);
  if (found) {
    addXp(25);
  }
}

// Study Tasks
export function getStoredTasks(): StudyTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDY_TASKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading study tasks', e);
  }
  return initialStudyTasks;
}

export function saveStoredTasks(tasks: StudyTask[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDY_TASKS, JSON.stringify(tasks));
    notifyDataChanged();
  } catch (e) {
    console.error('Error saving tasks', e);
  }
}

export function toggleTask(taskId: string): void {
  const tasks = getStoredTasks();
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveStoredTasks(tasks);
    if (task.completed) {
      addXp(30);
      recordActivityStreak('study');
    }
  }
}

export function addTask(newTask: Omit<StudyTask, 'id'>): void {
  const tasks = getStoredTasks();
  const created: StudyTask = {
    ...newTask,
    id: `task-${Date.now()}`,
  };
  tasks.unshift(created);
  saveStoredTasks(tasks);
}

export function deleteTask(taskId: string): void {
  const tasks = getStoredTasks().filter((t) => t.id !== taskId);
  saveStoredTasks(tasks);
}

// Projects
export function getStoredProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading projects', e);
  }
  return initialProjects;
}

export function saveStoredProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    notifyDataChanged();
  } catch (e) {
    console.error('Error saving projects', e);
  }
}

export function upsertProject(project: Project): void {
  const projects = getStoredProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  saveStoredProjects(projects);
  addXp(50);
}

// Jobs & Internships
export function getStoredJobs(): JobOpportunity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading jobs', e);
  }
  return initialJobs;
}

export function saveStoredJobs(jobs: JobOpportunity[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    notifyDataChanged();
  } catch (e) {
    console.error('Error saving jobs', e);
  }
}

// Applications
export function getStoredApplications(): ApplicationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading applications', e);
  }
  return initialApplications;
}

export function saveStoredApplications(apps: ApplicationItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    notifyDataChanged();
  } catch (e) {
    console.error('Error saving applications', e);
  }
}

export function upsertApplication(appItem: ApplicationItem): void {
  const apps = getStoredApplications();
  const idx = apps.findIndex((a) => a.id === appItem.id);
  if (idx >= 0) {
    apps[idx] = appItem;
  } else {
    apps.unshift(appItem);
  }
  saveStoredApplications(apps);
}

export function deleteApplication(appId: string): void {
  const apps = getStoredApplications().filter((a) => a.id !== appId);
  saveStoredApplications(apps);
}

// Reminders
export function getStoredReminders(): ReminderItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading reminders', e);
  }
  return initialReminders;
}

export function saveStoredReminders(reminders: ReminderItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    notifyDataChanged();
  } catch (e) {
    console.error('Error saving reminders', e);
  }
}

// Daily Challenge
export function getStoredDailyChallenge(): DailyChallenge {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading daily challenge', e);
  }
  return initialDailyChallenge;
}

export function completeDailyChallenge(): void {
  const challenge = getStoredDailyChallenge();
  if (!challenge.completed) {
    challenge.completed = true;
    localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGE, JSON.stringify(challenge));
    addXp(challenge.xp);
    recordActivityStreak('challenge');
    notifyDataChanged();
  }
}

// Interview Sessions History
export function getStoredInterviews(): InterviewSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading interviews', e);
  }
  return [];
}

export function saveInterviewSession(session: InterviewSession): void {
  try {
    const sessions = getStoredInterviews();
    sessions.unshift(session);
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(sessions));
    addXp(45);
    recordActivityStreak('interview');
    notifyDataChanged();
  } catch (e) {
    console.error('Error saving interview', e);
  }
}

// XP & Streaks
export function addXp(amount: number): void {
  const profile = getStoredProfile();
  profile.xp += amount;
  profile.level = Math.floor(profile.xp / 400) + 1;
  saveStoredProfile(profile);
}

export function recordActivityStreak(category: 'study' | 'coding' | 'interview' | 'challenge'): void {
  const profile = getStoredProfile();
  const today = new Date().toISOString().split('T')[0];

  if (profile.streak.lastActiveDate !== today) {
    const lastActive = new Date(profile.streak.lastActiveDate);
    const curr = new Date(today);
    const diffDays = Math.round((curr.getTime() - lastActive.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      profile.streak.currentDays += 1;
      if (profile.streak.currentDays > profile.streak.bestDays) {
        profile.streak.bestDays = profile.streak.currentDays;
      }
    } else if (diffDays > 1) {
      if (profile.streak.restDaysLeft > 0) {
        profile.streak.restDaysLeft -= 1;
        // Streak preserved with rest day token!
      } else {
        profile.streak.currentDays = 1;
      }
    }
    profile.streak.lastActiveDate = today;
  }

  if (category === 'coding') profile.streak.codingStreak += 1;
  if (category === 'interview') profile.streak.interviewStreak += 1;
  if (category === 'challenge') profile.streak.quizStreak += 1;

  saveStoredProfile(profile);
}

// Reset & Demo
export function resetToDemo(): void {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(initialUserProfile));
  localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(initialSkills));
  localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(initialRoadmapPhases));
  localStorage.setItem(STORAGE_KEYS.STUDY_TASKS, JSON.stringify(initialStudyTasks));
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(initialJobs));
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(initialApplications));
  localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGE, JSON.stringify(initialDailyChallenge));
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(initialReminders));
  localStorage.removeItem(STORAGE_KEYS.INTERVIEWS);
  notifyDataChanged();
}
