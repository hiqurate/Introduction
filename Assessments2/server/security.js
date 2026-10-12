// ============================================
// HawkSight — Security middleware and access control
// ============================================

const crypto = require('crypto');
const session = require('express-session');

const ROLES = {
  PLATFORM_ADMIN: 'platform_admin',
  ASSESSOR: 'assessor',
  CUSTOMER_ADMIN: 'customer_admin',
  CONTRIBUTOR: 'contributor',
  READ_ONLY: 'read_only'
};

const ROLE_LABELS = {
  platform_admin: 'Platform Administrator',
  assessor: 'Assessor',
  customer_admin: 'Customer Administrator',
  contributor: 'Contributor',
  read_only: 'Read Only'
};

const STAFF_ROLES = [ROLES.PLATFORM_ADMIN, ROLES.ASSESSOR];
const CUSTOMER_ROLES = [ROLES.CUSTOMER_ADMIN, ROLES.CONTRIBUTOR, ROLES.READ_ONLY];

// Capability matrix. Tenant ownership is checked separately for every request.
const CAPABILITIES = {
  'tenants:manage': [ROLES.PLATFORM_ADMIN],
  'config:manage': [ROLES.PLATFORM_ADMIN],
  'audit:view': [ROLES.PLATFORM_ADMIN],
  'analytics:view': [ROLES.PLATFORM_ADMIN],
  'users:manage': [ROLES.PLATFORM_ADMIN, ROLES.CUSTOMER_ADMIN],
  'profile:edit': [ROLES.PLATFORM_ADMIN, ROLES.ASSESSOR, ROLES.CUSTOMER_ADMIN],
  'assessment:create': [ROLES.PLATFORM_ADMIN, ROLES.ASSESSOR, ROLES.CUSTOMER_ADMIN],
  'assessment:answer': [ROLES.PLATFORM_ADMIN, ROLES.ASSESSOR, ROLES.CUSTOMER_ADMIN, ROLES.CONTRIBUTOR],
  'assessment:assign': [ROLES.PLATFORM_ADMIN, ROLES.ASSESSOR, ROLES.CUSTOMER_ADMIN],
  'assessment:submit': [ROLES.PLATFORM_ADMIN, ROLES.ASSESSOR, ROLES.CUSTOMER_ADMIN],
  'assessment:review': [ROLES.PLATFORM_ADMIN, ROLES.ASSESSOR],
  'evidence:validate': [ROLES.PLATFORM_ADMIN, ROLES.ASSESSOR],
  'report:issue': [ROLES.PLATFORM_ADMIN, ROLES.ASSESSOR, ROLES.CUSTOMER_ADMIN],
  'actions:update': [ROLES.PLATFORM_ADMIN, ROLES.ASSESSOR, ROLES.CUSTOMER_ADMIN, ROLES.CONTRIBUTOR],
  'risk:accept': [ROLES.PLATFORM_ADMIN, ROLES.CUSTOMER_ADMIN],
  'ai:use': [ROLES.PLATFORM_ADMIN, ROLES.ASSESSOR, ROLES.CUSTOMER_ADMIN, ROLES.CONTRIBUTOR]
};

function can(user, capability) {
  return !!(user && CAPABILITIES[capability] && CAPABILITIES[capability].includes(user.role));
}

class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// ── Security headers ──
function securityHeaders({ production }) {
  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; ');
  return (req, res, next) => {
    res.setHeader('Content-Security-Policy', csp);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    if (production && req.secure) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    if (req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-store');
    }
    next();
  };
}

function enforceHttps({ production, enabled }) {
  return (req, res, next) => {
    if (!production || !enabled) return next();
    if (req.secure) return next();
    if (req.method === 'GET' || req.method === 'HEAD') {
      return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
    }
    return res.status(403).json({ error: 'HTTPS is required' });
  };
}

// ── CSRF defence for state-changing requests ──
// Cookies are SameSite=Strict. In addition, every unsafe request must carry
// the X-Requested-With header set by the HawkSight client and, when the
// browser sends an Origin header, it must match this host.
function csrfGuard({ allowedOrigins = [] }) {
  return (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    if (req.get('X-Requested-With') !== 'HawkSight') {
      return res.status(403).json({ error: 'Request rejected' });
    }
    const origin = req.get('Origin');
    if (origin) {
      const host = `${req.protocol}://${req.get('host')}`;
      if (origin !== host && !allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: 'Cross-origin request rejected' });
      }
    }
    next();
  };
}

// ── Rate limiting (in-memory, fixed window) ──
function rateLimit({ windowMs, max, key = req => req.ip, message = 'Too many requests. Please try again later.' }) {
  const hits = new Map();
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
  }, Math.min(windowMs, 60000));
  if (timer.unref) timer.unref();
  return (req, res, next) => {
    const k = key(req);
    const now = Date.now();
    let entry = hits.get(k);
    if (!entry || entry.reset <= now) {
      entry = { count: 0, reset: now + windowMs };
      hits.set(k, entry);
    }
    entry.count++;
    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    if (entry.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((entry.reset - now) / 1000)));
      return res.status(429).json({ error: message });
    }
    next();
  };
}

// ── SQLite session store ──
class SqliteSessionStore extends session.Store {
  constructor(db, { ttlMs }) {
    super();
    this.db = db;
    this.ttlMs = ttlMs;
    const timer = setInterval(() => {
      this.db.run('DELETE FROM sessions WHERE expires_at < ?', [Date.now()]).catch(() => {});
    }, 15 * 60 * 1000);
    if (timer.unref) timer.unref();
  }

  expiry(sess) {
    if (sess && sess.cookie && sess.cookie.expires) return new Date(sess.cookie.expires).getTime();
    return Date.now() + this.ttlMs;
  }

  get(sid, cb) {
    this.db.get('SELECT data, expires_at FROM sessions WHERE sid = ?', [sid])
      .then(row => {
        if (!row || row.expires_at < Date.now()) return cb(null, null);
        cb(null, JSON.parse(row.data));
      })
      .catch(err => cb(err));
  }

  set(sid, sess, cb) {
    this.db.run('INSERT INTO sessions (sid, data, expires_at) VALUES (?, ?, ?) ON CONFLICT(sid) DO UPDATE SET data = excluded.data, expires_at = excluded.expires_at',
      [sid, JSON.stringify(sess), this.expiry(sess)])
      .then(() => cb && cb(null))
      .catch(err => cb && cb(err));
  }

  destroy(sid, cb) {
    this.db.run('DELETE FROM sessions WHERE sid = ?', [sid])
      .then(() => cb && cb(null))
      .catch(err => cb && cb(err));
  }

  touch(sid, sess, cb) {
    this.db.run('UPDATE sessions SET expires_at = ? WHERE sid = ?', [this.expiry(sess), sid])
      .then(() => cb && cb(null))
      .catch(err => cb && cb(err));
  }
}

// ── Password policy ──
const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', '123456789012', 'qwertyuiop12', 'welcome12345', 'admin1234567',
  'letmein12345', 'iloveyou1234', 'changeme1234', 'hawksight123', 'p@ssw0rd1234'
]);

function validatePassword(password, email) {
  const problems = [];
  const pw = String(password || '');
  if (pw.length < 12) problems.push('at least 12 characters');
  if (pw.length > 128) problems.push('no more than 128 characters');
  const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(pw)).length;
  if (classes < 3) problems.push('at least three of: lower-case, upper-case, number, symbol');
  const local = String(email || '').split('@')[0].toLowerCase();
  if (local.length >= 4 && pw.toLowerCase().includes(local)) problems.push('must not contain your email name');
  if (COMMON_PASSWORDS.has(pw.toLowerCase())) problems.push('must not be a commonly used password');
  return problems;
}

function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url');
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function generateTemporaryPassword() {
  // 20 characters drawn from a set without ambiguous characters, plus a
  // guaranteed symbol and digit so it satisfies the policy.
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let out = '';
  const bytes = crypto.randomBytes(18);
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `${out}#7`;
}

module.exports = {
  ROLES,
  ROLE_LABELS,
  STAFF_ROLES,
  CUSTOMER_ROLES,
  CAPABILITIES,
  can,
  HttpError,
  securityHeaders,
  enforceHttps,
  csrfGuard,
  rateLimit,
  SqliteSessionStore,
  validatePassword,
  randomToken,
  sha256,
  generateTemporaryPassword
};
