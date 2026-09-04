const PROFILE_KEY = 'aerohealth_user_profile';
const HISTORY_KEY = 'aerohealth_alert_history';

export const DEFAULT_PROFILE = {
  name: 'Alex',
  age_group: 'Adult',
  health_conditions: ['None'],
  occupation: 'Indoor Worker',
  activity_level: 'Moderate',
};

export function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load profile:", e);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile:", e);
  }
}

export function loadAlertHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load alert history:", e);
    return [];
  }
}

export function saveAlertToHistory(alertItem) {
  try {
    const history = loadAlertHistory();
    // Avoid duplicate within 2 minutes for the same location
    const itemWithId = {
      id: alertItem.id || `alert_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      ...alertItem,
    };
    const updated = [itemWithId, ...history.slice(0, 49)]; // keep latest 50
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save alert to history:", e);
    return [];
  }
}

export function deleteAlertFromHistory(alertId) {
  try {
    const history = loadAlertHistory();
    const updated = history.filter(item => item.id !== alertId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to delete alert:", e);
    return [];
  }
}

export function clearAlertHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return [];
  } catch (e) {
    console.error("Failed to clear alert history:", e);
    return [];
  }
}
