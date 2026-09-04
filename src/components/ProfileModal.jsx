import React, { useState, useEffect } from 'react';
import { X, User, Heart, Briefcase, Activity, Check, Shield } from 'lucide-react';

const AGE_GROUPS = ['Child', 'Teen', 'Adult', 'Elderly'];
const HEALTH_CONDITIONS = [
  { id: 'None', label: 'None (Healthy)', desc: 'No known chronic conditions' },
  { id: 'Asthma', label: 'Asthma', desc: 'Airway hyper-reactivity to particulates' },
  { id: 'Heart Disease', label: 'Heart Disease', desc: 'Cardiovascular susceptibility to heat & AQI' },
  { id: 'Respiratory Problems', label: 'Respiratory Problems', desc: 'COPD, bronchitis, chronic cough' },
  { id: 'Allergies', label: 'Allergies / Hay Fever', desc: 'Pollen and airborne irritant sensitivity' },
];
const OCCUPATIONS = [
  { id: 'Indoor Worker', label: 'Indoor Worker', desc: 'Office / work from home' },
  { id: 'Outdoor Worker', label: 'Outdoor Worker', desc: 'Construction, delivery, landscaping, transit' },
  { id: 'Student', label: 'Student', desc: 'Campus & commuting exposure' },
  { id: 'Athlete', label: 'Athlete / Fitness', desc: 'High exertion & ventilation' },
  { id: 'Other', label: 'Other', desc: 'Variable daily exposure' },
];
const ACTIVITY_LEVELS = [
  { id: 'Low', label: 'Low', desc: 'Sedentary or gentle walking' },
  { id: 'Moderate', label: 'Moderate', desc: 'Occasional workouts & active lifestyle' },
  { id: 'High', label: 'High', desc: 'Intense endurance training or heavy labor' },
];

export default function ProfileModal({ isOpen, onClose, currentProfile, onSave }) {
  const [formData, setFormData] = useState({
    name: 'Alex',
    age_group: 'Adult',
    health_conditions: ['None'],
    occupation: 'Indoor Worker',
    activity_level: 'Moderate',
  });

  useEffect(() => {
    if (currentProfile) {
      setFormData({
        name: currentProfile.name || 'Alex',
        age_group: currentProfile.age_group || 'Adult',
        health_conditions: currentProfile.health_conditions || ['None'],
        occupation: currentProfile.occupation || 'Indoor Worker',
        activity_level: currentProfile.activity_level || 'Moderate',
      });
    }
  }, [currentProfile, isOpen]);

  if (!isOpen) return null;

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
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-7 border border-white/15 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Personal Health Profile</h2>
              <p className="text-xs text-slate-400">
                AeroHealth AI tailors risk scores and advisories according to these parameters.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* User Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name or Alias
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900/90 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="e.g. Alex"
              required
            />
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Age Group
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AGE_GROUPS.map((age) => (
                <button
                  type="button"
                  key={age}
                  onClick={() => setFormData({ ...formData, age_group: age })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    formData.age_group === age
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Health Conditions (Select all that apply)
              </label>
              <span className="text-[11px] text-slate-500">Affects pulmonary & cardiac weights</span>
            </div>
            <div className="space-y-2">
              {HEALTH_CONDITIONS.map((cond) => {
                const isChecked = formData.health_conditions.includes(cond.id);
                return (
                  <button
                    type="button"
                    key={cond.id}
                    onClick={() => handleConditionToggle(cond.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      isChecked
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                        : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">{cond.label}</div>
                      <div className="text-[11px] text-slate-400">{cond.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-2 ${
                      isChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600 bg-slate-800'
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
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Occupation / Exposure Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OCCUPATIONS.map((occ) => (
                <button
                  type="button"
                  key={occ.id}
                  onClick={() => setFormData({ ...formData, occupation: occ.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    formData.occupation === occ.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-bold">{occ.label}</div>
                  <div className="text-[11px] text-slate-400">{occ.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Physical Activity Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ACTIVITY_LEVELS.map((act) => (
                <button
                  type="button"
                  key={act.id}
                  onClick={() => setFormData({ ...formData, activity_level: act.id })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    formData.activity_level === act.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-bold">{act.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{act.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all"
            >
              Save & Apply Profile
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
