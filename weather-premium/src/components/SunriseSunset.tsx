import { motion } from 'framer-motion';
import { Sunrise, Sunset } from 'lucide-react';
import type { CurrentWeatherData } from '../types/weather';
import { formatTime } from '../utils/weatherHelpers';

interface Props {
  data: CurrentWeatherData;
  cardBg: string;
  cardBorder: string;
}

export default function SunriseSunset({ data, cardBg, cardBorder }: Props) {
  const tz = data.timezone;
  const nowUTC = Math.floor(Date.now() / 1000);
  const sunriseLocal = data.sys.sunrise + tz;
  const sunsetLocal = data.sys.sunset + tz;
  const nowLocal = nowUTC + tz;

  const dayLength = sunsetLocal - sunriseLocal;
  const elapsed = Math.max(0, Math.min(nowLocal - sunriseLocal, dayLength));
  const progressPct = dayLength > 0 ? (elapsed / dayLength) * 100 : 0;

  const sunriseStr = formatTime(data.sys.sunrise, tz);
  const sunsetStr = formatTime(data.sys.sunset, tz);

  // SVG arc params
  const W = 280, H = 120;
  const cx = W / 2, cy = H + 10;
  const r = H + 10;
  const startAngle = Math.PI;
  const endAngle = 0;
  const sweepAngle = startAngle - endAngle;

  const angleAt = (pct: number) => Math.PI - (pct / 100) * Math.PI;
  const sunAngle = angleAt(Math.min(progressPct, 100));
  const sunX = cx + r * Math.cos(sunAngle);
  const sunY = cy + r * Math.sin(sunAngle);

  // Arc path
  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="rounded-3xl p-5 sm:p-6"
      style={{
        background: cardBg,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${cardBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      }}
    >
      <h3 className="text-white font-semibold text-sm uppercase tracking-wider opacity-80 mb-4">
        Sunrise & Sunset
      </h3>

      {/* Arc visualization */}
      <div className="flex justify-center mb-2">
        <svg width={W} height={H + 16} viewBox={`0 0 ${W} ${H + 16}`}>
          {/* Track arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="url(#sunGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * r}`}
            strokeDashoffset={`${Math.PI * r * (1 - progressPct / 100)}`}
          />
          <defs>
            <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
          {/* Horizon line */}
          <line x1={cx - r - 6} y1={cy} x2={cx + r + 6} y2={cy} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Sun position */}
          {progressPct > 0 && progressPct < 100 && (
            <motion.circle
              cx={sunX}
              cy={sunY}
              r="8"
              fill="#fbbf24"
              filter="url(#sunGlow)"
              initial={{ r: 0 }}
              animate={{ r: 8 }}
            />
          )}
          <defs>
            <filter id="sunGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Sunrise / Sunset labels */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl" style={{ background: 'rgba(249,115,22,0.15)' }}>
            <Sunrise size={16} className="text-orange-400" />
          </div>
          <div>
            <p className="text-white/40 text-xs">Sunrise</p>
            <p className="text-white font-semibold text-sm">{sunriseStr}</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/30 text-xs">Day length</p>
          <p className="text-white/60 text-sm font-medium">
            {Math.floor(dayLength / 3600)}h {Math.floor((dayLength % 3600) / 60)}m
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <p className="text-white/40 text-xs text-right">Sunset</p>
            <p className="text-white font-semibold text-sm text-right">{sunsetStr}</p>
          </div>
          <div className="p-2 rounded-xl" style={{ background: 'rgba(251,191,36,0.15)' }}>
            <Sunset size={16} className="text-amber-400" />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 1, delay: 0.6 }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24)' }}
        />
      </div>
    </motion.div>
  );
}
