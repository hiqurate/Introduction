// ============================================
// HawkSight — Express Proxy Server
// Keeps API keys server-side, serves static frontend
// ============================================

require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json({ limit: '1mb' }));

// Serve all static frontend files from the project root
app.use(express.static(path.join(__dirname)));

// --- AI Proxy: Non-streaming completion ---
app.post('/api/ai/complete', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'GROQ_API_KEY not configured on server.' } });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: req.body.model || 'llama-3.1-8b-instant',
        messages: req.body.messages || [],
        temperature: req.body.temperature ?? 0.4,
        max_tokens: req.body.max_tokens ?? 4096
      })
    });

    if (!groqRes.ok) {
      const err = await groqRes.json().catch(() => ({}));
      return res.status(groqRes.status).json(err);
    }

    const data = await groqRes.json();
    res.json(data);
  } catch (err) {
    console.error('Proxy /api/ai/complete error:', err.message);
    res.status(502).json({ error: { message: 'Failed to reach AI provider.' } });
  }
});

// --- AI Proxy: Streaming completion ---
app.post('/api/ai/stream', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'GROQ_API_KEY not configured on server.' } });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: req.body.model || 'llama-3.1-8b-instant',
        messages: req.body.messages || [],
        stream: true,
        temperature: req.body.temperature ?? 0.7,
        max_tokens: req.body.max_tokens ?? 2048,
        top_p: req.body.top_p ?? 0.9
      })
    });

    if (!groqRes.ok) {
      const err = await groqRes.json().catch(() => ({}));
      return res.status(groqRes.status).json(err);
    }

    // Stream the SSE response back to the browser
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = groqRes.body.getReader();
    const decoder = new TextDecoder('utf-8');

    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          return;
        }
        res.write(decoder.decode(value, { stream: true }));
      }
    };

    pump().catch(err => {
      console.error('Stream pump error:', err.message);
      res.end();
    });

    req.on('close', () => {
      reader.cancel().catch(() => {});
    });

  } catch (err) {
    console.error('Proxy /api/ai/stream error:', err.message);
    res.status(502).json({ error: { message: 'Failed to reach AI provider.' } });
  }
});

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: !!process.env.GROQ_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// --- SPA fallback: serve index.html for any unknown route ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`\n🦅 HawkSight server running at http://localhost:${PORT}`);
  console.log(`   AI proxy: ${process.env.GROQ_API_KEY ? '✅ GROQ_API_KEY loaded' : '⚠️  GROQ_API_KEY not set (add to .env)'}\n`);
});
