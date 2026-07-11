/**
 * Weather AI — Main Application
 * Entry point: initializes theme, router, service worker, and renders all pages.
 * Architecture: Hash-based SPA with lazy-loaded page modules and graceful offline fallback.
 */

import { getTheme, setTheme, getItem, setItem, StorageKeys, clearAll } from './services/storage.js';

// ─── App Initialization ─────────────────────────────────────────────

function initApp() {
  setTheme(getTheme());
  renderSidebar();
  renderBottomNav();
  setupRouter();
  registerServiceWorker();

  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  updateNetworkStatus();
}

/**
 * Registers the Service Worker for PWA offline support.
 * Silently skips if the browser does not support Service Workers.
 */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('[SW] Registered, scope:', reg.scope))
      .catch((err) => console.warn('[SW] Registration failed:', err));
  });
}

// ─── Network Status ─────────────────────────────────────────────────

/**
 * Updates all network status indicator elements in the UI.
 * Shows a warning toast when the user goes offline.
 */
function updateNetworkStatus() {
  const isOnline = navigator.onLine;
  const statusClass = isOnline ? 'online-badge' : 'offline-badge';
  const dotClass = isOnline ? 'online' : 'offline';
  const label = isOnline ? 'Online' : 'Offline Mode';

  document.querySelectorAll('.network-status-indicator').forEach((el) => {
    el.className = `network-status-indicator ${statusClass}`;
    el.innerHTML = `<div class="status-dot ${dotClass}"></div>${label}`;
  });

  if (!isOnline) {
    showToast('You are offline. The app will use cached data and the built-in knowledge base.', 'warning');
  }
}

// ─── Toast Notifications ────────────────────────────────────────────

/**
 * Displays a dismissible toast notification at the top-right of the screen.
 * Auto-dismisses after 5 seconds.
 * @param {string} message - The notification message (XSS-safe).
 * @param {'info' | 'success' | 'warning' | 'danger'} [type='info'] - Visual variant.
 */
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const DISMISS_DELAY_MS = 200;
  const AUTO_DISMISS_MS = 5000;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-message">${escapeHtml(message)}</div>
    <button class="toast-close" aria-label="Dismiss notification">✕</button>
  `;

  const dismiss = () => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), DISMISS_DELAY_MS);
  };

  toast.querySelector('.toast-close').addEventListener('click', dismiss);
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentElement) dismiss(); }, AUTO_DISMISS_MS);
}

/**
 * Sanitizes a string to prevent XSS attacks by encoding HTML entities.
 * Uses the browser's built-in DOM parser for reliable escaping.
 * @param {string} str - Raw input string.
 * @returns {string} HTML-safe string.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Converts a subset of Markdown syntax to safe HTML for rendering AI responses.
 * Escapes HTML entities first to prevent XSS, then applies formatting rules.
 * @param {string} text - Raw Markdown string from the AI.
 * @returns {string} Sanitized HTML string.
 */
function markdownToHtml(text) {
  return text
    // 1. Escape HTML entities first to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // 2. Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // 3. Inline formatting
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 4. Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // 5. Blockquotes and line breaks
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^(.+)$/, '<p>$1</p>');
}

// ─── SVG Icons ──────────────────────────────────────────────────────

const ICONS = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  checklist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  shield: '<svg viewBox="0 0 192 192" fill="none"><path d="M96 28 L148 52 L148 100 C148 132 126 156 96 168 C66 156 44 132 44 100 L44 52 Z" fill="#00d4aa" opacity="0.9"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
};

// ─── Navigation ─────────────────────────────────────────────────────

const NAV_ITEMS = [
  { hash: '#dashboard', label: 'Dashboard', icon: 'dashboard' },
  { hash: '#assistant', label: 'AI Assistant', icon: 'chat' },
  { hash: '#checklists', label: 'Checklists', icon: 'checklist' },
  { hash: '#settings', label: 'Settings', icon: 'settings' },
];

function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <div class="sidebar-logo">${ICONS.shield}<span class="sidebar-logo-text">Weather AI</span></div>
    </div>
    <div class="sidebar-nav">
      ${NAV_ITEMS.map((item) => `<a href="${item.hash}" class="nav-item" data-route="${item.hash}">${ICONS[item.icon]}<span>${item.label}</span></a>`).join('')}
    </div>
    <div class="sidebar-footer">
      <div class="network-status-indicator ${navigator.onLine ? 'online-badge' : 'offline-badge'}">
        <div class="status-dot ${navigator.onLine ? 'online' : 'offline'}"></div>${navigator.onLine ? 'Online' : 'Offline Mode'}
      </div>
    </div>
  `;
}

function renderBottomNav() {
  const bottomNav = document.getElementById('bottom-nav');
  if (!bottomNav) return;
  bottomNav.innerHTML = NAV_ITEMS.map((item) =>
    `<a href="${item.hash}" class="bottom-nav-item" data-route="${item.hash}">${ICONS[item.icon]}<span>${item.label}</span></a>`
  ).join('');
}

function updateActiveNav(hash) {
  const activeHash = hash || '#dashboard';
  document.querySelectorAll('[data-route]').forEach((el) => {
    el.classList.toggle('active', el.getAttribute('data-route') === activeHash);
  });
}

// ─── Router ─────────────────────────────────────────────────────────

const routes = {
  '': renderDashboard,
  '#dashboard': renderDashboard,
  '#assistant': renderAssistant,
  '#checklists': renderChecklists,
  '#settings': renderSettings,
};

/**
 * Sets up the client-side hash router.
 * Navigates between pages by reading window.location.hash and calling the
 * matching render function. Shows a loading spinner during async renders.
 */
function setupRouter() {
  const handleRoute = async () => {
    const hash = window.location.hash;
    const route = routes[hash] ?? routes[''];
    const container = document.getElementById('page-container');

    updateActiveNav(hash);

    // Show spinner while the page loads
    container.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';

    // Restart CSS entry animation via reflow trick
    container.style.animation = 'none';
    void container.offsetHeight; // eslint-disable-line no-void
    container.style.animation = '';

    try {
      await route(container);
    } catch (error) {
      console.error('[Router] Render error on route', hash, ':', error);
      container.innerHTML = [
        '<div class="empty-state">',
        '  <h3>Something went wrong</h3>',
        `  <p>${escapeHtml(error.message)}</p>`,
        '  <a href="#dashboard" class="btn btn-primary" style="margin-top:1rem;">Go to Dashboard</a>',
        '</div>',
      ].join('');
    }
  };

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

// ═══════════════════════════════════════════════════════════════════
// PAGE: Dashboard
// ═══════════════════════════════════════════════════════════════════

/**
 * Renders the Dashboard page with live weather, risk assessment, forecast,
 * emergency contacts, and safety recommendations.
 * Falls back gracefully if geolocation or weather APIs are unavailable.
 * @param {HTMLElement} container - The page container element.
 */
async function renderDashboard(container) {
  const { getCurrentWeather, getForecast, getCurrentPosition, assessMonsoonRisk, getWeatherEmoji } = await import('./services/weather.js');
  const { emergencyContacts, safetyRecommendations } = await import('./services/offline-knowledge.js');

  // Default to Mumbai (financial capital, high monsoon risk city) if GPS unavailable
  const MUMBAI_COORDS = { lat: 19.0760, lon: 72.8777 };
  let coords;
  try {
    coords = await getCurrentPosition();
  } catch {
    coords = MUMBAI_COORDS;
  }

  let weather, forecast, risk;
  try {
    weather = await getCurrentWeather(coords.lat, coords.lon);
    risk = assessMonsoonRisk(weather);
  } catch {
    weather = { temp: '--', description: 'Could not load weather', isOffline: true, humidity: '--', windSpeed: '--', rain: 0, city: 'Unknown', icon: '03d', source: 'offline' };
    risk = { level: 'unknown', label: 'Unknown', description: 'Weather data unavailable' };
  }

  try {
    const forecastData = await getForecast(coords.lat, coords.lon);
    forecast = forecastData.days;
  } catch {
    forecast = [];
  }

  const weatherEmoji = weather.icon ? getWeatherEmoji(weather.icon) : '🌤️';
  const sourceLabel = weather.source === 'api' ? '🟢 Live' : weather.source === 'cache' ? '🟡 Cached' : '🔴 Offline';

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title"><span class="gradient-text">Dashboard</span></h1>
      <p class="page-subtitle">Your monsoon preparedness command center. Stay informed, stay safe.</p>
    </div>

    <!-- Weather Overview -->
    <div class="weather-main-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
        <div>
          <div style="font-size:var(--font-xs); color:var(--color-text-tertiary); margin-bottom:0.25rem;">${sourceLabel} Data</div>
          <div class="weather-temp">${weatherEmoji} ${weather.temp}<span class="unit">°C</span></div>
          <div class="weather-condition">${weather.description}</div>
          <div class="weather-location">${ICONS.location} ${weather.city || 'Unknown location'}${weather.country ? ', ' + weather.country : ''}</div>
        </div>
        <div class="risk-level ${risk.level}" style="align-self:flex-start;">⚠ ${risk.label} Risk</div>
      </div>
      <p style="font-size:var(--font-sm); color:var(--color-text-secondary); margin-top:0.75rem;">${risk.description}</p>
      <div class="weather-details">
        <div class="weather-detail-item"><div class="weather-detail-value">💧 ${weather.humidity}${weather.humidity !== '--' ? '%' : ''}</div><div class="weather-detail-label">Humidity</div></div>
        <div class="weather-detail-item"><div class="weather-detail-value">🌧️ ${weather.rain}${weather.rain !== '--' ? 'mm' : ''}</div><div class="weather-detail-label">Rainfall</div></div>
        <div class="weather-detail-item"><div class="weather-detail-value">💨 ${weather.windSpeed}${weather.windSpeed !== '--' ? ' m/s' : ''}</div><div class="weather-detail-label">Wind</div></div>
        <div class="weather-detail-item"><div class="weather-detail-value">☁️ ${weather.clouds !== undefined && weather.clouds !== '--' ? weather.clouds + '%' : '--'}</div><div class="weather-detail-label">Cloud Cover</div></div>
      </div>
    </div>

    <!-- 5-Day Forecast -->
    ${forecast.length > 0 ? `
    <div class="card" style="margin-top:var(--space-lg);">
      <h3 class="card-title">5-Day Forecast</h3>
      ${forecast.map((day) => `
        <div class="forecast-row">
          <div class="forecast-day">${day.day}</div>
          <div class="forecast-icon">${day.icon ? getWeatherEmoji(day.icon) : '🌤️'}</div>
          <div class="forecast-desc">${day.description}</div>
          <div class="forecast-temp">${day.tempMax}° <span class="low">/ ${day.tempMin}°</span></div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="grid-2" style="margin-top:var(--space-lg);">
      <!-- Quick Actions -->
      <div class="card">
        <h3 class="card-title">Quick Actions</h3>
        <div class="quick-actions" style="margin-top:1rem;">
          <a href="#assistant" class="quick-action">${ICONS.chat}<span>Ask AI Assistant</span></a>
          <a href="#checklists" class="quick-action">${ICONS.checklist}<span>Emergency Checklists</span></a>
        </div>
      </div>

      <!-- Emergency Contacts -->
      <div class="card">
        <h3 class="card-title">🆘 Emergency Contacts</h3>
        <div style="margin-top:0.5rem;">
          ${emergencyContacts.slice(0, 5).map((c) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-bottom:1px solid var(--color-border);">
              <div><div style="font-size:var(--font-sm); font-weight:600;">${c.name}</div><div style="font-size:var(--font-xs); color:var(--color-text-tertiary);">${c.description}</div></div>
              <a href="tel:${c.number}" class="badge badge-accent" style="font-size:var(--font-sm);">${c.number}</a>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Safety Tips -->
    <div class="card" style="margin-top:var(--space-lg);">
      <h3 class="card-title">${safetyRecommendations.during.icon} Safety Tips — During Monsoon</h3>
      <div style="margin-top:0.75rem; display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:0.5rem;">
        ${safetyRecommendations.during.tips.slice(0, 6).map((tip) => `
          <div style="display:flex; align-items:flex-start; gap:0.5rem; font-size:var(--font-sm); color:var(--color-text-secondary); padding:0.5rem; background:var(--color-bg-tertiary); border-radius:var(--radius-sm);">
            <span style="color:var(--color-accent); font-weight:700;">✓</span> ${tip}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════
// PAGE: AI Assistant
// ═══════════════════════════════════════════════════════════════════

/**
 * Renders the AI Assistant page with a live chat interface powered by Gemini.
 * Falls back to the offline knowledge base when Gemini is not configured.
 * Supports multi-turn conversation history and quick-prompt shortcuts.
 * @param {HTMLElement} container - The page container element.
 */
async function renderAssistant(container) {
  const { generateResponse, isGeminiConfigured } = await import('./services/gemini.js');

  const quickPrompts = [
    'Generate a personalized preparedness plan for my family',
    'Give me a travel advisory for driving in heavy rain',
    'What is the weather-aware guidance for today?',
    'कृपया मुझे हिंदी में सुरक्षा सलाह दें (Translate to Hindi)',
    'First aid for monsoon-related injuries',
    'How to prevent dengue and malaria?',
  ];

  const statusBadge = isGeminiConfigured()
    ? '<span class="badge badge-success">🟢 Gemini API Connected</span>'
    : '<span class="badge badge-warning">📦 Using Offline Knowledge Base</span>';

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">AI <span class="gradient-text">Assistant</span></h1>
      <p class="page-subtitle">Ask anything about monsoon safety, preparedness, or emergencies. ${statusBadge}</p>
    </div>

    <!-- Quick prompts -->
    <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
      ${quickPrompts.map((q) => `<button class="btn btn-secondary btn-sm quick-prompt-btn">${q}</button>`).join('')}
    </div>

    <div class="card" style="height: 55vh; display: flex; flex-direction: column;">
      <div id="chat-messages" class="chat-container" style="flex: 1; overflow-y: auto; padding: 1rem;">
        <div class="chat-bubble system">🛡️ Weather AI is ready. Ask any safety question.</div>
      </div>
      <div class="chat-input-area">
        <input type="text" id="chat-input" class="input" placeholder="Type your question here..." aria-label="Chat message input" />
        <button id="send-btn" class="btn btn-primary" aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  `;

  const input = document.getElementById('chat-input');
  const btn = document.getElementById('send-btn');
  const messages = document.getElementById('chat-messages');
  const chatHistory = [];
  let isProcessing = false;

  const handleSend = async () => {
    const text = input.value.trim();
    if (!text || isProcessing) return;

    isProcessing = true;
    btn.disabled = true;

    // User bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.textContent = text;
    messages.appendChild(userBubble);
    chatHistory.push({ role: 'user', text });

    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // Loading bubble
    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'chat-bubble assistant';
    loadingBubble.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    messages.appendChild(loadingBubble);
    messages.scrollTop = messages.scrollHeight;

    try {
      const res = await generateResponse(text, chatHistory);
      loadingBubble.className = 'chat-bubble assistant markdown-content';
      loadingBubble.innerHTML = markdownToHtml(res.text);
      chatHistory.push({ role: 'assistant', text: res.text });

      if (res.source === 'offline') {
        showToast('Response from offline knowledge base. Add a Gemini API key in Settings for AI-powered answers.', 'info');
      } else if (res.source === 'cache') {
        showToast('Response loaded from cache.', 'info');
      }
    } catch (error) {
      loadingBubble.className = 'chat-bubble assistant';
      loadingBubble.innerHTML = `<span style="color:var(--color-danger);">Sorry, an error occurred: ${escapeHtml(error.message)}</span>`;
    }

    messages.scrollTop = messages.scrollHeight;
    isProcessing = false;
    btn.disabled = false;
    input.focus();
  };

  btn.addEventListener('click', handleSend);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

  // Quick prompt buttons
  document.querySelectorAll('.quick-prompt-btn').forEach((b) => {
    b.addEventListener('click', () => {
      input.value = b.textContent;
      handleSend();
    });
  });

  input.focus();
}

// ═══════════════════════════════════════════════════════════════════
// PAGE: Checklists
// ═══════════════════════════════════════════════════════════════════

/**
 * Renders the Emergency Checklists page.
 * Shows a grid of NDMA-aligned checklist categories with progress tracking.
 * All progress is persisted to localStorage for continuity across sessions.
 * @param {HTMLElement} container - The page container element.
 */
async function renderChecklists(container) {
  const { emergencyChecklists } = await import('./services/offline-knowledge.js');
  const progress = getItem(StorageKeys.CHECKLIST_PROGRESS, {});

  function getProgress(listId) {
    const listProgress = progress[listId] || {};
    const checklist = emergencyChecklists[listId];
    const total = checklist.items.length;
    const done = Object.values(listProgress).filter(Boolean).length;
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Emergency <span class="gradient-text">Checklists</span></h1>
      <p class="page-subtitle">Expert-curated checklists powered by NDMA and Red Cross guidelines. Track your progress.</p>
    </div>
    <div id="checklist-view"></div>
  `;

  renderChecklistGrid();

  function renderChecklistGrid() {
    const view = document.getElementById('checklist-view');
    view.innerHTML = `
      <div class="grid-3">
        ${Object.values(emergencyChecklists).map((list) => {
          const p = getProgress(list.id);
          return `
          <div class="card" style="cursor:pointer;" data-list="${list.id}">
            <h3 class="card-title">${list.title}</h3>
            <p class="card-subtitle">${list.description}</p>
            <div class="progress-bar-container" style="margin-top:1rem;">
              <div class="progress-bar-label"><span>${p.done}/${p.total} completed</span><span>${p.pct}%</span></div>
              <div class="progress-bar"><div class="progress-bar-fill" style="width:${p.pct}%"></div></div>
            </div>
          </div>`;
        }).join('')}
      </div>
    `;

    view.querySelectorAll('[data-list]').forEach((card) => {
      card.addEventListener('click', () => renderChecklistDetail(card.getAttribute('data-list')));
    });
  }

  function renderChecklistDetail(listId) {
    const list = emergencyChecklists[listId];
    if (!list) return;

    const view = document.getElementById('checklist-view');
    const listProgress = progress[listId] || {};

    view.innerHTML = `
      <button class="btn btn-ghost" id="back-to-grid" style="margin-bottom:1rem;">← Back to all checklists</button>
      <div class="card">
        <h3 class="card-title">${list.title}</h3>
        <p class="card-subtitle" style="margin-bottom:1rem;">${list.description}</p>
        <div id="checklist-items">
          ${list.items.map((item) => {
            const checked = !!listProgress[item.id];
            return `
            <div class="checklist-item" data-item="${item.id}">
              <div class="checklist-checkbox ${checked ? 'checked' : ''}" role="checkbox" aria-checked="${checked}" tabindex="0">
                ${checked ? ICONS.check : ''}
              </div>
              <div class="checklist-text ${checked ? 'completed' : ''}">
                <h4>${item.text}</h4>
                <p>Priority: <span class="badge badge-${item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'info'}">${item.priority}</span></p>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
    `;

    document.getElementById('back-to-grid').addEventListener('click', renderChecklistGrid);

    document.querySelectorAll('.checklist-item').forEach((el) => {
      el.addEventListener('click', () => {
        const itemId = el.getAttribute('data-item');
        if (!progress[listId]) progress[listId] = {};
        progress[listId][itemId] = !progress[listId][itemId];
        setItem(StorageKeys.CHECKLIST_PROGRESS, progress);
        renderChecklistDetail(listId); // Re-render
      });
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
// PAGE: Settings
// ═══════════════════════════════════════════════════════════════════

/**
 * Renders the Settings page for API key configuration, theme, and data management.
 * Keys are stored in localStorage and are never sent to any third-party service.
 * @param {HTMLElement} container - The page container element.
 */
async function renderSettings(container) {
  const { validateGeminiKey } = await import('./services/gemini.js');
  const { validateWeatherKey } = await import('./services/weather.js');

  const geminiKey = getItem(StorageKeys.GEMINI_KEY, '');
  const weatherKey = getItem(StorageKeys.WEATHER_KEY, '');
  const currentTheme = getTheme();

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title"><span class="gradient-text">Settings</span></h1>
      <p class="page-subtitle">Configure API keys, appearance, and preferences.</p>
    </div>

    <div style="max-width:640px;">
      <!-- API Configuration -->
      <div class="card" style="margin-bottom:var(--space-lg);">
        <h3 class="card-title">🔑 API Configuration</h3>
        <p class="card-subtitle" style="margin-bottom:1rem;">Add your free API keys to enable real-time AI and weather features. The app works offline without them.</p>

        <div class="alert-banner info" style="margin-bottom:1.5rem;">
          <div class="alert-banner-icon">${ICONS.alert}</div>
          <div class="alert-banner-content">
            <div class="alert-banner-title">How API Keys Work</div>
            <div class="alert-banner-text">
              <strong>Without keys:</strong> The app uses a built-in offline knowledge base for safety guidance.<br/>
              <strong>With keys:</strong> You get live AI-powered responses (Gemini) and real-time weather data (OpenWeatherMap).<br/>
              <strong>When deployed:</strong> Keys can be set as server environment variables so end users don't need to enter them.
            </div>
          </div>
        </div>

        <div class="input-group">
          <label class="input-label" for="gemini-key-input">Gemini API Key</label>
          <div style="display:flex; gap:0.5rem;">
            <input type="password" id="gemini-key-input" class="input" placeholder="Paste your Gemini API key here" value="${escapeHtml(geminiKey)}" style="flex:1;" />
            <button id="validate-gemini" class="btn btn-secondary btn-sm">Test</button>
          </div>
          <div class="input-hint">Get a free key → <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" style="color:var(--color-accent);">Google AI Studio</a></div>
          <div id="gemini-status" style="margin-top:0.25rem;"></div>
        </div>

        <div class="input-group">
          <label class="input-label" for="weather-key-input">OpenWeatherMap API Key</label>
          <div style="display:flex; gap:0.5rem;">
            <input type="password" id="weather-key-input" class="input" placeholder="Paste your OpenWeatherMap key here" value="${escapeHtml(weatherKey)}" style="flex:1;" />
            <button id="validate-weather" class="btn btn-secondary btn-sm">Test</button>
          </div>
          <div class="input-hint">Get a free key → <a href="https://home.openweathermap.org/api_keys" target="_blank" rel="noopener" style="color:var(--color-accent);">OpenWeatherMap</a></div>
          <div id="weather-status" style="margin-top:0.25rem;"></div>
        </div>

        <button id="save-keys" class="btn btn-primary" style="margin-top:0.5rem;">💾 Save API Keys</button>
      </div>

      <!-- Appearance -->
      <div class="card" style="margin-bottom:var(--space-lg);">
        <h3 class="card-title">🎨 Appearance</h3>
        <div class="toggle-group" style="border-bottom:none;">
          <div class="toggle-label">
            <span>Dark Mode</span>
            <small>Switch between dark and light themes</small>
          </div>
          <button id="theme-toggle-btn" class="toggle-switch ${currentTheme === 'dark' ? 'active' : ''}" aria-label="Toggle dark mode"></button>
        </div>
      </div>

      <!-- Data Management -->
      <div class="card">
        <h3 class="card-title">🗄️ Data Management</h3>
        <p class="card-subtitle">Manage locally stored data (checklists, cached responses, settings).</p>
        <div style="margin-top:1rem; display:flex; gap:0.75rem; flex-wrap:wrap;">
          <button id="clear-cache" class="btn btn-secondary btn-sm">Clear Response Cache</button>
          <button id="clear-all" class="btn btn-danger btn-sm">Reset All Data</button>
        </div>
      </div>
    </div>
  `;

  // Save keys
  document.getElementById('save-keys').addEventListener('click', () => {
    const gKey = document.getElementById('gemini-key-input').value.trim();
    const wKey = document.getElementById('weather-key-input').value.trim();
    setItem(StorageKeys.GEMINI_KEY, gKey);
    setItem(StorageKeys.WEATHER_KEY, wKey);
    showToast('API keys saved successfully!', 'success');
  });

  // Validate Gemini
  document.getElementById('validate-gemini').addEventListener('click', async () => {
    const key = document.getElementById('gemini-key-input').value.trim();
    const status = document.getElementById('gemini-status');
    if (!key) { status.innerHTML = '<span class="badge badge-warning">No key entered</span>'; return; }
    status.innerHTML = '<span class="badge badge-info">Testing...</span>';
    const valid = await validateGeminiKey(key);
    status.innerHTML = valid
      ? '<span class="badge badge-success">✅ Valid — Gemini API is working!</span>'
      : '<span class="badge badge-danger">❌ Invalid key or network error</span>';
  });

  // Validate Weather
  document.getElementById('validate-weather').addEventListener('click', async () => {
    const key = document.getElementById('weather-key-input').value.trim();
    const status = document.getElementById('weather-status');
    if (!key) { status.innerHTML = '<span class="badge badge-warning">No key entered</span>'; return; }
    status.innerHTML = '<span class="badge badge-info">Testing...</span>';
    const valid = await validateWeatherKey(key);
    status.innerHTML = valid
      ? '<span class="badge badge-success">✅ Valid — Weather API is working!</span>'
      : '<span class="badge badge-danger">❌ Invalid key or network error. Note: new OWM keys can take up to 2 hours to activate.</span>';
  });

  // Theme toggle
  document.getElementById('theme-toggle-btn').addEventListener('click', (e) => {
    const isDark = e.currentTarget.classList.toggle('active');
    setTheme(isDark ? 'dark' : 'light');
    showToast(`Switched to ${isDark ? 'dark' : 'light'} mode`, 'info');
  });

  // Clear cache
  document.getElementById('clear-cache').addEventListener('click', () => {
    setItem(StorageKeys.AI_RESPONSE_CACHE, {});
    setItem(StorageKeys.CACHED_WEATHER, null);
    setItem(StorageKeys.CACHED_FORECAST, null);
    showToast('Cache cleared successfully.', 'success');
  });

  // Clear all data
  document.getElementById('clear-all').addEventListener('click', () => {
    if (confirm('This will reset ALL Weather AI data including API keys, checklist progress, and cached responses. Continue?')) {
      clearAll();
      setTheme('dark');
      showToast('All data has been reset.', 'success');
      window.location.hash = '#dashboard';
    }
  });
}

// ─── Start App ──────────────────────────────────────────────────────

initApp();
