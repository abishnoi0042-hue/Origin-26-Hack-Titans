const API_BASE = '/api';

export async function fetchAllWeatherData(lat, lon, locationName = null) {
  const params = new URLSearchParams({ lat, lon });
  if (locationName) params.append('location_name', locationName);
  const res = await fetch(`${API_BASE}/weather/all?${params.toString()}`);
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.statusText}`);
  return res.json();
}

export async function fetchTrends(lat, lon) {
  const params = new URLSearchParams({ lat, lon });
  const res = await fetch(`${API_BASE}/weather/trends?${params.toString()}`);
  if (!res.ok) throw new Error(`Trends fetch failed: ${res.statusText}`);
  const data = await res.json();
  return data.trends || [];
}

export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  const params = new URLSearchParams({ q: query.trim() });
  const res = await fetch(`${API_BASE}/weather/search?${params.toString()}`);
  if (!res.ok) return [];
  return res.json();
}

export async function reverseGeocode(lat, lon) {
  const params = new URLSearchParams({ lat, lon });
  const res = await fetch(`${API_BASE}/weather/reverse-geocode?${params.toString()}`);
  if (!res.ok) return { name: 'Live Location', latitude: lat, longitude: lon };
  return res.json();
}

export async function generateAdvisory(weather, airQuality, profile) {
  const res = await fetch(`${API_BASE}/advisory/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weather, air_quality: airQuality, profile }),
  });
  if (!res.ok) throw new Error(`Advisory generation failed: ${res.statusText}`);
  return res.json();
}

export async function fetchDemoScenarios() {
  const res = await fetch(`${API_BASE}/demo/scenarios`);
  if (!res.ok) return [];
  return res.json();
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
