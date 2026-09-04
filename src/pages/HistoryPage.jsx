import React, { useState } from 'react';
import AlertHistory from '../components/AlertHistory';
import { History, Search, Filter } from 'lucide-react';

export default function HistoryPage({ history, onDeleteAlert, onClearHistory }) {
  const [searchFilter, setSearchFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');

  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.location?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.summary?.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesLevel = levelFilter === 'All' || item.risk_level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xl">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Health Advisory History
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Audit log of previously generated AI environmental health advisories stored securely in your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Filter by city name or advisory keywords..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-900/80 text-xs rounded-xl pl-9 pr-4 py-2 border border-white/10 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {['All', 'Low', 'Moderate', 'High', 'Severe'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                levelFilter === lvl
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Alert History Component */}
      <AlertHistory
        history={filteredHistory}
        onDeleteAlert={onDeleteAlert}
        onClearHistory={onClearHistory}
      />

    </div>
  );
}
