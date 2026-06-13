import { motion } from 'framer-motion';
import { Droplets, Wind, Gauge, Eye, Sun, Zap } from 'lucide-react';
import type { CurrentWeatherData, TemperatureUnit } from '../types/weather';
import { formatWindSpeed, formatVisibility, getUVLabel, getWindDirection, estimateUVIndex, isDaytime } from '../utils/weatherHelpers';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  cardBg: string;
  cardBorder: string;
  accent?: string;
  progress?: number;
  delay?: number;
}

function StatCard({ icon, label, value, subValue, cardBg, cardBorder, accent, progress, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="rounded-2xl p-4 sm:p-5 relative overflow-hidden group cursor-default"
      style={{
        background: cardBg,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${cardBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      }}
    >
      {/* Hover shine */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)' }}
      />

      <div className="flex items-start justify-between mb-3">
        <div
          className="p-2 rounded-xl"
          style={{ background: accent ? `${accent}22` : 'rgba(255,255,255,0.1)' }}
        >
          <div style={{ color: accent || 'rgba(255,255,255,0.8)' }}>{icon}</div>
        </div>
      </div>

      <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white text-xl sm:text-2xl font-bold">{value}</p>
      {subValue && <p className="text-white/50 text-xs mt-1">{subValue}</p>}

      {progress !== undefined && (
        <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1, delay: delay + 0.3 }}
            className="h-full rounded-full"
            style={{ background: accent || 'rgba(255,255,255,0.6)' }}
          />
        </div>
      )}
    </motion.div>
  );
}

interface Props {
  data: CurrentWeatherData;
  unit: TemperatureUnit;
  cardBg: string;
  cardBorder: string;
}

export default function WeatherStats({ data, unit, cardBg, cardBorder }: Props) {
  const day = isDaytime(data.sys.sunrise, data.sys.sunset, data.timezone);
  const uvIndex = estimateUVIndex(data.weather, day, data.coord.lat);
  const uvInfo = getUVLabel(uvIndex);
  const windDir = getWindDirection(data.wind.deg);

  const stats: StatCardProps[] = [
    {
      icon: <Droplets size={18} />,
      label: 'Humidity',
      value: `${data.main.humidity}%`,
      subValue: data.main.humidity > 70 ? 'High moisture' : data.main.humidity < 30 ? 'Very dry' : 'Comfortable',
      accent: '#60a5fa',
      progress: data.main.humidity,
      cardBg, cardBorder,
    },
    {
      icon: <Wind size={18} />,
      label: 'Wind Speed',
      value: formatWindSpeed(data.wind.speed, unit),
      subValue: `${windDir} • Gusts ${formatWindSpeed(data.wind.gust || data.wind.speed * 1.3, unit)}`,
      accent: '#34d399',
      progress: Math.min(data.wind.speed * 3.6 / 120 * 100, 100),
      cardBg, cardBorder,
    },
    {
      icon: <Gauge size={18} />,
      label: 'Pressure',
      value: `${data.main.pressure} hPa`,
      subValue: data.main.pressure > 1013 ? 'High pressure' : data.main.pressure < 1000 ? 'Low pressure' : 'Normal',
      accent: '#a78bfa',
      progress: ((data.main.pressure - 950) / 100) * 100,
      cardBg, cardBorder,
    },
    {
      icon: <Eye size={18} />,
      label: 'Visibility',
      value: formatVisibility(data.visibility || 10000, unit),
      subValue: (data.visibility || 10000) >= 10000 ? 'Excellent' : (data.visibility || 10000) >= 5000 ? 'Good' : 'Reduced',
      accent: '#fb923c',
      progress: Math.min(((data.visibility || 10000) / 10000) * 100, 100),
      cardBg, cardBorder,
    },
    {
      icon: <Sun size={18} />,
      label: 'UV Index',
      value: day ? `${uvIndex}` : 'N/A',
      subValue: day ? uvInfo.label : 'Nighttime',
      accent: uvInfo.color,
      progress: day ? (uvIndex / 12) * 100 : 0,
      cardBg, cardBorder,
    },
    {
      icon: <Zap size={18} />,
      label: 'Dew Point',
      value: `${Math.round(data.main.temp - ((100 - data.main.humidity) / 5))}°`,
      subValue: 'Moisture saturation',
      accent: '#f472b6',
      cardBg, cardBorder,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} delay={i * 0.07} />
      ))}
    </div>
  );
}
