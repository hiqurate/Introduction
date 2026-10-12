// ============================================
// HawkSight — Shared server services
// Audit logging, product events, configuration, access checks and
// server-side scoring.
// ============================================

const crypto = require('crypto');
const Scoring = require('../js/engine/scoring.js');
const content = require('./content');
const { ROLES, HttpError, can } = require('./security');

function nowIso() {
  return new Date().toISOString();
}

function parseJson(text, fallback) {
  if (text === null || text === undefined || text === '') return fallback;
  try { return JSON.parse(text); } catch { return fallback; }
}

function clientIp(req) {
  return req.ip || (req.socket && req.socket.remoteAddress) || '';
}

function createServices(db) {
  async function audit(req, action, { tenantId = null, target = null, details = null } = {}) {
    const user = req && req.user;
    try {
      await db.run(
        'INSERT INTO audit_logs (tenant_id, user_id, user_email, action, target, details, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [tenantId !== null ? tenantId : (user ? user.tenant_id : null), user ? user.id : null, user ? user.email : (details && details.email) || null,
          action, target, details ? JSON.stringify(details) : null, req ? clientIp(req) : null]
      );
    } catch (err) {
      console.error('Audit log write failed:', err.message);
    }
  }

  async function event(req, type, { tenantId = null, frameworkId = null, assessmentId = null, meta = {} } = {}) {
    const user = req && req.user;
    try {
      await db.run('INSERT INTO events (tenant_id, user_id, type, framework_id, assessment_id, meta_json) VALUES (?, ?, ?, ?, ?, ?)',
        [tenantId !== null ? tenantId : (user ? user.tenant_id : null), user ? user.id : null, type, frameworkId, assessmentId, JSON.stringify(meta)]);
    } catch (err) {
      console.error('Event write failed:', err.message);
    }
  }

  async function getActiveConfig() {
    const row = await db.get('SELECT version, config_json FROM scoring_configs ORDER BY version DESC LIMIT 1');
    if (!row) return Scoring.resolveConfig({ version: 0 });
    return Scoring.resolveConfig({ ...parseJson(row.config_json, {}), version: row.version });
  }

  async function saveConfig(req, config, note) {
    const clean = { ...config };
    delete clean.version;
    const result = await db.run('INSERT INTO scoring_configs (config_json, note, created_by) VALUES (?, ?, ?)',
      [JSON.stringify(clean), note || null, req.user ? req.user.id : null]);
    await audit(req, 'SCORING_CONFIG_PUBLISHED', { tenantId: null, target: `config:${result.lastID}`, details: { note } });
    return result.lastID;
  }

  async function loadUser(id) {
    return db.get('SELECT id, tenant_id, email, name, role, status, must_change_password, last_login_at, created_at FROM users WHERE id = ?', [id]);
  }

  async function canAccessTenant(user, tenantId) {
    if (!user || !tenantId) return false;
    if (user.role === ROLES.PLATFORM_ADMIN) return true;
    if (user.role === ROLES.ASSESSOR) {
      const row = await db.get('SELECT 1 AS ok FROM tenant_assessors WHERE tenant_id = ? AND user_id = ?', [tenantId, user.id]);
      return !!row;
    }
    return Number(user.tenant_id) === Number(tenantId);
  }

  async function requireTenant(user, tenantId) {
    const tenant = await db.get('SELECT * FROM tenants WHERE id = ?', [tenantId]);
    // Return 404 rather than 403 so tenant IDs cannot be enumerated.
    if (!tenant || !(await canAccessTenant(user, tenant.id))) throw new HttpError(404, 'Organisation not found');
    return tenant;
  }

  async function accessibleTenantIds(user) {
    if (user.role === ROLES.PLATFORM_ADMIN) return null; // all
    if (user.role === ROLES.ASSESSOR) {
      return (await db.all('SELECT tenant_id FROM tenant_assessors WHERE user_id = ?', [user.id])).map(r => r.tenant_id);
    }
    return user.tenant_id ? [user.tenant_id] : [];
  }

  async function sectionsFor(assessmentId) {
    return db.all(`SELECT s.module_id, s.owner_user_id, s.status, s.updated_at, u.name AS owner_name, u.email AS owner_email
      FROM assessment_sections s LEFT JOIN users u ON u.id = s.owner_user_id WHERE s.assessment_id = ?`, [assessmentId]);
  }

  // Contributors only work on sections assigned to them.
  async function allowedModulesFor(user, assessmentId) {
    if (user.role !== ROLES.CONTRIBUTOR) return null; // all modules
    const rows = await db.all('SELECT module_id FROM assessment_sections WHERE assessment_id = ? AND owner_user_id = ?', [assessmentId, user.id]);
    return rows.map(r => r.module_id);
  }

  async function loadAssessment(user, assessmentId) {
    const a = await db.get('SELECT * FROM assessments WHERE id = ?', [assessmentId]);
    if (!a || !(await canAccessTenant(user, a.tenant_id))) throw new HttpError(404, 'Assessment not found');
    return a;
  }

  async function evidenceCounts(assessmentId) {
    const rows = await db.all('SELECT question_id, COUNT(*) AS n FROM evidence WHERE assessment_id = ? AND deleted_at IS NULL GROUP BY question_id', [assessmentId]);
    return rows.reduce((acc, r) => { acc[r.question_id] = r.n; return acc; }, {});
  }

  async function scoreAssessmentRow(assessment, config) {
    const cfg = config || await getActiveConfig();
    const data = content.getFrameworkData(assessment.framework_id, cfg.questionOverrides);
    const profile = parseJson(assessment.profile_json, {});
    return Scoring.scoreAssessment({
      frameworkId: assessment.framework_id,
      data,
      answers: parseJson(assessment.answers_json, {}),
      evidence: await evidenceCounts(assessment.id),
      profile,
      config: cfg,
      scope: assessment.scope
    });
  }

  function hashReport(payload) {
    return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  }

  // Sign a user out everywhere (optionally keeping the current session).
  async function destroySessionsForUser(userId, exceptSid) {
    const rows = await db.all('SELECT sid, data FROM sessions');
    for (const row of rows) {
      if (row.sid === exceptSid) continue;
      const data = parseJson(row.data, {});
      if (Number(data.userId) === Number(userId)) await db.run('DELETE FROM sessions WHERE sid = ?', [row.sid]);
    }
  }

  function assertCan(user, capability) {
    if (!can(user, capability)) throw new HttpError(403, 'You do not have permission to perform this action');
  }

  return {
    audit,
    event,
    getActiveConfig,
    saveConfig,
    loadUser,
    canAccessTenant,
    requireTenant,
    accessibleTenantIds,
    sectionsFor,
    allowedModulesFor,
    loadAssessment,
    evidenceCounts,
    scoreAssessmentRow,
    hashReport,
    destroySessionsForUser,
    assertCan,
    parseJson,
    nowIso
  };
}

module.exports = { createServices, parseJson, nowIso };
