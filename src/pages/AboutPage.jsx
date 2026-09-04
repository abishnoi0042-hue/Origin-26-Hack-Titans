import React from 'react';
import { 
  Info, 
  MapPin, 
  CloudSun, 
  User, 
  Cpu, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  ArrowDown,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function AboutPage() {
  const steps = [
    {
      num: "01",
      title: "Live Location Telemetry",
      icon: MapPin,
      color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
      desc: "Resolves precise GPS coordinates or search query to pinpoint the micro-climate and urban pollution basin."
    },
    {
      num: "02",
      title: "Atmospheric & Air Quality Synthesis",
      icon: CloudSun,
      color: "text-sky-400 bg-sky-500/20 border-sky-500/30",
      desc: "Fetches live Open-Meteo weather (Temp, Humidity, UV, Wind, Rain) and real-time pollutants (PM2.5, PM10, CO, NO2, O3)."
    },
    {
      num: "03",
      title: "Personal Health Profile",
      icon: User,
      color: "text-purple-400 bg-purple-500/20 border-purple-500/30",
      desc: "Integrates individual age vulnerability, pre-existing conditions (Asthma, Heart, Allergies), occupational exposure, and respiration volume."
    },
    {
      num: "04",
      title: "0-100 Risk Scoring Engine",
      icon: Cpu,
      color: "text-amber-400 bg-amber-500/20 border-amber-500/30",
      desc: "Cross-calculates baseline environmental stress with personalized biological multipliers to generate an objective 0-100 risk index."
    },
    {
      num: "05",
      title: "AI Advisory Synthesis (Gemini / Groq / Fallback)",
      icon: Bot,
      color: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30",
      desc: "Feeds structured meteorological and physiological parameters into LLM prompt engineering to derive context-aware guidance."
    },
    {
      num: "06",
      title: "Actionable Health Guidance",
      icon: CheckCircle2,
      color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
      desc: "Delivers plain-English explanations of WHY risks exist, precise outdoor time windows, and proactive safety measures."
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hackathon Showcase Edition</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          AeroHealth AI
        </h1>
        <p className="text-base sm:text-xl text-emerald-400 font-medium">
          "Because environmental risk is personal."
        </p>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Standard weather apps and generic AQI alerts assume everyone has the same lungs, the same heart, and the same daily routine. AeroHealth AI fixes this by contextualizing ambient data for your body.
        </p>
      </div>

      {/* Problem vs Solution Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* The Problem */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-rose-500/20 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-bold">The Problem: Generic Alerts Fail People</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Conventional weather applications and municipal AQI broadcasts issue one-size-fits-all warnings (e.g. <em>"Air Quality is Moderate today"</em>). This misses critical human vulnerabilities:
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">✕</span>
              <span>An <strong>asthma patient</strong> faces acute bronchial inflammation at PM2.5 levels that a healthy adult barely notices.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">✕</span>
              <span>An <strong>outdoor construction worker</strong> endures 8+ continuous hours of solar UV, particulate inhalation, and heat strain.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">✕</span>
              <span>An <strong>elderly individual</strong> has compromised thermoregulation and cardiac reserves during temperature spikes.</span>
            </li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-lg font-bold">The Solution: AeroHealth AI</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            AeroHealth AI bridges environmental sensors with clinical risk models. By pairing live atmospheric telemetry with an individual's unique health traits, the system produces actionable, preventive intelligence:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>0-100 Personal Risk Score:</strong> Combines environmental stress with personal vulnerability multipliers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>AI Explaining "WHY":</strong> Clearly explains the physiological cause behind each recommendation in plain English.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>Dual-Engine Reliability:</strong> Uses Gemini or Groq LLMs with a 100% dependable clinical rule-based fallback.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Interactive Workflow Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-white">System Architecture & Processing Pipeline</h2>
          <p className="text-xs text-slate-400">How raw environmental data transforms into life-saving personalized advice</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="bg-slate-900/70 p-5 rounded-2xl border border-white/5 space-y-3 relative group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-500">{step.num}</span>
                  <div className={`p-2 rounded-xl border ${step.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-200">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Stack & Credits */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>Technology & Free Open Data Providers</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
            <div className="text-emerald-400 font-bold">FastAPI Backend</div>
            <div className="text-slate-400 text-[11px] mt-0.5">High-performance async Python</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
            <div className="text-sky-400 font-bold">React + Vite</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Tailwind CSS & Recharts</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
            <div className="text-amber-400 font-bold">Open-Meteo</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Free Weather & AQI APIs</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
            <div className="text-purple-400 font-bold">Gemini & Groq</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Free LLM & Fallback engine</div>
          </div>
        </div>
      </div>

    </div>
  );
}
