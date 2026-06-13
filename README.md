# 🌤️ WeatherVerse

> **A premium, real-time weather dashboard** built with React 18, TypeScript, Tailwind CSS, and Framer Motion.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-veekshith21.github.io-blue?style=for-the-badge)](https://veekshith21.github.io/weather_api/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Features

- 🎨 **Glassmorphism UI** — Stunning frosted-glass design with dynamic weather-themed backgrounds
- 🌡️ **Real-time Weather** — Live conditions powered by OpenWeatherMap API
- ⏱️ **Hourly Forecast** — 24-hour breakdown with animated charts
- 📅 **7-Day Forecast** — Extended outlook with daily high/low
- 💨 **Weather Stats** — Wind speed, humidity, pressure, visibility, UV index, and feels-like temp
- 🌅 **Sunrise & Sunset** — Visual sun arc with precise times
- 🌫️ **Air Quality Index** — Real-time AQI with pollutant breakdown (PM2.5, PM10, NO₂, O₃)
- 🔍 **Smart Search** — City search with autocomplete suggestions
- ⭐ **Favorites** — Save and quickly switch between favourite cities
- 🕑 **Recent Searches** — Instant access to previously searched cities
- 📱 **Fully Responsive** — Optimised for mobile, tablet, and desktop
- 🌙 **Dynamic Themes** — 8 weather-based themes (sunny, cloudy, rainy, stormy, snowy, foggy, night, night-cloudy)

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.6 | Type safety |
| Vite | 5.4 | Build tool |
| Tailwind CSS | 3.4 | Styling |
| Framer Motion | 11 | Animations |
| Lucide React | 0.363 | Icons |
| OpenWeatherMap API | v2.5 | Weather data |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/veekshith21/weather_api.git
cd weather_api

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🌐 Live Demo

**[https://veekshith21.github.io/weather_api/](https://veekshith21.github.io/weather_api/)**

Deployed automatically via GitHub Actions on every push to `main`.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AirQuality.tsx
│   ├── CurrentWeather.tsx
│   ├── DailyForecast.tsx
│   ├── HourlyForecast.tsx
│   ├── SearchBar.tsx
│   ├── SunriseSunset.tsx
│   ├── WeatherBackground.tsx
│   └── WeatherStats.tsx
├── hooks/
│   └── useWeather.ts
├── types/
│   └── weather.ts
├── utils/
│   └── weatherHelpers.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## 👤 Author

**Veekshith Reddy Ravula**
- GitHub: [@veekshith21](https://github.com/veekshith21)
- LinkedIn: [veekshith-reddy-ravula](https://www.linkedin.com/in/veekshith-reddy-ravula)

---

⭐ **Star this repo** if you found it useful!
