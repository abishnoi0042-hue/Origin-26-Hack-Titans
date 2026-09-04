import React from 'react';
import { Activity, Shield, History, Info, User, Sparkles } from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  userProfile, 
  onEditProfile,
  backendStatus 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'profile', label: 'Health Profile', icon: User },
    { id: 'history', label: 'Alert History', icon: History },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => setCurrentTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <span className="text-xl">🌍</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                AeroHealth AI
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Because environmental risk is personal.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action: Active User Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-pill hover:bg-white/10 text-xs text-slate-300 border border-white/15 transition-all group"
            title="Edit Personal Health Profile"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
              {userProfile?.name ? userProfile.name[0].toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-[11px] font-semibold text-slate-200 group-hover:text-emerald-300 leading-tight">
                {userProfile?.name || 'User Profile'}
              </div>
              <div className="text-[10px] text-slate-400">
                {userProfile?.age_group} • {userProfile?.health_conditions?.join(', ') || 'Healthy'}
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 underline font-medium ml-1">
              Edit
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
