/**
 * MonsoonGuard — Vercel Serverless API Proxy for Gemini
 * 
 * This function securely proxies requests to the Gemini API.
 * The API key is stored as a Vercel environment variable (GEMINI_API_KEY),
 * so it is NEVER exposed to the client/browser.
 * 
 * Usage: Frontend calls POST /api/gemini with { prompt, history }
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

const SYSTEM_PROMPT = `You are MonsoonGuard AI, an expert monsoon preparedness and safety assistant. You provide:
- Personalized monsoon preparedness plans based on location, family size, and housing type
- Weather-aware safety guidance with actionable recommendations
- Emergency checklists for different scenarios (flooding, storms, power outages)
- Travel advisories considering monsoon conditions
- First aid and emergency response guidance
- Multilingual support for Indian languages

Guidelines:
- Always prioritize safety and provide actionable advice
- Include specific steps people can take, not generic advice
- Consider the Indian monsoon context (June–September)
- Mention emergency numbers when relevant (NDRF: 011-24363260, Police: 100, Ambulance: 108)
- Be empathetic and reassuring while being practical
- If asked about current weather, remind users to check the Weather Dashboard for real-time data
- Format responses with clear headings, bullet points, and numbered steps when appropriate
- Keep responses concise but comprehensive`;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'not_configured',
      message: 'Gemini API key is not configured on the server. Use the Settings page to enter your own key.',
    });
  }

  try {
    const { prompt, history = [] } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "prompt" field' });
    }

    // Sanitize prompt length
    if (prompt.length > 5000) {
      return res.status(400).json({ error: 'Prompt too long. Maximum 5000 characters.' });
    }

    // Build conversation contents
    const contents = [];

    // Add last 10 history messages for context
    const recentHistory = Array.isArray(history) ? history.slice(-10) : [];
    for (const msg of recentHistory) {
      if (msg && msg.role && msg.text) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: String(msg.text).slice(0, 2000) }],
        });
      }
    }

    // Add current prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    const url = `${GEMINI_API_BASE}/${DEFAULT_MODEL}:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ],
      }),
    });

    if (!geminiResponse.ok) {
      const errData = await geminiResponse.json().catch(() => ({}));
      console.error('Gemini API error:', errData);
      return res.status(geminiResponse.status).json({
        error: 'gemini_error',
        message: errData?.error?.message || `Gemini API returned ${geminiResponse.status}`,
      });
    }

    const data = await geminiResponse.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(502).json({ error: 'Empty response from Gemini API' });
    }

    return res.status(200).json({ text, source: 'gemini' });
  } catch (error) {
    console.error('Gemini proxy error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
