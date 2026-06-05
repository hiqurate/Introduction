// ============================================
// HawkSight — AI Configuration (git-safe)
// API keys are stored server-side in .env
// ============================================

const HIQURATES_AI_CONFIG = {
  provider: 'groq',

  // No API keys here — requests are proxied through the server
  groqApiKey: '',
  groqModel: 'llama-3.1-8b-instant',

  // Server proxy endpoints (relative URLs)
  proxyCompleteUrl: '/api/ai/complete',
  proxyStreamUrl: '/api/ai/stream',

  geminiApiKey: '',
  geminiModel: 'gemini-2.0-flash',

  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'llama3'
};
