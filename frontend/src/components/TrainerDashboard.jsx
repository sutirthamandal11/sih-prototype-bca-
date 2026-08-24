import React, { useState } from 'react';
import { 
  Users, Award, TrendingUp, BookOpen, Clock, 
  CheckCircle2, AlertCircle, PlayCircle, Eye, Search, Filter, X 
} from 'lucide-react';

export default function TrainerDashboard({ trainerData, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLearner, setSelectedLearner] = useState(null);

  if (loading || !trainerData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Loading trainer cohort data...</span>
        </div>
      </div>
    );
  }

  const { trainer, specializations, learners_count, learners, avg_learner_progress } = trainerData;

  const filteredLearners = learners.filter((l) =>
    l.learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.learner.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.enrollments.some((e) => e.topic_title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" /> Trainer Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Trainer Overview: {trainer.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>{trainer.department}</span>
              <span>•</span>
              <span>Specializations:</span>
              {specializations.map((spec, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-center">
              <span className="text-xs text-slate-400 font-medium block">Enrolled Learners</span>
              <span className="text-2xl font-extrabold text-white">{learners_count}</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <span className="text-xs text-slate-400 font-medium block">Cohort Avg Progress</span>
              <span className="text-2xl font-extrabold text-amber-400">{avg_learner_progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Learner Position Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Enrolled Learners & Real-Time Content Position
            </h2>
            <p className="text-xs text-slate-400">
              Inspect exactly what module each learner is currently on, their progress, and skill diagnostic levels
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search learners or topics..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Learners Table */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 uppercase text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-5">Learner</th>
                  <th className="py-4 px-5">Enrolled Topic</th>
                  <th className="py-4 px-5">Current Content Position</th>
                  <th className="py-4 px-5">Progress</th>
                  <th className="py-4 px-5">Diagnostic Level</th>
                  <th className="py-4 px-5">Weak Areas</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLearners.map((l) => {
                  const enr = l.enrollments[0] || {};
                  return (
                    <tr key={l.learner.id} className="hover:bg-slate-850/50 transition-colors">
                      {/* Learner Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={l.learner.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                            alt={l.learner.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white text-sm">{l.learner.name}</div>
                            <div className="text-[11px] text-slate-400">{l.learner.department}</div>
                          </div>
                        </div>
                      </td>

                      {/* Topic Title */}
                      <td className="py-4 px-5 font-semibold text-slate-200">
                        {enr.topic_title || 'Not Enrolled'}
                      </td>

                      {/* Current Content Position */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded bg-amber-500/10 text-amber-400 shrink-0">
                            <PlayCircle className="w-3.5 h-3.5" />
                          </span>
                          <span className="font-medium text-amber-200 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/40 truncate max-w-xs">
                            {enr.current_module_title || 'Module 1'}
                          </span>
                        </div>
                      </td>

                      {/* Progress Bar */}
                      <td className="py-4 px-5">
                        <div className="space-y-1.5 w-32">
                          <div className="flex justify-between font-bold text-[11px]">
                            <span className="text-slate-400">{enr.completed_modules_count || 0}/{enr.total_modules || 4} Mods</span>
                            <span className="text-amber-400">{enr.progress_percentage || 0}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full"
                              style={{ width: `${enr.progress_percentage || 0}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Level */}
                      <td className="py-4 px-5">
                        {enr.current_level ? (
                          <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                            <Award className="w-3 h-3" />
                            {enr.current_level} ({enr.latest_score}%)
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not tested yet</span>
                        )}
                        {enr.has_taken_retest && (
                          <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                            Retest: {enr.retest_level} ({enr.retest_score}%)
                          </div>
                        )}
                      </td>

                      {/* Weak areas */}
                      <td className="py-4 px-5">
                        {enr.weak_sub_concepts && enr.weak_sub_concepts.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {enr.weak_sub_concepts.slice(0, 2).map((w, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 truncate"
                              >
                                {w}
                              </span>
                            ))}
                            {enr.weak_sub_concepts.length > 2 && (
                              <span className="text-[10px] text-slate-400">
                                +{enr.weak_sub_concepts.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedLearner(l)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Drilldown Modal for Selected Learner */}
      {selectedLearner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedLearner.learner.avatar}
                  alt={selectedLearner.learner.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedLearner.learner.name}</h3>
                  <p className="text-xs text-slate-400">{selectedLearner.learner.department} • {selectedLearner.learner.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLearner(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Enrollments Breakdown */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedLearner.enrollments.map((e) => (
                <div key={e.enrollment_id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white">{e.topic_title}</h4>
                    <span className="text-xs font-bold text-amber-400">{e.progress_percentage}% Completed</span>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    📍 Current Position: <strong className="text-white">{e.current_module_title}</strong>
                  </div>

                  {/* Modules */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Curriculum Modules:</span>
                    {e.modules.map((m) => (
                      <div key={m.module_id} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900/50">
                        <span className="text-slate-300">{m.module_title}</span>
                        <span className="capitalize text-[10px] text-slate-400">{m.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLearner(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
