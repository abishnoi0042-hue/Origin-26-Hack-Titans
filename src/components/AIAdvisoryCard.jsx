import React from 'react';
import { 
  Bot, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Sun, 
  Heart, 
  Bookmark, 
  RefreshCw,
  Info
} from 'lucide-react';
import { getRiskBadge } from '../utils/aqiHelpers';

export default function AIAdvisoryCard({ 
  advisory, 
  userProfile, 
  onSaveToHistory, 
  isSaved,
  onRefresh,
  isLoading 
}) {
  if (!advisory) return null;

  const badge = getRiskBadge(advisory.risk_level);
  const isRuleFallback = advisory.ai_provider === 'rule_based_fallback';

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/15 relative overflow-hidden shadow-2xl space-y-6">
      
      {/* Ambient background glow matching risk */}
      <div 
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 transition-all duration-700"
        style={{ backgroundColor: badge.color }}
      />

      {/* Card Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-2xl">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Your Personalized Health Advisory
              </h2>
              {/* AI Engine Status Pill */}
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                isRuleFallback 
                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' 
                  : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
              }`}>
                {isRuleFallback ? 'Clinical Heuristic Engine' : `Powered by ${advisory.ai_provider.toUpperCase()} AI`}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Synthesized for <strong className="text-slate-200">{userProfile?.name || 'You'}</strong> ({userProfile?.age_group} • {userProfile?.occupation} • {userProfile?.health_conditions?.join(', ')})
            </p>
          </div>
        </div>

        {/* Action Buttons & Risk Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className={`text-xs px-3 py-1 rounded-full font-bold border flex items-center gap-1.5 ${badge.bg} ${badge.text} ${badge.border}`}>
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: badge.color }} />
            {advisory.risk_level} Risk
          </span>

          <button
            onClick={onSaveToHistory}
            disabled={isSaved}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
              isSaved 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 cursor-default'
                : 'glass-pill hover:bg-white/10 text-slate-300 border-white/15'
            }`}
            title="Save Advisory to Local History"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl glass-pill hover:bg-white/10 text-slate-300 border-white/15 transition-all disabled:opacity-50"
            title="Regenerate Advisory"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Personalized Summary (Explaining WHY) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-white/10 relative">
        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Why This Recommendation Matters To You</span>
        </div>
        <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
          "{advisory.summary}"
        </p>
      </div>

      {/* Recommendations & Precautions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card A: Outdoor Activity Guidance */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Outdoor Activity Guidance</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {advisory.outdoor_activity}
          </p>
          
          {/* Best Time to Go Outside */}
          <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-xs text-slate-300">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300">Optimal Window: </strong>
              <span>{advisory.best_time_outside}</span>
            </div>
          </div>
        </div>

        {/* Card B: Things to Avoid */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4" />
            <span>Things to Avoid Today</span>
          </div>
          <ul className="space-y-1.5">
            {advisory.things_to_avoid?.map((item, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card C: Health Precautions */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
            <Heart className="w-4 h-4" />
            <span>Health & Medical Precautions</span>
          </div>
          <ul className="space-y-1.5">
            {advisory.health_precautions?.map((item, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                <span className="text-teal-400 shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card D: Weather Precautions */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sun className="w-4 h-4" />
            <span>Weather & Thermal Precautions</span>
          </div>
          <ul className="space-y-1.5">
            {advisory.weather_precautions?.map((item, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                <span className="text-amber-400 shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Mandatory Medical Disclaimer */}
      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 flex items-center gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-slate-500 shrink-0" />
        <p className="leading-normal">
          <strong className="text-slate-300">Disclaimer: </strong>
          {advisory.disclaimer}
        </p>
      </div>

    </div>
  );
}
