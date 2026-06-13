import { useState, useCallback, useEffect } from 'react';
import type { CurrentWeatherData, ForecastData, AirQualityData, TemperatureUnit } from '../types/weather';
import { api } from '../utils/weatherHelpers';

interface WeatherState {
  current: CurrentWeatherData | null;
  forecast: ForecastData | null;
  airQuality: AirQualityData | null;
  loading: boolean;
  error: string | null;
  city: string;
}

const CACHE: Record<string, { data: WeatherState; ts: number }> = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export function useWeather(unit: TemperatureUnit = 'metric') {
  const [state, setState] = useState<WeatherState>({
    current: null,
    forecast: null,
    airQuality: null,
    loading: false,
    error: null,
    city: '',
  });

  const fetchWeather = useCallback(async (cityName: string) => {
    if (!cityName.trim()) return;
    const cacheKey = `${cityName.toLowerCase()}_${unit}`;
    const cached = CACHE[cacheKey];
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      setState(cached.data);
      return;
    }
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(api.getCurrentWeather(cityName, unit)),
        fetch(api.getForecast(cityName, unit)),
      ]);
      if (!currentRes.ok) {
        if (currentRes.status === 404) throw new Error(`City "${cityName}" not found. Try a different name.`);
        throw new Error('Failed to fetch weather data. Please try again.');
      }
      const [current, forecast] = await Promise.all([
        currentRes.json() as Promise<CurrentWeatherData>,
        forecastRes.json() as Promise<ForecastData>,
      ]);
      let airQuality: AirQualityData | null = null;
      try {
        const aqRes = await fetch(api.getAirQuality(current.coord.lat, current.coord.lon));
        if (aqRes.ok) airQuality = await aqRes.json();
      } catch { /* AQ is optional */ }

      const newState: WeatherState = {
        current,
        forecast,
        airQuality,
        loading: false,
        error: null,
        city: cityName,
      };
      CACHE[cacheKey] = { data: newState, ts: Date.now() };
      setState(newState);
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred.',
      }));
    }
  }, [unit]);

  const fetchByCoords = useCallback(async (lat: number, lon: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(api.getCurrentWeatherByCoords(lat, lon, unit)),
        fetch(api.getForecastByCoords(lat, lon, unit)),
      ]);
      if (!currentRes.ok) throw new Error('Failed to fetch weather for your location.');
      const [current, forecast] = await Promise.all([
        currentRes.json() as Promise<CurrentWeatherData>,
        forecastRes.json() as Promise<ForecastData>,
      ]);
      let airQuality: AirQualityData | null = null;
      try {
        const aqRes = await fetch(api.getAirQuality(lat, lon));
        if (aqRes.ok) airQuality = await aqRes.json();
      } catch { /* optional */ }

      setState({
        current,
        forecast,
        airQuality,
        loading: false,
        error: null,
        city: current.name,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Location error.',
      }));
    }
  }, [unit]);

  // Reload on unit change if there's a current city
  useEffect(() => {
    if (state.city) fetchWeather(state.city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  return { ...state, fetchWeather, fetchByCoords };
}

export function useSearchSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<Array<{ name: string; country: string; state?: string }>>([]);

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(api.getSearchSuggestions(query));
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.map((d: { name: string; country: string; state?: string }) => ({
            name: d.name,
            country: d.country,
            state: d.state,
          })));
        }
      } catch { setSuggestions([]); }
    }, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  return suggestions;
}
