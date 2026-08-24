import React, { useState } from 'react';
import { 
  Shield, GraduationCap, Users, Briefcase, Sparkles, 
  ArrowRight, Key, Mail, Lock, CheckCircle2, Zap, AlertCircle
} from 'lucide-react';

export default function LoginScreen({ onLogin, demoUsers, loading, error }) {
  const [email, setEmail] = useState('learner.aarav@demo.com');
  const [password, setPassword] = useState('password123');
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' or 'form'

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const handleQuickLogin = (userEmail) => {
    setEmail(userEmail);
    setPassword('password123');
    onLogin(userEmail, 'password123');
  };

  const roleMeta = {
    learner: {
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
      badge: 'Learner',
      icon: GraduationCap,
      accent: 'hover:border-emerald-500/60 hover:shadow-emerald-500/10',
    },
    trainer: {
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
      badge: 'Trainer',
      icon: Users,
      accent: 'hover:border-amber-500/60 hover:shadow-amber-500/10',
    },
    manager: {
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
      badge: 'Training Manager',
      icon: Briefcase,
      accent: 'hover:border-purple-500/60 hover:shadow-purple-500/10',
    },
    admin: {
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
      badge: 'System Admin',
      icon: Shield,
      accent: 'hover:border-rose-500/60 hover:shadow-rose-500/10',
    },
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Platform Branding & Role Hierarchy Info */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            AI-Powered Multi-Tier Role Governance
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Skill Assessment & <br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Workforce Intelligence
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Experience role-based visibility where <strong className="text-emerald-300">Learners</strong> track content position & take AI diagnostic tests, <strong className="text-amber-300">Trainers</strong> monitor cohort progress, <strong className="text-purple-300">Managers</strong> oversee trainers, and <strong className="text-rose-300">Admins</strong> govern the whole system.
          </p>

          {/* 4 Tier Hierarchy Visual Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Organizational Role Matrix</span>
              <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">RBAC Verified</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <GraduationCap className="w-4 h-4" /> Learner
                </div>
                <p className="text-[11px] text-slate-400">Content position, diagnostic AI tests, and recommendations.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                  <Users className="w-4 h-4" /> Trainer
                </div>
                <p className="text-[11px] text-slate-400">Enrolled learners, module completion, and skill weak-spots.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold">
                  <Briefcase className="w-4 h-4" /> Training Manager
                </div>
                <p className="text-[11px] text-slate-400">Trainer cohorts, program completion, and organizational KPIs.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
                  <Shield className="w-4 h-4" /> Administrator
                </div>
                <p className="text-[11px] text-slate-400">Full system oversight, all users, courses, and system logs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Solid Login Card */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-700/60 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Sign in to Platform
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Select a demo persona or enter credentials
                </p>
              </div>

              {/* Tabs Switcher */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('quick')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    activeTab === 'quick'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> 1-Click Demo
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    activeTab === 'form'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Credentials
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Mode 1: 1-Click Demo Personas */}
            {activeTab === 'quick' && (
              <div className="space-y-2.5">
                <p className="text-xs text-slate-400 font-medium mb-1">
                  Click any role persona to log in instantly:
                </p>

                {demoUsers && demoUsers.map((u) => {
                  const meta = roleMeta[u.role] || roleMeta.learner;
                  const Icon = meta.icon;
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleQuickLogin(u.email)}
                      disabled={loading}
                      className={`w-full text-left p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 ${meta.accent} transition-all duration-200 flex items-center justify-between group cursor-pointer hover:bg-slate-850 hover:shadow-lg disabled:opacity-50`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-100 group-hover:text-white truncate">
                              {u.name}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.color} flex items-center gap-1`}>
                              <Icon className="w-3 h-3" />
                              {meta.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {u.department}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-300 transition-colors shrink-0 ml-2">
                        <span className="text-xs font-semibold hidden sm:inline">Enter</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Mode 2: Standard Credentials Form */}
            {activeTab === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="e.g. learner.aarav@demo.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Demo password for all accounts: <code className="text-indigo-300">password123</code>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In with Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Security Guarantee */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>JWT Secure Token Auth</span>
              </div>
              <span>Role-Based Access Control</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
