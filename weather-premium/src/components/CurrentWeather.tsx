import { motion } from 'framer-motion';
import { MapPin, Star, Thermometer, Eye } from 'lucide-react';
import type { CurrentWeatherData, TemperatureUnit } from '../types/weather';
import { getWeatherEmoji, isDaytime, formatDate, tempUnitLabel } from '../utils/weatherHelpers';

interface Props {
  data: CurrentWeatherData;
  unit: TemperatureUnit;
  cardBg: string;
  cardBorder: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function CurrentWeather({ data, unit, cardBg, cardBorder, isFavorite, onToggleFavorite }: Props) {
  const day = isDaytime(data.sys.sunrise, data.sys.sunset, data.timezone);
  const emoji = getWeatherEmoji(data.weather[0], day);
  const unitLabel = tempUnitLabel(unit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
      style={{
        background: cardBg,
        backdropFilter: 'blur(24px)',
        border: `1px solid ${cardBorder}`,
        boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
      }}
    >
      {/* Decorative gradient blob */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
      />

      {/* Location row */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin size={14} className="text-white/60" />
            <span className="text-white/60 text-sm font-medium">{data.sys.country}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{data.name}</h1>
          <p className="text-white/50 text-xs mt-1">{formatDate(data.dt, data.timezone)}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={onToggleFavorite}
          className="p-2.5 rounded-xl hover:bg-white/10 transition-colors"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            size={20}
            className={isFavorite ? 'text-amber-400 fill-amber-400' : 'text-white/40'}
          />
        </motion.button>
      </div>

      {/* Main temp + icon */}
      <div className="flex items-end justify-between relative z-10">
        <div>
          <div className="flex items-start">
            <motion.span
              key={data.main.temp}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl sm:text-8xl font-black text-white leading-none tracking-tighter"
            >
              {Math.round(data.main.temp)}
            </motion.span>
            <span className="text-3xl font-light text-white/70 mt-2">{unitLabel}</span>
          </div>

          <p className="text-white/90 text-lg font-medium capitalize mt-1">
            {data.weather[0].description}
          </p>

          <div className="flex flex-wrap gap-3 mt-3">
            <div className="flex items-center gap-1.5">
              <Thermometer size={13} className="text-white/50" />
              <span className="text-white/60 text-xs">Feels {Math.round(data.main.feels_like)}{unitLabel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white/40 text-xs">H:{Math.round(data.main.temp_max)}{unitLabel}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/40 text-xs">L:{Math.round(data.main.temp_min)}{unitLabel}</span>
            </div>
            {data.visibility && (
              <div className="flex items-center gap-1.5">
                <Eye size={13} className="text-white/50" />
                <span className="text-white/60 text-xs">{(data.visibility / 1000).toFixed(1)} km vis.</span>
              </div>
            )}
          </div>
        </div>

        {/* Animated emoji icon */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl sm:text-8xl select-none ml-4"
        >
          {emoji}
        </motion.div>
      </div>

      {/* Bottom badge */}
      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/10 relative z-10">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
          Live Weather
        </div>
        <span className="text-white/30 text-xs">
          Updated just now
        </span>
      </div>
    </motion.div>
  );
}
