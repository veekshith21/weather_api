import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertTriangle, Star, Thermometer, Cloud } from 'lucide-react';

import WeatherBackground from './components/WeatherBackground';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherStats from './components/WeatherStats';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import SunriseSunset from './components/SunriseSunset';
import AirQuality from './components/AirQuality';

import { useWeather } from './hooks/useWeather';
import {
  getWeatherTheme,
  isDaytime,
  themeConfig,
  processDailyForecast,
  processHourlyForecast,
  tempUnitLabel,
} from './utils/weatherHelpers';
import type { TemperatureUnit } from './types/weather';

const DEFAULT_CITY = 'Mumbai';
const MAX_RECENT = 8;
const MAX_FAVORITES = 10;

function SkeletonCard({ height = 'h-40' }: { height?: string }) {
  return (
    <div
      className={`rounded-3xl ${height} animate-pulse`}
      style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    />
  );
}

export default function App() {
  const [unit, setUnit] = useState<TemperatureUnit>('metric');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('weather_recent') || '[]'); } catch { return []; }
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('weather_favorites') || '[]'); } catch { return []; }
  });

  const { current, forecast, airQuality, loading, error, city, fetchWeather, fetchByCoords } = useWeather(unit);

  // Initial load
  useEffect(() => {
    const lastCity = recentSearches[0] || DEFAULT_CITY;
    fetchWeather(lastCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback((cityName: string) => {
    fetchWeather(cityName);
    setRecentSearches(prev => {
      const next = [cityName, ...prev.filter(c => c.toLowerCase() !== cityName.toLowerCase())].slice(0, MAX_RECENT);
      localStorage.setItem('weather_recent', JSON.stringify(next));
      return next;
    });
  }, [fetchWeather]);

  const handleLocationSearch = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      () => alert('Could not get your location.')
    );
  }, [fetchByCoords]);

  const toggleFavorite = useCallback((cityName: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(cityName);
      const next = isFav
        ? prev.filter(c => c !== cityName)
        : [cityName, ...prev].slice(0, MAX_FAVORITES);
      localStorage.setItem('weather_favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  // Derived state
  const dayTime = current ? isDaytime(current.sys.sunrise, current.sys.sunset, current.timezone) : true;
  const theme = current ? getWeatherTheme(current.weather, dayTime) : 'sunny';
  const config = themeConfig[theme];
  const unitLabel = tempUnitLabel(unit);
  const daily = forecast ? processDailyForecast(forecast.list) : [];
  const hourly = forecast && current ? processHourlyForecast(forecast.list, current.timezone) : [];
  const isFavorite = city ? favorites.includes(city) : false;

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden">
      {/* Animated background */}
      <WeatherBackground theme={theme} />

      {/* Main layout */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* ── Navbar ── */}
        <header className="sticky top-0 z-20 px-4 sm:px-6 py-4"
          style={{
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              >
                <Cloud size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-sm hidden sm:inline">WeatherVerse</span>
            </div>

            {/* Search */}
            <SearchBar
              onSearch={handleSearch}
              onLocationSearch={handleLocationSearch}
              cardBg={config.cardBg}
              cardBorder={config.cardBorder}
              recentSearches={recentSearches}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              currentCity={city}
            />

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Unit toggle */}
              <button
                onClick={() => setUnit(u => u === 'metric' ? 'imperial' : 'metric')}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
                title="Toggle °C / °F"
              >
                <Thermometer size={13} />
                <span>{unit === 'metric' ? '°C' : '°F'}</span>
              </button>

              {/* Refresh */}
              <button
                onClick={() => city && handleSearch(city)}
                disabled={loading}
                className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
                title="Refresh"
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>

              {/* Favorite current city */}
              {city && (
                <button
                  onClick={() => toggleFavorite(city)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-all"
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star
                    size={15}
                    className={isFavorite ? 'text-amber-400 fill-amber-400' : 'text-white/50'}
                  />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="flex-1 px-4 sm:px-6 py-6 max-w-6xl mx-auto w-full">

          {/* Error state */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl mb-6"
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(239,68,68,0.3)',
                }}
              >
                <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
                <p className="text-red-200 text-sm">{error}</p>
                <button
                  onClick={() => handleSearch(DEFAULT_CITY)}
                  className="ml-auto text-red-300 hover:text-white text-xs underline"
                >
                  Try Mumbai
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skeleton loader */}
          {loading && !current && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1 flex flex-col gap-4">
                <SkeletonCard height="h-64" />
                <SkeletonCard height="h-48" />
              </div>
              <div className="lg:col-span-2 flex flex-col gap-4">
                <SkeletonCard height="h-28" />
                <SkeletonCard height="h-36" />
                <SkeletonCard height="h-56" />
              </div>
            </div>
          )}

          {/* Weather data */}
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={city}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-4"
              >
                {/* Left column */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                  <CurrentWeather
                    data={current}
                    unit={unit}
                    cardBg={config.cardBg}
                    cardBorder={config.cardBorder}
                    isFavorite={isFavorite}
                    onToggleFavorite={() => toggleFavorite(city)}
                  />

                  <SunriseSunset
                    data={current}
                    cardBg={config.cardBg}
                    cardBorder={config.cardBorder}
                  />

                  {airQuality && (
                    <AirQuality
                      data={airQuality}
                      cardBg={config.cardBg}
                      cardBorder={config.cardBorder}
                    />
                  )}
                </div>

                {/* Right column */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <WeatherStats
                    data={current}
                    unit={unit}
                    cardBg={config.cardBg}
                    cardBorder={config.cardBorder}
                  />

                  {hourly.length > 0 && (
                    <HourlyForecast
                      hourly={hourly}
                      cardBg={config.cardBg}
                      cardBorder={config.cardBorder}
                      unitLabel={unitLabel}
                    />
                  )}

                  {daily.length > 0 && (
                    <DailyForecast
                      daily={daily}
                      cardBg={config.cardBg}
                      cardBorder={config.cardBorder}
                      unitLabel={unitLabel}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 text-center">
          <p className="text-white/20 text-xs">
            WeatherVerse · Data from OpenWeatherMap · Built with React & Framer Motion
          </p>
        </footer>
      </div>
    </div>
  );
}
