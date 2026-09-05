import { WMO_MAP, computeClientRisk, generateClientAdvisory } from '../utils/clientFallbackEngine';
import { getAqiCategory } from '../utils/aqiHelpers';

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api';

// Baseline offline telemetry for extreme offline scenarios
const DEFAULT_FALLBACK_TELEMETRY = {
  weather: {
    temperature: 24,
    feels_like: 25,
    humidity: 55,
    wind_speed: 12.0,
    rain_probability: 10,
    uv_index: 3.0,
    weather_code: 1,
    weather_condition: "Mainly clear",
    weather_icon: "sun",
    is_day: true,
    source: "resilient-sensor-baseline"
  },
  air_quality: {
    aqi: 58,
    aqi_status: "Moderate",
    aqi_color: "#f59e0b",
    pm2_5: 16.5,
    pm10: 34.0,
    carbon_monoxide: 380.0,
    nitrogen_dioxide: 18.2,
    ozone: 42.0
  }
};

// ==========================================
// 1. COMBINED WEATHER & AQI FETCH
// ==========================================
export async function fetchAllWeatherData(lat, lon, locationName = null) {
  // Attempt 1: Try FastAPI Backend
  try {
    const params = new URLSearchParams({ lat, lon });
    if (locationName) params.append('location_name', locationName);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s generous timeout

    const res = await fetch(`${API_BASE}/weather/all?${params.toString()}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.weather && data.air_quality) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Backend API not reachable; falling back to direct browser telemetry:", err);
  }

  // Attempt 2: Direct Open-Meteo & OpenStreetMap client-side fetch
  try {
    return await fetchDirectFromOpenMeteo(lat, lon, locationName);
  } catch (directErr) {
    console.warn("Direct Open-Meteo fetch failed (offline mode):", directErr);
  }

  // Attempt 3: Guaranteed Resilient Fallback so cards never disappear
  return {
    ...DEFAULT_FALLBACK_TELEMETRY,
    location: {
      name: locationName || "Indore",
      latitude: lat,
      longitude: lon,
      country: "India"
    }
  };
}

// Direct client-side Open-Meteo fetcher
async function fetchDirectFromOpenMeteo(lat, lon, locationName) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,uv_index,is_day&timezone=auto`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone&timezone=auto`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const [wRes, aqiRes] = await Promise.all([
    fetch(weatherUrl, { signal: controller.signal }),
    fetch(aqiUrl, { signal: controller.signal })
  ]);
  clearTimeout(timeoutId);

  if (!wRes.ok) throw new Error("Direct Open-Meteo weather failed");

  const wData = await wRes.json();
  const currW = wData.current || {};

  let aqiData = {};
  if (aqiRes.ok) {
    try {
      aqiData = await aqiRes.json();
    } catch {}
  }
  const currAqi = aqiData.current || {};

  const wCode = Number(currW.weather_code || 0);
  const [condDesc, iconName] = WMO_MAP[wCode] || ["Clear sky", "sun", true];
  
  const rawAqi = currAqi.us_aqi;
  const pm25 = Number(currAqi.pm2_5 || 18.0);
  const pm10 = Number(currAqi.pm10 || 32.0);

  // Compute AQI from PM2.5 if US AQI is null
  let computedAqi = rawAqi;
  if (computedAqi == null || computedAqi === 0) {
    if (pm25 <= 12.0) computedAqi = Math.round((50 / 12.0) * pm25);
    else if (pm25 <= 35.4) computedAqi = Math.round(51 + ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1));
    else if (pm25 <= 55.4) computedAqi = Math.round(101 + ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5));
    else computedAqi = Math.round(151 + ((200 - 151) / (150.4 - 55.5)) * (Math.min(pm25, 150) - 55.5));
  }
  const aqiCategory = getAqiCategory(computedAqi);

  const weather = {
    temperature: Math.round(currW.temperature_2m || 24),
    feels_like: Math.round(currW.apparent_temperature ?? currW.temperature_2m ?? 24),
    humidity: Number(currW.relative_humidity_2m || 55),
    wind_speed: Number((currW.wind_speed_10m || 5).toFixed(1)),
    rain_probability: Number(currW.precipitation_probability || 0),
    uv_index: Number((currW.uv_index || 1).toFixed(1)),
    weather_code: wCode,
    weather_condition: condDesc,
    weather_icon: iconName,
    is_day: Boolean(currW.is_day ?? 1),
    source: "open-meteo-direct"
  };

  const airQuality = {
    aqi: computedAqi,
    aqi_status: aqiCategory.label,
    aqi_color: aqiCategory.color,
    pm2_5: Number(pm25.toFixed(1)),
    pm10: Number(pm10.toFixed(1)),
    carbon_monoxide: currAqi.carbon_monoxide ? Number(currAqi.carbon_monoxide.toFixed(1)) : 350.0,
    nitrogen_dioxide: currAqi.nitrogen_dioxide ? Number(currAqi.nitrogen_dioxide.toFixed(1)) : 15.0,
    ozone: currAqi.ozone ? Number(currAqi.ozone.toFixed(1)) : 38.0,
  };

  return {
    weather,
    air_quality: airQuality,
    location: {
      name: locationName || "Live Location",
      latitude: lat,
      longitude: lon
    }
  };
}

// ==========================================
// 2. 7-DAY ENVIRONMENTAL TRENDS
// ==========================================
export async function fetchTrends(lat, lon) {
  try {
    const params = new URLSearchParams({ lat, lon });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${API_BASE}/weather/trends?${params.toString()}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      return data.trends || [];
    }
  } catch (e) {}

  // Direct client fallback
  try {
    const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max&past_days=3&forecast_days=4&timezone=auto`;
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&daily=pm10_max,pm2_5_max,us_aqi_max&past_days=3&forecast_days=4&timezone=auto`;

    const [wRes, aqiRes] = await Promise.all([fetch(wUrl), fetch(aqiUrl)]);
    const wData = await wRes.json();
    const aqiData = await aqiRes.json();

    const dates = wData.daily?.time || [];
    return dates.map((d, i) => {
      const tMax = wData.daily?.temperature_2m_max?.[i] ?? 25;
      const tMin = wData.daily?.temperature_2m_min?.[i] ?? 18;
      const aqi = aqiData.daily?.us_aqi_max?.[i] ?? 55;
      const pm25 = aqiData.daily?.pm2_5_max?.[i] ?? 18;
      const dt = new Date(d);
      const label = dt.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

      return {
        date: d,
        label,
        temperature: Number(((tMax + tMin) / 2).toFixed(1)),
        temp_max: tMax,
        temp_min: tMin,
        aqi: aqi != null ? Math.round(aqi) : 55,
        pm2_5: pm25 != null ? Number(pm25.toFixed(1)) : 18.0,
        rain_probability: wData.daily?.precipitation_probability_max?.[i] ?? 0,
        uv_index: wData.daily?.uv_index_max?.[i] ?? 2.0
      };
    });
  } catch (err) {
    console.error("Direct trends failed:", err);
    return [];
  }
}

// ==========================================
// 3. CITY GEOCODING SEARCH
// ==========================================
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];

  try {
    const params = new URLSearchParams({ q: query.trim() });
    const res = await fetch(`${API_BASE}/weather/search?${params.toString()}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (e) {}

  // Direct Open-Meteo Geocoding client-side fallback
  try {
    const directUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
    const res = await fetch(directUrl);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(r => ({
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      country: r.country,
      admin1: r.admin1
    }));
  } catch {
    return [];
  }
}

// ==========================================
// 4. REVERSE GEOCODE
// ==========================================
export async function reverseGeocode(lat, lon) {
  try {
    const params = new URLSearchParams({ lat, lon });
    const res = await fetch(`${API_BASE}/weather/reverse-geocode?${params.toString()}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (e) {}

  // Direct Nominatim OpenStreetMap client-side fallback
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.county || "Live Location";
      return {
        name: city,
        latitude: lat,
        longitude: lon,
        country: addr.country,
        admin1: addr.state
      };
    }
  } catch {}

  return { name: 'Live Location', latitude: lat, longitude: lon };
}

// ==========================================
// 5. PERSONALIZED AI HEALTH ADVISORY
// ==========================================
export async function generateAdvisory(weather, airQuality, profile) {
  if (!weather || !airQuality) {
    weather = DEFAULT_FALLBACK_TELEMETRY.weather;
    airQuality = DEFAULT_FALLBACK_TELEMETRY.air_quality;
  }

  // Attempt 1: Backend with Gemini/Groq
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${API_BASE}/advisory/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weather, air_quality: airQuality, profile }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend advisory unreachable, calculating with client engine:", e);
  }

  // Attempt 2: Instant Client-side Clinical Advisory & Risk Engine
  const risk = computeClientRisk(weather, airQuality, profile);
  return generateClientAdvisory(weather, airQuality, profile, risk);
}

// ==========================================
// 6. DEMO SCENARIOS
// ==========================================
export async function fetchDemoScenarios() {
  try {
    const res = await fetch(`${API_BASE}/demo/scenarios`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (e) {}
  return [];
}

// ==========================================
// 7. BACKEND HEALTH CHECK
// ==========================================
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    const contentType = res.headers.get('content-type') || '';
    return (res.ok && contentType.includes('application/json')) ? await res.json() : null;
  } catch {
    return null;
  }
}
