import React from 'react';
import { 
  LogOut, Shield, GraduationCap, Users, Briefcase, 
  Sparkles, CheckCircle2, ChevronRight, User 
} from 'lucide-react';

export default function Navbar({ currentUser, onLogout, onSwitchRole, demoUsers }) {
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return {
          label: 'System Admin',
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: Shield,
        };
      case 'manager':
        return {
          label: 'Training Manager',
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          icon: Briefcase,
        };
      case 'trainer':
        return {
          label: 'Trainer',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: Users,
        };
      case 'learner':
      default:
        return {
          label: 'Learner',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: GraduationCap,
        };
    }
  };

  const badge = getRoleBadge(currentUser?.role);
  const RoleIcon = badge.icon;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                Skill<span className="text-indigo-400">Flow</span> AI
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                SIH Prototype
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Adaptive Assessment & Role Governance Platform
            </p>
          </div>
        </div>

        {/* User Info & Role Switcher */}
        {currentUser && (
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 px-2 font-medium">Switch View:</span>
              {demoUsers && demoUsers.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  onClick={() => onSwitchRole(u.email)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all font-medium capitalize flex items-center gap-1 ${
                    currentUser.email === u.email
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={`Switch to ${u.name} (${u.role})`}
                >
                  {u.role}
                </button>
              ))}
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-700 ring-2 ring-indigo-500/20"
              />
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-slate-100 flex items-center gap-1.5 leading-tight">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${badge.bg}`}>
                    <RoleIcon className="w-3 h-3" />
                    {badge.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20 ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
