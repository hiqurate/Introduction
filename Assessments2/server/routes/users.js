// User administration and collaborator invitations.

const bcrypt = require('bcrypt');
const { BCRYPT_ROUNDS } = require('../bootstrap');

module.exports = function userRoutes(app, ctx) {
  const { db, services, security, asyncHandler } = ctx;
  const { HttpError, ROLES, ROLE_LABELS, STAFF_ROLES, CUSTOMER_ROLES } = security;
  const auth = ctx.requireAuth;

  function present(u) {
    return {
      id: u.id, tenantId: u.tenant_id, email: u.email, name: u.name, role: u.role, roleLabel: ROLE_LABELS[u.role],
      status: u.status, lastLoginAt: u.last_login_at, createdAt: u.created_at,
      locked: !!(u.locked_until && new Date(u.locked_until) > new Date())
    };
  }

  // Which roles may the current user assign, and in which tenant?
  function assignableRoles(actor) {
    if (actor.role === ROLES.PLATFORM_ADMIN) return [...STAFF_ROLES, ...CUSTOMER_ROLES];
    if (actor.role === ROLES.CUSTOMER_ADMIN) return CUSTOMER_ROLES;
    return [];
  }

  async function loadManageableUser(actor, userId) {
    const u = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!u) throw new HttpError(404, 'User not found');
    if (actor.role === ROLES.PLATFORM_ADMIN) return u;
    if (actor.role === ROLES.CUSTOMER_ADMIN && u.tenant_id === actor.tenant_id && CUSTOMER_ROLES.includes(u.role)) return u;
    throw new HttpError(404, 'User not found');
  }

  app.get('/api/users', auth, asyncHandler(async (req, res) => {
    let rows;
    if (req.user.role === ROLES.PLATFORM_ADMIN) {
      if (req.query.tenantId === 'staff') rows = await db.all('SELECT * FROM users WHERE tenant_id IS NULL ORDER BY role, email');
      else if (req.query.tenantId) rows = await db.all('SELECT * FROM users WHERE tenant_id = ? ORDER BY role, email', [req.query.tenantId]);
      else rows = await db.all('SELECT * FROM users ORDER BY tenant_id, role, email');
    } else if (req.user.role === ROLES.ASSESSOR && req.query.tenantId) {
      await services.requireTenant(req.user, req.query.tenantId);
      rows = await db.all('SELECT * FROM users WHERE tenant_id = ? ORDER BY role, email', [req.query.tenantId]);
    } else if (req.user.tenant_id) {
      rows = await db.all('SELECT * FROM users WHERE tenant_id = ? ORDER BY role, email', [req.user.tenant_id]);
    } else {
      rows = [];
    }
    res.json({ users: rows.map(present), assignableRoles: assignableRoles(req.user).map(r => ({ id: r, label: ROLE_LABELS[r] })) });
  }));

  app.post('/api/users', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'users:manage');
    const email = String(req.body.email || '').trim().toLowerCase();
    const name = String(req.body.name || '').trim().slice(0, 120);
    const role = req.body.role;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Enter a valid email address');
    if (!assignableRoles(req.user).includes(role)) throw new HttpError(400, 'You cannot assign this role');
    let tenantId = null;
    if (CUSTOMER_ROLES.includes(role)) {
      tenantId = req.user.role === ROLES.PLATFORM_ADMIN ? Number(req.body.tenantId) : req.user.tenant_id;
      await services.requireTenant(req.user, tenantId);
    }
    if (await db.get('SELECT id FROM users WHERE email = ?', [email])) throw new HttpError(409, 'A user with this email already exists');
    const temporaryPassword = security.generateTemporaryPassword();
    const hash = await bcrypt.hash(temporaryPassword, BCRYPT_ROUNDS);
    const r = await db.run('INSERT INTO users (tenant_id, email, name, password_hash, role, must_change_password, created_by) VALUES (?, ?, ?, ?, ?, 1, ?)',
      [tenantId, email, name, hash, role, req.user.id]);
    await services.audit(req, 'USER_CREATED', { tenantId, target: `user:${r.lastID}`, details: { email, role } });
    const user = await db.get('SELECT * FROM users WHERE id = ?', [r.lastID]);
    // The temporary password is returned once so the administrator can share it securely.
    res.status(201).json({ user: present(user), temporaryPassword });
  }));

  app.patch('/api/users/:id', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'users:manage');
    const target = await loadManageableUser(req.user, req.params.id);
    const changes = {};
    if (req.body.name !== undefined) changes.name = String(req.body.name).trim().slice(0, 120);
    if (req.body.role !== undefined && req.body.role !== target.role) {
      if (target.id === req.user.id) throw new HttpError(400, 'You cannot change your own role');
      if (!assignableRoles(req.user).includes(req.body.role)) throw new HttpError(400, 'You cannot assign this role');
      const targetIsStaff = STAFF_ROLES.includes(target.role);
      const newIsStaff = STAFF_ROLES.includes(req.body.role);
      if (targetIsStaff !== newIsStaff) throw new HttpError(400, 'Staff and customer roles cannot be swapped; create a new account instead');
      changes.role = req.body.role;
    }
    if (req.body.status !== undefined) {
      if (!['active', 'disabled'].includes(req.body.status)) throw new HttpError(400, 'Invalid status');
      if (target.id === req.user.id) throw new HttpError(400, 'You cannot disable your own account');
      changes.status = req.body.status;
    }
    if (req.body.unlock) { changes.locked_until = null; changes.failed_attempts = 0; }
    const keys = Object.keys(changes);
    if (keys.length) await db.run(`UPDATE users SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`, [...keys.map(k => changes[k]), target.id]);
    if (changes.status === 'disabled' || changes.role) {
      await services.destroySessionsForUser(target.id);
    }
    await services.audit(req, changes.role ? 'USER_ROLE_CHANGED' : 'USER_UPDATED', {
      tenantId: target.tenant_id, target: `user:${target.id}`, details: { email: target.email, from: target.role, ...changes }
    });
    res.json({ user: present(await db.get('SELECT * FROM users WHERE id = ?', [target.id])) });
  }));

  app.post('/api/users/:id/reset-password', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'users:manage');
    const target = await loadManageableUser(req.user, req.params.id);
    if (target.id === req.user.id) throw new HttpError(400, 'Use Change password to update your own password');
    const temporaryPassword = security.generateTemporaryPassword();
    const hash = await bcrypt.hash(temporaryPassword, BCRYPT_ROUNDS);
    await db.run('UPDATE users SET password_hash = ?, must_change_password = 1, failed_attempts = 0, locked_until = NULL WHERE id = ?', [hash, target.id]);
    await services.destroySessionsForUser(target.id);
    await services.audit(req, 'PASSWORD_RESET', { tenantId: target.tenant_id, target: `user:${target.id}`, details: { email: target.email } });
    res.json({ temporaryPassword });
  }));

  app.delete('/api/users/:id', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'users:manage');
    const target = await loadManageableUser(req.user, req.params.id);
    if (target.id === req.user.id) throw new HttpError(400, 'You cannot delete your own account');
    if (target.role === ROLES.PLATFORM_ADMIN) {
      const n = await db.get("SELECT COUNT(*) AS n FROM users WHERE role = 'platform_admin' AND status = 'active'");
      if (n.n <= 1) throw new HttpError(400, 'At least one platform administrator must remain');
    }
    await db.run('DELETE FROM users WHERE id = ?', [target.id]);
    await services.destroySessionsForUser(target.id);
    await services.audit(req, 'USER_DELETED', { tenantId: target.tenant_id, target: `user:${target.id}`, details: { email: target.email, role: target.role } });
    res.json({ ok: true });
  }));

  // ── Invitations ──
  app.get('/api/invitations', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'users:manage');
    const tenantId = req.user.role === ROLES.PLATFORM_ADMIN ? Number(req.query.tenantId) : req.user.tenant_id;
    await services.requireTenant(req.user, tenantId);
    const rows = await db.all(`SELECT id, email, role, assessment_id, sections_json, expires_at, accepted_at, revoked_at, created_at
      FROM invites WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 100`, [tenantId]);
    res.json({
      invitations: rows.map(r => ({
        id: r.id, email: r.email, role: r.role, roleLabel: ROLE_LABELS[r.role], assessmentId: r.assessment_id,
        sections: services.parseJson(r.sections_json, []), expiresAt: r.expires_at, acceptedAt: r.accepted_at, revokedAt: r.revoked_at, createdAt: r.created_at,
        status: r.accepted_at ? 'accepted' : r.revoked_at ? 'revoked' : new Date(r.expires_at) < new Date() ? 'expired' : 'pending'
      }))
    });
  }));

  app.post('/api/invitations', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'users:manage');
    const tenantId = req.user.role === ROLES.PLATFORM_ADMIN ? Number(req.body.tenantId) : req.user.tenant_id;
    await services.requireTenant(req.user, tenantId);
    const email = String(req.body.email || '').trim().toLowerCase();
    const role = req.body.role;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Enter a valid email address');
    if (!CUSTOMER_ROLES.includes(role)) throw new HttpError(400, 'Invitations are for customer roles only');
    if (await db.get('SELECT id FROM users WHERE email = ?', [email])) throw new HttpError(409, 'A user with this email already exists');
    let assessmentId = null;
    let sections = [];
    if (req.body.assessmentId) {
      const a = await services.loadAssessment(req.user, req.body.assessmentId);
      if (a.tenant_id !== tenantId) throw new HttpError(400, 'Assessment belongs to another organisation');
      assessmentId = a.id;
      sections = (Array.isArray(req.body.sections) ? req.body.sections : []).map(String).slice(0, 50);
    }
    const token = security.randomToken(32);
    const expires = new Date(Date.now() + 7 * 86400000).toISOString();
    const r = await db.run(`INSERT INTO invites (tenant_id, email, role, token_hash, assessment_id, sections_json, expires_at, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [tenantId, email, role, security.sha256(token), assessmentId, JSON.stringify(sections), expires, req.user.id]);
    await services.audit(req, 'INVITE_CREATED', { tenantId, target: `invite:${r.lastID}`, details: { email, role, assessmentId, sections } });
    // The link is shown once; only its hash is stored.
    res.status(201).json({ id: r.lastID, invitePath: `/#/invite/${token}`, expiresAt: expires });
  }));

  app.delete('/api/invitations/:id', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'users:manage');
    const inv = await db.get('SELECT * FROM invites WHERE id = ?', [req.params.id]);
    if (!inv) throw new HttpError(404, 'Invitation not found');
    await services.requireTenant(req.user, inv.tenant_id);
    if (req.user.role !== ROLES.PLATFORM_ADMIN && inv.tenant_id !== req.user.tenant_id) throw new HttpError(404, 'Invitation not found');
    await db.run('UPDATE invites SET revoked_at = ? WHERE id = ?', [new Date().toISOString(), inv.id]);
    await services.audit(req, 'INVITE_REVOKED', { tenantId: inv.tenant_id, target: `invite:${inv.id}` });
    res.json({ ok: true });
  }));
};
