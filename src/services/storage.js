/**
 * MonsoonGuard — Storage Service
 * Secure localStorage wrapper with namespacing and type safety.
 * All keys are prefixed to avoid collisions.
 */

const STORAGE_PREFIX = 'monsoonguard_';

/**
 * Storage keys enum — centralizes all storage keys for maintainability
 */
export const StorageKeys = Object.freeze({
  THEME: 'theme',
  LANGUAGE: 'language',
  GEMINI_KEY: 'gemini_api_key',
  WEATHER_KEY: 'weather_api_key',
  LOCATION: 'location',
  CACHED_WEATHER: 'cached_weather',
  CACHED_FORECAST: 'cached_forecast',
  CHAT_HISTORY: 'chat_history',
  CHECKLISTS: 'checklists',
  CHECKLIST_PROGRESS: 'checklist_progress',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  LAST_WEATHER_FETCH: 'last_weather_fetch',
  NOTIFICATION_PERMISSION: 'notification_permission',
  AI_RESPONSE_CACHE: 'ai_response_cache',
});

/**
 * Get a prefixed key
 * @param {string} key 
 * @returns {string}
 */
function prefixKey(key) {
  return `${STORAGE_PREFIX}${key}`;
}

/**
 * Get a value from localStorage, parsed from JSON
 * @param {string} key - Storage key (from StorageKeys enum)
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Parsed value or default
 */
export function getItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(prefixKey(key));
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

/**
 * Set a value in localStorage, serialized as JSON
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(prefixKey(key), JSON.stringify(value));
  } catch (error) {
    console.warn('[Storage] Failed to set item:', error.message);
  }
}

/**
 * Remove a key from localStorage
 * @param {string} key - Storage key
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(prefixKey(key));
  } catch (error) {
    console.warn('[Storage] Failed to remove item:', error.message);
  }
}

/**
 * Clear all MonsoonGuard data from localStorage
 */
export function clearAll() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.warn('[Storage] Failed to clear storage:', error.message);
  }
}

/**
 * Get the current theme preference
 * @returns {'dark' | 'light'}
 */
export function getTheme() {
  const saved = getItem(StorageKeys.THEME);
  if (saved) return saved;
  // Respect system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

/**
 * Set the theme and update the DOM
 * @param {'dark' | 'light'} theme 
 */
export function setTheme(theme) {
  setItem(StorageKeys.THEME, theme);
  document.documentElement.setAttribute('data-theme', theme);
  // Update meta theme-color for mobile browsers
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#0a0e1a' : '#f5f7fb');
  }
}

/**
 * Get the current language
 * @returns {string} Language code (e.g., 'en', 'hi')
 */
export function getLanguage() {
  return getItem(StorageKeys.LANGUAGE, 'en');
}

/**
 * Cache AI response with expiry
 * @param {string} promptHash - Hash of the prompt
 * @param {string} response - AI response text
 * @param {number} ttlMs - Time to live in milliseconds (default 1 hour)
 */
export function cacheAIResponse(promptHash, response, ttlMs = 3600000) {
  const cache = getItem(StorageKeys.AI_RESPONSE_CACHE, {});
  cache[promptHash] = {
    response,
    timestamp: Date.now(),
    expiry: Date.now() + ttlMs,
  };
  // Limit cache to 50 entries (LRU-ish: remove oldest)
  const entries = Object.entries(cache);
  if (entries.length > 50) {
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const pruned = Object.fromEntries(entries.slice(-50));
    setItem(StorageKeys.AI_RESPONSE_CACHE, pruned);
  } else {
    setItem(StorageKeys.AI_RESPONSE_CACHE, cache);
  }
}

/**
 * Get cached AI response if still valid
 * @param {string} promptHash 
 * @returns {string | null}
 */
export function getCachedAIResponse(promptHash) {
  const cache = getItem(StorageKeys.AI_RESPONSE_CACHE, {});
  const entry = cache[promptHash];
  if (entry && Date.now() < entry.expiry) {
    return entry.response;
  }
  return null;
}

/**
 * Simple hash function for prompt strings (for cache keys)
 * @param {string} str 
 * @returns {string}
 */
export function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return hash.toString(36);
}
