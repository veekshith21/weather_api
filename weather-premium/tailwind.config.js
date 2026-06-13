/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'rain': 'rain 0.8s linear infinite',
        'snow': 'snow 6s linear infinite',
        'lightning': 'lightning 8s ease-in-out infinite',
        'fog': 'fog 12s ease-in-out infinite',
        'cloud-move': 'cloudMove 25s linear infinite',
        'cloud-move-slow': 'cloudMove 40s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        rain: {
          '0%': { transform: 'translateY(-100vh)', opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0.3' },
        },
        snow: {
          '0%': { transform: 'translateY(-10vh) translateX(0px)', opacity: '1' },
          '50%': { transform: 'translateY(50vh) translateX(30px)', opacity: '0.8' },
          '100%': { transform: 'translateY(110vh) translateX(-10px)', opacity: '0' },
        },
        lightning: {
          '0%, 90%, 100%': { opacity: '0' },
          '92%, 96%': { opacity: '1' },
          '94%, 98%': { opacity: '0.3' },
        },
        fog: {
          '0%, 100%': { transform: 'translateX(0%)', opacity: '0.4' },
          '50%': { transform: 'translateX(8%)', opacity: '0.6' },
        },
        cloudMove: {
          '0%': { transform: 'translateX(-20%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(251, 191, 36, 0.7)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
