import React, { useState, useEffect, useRef } from 'react';
import { Search, Navigation, MapPin, Loader2, Calendar, Clock, X } from 'lucide-react';
import { searchCities, reverseGeocode } from '../services/api';

export default function LocationSearch({
  currentLocation,
  onLocationChange,
  isLoading
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const searchContainerRef = useRef(null);

  // Live clock ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setShowDropdown(true);
      } catch (err) {
        console.error("City search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  // Handle GPS / Geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const loc = await reverseGeocode(lat, lon);
          onLocationChange({
            name: loc.name || 'Live Location',
            latitude: lat,
            longitude: lon,
            country: loc.country,
            admin1: loc.admin1,
          });
        } catch (err) {
          onLocationChange({
            name: 'Live Location',
            latitude: lat,
            longitude: lon,
          });
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn("Geolocation denied or failed:", err);
        setIsLocating(false);
        alert("Could not access your location. Please check browser permissions or search your city.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectCity = (city) => {
    onLocationChange({
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      country: city.country,
      admin1: city.admin1,
    });
    setQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
      
      {/* Left: Location Search Bar */}
      <div className="relative flex-1 max-w-xl" ref={searchContainerRef}>
        <div className="relative flex items-center">
          <div className="absolute left-3.5 pointer-events-none text-slate-400">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
            placeholder="Search city (e.g. Indore, London, Tokyo, New York)..."
            className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-400 text-sm rounded-xl pl-10 pr-24 py-2.5 border border-white/10 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />

          {query && (
            <button
              onClick={() => { setQuery(''); setSuggestions([]); }}
              className="absolute right-12 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Quick Geolocation GPS Button */}
          <button
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="absolute right-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Use Current Live GPS Location"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 glass-panel rounded-xl shadow-2xl border border-white/15 overflow-hidden divide-y divide-white/5 animate-slide-up">
            {suggestions.map((city, idx) => (
              <button
                key={`${city.latitude}_${city.longitude}_${idx}`}
                onClick={() => handleSelectCity(city)}
                className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-emerald-500/15 transition-colors group"
              >
                <MapPin className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-sm font-medium text-slate-200 group-hover:text-emerald-300">
                    {city.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {[city.admin1, city.country].filter(Boolean).join(', ')} • Lat: {city.latitude.toFixed(2)}, Lon: {city.longitude.toFixed(2)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Selected Location & Live Time Badge */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
              <span>{currentLocation.name || 'Indore, India'}</span>
              {currentLocation.country && (
                <span className="text-slate-400 font-normal">({currentLocation.country})</span>
              )}
            </div>
            <div className="text-[11px] text-slate-400">
              {currentLocation.latitude.toFixed(2)}°N, {currentLocation.longitude.toFixed(2)}°E
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-white/10">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
