export function getWeatherTheme(weatherCode, aqi, isDay = true) {
  // If AQI is hazardous/very unhealthy, trigger the atmospheric smog alert theme
  if (aqi >= 200) {
    return {
      id: 'smog-alert',
      name: 'Hazardous Smog Atmosphere',
      bgGradient: 'from-amber-950/80 via-slate-900 to-rose-950/90',
      accentColor: 'text-amber-400',
      glowColor: 'rgba(245, 158, 11, 0.15)',
      mood: 'smog'
    };
  }

  // WMO Code categorization
  // Thunderstorm: 95, 96, 99, 82
  if ([95, 96, 99, 82].includes(weatherCode)) {
    return {
      id: 'thunderstorm',
      name: 'Electric Thunderstorm',
      bgGradient: 'from-slate-950 via-purple-950/70 to-indigo-950',
      accentColor: 'text-purple-400',
      glowColor: 'rgba(168, 85, 247, 0.2)',
      mood: 'thunder'
    };
  }

  // Rain: 51-67, 80, 81
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81].includes(weatherCode)) {
    return {
      id: 'rain',
      name: 'Rain & Precipitation',
      bgGradient: 'from-slate-950 via-sky-950/60 to-blue-950',
      accentColor: 'text-sky-400',
      glowColor: 'rgba(56, 189, 248, 0.15)',
      mood: 'rain'
    };
  }

  // Snow: 71, 73, 75, 77, 85, 86
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return {
      id: 'snow',
      name: 'Snow & Frost',
      bgGradient: 'from-slate-950 via-teal-950/40 to-slate-900',
      accentColor: 'text-cyan-300',
      glowColor: 'rgba(103, 232, 249, 0.15)',
      mood: 'snow'
    };
  }

  // Fog / Mist: 45, 48
  if ([45, 48].includes(weatherCode)) {
    return {
      id: 'fog',
      name: 'Mist & Diffused Fog',
      bgGradient: 'from-slate-950 via-zinc-900 to-slate-900',
      accentColor: 'text-slate-300',
      glowColor: 'rgba(148, 163, 184, 0.12)',
      mood: 'fog'
    };
  }

  // Overcast / Cloudy: 2, 3
  if ([2, 3].includes(weatherCode)) {
    return {
      id: 'cloudy',
      name: 'Overcast Skies',
      bgGradient: 'from-slate-950 via-blue-950/40 to-slate-900',
      accentColor: 'text-blue-300',
      glowColor: 'rgba(147, 197, 253, 0.12)',
      mood: 'cloudy'
    };
  }

  // Clear / Sunny
  if (isDay) {
    return {
      id: 'sunny',
      name: 'Sunlit Azure Sky',
      bgGradient: 'from-slate-950 via-emerald-950/40 to-cyan-950/70',
      accentColor: 'text-emerald-400',
      glowColor: 'rgba(52, 211, 153, 0.18)',
      mood: 'sunny'
    };
  } else {
    return {
      id: 'night-clear',
      name: 'Indigo Starlit Night',
      bgGradient: 'from-slate-950 via-indigo-950/80 to-slate-950',
      accentColor: 'text-indigo-400',
      glowColor: 'rgba(129, 140, 248, 0.15)',
      mood: 'night'
    };
  }
}
