// Authentication: sign-in with lockout, sign-out, current user, password
// change and invitation acceptance.

const bcrypt = require('bcrypt');
const { BCRYPT_ROUNDS } = require('../bootstrap');
const { MAX_MB } = require('../evidence-store');

const MAX_FAILED = 5;
const LOCK_MINUTES = 15;
// Constant-time defence: compare against a dummy hash when the user does not exist.
const DUMMY_HASH = bcrypt.hashSync('hawksight-timing-equaliser', BCRYPT_ROUNDS);

function regenerate(req) {
  return new Promise((resolve, reject) => req.session.regenerate(err => (err ? reject(err) : resolve())));
}

module.exports = function authRoutes(app, ctx) {
  const { db, services, security, asyncHandler } = ctx;
  const { HttpError, can, CAPABILITIES, ROLE_LABELS } = security;

  const loginLimiter = security.rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many sign-in attempts. Please wait and try again.' });

  function requireAuth(req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Please sign in to continue' });
    if (req.user.must_change_password && !req.path.startsWith('/api/auth/')) {
      return res.status(403).json({ error: 'Password change required', code: 'PASSWORD_CHANGE_REQUIRED' });
    }
    next();
  }
  ctx.requireAuth = requireAuth;

  function capabilitiesFor(user) {
    return Object.keys(CAPABILITIES).filter(c => can(user, c));
  }

  async function sessionPayload(user) {
    const tenant = user.tenant_id ? await db.get('SELECT id, name, industry, package, is_demo, reassessment_frequency FROM tenants WHERE id = ?', [user.tenant_id]) : null;
    return {
      limits: { evidenceMb: MAX_MB },
      user: { id: user.id, email: user.email, name: user.name, role: user.role, roleLabel: ROLE_LABELS[user.role], tenantId: user.tenant_id, mustChangePassword: !!user.must_change_password },
      tenant,
      capabilities: capabilitiesFor(user)
    };
  }

  app.post('/api/auth/login', loginLimiter, asyncHandler(async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) throw new HttpError(400, 'Email and password are required');

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      await bcrypt.compare(password, DUMMY_HASH);
      await services.audit(req, 'LOGIN_FAILED', { details: { email, reason: 'unknown account' } });
      throw new HttpError(401, 'Email or password is incorrect');
    }
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      await services.audit(req, 'LOGIN_BLOCKED', { tenantId: user.tenant_id, details: { email, reason: 'account locked' } });
      throw new HttpError(423, 'This account is temporarily locked after repeated failed sign-in attempts. Try again later or ask an administrator to reset it.');
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok || user.status !== 'active') {
      const failed = user.failed_attempts + 1;
      const lock = failed >= MAX_FAILED ? new Date(Date.now() + LOCK_MINUTES * 60000).toISOString() : null;
      await db.run('UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?', [lock ? 0 : failed, lock, user.id]);
      await services.audit(req, lock ? 'ACCOUNT_LOCKED' : 'LOGIN_FAILED', { tenantId: user.tenant_id, details: { email, reason: user.status !== 'active' ? 'account disabled' : 'bad password' } });
      throw new HttpError(401, 'Email or password is incorrect');
    }

    await regenerate(req);
    req.session.userId = user.id;
    req.session.loginAt = Date.now();
    await db.run('UPDATE users SET failed_attempts = 0, locked_until = NULL, last_login_at = ? WHERE id = ?', [new Date().toISOString(), user.id]);
    req.user = user;
    await services.audit(req, 'LOGIN_SUCCESS', { tenantId: user.tenant_id });
    await services.event(req, 'login', { tenantId: user.tenant_id });
    res.json(await sessionPayload(user));
  }));

  app.post('/api/auth/logout', asyncHandler(async (req, res) => {
    if (req.user) await services.audit(req, 'LOGOUT');
    await new Promise(resolve => (req.session ? req.session.destroy(() => resolve()) : resolve()));
    res.clearCookie('hs.sid');
    res.json({ ok: true });
  }));

  app.get('/api/auth/me', asyncHandler(async (req, res) => {
    // Visitors get a plain "not signed in" answer rather than an error.
    if (!req.user) return res.json({ authenticated: false });
    res.json({ authenticated: true, ...(await sessionPayload(req.user)) });
  }));

  app.post('/api/auth/change-password', asyncHandler(async (req, res) => {
    if (!req.user) throw new HttpError(401, 'Please sign in to continue');
    const { currentPassword, newPassword } = req.body;
    const row = await db.get('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    if (!(await bcrypt.compare(String(currentPassword || ''), row.password_hash))) throw new HttpError(400, 'Current password is incorrect');
    const problems = security.validatePassword(newPassword, req.user.email);
    if (problems.length) throw new HttpError(400, `Password must have ${problems.join('; ')}`);
    if (await bcrypt.compare(String(newPassword), row.password_hash)) throw new HttpError(400, 'New password must be different from the current password');
    const hash = await bcrypt.hash(String(newPassword), BCRYPT_ROUNDS);
    await db.run('UPDATE users SET password_hash = ?, must_change_password = 0, password_changed_at = ? WHERE id = ?', [hash, new Date().toISOString(), req.user.id]);
    // Invalidate other sessions for this user.
    await services.destroySessionsForUser(req.user.id, req.sessionID);
    await services.audit(req, 'PASSWORD_CHANGED');
    const user = await services.loadUser(req.user.id);
    res.json(await sessionPayload(user));
  }));

  // ── Invitations ──
  app.get('/api/invites/:token', asyncHandler(async (req, res) => {
    const invite = await db.get(`SELECT i.email, i.role, i.expires_at, i.accepted_at, i.revoked_at, t.name AS tenant_name
      FROM invites i JOIN tenants t ON t.id = i.tenant_id WHERE i.token_hash = ?`, [security.sha256(req.params.token)]);
    if (!invite || invite.accepted_at || invite.revoked_at || new Date(invite.expires_at) < new Date()) {
      throw new HttpError(404, 'This invitation is invalid or has expired');
    }
    res.json({ email: invite.email, role: invite.role, roleLabel: ROLE_LABELS[invite.role], organisation: invite.tenant_name });
  }));

  app.post('/api/invites/accept', loginLimiter, asyncHandler(async (req, res) => {
    const { token, name, password } = req.body;
    const invite = await db.get('SELECT * FROM invites WHERE token_hash = ?', [security.sha256(String(token || ''))]);
    if (!invite || invite.accepted_at || invite.revoked_at || new Date(invite.expires_at) < new Date()) {
      throw new HttpError(404, 'This invitation is invalid or has expired');
    }
    if (!String(name || '').trim()) throw new HttpError(400, 'Please enter your name');
    const problems = security.validatePassword(password, invite.email);
    if (problems.length) throw new HttpError(400, `Password must have ${problems.join('; ')}`);
    const exists = await db.get('SELECT id FROM users WHERE email = ?', [invite.email]);
    if (exists) throw new HttpError(409, 'An account with this email already exists. Please sign in.');

    const hash = await bcrypt.hash(String(password), BCRYPT_ROUNDS);
    const userId = await db.transaction(async tx => {
      const r = await tx.run('INSERT INTO users (tenant_id, email, name, password_hash, role, created_by, password_changed_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [invite.tenant_id, invite.email, String(name).trim().slice(0, 120), hash, invite.role, invite.created_by, new Date().toISOString()]);
      await tx.run('UPDATE invites SET accepted_at = ? WHERE id = ?', [new Date().toISOString(), invite.id]);
      const sections = JSON.parse(invite.sections_json || '[]');
      if (invite.assessment_id && sections.length) {
        for (const moduleId of sections) {
          await tx.run(`INSERT INTO assessment_sections (assessment_id, module_id, owner_user_id, updated_at) VALUES (?, ?, ?, ?)
            ON CONFLICT(assessment_id, module_id) DO UPDATE SET owner_user_id = excluded.owner_user_id, updated_at = excluded.updated_at`,
          [invite.assessment_id, moduleId, r.lastID, new Date().toISOString()]);
        }
      }
      return r.lastID;
    });

    await regenerate(req);
    req.session.userId = userId;
    req.session.loginAt = Date.now();
    const user = await services.loadUser(userId);
    req.user = user;
    await services.audit(req, 'INVITE_ACCEPTED', { tenantId: invite.tenant_id, target: `user:${userId}` });
    res.json(await sessionPayload(user));
  }));
};
