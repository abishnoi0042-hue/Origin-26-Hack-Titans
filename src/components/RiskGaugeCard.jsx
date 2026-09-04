import React from 'react';
import { ShieldCheck, ShieldAlert, Heart, User, Sparkles, TrendingUp } from 'lucide-react';
import { getRiskBadge } from '../utils/aqiHelpers';

export default function RiskGaugeCard({ riskScore = 20, riskLevel = 'Low', riskBreakdown, userProfile }) {
  const badge = getRiskBadge(riskLevel);

  // SVG Circular Gauge parameters
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (riskScore / 100) * circumference;

  const envScore = riskBreakdown?.environmental_stress ?? Math.round(riskScore * 0.8);
  const primaryFactors = riskBreakdown?.primary_factors || [];

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between h-full border border-white/10 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Card 3</h3>
            <h2 className="text-base font-bold text-slate-100">Personal Risk Score</h2>
          </div>
        </div>

        {/* Risk Badge */}
        <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
          {riskLevel} Risk
        </span>
      </div>

      {/* Circular Animated Risk Score Gauge */}
      <div className="py-3 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated Score Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={badge.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 10px ${badge.color}66)` }}
            />
          </svg>

          {/* Centered Score text */}
          <div className="absolute flex flex-col items-center text-center">
            <span className="text-4xl font-black tracking-tight text-white">
              {riskScore}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              / 100
            </span>
          </div>
        </div>

        {/* Baseline vs Personal Comparison */}
        <div className="flex items-center gap-4 mt-2 text-xs">
          <div className="text-center">
            <div className="text-[10px] text-slate-400">Env Baseline</div>
            <div className="font-bold text-slate-200">{envScore}/100</div>
          </div>
          <div className="h-4 w-px bg-white/15" />
          <div className="text-center">
            <div className="text-[10px] text-slate-400">Personal Multiplier</div>
            <div className="font-bold text-emerald-400">
              {riskBreakdown?.vulnerability_multiplier ? `${riskBreakdown.vulnerability_multiplier}x` : '1.0x'}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Stress Factors Breakdown */}
      <div className="pt-3 border-t border-white/10 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Personal Risk Drivers</span>
          <span className="text-emerald-400">{userProfile?.age_group} • {userProfile?.occupation}</span>
        </div>

        {primaryFactors.length > 0 ? (
          <div className="space-y-1">
            {primaryFactors.slice(0, 2).map((factor, idx) => (
              <div key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/60 border border-white/5 text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.color }} />
                <span className="truncate">{factor}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[11px] px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-center">
            Zero elevated risk factors detected for your profile.
          </div>
        )}
      </div>

    </div>
  );
}
