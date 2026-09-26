export interface UserProfile {
  name: string;
  college: string;
  degree: string;
  branch: string;
  year: string;
  graduationYear: string;
  targetRole: string;
  roleSuitability?: Array<{ role: string; score: number; matchReason: string }>;
  overallReadiness: number;
  skillReadiness: {
    technical: number;
    coding: number;
    aptitude: number;
    communication: number;
    interview: number;
    project: number;
    resume: number;
    roleSpecific: number;
  };
  streak: {
    currentDays: number;
    bestDays: number;
    lastActiveDate: string;
    restDaysLeft: number;
    codingStreak: number;
    interviewStreak: number;
    quizStreak: number;
  };
  xp: number;
  level: number;
  studyPreferences: {
    hoursPerDay: number;
    availableDays: string[];
    preferredTime: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
    placementDeadline: string;
    workload: 'Light' | 'Moderate' | 'Heavy';
  };
  isOnboarded: boolean;
  isLoggedIn?: boolean;
  email?: string;
}

export interface SkillDetail {
  id: string;
  name: string;
  category: 'core_cs' | 'programming' | 'role_specific' | 'soft_skills' | 'aptitude';
  currentLevel: number; // 0-100%
  targetLevel: number; // 0-100%
  gap: number;
  priority: 'High' | 'Medium' | 'Low';
  recommendation: string;
  whyItMatters: string;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  duration: string;
  whyItMatters: string;
  explanation: string;
  codeExample?: string;
  keyInterviewQuestions: string[];
  miniChallenge: string;
  quizQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  completed: boolean;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  duration: string;
  topics: RoadmapTopic[];
}

export interface StudyTask {
  id: string;
  title: string;
  durationMinutes: number;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  completed: boolean;
  skipped: boolean;
  whyRecommended: string;
}

export interface ProjectAnalysis {
  strengthScore: number;
  technicalDepth: number;
  innovation: number;
  realWorldRelevance: number;
  resumeValue: number;
  interviewReadiness: number;
  missingFeatures: string[];
  improvements: string[];
  interviewerQA: Array<{ question: string; answer: string }>;
  pitch30s: string;
  pitch1m: string;
  pitch3mStar: string;
  technicalPitch: string;
}

export interface Project {
  id: string;
  name: string;
  techStack: string;
  description: string;
  problemSolved: string;
  features: string;
  contribution: string;
  githubUrl: string;
  liveUrl?: string;
  analysis?: ProjectAnalysis;
}

export interface ResumeReport {
  text: string;
  atsScore: number;
  quantifiableScore: number;
  roleAlignmentScore: number;
  detectedSkills: string[];
  missingKeywords: string[];
  bulletImprovements: Array<{ original: string; improved: string; reason: string }>;
  generalTips: string[];
}

export interface InterviewExchange {
  id: string;
  question: string;
  studentAnswer: string;
  feedback?: {
    score: number;
    wellDone: string[];
    improvements: string[];
    fillerWords: number;
    betterAnswer: string;
    followUp: string;
  };
}

export interface InterviewSession {
  id: string;
  date: string;
  category: 'HR' | 'Technical' | 'Behavioral' | 'Role-specific';
  personality: 'Friendly Mentor' | 'HR Specialist' | 'Senior Tech Lead' | 'Strict Bar Raiser' | 'Startup Founder';
  exchanges: InterviewExchange[];
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  type: 'Internship' | 'Full-Time';
  location: string;
  isRemote: boolean;
  stipendOrSalary: string;
  requiredSkills: string[];
  eligibility: string;
  deadline: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  applyUrl: string;
  roleDomain: string;
}

export interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  applyDate: string;
  status: 'Interested' | 'Preparing' | 'Applied' | 'Assessment' | 'Interview' | 'Selected' | 'Rejected';
  ctcOrStipend: string;
  notes: string;
  nextFollowUp: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string;
  frequency: 'Daily' | 'Weekly' | 'Custom';
  enabled: boolean;
  category: 'study' | 'interview' | 'challenge' | 'application';
}

export interface DailyChallenge {
  id: string;
  title: string;
  category: 'DSA' | 'SQL' | 'ML' | 'HR' | 'System Design';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  problemPrompt: string;
  options?: string[];
  correctIndex?: number;
  expectedKeywords?: string[];
  xp: number;
  completed: boolean;
  hint: string;
  explanation: string;
}

export interface StudyFriend {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  college: string;
  targetRole: string;
  streakDays: number;
  xp: number;
  readiness: number;
  currentActivity: string;
  status: 'Studying' | 'In Mock Interview' | 'Solving DSA' | 'Offline';
  lastActive: string;
}

export interface StudyRoomMessage {
  id: string;
  senderName: string;
  avatar: string;
  text: string;
  time: string;
  type: 'chat' | 'celebration' | 'milestone';
}

export interface PeerDuelQuestion {
  id: string;
  round: number;
  topic: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

