import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Droplets, ChevronLeft, ChevronRight } from 'lucide-react';
import type { HourlyForecast as HourlyForecastType } from '../types/weather';
import { getWeatherEmoji } from '../utils/weatherHelpers';
import type { WeatherCondition } from '../types/weather';

interface Props {
  hourly: HourlyForecastType[];
  cardBg: string;
  cardBorder: string;
  unitLabel: string;
}

export default function HourlyForecast({ hourly, cardBg, cardBorder, unitLabel }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' });
    }
  };

  const maxTemp = Math.max(...hourly.map(h => h.temp));
  const minTemp = Math.min(...hourly.map(h => h.temp));
  const tempRange = maxTemp - minTemp || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-3xl p-5 sm:p-6"
      style={{
        background: cardBg,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${cardBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider opacity-80">
          Hourly Forecast
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {hourly.map((hour, i) => {
          const heightPct = ((hour.temp - minTemp) / tempRange) * 60 + 20;
          const isFirst = i === 0;
          const fakeCondition: WeatherCondition = { id: 800, main: 'Clear', description: '', icon: hour.icon };
          const emojiIcon = getWeatherEmoji(fakeCondition, true);

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.05, y: -3 }}
              className={`flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-2xl cursor-default transition-all ${
                isFirst ? 'ring-2 ring-white/30' : ''
              }`}
              style={{
                background: isFirst ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)',
                minWidth: '72px',
              }}
            >
              <span className="text-white/60 text-xs font-semibold">
                {isFirst ? 'Now' : hour.time}
              </span>

              <span className="text-2xl select-none">{emojiIcon}</span>

              <span className="text-white font-bold text-sm">
                {hour.temp}{unitLabel}
              </span>

              {/* Relative temp bar */}
              <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${heightPct}%`,
                    background: 'rgba(255,255,255,0.5)',
                  }}
                />
              </div>

              {hour.pop > 10 && (
                <div className="flex items-center gap-0.5">
                  <Droplets size={9} className="text-blue-300" />
                  <span className="text-blue-300 text-[10px] font-medium">{hour.pop}%</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
