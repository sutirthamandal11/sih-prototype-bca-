import React, { useState } from 'react';
import { 
  Briefcase, Users, GraduationCap, Award, TrendingUp, 
  ChevronDown, ChevronUp, PlayCircle, BookOpen, Search, CheckCircle2 
} from 'lucide-react';

export default function ManagerDashboard({ managerData, loading }) {
  const [expandedTrainer, setExpandedTrainer] = useState('trainer-1');

  if (loading || !managerData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Loading management hierarchy...</span>
        </div>
      </div>
    );
  }

  const { manager, total_trainers, total_learners, avg_org_progress, trainers } = managerData;

  const toggleTrainer = (id) => {
    setExpandedTrainer(expandedTrainer === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5" /> Training Directorate Overview
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Executive Directorate: {manager.name}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              {manager.department} • Overseeing faculty trainers, cohort velocity, and diagnostic competency growth
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-center">
              <span className="text-xs text-slate-400 font-medium block">Trainers</span>
              <span className="text-2xl font-extrabold text-white">{total_trainers}</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <span className="text-xs text-slate-400 font-medium block">Total Learners</span>
              <span className="text-2xl font-extrabold text-white">{total_learners}</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <span className="text-xs text-slate-400 font-medium block">Org Avg Progress</span>
              <span className="text-2xl font-extrabold text-purple-400">{avg_org_progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trainers & Their Learners Hierarchy */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Trainer Faculty & Cohort Hierarchy
          </h2>
          <p className="text-xs text-slate-400">
            Expand any trainer to inspect their assigned learners and track their real-time content progress
          </p>
        </div>

        <div className="space-y-4">
          {trainers.map((t) => {
            const isExpanded = expandedTrainer === t.trainer.id;
            return (
              <div
                key={t.trainer.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all"
              >
                {/* Trainer Card Header (Click to Expand) */}
                <div
                  onClick={() => toggleTrainer(t.trainer.id)}
                  className="p-6 bg-slate-950/60 hover:bg-slate-850/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={t.trainer.avatar}
                      alt={t.trainer.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700 ring-2 ring-purple-500/20 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{t.trainer.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          Lead Faculty
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>{t.trainer.department}</span>
                        <span>•</span>
                        <span className="text-slate-300">Specializations: {t.specializations.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block font-medium">Assigned Learners</span>
                      <span className="text-base font-bold text-white">{t.learners_count} Students</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block font-medium">Cohort Progress</span>
                      <span className="text-base font-bold text-purple-400">{t.avg_learner_progress}%</span>
                    </div>

                    <button
                      type="button"
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Learner Cohort List */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-800/80 bg-slate-900/50 space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <span>Learners Enrolled under {t.trainer.name} ({t.learners.length})</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {t.learners.map((l) => {
                        const enr = l.enrollments[0] || {};
                        return (
                          <div
                            key={l.learner.id}
                            className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <img
                                  src={l.learner.avatar}
                                  alt={l.learner.name}
                                  className="w-9 h-9 rounded-full object-cover border border-slate-700"
                                />
                                <div>
                                  <h4 className="text-sm font-bold text-white">{l.learner.name}</h4>
                                  <p className="text-[11px] text-slate-400">{l.learner.department}</p>
                                </div>
                              </div>

                              {enr.current_level && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                                  {enr.current_level}
                                </span>
                              )}
                            </div>

                            {/* Position in content */}
                            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                              <div className="flex items-center justify-between text-slate-400">
                                <span>Enrolled: <strong className="text-slate-200">{enr.topic_title}</strong></span>
                                <span className="font-bold text-purple-400">{enr.progress_percentage}%</span>
                              </div>
                              <div className="text-white font-medium text-[11px] truncate">
                                📍 Position: <span className="text-purple-200">{enr.current_module_title}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
