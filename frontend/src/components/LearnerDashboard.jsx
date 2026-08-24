import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Sparkles, CheckCircle2, Clock, 
  ArrowRight, Award, PlayCircle, Lock, RefreshCw, BarChart2, PlusCircle
} from 'lucide-react';

export default function LearnerDashboard({ 
  progressData, 
  topics, 
  onStartAssessment, 
  onStartRetest,
  onEnrollTopic,
  loading 
}) {
  const [selectedTopicDetails, setSelectedTopicDetails] = useState(null);

  if (loading || !progressData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Loading your learning workspace...</span>
        </div>
      </div>
    );
  }

  const { learner, trainer, enrollments, overall_progress } = progressData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" /> Learner Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {learner.name}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              {learner.department} • Assigned Trainer: <strong className="text-slate-200">{trainer ? trainer.name : 'Senior Faculty'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium block">Overall Progress</span>
              <span className="text-2xl font-extrabold text-indigo-400">{overall_progress}%</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center font-bold text-xs text-white">
              {enrollments.length} <span className="text-[10px] text-slate-400 ml-0.5">Enr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Content & Current Position Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              My Enrolled Content & Current Position
            </h2>
            <p className="text-xs text-slate-400">
              Track your exact module milestones and trigger AI skill evaluations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enrollments.map((enr) => (
            <div
              key={enr.enrollment_id}
              className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-slate-700/80 transition-all shadow-xl space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                      {enr.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{enr.topic_title}</h3>
                  </div>

                  {enr.current_level && (
                    <span className="shrink-0 text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      {enr.current_level}
                    </span>
                  )}
                </div>

                {/* Progress Bar & Current Position Badge */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <PlayCircle className="w-4 h-4 text-indigo-400" />
                      Current Position:
                    </span>
                    <span className="font-bold text-indigo-300">
                      {enr.progress_percentage}% Completed
                    </span>
                  </div>

                  {/* Position text highlight */}
                  <div className="text-xs font-semibold text-white bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-800/40 truncate">
                    📍 {enr.current_module_title}
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${enr.progress_percentage}%` }}
                    />
                  </div>
                </div>

                {/* Modules Checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                    Curriculum Modules ({enr.completed_modules_count}/{enr.total_modules} Complete)
                  </span>
                  <div className="space-y-1.5">
                    {enr.modules.map((mod) => (
                      <div
                        key={mod.module_id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                          mod.status === 'completed'
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                            : mod.status === 'in_progress'
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-white font-semibold'
                            : 'bg-slate-950/40 border-slate-900 text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {mod.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : mod.status === 'in_progress' ? (
                            <PlayCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="truncate">{mod.module_title}</span>
                        </div>
                        <span className="text-[10px] capitalize px-2 py-0.5 rounded-full bg-slate-900 text-slate-400">
                          {mod.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weak concepts chips if any */}
                {enr.weak_sub_concepts && enr.weak_sub_concepts.length > 0 && (
                  <div className="text-xs space-y-1">
                    <span className="text-slate-400 font-medium">Diagnostic Weak Areas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {enr.weak_sub_concepts.map((w, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Assessment Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                {enr.has_taken_initial_assessment ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onStartRetest(enr.topic_id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retake Adaptive Test
                    </button>
                    <button
                      onClick={() => onStartAssessment(enr.topic_id)}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    >
                      Diagnostic Test
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onStartAssessment(enr.topic_id)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Take AI Diagnostic Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {enr.latest_score !== null && (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block">Score</span>
                    <span className="text-sm font-bold text-white">{enr.latest_score}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Topics to Enroll */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Explore Other Domain Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topics.map((t) => {
            const isEnrolled = enrollments.some((e) => e.topic_id === t.id);
            return (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="text-[11px] font-semibold text-indigo-400">{t.category}</span>
                  <h4 className="text-base font-bold text-white mt-1">{t.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{t.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
                  <span className="text-slate-400">{t.total_modules} Modules • ~{t.estimated_hours}h</span>
                  {isEnrolled ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                    </span>
                  ) : (
                    <button
                      onClick={() => onEnrollTopic(t.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Enroll
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
