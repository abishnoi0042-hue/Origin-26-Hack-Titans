import React from 'react';
import { UserCheck, Wind, HardHat, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const DEMO_PRESETS = [
  {
    id: 'healthy_adult',
    title: 'Healthy Adult',
    name: 'Alex',
    badge: 'Baseline Risk',
    badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    icon: UserCheck,
    conditions: 'None',
    occupation: 'Indoor Worker',
    profile: {
      name: 'Alex (Healthy)',
      age_group: 'Adult',
      health_conditions: ['None'],
      occupation: 'Indoor Worker',
      activity_level: 'Moderate',
    },
    note: 'Tolerates typical ambient variations well; standard hydration advised.'
  },
  {
    id: 'asthma_patient',
    title: 'Asthma Patient',
    name: 'Maya',
    badge: 'Airway Sensitive',
    badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    icon: Wind,
    conditions: 'Asthma',
    occupation: 'Student',
    profile: {
      name: 'Maya (Asthma)',
      age_group: 'Teen',
      health_conditions: ['Asthma'],
      occupation: 'Student',
      activity_level: 'High',
    },
    note: 'Elevated bronchial vulnerability to PM2.5 particulates & humidity.'
  },
  {
    id: 'outdoor_worker',
    title: 'Outdoor Worker',
    name: 'Carlos',
    badge: 'High UV & Heat',
    badgeColor: 'text-orange-400 bg-orange-500/15 border-orange-500/30',
    icon: HardHat,
    conditions: 'Allergies',
    occupation: 'Outdoor Worker',
    profile: {
      name: 'Carlos (Outdoor)',
      age_group: 'Adult',
      health_conditions: ['Allergies'],
      occupation: 'Outdoor Worker',
      activity_level: 'High',
    },
    note: 'Prolonged outdoor exposure; heat exhaustion and solar UV radiation risk.'
  },
  {
    id: 'elderly_person',
    title: 'Elderly Person',
    name: 'Eleanor',
    badge: 'Cardio Sensitive',
    badgeColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
    icon: ShieldAlert,
    conditions: 'Heart & Respiratory',
    occupation: 'Retired',
    profile: {
      name: 'Eleanor (Elderly)',
      age_group: 'Elderly',
      health_conditions: ['Heart Disease', 'Respiratory Problems'],
      occupation: 'Other',
      activity_level: 'Low',
    },
    note: 'Fragile thermoregulation and cardiac reserves; susceptible to thermal swings.'
  },
];

export default function DemoScenarioSelector({ activeProfile, onSelectProfile }) {
  const handleSelect = (scenario) => {
    onSelectProfile(scenario.profile);
    
    // Quick celebratory confetti if healthy or switching scenario
    if (scenario.id === 'healthy_adult') {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (e) {}
    }
  };

  const isCurrent = (scenario) => {
    return activeProfile?.age_group === scenario.profile.age_group &&
      activeProfile?.occupation === scenario.profile.occupation &&
      activeProfile?.health_conditions?.includes(scenario.profile.health_conditions[0]);
  };

  return (
    <div className="w-full glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Interactive Demo Mode</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Hackathon Showcase
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Click any scenario to see how AeroHealth AI dynamically adapts health guidance for different people in the exact same environment:
            </p>
          </div>
        </div>
      </div>

      {/* 4 Scenario Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {DEMO_PRESETS.map((scenario) => {
          const Icon = scenario.icon;
          const active = isCurrent(scenario);

          return (
            <button
              key={scenario.id}
              onClick={() => handleSelect(scenario)}
              className={`text-left p-3 rounded-xl transition-all relative overflow-hidden group border ${
                active
                  ? 'bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-900/80'
              }`}
            >
              {active && (
                <div className="absolute top-2.5 right-2.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-lg ${active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-300 group-hover:text-white'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
                    {scenario.title}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {scenario.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${scenario.badgeColor}`}>
                  {scenario.badge}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {scenario.note}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
