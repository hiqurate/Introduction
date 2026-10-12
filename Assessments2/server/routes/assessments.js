// Assessments: lifecycle, answers (autosave), section ownership, submission,
// assessor review and report issuance.

const content = require('../content');
const Scoring = require('../../js/engine/scoring.js');
const { issueReport } = require('../reporting');

const OPEN_STATUSES = ['in_progress', 'evidence_requested'];
const STATUS_LABELS = {
  in_progress: 'In progress',
  submitted: 'Submitted for review',
  evidence_requested: 'Evidence requested',
  in_review: 'In review',
  completed: 'Completed',
  archived: 'Archived'
};
const SECTION_STATUSES = ['not_started', 'in_progress', 'complete'];

module.exports = function assessmentRoutes(app, ctx) {
  const { db, services, security, asyncHandler } = ctx;
  const { HttpError, ROLES, STAFF_ROLES, can } = security;
  const auth = ctx.requireAuth;

  async function summarise(a, config) {
    const result = await services.scoreAssessmentRow(a, config);
    const lastReport = await db.get('SELECT id, version, issued_at, health_score FROM reports WHERE assessment_id = ? ORDER BY version DESC LIMIT 1', [a.id]);
    const fw = content.FRAMEWORKS[a.framework_id];
    return {
      id: a.id,
      tenantId: a.tenant_id,
      frameworkId: a.framework_id,
      frameworkName: fw ? fw.name : a.framework_id,
      frameworkShortName: fw ? fw.shortName : a.framework_id,
      title: a.title,
      scope: a.scope || 'full',
      scopeLabel: a.scope === 'core' ? 'Snapshot' : 'Full assessment',
      status: a.status,
      statusLabel: STATUS_LABELS[a.status] || a.status,
      dueDate: a.due_date,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
      submittedAt: a.submitted_at,
      completedAt: a.completed_at,
      assessorId: a.assessor_id,
      progress: result.overall.completion,
      healthScore: result.overall.completion.answered ? result.overall.healthScore : null,
      riskScore: result.overall.riskScore,
      maturity: result.overall.maturity ? result.overall.maturity.name : null,
      confidence: result.overall.confidence.label,
      severityCounts: result.severityCounts,
      missingEvidence: result.missingEvidence.length,
      lastReport: lastReport ? { id: lastReport.id, version: lastReport.version, issuedAt: lastReport.issued_at, healthScore: lastReport.health_score } : null
    };
  }

  // Template content (questions and guidance) with published overrides applied.
  // Customers can only load templates their organisation is entitled to.
  app.get('/api/content/:frameworkId', auth, asyncHandler(async (req, res) => {
    const frameworkId = String(req.params.frameworkId);
    if (!content.isFramework(frameworkId)) throw new HttpError(404, 'Unknown assessment template');
    if (!STAFF_ROLES.includes(req.user.role)) {
      const ok = await db.get('SELECT 1 AS ok FROM tenant_frameworks WHERE tenant_id = ? AND framework_id = ?', [req.user.tenant_id, frameworkId]);
      const hasAssessment = await db.get('SELECT 1 AS ok FROM assessments WHERE tenant_id = ? AND framework_id = ?', [req.user.tenant_id, frameworkId]);
      if (!ok && !hasAssessment) throw new HttpError(404, 'Unknown assessment template');
    }
    const config = await services.getActiveConfig();
    const fw = content.FRAMEWORKS[frameworkId];
    res.json({ framework: fw, data: content.getFrameworkData(frameworkId, config.questionOverrides) });
  }));

  // List assessments visible to the user (optionally for one tenant).
  app.get('/api/assessments', auth, asyncHandler(async (req, res) => {
    const config = await services.getActiveConfig();
    let rows;
    if (req.query.tenantId) {
      const t = await services.requireTenant(req.user, req.query.tenantId);
      rows = await db.all("SELECT * FROM assessments WHERE tenant_id = ? AND status != 'archived' ORDER BY updated_at DESC", [t.id]);
    } else {
      const ids = await services.accessibleTenantIds(req.user);
      rows = ids === null
        ? await db.all("SELECT * FROM assessments WHERE status != 'archived' ORDER BY updated_at DESC")
        : ids.length ? await db.all(`SELECT * FROM assessments WHERE status != 'archived' AND tenant_id IN (${ids.map(() => '?').join(',')}) ORDER BY updated_at DESC`, ids) : [];
    }
    const assessments = [];
    for (const a of rows) assessments.push(await summarise(a, config));
    res.json({ assessments });
  }));

  app.post('/api/assessments', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'assessment:create');
    const tenantId = STAFF_ROLES.includes(req.user.role) ? Number(req.body.tenantId) : req.user.tenant_id;
    const t = await services.requireTenant(req.user, tenantId);
    const frameworkId = String(req.body.frameworkId || '');
    if (!content.isFramework(frameworkId)) throw new HttpError(400, 'Unknown assessment template');
    const entitled = await db.get('SELECT 1 AS ok FROM tenant_frameworks WHERE tenant_id = ? AND framework_id = ?', [t.id, frameworkId]);
    if (!entitled) throw new HttpError(403, 'This assessment is not enabled for your organisation');
    const open = await db.get(`SELECT id FROM assessments WHERE tenant_id = ? AND framework_id = ? AND status IN ('in_progress','submitted','evidence_requested','in_review')`, [t.id, frameworkId]);
    if (open) throw new HttpError(409, 'An assessment for this template is already open', { assessmentId: open.id });

    const profileRow = await db.get('SELECT profile_json FROM tenant_profiles WHERE tenant_id = ?', [t.id]);
    const profile = services.parseJson(profileRow && profileRow.profile_json, {});
    if (!profile.organizationName || !profile.industry || !profile.employeeCount) {
      throw new HttpError(400, 'Complete the organisation profile before starting an assessment', { code: 'PROFILE_REQUIRED' });
    }

    // Optionally start from the answers of the latest completed cycle.
    let answers = {};
    if (req.body.carryForward) {
      const prev = await db.get("SELECT answers_json FROM assessments WHERE tenant_id = ? AND framework_id = ? AND status = 'completed' ORDER BY completed_at DESC LIMIT 1", [t.id, frameworkId]);
      if (prev) {
        const prevAnswers = services.parseJson(prev.answers_json, {});
        Object.keys(prevAnswers).forEach(k => { answers[k] = { ...prevAnswers[k], carried: true, c: 'self-attested' }; });
      }
    }

    const fw = content.FRAMEWORKS[frameworkId];
    const title = String(req.body.title || '').trim().slice(0, 160) || `${fw.name} — ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`;
    const dueDate = /^\d{4}-\d{2}-\d{2}$/.test(req.body.dueDate || '') ? req.body.dueDate : null;
    const id = await db.transaction(async tx => {
      // The organisation's plan sets the depth: Snapshot covers each control once.
      const scope = t.package === 'snapshot' ? 'core' : 'full';
      const r = await tx.run(`INSERT INTO assessments (tenant_id, framework_id, title, status, profile_json, answers_json, created_by, due_date, scope)
        VALUES (?, ?, ?, 'in_progress', ?, ?, ?, ?, ?)`, [t.id, frameworkId, title, JSON.stringify(profile), JSON.stringify(answers), req.user.id, dueDate, scope]);
      for (const mod of content.getFrameworkData(frameworkId).modules) {
        await tx.run('INSERT INTO assessment_sections (assessment_id, module_id) VALUES (?, ?)', [r.lastID, mod.id]);
      }
      return r.lastID;
    });
    await services.audit(req, 'ASSESSMENT_CREATED', { tenantId: t.id, target: `assessment:${id}`, details: { frameworkId, carryForward: !!req.body.carryForward } });
    await services.event(req, 'assessment_started', { tenantId: t.id, frameworkId, assessmentId: id });
    const a = await db.get('SELECT * FROM assessments WHERE id = ?', [id]);
    res.status(201).json({ assessment: await summarise(a) });
  }));

  app.get('/api/assessments/:id', auth, asyncHandler(async (req, res) => {
    const a = await services.loadAssessment(req.user, req.params.id);
    const config = await services.getActiveConfig();
    const result = await services.scoreAssessmentRow(a, config);
    const sections = await services.sectionsFor(a.id);
    const allowedModules = await services.allowedModulesFor(req.user, a.id);
    const tenant = await db.get('SELECT id, name, package FROM tenants WHERE id = ?', [a.tenant_id]);
    const editable = OPEN_STATUSES.includes(a.status) || (STAFF_ROLES.includes(req.user.role) && a.status === 'in_review');
    res.json({
      assessment: await summarise(a, config),
      tenant,
      profile: services.parseJson(a.profile_json, {}),
      answers: services.parseJson(a.answers_json, {}),
      sections,
      reviewNotes: a.review_notes,
      aiSummary: a.ai_summary ? { text: a.ai_summary, status: a.ai_summary_status } : null,
      result,
      config: {
        version: config.version,
        rules: config.applicabilityRules || Scoring.DEFAULT_RULES,
        questionOverrides: config.questionOverrides,
        tierWeights: config.tierWeights,
        domainWeights: config.domainWeights,
        gating: config.gating
      },
      permissions: {
        canAnswer: editable && can(req.user, 'assessment:answer'),
        answerableModules: allowedModules,
        canAssign: can(req.user, 'assessment:assign'),
        canSubmit: can(req.user, 'assessment:submit') && OPEN_STATUSES.includes(a.status),
        canReview: can(req.user, 'assessment:review'),
        canValidate: can(req.user, 'evidence:validate'),
        canIssue: can(req.user, 'report:issue'),
        editable
      }
    });
  }));

  app.patch('/api/assessments/:id', auth, asyncHandler(async (req, res) => {
    const a = await services.loadAssessment(req.user, req.params.id);
    services.assertCan(req.user, 'assessment:assign');
    const changes = {};
    if (req.body.title !== undefined) changes.title = String(req.body.title).trim().slice(0, 160) || a.title;
    if (req.body.dueDate !== undefined) changes.due_date = /^\d{4}-\d{2}-\d{2}$/.test(req.body.dueDate) ? req.body.dueDate : null;
    if (req.body.assessorId !== undefined && STAFF_ROLES.includes(req.user.role)) {
      if (req.body.assessorId === null) changes.assessor_id = null;
      else {
        const u = await db.get('SELECT id FROM users WHERE id = ? AND role IN (?, ?)', [req.body.assessorId, ROLES.ASSESSOR, ROLES.PLATFORM_ADMIN]);
        if (!u) throw new HttpError(400, 'Assessor not found');
        changes.assessor_id = u.id;
      }
    }
    const keys = Object.keys(changes);
    if (keys.length) {
      await db.run(`UPDATE assessments SET ${keys.map(k => `${k} = ?`).join(', ')}, updated_at = ? WHERE id = ?`, [...keys.map(k => changes[k]), new Date().toISOString(), a.id]);
      await services.audit(req, 'ASSESSMENT_UPDATED', { tenantId: a.tenant_id, target: `assessment:${a.id}`, details: changes });
    }
    res.json({ assessment: await summarise(await db.get('SELECT * FROM assessments WHERE id = ?', [a.id])) });
  }));

  // Autosave answers. Body: { answers: { [questionId]: { v, c, n } | null } }
  app.patch('/api/assessments/:id/answers', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'assessment:answer');
    const incoming = req.body && req.body.answers;
    if (!incoming || typeof incoming !== 'object') throw new HttpError(400, 'No answers supplied');
    const keys = Object.keys(incoming);
    if (keys.length > 200) throw new HttpError(400, 'Too many answers in one request');

    const config = await services.getActiveConfig();
    const result = await db.transaction(async tx => {
      const a = await tx.get('SELECT * FROM assessments WHERE id = ?', [req.params.id]);
      if (!a || !(await services.canAccessTenant(req.user, a.tenant_id))) throw new HttpError(404, 'Assessment not found');
      const editable = OPEN_STATUSES.includes(a.status) || (STAFF_ROLES.includes(req.user.role) && a.status === 'in_review');
      if (!editable) throw new HttpError(409, 'This assessment is locked for review. Ask your assessor to return it if changes are needed.');

      const data = content.getFrameworkData(a.framework_id, config.questionOverrides);
      const items = Scoring.buildItems(a.framework_id, data, config);
      const index = items.reduce((acc, it) => { acc[it.id] = it; return acc; }, {});
      const allowed = await services.allowedModulesFor(req.user, a.id);
      const canValidate = can(req.user, 'evidence:validate');
      const answers = services.parseJson(a.answers_json, {});
      const now = new Date().toISOString();
      const touchedModules = new Set();

      for (const qid of keys) {
        const item = index[qid];
        if (!item) throw new HttpError(400, `Unknown question ${qid}`);
        if (allowed && !allowed.includes(item.moduleId)) throw new HttpError(403, 'You can only answer sections assigned to you');
        const rec = incoming[qid];
        touchedModules.add(item.moduleId);
        if (rec === null) { delete answers[qid]; continue; }
        const v = rec.v;
        const validState = Object.values(Scoring.ANSWER_STATES).includes(v);
        const validOption = typeof v === 'number' && item.options.some(o => Number(o.value) === v);
        if (!validState && !validOption) throw new HttpError(400, `Invalid answer for ${qid}`);
        let c = rec.c || (answers[qid] && answers[qid].c) || 'self-attested';
        if (!Scoring.CONFIDENCE_LEVELS[c]) throw new HttpError(400, 'Invalid confidence level');
        if ((c === 'assessor-validated' || c === 'externally-verified') && !canValidate) {
          const previous = answers[qid] && answers[qid].c;
          if (previous !== c) throw new HttpError(403, 'Only an assessor can record assessor-validated or externally verified confidence');
        }
        answers[qid] = { v, c, n: rec.n !== undefined ? String(rec.n).slice(0, 2000) : (answers[qid] && answers[qid].n) || '', by: req.user.id, at: now };
      }

      await tx.run('UPDATE assessments SET answers_json = ?, updated_at = ? WHERE id = ?', [JSON.stringify(answers), now, a.id]);
      // Move untouched sections to "in progress" when work starts on them.
      for (const m of touchedModules) {
        await tx.run("UPDATE assessment_sections SET status = 'in_progress', updated_at = ? WHERE assessment_id = ? AND module_id = ? AND status = 'not_started'", [now, a.id, m]);
      }
      return { savedAt: now, tenantId: a.tenant_id, frameworkId: a.framework_id };
    });

    const a = await db.get('SELECT * FROM assessments WHERE id = ?', [req.params.id]);
    const scored = await services.scoreAssessmentRow(a, config);
    res.json({ savedAt: result.savedAt, progress: scored.overall.completion });
  }));

  app.put('/api/assessments/:id/sections/:moduleId', auth, asyncHandler(async (req, res) => {
    const a = await services.loadAssessment(req.user, req.params.id);
    const section = await db.get('SELECT * FROM assessment_sections WHERE assessment_id = ? AND module_id = ?', [a.id, req.params.moduleId]);
    if (!section) throw new HttpError(404, 'Section not found');
    const changes = {};
    if (req.body.ownerUserId !== undefined) {
      services.assertCan(req.user, 'assessment:assign');
      if (req.body.ownerUserId === null) changes.owner_user_id = null;
      else {
        const u = await db.get('SELECT id FROM users WHERE id = ? AND tenant_id = ? AND status = ?', [req.body.ownerUserId, a.tenant_id, 'active']);
        if (!u) throw new HttpError(400, 'Owner must be an active user in this organisation');
        changes.owner_user_id = u.id;
      }
    }
    if (req.body.status !== undefined) {
      if (!SECTION_STATUSES.includes(req.body.status)) throw new HttpError(400, 'Invalid section status');
      const isOwner = section.owner_user_id === req.user.id;
      if (!isOwner && !can(req.user, 'assessment:assign')) throw new HttpError(403, 'Only the section owner can change its status');
      changes.status = req.body.status;
    }
    const keys = Object.keys(changes);
    if (keys.length) {
      await db.run(`UPDATE assessment_sections SET ${keys.map(k => `${k} = ?`).join(', ')}, updated_at = ? WHERE assessment_id = ? AND module_id = ?`,
        [...keys.map(k => changes[k]), new Date().toISOString(), a.id, section.module_id]);
      await services.audit(req, 'SECTION_UPDATED', { tenantId: a.tenant_id, target: `assessment:${a.id}`, details: { moduleId: section.module_id, ...changes } });
      if (changes.status === 'complete') await services.event(req, 'section_completed', { tenantId: a.tenant_id, frameworkId: a.framework_id, assessmentId: a.id, meta: { moduleId: section.module_id } });
    }
    res.json({ sections: await services.sectionsFor(a.id) });
  }));

  // Submit for review (or for self-issue). Mandatory evidence is enforced.
  app.post('/api/assessments/:id/submit', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'assessment:submit');
    const a = await services.loadAssessment(req.user, req.params.id);
    if (!OPEN_STATUSES.includes(a.status)) throw new HttpError(409, 'This assessment has already been submitted');
    const result = await services.scoreAssessmentRow(a);
    if (result.overall.completion.answered < result.overall.completion.applicable) {
      throw new HttpError(409, `${result.overall.completion.applicable - result.overall.completion.answered} applicable questions are unanswered. Answer them, or mark them Unknown or Not applicable, before submitting.`, { code: 'INCOMPLETE' });
    }
    if (result.missingEvidence.length) {
      throw new HttpError(409, `${result.missingEvidence.length} controls require supporting evidence before submission.`, { code: 'EVIDENCE_REQUIRED', items: result.missingEvidence });
    }
    const now = new Date().toISOString();
    await db.run("UPDATE assessments SET status = 'submitted', submitted_at = ?, updated_at = ? WHERE id = ?", [now, now, a.id]);
    await db.run("UPDATE assessment_sections SET status = 'complete', updated_at = ? WHERE assessment_id = ?", [now, a.id]);
    await services.audit(req, 'ASSESSMENT_SUBMITTED', { tenantId: a.tenant_id, target: `assessment:${a.id}` });
    await services.event(req, 'assessment_submitted', { tenantId: a.tenant_id, frameworkId: a.framework_id, assessmentId: a.id });
    res.json({ assessment: await summarise(await db.get('SELECT * FROM assessments WHERE id = ?', [a.id])) });
  }));

  // Assessor workflow
  app.post('/api/assessments/:id/review', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'assessment:review');
    const a = await services.loadAssessment(req.user, req.params.id);
    const action = req.body.action;
    const notes = req.body.notes !== undefined ? String(req.body.notes).slice(0, 4000) : a.review_notes;
    const transitions = {
      start: { from: ['submitted'], to: 'in_review' },
      request_evidence: { from: ['submitted', 'in_review'], to: 'evidence_requested' },
      return: { from: ['submitted', 'in_review', 'evidence_requested'], to: 'in_progress' }
    };
    const t = transitions[action];
    if (!t) throw new HttpError(400, 'Unknown review action');
    if (!t.from.includes(a.status)) throw new HttpError(409, `Cannot ${action.replace('_', ' ')} an assessment that is ${STATUS_LABELS[a.status].toLowerCase()}`);
    const assessorId = a.assessor_id || req.user.id;
    await db.run('UPDATE assessments SET status = ?, review_notes = ?, assessor_id = ?, updated_at = ? WHERE id = ?', [t.to, notes, assessorId, new Date().toISOString(), a.id]);
    await services.audit(req, 'ASSESSMENT_REVIEW', { tenantId: a.tenant_id, target: `assessment:${a.id}`, details: { action, to: t.to } });
    res.json({ assessment: await summarise(await db.get('SELECT * FROM assessments WHERE id = ?', [a.id])) });
  }));

  // Issue an immutable report.
  app.post('/api/assessments/:id/reports', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'report:issue');
    const a = await services.loadAssessment(req.user, req.params.id);
    const tenant = await db.get('SELECT package FROM tenants WHERE id = ?', [a.tenant_id]);
    const staff = STAFF_ROLES.includes(req.user.role);
    if (staff) {
      if (!['submitted', 'in_review'].includes(a.status)) throw new HttpError(409, 'Reports are issued after the assessment has been submitted');
    } else {
      // Customers may self-issue on the Snapshot package; assessor-led packages are issued by the assessor.
      if (tenant.package !== 'snapshot') throw new HttpError(403, 'Your assessor issues the report for this engagement');
      if (a.status !== 'submitted') throw new HttpError(409, 'Submit the assessment before issuing a report');
    }
    const reviewType = staff ? 'Assessor reviewed' : 'Self-assessed';
    const report = await issueReport(db, services, { assessment: a, user: req.user, reviewType });
    const now = new Date().toISOString();
    await db.run("UPDATE assessments SET status = 'completed', completed_at = ?, updated_at = ? WHERE id = ?", [now, now, a.id]);
    await services.audit(req, 'REPORT_ISSUED', { tenantId: a.tenant_id, target: `report:${report.id}`, details: { assessmentId: a.id, version: report.version, hash: report.contentHash } });
    await services.event(req, 'report_issued', { tenantId: a.tenant_id, frameworkId: a.framework_id, assessmentId: a.id });
    res.status(201).json({ reportId: report.id, version: report.version });
  }));

  app.delete('/api/assessments/:id', auth, asyncHandler(async (req, res) => {
    const a = await services.loadAssessment(req.user, req.params.id);
    if (![ROLES.PLATFORM_ADMIN, ROLES.CUSTOMER_ADMIN].includes(req.user.role)) throw new HttpError(403, 'You do not have permission to archive assessments');
    await db.run("UPDATE assessments SET status = 'archived', updated_at = ? WHERE id = ?", [new Date().toISOString(), a.id]);
    await services.audit(req, 'ASSESSMENT_ARCHIVED', { tenantId: a.tenant_id, target: `assessment:${a.id}` });
    res.json({ ok: true });
  }));
};

module.exports.STATUS_LABELS = STATUS_LABELS;
