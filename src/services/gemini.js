/**
 * MonsoonGuard — Gemini API Service
 * 
 * Resolution order:
 * 1. Vercel serverless proxy (/api/gemini) — keys on server, user sees nothing
 * 2. User-entered key from Settings (localStorage) — for manual testing
 * 3. Offline knowledge base fallback — always works
 */

import { getItem, StorageKeys, cacheAIResponse, getCachedAIResponse, hashString } from './storage.js';
import { getOfflineResponse } from './offline-knowledge.js';
import { CONFIG } from '../config.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

const SYSTEM_PROMPT = `You are Weather AI, an expert weather preparedness and safety assistant. You provide:
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

/**
 * Check if Gemini is available (either via proxy, user key, or config)
 * @returns {boolean}
 */
export function isGeminiConfigured() {
  const key = getItem(StorageKeys.GEMINI_KEY) || CONFIG.GEMINI_KEY;
  return Boolean(key && key.trim().length > 0);
}

/**
 * Send a prompt and get AI response.
 * Tries: server proxy → user key/config → offline fallback
 * 
 * @param {string} prompt - User's prompt
 * @param {Array<{role: string, text: string}>} [history=[]] - Conversation history
 * @returns {Promise<{text: string, source: 'gemini' | 'cache' | 'offline'}>}
 */
export async function generateResponse(prompt, history = []) {
  // 1. Check cache first
  const cacheKey = hashString(prompt);
  const cached = getCachedAIResponse(cacheKey);
  if (cached) {
    return { text: cached, source: 'cache' };
  }

  // 2. Try Vercel serverless proxy first (keys stored on server)
  try {
    const proxyResult = await callServerProxy(prompt, history);
    if (proxyResult) {
      cacheAIResponse(cacheKey, proxyResult);
      return { text: proxyResult, source: 'gemini' };
    }
  } catch (error) {
    // not_configured means proxy exists but has no key — fall through
    if (error.message !== 'not_configured') {
      console.warn('[Gemini] Server proxy failed:', error.message);
    }
  }

  // 3. Try user-entered API key or config fallback
  const userKey = getItem(StorageKeys.GEMINI_KEY) || CONFIG.GEMINI_KEY;
  if (userKey) {
    try {
      const response = await callGeminiDirect(userKey, prompt, history);
      cacheAIResponse(cacheKey, response);
      return { text: response, source: 'gemini' };
    } catch (error) {
      console.warn('[Gemini] Direct API call failed:', error.message);
    }
  }

  // 4. Offline fallback — always works
  const offlineResponse = getOfflineResponse(prompt);
  return { text: offlineResponse, source: 'offline' };
}

/**
 * Call the Vercel serverless proxy at /api/gemini
 * @param {string} prompt
 * @param {Array} history
 * @returns {Promise<string|null>}
 */
async function callServerProxy(prompt, history) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history: history.slice(-10) }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 503) {
      const data = await response.json();
      if (data.error === 'not_configured') {
        throw new Error('not_configured');
      }
    }

    if (!response.ok) {
      throw new Error(`Proxy returned ${response.status}`);
    }

    const data = await response.json();
    return data.text || null;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}

/**
 * Call Gemini API directly using user-provided key
 * @param {string} apiKey
 * @param {string} prompt
 * @param {Array} history
 * @returns {Promise<string>}
 */
async function callGeminiDirect(apiKey, prompt, history) {
  const url = `${GEMINI_API_BASE}/${DEFAULT_MODEL}:generateContent?key=${apiKey}`;

  const contents = [];
  for (const msg of history.slice(-10)) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    });
  }
  contents.push({ role: 'user', parts: [{ text: prompt }] });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, {
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
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini API');
    return text;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw error;
  }
}

/**
 * Generate a personalized preparedness plan
 */
export async function generatePreparednessPlan(params) {
  const prompt = `Create a detailed, personalized monsoon preparedness plan with the following details:
- Location: ${params.location || 'India (general)'}
- Family size: ${params.familySize || 'Not specified'}
- Housing type: ${params.housingType || 'Not specified'}
- Elderly members: ${params.hasElderly ? 'Yes' : 'No'}
- Children: ${params.hasChildren ? 'Yes' : 'No'}
- Pets: ${params.hasPets ? 'Yes' : 'No'}

Please include:
1. Pre-monsoon preparation checklist
2. Essential supplies to stock
3. Home waterproofing steps specific to their housing type
4. Emergency evacuation plan
5. Communication plan for the family
6. Special considerations for elderly/children/pets if applicable
7. Important emergency contacts and resources`;

  return generateResponse(prompt);
}

/**
 * Get AI-powered travel advisory
 */
export async function getTravelAdvisory(origin, destination, travelMode) {
  const prompt = `Provide a monsoon travel advisory for:
- From: ${origin}
- To: ${destination}
- Mode of travel: ${travelMode}

Include:
1. Route safety assessment during monsoon
2. Weather-related risks on this route
3. Essential items to carry
4. Alternative routes if main route is affected
5. Emergency contacts for the route
6. Tips for safe travel during heavy rain
7. What to do if stranded`;

  return generateResponse(prompt);
}

/**
 * Generate a custom emergency checklist
 */
export async function generateChecklist(scenario) {
  const prompt = `Create a detailed emergency checklist for the following monsoon scenario: ${scenario}

Format each item as a clear, actionable task. Group items by priority:
- IMMEDIATE (do right now)
- SHORT-TERM (within 24 hours)  
- ONGOING (throughout monsoon season)

Include specific quantities and product names where possible.`;

  return generateResponse(prompt);
}

/**
 * Validate if a Gemini API key works
 * @param {string} apiKey 
 * @returns {Promise<boolean>}
 */
export async function validateGeminiKey(apiKey) {
  try {
    const url = `${GEMINI_API_BASE}/${DEFAULT_MODEL}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hello' }] }],
        generationConfig: { maxOutputTokens: 10 },
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
