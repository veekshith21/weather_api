import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import type { DailyForecast as DailyForecastType } from '../types/weather';
import { getWeatherEmoji } from '../utils/weatherHelpers';
import type { WeatherCondition } from '../types/weather';

interface Props {
  daily: DailyForecastType[];
  cardBg: string;
  cardBorder: string;
  unitLabel: string;
}

export default function DailyForecast({ daily, cardBg, cardBorder, unitLabel }: Props) {
  const globalMax = Math.max(...daily.map(d => d.tempMax));
  const globalMin = Math.min(...daily.map(d => d.tempMin));
  const globalRange = globalMax - globalMin || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-3xl p-5 sm:p-6"
      style={{
        background: cardBg,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${cardBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      }}
    >
      <h3 className="text-white font-semibold text-sm uppercase tracking-wider opacity-80 mb-4">
        7-Day Forecast
      </h3>

      <div className="flex flex-col gap-1">
        {daily.map((day, i) => {
          const fakeCondition: WeatherCondition = { id: 800, main: 'Clear', description: '', icon: day.icon };
          const emoji = getWeatherEmoji(fakeCondition, true);
          const isToday = i === 0;

          // Temp range bar positions
          const barStart = ((day.tempMin - globalMin) / globalRange) * 100;
          const barWidth = ((day.tempMax - day.tempMin) / globalRange) * 100;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.07)', scale: 1.01 }}
              className="flex items-center gap-3 sm:gap-4 py-2.5 px-3 rounded-xl transition-all cursor-default"
            >
              {/* Day name */}
              <div className="w-12 flex-shrink-0">
                <span className={`text-sm font-semibold ${isToday ? 'text-white' : 'text-white/60'}`}>
                  {isToday ? 'Today' : day.dayName}
                </span>
              </div>

              {/* Icon + precip */}
              <div className="flex items-center gap-1.5 w-14 flex-shrink-0">
                <span className="text-xl">{emoji}</span>
                {day.pop > 20 && (
                  <div className="flex items-center gap-0.5">
                    <Droplets size={9} className="text-blue-300" />
                    <span className="text-blue-300 text-[10px]">{day.pop}%</span>
                  </div>
                )}
              </div>

              {/* Low temp */}
              <span className="text-white/40 text-sm w-8 text-right flex-shrink-0">
                {day.tempMin}{unitLabel}
              </span>

              {/* Range bar */}
              <div className="flex-1 h-1.5 rounded-full relative" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%`, left: `${barStart}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.07 }}
                  className="absolute h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #60a5fa, #fbbf24)',
                  }}
                />
              </div>

              {/* High temp */}
              <span className={`text-sm font-bold w-10 text-right flex-shrink-0 ${isToday ? 'text-white' : 'text-white/80'}`}>
                {day.tempMax}{unitLabel}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
