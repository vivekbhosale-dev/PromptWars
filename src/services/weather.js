/**
 * MonsoonGuard — Weather API Service
 * 
 * Resolution order:
 * 1. Vercel serverless proxy (/api/weather) — keys on server, user sees nothing
 * 2. User-entered key from Settings (localStorage) — for manual testing
 * 3. Cached weather data from last successful fetch
 * 4. Offline placeholder
 */

import { getItem, setItem, StorageKeys } from './storage.js';
import { CONFIG } from '../config.js';

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Check if weather API key is configured by user or config
 * @returns {boolean}
 */
export function isWeatherConfigured() {
  const key = getItem(StorageKeys.WEATHER_KEY) || CONFIG.WEATHER_KEY;
  return Boolean(key && key.trim().length > 0);
}

/**
 * Get user's current coordinates via Geolocation API
 * @returns {Promise<{lat: number, lon: number}>}
 */
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setItem(StorageKeys.LOCATION, coords);
        resolve(coords);
      },
      () => {
        const cached = getItem(StorageKeys.LOCATION);
        if (cached) {
          resolve(cached);
        } else {
          // Default to Mumbai if no location available
          resolve({ lat: 19.0760, lon: 72.8777 });
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  });
}

/**
 * Fetch current weather — tries proxy, then direct, then cache, then offline
 * @param {number} lat 
 * @param {number} lon 
 * @returns {Promise<Object>}
 */
export async function getCurrentWeather(lat, lon) {
  // Check cache first
  const cached = getItem(StorageKeys.CACHED_WEATHER);
  const lastFetch = getItem(StorageKeys.LAST_WEATHER_FETCH, 0);

  if (cached && Date.now() - lastFetch < CACHE_TTL) {
    return { ...cached, source: 'cache' };
  }

  // 1. Try Vercel serverless proxy
  try {
    const proxyData = await fetchFromProxy('current', lat, lon);
    if (proxyData) {
      const processed = processCurrentWeather(proxyData);
      setItem(StorageKeys.CACHED_WEATHER, processed);
      setItem(StorageKeys.LAST_WEATHER_FETCH, Date.now());
      return { ...processed, source: 'api' };
    }
  } catch (error) {
    if (error.message !== 'not_configured') {
      console.warn('[Weather] Proxy failed:', error.message);
    }
  }

  // 2. Try user-entered API key or config fallback
  const userKey = getItem(StorageKeys.WEATHER_KEY) || CONFIG.WEATHER_KEY;
  if (userKey) {
    try {
      const data = await fetchFromOWMDirect(userKey, 'weather', lat, lon);
      const processed = processCurrentWeather(data);
      setItem(StorageKeys.CACHED_WEATHER, processed);
      setItem(StorageKeys.LAST_WEATHER_FETCH, Date.now());
      return { ...processed, source: 'api' };
    } catch (error) {
      console.warn('[Weather] Direct API failed:', error.message);
    }
  }

  // 3. Return cached data if available
  if (cached) return { ...cached, source: 'cache' };

  // 4. Offline placeholder
  return getOfflineWeather();
}

/**
 * Fetch 5-day forecast
 * @param {number} lat 
 * @param {number} lon 
 * @returns {Promise<{days: Array, source: string}>}
 */
export async function getForecast(lat, lon) {
  const cached = getItem(StorageKeys.CACHED_FORECAST);
  const lastFetch = getItem(StorageKeys.LAST_WEATHER_FETCH, 0);

  if (cached && Date.now() - lastFetch < CACHE_TTL) {
    return { days: cached, source: 'cache' };
  }

  // 1. Try proxy
  try {
    const proxyData = await fetchFromProxy('forecast', lat, lon);
    if (proxyData) {
      const days = processForecast(proxyData);
      setItem(StorageKeys.CACHED_FORECAST, days);
      return { days, source: 'api' };
    }
  } catch (error) {
    if (error.message !== 'not_configured') {
      console.warn('[Weather] Forecast proxy failed:', error.message);
    }
  }

  // 2. Try user key or config fallback
  const userKey = getItem(StorageKeys.WEATHER_KEY) || CONFIG.WEATHER_KEY;
  if (userKey) {
    try {
      const data = await fetchFromOWMDirect(userKey, 'forecast', lat, lon);
      const days = processForecast(data);
      setItem(StorageKeys.CACHED_FORECAST, days);
      return { days, source: 'api' };
    } catch (error) {
      console.warn('[Weather] Forecast direct failed:', error.message);
    }
  }

  if (cached) return { days: cached, source: 'cache' };
  return { days: getOfflineForecast(), source: 'offline' };
}

/**
 * Fetch from Vercel serverless proxy
 */
async function fetchFromProxy(type, lat, lon) {
  const url = `/api/weather?type=${type}&lat=${lat}&lon=${lon}`;
  const response = await fetch(url);

  if (response.status === 503) {
    const data = await response.json();
    if (data.error === 'not_configured') {
      throw new Error('not_configured');
    }
  }

  if (!response.ok) {
    throw new Error(`Proxy returned ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch directly from OpenWeatherMap using user-provided key
 */
async function fetchFromOWMDirect(apiKey, endpoint, lat, lon) {
  const url = `${OWM_BASE}/${endpoint}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OWM API returned ${response.status}`);
  }

  return response.json();
}

/**
 * Process raw current weather response
 */
function processCurrentWeather(data) {
  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    main: data.weather[0].main,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg,
    visibility: data.visibility ? data.visibility / 1000 : null,
    clouds: data.clouds.all,
    rain: data.rain ? data.rain['1h'] || data.rain['3h'] || 0 : 0,
    city: data.name,
    country: data.sys.country,
    sunrise: data.sys.sunrise * 1000,
    sunset: data.sys.sunset * 1000,
    timestamp: Date.now(),
  };
}

/**
 * Process forecast data — aggregate to daily
 */
function processForecast(data) {
  const dailyMap = new Map();

  for (const item of data.list) {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });

    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        day: date,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        description: item.weather[0].description,
        main: item.weather[0].main,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        rain: 0,
        windSpeed: item.wind.speed,
      });
    } else {
      const existing = dailyMap.get(date);
      existing.tempMin = Math.min(existing.tempMin, item.main.temp_min);
      existing.tempMax = Math.max(existing.tempMax, item.main.temp_max);
      existing.rain += item.rain ? (item.rain['3h'] || 0) : 0;
    }
  }

  return Array.from(dailyMap.values())
    .slice(0, 5)
    .map((d) => ({
      ...d,
      tempMin: Math.round(d.tempMin),
      tempMax: Math.round(d.tempMax),
      rain: Math.round(d.rain * 10) / 10,
    }));
}

/**
 * Get weather icon emoji
 */
export function getWeatherEmoji(icon) {
  const map = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '🌨️', '13n': '🌨️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return map[icon] || '🌤️';
}

/**
 * Assess monsoon risk level
 */
export function assessMonsoonRisk(weather) {
  if (!weather || weather.isOffline) {
    return { level: 'unknown', label: 'Unknown', description: 'No weather data available. Add a Weather API key in Settings.' };
  }

  const { rain, humidity, windSpeed, main } = weather;

  if (main === 'Thunderstorm' || rain > 50 || windSpeed > 20) {
    return { level: 'severe', label: 'Severe', description: 'Severe weather conditions. Stay indoors. Avoid travel.' };
  }
  if (main === 'Rain' && (rain > 20 || humidity > 90 || windSpeed > 15)) {
    return { level: 'high', label: 'High', description: 'Heavy rainfall expected. Take precautions and avoid low-lying areas.' };
  }
  if ((main === 'Rain' || main === 'Drizzle') && humidity > 75) {
    return { level: 'moderate', label: 'Moderate', description: 'Moderate monsoon activity. Keep emergency supplies ready.' };
  }
  return { level: 'low', label: 'Low', description: 'Currently safe conditions. Stay prepared for changes.' };
}

/**
 * Offline fallback weather data (Demo Mode for Hackathon)
 */
function getOfflineWeather() {
  return {
    temp: 28,
    feelsLike: 32,
    tempMin: 26,
    tempMax: 30,
    humidity: 85,
    pressure: 1004,
    description: 'Heavy intense rain (Demo Data)',
    icon: '09d',
    main: 'Rain',
    windSpeed: 15.5,
    windDeg: 210,
    visibility: 2.5,
    clouds: 100,
    rain: 45.2,
    city: 'Mumbai',
    country: 'IN',
    sunrise: Date.now() - 40000000,
    sunset: Date.now() + 40000000,
    timestamp: Date.now(),
    source: 'offline',
    isOffline: true,
  };
}

/**
 * Offline fallback forecast (Demo Mode for Hackathon)
 */
function getOfflineForecast() {
  return [
    { day: 'Mon', tempMin: 25, tempMax: 29, description: 'Heavy Rain', main: 'Rain', icon: '09d', humidity: 88, rain: 60, windSpeed: 18, isOffline: true },
    { day: 'Tue', tempMin: 24, tempMax: 28, description: 'Thunderstorm', main: 'Thunderstorm', icon: '11d', humidity: 92, rain: 85, windSpeed: 22, isOffline: true },
    { day: 'Wed', tempMin: 26, tempMax: 30, description: 'Moderate Rain', main: 'Rain', icon: '10d', humidity: 80, rain: 25, windSpeed: 12, isOffline: true },
    { day: 'Thu', tempMin: 27, tempMax: 32, description: 'Cloudy', main: 'Clouds', icon: '04d', humidity: 75, rain: 0, windSpeed: 8, isOffline: true },
    { day: 'Fri', tempMin: 26, tempMax: 31, description: 'Light Rain', main: 'Rain', icon: '10d', humidity: 78, rain: 5, windSpeed: 10, isOffline: true }
  ];
}

/**
 * Validate an OpenWeatherMap API key
 */
export async function validateWeatherKey(apiKey) {
  try {
    const url = `${OWM_BASE}/weather?lat=28.6139&lon=77.2090&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}
