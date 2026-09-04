import React from 'react';
import DemoScenarioSelector from '../components/DemoScenarioSelector';
import LocationSearch from '../components/LocationSearch';
import WeatherCard from '../components/WeatherCard';
import AQICard from '../components/AQICard';
import RiskGaugeCard from '../components/RiskGaugeCard';
import AIAdvisoryCard from '../components/AIAdvisoryCard';
import TrendsChart from '../components/TrendsChart';
import SkeletonLoader from '../components/SkeletonLoader';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function DashboardPage({
  weatherData,
  airQualityData,
  advisoryData,
  trendsData,
  currentLocation,
  userProfile,
  onLocationChange,
  onSelectScenario,
  onSaveAlert,
  isSaved,
  onRefreshAdvisory,
  isLoading,
  error,
}) {
  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Hackathon Demo Scenario Selector */}
      <DemoScenarioSelector 
        activeProfile={userProfile} 
        onSelectProfile={onSelectScenario} 
      />

      {/* 2. Location Search & GPS Selector */}
      <LocationSearch 
        currentLocation={currentLocation} 
        onLocationChange={onLocationChange} 
        isLoading={isLoading} 
      />

      {/* Error state notification if any */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <strong>Environmental Sensor Notice: </strong> {error}
          </div>
          <button 
            onClick={onRefreshAdvisory}
            className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* 3. Main Loading or Dashboard Content */}
      {isLoading && !weatherData ? (
        <SkeletonLoader />
      ) : (
        <>
          {/* Main 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Current Weather */}
            <WeatherCard weather={weatherData} />

            {/* Card 2: Air Quality Index */}
            <AQICard airQuality={airQualityData} />

            {/* Card 3: Personal Risk Score */}
            <RiskGaugeCard 
              riskScore={advisoryData?.risk_score ?? 20} 
              riskLevel={advisoryData?.risk_level ?? 'Low'} 
              riskBreakdown={advisoryData?.risk_breakdown} 
              userProfile={userProfile} 
            />
          </div>

          {/* 4. AI Advisory Section (Main Feature) */}
          <AIAdvisoryCard 
            advisory={advisoryData} 
            userProfile={userProfile} 
            onSaveToHistory={onSaveAlert} 
            isSaved={isSaved} 
            onRefresh={onRefreshAdvisory} 
            isLoading={isLoading} 
          />

          {/* 5. 7-Day Trend View (Recharts) */}
          <TrendsChart trends={trendsData} />
        </>
      )}

    </div>
  );
}
