// ============================================
// HawkSight — Express Proxy Server
// Keeps API keys server-side, serves static frontend
// ============================================

require('dotenv').config();
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const session = require('express-session');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json({ limit: '1mb' }));
app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Serve all static frontend files from the project root
app.use(express.static(path.join(__dirname)));

// --- Database Setup ---
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error('DB connection error:', err.message);
  else console.log('Connected to SQLite database.');
});

db.serialize(async () => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS assignments (
    user_id INTEGER NOT NULL,
    framework_id TEXT NOT NULL,
    PRIMARY KEY (user_id, framework_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS user_answers (
    user_id INTEGER NOT NULL,
    framework_id TEXT NOT NULL,
    answers_json TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, framework_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Create default admin
  const defaultAdminEmail = 'admin@admin.com';
  const defaultAdminPass = 'admin';
  const hashedPass = await bcrypt.hash(defaultAdminPass, 10);
  
  db.get("SELECT id FROM users WHERE email = ?", [defaultAdminEmail], (err, row) => {
    if (!row) {
      db.run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [defaultAdminEmail, hashedPass, 'admin']);
      console.log('Created default admin: admin@admin.com / admin');
    }
  });
});

// --- Auth Routes ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.userId = user.id;
    req.session.role = user.role;
    res.json({ message: 'Logged in successfully', role: user.role });
  });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });

  db.get("SELECT id, email, role FROM users WHERE id = ?", [req.session.userId], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'User not found' });
    
    if (user.role === 'admin') {
      return res.json({ user, assignments: [] }); // Admin has access to all implicitly
    }

    db.all("SELECT framework_id FROM assignments WHERE user_id = ?", [user.id], (err, rows) => {
      const assignments = rows ? rows.map(r => r.framework_id) : [];
      res.json({ user, assignments });
    });
  });
});

// --- Admin Routes ---
const requireAdmin = (req, res, next) => {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

app.get('/api/admin/users', requireAdmin, (req, res) => {
  db.all("SELECT id, email, role FROM users", (err, users) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    
    db.all("SELECT * FROM assignments", (err, assignments) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      
      db.all("SELECT user_id, framework_id, updated_at FROM user_answers", (err, answers) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        const usersWithAssigments = users.map(u => {
          u.assignments = assignments.filter(a => a.user_id === u.id).map(a => {
            const hasAnswer = answers.find(ans => ans.user_id === u.id && ans.framework_id === a.framework_id);
            return {
              id: a.framework_id,
              hasReport: !!hasAnswer,
              updatedAt: hasAnswer ? hasAnswer.updated_at : null
            };
          });
          return u;
        });
        res.json(usersWithAssigments);
      });
    });
  });
});

app.post('/api/admin/users', requireAdmin, async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  const userRole = role === 'admin' ? 'admin' : 'user';
  const hashedPass = await bcrypt.hash(password, 10);

  db.run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [email, hashedPass, userRole], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ id: this.lastID, email, role: userRole });
  });
});

app.post('/api/admin/assignments', requireAdmin, (req, res) => {
  const { userId, frameworkId } = req.body;
  if (!userId || !frameworkId) return res.status(400).json({ error: 'Missing parameters' });

  db.run("INSERT OR IGNORE INTO assignments (user_id, framework_id) VALUES (?, ?)", [userId, frameworkId], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Assignment added' });
  });
});

app.delete('/api/admin/assignments', requireAdmin, (req, res) => {
  const { userId, frameworkId } = req.body;
  if (!userId || !frameworkId) return res.status(400).json({ error: 'Missing parameters' });

  db.run("DELETE FROM assignments WHERE user_id = ? AND framework_id = ?", [userId, frameworkId], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Assignment removed' });
  });
});

app.post('/api/assessments/save', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  const { frameworkId, answers } = req.body;
  if (!frameworkId || !answers) return res.status(400).json({ error: 'Missing parameters' });
  
  db.run("INSERT OR REPLACE INTO user_answers (user_id, framework_id, answers_json, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)", 
    [req.session.userId, frameworkId, JSON.stringify(answers)], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Saved successfully' });
  });
});

app.get('/api/admin/reports/:userId/:frameworkId', requireAdmin, (req, res) => {
  const { userId, frameworkId } = req.params;
  db.get("SELECT answers_json, updated_at FROM user_answers WHERE user_id = ? AND framework_id = ?", [userId, frameworkId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Report not found' });
    res.json({ answers: JSON.parse(row.answers_json), updatedAt: row.updated_at });
  });
});

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
