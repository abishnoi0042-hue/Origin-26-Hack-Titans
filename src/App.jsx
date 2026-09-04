import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import DynamicBackground from './components/DynamicBackground';
import ProfileModal from './components/ProfileModal';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';

import { 
  fetchAllWeatherData, 
  fetchTrends, 
  generateAdvisory, 
  checkBackendHealth 
} from './services/api';

import { 
  loadProfile, 
  saveProfile, 
  loadAlertHistory, 
  saveAlertToHistory, 
  deleteAlertFromHistory, 
  clearAlertHistory 
} from './utils/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState(loadProfile);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Location state (defaults to Indore, India as hackathon baseline)
  const [currentLocation, setCurrentLocation] = useState({
    name: 'Indore',
    latitude: 22.7196,
    longitude: 75.8577,
    country: 'India',
    admin1: 'Madhya Pradesh'
  });

  // Environmental Telemetry
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [advisoryData, setAdvisoryData] = useState(null);
  
  // App state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(loadAlertHistory);
  const [isSaved, setIsSaved] = useState(false);
  const [backendHealth, setBackendHealth] = useState(null);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then(setBackendHealth);
  }, []);

  // Fetch Environmental Data & Trends
  const loadEnvironmentalData = useCallback(async (loc) => {
    setIsLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      // 1. Fetch live weather and AQI
      const combined = await fetchAllWeatherData(loc.latitude, loc.longitude, loc.name);
      setWeatherData(combined.weather);
      setAirQualityData(combined.air_quality);
      if (combined.location?.name && combined.location.name !== 'Live Location') {
        setCurrentLocation(prev => ({
          ...prev,
          name: combined.location.name,
          country: combined.location.country || prev.country,
          admin1: combined.location.admin1 || prev.admin1
        }));
      }

      // 2. Fetch 7-day trends in parallel
      fetchTrends(loc.latitude, loc.longitude)
        .then(setTrendsData)
        .catch(err => console.warn("Trends fetch warning:", err));

      // 3. Generate initial advisory
      const adv = await generateAdvisory(combined.weather, combined.air_quality, userProfile);
      setAdvisoryData(adv);

    } catch (err) {
      console.error("Telemetry load failed:", err);
      setError("Unable to connect to environmental sensors. Please verify network or retry.");
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]);

  // Initial load or location change
  useEffect(() => {
    loadEnvironmentalData(currentLocation);
  }, [currentLocation.latitude, currentLocation.longitude]);

  // Re-generate advisory when userProfile changes (e.g. from demo scenario or modal)
  const refreshAdvisoryForProfile = async (newProfile) => {
    if (!weatherData || !airQualityData) return;
    setIsLoading(true);
    setIsSaved(false);
    try {
      const adv = await generateAdvisory(weatherData, airQualityData, newProfile);
      setAdvisoryData(adv);
    } catch (err) {
      console.error("Advisory recalculation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Location Change
  const handleLocationChange = (newLoc) => {
    setCurrentLocation(newLoc);
  };

  // Handle Profile Update
  const handleSaveProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    saveProfile(updatedProfile);
    refreshAdvisoryForProfile(updatedProfile);
  };

  // Handle Demo Scenario Click
  const handleSelectScenario = (scenarioProfile) => {
    setUserProfile(scenarioProfile);
    saveProfile(scenarioProfile);
    refreshAdvisoryForProfile(scenarioProfile);
  };

  // Save advisory snapshot to local history
  const handleSaveAlert = () => {
    if (!advisoryData || !weatherData || !airQualityData) return;
    
    const alertItem = {
      location: currentLocation.name,
      temperature: weatherData.temperature,
      aqi: airQualityData.aqi,
      risk_level: advisoryData.risk_level,
      summary: advisoryData.summary,
      user_name: userProfile.name,
    };

    const updated = saveAlertToHistory(alertItem);
    setHistory(updated);
    setIsSaved(true);
  };

  // Delete single alert
  const handleDeleteAlert = (alertId) => {
    const updated = deleteAlertFromHistory(alertId);
    setHistory(updated);
  };

  // Clear all alert history
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your advisory history?")) {
      const updated = clearAlertHistory();
      setHistory(updated);
    }
  };

  return (
    <DynamicBackground 
      weatherCode={weatherData?.weather_code ?? 0}
      aqi={airQualityData?.aqi ?? 50}
      isDay={weatherData?.is_day ?? true}
    >
      <div className="min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          userProfile={userProfile}
          onEditProfile={() => setIsProfileModalOpen(true)}
          backendStatus={backendHealth}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {currentTab === 'dashboard' && (
            <DashboardPage
              weatherData={weatherData}
              airQualityData={airQualityData}
              advisoryData={advisoryData}
              trendsData={trendsData}
              currentLocation={currentLocation}
              userProfile={userProfile}
              onLocationChange={handleLocationChange}
              onSelectScenario={handleSelectScenario}
              onSaveAlert={handleSaveAlert}
              isSaved={isSaved}
              onRefreshAdvisory={() => refreshAdvisoryForProfile(userProfile)}
              isLoading={isLoading}
              error={error}
            />
          )}

          {currentTab === 'profile' && (
            <ProfilePage
              currentProfile={userProfile}
              onSaveProfile={handleSaveProfile}
            />
          )}

          {currentTab === 'history' && (
            <HistoryPage
              history={history}
              onDeleteAlert={handleDeleteAlert}
              onClearHistory={handleClearHistory}
            />
          )}

          {currentTab === 'about' && (
            <AboutPage />
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-white/10 glass-panel py-6 mt-12 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🌍</span>
              <span className="font-bold text-slate-200">AeroHealth AI</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400">"Because environmental risk is personal."</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span>Open-Meteo Telemetry</span>
              <span>•</span>
              <span>Google Gemini / Groq Cloud AI</span>
              <span>•</span>
              <span>Production Hackathon Edition</span>
            </div>
          </div>
        </footer>

        {/* Quick Profile Edit Modal */}
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentProfile={userProfile}
          onSave={handleSaveProfile}
        />
      </div>
    </DynamicBackground>
  );
}
