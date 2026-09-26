import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
  Compass,
  Briefcase,
  GraduationCap,
  Award,
  HelpCircle,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, SkillDetail } from '../types';
import { diagnosticQuestions } from '../data/gamesAndQuestions';
import { saveStoredProfile, saveStoredSkills, addXp } from '../services/storage';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  currentProfile?: UserProfile;
}

const ROLES_LIST = [
  'Software Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'Machine Learning Engineer',
  'AI Engineer',
  'Cloud Engineer',
  'DevOps Engineer',
  'Cybersecurity Analyst',
  'UI/UX Designer & Frontend',
  'Product/Business Analyst',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  currentProfile,
}) => {
  const [step, setStep] = useState<1 | 2 | 2.5 | 3 | 4>(1);

  // Form State
  const [personal, setPersonal] = useState({
    name: currentProfile?.name || 'Alex Chen',
    college: currentProfile?.college || 'National Institute of Technology',
    degree: currentProfile?.degree || 'B.Tech',
    branch: currentProfile?.branch || 'Computer Science & Engineering',
    year: currentProfile?.year || '3rd Year (6th Sem)',
    graduationYear: currentProfile?.graduationYear || '2026',
  });

  const [selectedRole, setSelectedRole] = useState(currentProfile?.targetRole || 'Machine Learning Engineer');
  const [isUnsureRole, setIsUnsureRole] = useState(false);

  // Role quiz answers
  const [roleQuizAnswers, setRoleQuizAnswers] = useState({
    enjoyMath: 4, // 1 to 5
    enjoyUI: 2,
    enjoySystems: 4,
    enjoyBusiness: 3,
    codingComfort: 4,
  });

  // Diagnostic Quiz State
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<string, number>>({});
  const [currentDiagIndex, setCurrentDiagIndex] = useState(0);

  if (!isOpen) return null;

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personal.name || !personal.college) return;
    setStep(2);
  };

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
    setIsUnsureRole(false);
  };

  // Evaluate career quiz recommendation
  const getRoleRecommendation = () => {
    if (roleQuizAnswers.enjoyMath >= 4 && roleQuizAnswers.codingComfort >= 4) {
      return {
        role: 'Machine Learning Engineer',
        reason: 'High comfort in mathematics, algorithms, and technical scripting.',
      };
    }
    if (roleQuizAnswers.enjoyUI >= 4) {
      return {
        role: 'Full Stack Developer',
        reason: 'Strong interest in human-computer interaction, visual interfaces, and web systems.',
      };
    }
    if (roleQuizAnswers.enjoyBusiness >= 4) {
      return {
        role: 'Product/Business Analyst',
        reason: 'Strong problem framing, metrics reasoning, and stakeholder communication.',
      };
    }
    return {
      role: 'Software Developer',
      reason: 'Balanced problem-solving fundamentals, core CS, and software engineering.',
    };
  };

  const handleDiagSelect = (questionId: string, optionIdx: number) => {
    setDiagnosticAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleFinishOnboarding = () => {
    // Calculate diagnostic score
    let correctCount = 0;
    const diagSubset = diagnosticQuestions.slice(0, 5);
    diagSubset.forEach((q) => {
      if (diagnosticAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const baselineReadiness = Math.round(45 + (correctCount / diagSubset.length) * 35); // 45% - 80%

    const updatedProfile: UserProfile = {
      ...(currentProfile || {
        streak: {
          currentDays: 1,
          bestDays: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
          restDaysLeft: 2,
          codingStreak: 1,
          interviewStreak: 0,
          quizStreak: 1,
        },
        xp: 200,
        level: 1,
        studyPreferences: {
          hoursPerDay: 2,
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          preferredTime: 'Evening',
          placementDeadline: '2026-11-30',
          workload: 'Moderate',
        },
      }),
      name: personal.name,
      college: personal.college,
      degree: personal.degree,
      branch: personal.branch,
      year: personal.year,
      graduationYear: personal.graduationYear,
      targetRole: selectedRole,
      overallReadiness: baselineReadiness,
      isOnboarded: true,
      roleSuitability: [
        { role: selectedRole, score: baselineReadiness + 15, matchReason: 'Direct interest and diagnostic alignment.' },
        { role: 'Software Developer', score: baselineReadiness + 5, matchReason: 'Strong foundation in core data structures and OOP.' }
      ],
      skillReadiness: {
        technical: baselineReadiness + 4,
        coding: baselineReadiness - 2,
        aptitude: baselineReadiness + 8,
        communication: 65,
        interview: 55,
        project: 70,
        resume: 68,
        roleSpecific: baselineReadiness - 1,
      },
    };

    saveStoredProfile(updatedProfile);
    addXp(150);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1.5 transition-all duration-300"
            style={{
              width:
                step === 1 ? '25%' : step === 2 ? '50%' : step === 2.5 ? '65%' : step === 3 ? '85%' : '100%',
            }}
          />
        </div>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Step {step === 2.5 ? '2 (Role Assessment)' : step} of 4
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {step === 1 && 'Welcome! Tell Us About Yourself'}
              {step === 2 && 'What Role Are You Preparing For?'}
              {step === 2.5 && 'AI Role Suitability Assessment'}
              {step === 3 && 'Quick Diagnostic Skill Calibration'}
              {step === 4 && 'Your Personalized Copilot is Ready!'}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            ⚡
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          
          {/* STEP 1: PERSONAL DETAILS */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={personal.name}
                    onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Alex Chen"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">College / University</label>
                  <input
                    type="text"
                    required
                    value={personal.college}
                    onChange={(e) => setPersonal({ ...personal, college: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. National Institute of Tech"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Degree</label>
                  <select
                    value={personal.degree}
                    onChange={(e) => setPersonal({ ...personal, degree: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option>B.Tech / B.E.</option>
                    <option>BCA / MCA</option>
                    <option>B.Sc / M.Sc Computer Science</option>
                    <option>M.Tech</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Branch / Specialization</label>
                  <input
                    type="text"
                    value={personal.branch}
                    onChange={(e) => setPersonal({ ...personal, branch: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Computer Science & Eng"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Year</label>
                  <select
                    value={personal.year}
                    onChange={(e) => setPersonal({ ...personal, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option>2nd Year</option>
                    <option>3rd Year (Pre-final)</option>
                    <option>4th Year (Final Year)</option>
                    <option>Recent Graduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={personal.graduationYear}
                    onChange={(e) => setPersonal({ ...personal, graduationYear: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="2026"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: TARGET ROLE */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-400">
                Select your primary goal role. The AI will tailor your roadmap, interview questions, and project analysis specifically for this track.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ROLES_LIST.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelection(role)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      selectedRole === role && !isUnsureRole
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <span>{role}</span>
                    {selectedRole === role && !isUnsureRole && (
                      <Check className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* "I'm not sure which role to choose" Option */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2.5)}
                  className="w-full p-4 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>I'm not sure which role to choose → Conduct Short AI Role Assessment</span>
                </button>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Next: Skill Calibration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2.5: AI ROLE SUITABILITY ASSESSMENT */}
          {step === 2.5 && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-indigo-300">AI Role Finder: </span>
                Rate your comfort and preferences (1 = Low, 5 = Love it!). We will calculate your best career path.
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>How much do you enjoy Mathematics & Statistics?</span>
                    <span className="font-bold text-indigo-400">{roleQuizAnswers.enjoyMath}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={roleQuizAnswers.enjoyMath}
                    onChange={(e) => setRoleQuizAnswers({ ...roleQuizAnswers, enjoyMath: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>How much do you enjoy Visual Design, UI, and User Experience?</span>
                    <span className="font-bold text-indigo-400">{roleQuizAnswers.enjoyUI}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={roleQuizAnswers.enjoyUI}
                    onChange={(e) => setRoleQuizAnswers({ ...roleQuizAnswers, enjoyUI: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>How interested are you in Operating Systems, Networks & Cloud Infrastructure?</span>
                    <span className="font-bold text-indigo-400">{roleQuizAnswers.enjoySystems}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={roleQuizAnswers.enjoySystems}
                    onChange={(e) => setRoleQuizAnswers({ ...roleQuizAnswers, enjoySystems: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>How comfortable are you writing complex algorithms and code?</span>
                    <span className="font-bold text-indigo-400">{roleQuizAnswers.codingComfort}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={roleQuizAnswers.codingComfort}
                    onChange={(e) => setRoleQuizAnswers({ ...roleQuizAnswers, codingComfort: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Recommendation Preview */}
              {(() => {
                const rec = getRoleRecommendation();
                return (
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-1">
                    <p className="font-bold text-emerald-300">Recommended Role Fit: {rec.role}</p>
                    <p className="text-slate-300">{rec.reason}</p>
                  </div>
                );
              })()}

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(getRoleRecommendation().role);
                    setStep(3);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Accept Recommendation & Calibrate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DIAGNOSTIC QUIZ */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Diagnostic Calibration (5 Quick Questions)</span>
                <span className="font-mono text-indigo-400">
                  Question {currentDiagIndex + 1} of 5
                </span>
              </div>

              {(() => {
                const q = diagnosticQuestions[currentDiagIndex];
                const selectedOption = diagnosticAnswers[q.id];
                return (
                  <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 uppercase">
                        {q.category}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleDiagSelect(q.id, idx)}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                            selectedOption === idx
                              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-100'
                              : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedOption === idx && <Check className="w-4 h-4 text-indigo-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  disabled={currentDiagIndex === 0}
                  onClick={() => setCurrentDiagIndex((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
                >
                  Previous Question
                </button>

                {currentDiagIndex < 4 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentDiagIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center space-x-1"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1 shadow-lg shadow-emerald-600/30"
                  >
                    <span>Generate My Readiness Report</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: CELEBRATION & COMPLETION */}
          {step === 4 && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold border border-emerald-500/30">
                🎉
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">Your Placement Profile is Configured!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  We have mapped out your initial readiness, personalized your preparation roadmap for{' '}
                  <span className="font-bold text-indigo-400">{selectedRole}</span>, and generated your adaptive study schedule for today.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Target Role:</span>
                  <span className="font-bold text-white">{selectedRole}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Initial Placement Readiness:</span>
                  <span className="font-bold text-indigo-400">~62% (Baseline Calibrated)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Streak Started:</span>
                  <span className="font-bold text-orange-400">🔥 Day 1 (+150 XP Bonus)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Launch My Placement Copilot Dashboard 🚀
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
