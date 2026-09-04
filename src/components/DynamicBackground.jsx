import React, { useState } from 'react';
import { getWeatherTheme } from '../utils/weatherHelpers';
import { Sparkles, Sun, CloudRain, Zap, Wind, Moon, Snowflake } from 'lucide-react';

const PRESET_THEMES = [
  { id: 'auto', label: 'Auto (Live Weather)', icon: Sparkles },
  { id: 'sunny', label: 'Sunlit Azure', icon: Sun },
  { id: 'rain', label: 'Rainy Cascade', icon: CloudRain },
  { id: 'thunderstorm', label: 'Electric Thunder', icon: Zap },
  { id: 'smog-alert', label: 'Smog Warning', icon: Wind },
  { id: 'night-clear', label: 'Starlit Night', icon: Moon },
  { id: 'snow', label: 'Crystalline Snow', icon: Snowflake },
];

export default function DynamicBackground({ weatherCode = 0, aqi = 50, isDay = true, children }) {
  const [manualOverride, setManualOverride] = useState('auto');
  const [showPicker, setShowPicker] = useState(false);

  // Determine active theme
  const liveTheme = getWeatherTheme(weatherCode, aqi, isDay);
  
  let currentTheme = liveTheme;
  if (manualOverride !== 'auto') {
    if (manualOverride === 'sunny') {
      currentTheme = { id: 'sunny', name: 'Sunlit Azure Sky', bgGradient: 'from-slate-950 via-emerald-950/40 to-cyan-950/70', accentColor: 'text-emerald-400', glowColor: 'rgba(52, 211, 153, 0.2)', mood: 'sunny' };
    } else if (manualOverride === 'rain') {
      currentTheme = { id: 'rain', name: 'Rain & Precipitation', bgGradient: 'from-slate-950 via-sky-950/60 to-blue-950', accentColor: 'text-sky-400', glowColor: 'rgba(56, 189, 248, 0.2)', mood: 'rain' };
    } else if (manualOverride === 'thunderstorm') {
      currentTheme = { id: 'thunderstorm', name: 'Electric Thunderstorm', bgGradient: 'from-slate-950 via-purple-950/70 to-indigo-950', accentColor: 'text-purple-400', glowColor: 'rgba(168, 85, 247, 0.25)', mood: 'thunder' };
    } else if (manualOverride === 'smog-alert') {
      currentTheme = { id: 'smog-alert', name: 'Hazardous Smog Atmosphere', bgGradient: 'from-amber-950/80 via-slate-900 to-rose-950/90', accentColor: 'text-amber-400', glowColor: 'rgba(245, 158, 11, 0.25)', mood: 'smog' };
    } else if (manualOverride === 'night-clear') {
      currentTheme = { id: 'night-clear', name: 'Indigo Starlit Night', bgGradient: 'from-slate-950 via-indigo-950/80 to-slate-950', accentColor: 'text-indigo-400', glowColor: 'rgba(129, 140, 248, 0.2)', mood: 'night' };
    } else if (manualOverride === 'snow') {
      currentTheme = { id: 'snow', name: 'Snow & Frost', bgGradient: 'from-slate-950 via-teal-950/40 to-slate-900', accentColor: 'text-cyan-300', glowColor: 'rgba(103, 232, 249, 0.2)', mood: 'snow' };
    }
  }

  // Pre-generate drops and stars coordinates for stable rendering
  const rainDrops = Array.from({ length: 24 }).map((_, i) => ({
    left: `${(i * 4.2 + 2)}%`,
    delay: `${(i % 5) * 0.25}s`,
    duration: `${0.8 + (i % 4) * 0.2}s`,
  }));

  const stars = Array.from({ length: 28 }).map((_, i) => ({
    left: `${(i * 3.5 + 3) % 96}%`,
    top: `${(i * 4.5 + 5) % 80}%`,
    delay: `${(i % 4) * 0.5}s`,
    duration: `${1.5 + (i % 3) * 0.8}s`,
  }));

  return (
    <div className={`relative min-h-screen w-full bg-gradient-to-br ${currentTheme.bgGradient} transition-colors duration-1000 overflow-x-hidden`}>
      {/* Ambient background glow orbs */}
      <div 
        className="pointer-events-none fixed -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-60 transition-all duration-1000"
        style={{ background: currentTheme.glowColor }}
      />
      <div 
        className="pointer-events-none fixed top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-40 transition-all duration-1000"
        style={{ background: currentTheme.glowColor }}
      />
      <div 
        className="pointer-events-none fixed -bottom-32 left-1/4 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-30 transition-all duration-1000"
        style={{ background: currentTheme.glowColor }}
      />

      {/* Atmospheric Visual Effects */}
      {/* 1. Rain Effect */}
      {currentTheme.mood === 'rain' && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          {rainDrops.map((d, i) => (
            <div 
              key={i} 
              className="rain-drop" 
              style={{ left: d.left, animationDelay: d.delay, animationDuration: d.duration }} 
            />
          ))}
        </div>
      )}

      {/* 2. Night Stardust Effect */}
      {currentTheme.mood === 'night' && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          {stars.map((s, i) => (
            <div 
              key={i} 
              className="star-dot" 
              style={{ left: s.left, top: s.top, animationDelay: s.delay, animationDuration: s.duration }} 
            />
          ))}
        </div>
      )}

      {/* 3. Smog / Hazard Alert Atmosphere */}
      {currentTheme.mood === 'smog' && (
        <div className="pointer-events-none fixed inset-0 z-0 opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600 via-transparent to-rose-900" />
      )}

      {/* 4. Sunny Sun Flare */}
      {currentTheme.mood === 'sunny' && (
        <div className="pointer-events-none fixed top-0 right-10 w-96 h-96 bg-gradient-to-b from-amber-400/20 via-emerald-400/10 to-transparent rounded-full blur-3xl" />
      )}

      {/* Content wrapper */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Atmospheric Theme Switcher Floating Tool (For Judges & Demo) */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          {showPicker && (
            <div className="absolute bottom-12 right-0 w-64 glass-panel rounded-xl p-2.5 shadow-2xl border border-white/15 animate-slide-up space-y-1">
              <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Atmosphere & Background
              </div>
              {PRESET_THEMES.map((th) => {
                const Icon = th.icon;
                const isSelected = manualOverride === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => {
                      setManualOverride(th.id);
                      setShowPicker(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{th.label}</span>
                    {th.id === 'auto' && (
                      <span className="ml-auto text-[10px] text-emerald-400/80">Live</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill hover:bg-white/10 text-xs font-medium text-slate-200 shadow-lg border border-white/15 transition-all group"
            title="Preview Weather Atmospheres"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-slate-300 group-hover:text-white">
              Atmosphere: <strong className="text-white">{currentTheme.name}</strong>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
