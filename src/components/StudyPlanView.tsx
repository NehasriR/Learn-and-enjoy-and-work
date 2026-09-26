import React, { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Zap,
  Calendar,
  Play
} from 'lucide-react';
import { UserProfile, StudyTask } from '../types';
import { toggleTask, addTask, deleteTask, saveStoredProfile } from '../services/storage';
import { FocusTimerModal } from './FocusTimerModal';

interface StudyPlanViewProps {
  profile: UserProfile;
  tasks: StudyTask[];
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({ profile, tasks }) => {
  const [selectedDay, setSelectedDay] = useState<typeof DAYS_OF_WEEK[number]>('Monday');
  const [showConfig, setShowConfig] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Focus Timer Modal State
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(30);
  const [focusSecondsLeft, setFocusSecondsLeft] = useState(30 * 60);
  const [focusTimerActive, setFocusTimerActive] = useState(false);

  // New Task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(30);
  const [newTaskCategory, setNewTaskCategory] = useState('DSA');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Preferences form state
  const [hoursPerDay, setHoursPerDay] = useState(profile.studyPreferences.hoursPerDay || 2.5);
  const [workload, setWorkload] = useState(profile.studyPreferences.workload || 'Moderate');
  const [preferredTime, setPreferredTime] = useState(profile.studyPreferences.preferredTime || 'Evening');
  const [deadline, setDeadline] = useState(profile.studyPreferences.placementDeadline || '2026-11-15');

  const filteredTasks = tasks.filter((t) => t.day === selectedDay);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      studyPreferences: {
        ...profile.studyPreferences,
        hoursPerDay,
        workload,
        preferredTime,
        placementDeadline: deadline,
      },
    };
    saveStoredProfile(updated);
    setShowConfig(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      durationMinutes: newTaskDuration,
      category: newTaskCategory,
      priority: newTaskPriority,
      day: selectedDay,
      completed: false,
      skipped: false,
      whyRecommended: 'Custom student task added to personalized study plan.',
    });

    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <span>Adaptive Study Plan</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-400">{profile.studyPreferences.hoursPerDay}h/day goal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Daily Study Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Adaptive daily task schedule calibrated to your current skill gaps and placement deadline.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-center">
          <button
            onClick={() => {
              setFocusMinutes(30);
              setFocusSecondsLeft(30 * 60);
              setIsFocusModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Set custom focus timer"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Set Focus Timer</span>
          </button>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Customize Hours & Pace</span>
          </button>
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Personal Task</span>
          </button>
        </div>
      </div>

      {/* Adaptive AI Feedback Alert (Requirement 6) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/30 flex items-start space-x-3 text-xs">
        <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white text-sm">
            AI Adaptive Optimization Active
          </p>
          <p className="text-slate-300 leading-relaxed">
            Based on your recent diagnostic quiz results: We prioritized <strong className="text-indigo-300">DSA Two-Pointers</strong> and <strong className="text-indigo-300">SQL Window Functions</strong>, reduced beginner Python syntax, and scheduled 15-minute speaking practice on Wednesday to keep interview fluency sharp.
          </p>
        </div>
      </div>

      {/* Preferences Drawer / Modal */}
      {showConfig && (
        <form onSubmit={handleSavePreferences} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm">Plan Parameters & Routine Calibration</h3>
            <button
              type="button"
              onClick={() => setShowConfig(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Study Hours Available / Day</label>
              <select
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                <option value={1}>1 Hour / day (Light)</option>
                <option value={2}>2 Hours / day (Balanced)</option>
                <option value={2.5}>2.5 Hours / day (Recommended)</option>
                <option value={3.5}>3.5 Hours / day (Accelerated)</option>
                <option value={5}>5 Hours / day (Sprint mode)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Preferred Time of Day</label>
              <select
                value={preferredTime}
                onChange={(e: any) => setPreferredTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                <option>Morning (Fresh mind)</option>
                <option>Afternoon</option>
                <option>Evening (Post-classes)</option>
                <option>Night (Focus hours)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Current Academic Workload</label>
              <select
                value={workload}
                onChange={(e: any) => setWorkload(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                <option>Light (Semester break / light lab)</option>
                <option>Moderate (Regular classes)</option>
                <option>Heavy (Exam week / mid-terms)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Target Placement Date</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
              </input>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30"
            >
              Apply Adaptive Rebalancing
            </button>
          </div>
        </form>
      )}

      {/* Days of the Week Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
        {DAYS_OF_WEEK.map((day) => {
          const dayTasks = tasks.filter((t) => t.day === day);
          const completedCount = dayTasks.filter((t) => t.completed).length;
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <span>{day}</span>
              {dayTasks.length > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {completedCount}/{dayTasks.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Task List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing tasks for <strong className="text-white">{selectedDay}</strong>
          </span>
          <span>
            Estimated Time: {filteredTasks.reduce((acc, t) => acc + t.durationMinutes, 0)} mins
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400 space-y-3">
            <CalendarCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No tasks scheduled for {selectedDay}</p>
            <p className="text-xs">Take a well-deserved rest day, or add a custom focus item.</p>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
            >
              + Add a Task for {selectedDay}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-3.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0 cursor-pointer"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
                    )}
                  </button>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                        {task.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          task.priority === 'High' ? 'text-rose-400' : 'text-slate-400'
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                    </div>
                    <p
                      className={`text-sm sm:text-base font-semibold leading-snug ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <span className="font-semibold text-indigo-300">Why: </span>
                      {task.whyRecommended}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 self-end sm:self-center flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setFocusMinutes(task.durationMinutes);
                      setFocusSecondsLeft(task.durationMinutes * 60);
                      setFocusTimerActive(true);
                      setIsFocusModalOpen(true);
                    }}
                    className="flex items-center space-x-1 text-xs text-indigo-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    title="Focus on this task"
                  >
                    <Play className="w-3 h-3 text-indigo-400" />
                    <span>Focus</span>
                  </button>

                  <span className="flex items-center space-x-1 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{task.durationMinutes} min</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Remove task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreateTask}
            className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Add Task for {selectedDay}</h3>
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Solve 2 Binary Tree problems"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={newTaskDuration}
                  onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                >
                  <option>DSA</option>
                  <option>SQL</option>
                  <option>ML Core</option>
                  <option>OOP / System Design</option>
                  <option>Interview Practice</option>
                  <option>Communication</option>
                  <option>Project Polish</option>
                  <option>Resume</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Focus Timer Modal */}
      <FocusTimerModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        studyMinutes={focusMinutes}
        secondsLeft={focusSecondsLeft}
        timerActive={focusTimerActive}
        onUpdateDuration={(mins) => {
          setFocusMinutes(mins);
          setFocusSecondsLeft(mins * 60);
          setFocusTimerActive(false);
        }}
        onToggleTimer={() => setFocusTimerActive(!focusTimerActive)}
        onResetTimer={() => {
          setFocusTimerActive(false);
          setFocusSecondsLeft(focusMinutes * 60);
        }}
        targetRole={profile.targetRole}
      />

    </div>
  );
};
