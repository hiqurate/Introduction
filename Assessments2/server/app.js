// ============================================
// HawkSight — Express application factory
// ============================================

const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const { openDatabase } = require('./db');
const { createServices } = require('./services');
const { EvidenceStore } = require('./evidence-store');
const security = require('./security');
const { bootstrap } = require('./bootstrap');

const ROOT = path.join(__dirname, '..');

// Only these paths are served to browsers. Everything else in the project
// directory (database, server code, question content, documents,
// node_modules) is never exposed; question content is served through the
// authenticated /api/content endpoint.
const PUBLIC_FILES = new Set(['/index.html', '/styles.css', '/app.js', '/favicon.svg']);
const PUBLIC_DIRS = ['/js/', '/assets/'];

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

async function createApp(options = {}) {
  const production = options.production !== undefined ? options.production : process.env.NODE_ENV === 'production';
  const databaseUrl = options.databaseUrl !== undefined ? options.databaseUrl : process.env.DATABASE_URL;
  const sessionSecret = options.sessionSecret || process.env.SESSION_SECRET;
  const evidenceKey = options.evidenceKey || process.env.EVIDENCE_ENCRYPTION_KEY;

  // Check required settings first, so a misconfigured deployment fails with
  // one clear message instead of a crash part-way through start-up.
  if (production) {
    const missing = [];
    if (!sessionSecret || sessionSecret.length < 32) missing.push('SESSION_SECRET (at least 32 characters)');
    if (!evidenceKey) missing.push('EVIDENCE_ENCRYPTION_KEY (32 bytes, base64)');
    if (process.env.VERCEL && !databaseUrl) missing.push('DATABASE_URL (Postgres connection string)');
    if (missing.length) throw new Error(`Missing required settings: ${missing.join('; ')}`);
  }

  // Local files are only used with SQLite. With Postgres, nothing is written
  // to disk, which suits hosts without a persistent file system.
  const storageDir = options.storageDir || process.env.DATA_DIR || path.join(ROOT, 'storage');
  if (!databaseUrl || !evidenceKey) fs.mkdirSync(storageDir, { recursive: true, mode: 0o700 });

  const db = await openDatabase(databaseUrl ? { url: databaseUrl } : (options.dbFile || path.join(storageDir, 'hawksight.sqlite')));
  const services = createServices(db);
  const evidenceStore = new EvidenceStore({
    db: databaseUrl ? db : null,
    directory: path.join(storageDir, 'evidence'),
    key: EvidenceStore.loadKey({
      envKey: evidenceKey,
      keyFile: path.join(storageDir, '.evidence-key'),
      production
    })
  });

  const bootInfo = await db.withLock(() => bootstrap(db, services, {
    adminEmail: options.adminEmail || process.env.ADMIN_EMAIL,
    adminPassword: options.adminPassword || process.env.ADMIN_PASSWORD,
    seedDemo: options.seedDemo !== undefined ? options.seedDemo : process.env.SEED_DEMO !== 'false',
    log: options.log !== false
  }));

  const app = express();
  app.disable('x-powered-by');
  if (production || process.env.TRUST_PROXY) app.set('trust proxy', 1);

  app.use(security.enforceHttps({ production, enabled: process.env.FORCE_HTTPS !== 'false' }));
  app.use(security.securityHeaders({ production }));

  const ttlMs = 12 * 60 * 60 * 1000;
  app.use(session({
    name: 'hs.sid',
    secret: sessionSecret || require('crypto').randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: new security.SqliteSessionStore(db, { ttlMs }),
    cookie: {
      httpOnly: true,
      sameSite: 'strict',
      secure: production,
      maxAge: 30 * 60 * 1000 // idle timeout; absolute lifetime enforced in auth middleware
    }
  }));

  const ctx = { db, services, evidenceStore, security, asyncHandler, production, absoluteSessionMs: ttlMs };

  // Body parsing: small limit by default, larger only for evidence uploads.
  app.use('/api/assessments/:id/evidence', express.json({ limit: '15mb' }));
  app.use('/api/tenants/:id/branding', express.json({ limit: '1mb' }));
  app.use(express.json({ limit: '256kb' }));

  app.use('/api/', security.rateLimit({ windowMs: 60 * 1000, max: 600 }));
  app.use('/api/', security.csrfGuard({ allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean) }));

  // Attach the signed-in user (if any) to every request.
  app.use(asyncHandler(async (req, res, next) => {
    if (req.session && req.session.userId) {
      if (req.session.loginAt && Date.now() - req.session.loginAt > ttlMs) {
        await new Promise(resolve => req.session.destroy(() => resolve()));
        return next();
      }
      const user = await services.loadUser(req.session.userId);
      if (user && user.status === 'active') req.user = user;
    }
    next();
  }));

  // Routes
  require('./routes/public')(app, ctx);
  require('./routes/auth')(app, ctx);
  require('./routes/tenants')(app, ctx);
  require('./routes/users')(app, ctx);
  require('./routes/assessments')(app, ctx);
  require('./routes/evidence')(app, ctx);
  require('./routes/reports')(app, ctx);
  require('./routes/actions')(app, ctx);
  require('./routes/admin')(app, ctx);
  require('./routes/ai')(app, ctx);

  app.use('/api/', (req, res) => res.status(404).json({ error: 'Not found' }));

  // Static assets
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const p = req.path;
    if (PUBLIC_FILES.has(p) || PUBLIC_DIRS.some(d => p.startsWith(d))) {
      return express.static(ROOT, { index: false, dotfiles: 'deny', maxAge: production ? '1h' : 0 })(req, res, next);
    }
    next();
  });

  // Single-page app shell for all other GET requests without a file extension.
  app.get('*', (req, res, next) => {
    if (path.extname(req.path) || req.path.split('/').some(seg => seg.startsWith('.'))) return res.status(404).end();
    res.sendFile(path.join(ROOT, 'index.html'));
  });

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request is too large' });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed request body' });
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ error: status >= 500 ? 'An unexpected error occurred' : err.message, details: err.details });
  });

  app.locals.db = db;
  app.locals.services = services;
  app.locals.bootInfo = bootInfo;
  return app;
}

module.exports = { createApp, asyncHandler };
