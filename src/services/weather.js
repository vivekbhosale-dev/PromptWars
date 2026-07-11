/**
 * Weather AI — Weather API Service
 *
 * Resolution order:
 *   1. Vercel serverless proxy (/api/weather) — keys stored server-side, user sees nothing
 *   2. User-entered key from Settings (localStorage) — for personal/demo use
 *   3. Cached weather data from the last successful API fetch
 *   4. Offline placeholder — shows "Unavailable" state, never returns fake data
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
 * Offline fallback weather data — shown when API key is missing or unavailable.
 * Returns clearly labelled unavailable state; NO fake/mock data.
 */
function getOfflineWeather() {
  return {
    temp: null,
    feelsLike: null,
    tempMin: null,
    tempMax: null,
    humidity: null,
    pressure: null,
    description: 'Weather data unavailable',
    icon: null,
    main: 'Unavailable',
    windSpeed: null,
    windDeg: 0,
    visibility: null,
    clouds: null,
    rain: 0,
    city: 'Unknown',
    country: '',
    sunrise: Date.now(),
    sunset: Date.now(),
    timestamp: Date.now(),
    source: 'offline',
    isOffline: true,
  };
}

/**
 * Offline fallback forecast — shown when API key is missing or unavailable.
 * Returns clearly labelled unavailable state; NO fake/mock data.
 */
function getOfflineForecast() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  return days.map((day) => ({
    day,
    tempMin: null,
    tempMax: null,
    description: 'Unavailable',
    main: 'Unavailable',
    icon: null,
    humidity: null,
    rain: 0,
    windSpeed: null,
    isOffline: true,
  }));
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
