import React from 'react';
import { Wind, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { getAqiCategory } from '../utils/aqiHelpers';

export default function AQICard({ airQuality }) {
  if (!airQuality) return null;

  const aqi = airQuality.aqi ?? 0;
  const category = getAqiCategory(aqi);

  // SVG Semi-circle gauge calculation
  // Radius = 70, circumference for half circle (PI * R) = ~220
  const normalizedValue = Math.min(300, Math.max(0, aqi));
  const percentage = normalizedValue / 300;
  const strokeDashoffset = 220 - (220 * percentage);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between h-full border border-white/10 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Card 2</h3>
            <h2 className="text-base font-bold text-slate-100">Air Quality Index</h2>
          </div>
        </div>
        
        {/* Status Badge */}
        <span 
          className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${category.bg} ${category.text} ${category.border}`}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
          {category.label}
        </span>
      </div>

      {/* Visually Attractive AQI Radial Gauge */}
      <div className="py-2 flex flex-col items-center justify-center relative">
        <div className="relative w-48 h-28 flex items-center justify-center">
          <svg className="w-48 h-28 overflow-visible" viewBox="0 0 160 90">
            {/* Background Arch */}
            <path
              d="M 15 80 A 65 65 0 0 1 145 80"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Colored Progress Arch */}
            <path
              d="M 15 80 A 65 65 0 0 1 145 80"
              fill="none"
              stroke={category.color}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="220"
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 8px ${category.color}66)` }}
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute top-10 flex flex-col items-center">
            <span className="text-3xl font-extrabold tracking-tight text-white">
              {aqi}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
              US AQI
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 text-center max-w-xs mt-1">
          {category.desc}
        </p>
      </div>

      {/* Pollutant Concentrations Grid */}
      <div className="pt-3 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium text-slate-300">Key Pollutants</span>
          <span className="text-[10px]">µg/m³</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          
          {/* PM2.5 */}
          <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5">
            <div className="text-[10px] text-slate-400 font-medium">PM2.5</div>
            <div className={`text-sm font-bold mt-0.5 ${airQuality.pm2_5 > 35 ? 'text-orange-400' : 'text-slate-200'}`}>
              {airQuality.pm2_5}
            </div>
            <div className="text-[9px] text-slate-500">Fine Dust</div>
          </div>

          {/* PM10 */}
          <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5">
            <div className="text-[10px] text-slate-400 font-medium">PM10</div>
            <div className={`text-sm font-bold mt-0.5 ${airQuality.pm10 > 50 ? 'text-amber-400' : 'text-slate-200'}`}>
              {airQuality.pm10}
            </div>
            <div className="text-[9px] text-slate-500">Coarse Dust</div>
          </div>

          {/* Ozone (O3) */}
          <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5">
            <div className="text-[10px] text-slate-400 font-medium">Ozone (O₃)</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              {airQuality.ozone != null ? airQuality.ozone : '--'}
            </div>
            <div className="text-[9px] text-slate-500">Smog Oxidant</div>
          </div>

        </div>

        {/* Secondary Pollutants: CO & NO2 */}
        <div className="grid grid-cols-2 gap-2 text-center pt-0.5">
          <div className="bg-slate-900/40 px-2 py-1.5 rounded-lg border border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Carbon Monoxide (CO)</span>
            <span className="font-semibold text-slate-200">{airQuality.carbon_monoxide != null ? airQuality.carbon_monoxide : '--'}</span>
          </div>
          <div className="bg-slate-900/40 px-2 py-1.5 rounded-lg border border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Nitrogen Dioxide (NO₂)</span>
            <span className="font-semibold text-slate-200">{airQuality.nitrogen_dioxide != null ? airQuality.nitrogen_dioxide : '--'}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
