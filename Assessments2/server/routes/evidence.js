// Evidence: attach files, links, policy references and notes to controls.
// Files are encrypted at rest and only downloadable by authorised users.

module.exports = function evidenceRoutes(app, ctx) {
  const { db, services, security, asyncHandler, evidenceStore } = ctx;
  const { HttpError, ROLES, can } = security;
  const auth = ctx.requireAuth;
  const KINDS = ['file', 'link', 'policy', 'note'];

  function present(e, users) {
    const u = users[e.uploaded_by];
    return {
      id: e.id, questionId: e.question_id, kind: e.kind, filename: e.filename, mimeType: e.mime_type, sizeBytes: e.size_bytes,
      sha256: e.sha256, urlReference: e.url_reference, policyReference: e.policy_reference, notes: e.notes,
      uploadedBy: u ? (u.name || u.email) : null, createdAt: e.created_at
    };
  }

  async function userMap(rows) {
    const ids = [...new Set(rows.map(r => r.uploaded_by).filter(Boolean))];
    if (!ids.length) return {};
    const users = await db.all(`SELECT id, name, email FROM users WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
    return users.reduce((acc, u) => { acc[u.id] = u; return acc; }, {});
  }

  app.get('/api/assessments/:id/evidence', auth, asyncHandler(async (req, res) => {
    const a = await services.loadAssessment(req.user, req.params.id);
    const params = [a.id];
    let sql = 'SELECT * FROM evidence WHERE assessment_id = ? AND deleted_at IS NULL';
    if (req.query.questionId) { sql += ' AND question_id = ?'; params.push(String(req.query.questionId)); }
    const rows = await db.all(`${sql} ORDER BY created_at DESC`, params);
    const users = await userMap(rows);
    res.json({ evidence: rows.map(r => present(r, users)) });
  }));

  app.post('/api/assessments/:id/evidence', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'assessment:answer');
    const a = await services.loadAssessment(req.user, req.params.id);
    if (['completed', 'archived'].includes(a.status)) throw new HttpError(409, 'Evidence cannot be added to a completed assessment');
    const b = req.body || {};
    const questionId = String(b.questionId || '');
    const kind = b.kind;
    if (!KINDS.includes(kind)) throw new HttpError(400, 'Unknown evidence type');

    const config = await services.getActiveConfig();
    const Scoring = require('../../js/engine/scoring.js');
    const content = require('../content');
    const items = Scoring.buildItems(a.framework_id, content.getFrameworkData(a.framework_id, config.questionOverrides), config);
    const item = items.find(i => i.id === questionId);
    if (!item) throw new HttpError(400, 'Unknown question');
    const allowed = await services.allowedModulesFor(req.user, a.id);
    if (allowed && !allowed.includes(item.moduleId)) throw new HttpError(403, 'You can only add evidence to sections assigned to you');

    const record = { filename: null, mime: null, size: null, sha256: null, storageKey: null, url: null, policy: null, notes: null };
    if (kind === 'file') {
      const filename = String(b.filename || '').replace(/[\\/\r\n"]/g, '_').slice(0, 200);
      const mime = String(b.mimeType || '');
      const buffer = Buffer.from(String(b.dataBase64 || ''), 'base64');
      const problem = evidenceStore.validate({ mime, buffer, filename });
      if (problem) throw new HttpError(400, problem);
      const saved = await evidenceStore.save(a.tenant_id, buffer);
      Object.assign(record, { filename, mime, size: buffer.length, sha256: saved.sha256, storageKey: saved.storageKey });
    } else if (kind === 'link') {
      const url = String(b.urlReference || '').trim();
      if (!/^https?:\/\/[^\s]{3,2000}$/i.test(url)) throw new HttpError(400, 'Enter a valid http(s) link');
      record.url = url;
    } else if (kind === 'policy') {
      const ref = String(b.policyReference || '').trim();
      if (!ref) throw new HttpError(400, 'Enter a policy or document reference');
      record.policy = ref.slice(0, 300);
    }
    record.notes = b.notes ? String(b.notes).slice(0, 4000) : null;
    if (kind === 'note' && !record.notes) throw new HttpError(400, 'Enter a note');

    const r = await db.run(`INSERT INTO evidence (tenant_id, assessment_id, question_id, kind, filename, mime_type, size_bytes, sha256, storage_key, url_reference, policy_reference, notes, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [a.tenant_id, a.id, questionId, kind, record.filename, record.mime, record.size, record.sha256, record.storageKey, record.url, record.policy, record.notes, req.user.id]);
    await services.audit(req, 'EVIDENCE_ADDED', { tenantId: a.tenant_id, target: `evidence:${r.lastID}`, details: { assessmentId: a.id, questionId, kind, filename: record.filename, sha256: record.sha256 } });
    const row = await db.get('SELECT * FROM evidence WHERE id = ?', [r.lastID]);
    res.status(201).json({ evidence: present(row, await userMap([row])) });
  }));

  app.get('/api/evidence/:id/download', auth, asyncHandler(async (req, res) => {
    const e = await db.get('SELECT * FROM evidence WHERE id = ? AND deleted_at IS NULL', [req.params.id]);
    if (!e || !e.storage_key || !(await services.canAccessTenant(req.user, e.tenant_id))) throw new HttpError(404, 'Evidence not found');
    const buffer = await evidenceStore.read(e.storage_key);
    await services.audit(req, 'EVIDENCE_ACCESSED', { tenantId: e.tenant_id, target: `evidence:${e.id}`, details: { filename: e.filename } });
    res.setHeader('Content-Type', e.mime_type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(e.filename || 'evidence')}"; filename*=UTF-8''${encodeURIComponent(e.filename || 'evidence')}`);
    res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
    res.send(buffer);
  }));

  app.delete('/api/evidence/:id', auth, asyncHandler(async (req, res) => {
    const e = await db.get('SELECT * FROM evidence WHERE id = ? AND deleted_at IS NULL', [req.params.id]);
    if (!e || !(await services.canAccessTenant(req.user, e.tenant_id))) throw new HttpError(404, 'Evidence not found');
    const a = await db.get('SELECT status FROM assessments WHERE id = ?', [e.assessment_id]);
    if (['completed', 'archived'].includes(a.status)) throw new HttpError(409, 'Evidence on a completed assessment is retained with the report');
    const isUploader = e.uploaded_by === req.user.id;
    if (!isUploader && !(can(req.user, 'assessment:assign') || req.user.role === ROLES.PLATFORM_ADMIN)) {
      throw new HttpError(403, 'Only the uploader or an administrator can remove evidence');
    }
    await db.run('UPDATE evidence SET deleted_at = ?, deleted_by = ? WHERE id = ?', [new Date().toISOString(), req.user.id, e.id]);
    if (e.storage_key) await evidenceStore.remove(e.storage_key);
    await services.audit(req, 'EVIDENCE_REMOVED', { tenantId: e.tenant_id, target: `evidence:${e.id}`, details: { filename: e.filename, questionId: e.question_id } });
    res.json({ ok: true });
  }));
};
