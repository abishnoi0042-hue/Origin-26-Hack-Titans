import React, { useState } from 'react';
import { User, Heart, Briefcase, Activity, ShieldCheck, Check, Sparkles } from 'lucide-react';

const AGE_GROUPS = ['Child', 'Teen', 'Adult', 'Elderly'];
const HEALTH_CONDITIONS = [
  { id: 'None', label: 'None (Healthy)', desc: 'Standard environmental tolerance' },
  { id: 'Asthma', label: 'Asthma', desc: '1.6x sensitivity to PM2.5 & rapid humidity drops' },
  { id: 'Heart Disease', label: 'Heart Disease', desc: '1.6x cardiovascular strain from heat & high AQI' },
  { id: 'Respiratory Problems', label: 'Respiratory Problems', desc: '1.5x airway irritability from ozone & cold' },
  { id: 'Allergies', label: 'Allergies / Hay Fever', desc: '1.3x sensitivity to windblown pollen & coarse PM10' },
];
const OCCUPATIONS = [
  { id: 'Indoor Worker', label: 'Indoor Worker', desc: 'Protected office / indoor climate environment (0.9x exposure)' },
  { id: 'Outdoor Worker', label: 'Outdoor Worker', desc: 'Direct, continuous outdoor exposure to heat, UV & pollution (1.45x exposure)' },
  { id: 'Student', label: 'Student', desc: 'Commuting exposure and campus outdoor transitions' },
  { id: 'Athlete', label: 'Athlete / Sports', desc: 'High minute ventilation: inhales 3-5x more air during peak workouts' },
  { id: 'Other', label: 'Other', desc: 'Variable environmental exposure profile' },
];
const ACTIVITY_LEVELS = [
  { id: 'Low', label: 'Low', desc: 'Primarily sedentary or gentle indoor activity' },
  { id: 'Moderate', label: 'Moderate', desc: 'Occasional outdoor walking, commuting & leisure' },
  { id: 'High', label: 'High', desc: 'Vigorous daily cardiovascular physical training' },
];

export default function ProfilePage({ currentProfile, onSaveProfile }) {
  const [formData, setFormData] = useState({ ...currentProfile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleConditionToggle = (conditionId) => {
    let updated;
    if (conditionId === 'None') {
      updated = ['None'];
    } else {
      const filtered = formData.health_conditions.filter(c => c !== 'None');
      if (filtered.includes(conditionId)) {
        updated = filtered.filter(c => c !== conditionId);
        if (updated.length === 0) updated = ['None'];
      } else {
        updated = [...filtered, conditionId];
      }
    }
    setFormData({ ...formData, health_conditions: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Health & Exposure Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Customize your physiological baseline so AeroHealth AI can compute precise, personalized risk scores.
            </p>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-8">
        
        {/* Name Input */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            User Alias / Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-900/90 text-slate-100 text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            required
          />
        </div>

        {/* Age Group */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Age Group
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AGE_GROUPS.map((age) => (
              <button
                type="button"
                key={age}
                onClick={() => setFormData({ ...formData, age_group: age })}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                  formData.age_group === age
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        {/* Health Conditions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Health Conditions
            </label>
            <span className="text-xs text-slate-500">Multi-select enabled</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HEALTH_CONDITIONS.map((cond) => {
              const isChecked = formData.health_conditions.includes(cond.id);
              return (
                <button
                  type="button"
                  key={cond.id}
                  onClick={() => handleConditionToggle(cond.id)}
                  className={`flex items-start justify-between p-3.5 rounded-2xl border text-left transition-all ${
                    isChecked
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm'
                      : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200">{cond.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{cond.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ml-2 mt-0.5 ${
                    isChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-800'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Daily Occupation
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {OCCUPATIONS.map((occ) => (
              <button
                type="button"
                key={occ.id}
                onClick={() => setFormData({ ...formData, occupation: occ.id })}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  formData.occupation === occ.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-xs font-bold">{occ.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{occ.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Physical Activity Level */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Physical Activity Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {ACTIVITY_LEVELS.map((act) => (
              <button
                type="button"
                key={act.id}
                onClick={() => setFormData({ ...formData, activity_level: act.id })}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  formData.activity_level === act.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-xs font-bold">{act.label}</div>
                <div className="text-[10px] text-slate-400 mt-1">{act.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Save button & feedback toast */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-fade-in">
                <Check className="w-4 h-4" /> Profile saved! Recalculating environmental risk...
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 hover:opacity-95 transition-all"
          >
            Save Changes & Apply
          </button>
        </div>

      </form>

    </div>
  );
}
