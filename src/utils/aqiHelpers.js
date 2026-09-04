export const AQI_LEVELS = [
  { min: 0, max: 50, label: "Good", color: "#10b981", bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", desc: "Air quality is satisfactory and poses little or no risk." },
  { min: 51, max: 100, label: "Moderate", color: "#f59e0b", bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", desc: "Acceptable quality; sensitive individuals may experience mild symptoms." },
  { min: 101, max: 150, label: "Unhealthy for Sensitive Groups", color: "#f97316", bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30", desc: "Members of sensitive groups may experience adverse health effects." },
  { min: 151, max: 200, label: "Unhealthy", color: "#ef4444", bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", desc: "Everyone may begin to experience respiratory effects." },
  { min: 201, max: 300, label: "Very Unhealthy", color: "#8b5cf6", bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30", desc: "Health alert: increased risk of health effects for all individuals." },
  { min: 301, max: 500, label: "Hazardous", color: "#7f1d1d", bg: "bg-rose-950/40", text: "text-rose-400", border: "border-rose-500/30", desc: "Health warning of emergency conditions. Entire population affected." },
];

export function getAqiCategory(aqi) {
  if (aqi == null) return AQI_LEVELS[0];
  for (const level of AQI_LEVELS) {
    if (aqi <= level.max) return level;
  }
  return AQI_LEVELS[AQI_LEVELS.length - 1];
}

export function getRiskBadge(level) {
  switch (level?.toLowerCase()) {
    case 'low':
      return { label: 'Low Risk', color: '#10b981', bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' };
    case 'moderate':
      return { label: 'Moderate Risk', color: '#f59e0b', bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' };
    case 'high':
      return { label: 'High Risk', color: '#f97316', bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/40' };
    case 'severe':
      return { label: 'Severe Risk', color: '#ef4444', bg: 'bg-rose-500/25', text: 'text-rose-300', border: 'border-rose-500/50' };
    default:
      return { label: 'Assessing...', color: '#94a3b8', bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/40' };
  }
}
