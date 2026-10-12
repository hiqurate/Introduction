// HawkSight API — authorisation, tenant isolation and security tests.
// Starts a real server against a temporary database and exercises the API
// as different roles and organisations.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createApp } = require('../server/app');

const ADMIN = { email: 'platform@hawksight.test', password: 'Platf0rm!Admin#2026' };
let server;
let baseUrl;
let app;
let tmpDir;

class Client {
  constructor() { this.cookie = ''; }
  async request(method, url, body, { csrf = true, raw = false } = {}) {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (csrf) headers['X-Requested-With'] = 'HawkSight';
    if (this.cookie) headers.Cookie = this.cookie;
    const res = await fetch(baseUrl + url, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined, redirect: 'manual' });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) this.cookie = setCookie.split(';')[0];
    if (raw) return res;
    const text = await res.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch { json = null; }
    return { status: res.status, body: json, headers: res.headers };
  }
  get(url, opts) { return this.request('GET', url, undefined, opts); }
  post(url, body, opts) { return this.request('POST', url, body || {}, opts); }
  put(url, body, opts) { return this.request('PUT', url, body || {}, opts); }
  patch(url, body, opts) { return this.request('PATCH', url, body || {}, opts); }
  del(url, body, opts) { return this.request('DELETE', url, body || {}, opts); }
  async login(email, password) {
    const r = await this.post('/api/auth/login', { email, password });
    assert.equal(r.status, 200, `login ${email}: ${JSON.stringify(r.body)}`);
    return r.body;
  }
}

const NEW_PASSWORD = 'Cust0mer!Secure#2026';

async function createCustomer(admin, tenantId, email, role) {
  const r = await admin.post('/api/users', { email, name: email.split('@')[0], role, tenantId });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  const c = new Client();
  await c.login(email, r.body.temporaryPassword);
  const blocked = await c.get('/api/assessments');
  assert.equal(blocked.status, 403, 'password change is enforced before other access');
  assert.equal(blocked.body.code, 'PASSWORD_CHANGE_REQUIRED');
  const changed = await c.post('/api/auth/change-password', { currentPassword: r.body.temporaryPassword, newPassword: NEW_PASSWORD });
  assert.equal(changed.status, 200, JSON.stringify(changed.body));
  return { client: c, id: r.body.user.id };
}

const ctx = {};

test.before(async () => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hawksight-test-'));
  app = await createApp({
    storageDir: tmpDir, production: false, adminEmail: ADMIN.email, adminPassword: ADMIN.password,
    seedDemo: false, log: false, sessionSecret: 'test-secret-test-secret-test-secret-123'
  });
  await new Promise(resolve => { server = app.listen(0, resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  ctx.admin = new Client();
  await ctx.admin.login(ADMIN.email, ADMIN.password);
  const a = await ctx.admin.post('/api/tenants', { name: 'Alpha Clinics', industry: 'healthcare', package: 'snapshot', frameworks: ['healthcare', 'nist'] });
  const b = await ctx.admin.post('/api/tenants', { name: 'Beta Retail', industry: 'retail', package: 'snapshot', frameworks: ['retail', 'healthcare'] });
  ctx.tenantA = a.body.tenant.id;
  ctx.tenantB = b.body.tenant.id;
  ctx.alphaAdmin = await createCustomer(ctx.admin, ctx.tenantA, 'admin@alpha.test', 'customer_admin');
  ctx.alphaContributor = await createCustomer(ctx.admin, ctx.tenantA, 'it@alpha.test', 'contributor');
  ctx.alphaReader = await createCustomer(ctx.admin, ctx.tenantA, 'board@alpha.test', 'read_only');
  ctx.betaAdmin = await createCustomer(ctx.admin, ctx.tenantB, 'admin@beta.test', 'customer_admin');

  const profile = { organizationName: 'Alpha Clinics', industry: 'healthcare', employeeCount: '50 - 250', officeLocations: 2, itEnvironment: 'hybrid' };
  const p = await ctx.alphaAdmin.client.put(`/api/tenants/${ctx.tenantA}/profile`, { profile });
  assert.equal(p.status, 200, JSON.stringify(p.body));
  const created = await ctx.alphaAdmin.client.post('/api/assessments', { frameworkId: 'healthcare' });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  ctx.assessmentA = created.body.assessment.id;
  const detail = await ctx.alphaAdmin.client.get(`/api/assessments/${ctx.assessmentA}`);
  ctx.controlsA = detail.body.result.controls;
});

test.after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  if (app) await app.locals.db.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('sensitive files are never served and question content requires sign-in', async () => {
  const anon = new Client();
  for (const p of ['/database.sqlite', '/server.js', '/package.json', '/storage/hawksight.sqlite', '/server/app.js', '/.env', '/tests/api.test.js', '/node_modules/express/package.json']) {
    const r = await anon.get(p);
    assert.equal(r.status, 404, p);
  }
  assert.equal((await anon.get('/data/nist.js')).status, 404);
  assert.equal((await ctx.alphaAdmin.client.get('/data/nist.js')).status, 404);
  assert.equal((await anon.get('/api/content/nist')).status, 401);
  assert.equal((await ctx.alphaAdmin.client.get('/api/content/nist')).status, 200, 'entitled template');
  assert.equal((await ctx.alphaAdmin.client.get('/api/content/retail')).status, 404, 'non-entitled template');
  assert.equal((await anon.get('/js/engine/scoring.js')).status, 200);
});

test('security headers are set', async () => {
  const r = await new Client().get('/');
  assert.match(r.headers.get('content-security-policy'), /script-src 'self'/);
  assert.equal(r.headers.get('x-frame-options'), 'DENY');
  assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
  const api = await new Client().get('/api/health');
  assert.equal(api.headers.get('cache-control'), 'no-store');
});

test('unauthenticated API access is rejected', async () => {
  const anon = new Client();
  for (const p of ['/api/assessments', '/api/reports', '/api/tenants', `/api/assessments/${ctx.assessmentA}`, '/api/admin/audit']) {
    assert.equal((await anon.get(p)).status, 401, p);
  }
});

test('state-changing requests without the client header are rejected (CSRF)', async () => {
  const r = await ctx.alphaAdmin.client.patch(`/api/assessments/${ctx.assessmentA}/answers`, { answers: {} }, { csrf: false });
  assert.equal(r.status, 403);
  const cross = await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST', headers: { 'X-Requested-With': 'HawkSight', Origin: 'https://evil.example', Cookie: ctx.alphaAdmin.client.cookie } });
  assert.equal(cross.status, 403);
});

test('repeated failed sign-ins lock the account', async () => {
  const c = new Client();
  for (let i = 0; i < 5; i++) assert.equal((await c.post('/api/auth/login', { email: 'board@alpha.test', password: 'wrong-password' })).status, 401);
  const locked = await c.post('/api/auth/login', { email: 'board@alpha.test', password: NEW_PASSWORD });
  assert.equal(locked.status, 423);
  const unlock = await ctx.admin.patch(`/api/users/${ctx.alphaReader.id}`, { unlock: true });
  assert.equal(unlock.status, 200);
  await c.login('board@alpha.test', NEW_PASSWORD);
  ctx.alphaReader.client = c;
});

test('weak passwords are rejected', async () => {
  const r = await ctx.alphaAdmin.client.post('/api/auth/change-password', { currentPassword: NEW_PASSWORD, newPassword: 'password' });
  assert.equal(r.status, 400);
});

test('cross-tenant access is denied for every resource type', async () => {
  const beta = ctx.betaAdmin.client;
  assert.equal((await beta.get(`/api/assessments/${ctx.assessmentA}`)).status, 404);
  const q = ctx.controlsA[0].id;
  assert.equal((await beta.patch(`/api/assessments/${ctx.assessmentA}/answers`, { answers: { [q]: { v: 0 } } })).status, 404);
  assert.equal((await beta.get(`/api/tenants/${ctx.tenantA}`)).status, 404);
  assert.equal((await beta.get(`/api/tenants/${ctx.tenantA}/profile`)).status, 404);
  assert.equal((await beta.put(`/api/tenants/${ctx.tenantA}/profile`, { profile: { organizationName: 'x', industry: 'x', employeeCount: '< 50' } })).status, 404);
  assert.equal((await beta.get(`/api/assessments?tenantId=${ctx.tenantA}`)).status, 404);
  assert.equal((await beta.get(`/api/actions?tenantId=${ctx.tenantA}`)).status, 404);
  assert.equal((await beta.get(`/api/assessments/${ctx.assessmentA}/evidence`)).status, 404);
  assert.equal((await beta.post(`/api/assessments/${ctx.assessmentA}/evidence`, { questionId: q, kind: 'note', notes: 'x' })).status, 404);
  assert.equal((await beta.post('/api/assessments', { tenantId: ctx.tenantA, frameworkId: 'nist' })).status, 403, 'tenantId in the body is ignored for customers; Beta is not entitled to NIST');
  const list = await beta.get('/api/assessments');
  assert.ok(list.body.assessments.every(a => a.tenantId === ctx.tenantB));
  const users = await beta.get('/api/users');
  assert.ok(users.body.users.every(u => u.tenantId === ctx.tenantB));
  assert.equal((await beta.patch(`/api/users/${ctx.alphaContributor.id}`, { role: 'read_only' })).status, 404);
  assert.equal((await beta.del(`/api/users/${ctx.alphaContributor.id}`)).status, 404);
});

test('customers cannot use administration endpoints or assign staff roles', async () => {
  const c = ctx.alphaAdmin.client;
  for (const p of ['/api/admin/audit', '/api/admin/config', '/api/admin/analytics']) assert.equal((await c.get(p)).status, 403, p);
  assert.equal((await c.post('/api/admin/config', { config: {}, note: 'x' })).status, 403);
  assert.equal((await c.post('/api/tenants', { name: 'x' })).status, 403);
  assert.equal((await c.post('/api/users', { email: 'x@alpha.test', role: 'platform_admin' })).status, 400);
  assert.equal((await c.patch(`/api/tenants/${ctx.tenantA}`, { package: 'managed' })).status, 200);
  const t = await c.get(`/api/tenants/${ctx.tenantA}`);
  assert.equal(t.body.tenant.package, 'snapshot', 'customers cannot change their package');
});

test('the plan sets assessment depth: Snapshot covers each control once', async () => {
  const detail = await ctx.alphaAdmin.client.get(`/api/assessments/${ctx.assessmentA}`);
  assert.equal(detail.body.assessment.scope, 'core');
  const c = detail.body.result.overall.completion;
  assert.ok(c.applicable < detail.body.result.controls.length, 'fewer applicable questions than the full template');
  await ctx.admin.patch(`/api/tenants/${ctx.tenantB}`, { package: 'comprehensive' });
  await ctx.betaAdmin.client.put(`/api/tenants/${ctx.tenantB}/profile`, { profile: { organizationName: 'Beta Retail', industry: 'retail', employeeCount: '< 50' } });
  const created = await ctx.betaAdmin.client.post('/api/assessments', { frameworkId: 'retail' });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  assert.equal(created.body.assessment.scope, 'full');
  assert.equal(created.body.assessment.progress.applicable, 51);
});

test('framework entitlements are enforced', async () => {
  const r = await ctx.alphaAdmin.client.post('/api/assessments', { frameworkId: 'retail' });
  assert.equal(r.status, 403);
});

test('contributors can only answer assigned sections; read-only users cannot answer', async () => {
  const detail = await ctx.alphaAdmin.client.get(`/api/assessments/${ctx.assessmentA}`);
  const modules = [...new Set(detail.body.result.controls.map(c => c.moduleId))];
  const assign = await ctx.alphaAdmin.client.put(`/api/assessments/${ctx.assessmentA}/sections/${modules[0]}`, { ownerUserId: ctx.alphaContributor.id });
  assert.equal(assign.status, 200);
  const inSection = ctx.controlsA.find(c => c.moduleId === modules[0]);
  const outSection = ctx.controlsA.find(c => c.moduleId === modules[1]);
  const contributor = ctx.alphaContributor.client;
  assert.equal((await contributor.patch(`/api/assessments/${ctx.assessmentA}/answers`, { answers: { [inSection.id]: { v: 0 } } })).status, 200);
  assert.equal((await contributor.patch(`/api/assessments/${ctx.assessmentA}/answers`, { answers: { [outSection.id]: { v: 0 } } })).status, 403);
  assert.equal((await contributor.patch(`/api/assessments/${ctx.assessmentA}/answers`, { answers: { [inSection.id]: { v: 0, c: 'assessor-validated' } } })).status, 403, 'customers cannot self-validate');
  assert.equal((await ctx.alphaReader.client.patch(`/api/assessments/${ctx.assessmentA}/answers`, { answers: { [inSection.id]: { v: 0 } } })).status, 403);
  assert.equal((await ctx.alphaAdmin.client.patch(`/api/assessments/${ctx.assessmentA}/answers`, { answers: { [inSection.id]: { v: 999 } } })).status, 400, 'invalid option values are rejected');
});

test('evidence is validated, encrypted at rest and tenant-scoped on download', async () => {
  const c = ctx.alphaAdmin.client;
  const q = ctx.controlsA[0].id;
  const fake = await c.post(`/api/assessments/${ctx.assessmentA}/evidence`, { questionId: q, kind: 'file', filename: 'policy.pdf', mimeType: 'application/pdf', dataBase64: Buffer.from('MZ not a pdf').toString('base64') });
  assert.equal(fake.status, 400, 'content sniffing rejects mismatched files');
  const pdf = Buffer.from('%PDF-1.4\n% HawkSight test evidence\n%%EOF\n');
  const ok = await c.post(`/api/assessments/${ctx.assessmentA}/evidence`, { questionId: q, kind: 'file', filename: 'policy.pdf', mimeType: 'application/pdf', dataBase64: pdf.toString('base64') });
  assert.equal(ok.status, 201, JSON.stringify(ok.body));
  const id = ok.body.evidence.id;
  const row = await app.locals.db.get('SELECT storage_key FROM evidence WHERE id = ?', [id]);
  const onDisk = fs.readFileSync(path.join(tmpDir, 'evidence', row.storage_key));
  assert.ok(!onDisk.includes(Buffer.from('HawkSight test evidence')), 'file is encrypted on disk');
  const down = await c.request('GET', `/api/evidence/${id}/download`, undefined, { raw: true });
  assert.equal(down.status, 200);
  assert.deepEqual(Buffer.from(await down.arrayBuffer()), pdf);
  const other = await ctx.betaAdmin.client.request('GET', `/api/evidence/${id}/download`, undefined, { raw: true });
  assert.equal(other.status, 404);
  const anon = await new Client().request('GET', `/api/evidence/${id}/download`, undefined, { raw: true });
  assert.equal(anon.status, 401);
});

test('submission requires completion; reports are server-computed and immutable', async () => {
  const c = ctx.alphaAdmin.client;
  const early = await c.post(`/api/assessments/${ctx.assessmentA}/submit`);
  assert.equal(early.status, 409);
  assert.equal(early.body.details.code, 'INCOMPLETE');

  // Claim full implementation on one evidence-required control without evidence.
  const required = ctx.controlsA.find(x => x.evidenceRequired && x.state !== 'hidden' && x.id !== ctx.controlsA[0].id);
  const content = require('../server/content');
  const optionValues = id => content.findQuestion('healthcare', id).question.options.map(o => Number(o.value));
  const answers = {};
  ctx.controlsA.forEach(x => { answers[x.id] = { v: Math.min(...optionValues(x.id)) }; });
  answers[required.id] = { v: Math.max(...optionValues(required.id)) };
  const saved = await c.patch(`/api/assessments/${ctx.assessmentA}/answers`, { answers });
  assert.equal(saved.status, 200, JSON.stringify(saved.body));
  const blocked = await c.post(`/api/assessments/${ctx.assessmentA}/submit`);
  assert.equal(blocked.status, 409);
  assert.equal(blocked.body.details.code, 'EVIDENCE_REQUIRED');

  const ev = await c.post(`/api/assessments/${ctx.assessmentA}/evidence`, { questionId: required.id, kind: 'policy', policyReference: 'SEC-POL-07 v2' });
  assert.equal(ev.status, 201);
  const submitted = await c.post(`/api/assessments/${ctx.assessmentA}/submit`);
  assert.equal(submitted.status, 200, JSON.stringify(submitted.body));
  const locked = await ctx.alphaContributor.client.patch(`/api/assessments/${ctx.assessmentA}/answers`, { answers: { [ctx.controlsA[0].id]: { v: 5 } } });
  assert.equal(locked.status, 409, 'submitted assessments are locked');

  const issued = await c.post(`/api/assessments/${ctx.assessmentA}/reports`);
  assert.equal(issued.status, 201, JSON.stringify(issued.body));
  const reportId = issued.body.reportId;
  const report = await c.get(`/api/reports/${reportId}`);
  assert.equal(report.status, 200);
  assert.equal(report.body.report.reviewType, 'Self-assessed');
  assert.ok(report.body.report.frameworkVersion.includes('template'));
  assert.equal((await c.get(`/api/reports/${reportId}/verify`)).body.verified, true);
  await assert.rejects(app.locals.db.run('UPDATE reports SET health_score = 100 WHERE id = ?', [reportId]), /immutable/);
  assert.equal((await ctx.betaAdmin.client.get(`/api/reports/${reportId}`)).status, 404);
  ctx.reportA = reportId;
});

test('risk acceptance requires permission, justification and a bounded expiry', async () => {
  const report = await ctx.alphaAdmin.client.get(`/api/reports/${ctx.reportA}`);
  const finding = report.body.report.result.findings[0];
  const body = { frameworkId: 'healthcare', questionId: finding.id, justification: 'Legacy system pending replacement; compensating monitoring in place.', owner: 'COO', expiry: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) };
  assert.equal((await ctx.alphaContributor.client.post('/api/actions/accept-risk', body)).status, 403);
  assert.equal((await ctx.alphaAdmin.client.post('/api/actions/accept-risk', { ...body, justification: 'short' })).status, 400);
  assert.equal((await ctx.alphaAdmin.client.post('/api/actions/accept-risk', { ...body, expiry: '2099-01-01' })).status, 400);
  assert.equal((await ctx.alphaAdmin.client.post('/api/actions/accept-risk', body)).status, 200);
  assert.equal((await ctx.betaAdmin.client.post('/api/actions/accept-risk', { ...body, tenantId: ctx.tenantA })).status, 404);
  const plan = await ctx.alphaAdmin.client.get('/api/actions');
  assert.equal(plan.body.items.find(i => i.questionId === finding.id).status, 'risk_accepted');
  const upd = await ctx.alphaContributor.client.put('/api/actions', { frameworkId: 'healthcare', questionId: plan.body.items[1].questionId, status: 'in_progress', owner: 'IT' });
  assert.equal(upd.status, 200);
});

test('audit log records security events and cannot be altered', async () => {
  const logs = await ctx.admin.get('/api/admin/audit?limit=500');
  const actions = new Set(logs.body.logs.map(l => l.action));
  ['LOGIN_SUCCESS', 'LOGIN_FAILED', 'ACCOUNT_LOCKED', 'USER_CREATED', 'TENANT_CREATED', 'EVIDENCE_ADDED', 'EVIDENCE_ACCESSED', 'REPORT_ISSUED', 'RISK_ACCEPTED', 'PASSWORD_CHANGED']
    .forEach(a => assert.ok(actions.has(a), `audit has ${a}`));
  await assert.rejects(app.locals.db.run('DELETE FROM audit_logs'), /append-only/);
  await assert.rejects(app.locals.db.run("UPDATE audit_logs SET action = 'X'"), /append-only/);
});

test('scoring configuration is validated and versioned', async () => {
  const bad = await ctx.admin.post('/api/admin/config', { config: { domainWeights: { healthcare: { data_privacy: 50 } } }, note: 'test' });
  assert.equal(bad.status, 400);
  const cfg = await ctx.admin.get('/api/admin/config');
  const mods = cfg.body.modules.healthcare.map(m => m.id);
  const weights = {};
  mods.forEach((m, i) => { weights[m] = i === 0 ? 100 - (mods.length - 1) * 10 : 10; });
  const good = await ctx.admin.post('/api/admin/config', { config: { domainWeights: { healthcare: weights } }, note: 'Weight data privacy higher' });
  assert.equal(good.status, 201, JSON.stringify(good.body));
  const after = await ctx.admin.get('/api/admin/config');
  assert.equal(after.body.config.version, good.body.version);
  assert.ok(after.body.history.length >= 1);
  // Issued reports keep the configuration version they were computed with.
  const report = await ctx.alphaAdmin.client.get(`/api/reports/${ctx.reportA}`);
  assert.notEqual(report.body.report.configVersion, good.body.version);
});

test('template changes need a second reviewer before publication', async () => {
  const draft = await ctx.admin.post('/api/admin/templates/healthcare/versions', { changes: { questions: { 'HC-IN-01': { guidance: 'Clarified guidance text.' } } }, note: 'Clarify remote access guidance' });
  assert.equal(draft.status, 201, JSON.stringify(draft.body));
  assert.equal((await ctx.admin.post(`/api/admin/templates/versions/${draft.body.id}/transition`, { to: 'published' })).status, 409);
  assert.equal((await ctx.admin.post(`/api/admin/templates/versions/${draft.body.id}/transition`, { to: 'in_review' })).status, 200);
  assert.equal((await ctx.admin.post(`/api/admin/templates/versions/${draft.body.id}/transition`, { to: 'approved' })).status, 403, 'authors cannot approve their own change');
});

test('exports are tenant-scoped and neutralise spreadsheet formulas', async () => {
  const plan = await ctx.alphaAdmin.client.get('/api/actions');
  await ctx.alphaAdmin.client.put('/api/actions', { frameworkId: 'healthcare', questionId: plan.body.items[2].questionId, notes: '=HYPERLINK("http://evil")' });
  const res = await ctx.alphaAdmin.client.request('GET', '/api/actions/export.csv', undefined, { raw: true });
  assert.equal(res.status, 200);
  const csv = await res.text();
  assert.ok(csv.includes("'=HYPERLINK"), 'formula is neutralised');
  const other = await ctx.betaAdmin.client.request('GET', `/api/actions/export.csv?tenantId=${ctx.tenantA}`, undefined, { raw: true });
  assert.equal(other.status, 404);
});
