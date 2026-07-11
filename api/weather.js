/**
 * MonsoonGuard — Vercel Serverless API Proxy for OpenWeatherMap
 * 
 * This function securely proxies weather API requests.
 * The API key is stored as a Vercel environment variable (WEATHER_API_KEY),
 * so it is NEVER exposed to the client/browser.
 * 
 * Usage:
 *   GET /api/weather?type=current&lat=19.07&lon=72.87
 *   GET /api/weather?type=forecast&lat=19.07&lon=72.87
 */

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'not_configured',
      message: 'Weather API key is not configured on the server. Use the Settings page to enter your own key.',
    });
  }

  try {
    const { type = 'current', lat, lon } = req.query;

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid or missing lat/lon parameters' });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ error: 'Coordinates out of valid range' });
    }

    // Build OWM URL based on type
    let endpoint;
    if (type === 'forecast') {
      endpoint = `${OWM_BASE}/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    } else {
      endpoint = `${OWM_BASE}/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    }

    const owmResponse = await fetch(endpoint);

    if (!owmResponse.ok) {
      const errData = await owmResponse.json().catch(() => ({}));
      console.error('OWM API error:', errData);
      return res.status(owmResponse.status).json({
        error: 'weather_error',
        message: errData?.message || `Weather API returned ${owmResponse.status}`,
      });
    }

    const data = await owmResponse.json();

    // Set cache headers — weather data can be cached for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Weather proxy error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
