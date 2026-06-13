import type { WeatherCondition, WeatherTheme, DailyForecast, HourlyForecast, ForecastItem, TemperatureUnit } from '../types/weather';

const API_KEY = 'e7b5a8002979ebac2a42ff4551cabc68';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const api = {
  getCurrentWeather: (city: string, unit: TemperatureUnit = 'metric') =>
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${API_KEY}`,
  getCurrentWeatherByCoords: (lat: number, lon: number, unit: TemperatureUnit = 'metric') =>
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`,
  getForecast: (city: string, unit: TemperatureUnit = 'metric') =>
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${unit}&appid=${API_KEY}`,
  getForecastByCoords: (lat: number, lon: number, unit: TemperatureUnit = 'metric') =>
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`,
  getAirQuality: (lat: number, lon: number) =>
    `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
  getSearchSuggestions: (query: string) =>
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`,
};

export function getWeatherTheme(weather: WeatherCondition[], isDaytime: boolean): WeatherTheme {
  if (!weather || weather.length === 0) return isDaytime ? 'sunny' : 'night';
  const id = weather[0].id;
  const main = weather[0].main.toLowerCase();

  if (id >= 200 && id < 300) return 'stormy';
  if (id >= 300 && id < 400) return 'rainy';
  if (id >= 500 && id < 600) return 'rainy';
  if (id >= 600 && id < 700) return 'snowy';
  if (id >= 700 && id < 800) return 'foggy';
  if (id === 800) return isDaytime ? 'sunny' : 'night';
  if (id === 801 || id === 802) return isDaytime ? 'cloudy' : 'night-cloudy';
  if (id >= 803) return isDaytime ? 'cloudy' : 'night-cloudy';

  if (main === 'thunderstorm') return 'stormy';
  if (main === 'rain' || main === 'drizzle') return 'rainy';
  if (main === 'snow') return 'snowy';
  if (main === 'clouds') return isDaytime ? 'cloudy' : 'night-cloudy';
  if (['mist','fog','haze','smoke','dust','sand','ash','squall'].includes(main)) return 'foggy';

  return isDaytime ? 'sunny' : 'night';
}

export const themeConfig: Record<WeatherTheme, {
  gradient: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  cardBg: string;
  cardBorder: string;
  particleColor: string;
}> = {
  sunny: {
    gradient: 'linear-gradient(135deg, #1a6dff 0%, #c822ff 50%, #ff6b2b 100%)',
    accent: '#fbbf24',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.75)',
    cardBg: 'rgba(255,255,255,0.12)',
    cardBorder: 'rgba(255,255,255,0.25)',
    particleColor: '#fef08a',
  },
  cloudy: {
    gradient: 'linear-gradient(135deg, #374151 0%, #6b7280 50%, #9ca3af 100%)',
    accent: '#d1d5db',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.7)',
    cardBg: 'rgba(255,255,255,0.1)',
    cardBorder: 'rgba(255,255,255,0.2)',
    particleColor: '#e5e7eb',
  },
  rainy: {
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)',
    accent: '#60a5fa',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.7)',
    cardBg: 'rgba(255,255,255,0.08)',
    cardBorder: 'rgba(255,255,255,0.15)',
    particleColor: '#93c5fd',
  },
  stormy: {
    gradient: 'linear-gradient(135deg, #030712 0%, #111827 50%, #1e1b4b 100%)',
    accent: '#a78bfa',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.65)',
    cardBg: 'rgba(255,255,255,0.06)',
    cardBorder: 'rgba(167,139,250,0.2)',
    particleColor: '#c4b5fd',
  },
  snowy: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #3b82f6 50%, #bfdbfe 100%)',
    accent: '#e0f2fe',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.8)',
    cardBg: 'rgba(255,255,255,0.15)',
    cardBorder: 'rgba(255,255,255,0.3)',
    particleColor: '#f0f9ff',
  },
  foggy: {
    gradient: 'linear-gradient(135deg, #374151 0%, #6b7280 50%, #9ca3af 100%)',
    accent: '#e5e7eb',
    textPrimary: 'rgba(255,255,255,0.9)',
    textSecondary: 'rgba(255,255,255,0.6)',
    cardBg: 'rgba(255,255,255,0.08)',
    cardBorder: 'rgba(255,255,255,0.15)',
    particleColor: '#d1d5db',
  },
  night: {
    gradient: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)',
    accent: '#818cf8',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.65)',
    cardBg: 'rgba(255,255,255,0.07)',
    cardBorder: 'rgba(129,140,248,0.2)',
    particleColor: '#c7d2fe',
  },
  'night-cloudy': {
    gradient: 'linear-gradient(135deg, #0c1225 0%, #1e293b 50%, #334155 100%)',
    accent: '#94a3b8',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.65)',
    cardBg: 'rgba(255,255,255,0.07)',
    cardBorder: 'rgba(255,255,255,0.12)',
    particleColor: '#cbd5e1',
  },
};

export function isDaytime(sunrise: number, sunset: number, timezone: number): boolean {
  const nowUTC = Math.floor(Date.now() / 1000);
  const localNow = nowUTC + timezone;
  const localSunrise = sunrise + timezone;
  const localSunset = sunset + timezone;
  return localNow >= localSunrise && localNow < localSunset;
}

export function formatTime(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toUTCString().slice(17, 22);
}

export function formatHour(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  const h = date.getUTCHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}${ampm}`;
}

export function formatDay(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatDate(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toUTCString().slice(0, 16);
}

export function getWeatherEmoji(condition: WeatherCondition, dayTime = true): string {
  const id = condition.id;
  if (id >= 200 && id < 300) return '⛈️';
  if (id >= 300 && id < 400) return '🌦️';
  if (id >= 500 && id < 510) return id <= 501 ? '🌧️' : '🌧️';
  if (id >= 511 && id < 600) return '🌨️';
  if (id >= 600 && id < 700) return id === 611 || id === 612 ? '🌨️' : '❄️';
  if (id === 701) return '🌫️';
  if (id === 711) return '💨';
  if (id === 721) return '🌤️';
  if (id >= 700 && id < 800) return '🌫️';
  if (id === 800) return dayTime ? '☀️' : '🌙';
  if (id === 801) return dayTime ? '🌤️' : '☁️';
  if (id === 802) return '⛅';
  if (id >= 803) return '☁️';
  return '🌡️';
}

export function getAQILabel(aqi: number): { label: string; color: string; bgColor: string } {
  const labels = [
    { label: 'Good', color: '#10b981', bgColor: 'rgba(16,185,129,0.2)' },
    { label: 'Fair', color: '#84cc16', bgColor: 'rgba(132,204,22,0.2)' },
    { label: 'Moderate', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.2)' },
    { label: 'Poor', color: '#ef4444', bgColor: 'rgba(239,68,68,0.2)' },
    { label: 'Very Poor', color: '#7c3aed', bgColor: 'rgba(124,58,237,0.2)' },
  ];
  return labels[Math.min(aqi - 1, 4)] || labels[0];
}

export function getUVLabel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Low', color: '#10b981' };
  if (uv <= 5) return { label: 'Moderate', color: '#84cc16' };
  if (uv <= 7) return { label: 'High', color: '#f59e0b' };
  if (uv <= 10) return { label: 'Very High', color: '#ef4444' };
  return { label: 'Extreme', color: '#7c3aed' };
}

export function estimateUVIndex(weather: WeatherCondition[], isDaytimeNow: boolean, lat: number): number {
  if (!isDaytimeNow) return 0;
  const id = weather[0]?.id || 800;
  const latFactor = Math.max(0, 1 - Math.abs(lat) / 90) * 3;
  if (id === 800) return Math.round(5 + latFactor);
  if (id >= 801 && id <= 802) return Math.round(3 + latFactor);
  if (id >= 803) return Math.round(1 + latFactor);
  if (id >= 500 && id < 600) return 1;
  if (id >= 200 && id < 300) return 0;
  return Math.round(2 + latFactor);
}

export function getWindDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export function formatVisibility(meters: number, unit: TemperatureUnit): string {
  if (unit === 'imperial') {
    const miles = meters / 1609.34;
    return miles >= 1 ? `${miles.toFixed(1)} mi` : `${(meters * 3.281).toFixed(0)} ft`;
  }
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
}

export function formatWindSpeed(speed: number, unit: TemperatureUnit): string {
  if (unit === 'imperial') return `${Math.round(speed)} mph`;
  return `${Math.round(speed * 3.6)} km/h`;
}

export function processDailyForecast(items: ForecastItem[]): DailyForecast[] {
  const days: Record<string, ForecastItem[]> = {};
  items.forEach(item => {
    const dateKey = item.dt_txt.slice(0, 10);
    if (!days[dateKey]) days[dateKey] = [];
    days[dateKey].push(item);
  });

  return Object.entries(days).slice(0, 7).map(([date, dayItems]) => {
    const temps = dayItems.map(i => i.main.temp);
    const noon = dayItems.find(i => i.dt_txt.includes('12:00:00')) || dayItems[Math.floor(dayItems.length / 2)];
    return {
      date,
      dayName: formatDay(noon.dt),
      icon: noon.weather[0].icon,
      description: noon.weather[0].description,
      tempMax: Math.round(Math.max(...temps)),
      tempMin: Math.round(Math.min(...temps)),
      humidity: Math.round(noon.main.humidity),
      windSpeed: noon.wind.speed,
      pop: Math.round(Math.max(...dayItems.map(i => i.pop)) * 100),
    };
  });
}

export function processHourlyForecast(items: ForecastItem[], timezone: number): HourlyForecast[] {
  return items.slice(0, 8).map(item => ({
    time: formatHour(item.dt, timezone),
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
    description: item.weather[0].description,
    pop: Math.round(item.pop * 100),
    windSpeed: item.wind.speed,
  }));
}

export function tempUnitLabel(unit: TemperatureUnit): string {
  return unit === 'metric' ? '°C' : '°F';
}

export function pressureToInHg(hPa: number): number {
  return Math.round(hPa * 0.02953 * 100) / 100;
}
