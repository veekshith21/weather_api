import { motion } from 'framer-motion';
import { WeatherTheme } from '../types/weather';
import { themeConfig } from '../utils/weatherHelpers';

interface Props { theme: WeatherTheme }

function RainDrops() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-px bg-blue-300/40 animate-rain"
          style={{
            left: `${Math.random() * 100}%`,
            height: `${Math.random() * 60 + 40}px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${Math.random() * 0.5 + 0.6}s`,
            top: '-60px',
          }}
        />
      ))}
    </div>
  );
}

function Snowflakes() {
  const flakes = ['❄', '❅', '❆', '*', '·'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/60 select-none"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 14 + 8}px`,
            top: '-20px',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, (Math.random() - 0.5) * 80],
            rotate: [0, 360],
            opacity: [1, 0.3, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: 'linear',
          }}
        >
          {flakes[Math.floor(Math.random() * flakes.length)]}
        </motion.div>
      ))}
    </div>
  );
}

function LightningFlash() {
  return (
    <>
      <motion.div
        className="absolute inset-0 bg-purple-100/20 pointer-events-none"
        animate={{ opacity: [0, 0, 0, 1, 0, 0.4, 0, 0, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      {/* SVG lightning bolt */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '8%', left: `${25 + Math.random() * 50}%` }}
        animate={{ opacity: [0, 0, 0, 1, 0.5, 0, 0, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 0.1 }}
      >
        <svg width="24" height="80" viewBox="0 0 24 80">
          <path d="M16 0L4 44h8L8 80l16-50H16z" fill="rgba(196,181,253,0.9)" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '12%', left: `${35 + Math.random() * 30}%` }}
        animate={{ opacity: [0, 0, 0, 0, 0, 0, 1, 0.3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="18" height="60" viewBox="0 0 24 80">
          <path d="M16 0L4 44h8L8 80l16-50H16z" fill="rgba(167,139,250,0.8)" />
        </svg>
      </motion.div>
    </>
  );
}

function FogLayers() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0.15, 0.35, 0.55, 0.7].map((opacity, i) => (
        <motion.div
          key={i}
          className="absolute w-[200%] rounded-full"
          style={{
            background: `radial-gradient(ellipse 80% 40% at 50% 50%, rgba(255,255,255,${opacity}) 0%, transparent 70%)`,
            height: '30%',
            top: `${15 + i * 18}%`,
            left: '-50%',
          }}
          animate={{ x: ['-5%', '5%', '-5%'] }}
          transition={{ duration: 12 + i * 4, repeat: Infinity, ease: 'easeInOut', delay: i * 2 }}
        />
      ))}
    </div>
  );
}

function FloatingParticles({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            background: color,
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.4,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function Stars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 80 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 70}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}
    </div>
  );
}

function MovingClouds() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        { top: '5%', size: 300, duration: 30, delay: 0 },
        { top: '20%', size: 200, duration: 45, delay: 5 },
        { top: '10%', size: 250, duration: 35, delay: 12 },
        { top: '35%', size: 350, duration: 50, delay: 20 },
      ].map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: cloud.top,
            width: `${cloud.size}px`,
            left: '-25%',
            opacity: 0.4,
          }}
          animate={{ x: ['0%', '700%'] }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            delay: cloud.delay,
            ease: 'linear',
          }}
        >
          <svg viewBox="0 0 200 80" fill="white">
            <ellipse cx="80" cy="60" rx="70" ry="30" />
            <ellipse cx="100" cy="45" rx="50" ry="35" />
            <ellipse cx="130" cy="58" rx="40" ry="25" />
            <ellipse cx="60" cy="55" rx="35" ry="22" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function SunGlow() {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top: '-5%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(251,191,36,0.1) 50%, transparent 70%)',
        borderRadius: '50%',
      }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function WeatherBackground({ theme }: Props) {
  const config = themeConfig[theme];

  return (
    <div
      className="fixed inset-0 transition-all duration-1000"
      style={{ background: config.gradient }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Theme-specific effects */}
      {(theme === 'rainy') && <RainDrops />}
      {theme === 'snowy' && <Snowflakes />}
      {theme === 'stormy' && (
        <>
          <RainDrops />
          <LightningFlash />
        </>
      )}
      {theme === 'foggy' && <FogLayers />}
      {(theme === 'night' || theme === 'night-cloudy') && <Stars />}
      {(theme === 'cloudy' || theme === 'night-cloudy') && <MovingClouds />}
      {theme === 'sunny' && (
        <>
          <SunGlow />
          <FloatingParticles color={config.particleColor} />
        </>
      )}

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}
