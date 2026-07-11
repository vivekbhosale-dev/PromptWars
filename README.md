# MonsoonGuard 🛡️🌧️

**AI-powered monsoon preparedness and citizen assistance platform.**

Built for the PromptWars × Google for Developers "Build with AI" challenge.

---

## Features

- **🤖 AI Assistant** — Powered by Google Gemini for personalized monsoon safety guidance
- **🌦️ Live Weather Dashboard** — Real-time weather data with monsoon risk assessment
- **✅ Emergency Checklists** — Expert-curated (NDMA/Red Cross) with progress tracking
- **🆘 Emergency Contacts** — Quick-access Indian emergency numbers
- **🌙 Dark/Light Mode** — Beautiful themed UI with system preference detection
- **📱 Offline PWA** — Works without internet using built-in knowledge base
- **🔄 API Fallback** — Graceful degradation: server proxy → user key → offline knowledge

---

## Quick Start (For Testing)

### Option 1: Open directly
Just open `index.html` in a browser. ES module imports require a local server for full functionality.

### Option 2: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

### Option 3: Any HTTP server
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

---

## Deploy to Vercel (Production)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/monsoonguard.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/log in
2. Click **"Add New → Project"**
3. Import your GitHub repository
4. Vercel will auto-detect the Vite framework

### Step 3: Add API Keys (Environment Variables)
1. In your Vercel project, go to **Settings → Environment Variables**
2. Add these two variables:
   - `GEMINI_API_KEY` = your Google Gemini API key
   - `WEATHER_API_KEY` = your OpenWeatherMap API key
3. Click **"Redeploy"** to apply

Now your app is live and **end users don't need to enter any API keys** — the serverless functions (`/api/gemini` and `/api/weather`) handle everything securely on the server side.

---

## How API Key Resolution Works

The app uses a **three-tier fallback** system:

| Priority | Source | When |
|----------|--------|------|
| 1st | Vercel serverless proxy | When deployed with env vars (production) |
| 2nd | User-entered key (Settings page) | For local testing |
| 3rd | Offline knowledge base | Always available as fallback |

---

## Get Free API Keys

- **Gemini**: [Google AI Studio](https://aistudio.google.com/apikey) — instant, free
- **OpenWeatherMap**: [OpenWeatherMap](https://home.openweathermap.org/api_keys) — free tier (1000 calls/day, new keys take ~2 hours to activate)

---

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES Modules), HTML5, CSS3
- **AI**: Google Gemini 2.0 Flash (REST API)
- **Weather**: OpenWeatherMap API
- **Hosting**: Vercel (with serverless functions)
- **Offline**: Service Worker + curated knowledge base
- **Build**: Vite (optional, for production optimization)

---

## Project Structure

```
monsoonguard/
├── api/                    # Vercel serverless functions
│   ├── gemini.js          # Gemini API proxy (secure)
│   └── weather.js         # Weather API proxy (secure)
├── public/
│   ├── icons/             # PWA icons
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
├── src/
│   ├── main.js            # App entry, router, all pages
│   ├── services/
│   │   ├── gemini.js      # Gemini client with fallback chain
│   │   ├── weather.js     # Weather client with fallback chain
│   │   ├── offline-knowledge.js  # Curated monsoon knowledge base
│   │   └── storage.js     # localStorage wrapper
│   └── styles/
│       ├── index.css      # Design system & themes
│       └── components.css # Component styles
├── index.html             # Root HTML
├── vercel.json            # Vercel deployment config
├── vite.config.js         # Vite build config
└── package.json           # Dependencies
```