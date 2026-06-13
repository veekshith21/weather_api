export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Visibility {
  visibility: number;
}

export interface Sys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface CurrentWeatherData {
  coord: Coord;
  weather: WeatherCondition[];
  main: MainWeather;
  visibility: number;
  wind: Wind;
  sys: Sys;
  name: string;
  dt: number;
  timezone: number;
  id: number;
}

export interface ForecastItem {
  dt: number;
  main: MainWeather;
  weather: WeatherCondition[];
  wind: Wind;
  visibility: number;
  dt_txt: string;
  pop: number; // probability of precipitation
}

export interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
    coord: Coord;
    sunrise: number;
    sunset: number;
    timezone: number;
  };
}

export interface AirQualityComponent {
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

export interface AirQualityData {
  list: Array<{
    main: { aqi: number };
    components: AirQualityComponent;
    dt: number;
  }>;
}

export type WeatherTheme =
  | 'sunny'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'foggy'
  | 'night'
  | 'night-cloudy';

export interface DailyForecast {
  date: string;
  dayName: string;
  icon: string;
  description: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  windSpeed: number;
  pop: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
  description: string;
  pop: number;
  windSpeed: number;
}

export type TemperatureUnit = 'metric' | 'imperial';

export interface AppSettings {
  unit: TemperatureUnit;
  darkMode: boolean;
}
