import React, { useState } from 'react';
import { 
  Shield, Users, GraduationCap, Briefcase, BookOpen, 
  Award, TrendingUp, Search, CheckCircle2, PlayCircle, Eye 
} from 'lucide-react';

export default function AdminDashboard({ adminData, loading }) {
  const [activeTab, setActiveTab] = useState('learners'); // 'learners', 'users', 'curriculum'
  const [searchTerm, setSearchTerm] = useState('');

  if (loading || !adminData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Loading master administrative console...</span>
        </div>
      </div>
    );
  }

  const {
    total_users,
    total_learners,
    total_trainers,
    total_managers,
    total_courses,
    avg_org_score,
    learners,
    trainers,
    all_topics,
  } = adminData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Admin Master Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" /> Root System Administrator Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Global Platform Governance
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              Full organizational visibility across all tiers: Learners, Trainers, Training Managers, and AI Curriculum
            </p>
          </div>

          {/* Master Stats */}
          <div className="grid grid-cols-3 gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0 text-center">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Total Users</span>
              <span className="text-xl font-extrabold text-white">{total_users}</span>
            </div>
            <div className="border-x border-slate-800 px-3">
              <span className="text-[11px] text-slate-400 font-medium block">Courses</span>
              <span className="text-xl font-extrabold text-indigo-400">{total_courses}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Avg Competency</span>
              <span className="text-xl font-extrabold text-emerald-400">{avg_org_score}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Counts Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Learners</span>
            <span className="text-xl font-bold text-white">{total_learners}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Trainers</span>
            <span className="text-xl font-bold text-white">{total_trainers}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/20 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Managers</span>
            <span className="text-xl font-bold text-white">{total_managers}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/20 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Admins</span>
            <span className="text-xl font-bold text-white">1</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800 flex items-center gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('learners')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'learners'
              ? 'border-rose-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>All Enrolled Learners & Positions</span>
        </button>

        <button
          onClick={() => setActiveTab('trainers')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'trainers'
              ? 'border-rose-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Trainer Faculty Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('curriculum')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'curriculum'
              ? 'border-rose-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Curriculum & Assessment Catalog</span>
        </button>
      </div>

      {/* Tab 1: All Learners */}
      {activeTab === 'learners' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 uppercase text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-5">Learner</th>
                  <th className="py-4 px-5">Assigned Trainer</th>
                  <th className="py-4 px-5">Enrolled Course</th>
                  <th className="py-4 px-5">Current Content Position</th>
                  <th className="py-4 px-5">Progress</th>
                  <th className="py-4 px-5">Current Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {learners.map((l) => {
                  const enr = l.enrollments[0] || {};
                  return (
                    <tr key={l.learner.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={l.learner.avatar}
                            alt={l.learner.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="font-bold text-white">{l.learner.name}</div>
                            <div className="text-[11px] text-slate-400">{l.learner.department}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-slate-200 font-medium">
                        {l.trainer ? l.trainer.name : 'Unassigned'}
                      </td>

                      <td className="py-4 px-5 font-semibold text-white">
                        {enr.topic_title || 'N/A'}
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
                          <PlayCircle className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{enr.current_module_title || 'Module 1'}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 font-bold text-slate-200">
                        {enr.progress_percentage || 0}%
                      </td>

                      <td className="py-4 px-5">
                        {enr.current_level ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {enr.current_level} ({enr.latest_score}%)
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not tested</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Trainer Faculty */}
      {activeTab === 'trainers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainers.map((t) => (
            <div key={t.trainer.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={t.trainer.avatar}
                  alt={t.trainer.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{t.trainer.name}</h3>
                  <p className="text-xs text-slate-400">{t.trainer.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-850">
                <div>
                  <span className="text-slate-400 block font-medium">Assigned Learners</span>
                  <span className="text-base font-bold text-white">{t.learners_count}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Cohort Avg Progress</span>
                  <span className="text-base font-bold text-amber-400">{t.avg_learner_progress}%</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">Specializations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {t.specializations.map((s, idx) => (
                    <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Curriculum Catalog */}
      {activeTab === 'curriculum' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {all_topics.map((topic) => (
            <div key={topic.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-indigo-400">{topic.category}</span>
                <h3 className="text-base font-bold text-white">{topic.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{topic.description}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block">Modules ({topic.modules.length}):</span>
                <div className="space-y-1">
                  {topic.modules.map((m) => (
                    <div key={m.id} className="text-xs text-slate-400 bg-slate-950 p-2 rounded-lg truncate">
                      • {m.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
