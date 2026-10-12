// Management action plan: owners, due dates and status for findings,
// risk acceptance with expiry, and CSV / Excel export.

const content = require('../content');
const Scoring = require('../../js/engine/scoring.js');
const { buildXlsx } = require('../xlsx');

const STATUSES = ['open', 'in_progress', 'resolved'];
const STATUS_LABELS = { open: 'Open', in_progress: 'In progress', risk_accepted: 'Risk accepted', resolved: 'Resolved', acceptance_expired: 'Acceptance expired' };

module.exports = function actionRoutes(app, ctx) {
  const { db, services, security, asyncHandler } = ctx;
  const { HttpError } = security;
  const auth = ctx.requireAuth;

  async function findingsSource(tenantId, frameworkId) {
    const report = await db.get('SELECT id, version, issued_at, result_json FROM reports WHERE tenant_id = ? AND framework_id = ? ORDER BY issued_at DESC LIMIT 1', [tenantId, frameworkId]);
    if (report) {
      const result = services.parseJson(report.result_json, {});
      return { source: 'report', reportId: report.id, reportVersion: report.version, issuedAt: report.issued_at, result, findings: result.findings || [] };
    }
    const a = await db.get("SELECT * FROM assessments WHERE tenant_id = ? AND framework_id = ? AND status != 'archived' ORDER BY updated_at DESC LIMIT 1", [tenantId, frameworkId]);
    if (!a) return null;
    const result = await services.scoreAssessmentRow(a);
    return { source: 'provisional', assessmentId: a.id, result, findings: result.findings };
  }

  function effectiveStatus(action) {
    if (!action) return 'open';
    if (action.status === 'risk_accepted' && action.acceptance_expiry && action.acceptance_expiry < new Date().toISOString().slice(0, 10)) return 'acceptance_expired';
    return action.status;
  }

  // Score lift for each finding, from the shared ladder (fixes in priority order).
  function scoreLift(result) {
    const byQuestion = {};
    if (!result || !result.controls || !result.overall) return { baseline: null, final: null, byQuestion };
    const ladder = Scoring.projectActionLadder(result);
    ladder.steps.forEach(st => st.items.forEach(it => { byQuestion[it.id] = { rank: st.rank, gain: it.gain, controlGain: st.gain }; }));
    return { baseline: ladder.baseline, final: ladder.final, byQuestion };
  }

  async function buildPlan(tenantId, frameworkFilter) {
    const frameworks = frameworkFilter ? [frameworkFilter]
      : (await db.all("SELECT DISTINCT framework_id FROM assessments WHERE tenant_id = ? AND status != 'archived'", [tenantId])).map(r => r.framework_id);
    const actions = await db.all('SELECT * FROM finding_actions WHERE tenant_id = ?', [tenantId]);
    const byKey = new Map(actions.map(a => [`${a.framework_id}|${a.question_id}`, a]));
    const items = [];
    const sources = [];
    for (const fw of frameworks) {
      const src = await findingsSource(tenantId, fw);
      if (!src) continue;
      const lift = scoreLift(src.result);
      sources.push({ frameworkId: fw, frameworkName: content.FRAMEWORKS[fw] ? content.FRAMEWORKS[fw].shortName : fw, source: src.source, reportId: src.reportId || null, reportVersion: src.reportVersion || null, issuedAt: src.issuedAt || null, baseline: lift.baseline, final: lift.final });
      for (const f of src.findings) {
        const step = lift.byQuestion[f.id] || null;
        const action = byKey.get(`${fw}|${f.id}`);
        const status = effectiveStatus(action);
        items.push({
          frameworkId: fw,
          frameworkName: content.FRAMEWORKS[fw] ? content.FRAMEWORKS[fw].shortName : fw,
          questionId: f.id,
          ref: f.ref,
          title: f.controlName || f.question,
          question: f.question,
          controlId: f.controlId,
          moduleName: f.moduleName,
          severity: f.severity,
          severityLabel: Scoring.SEVERITY_LABELS[f.severity],
          timeframe: f.timeframe,
          recommendation: f.recommendation,
          suggestedOwner: f.recommendation ? f.recommendation.owner : '',
          status,
          statusLabel: STATUS_LABELS[status],
          owner: action ? action.owner : '',
          dueDate: action ? action.due_date : '',
          notes: action ? action.notes : '',
          ticketRef: action ? action.ticket_ref : '',
          acceptance: action && action.status === 'risk_accepted' ? {
            justification: action.acceptance_justification, expiry: action.acceptance_expiry, acceptedAt: action.accepted_at
          } : null,
          updatedAt: action ? action.updated_at : null,
          rank: step ? step.rank : null,
          gain: step ? step.gain : 0,
          controlGain: step ? step.controlGain : 0,
          overdue: !!(action && action.due_date && ['open', 'in_progress'].includes(status) && action.due_date < new Date().toISOString().slice(0, 10))
        });
      }
    }
    items.sort((a, b) => Scoring.SEVERITIES.indexOf(a.severity) - Scoring.SEVERITIES.indexOf(b.severity) || (a.rank || 999) - (b.rank || 999));
    return { items, sources };
  }

  app.get('/api/actions', auth, asyncHandler(async (req, res) => {
    const tenantId = req.query.tenantId ? Number(req.query.tenantId) : req.user.tenant_id;
    const t = await services.requireTenant(req.user, tenantId);
    const fw = req.query.frameworkId && content.isFramework(req.query.frameworkId) ? req.query.frameworkId : null;
    const plan = await buildPlan(t.id, fw);
    const summary = { total: plan.items.length };
    Object.keys(STATUS_LABELS).forEach(s => { summary[s] = plan.items.filter(i => i.status === s).length; });
    summary.overdue = plan.items.filter(i => i.overdue).length;
    res.json({ ...plan, summary });
  }));

  async function upsertAction(tenantId, frameworkId, questionId, fields, userId) {
    const existing = await db.get('SELECT * FROM finding_actions WHERE tenant_id = ? AND framework_id = ? AND question_id = ?', [tenantId, frameworkId, questionId]);
    const now = new Date().toISOString();
    if (existing) {
      const keys = Object.keys(fields);
      await db.run(`UPDATE finding_actions SET ${keys.map(k => `${k} = ?`).join(', ')}, updated_by = ?, updated_at = ? WHERE id = ?`,
        [...keys.map(k => fields[k]), userId, now, existing.id]);
      return { before: existing };
    }
    const keys = ['tenant_id', 'framework_id', 'question_id', ...Object.keys(fields), 'updated_by', 'updated_at'];
    const values = [tenantId, frameworkId, questionId, ...Object.values(fields), userId, now];
    await db.run(`INSERT INTO finding_actions (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`, values);
    return { before: null };
  }

  function validateTarget(body) {
    const frameworkId = String(body.frameworkId || '');
    const questionId = String(body.questionId || '');
    if (!content.isFramework(frameworkId) || !content.findQuestion(frameworkId, questionId)) throw new HttpError(400, 'Unknown finding');
    return { frameworkId, questionId };
  }

  app.put('/api/actions', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'actions:update');
    const tenantId = req.body.tenantId ? Number(req.body.tenantId) : req.user.tenant_id;
    const t = await services.requireTenant(req.user, tenantId);
    const { frameworkId, questionId } = validateTarget(req.body);
    const fields = {};
    if (req.body.status !== undefined) {
      if (!STATUSES.includes(req.body.status)) throw new HttpError(400, 'Use the risk acceptance workflow to accept a risk');
      fields.status = req.body.status;
      fields.acceptance_justification = null;
      fields.acceptance_expiry = null;
    }
    if (req.body.owner !== undefined) fields.owner = String(req.body.owner).slice(0, 160);
    if (req.body.dueDate !== undefined) {
      if (req.body.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(req.body.dueDate)) throw new HttpError(400, 'Due date must be a date');
      fields.due_date = req.body.dueDate || null;
    }
    if (req.body.notes !== undefined) fields.notes = String(req.body.notes).slice(0, 4000);
    if (req.body.ticketRef !== undefined) fields.ticket_ref = String(req.body.ticketRef).slice(0, 120);
    if (!Object.keys(fields).length) throw new HttpError(400, 'Nothing to update');
    const { before } = await upsertAction(t.id, frameworkId, questionId, fields, req.user.id);
    await services.audit(req, 'ACTION_UPDATED', { tenantId: t.id, target: `finding:${frameworkId}:${questionId}`, details: { from: before ? before.status : 'open', ...fields } });
    res.json({ ok: true });
  }));

  app.post('/api/actions/accept-risk', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'risk:accept');
    const tenantId = req.body.tenantId ? Number(req.body.tenantId) : req.user.tenant_id;
    const t = await services.requireTenant(req.user, tenantId);
    const { frameworkId, questionId } = validateTarget(req.body);
    const justification = String(req.body.justification || '').trim();
    const owner = String(req.body.owner || '').trim();
    const expiry = String(req.body.expiry || '');
    if (justification.length < 20) throw new HttpError(400, 'Provide a business justification of at least 20 characters');
    if (!owner) throw new HttpError(400, 'An accountable risk owner is required');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expiry)) throw new HttpError(400, 'A review or expiry date is required');
    const today = new Date().toISOString().slice(0, 10);
    const max = new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10);
    if (expiry <= today || expiry > max) throw new HttpError(400, 'Expiry must be in the future and within 12 months');
    const compensating = req.body.compensatingControls ? `\nCompensating controls: ${String(req.body.compensatingControls).slice(0, 1000)}` : '';
    await upsertAction(t.id, frameworkId, questionId, {
      status: 'risk_accepted', owner, acceptance_justification: justification.slice(0, 3000) + compensating,
      acceptance_expiry: expiry, accepted_by: req.user.id, accepted_at: new Date().toISOString()
    }, req.user.id);
    await services.audit(req, 'RISK_ACCEPTED', { tenantId: t.id, target: `finding:${frameworkId}:${questionId}`, details: { owner, expiry } });
    res.json({ ok: true });
  }));

  function neutralise(value) {
    const s = String(value === null || value === undefined ? '' : value);
    return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  }

  const EXPORT_COLUMNS = [
    { key: 'framework', header: 'Assessment', width: 22 },
    { key: 'ref', header: 'Ref', width: 8 },
    { key: 'control', header: 'Control', width: 32 },
    { key: 'question', header: 'Finding', width: 60 },
    { key: 'severity', header: 'Severity', width: 12 },
    { key: 'timeframe', header: 'Target timeframe', width: 16 },
    { key: 'scoreLift', header: 'Score lift (points)', width: 12 },
    { key: 'action', header: 'Recommended action', width: 70 },
    { key: 'owner', header: 'Owner', width: 24 },
    { key: 'dueDate', header: 'Due date', width: 12 },
    { key: 'status', header: 'Status', width: 16 },
    { key: 'ticketRef', header: 'Ticket', width: 14 },
    { key: 'notes', header: 'Notes', width: 40 }
  ];

  async function exportRows(req) {
    const tenantId = req.query.tenantId ? Number(req.query.tenantId) : req.user.tenant_id;
    const t = await services.requireTenant(req.user, tenantId);
    const fw = req.query.frameworkId && content.isFramework(req.query.frameworkId) ? req.query.frameworkId : null;
    const plan = await buildPlan(t.id, fw);
    await services.audit(req, 'ACTION_PLAN_EXPORTED', { tenantId: t.id, details: { frameworkId: fw, format: req.params.format } });
    return {
      tenant: t,
      rows: plan.items.map(i => ({
        framework: i.frameworkName, ref: i.ref, control: i.title, question: i.question, severity: i.severityLabel, timeframe: i.timeframe, scoreLift: i.gain ? `+${i.gain}` : '',
        action: i.recommendation ? `${i.recommendation.quickWin} ${i.recommendation.mediumTerm}` : '',
        owner: i.owner || i.suggestedOwner, dueDate: i.dueDate || '', status: i.statusLabel, ticketRef: i.ticketRef || '', notes: i.notes || ''
      }))
    };
  }

  app.get('/api/actions/export.:format', auth, asyncHandler(async (req, res) => {
    const { tenant, rows } = await exportRows(req);
    const stamp = new Date().toISOString().slice(0, 10);
    const base = `${tenant.name.replace(/[^A-Za-z0-9]+/g, '-')}-action-plan-${stamp}`;
    if (req.params.format === 'csv') {
      const lines = [EXPORT_COLUMNS.map(c => `"${c.header}"`).join(',')];
      rows.forEach(r => lines.push(EXPORT_COLUMNS.map(c => `"${neutralise(r[c.key]).replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`).join(',')));
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${base}.csv"`);
      return res.send('﻿' + lines.join('\r\n'));
    }
    if (req.params.format === 'xlsx') {
      const buf = buildXlsx({ sheetName: 'Action plan', title: `${tenant.name} action plan`, columns: EXPORT_COLUMNS, rows: rows.map(r => {
        const o = {}; EXPORT_COLUMNS.forEach(c => { o[c.key] = neutralise(r[c.key]); }); return o;
      }) });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${base}.xlsx"`);
      return res.send(buf);
    }
    throw new HttpError(404, 'Unknown export format');
  }));
};
