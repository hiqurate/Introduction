// Platform administration: scoring configuration (versioned), control
// library and mapping coverage, template lifecycle, review queue, audit
// log, product analytics and demo reset.

const content = require('../content');
const Scoring = require('../../js/engine/scoring.js');
const Controls = require('../../js/engine/control-library.js');
const { seedDemoTenant } = require('../bootstrap');

const TEMPLATE_TRANSITIONS = {
  draft: ['in_review', 'rejected'],
  in_review: ['approved', 'rejected', 'draft'],
  approved: ['published', 'draft'],
  published: [],
  rejected: []
};

function validateConfig(cfg) {
  const errors = [];
  const tiers = cfg.tierWeights || {};
  Object.keys(Controls.CRITICALITY_TIERS).forEach(t => {
    const v = Number(tiers[t]);
    if (!Number.isFinite(v) || v <= 0 || v > 100) errors.push(`Weight for ${t} controls must be between 0 and 100`);
  });
  const g = cfg.gating || {};
  ['oneFailureCap', 'multiFailureCap'].forEach(k => {
    const v = Number(g[k]);
    if (!Number.isFinite(v) || v < 0 || v > 100) errors.push(`Gating cap ${k} must be between 0 and 100`);
  });
  if (Number(g.multiFailureCap) > Number(g.oneFailureCap)) errors.push('The multiple-failure cap must not exceed the single-failure cap');
  if (!(Number(g.multiFailureCount) >= 2)) errors.push('Multiple-failure threshold must be at least 2');
  if (!(Number(g.failureThreshold) > 0 && Number(g.failureThreshold) < 1)) errors.push('Failure threshold must be between 0 and 1');
  const dw = cfg.domainWeights || {};
  Object.keys(dw).forEach(fw => {
    if (!content.isFramework(fw)) { errors.push(`Unknown template ${fw} in domain weights`); return; }
    const weights = dw[fw];
    const keys = Object.keys(weights || {});
    if (!keys.length) return;
    const modules = content.getFrameworkData(fw).modules.map(m => m.id);
    const missing = modules.filter(m => weights[m] === undefined);
    if (missing.length) errors.push(`${content.FRAMEWORKS[fw].shortName}: every domain needs a weight`);
    const sum = keys.reduce((n, k) => n + Number(weights[k] || 0), 0);
    if (Math.abs(sum - 100) > 0.01) errors.push(`${content.FRAMEWORKS[fw].shortName}: domain weights must sum to 100 (currently ${Math.round(sum * 100) / 100})`);
    if (keys.some(k => Number(weights[k]) < 0)) errors.push(`${content.FRAMEWORKS[fw].shortName}: domain weights cannot be negative`);
  });
  if (cfg.applicabilityRules) {
    if (!Array.isArray(cfg.applicabilityRules)) errors.push('Applicability rules must be a list');
    else cfg.applicabilityRules.forEach((r, i) => {
      if (!r.id || !['hide', 'suggest_na'].includes(r.effect) || !Array.isArray(r.when)) errors.push(`Rule ${i + 1} is incomplete`);
    });
  }
  const sb = cfg.scoreBands || {};
  if (!(Number(sb.strong) > Number(sb.moderate))) errors.push('Score bands: strong threshold must be above moderate');
  return errors;
}

module.exports = function adminRoutes(app, ctx) {
  const { db, services, security, asyncHandler } = ctx;
  const { HttpError, ROLES, STAFF_ROLES } = security;
  const auth = ctx.requireAuth;

  function requirePlatformAdmin(req, res, next) {
    if (!req.user || req.user.role !== ROLES.PLATFORM_ADMIN) return res.status(403).json({ error: 'Platform administrator access required' });
    next();
  }
  function requireStaff(req, res, next) {
    if (!req.user || !STAFF_ROLES.includes(req.user.role)) return res.status(403).json({ error: 'Staff access required' });
    next();
  }

  // ── Scoring configuration ──
  app.get('/api/admin/config', auth, requirePlatformAdmin, asyncHandler(async (req, res) => {
    const active = await services.getActiveConfig();
    const history = await db.all(`SELECT c.version, c.note, c.created_at, u.email AS created_by FROM scoring_configs c
      LEFT JOIN users u ON u.id = c.created_by ORDER BY c.version DESC LIMIT 50`);
    const modules = {};
    content.FRAMEWORK_ORDER.forEach(fw => { modules[fw] = content.getFrameworkData(fw).modules.map(m => ({ id: m.id, name: m.name })); });
    res.json({ config: { ...active, applicabilityRules: active.applicabilityRules || Scoring.DEFAULT_RULES }, history, modules, defaults: Scoring.DEFAULT_CONFIG });
  }));

  app.post('/api/admin/config', auth, requirePlatformAdmin, asyncHandler(async (req, res) => {
    const current = await services.getActiveConfig();
    const incoming = req.body.config || {};
    const next = {
      tierWeights: incoming.tierWeights || current.tierWeights,
      domainWeights: incoming.domainWeights || current.domainWeights,
      gating: incoming.gating || current.gating,
      scoreBands: incoming.scoreBands || current.scoreBands,
      riskBands: incoming.riskBands || current.riskBands,
      contextElevationThreshold: incoming.contextElevationThreshold !== undefined ? Number(incoming.contextElevationThreshold) : current.contextElevationThreshold,
      staleAfterDays: incoming.staleAfterDays !== undefined ? Number(incoming.staleAfterDays) : current.staleAfterDays,
      benchmarkMinimumPopulation: incoming.benchmarkMinimumPopulation !== undefined ? Number(incoming.benchmarkMinimumPopulation) : current.benchmarkMinimumPopulation,
      questionOverrides: current.questionOverrides, // changed only through the template lifecycle
      applicabilityRules: incoming.applicabilityRules !== undefined ? incoming.applicabilityRules : current.applicabilityRules
    };
    const errors = validateConfig(Scoring.resolveConfig(next));
    if (errors.length) throw new HttpError(400, errors[0], { errors });
    const note = String(req.body.note || '').trim();
    if (!note) throw new HttpError(400, 'Describe the reason for this change');
    const version = await services.saveConfig(req, next, note.slice(0, 500));
    res.status(201).json({ version });
  }));

  // ── Control library and mapping coverage ──
  app.get('/api/admin/library', auth, requireStaff, asyncHandler(async (req, res) => {
    const config = await services.getActiveConfig();
    const coverage = [];
    const controlUsage = {};
    content.FRAMEWORK_ORDER.forEach(fw => {
      const items = Scoring.buildItems(fw, content.getFrameworkData(fw, config.questionOverrides), config);
      const methods = {};
      const tiers = {};
      items.forEach(i => {
        methods[i.mappingMethod] = (methods[i.mappingMethod] || 0) + 1;
        tiers[i.tier] = (tiers[i.tier] || 0) + 1;
        if (i.control) {
          if (!controlUsage[i.control.id]) controlUsage[i.control.id] = {};
          controlUsage[i.control.id][fw] = (controlUsage[i.control.id][fw] || 0) + 1;
        }
      });
      coverage.push({
        frameworkId: fw, name: content.FRAMEWORKS[fw].shortName, questions: items.length,
        mapped: items.filter(i => i.control).length,
        unmapped: items.filter(i => !i.control).map(i => ({ id: i.id, text: i.text })),
        methods, tiers,
        items: items.map(i => ({ id: i.id, text: i.text, moduleName: i.moduleName, controlId: i.control ? i.control.id : null, method: i.mappingMethod, tier: i.tier, evidenceRequired: i.evidenceRequired }))
      });
    });
    const refIds = Object.keys(Controls.FRAMEWORK_REFERENCES);
    const controls = Controls.CONTROLS.map(c => ({
      ...c,
      usage: controlUsage[c.id] || {},
      unmappedReferences: refIds.filter(r => !(c.mappings[r] || []).filter(x => x && x !== '—').length)
    }));
    res.json({
      controls,
      tiers: Controls.CRITICALITY_TIERS,
      domains: Controls.DOMAINS,
      referenceFrameworks: Controls.FRAMEWORK_REFERENCES,
      coverage,
      unusedControls: Controls.CONTROLS.filter(c => !controlUsage[c.id]).map(c => c.id)
    });
  }));

  // ── Template lifecycle: Draft → In review → Approved → Published ──
  app.get('/api/admin/templates', auth, requireStaff, asyncHandler(async (req, res) => {
    const versions = await db.all(`SELECT v.*, a.email AS author, r.email AS reviewer, p.email AS publisher FROM template_versions v
      LEFT JOIN users a ON a.id = v.created_by LEFT JOIN users r ON r.id = v.reviewed_by LEFT JOIN users p ON p.id = v.published_by
      ORDER BY v.created_at DESC LIMIT 200`);
    res.json({
      templates: content.catalog(),
      versions: versions.map(v => ({
        id: v.id, frameworkId: v.framework_id, version: v.version, status: v.status, changes: services.parseJson(v.changes_json, {}), note: v.note,
        author: v.author, reviewer: v.reviewer, publisher: v.publisher, createdAt: v.created_at, reviewedAt: v.reviewed_at, publishedAt: v.published_at
      }))
    });
  }));

  app.post('/api/admin/templates/:frameworkId/versions', auth, requirePlatformAdmin, asyncHandler(async (req, res) => {
    const fw = req.params.frameworkId;
    if (!content.isFramework(fw)) throw new HttpError(404, 'Unknown template');
    const raw = (req.body.changes && req.body.changes.questions) || {};
    const questions = {};
    for (const qid of Object.keys(raw)) {
      if (!content.findQuestion(fw, qid)) throw new HttpError(400, `Unknown question ${qid}`);
      const c = raw[qid] || {};
      const clean = {};
      if (c.text) clean.text = String(c.text).trim().slice(0, 500);
      if (c.guidance) clean.guidance = String(c.guidance).trim().slice(0, 2000);
      if (c.tier) { if (!Controls.CRITICALITY_TIERS[c.tier]) throw new HttpError(400, 'Invalid criticality'); clean.tier = c.tier; }
      if (c.controlId) { if (!Controls.CONTROL_INDEX[c.controlId]) throw new HttpError(400, 'Invalid control'); clean.controlId = c.controlId; }
      if (c.evidenceRequired !== undefined) clean.evidenceRequired = !!c.evidenceRequired;
      if (c.retired !== undefined) clean.retired = !!c.retired;
      if (Object.keys(clean).length) questions[qid] = clean;
    }
    if (!Object.keys(questions).length) throw new HttpError(400, 'No changes supplied');
    const prev = await db.get("SELECT version FROM template_versions WHERE framework_id = ? AND status = 'published' ORDER BY published_at DESC LIMIT 1", [fw]);
    const base = prev ? prev.version : content.FRAMEWORKS[fw].templateVersion;
    const parts = String(base).split('.').map(Number);
    const version = `${parts[0] || 1}.${(parts[1] || 0) + 1}`;
    const r = await db.run('INSERT INTO template_versions (framework_id, version, status, changes_json, note, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [fw, version, 'draft', JSON.stringify({ questions }), String(req.body.note || '').slice(0, 500), req.user.id]);
    await services.audit(req, 'TEMPLATE_DRAFT_CREATED', { target: `template:${r.lastID}`, details: { frameworkId: fw, version, questions: Object.keys(questions) } });
    res.status(201).json({ id: r.lastID, version });
  }));

  app.post('/api/admin/templates/versions/:id/transition', auth, requireStaff, asyncHandler(async (req, res) => {
    const v = await db.get('SELECT * FROM template_versions WHERE id = ?', [req.params.id]);
    if (!v) throw new HttpError(404, 'Template version not found');
    const to = req.body.to;
    if (!(TEMPLATE_TRANSITIONS[v.status] || []).includes(to)) throw new HttpError(409, `Cannot move a ${v.status.replace('_', ' ')} version to ${String(to).replace('_', ' ')}`);
    if (to === 'approved' && v.created_by === req.user.id) throw new HttpError(403, 'A different reviewer must approve this change');
    if (to === 'published' && req.user.role !== ROLES.PLATFORM_ADMIN) throw new HttpError(403, 'Only a platform administrator can publish');
    const now = new Date().toISOString();
    if (to === 'published') {
      const current = await services.getActiveConfig();
      const changes = services.parseJson(v.changes_json, {}).questions || {};
      const overrides = { ...(current.questionOverrides || {}) };
      Object.keys(changes).forEach(qid => { overrides[qid] = { ...(overrides[qid] || {}), ...changes[qid] }; });
      const next = { ...current, questionOverrides: overrides };
      delete next.version;
      await services.saveConfig(req, next, `Published ${content.FRAMEWORKS[v.framework_id].shortName} template ${v.version}`);
      await db.run('UPDATE template_versions SET status = ?, published_by = ?, published_at = ? WHERE id = ?', [to, req.user.id, now, v.id]);
    } else if (to === 'approved' || to === 'rejected') {
      await db.run('UPDATE template_versions SET status = ?, reviewed_by = ?, reviewed_at = ? WHERE id = ?', [to, req.user.id, now, v.id]);
    } else {
      await db.run('UPDATE template_versions SET status = ? WHERE id = ?', [to, v.id]);
    }
    await services.audit(req, 'TEMPLATE_TRANSITION', { target: `template:${v.id}`, details: { frameworkId: v.framework_id, version: v.version, from: v.status, to } });
    res.json({ ok: true });
  }));

  // ── Assessment review queue ──
  app.get('/api/admin/queue', auth, requireStaff, asyncHandler(async (req, res) => {
    const ids = await services.accessibleTenantIds(req.user);
    const params = [];
    let where = "a.status != 'archived'";
    if (ids !== null) {
      if (!ids.length) return res.json({ items: [] });
      where += ` AND a.tenant_id IN (${ids.map(() => '?').join(',')})`; params.push(...ids);
    }
    if (req.query.status) { where += ' AND a.status = ?'; params.push(String(req.query.status)); }
    if (req.query.tenantId) { where += ' AND a.tenant_id = ?'; params.push(Number(req.query.tenantId)); }
    if (req.query.assessorId) { where += ' AND a.assessor_id = ?'; params.push(Number(req.query.assessorId)); }
    const rows = await db.all(`SELECT a.*, t.name AS tenant_name, t.package, u.name AS assessor_name, u.email AS assessor_email
      FROM assessments a JOIN tenants t ON t.id = a.tenant_id LEFT JOIN users u ON u.id = a.assessor_id
      WHERE ${where} ORDER BY CASE a.status WHEN 'submitted' THEN 0 WHEN 'in_review' THEN 1 WHEN 'evidence_requested' THEN 2 WHEN 'in_progress' THEN 3 ELSE 4 END, a.due_date IS NULL, a.due_date`, params);
    const config = await services.getActiveConfig();
    const items = [];
    for (const a of rows) {
      const result = await services.scoreAssessmentRow(a, config);
      const fw = content.FRAMEWORKS[a.framework_id];
      items.push({
        id: a.id, tenantId: a.tenant_id, tenantName: a.tenant_name, package: a.package,
        frameworkId: a.framework_id, frameworkName: fw ? fw.shortName : a.framework_id, title: a.title,
        status: a.status, dueDate: a.due_date, updatedAt: a.updated_at, submittedAt: a.submitted_at,
        assessorId: a.assessor_id, assessorName: a.assessor_name || a.assessor_email || null,
        progress: result.overall.completion.percentage, missingEvidence: result.missingEvidence.length,
        overdue: !!(a.due_date && a.due_date < new Date().toISOString().slice(0, 10) && a.status !== 'completed')
      });
    }
    res.json({ items });
  }));

  // ── Audit log (read-only, searchable) ──
  app.get('/api/admin/audit', auth, requirePlatformAdmin, asyncHandler(async (req, res) => {
    const params = [];
    let where = '1 = 1';
    if (req.query.q) {
      where += ' AND (l.user_email LIKE ? OR l.action LIKE ? OR l.target LIKE ? OR l.details LIKE ?)';
      const q = `%${String(req.query.q).slice(0, 100)}%`;
      params.push(q, q, q, q);
    }
    if (req.query.action) { where += ' AND l.action = ?'; params.push(String(req.query.action)); }
    if (req.query.tenantId) { where += ' AND l.tenant_id = ?'; params.push(Number(req.query.tenantId)); }
    if (req.query.from) { where += ' AND l.created_at >= ?'; params.push(String(req.query.from)); }
    if (req.query.to) { where += ' AND l.created_at <= ?'; params.push(`${String(req.query.to)}T23:59:59.999Z`); }
    const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 200));
    const rows = await db.all(`SELECT l.*, t.name AS tenant_name FROM audit_logs l LEFT JOIN tenants t ON t.id = l.tenant_id
      WHERE ${where} ORDER BY l.id DESC LIMIT ${limit}`, params);
    const actions = (await db.all('SELECT DISTINCT action FROM audit_logs ORDER BY action')).map(r => r.action);
    res.json({ logs: rows.map(r => ({ ...r, details: services.parseJson(r.details, r.details) })), actions });
  }));

  // ── Product analytics (aggregate, no personal content) ──
  app.get('/api/admin/analytics', auth, requirePlatformAdmin, asyncHandler(async (req, res) => {
    const days = Math.min(365, Math.max(7, Number(req.query.days) || 90));
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const count = async type => (await db.get('SELECT COUNT(*) AS n FROM events WHERE type = ? AND created_at >= ?', [type, since])).n;
    const started = await count('assessment_started');
    const submitted = await count('assessment_submitted');
    const issued = await count('report_issued');
    const viewed = await count('report_viewed');
    const exported = await count('report_exported');
    const logins = await count('login');
    const staleOpen = (await db.get("SELECT COUNT(*) AS n FROM assessments WHERE status = 'in_progress' AND updated_at < ?", [new Date(Date.now() - 30 * 86400000).toISOString()])).n;
    const durations = await db.all("SELECT framework_id, (julianday(completed_at) - julianday(created_at)) AS days FROM assessments WHERE status = 'completed' AND completed_at >= ?", [since]);
    const byFramework = {};
    durations.forEach(d => {
      if (!byFramework[d.framework_id]) byFramework[d.framework_id] = [];
      byFramework[d.framework_id].push(d.days);
    });
    const completionTime = Object.keys(byFramework).map(fw => {
      const v = byFramework[fw].sort((a, b) => a - b);
      return { frameworkId: fw, name: content.FRAMEWORKS[fw] ? content.FRAMEWORKS[fw].shortName : fw, completed: v.length, medianDays: Math.round(v[Math.floor((v.length - 1) / 2)] * 10) / 10 };
    });
    const weekly = await db.all(`SELECT strftime('%Y-%W', created_at) AS week, type, COUNT(*) AS n FROM events
      WHERE created_at >= ? AND type IN ('assessment_started','assessment_submitted','report_issued') GROUP BY week, type ORDER BY week`, [since]);
    const sectionEvents = await db.all("SELECT meta_json FROM events WHERE type = 'section_completed' AND created_at >= ?", [since]);
    res.json({
      periodDays: days,
      funnel: { started, submitted, issued, completionRate: started ? Math.round((submitted / started) * 100) : null },
      engagement: { logins, reportViews: viewed, reportExports: exported, sectionsCompleted: sectionEvents.length },
      abandonment: { inactiveOver30Days: staleOpen },
      completionTime,
      weekly,
      note: 'Metrics are aggregated from product events. No assessment answers or evidence content are included.'
    });
  }));

  // ── Demo organisation ──
  app.post('/api/admin/demo/reset', auth, requirePlatformAdmin, asyncHandler(async (req, res) => {
    const info = await seedDemoTenant(db, services, { log: false });
    await services.audit(req, 'DEMO_RESET', { tenantId: info.tenantId });
    res.json({ tenantId: info.tenantId, email: info.email, password: info.password });
  }));
};

module.exports.validateConfig = validateConfig;
