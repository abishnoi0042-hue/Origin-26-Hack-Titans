import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  CloudRain, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudLightning,
  Snowflake,
  ShieldAlert
} from 'lucide-react';

function getWeatherIconComponent(iconName) {
  switch (iconName) {
    case 'sun':
      return <Sun className="w-9 h-9 text-amber-400 animate-spin-slow" />;
    case 'cloud-sun':
      return <CloudSun className="w-9 h-9 text-amber-300" />;
    case 'cloud':
      return <Cloud className="w-9 h-9 text-slate-300" />;
    case 'cloud-drizzle':
    case 'cloud-rain':
    case 'cloud-rain-heavy':
    case 'cloud-sun-rain':
      return <CloudRain className="w-9 h-9 text-sky-400 animate-pulse" />;
    case 'cloud-lightning':
    case 'cloud-lightning-rain':
      return <CloudLightning className="w-9 h-9 text-purple-400 animate-pulse" />;
    case 'cloud-fog':
      return <CloudFog className="w-9 h-9 text-slate-400" />;
    case 'snowflake':
      return <Snowflake className="w-9 h-9 text-cyan-300" />;
    default:
      return <Sun className="w-9 h-9 text-amber-400" />;
  }
}

export default function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between h-full border border-white/10 relative overflow-hidden">
      
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Card 1</h3>
            <h2 className="text-base font-bold text-slate-100">Current Weather</h2>
          </div>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-medium">
          Live Sensors
        </span>
      </div>

      {/* Main Temperature & Condition Display */}
      <div className="py-4 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              {Math.round(weather.temperature)}
            </span>
            <span className="text-2xl font-light text-slate-400">°C</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <span>Feels like <strong className="text-slate-200">{Math.round(weather.feels_like)}°C</strong></span>
          </div>
          <div className="text-sm font-semibold text-emerald-400 mt-1">
            {weather.weather_condition}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          {getWeatherIconComponent(weather.weather_icon)}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/10">
        
        {/* Humidity */}
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Humidity</div>
            <div className="text-sm font-bold text-slate-200">{weather.humidity}%</div>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-500/15 text-teal-400">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Wind Speed</div>
            <div className="text-sm font-bold text-slate-200">{weather.wind_speed} <span className="text-[10px] font-normal text-slate-400">km/h</span></div>
          </div>
        </div>

        {/* Rain Probability */}
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Precipitation</div>
            <div className="text-sm font-bold text-slate-200">{weather.rain_probability}%</div>
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">UV Index</div>
            <div className="text-sm font-bold text-slate-200">
              {weather.uv_index}
              <span className={`ml-1 text-[10px] font-normal ${
                weather.uv_index >= 8 ? 'text-rose-400' :
                weather.uv_index >= 6 ? 'text-orange-400' :
                weather.uv_index >= 3 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {weather.uv_index >= 8 ? 'Very High' : weather.uv_index >= 6 ? 'High' : weather.uv_index >= 3 ? 'Moderate' : 'Low'}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
