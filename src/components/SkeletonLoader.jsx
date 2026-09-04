import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 3 Main Dashboard Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 h-72 space-y-4 border border-white/5">
            <div className="flex justify-between items-center">
              <div className="w-28 h-4 bg-slate-800 rounded-lg" />
              <div className="w-16 h-4 bg-slate-800 rounded-lg" />
            </div>
            <div className="w-32 h-14 bg-slate-800 rounded-xl my-4" />
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="h-12 bg-slate-800/60 rounded-xl" />
              <div className="h-12 bg-slate-800/60 rounded-xl" />
              <div className="h-12 bg-slate-800/60 rounded-xl" />
              <div className="h-12 bg-slate-800/60 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* AI Advisory Skeleton */}
      <div className="glass-panel rounded-3xl p-7 h-80 space-y-4 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800" />
          <div className="space-y-2">
            <div className="w-64 h-5 bg-slate-800 rounded-lg" />
            <div className="w-40 h-3 bg-slate-800/60 rounded-lg" />
          </div>
        </div>
        <div className="h-16 bg-slate-800/50 rounded-2xl" />
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="h-28 bg-slate-800/40 rounded-2xl" />
          <div className="h-28 bg-slate-800/40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
