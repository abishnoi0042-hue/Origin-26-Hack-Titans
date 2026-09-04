import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, Thermometer, Wind, Activity } from 'lucide-react';

export default function TrendsChart({ trends = [] }) {
  const [activeMetric, setActiveMetric] = useState('temperature');

  const metrics = [
    { id: 'temperature', label: 'Temperature (°C)', icon: Thermometer, color: '#38bdf8', unit: '°C' },
    { id: 'aqi', label: 'Air Quality (AQI)', icon: Wind, color: '#f59e0b', unit: '' },
    { id: 'pm2_5', label: 'PM2.5 (µg/m³)', icon: Activity, color: '#ef4444', unit: 'µg/m³' },
  ];

  const currentMetric = metrics.find(m => m.id === activeMetric);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-xl border border-white/20 shadow-xl text-xs space-y-1">
          <div className="font-bold text-slate-200">{data.label || label}</div>
          <div className="flex items-center gap-2" style={{ color: currentMetric.color }}>
            <span className="font-semibold">{currentMetric.label}:</span>
            <span className="font-extrabold text-sm">{payload[0].value} {currentMetric.unit}</span>
          </div>
          {activeMetric === 'temperature' && data.temp_max && (
            <div className="text-[10px] text-slate-400">
              High: {data.temp_max}°C • Low: {data.temp_min}°C
            </div>
          )}
          {data.rain_probability != null && (
            <div className="text-[10px] text-sky-400">
              Rain Chance: {data.rain_probability}%
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
      
      {/* Chart Header & Metric Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              7-Day Environmental Trends
            </h2>
            <p className="text-xs text-slate-400">
              Historical readings and predictive meteorological trajectory
            </p>
          </div>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/10">
          {metrics.map((m) => {
            const Icon = m.icon;
            const isSelected = activeMetric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        {trends && trends.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis 
                dataKey="label" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey={activeMetric} 
                stroke={currentMetric.color} 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#gradient-${activeMetric})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            Gathering 7-day environmental telemetry...
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <span>Combined satellite observation & high-resolution NWP forecast</span>
        <span className="text-emerald-400 font-medium">Open-Meteo Telemetry</span>
      </div>

    </div>
  );
}
