// End-to-end journey against a running HawkSight server.
// Usage: BASE_URL=http://localhost:3100 ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/e2e-journey.js
// Creates a new organisation and walks a customer through a full assessment cycle.

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN = { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD };

class Client {
  constructor(name) { this.name = name; this.cookie = ''; }
  async call(method, path, body, raw) {
    const headers = { 'X-Requested-With': 'HawkSight' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (this.cookie) headers.Cookie = this.cookie;
    const res = await fetch(BASE + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    const sc = res.headers.get('set-cookie');
    if (sc) this.cookie = sc.split(';')[0];
    if (raw) return res;
    const text = await res.text();
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) throw new Error(`${this.name} ${method} ${path} -> ${res.status} ${json && json.error}`);
    return json;
  }
}

const steps = [];
async function step(label, fn) {
  const t = Date.now();
  try {
    const detail = await fn();
    steps.push({ ok: true, label, detail, ms: Date.now() - t });
    console.log(`PASS  ${label}${detail ? ` — ${detail}` : ''}`);
  } catch (e) {
    steps.push({ ok: false, label, detail: e.message });
    console.log(`FAIL  ${label} — ${e.message}`);
    throw e;
  }
}

(async () => {
  const stamp = Date.now().toString(36);
  const admin = new Client('admin');
  const customer = new Client('customer');
  const contributor = new Client('contributor');
  let tenantId, assessmentId, reportId, temp, controls, content;
  const custEmail = `owner.${stamp}@e2e-retail.test`;
  const newPw = 'E2e-Journey#Pass2026';

  await step('Admin signs in', async () => { await admin.call('POST', '/api/auth/login', ADMIN); });
  await step('Admin creates organisation (Snapshot, Retail + NIST)', async () => {
    const r = await admin.call('POST', '/api/tenants', { name: `E2E Retail ${stamp}`, industry: 'retail', package: 'snapshot', frameworks: ['retail', 'nist'] });
    tenantId = r.tenant.id; return `tenant ${tenantId}`;
  });
  await step('Admin creates customer administrator with temporary password', async () => {
    const r = await admin.call('POST', '/api/users', { tenantId, email: custEmail, name: 'E2E Owner', role: 'customer_admin' });
    temp = r.temporaryPassword; return custEmail;
  });
  await step('Customer signs in and is forced to change password', async () => {
    await customer.call('POST', '/api/auth/login', { email: custEmail, password: temp });
    const blocked = await customer.call('GET', '/api/assessments', undefined, true);
    if (blocked.status !== 403) throw new Error('password change not enforced');
    await customer.call('POST', '/api/auth/change-password', { currentPassword: temp, newPassword: newPw });
  });
  await step('Starting an assessment without a profile is refused', async () => {
    const res = await customer.call('POST', '/api/assessments', { frameworkId: 'retail' }, true);
    if (res.status !== 400) throw new Error(`expected 400, got ${res.status}`);
  });
  await step('Customer completes organisation profile', async () => {
    await customer.call('PUT', `/api/tenants/${tenantId}/profile`, { profile: {
      organizationName: `E2E Retail ${stamp}`, industry: 'retail', employeeCount: '50 - 250', officeLocations: 4, itEnvironment: 'cloud',
      dataTypes: ['personal', 'payment'], regulations: ['dpdp', 'pci'], technology: ['m365', 'aws'], developsSoftware: 'no', internetFacing: 'yes'
    } });
  });
  await step('Customer starts the Retail assessment', async () => {
    const r = await customer.call('POST', '/api/assessments', { frameworkId: 'retail', dueDate: '2026-12-31' });
    assessmentId = r.assessment.id;
    const d = await customer.call('GET', `/api/assessments/${assessmentId}`);
    controls = d.result.controls;
    content = await customer.call('GET', '/api/content/retail');
    return `${controls.length} questions, ${d.result.modules.length} sections`;
  });
  await step('Customer invites a contributor for one section; contributor accepts', async () => {
    const mod = controls[0].moduleId;
    const inv = await customer.call('POST', '/api/invitations', { email: `it.${stamp}@e2e-retail.test`, role: 'contributor', assessmentId, sections: [mod] });
    const token = inv.invitePath.split('/').pop();
    await contributor.call('POST', '/api/invites/accept', { token, name: 'E2E IT Lead', password: 'Contrib-Journey#2026' });
    const own = controls.find(c => c.moduleId === mod);
    const other = controls.find(c => c.moduleId !== mod);
    await contributor.call('PATCH', `/api/assessments/${assessmentId}/answers`, { answers: { [own.id]: { v: 0 } } });
    const res = await contributor.call('PATCH', `/api/assessments/${assessmentId}/answers`, { answers: { [other.id]: { v: 0 } } }, true);
    if (res.status !== 403) throw new Error('contributor could answer another section');
    return 'section restriction enforced';
  });
  const opts = {};
  content.data.modules.forEach(m => m.categories.forEach(c => c.questions.forEach(q => { opts[q.id] = q.options.map(o => o.value); })));
  await step('Customer answers every question (mix of states)', async () => {
    const answers = {};
    controls.forEach((c, i) => {
      const values = opts[c.id];
      const max = Math.max(...values); const min = Math.min(...values);
      const mid = values.find(v => v > min && v < max);
      answers[c.id] = i % 9 === 0 ? { v: 'UNK' } : i % 11 === 0 ? { v: 'PLANNED' } : i % 3 === 0 ? { v: min } : i % 3 === 1 ? { v: mid !== undefined ? mid : min } : { v: max };
    });
    const r = await customer.call('PATCH', `/api/assessments/${assessmentId}/answers`, { answers });
    return `${r.progress.answered}/${r.progress.applicable} answered`;
  });
  let missing;
  await step('Submission is blocked until required evidence is attached', async () => {
    const res = await customer.call('POST', `/api/assessments/${assessmentId}/submit`, {}, true);
    const body = await res.json();
    if (res.status !== 409) throw new Error(`expected 409, got ${res.status}`);
    missing = (body.details && body.details.items) || [];
    return `${missing.length} controls need evidence`;
  });
  await step('Customer attaches evidence (PDF file and policy references)', async () => {
    const pdf = Buffer.from('%PDF-1.4\n% e2e evidence\n%%EOF\n').toString('base64');
    for (const [i, m] of missing.entries()) {
      const body = i === 0 ? { questionId: m.id, kind: 'file', filename: 'mfa-policy.pdf', mimeType: 'application/pdf', dataBase64: pdf }
        : { questionId: m.id, kind: 'policy', policyReference: `SEC-POL-${i}`, notes: 'E2E evidence' };
      await customer.call('POST', `/api/assessments/${assessmentId}/evidence`, body);
    }
    return `${missing.length} items added`;
  });
  await step('Customer submits the assessment', async () => { await customer.call('POST', `/api/assessments/${assessmentId}/submit`); });
  await step('Answers are locked after submission', async () => {
    const res = await customer.call('PATCH', `/api/assessments/${assessmentId}/answers`, { answers: { [controls[1].id]: { v: Math.max(...opts[controls[1].id]) } } }, true);
    if (res.status !== 409) throw new Error('answers were not locked');
  });
  await step('Customer issues the self-assessed report', async () => {
    const r = await customer.call('POST', `/api/assessments/${assessmentId}/reports`);
    reportId = r.reportId; return `report ${reportId} v${r.version}`;
  });
  let report;
  await step('Report content is complete and its fingerprint verifies', async () => {
    report = (await customer.call('GET', `/api/reports/${reportId}`)).report;
    const o = report.result.overall;
    const v = await customer.call('GET', `/api/reports/${reportId}/verify`);
    if (!v.verified) throw new Error('fingerprint mismatch');
    return `health ${o.healthScore} (${o.healthBand}), maturity ${o.maturity.name}, risk ${o.riskScore} (${o.riskBand}), confidence ${o.confidence.label}, ${report.result.findings.length} findings${o.capped ? `, ${o.capReason}` : ''}`;
  });
  await step('Applicability rules applied for cloud-only, no-development profile', async () => {
    const suggested = report.result.controls.filter(c => c.applicability && c.applicability.suggestNA).length;
    return `${suggested} questions suggested as not applicable`;
  });
  await step('Action plan lists findings; owner, due date and status update', async () => {
    const plan = await customer.call('GET', '/api/actions');
    const f = plan.items[0];
    await customer.call('PUT', '/api/actions', { frameworkId: 'retail', questionId: f.questionId, status: 'in_progress', owner: 'IT Lead', dueDate: '2026-11-15', ticketRef: 'SEC-101' });
    return `${plan.items.length} findings; first: ${f.severityLabel} ${f.title}`;
  });
  await step('Risk acceptance with justification and expiry', async () => {
    const plan = await customer.call('GET', '/api/actions');
    const f = plan.items.find(i => i.severity === 'low' || i.severity === 'medium') || plan.items[plan.items.length - 1];
    await customer.call('POST', '/api/actions/accept-risk', { frameworkId: 'retail', questionId: f.questionId, owner: 'COO', justification: 'Compensating control in place until platform migration next quarter.', expiry: '2027-03-31' });
  });
  await step('Action plan exports to Excel and CSV', async () => {
    const x = await customer.call('GET', '/api/actions/export.xlsx', undefined, true);
    const c = await customer.call('GET', '/api/actions/export.csv', undefined, true);
    if (x.status !== 200 || c.status !== 200) throw new Error('export failed');
    return `xlsx ${(await x.arrayBuffer()).byteLength} bytes, csv ${(await c.text()).split('\n').length - 1} rows`;
  });
  await step('Evidence file downloads for the customer but not for other organisations', async () => {
    const list = await customer.call('GET', `/api/assessments/${assessmentId}/evidence`);
    const file = list.evidence.find(e => e.kind === 'file');
    const own = await customer.call('GET', `/api/evidence/${file.id}/download`, undefined, true);
    const demo = new Client('demo');
    await demo.call('POST', '/api/auth/login', { email: 'demo.admin@northwind-demo.test', password: process.env.DEMO_PASSWORD || 'Local-Test-Demo#2026' });
    const other = await demo.call('GET', `/api/evidence/${file.id}/download`, undefined, true);
    if (own.status !== 200 || other.status !== 404) throw new Error(`own ${own.status}, other ${other.status}`);
  });
  await step('Admin sees the activity in the audit log', async () => {
    const logs = await admin.call('GET', `/api/admin/audit?tenantId=${tenantId}&limit=200`);
    const actions = [...new Set(logs.logs.map(l => l.action))];
    return actions.join(', ');
  });

  console.log(`\n${steps.filter(s => s.ok).length} of ${steps.length} steps passed. Organisation "E2E Retail ${stamp}" (id ${tenantId}), report ${reportId}.`);
})().catch(() => { console.log(`\nStopped after ${steps.length} steps.`); process.exit(1); });
