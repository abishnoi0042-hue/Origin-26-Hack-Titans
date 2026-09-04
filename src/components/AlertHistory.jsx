import React from 'react';
import { History, Trash2, MapPin, Wind, Thermometer, AlertCircle, ShieldCheck } from 'lucide-react';
import { getRiskBadge } from '../utils/aqiHelpers';

export default function AlertHistory({ 
  history = [], 
  onDeleteAlert, 
  onClearHistory 
}) {
  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Advisory Archive & History</h2>
            <p className="text-xs text-slate-400">
              Locally cached health snapshots and environmental advisories ({history.length} saved)
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
            <History className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-300">No advisories saved yet</p>
          <p className="text-xs text-slate-500 max-w-sm">
            When you generate a personalized health advisory on the dashboard, click "Save" to archive it here for your records.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {history.map((item) => {
            const badge = getRiskBadge(item.risk_level);

            return (
              <div
                key={item.id}
                className="bg-slate-900/70 hover:bg-slate-900/90 p-4 rounded-2xl border border-white/10 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {item.risk_level} Risk
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-300 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.location || 'Current Location'}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">•</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.date} at {item.time}
                    </span>
                  </div>

                  {/* Short Advisory Summary */}
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {item.summary}
                  </p>

                  {/* Telemetry pill */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-sky-400" />
                      {item.temperature}°C
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-amber-400" />
                      AQI {item.aqi}
                    </span>
                    {item.user_name && (
                      <span className="text-slate-500">
                        Profile: {item.user_name}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteAlert(item.id)}
                  className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-all opacity-80 group-hover:opacity-100"
                  title="Delete this advisory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
