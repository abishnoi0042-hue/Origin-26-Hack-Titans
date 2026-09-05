// Client-side fallback engine to ensure AeroHealth AI works 100% reliably
// even if deployed as a standalone frontend on Vercel, Netlify, or GitHub Pages
// without a running backend server.

export const WMO_MAP = {
  0: ["Clear sky", "sun", true],
  1: ["Mainly clear", "sun", true],
  2: ["Partly cloudy", "cloud-sun", true],
  3: ["Overcast", "cloud", false],
  45: ["Fog", "cloud-fog", false],
  48: ["Depositing rime fog", "cloud-fog", false],
  51: ["Light drizzle", "cloud-drizzle", false],
  53: ["Moderate drizzle", "cloud-drizzle", false],
  55: ["Dense drizzle", "cloud-drizzle", false],
  56: ["Light freezing drizzle", "cloud-hail", false],
  57: ["Dense freezing drizzle", "cloud-hail", false],
  61: ["Slight rain", "cloud-rain", false],
  63: ["Moderate rain", "cloud-rain", false],
  65: ["Heavy rain", "cloud-rain-heavy", false],
  66: ["Light freezing rain", "cloud-snow", false],
  67: ["Heavy freezing rain", "cloud-snow", false],
  71: ["Slight snow fall", "snowflake", false],
  73: ["Moderate snow fall", "snowflake", false],
  75: ["Heavy snow fall", "snowflake", false],
  77: ["Snow grains", "snowflake", false],
  80: ["Slight rain showers", "cloud-sun-rain", true],
  81: ["Moderate rain showers", "cloud-rain", false],
  82: ["Violent rain showers", "cloud-lightning-rain", false],
  85: ["Slight snow showers", "cloud-snow", false],
  86: ["Heavy snow showers", "cloud-snow", false],
  95: ["Thunderstorm", "cloud-lightning", false],
  96: ["Thunderstorm with slight hail", "cloud-lightning", false],
  99: ["Thunderstorm with heavy hail", "cloud-lightning", false],
};

export function computeClientRisk(weather, aqiData, profile) {
  const primaryFactors = [];
  const aqi = aqiData.aqi || 50;

  // 1. AQI stress
  let aqiStress;
  if (aqi <= 50) aqiStress = (aqi / 50) * 20;
  else if (aqi <= 100) aqiStress = 20 + ((aqi - 50) / 50) * 25;
  else if (aqi <= 150) aqiStress = 45 + ((aqi - 100) / 50) * 25;
  else if (aqi <= 200) aqiStress = 70 + ((aqi - 150) / 50) * 15;
  else aqiStress = 85 + Math.min(15, ((aqi - 200) / 100) * 15);

  // 2. Temp stress
  const feelsLike = weather.feels_like ?? weather.temperature;
  let tempStress;
  if (feelsLike >= 18 && feelsLike <= 25) {
    tempStress = 5;
  } else if (feelsLike > 25) {
    if (feelsLike <= 32) tempStress = 10 + ((feelsLike - 25) / 7) * 25;
    else if (feelsLike <= 38) tempStress = 35 + ((feelsLike - 32) / 6) * 35;
    else tempStress = 70 + Math.min(30, ((feelsLike - 38) / 10) * 30);
  } else {
    if (feelsLike >= 10) tempStress = 10 + ((18 - feelsLike) / 8) * 20;
    else if (feelsLike >= 0) tempStress = 30 + ((10 - feelsLike) / 10) * 35;
    else tempStress = 65 + Math.min(35, (Math.abs(feelsLike) / 20) * 35);
  }

  // 3. UV stress
  const uv = weather.uv_index || 1;
  let uvStress;
  if (uv <= 2) uvStress = uv * 7.5;
  else if (uv <= 5) uvStress = 15 + ((uv - 2) / 3) * 25;
  else if (uv <= 7) uvStress = 40 + ((uv - 5) / 2) * 30;
  else if (uv <= 10) uvStress = 70 + ((uv - 7) / 3) * 20;
  else uvStress = 95;

  const windStress = Math.min(100, (weather.wind_speed / 60) * 100);
  const rainStress = Number(weather.rain_probability || 0);

  const baseEnv = (
    0.45 * aqiStress +
    0.25 * tempStress +
    0.18 * uvStress +
    0.12 * ((windStress + rainStress) / 2)
  );

  let aqiMultiplier = 1.0;
  let tempMultiplier = 1.0;
  let uvMultiplier = 1.0;
  let overallMultiplier = 1.0;

  const conditions = profile?.health_conditions || ['None'];
  const hasAsthma = conditions.includes('Asthma');
  const hasHeart = conditions.includes('Heart Disease');
  const hasResp = conditions.includes('Respiratory Problems');
  const hasAllergies = conditions.includes('Allergies');

  if (hasAsthma) {
    aqiMultiplier += 0.55;
    if (aqi > 50 || aqiData.pm2_5 > 25) primaryFactors.push("Asthma sensitivity to particulate matter & AQI");
  }
  if (hasResp) {
    aqiMultiplier += 0.50;
    tempMultiplier += 0.25;
    if (aqi > 50) primaryFactors.push("Respiratory vulnerability under current ambient conditions");
  }
  if (hasHeart) {
    tempMultiplier += 0.55;
    aqiMultiplier += 0.35;
    if (feelsLike > 32 || feelsLike < 5 || aqi > 75) primaryFactors.push("Cardiovascular strain from temperature/air quality");
  }
  if (hasAllergies) {
    aqiMultiplier += 0.25;
    if (weather.wind_speed > 15 || aqi > 70) primaryFactors.push("Allergy susceptibility exacerbated by wind and airborne particulates");
  }

  if (profile?.age_group === "Child") {
    aqiMultiplier += 0.30;
    uvMultiplier += 0.25;
    if (aqi > 50) primaryFactors.push("Developing pediatric pulmonary system needs protection");
  } else if (profile?.age_group === "Elderly") {
    tempMultiplier += 0.45;
    aqiMultiplier += 0.35;
    if (feelsLike > 30 || feelsLike < 10) primaryFactors.push("Elderly thermoregulation risk during extreme temperatures");
  } else if (profile?.age_group === "Teen") {
    aqiMultiplier += 0.05;
  }

  if (profile?.occupation === "Outdoor Worker") {
    uvMultiplier += 0.45;
    tempMultiplier += 0.40;
    aqiMultiplier += 0.35;
    primaryFactors.push("Prolonged ambient occupational exposure");
  } else if (profile?.occupation === "Athlete") {
    aqiMultiplier += 0.30;
    tempMultiplier += 0.25;
    primaryFactors.push("Elevated ventilation rate and exposure during athletic exertion");
  } else if (profile?.occupation === "Indoor Worker") {
    overallMultiplier *= 0.90;
  }

  if (profile?.activity_level === "High") {
    aqiMultiplier += 0.25;
    tempMultiplier += 0.20;
  } else if (profile?.activity_level === "Low") {
    overallMultiplier *= 0.92;
  }

  const pAqi = Math.min(100, aqiStress * aqiMultiplier);
  const pTemp = Math.min(100, tempStress * tempMultiplier);
  const pUv = Math.min(100, uvStress * uvMultiplier);

  const composite = (
    0.45 * pAqi +
    0.25 * pTemp +
    0.18 * pUv +
    0.12 * ((windStress + rainStress) / 2)
  ) * overallMultiplier;

  const score = Math.max(0, Math.min(100, Math.round(composite)));

  let level = "Low";
  let color = "#10b981";
  if (score <= 25) {
    level = "Low";
    color = "#10b981";
    if (primaryFactors.length === 0) primaryFactors.push("Favorable environmental conditions for your profile");
  } else if (score <= 50) {
    level = "Moderate";
    color = "#f59e0b";
    if (primaryFactors.length === 0) primaryFactors.push("Moderate ambient factors require mild precautions");
  } else if (score <= 75) {
    level = "High";
    color = "#f97316";
    if (primaryFactors.length === 0) primaryFactors.push("Significant environmental stress relative to your health profile");
  } else {
    level = "Severe";
    color = "#ef4444";
    if (primaryFactors.length === 0) primaryFactors.push("Hazardous environmental conditions posing immediate health risks");
  }

  return {
    score,
    level,
    color,
    primary_factors: primaryFactors.slice(0, 4),
    environmental_score: Math.round(baseEnv),
    vulnerability_multiplier: Number((score / Math.max(1, baseEnv)).toFixed(2))
  };
}

export function generateClientAdvisory(weather, aqiData, profile, risk) {
  const conditions = profile?.health_conditions || ['None'];
  const hasAsthma = conditions.includes('Asthma');
  const hasHeart = conditions.includes('Heart Disease');
  const hasResp = conditions.includes('Respiratory Problems');
  const hasAllergies = conditions.includes('Allergies');
  const isOutdoor = ['Outdoor Worker', 'Athlete'].includes(profile?.occupation);
  const isElderly = profile?.age_group === 'Elderly';

  let summary = "";
  if (hasAsthma && (aqiData.aqi > 70 || aqiData.pm2_5 > 25)) {
    summary = `Because you have asthma and the current AQI is ${aqiData.aqi} with PM2.5 at ${aqiData.pm2_5} µg/m³, your airway is particularly susceptible to bronchospasm and irritation today. Limit prolonged outdoor exertion.`;
  } else if (hasResp && aqiData.aqi > 60) {
    summary = `Given your respiratory sensitivity and an elevated AQI of ${aqiData.aqi}, particulate matter can trigger coughing or shortness of breath. Ensure indoor spaces remain well-filtered.`;
  } else if (hasHeart && (weather.feels_like > 32 || weather.feels_like < 5)) {
    summary = `As someone managing heart disease, current thermal stress (${weather.feels_like}°C feels-like) puts increased workload on your cardiovascular system. Avoid strenuous physical activity outdoors.`;
  } else if (isOutdoor && (weather.uv_index >= 6 || weather.feels_like > 30)) {
    summary = `You are an ${profile.occupation.toLowerCase()} exposed to continuous outdoor conditions. With a high UV index of ${weather.uv_index} and temperatures around ${weather.temperature}°C, active heat and radiation protection is essential.`;
  } else if (isElderly && (weather.feels_like > 30 || aqiData.aqi > 80)) {
    summary = `For older adults, the combination of temperature (${weather.temperature}°C) and air quality (AQI ${aqiData.aqi}) can cause accelerated fatigue and dehydration. Stay in climate-controlled environments when possible.`;
  } else if (aqiData.aqi <= 50 && weather.feels_like <= 28) {
    summary = `Environmental conditions are currently clean (AQI ${aqiData.aqi}) and temperature is comfortable at ${weather.temperature}°C. It is a great day for outdoor activities, work, and exercise.`;
  } else {
    summary = `Current conditions show an AQI of ${aqiData.aqi} (${aqiData.aqi_status}) with temperatures around ${weather.temperature}°C. Based on your profile as an ${profile.age_group.toLowerCase()} with ${profile.activity_level.toLowerCase()} activity, maintain standard precautions.`;
  }

  let outdoorActivity = "";
  if (risk.level === "Severe") outdoorActivity = "Avoid all non-essential outdoor activities. Stay indoors with air filtration and sealed windows.";
  else if (risk.level === "High") outdoorActivity = isOutdoor ? "Mandate frequent rest breaks in shaded areas. Shorten shift intensity." : "Significantly reduce outdoor exertion. Relocate workouts indoors.";
  else if (risk.level === "Moderate") outdoorActivity = "Moderate outdoor activities are generally safe, but take regular breaks and avoid heavy workouts during peak traffic.";
  else outdoorActivity = "Ideal conditions for outdoor walks, sports, commuting, and recreational activities.";

  const healthPrecautions = [];
  if (hasAsthma) {
    healthPrecautions.push("Keep your fast-acting rescue inhaler readily accessible at all times.");
    if (aqiData.aqi > 60) healthPrecautions.push("Wear a well-fitted N95/FFP2 respirator mask if spending more than 15 minutes outdoors.");
  }
  if (hasHeart) healthPrecautions.push("Monitor blood pressure and pulse; rest immediately if experiencing palpitations or lightheadedness.");
  if (hasAllergies) healthPrecautions.push("Take prescribed antihistamines if needed, and rinse your face after returning indoors.");
  if (isElderly) healthPrecautions.push("Drink water at regular scheduled intervals even if you do not feel thirsty.");
  if (healthPrecautions.length === 0) {
    healthPrecautions.push("Maintain routine healthy hydration (at least 2.5 - 3 liters throughout the day).");
    healthPrecautions.push("Monitor for dry eyes, throat tickle, or minor fatigue during extended periods outside.");
  }

  const weatherPrecautions = [];
  if (weather.uv_index >= 6) weatherPrecautions.push(`Apply broad-spectrum SPF 50+ sunscreen, wear UV-blocking sunglasses, and don a hat (UV Index: ${weather.uv_index}).`);
  else if (weather.uv_index >= 3) weatherPrecautions.push("Apply SPF 30+ sunscreen if outdoors for longer than 30 minutes.");
  if (weather.temperature >= 33 || weather.feels_like >= 35) weatherPrecautions.push("High heat danger: Drink cool electrolyte-rich fluids and seek air-conditioned shelter frequently.");
  else if (weather.temperature <= 10) weatherPrecautions.push("Cold stress: Dress in warm breathable layers and protect extremities from chill.");
  if (weather.rain_probability >= 50) weatherPrecautions.push(`High precipitation probability (${weather.rain_probability}%): Carry waterproof gear.`);
  if (weatherPrecautions.length === 0) weatherPrecautions.push("Mild atmospheric conditions: standard comfortable seasonal attire is recommended.");

  let bestTimeOutside = "Late morning to early afternoon (10:00 AM – 3:00 PM) offers the most pleasant conditions today.";
  if (weather.uv_index >= 6 || weather.temperature >= 32) bestTimeOutside = "Early morning (before 8:30 AM) or evening (after 5:30 PM) when solar radiation and heat diminish.";
  else if (aqiData.aqi > 100) bestTimeOutside = "Early morning or late afternoon when industrial and rush-hour emissions settle.";

  const thingsToAvoid = [];
  if (aqiData.aqi > 80) thingsToAvoid.push("Jogging or cycling along busy roadways and high-traffic corridors.");
  if (weather.uv_index >= 6) thingsToAvoid.push("Unprotected sunbathing or direct exposure between 11:00 AM and 3:00 PM.");
  if (weather.temperature >= 32) thingsToAvoid.push("Excessive caffeine or sugary energy drinks that accelerate dehydration.");
  if (hasAsthma || hasResp) thingsToAvoid.push("Wood smoke, burning incense, or vigorous outdoor sprints.");
  if (thingsToAvoid.length === 0) thingsToAvoid.push("Prolonged sedentary indoor screen time; take advantage of clean ambient conditions.");

  return {
    risk_level: risk.level,
    risk_score: risk.score,
    summary,
    outdoor_activity: outdoorActivity,
    health_precautions: healthPrecautions,
    weather_precautions: weatherPrecautions,
    best_time_outside: bestTimeOutside,
    things_to_avoid: thingsToAvoid,
    risk_breakdown: {
      environmental_stress: risk.environmental_score,
      vulnerability_multiplier: risk.vulnerability_multiplier,
      primary_factors: risk.primary_factors
    },
    ai_provider: "client_fallback_engine",
    disclaimer: "This advisory is for informational purposes only and is not a substitute for professional medical advice."
  };
}
