import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import type { AirQualityData } from '../types/weather';
import { getAQILabel } from '../utils/weatherHelpers';

interface Props {
  data: AirQualityData | null;
  cardBg: string;
  cardBorder: string;
}

export default function AirQuality({ data, cardBg, cardBorder }: Props) {
  if (!data || !data.list?.length) return null;

  const { aqi } = data.list[0].main;
  const { co, no2, o3, pm2_5, pm10 } = data.list[0].components;
  const aqiInfo = getAQILabel(aqi);

  const pollutants = [
    { label: 'PM2.5', value: pm2_5.toFixed(1), unit: 'μg/m³', max: 75, color: '#60a5fa' },
    { label: 'PM10', value: pm10.toFixed(1), unit: 'μg/m³', max: 150, color: '#a78bfa' },
    { label: 'O₃', value: o3.toFixed(1), unit: 'μg/m³', max: 180, color: '#34d399' },
    { label: 'NO₂', value: no2.toFixed(1), unit: 'μg/m³', max: 200, color: '#fb923c' },
    { label: 'CO', value: (co / 1000).toFixed(2), unit: 'mg/m³', max: 10, color: '#f472b6' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-3xl p-5 sm:p-6"
      style={{
        background: cardBg,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${cardBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider opacity-80">
          Air Quality
        </h3>
        <div className="flex items-center gap-2">
          <Wind size={14} className="text-white/50" />
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: aqiInfo.bgColor, color: aqiInfo.color }}
          >
            {aqiInfo.label}
          </span>
        </div>
      </div>

      {/* AQI scale */}
      <div className="mb-5">
        <div className="flex gap-1 mb-2">
          {[
            { label: 'Good', color: '#10b981' },
            { label: 'Fair', color: '#84cc16' },
            { label: 'Moderate', color: '#f59e0b' },
            { label: 'Poor', color: '#ef4444' },
            { label: 'Very Poor', color: '#7c3aed' },
          ].map((seg, i) => (
            <div
              key={i}
              className="flex-1 h-2 rounded-full transition-all"
              style={{
                background: seg.color,
                opacity: i + 1 <= aqi ? 1 : 0.2,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between">
          <span className="text-white/40 text-xs">Good</span>
          <span className="text-white/40 text-xs">Very Poor</span>
        </div>
      </div>

      {/* Pollutants */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {pollutants.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/50 text-xs font-medium">{p.label}</span>
            </div>
            <p className="text-white font-bold text-base">{p.value}</p>
            <p className="text-white/30 text-[10px]">{p.unit}</p>
            <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((parseFloat(p.value) / p.max) * 100, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.08 }}
                className="h-full rounded-full"
                style={{ background: p.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
