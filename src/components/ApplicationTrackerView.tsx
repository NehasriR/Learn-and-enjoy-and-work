import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Calendar,
  Building,
  Briefcase,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Edit2
} from 'lucide-react';
import { ApplicationItem } from '../types';
import { upsertApplication, deleteApplication } from '../services/storage';

interface ApplicationTrackerViewProps {
  applications: ApplicationItem[];
}

const STATUS_COLUMNS = [
  'Interested',
  'Preparing',
  'Applied',
  'Assessment',
  'Interview',
  'Selected',
  'Rejected',
] as const;

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({ applications }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ApplicationItem | null>(null);

  // Form state
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<typeof STATUS_COLUMNS[number]>('Applied');
  const [ctc, setCtc] = useState('');
  const [notes, setNotes] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');

  const openCreateModal = () => {
    setEditingItem(null);
    setCompany('');
    setRole('');
    setStatus('Applied');
    setCtc('');
    setNotes('');
    setNextFollowUp('');
    setShowAddModal(true);
  };

  const openEditModal = (app: ApplicationItem) => {
    setEditingItem(app);
    setCompany(app.company);
    setRole(app.role);
    setStatus(app.status);
    setCtc(app.ctcOrStipend);
    setNotes(app.notes);
    setNextFollowUp(app.nextFollowUp);
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    upsertApplication({
      id: editingItem ? editingItem.id : `app-${Date.now()}`,
      company,
      role,
      applyDate: editingItem ? editingItem.applyDate : new Date().toISOString().split('T')[0],
      status,
      ctcOrStipend: ctc || 'Standard',
      notes,
      nextFollowUp: nextFollowUp || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    });

    setShowAddModal(false);
  };

  const handleStatusChange = (app: ApplicationItem, newStatus: any) => {
    upsertApplication({
      ...app,
      status: newStatus,
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Recruitment Pipeline
            </span>
            <span className="text-xs text-slate-400">Campus & Off-Campus Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Application Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Track every drive stage from Initial Interest to Assessment, Technical Interviews, and Offers.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-2 self-start md:self-center transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Kanban Board / Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Applied', 'Assessment', 'Interview', 'Selected'].map((colStatus) => {
          const colApps = applications.filter((a) => a.status === colStatus);

          return (
            <div key={colStatus} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      colStatus === 'Selected'
                        ? 'bg-emerald-400'
                        : colStatus === 'Interview'
                        ? 'bg-purple-400'
                        : colStatus === 'Assessment'
                        ? 'bg-amber-400'
                        : 'bg-indigo-400'
                    }`}
                  />
                  <h3 className="font-bold text-white text-sm">{colStatus}</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {colApps.length}
                </span>
              </div>

              {/* Cards in column */}
              <div className="space-y-3">
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all space-y-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">{app.company}</h4>
                        <p className="text-xs text-indigo-300 font-medium truncate">{app.role}</p>
                      </div>
                      <button
                        onClick={() => openEditModal(app)}
                        className="text-slate-400 hover:text-white p-1"
                        title="Edit entry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
                      <span>{app.ctcOrStipend}</span>
                      <span>Next: {app.nextFollowUp}</span>
                    </div>

                    {app.notes && (
                      <p className="text-[11px] text-slate-300 italic line-clamp-2 bg-slate-900/60 p-2 rounded-lg">
                        "{app.notes}"
                      </p>
                    )}

                    {/* Quick Move Status */}
                    <div className="flex items-center justify-between pt-1">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app, e.target.value)}
                        className="text-[10px] p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 cursor-pointer"
                      >
                        {STATUS_COLUMNS.map((st) => (
                          <option key={st} value={st}>
                            Move to {st}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Delete application"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {colApps.length === 0 && (
                  <div className="p-6 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
                    No drives in {colStatus}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleSave}
            className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingItem ? 'Edit Placement Application' : 'Add New Application'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Infosys, Nexus"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SDE 1, ML Intern"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Pipeline Stage</label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                >
                  {STATUS_COLUMNS.map((st) => (
                    <option key={st}>{st}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">CTC or Stipend</label>
                <input
                  type="text"
                  placeholder="e.g. ₹14 LPA / ₹45k/mo"
                  value={ctc}
                  onChange={(e) => setCtc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-300 mb-1">Next Follow-Up / Test Date</label>
              <input
                type="date"
                value={nextFollowUp}
                onChange={(e) => setNextFollowUp(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-300 mb-1">Round Notes & Focus</label>
              <textarea
                rows={2}
                placeholder="Key rounds, test dates, referral contacts, or expected topics..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white resize-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30"
              >
                Save Application
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
