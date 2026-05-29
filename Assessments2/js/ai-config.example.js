// Copy to ai-config.js and fill in Hiqurates credentials.
// ai-config.js is loaded by the app; end users never enter keys in the UI.

const HIQURATES_AI_CONFIG = {
  provider: 'groq',

  groqApiKey: '',
  groqModel: 'llama-3.1-8b-instant',

  geminiApiKey: '',
  geminiModel: 'gemini-2.0-flash',

  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'llama3'
};
