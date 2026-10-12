// ============================================
// HawkSight — First-run bootstrap and demo seeding
// ============================================

const bcrypt = require('bcrypt');
const { ROLES, validatePassword, generateTemporaryPassword } = require('./security');
const demo = require('./demo');
const content = require('./content');
const { issueReport } = require('./reporting');

const BCRYPT_ROUNDS = 12;

async function ensurePlatformAdmin(db, { adminEmail, adminPassword, log }) {
  const existing = await db.get("SELECT id FROM users WHERE role = 'platform_admin' LIMIT 1");
  if (existing) return null;
  const email = (adminEmail || 'admin@hawksight.local').toLowerCase();
  let password = adminPassword;
  let mustChange = 0;
  if (!password || validatePassword(password, email).length) {
    if (password) console.warn('ADMIN_PASSWORD does not meet the password policy; generating a temporary password instead.');
    password = generateTemporaryPassword();
    mustChange = 1;
  }
  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await db.run('INSERT INTO users (tenant_id, email, name, password_hash, role, must_change_password, password_changed_at) VALUES (NULL, ?, ?, ?, ?, ?, ?)',
    [email, 'Platform Administrator', hash, ROLES.PLATFORM_ADMIN, mustChange, new Date().toISOString()]);
  if (log) {
    console.log('\nCreated platform administrator account');
    console.log(`  Email:    ${email}`);
    if (mustChange) console.log(`  Password: ${password}  (temporary — you will be asked to change it at first sign-in)`);
    console.log('');
  }
  return { email, temporaryPassword: mustChange ? password : null };
}

async function seedDemoTenant(db, services, { log } = {}) {
  const existing = await db.all('SELECT id FROM tenants WHERE is_demo = 1');
  for (const t of existing) await db.run('DELETE FROM tenants WHERE id = ?', [t.id]);

  const t = demo.DEMO_TENANT;
  const ins = await db.run(`INSERT INTO tenants (name, industry, size, country, is_demo, package, reassessment_frequency, branding_json)
    VALUES (?, ?, ?, ?, 1, ?, ?, ?)`, [t.name, t.industry, t.size, t.country, t.package, t.reassessment_frequency,
    JSON.stringify({ primaryColor: '#1F6F5C', reportFooter: 'Prepared for Northwind Health Partners. Demonstration data only.' })]);
  const tenantId = ins.lastID;

  for (const fw of ['healthcare', 'nist', 'soc']) {
    await db.run('INSERT INTO tenant_frameworks (tenant_id, framework_id) VALUES (?, ?)', [tenantId, fw]);
  }
  await db.run('INSERT INTO tenant_profiles (tenant_id, profile_json) VALUES (?, ?)', [tenantId, JSON.stringify(demo.DEMO_PROFILE)]);

  const password = process.env.DEMO_PASSWORD && validatePassword(process.env.DEMO_PASSWORD, 'demo.admin').length === 0
    ? process.env.DEMO_PASSWORD
    : generateTemporaryPassword();
  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const users = [
    { email: 'demo.admin@northwind-demo.test', name: 'Priya Raman', role: ROLES.CUSTOMER_ADMIN },
    { email: 'demo.it@northwind-demo.test', name: 'Arjun Mehta', role: ROLES.CONTRIBUTOR },
    { email: 'demo.board@northwind-demo.test', name: 'Leela Nair', role: ROLES.READ_ONLY }
  ];
  const userIds = {};
  for (const u of users) {
    await db.run('DELETE FROM users WHERE email = ?', [u.email]);
    const r = await db.run('INSERT INTO users (tenant_id, email, name, password_hash, role, password_changed_at) VALUES (?, ?, ?, ?, ?, ?)',
      [tenantId, u.email, u.name, hash, u.role, new Date().toISOString()]);
    userIds[u.role] = r.lastID;
  }

  const day = 86400000;
  const now = Date.now();

  // Healthcare: two completed cycles to show trend and before/after comparison.
  const cycles = [
    { seed: 'baseline', shift: -0.16, offsetDays: 190, title: 'Healthcare & Pharma assessment — H1' },
    { seed: 'current', shift: 0.08, offsetDays: 12, title: 'Healthcare & Pharma assessment — H2' }
  ];
  let lastAssessmentId = null;
  for (const c of cycles) {
    const answers = demo.generateAnswers('healthcare', { seed: c.seed, shift: c.shift });
    const created = new Date(now - (c.offsetDays + 21) * day).toISOString();
    const completed = new Date(now - c.offsetDays * day).toISOString();
    const a = await db.run(`INSERT INTO assessments (tenant_id, framework_id, title, status, profile_json, answers_json, created_by, created_at, updated_at, submitted_at, completed_at)
      VALUES (?, 'healthcare', ?, 'completed', ?, ?, ?, ?, ?, ?, ?)`,
    [tenantId, c.title, JSON.stringify(demo.DEMO_PROFILE), JSON.stringify(answers), userIds[ROLES.CUSTOMER_ADMIN], created, completed, completed, completed]);
    const assessment = await db.get('SELECT * FROM assessments WHERE id = ?', [a.lastID]);
    await issueReport(db, services, { assessment, user: null, reviewType: 'Assessor reviewed', issuedAt: completed, assessorName: 'HiQurate Ops assessment team' });
    lastAssessmentId = a.lastID;
  }

  // NIST: in progress, partially complete, with section ownership.
  const nistAnswers = demo.generateAnswers('nist', { seed: 'nist', completion: 0.55 });
  const nist = await db.run(`INSERT INTO assessments (tenant_id, framework_id, title, status, profile_json, answers_json, created_by, created_at, updated_at, due_date)
    VALUES (?, 'nist', 'NIST CSF programme baseline', 'in_progress', ?, ?, ?, ?, ?, ?)`,
  [tenantId, JSON.stringify(demo.DEMO_PROFILE), JSON.stringify(nistAnswers), userIds[ROLES.CUSTOMER_ADMIN],
    new Date(now - 9 * day).toISOString(), new Date(now - 1 * day).toISOString(), new Date(now + 21 * day).toISOString().slice(0, 10)]);
  const nistData = content.getFrameworkData('nist');
  for (const [i, mod] of nistData.modules.entries()) {
    const owner = i % 2 === 0 ? userIds[ROLES.CUSTOMER_ADMIN] : userIds[ROLES.CONTRIBUTOR];
    const ids = mod.categories.flatMap(c => c.questions.map(q => q.id));
    const answered = ids.filter(id => nistAnswers[id]).length;
    const status = answered === ids.length ? 'complete' : answered ? 'in_progress' : 'not_started';
    await db.run('INSERT INTO assessment_sections (assessment_id, module_id, owner_user_id, status) VALUES (?, ?, ?, ?)', [nist.lastID, mod.id, owner, status]);
  }

  // Action plan entries for the most important current findings.
  const latest = await db.get('SELECT result_json FROM reports WHERE assessment_id = ? ORDER BY version DESC LIMIT 1', [lastAssessmentId]);
  const findings = JSON.parse(latest.result_json).findings;
  const plan = [
    { status: 'in_progress', owner: 'Head of IT Security', due: 20, notes: 'Managed SOC onboarding under way; log sources for EMR and firewalls connected.' },
    { status: 'open', owner: 'Infrastructure Manager', due: 30, notes: '' },
    { status: 'resolved', owner: 'IT Operations Lead', due: -5, notes: 'Immutable backup tier enabled; restore test completed.' },
    { status: 'in_progress', owner: 'Clinical Engineering', due: 45, notes: 'Medical device VLAN design approved.' }
  ];
  for (const [i, f] of findings.slice(0, plan.length).entries()) {
    const p = plan[i];
    await db.run(`INSERT INTO finding_actions (tenant_id, framework_id, question_id, status, owner, due_date, notes, updated_by)
      VALUES (?, 'healthcare', ?, ?, ?, ?, ?, ?)`, [tenantId, f.id, p.status, p.owner, new Date(now + p.due * day).toISOString().slice(0, 10), p.notes, userIds[ROLES.CUSTOMER_ADMIN]]);
  }
  const accepted = findings.find(f => f.severity === 'low' || f.severity === 'medium');
  if (accepted) {
    await db.run(`INSERT INTO finding_actions (tenant_id, framework_id, question_id, status, owner, acceptance_justification, acceptance_expiry, accepted_by, accepted_at, updated_by)
      VALUES (?, 'healthcare', ?, 'risk_accepted', 'Chief Operating Officer', ?, ?, ?, ?, ?) ON CONFLICT(tenant_id, framework_id, question_id) DO NOTHING`,
    [tenantId, accepted.id, 'Legacy laboratory analyser cannot be upgraded until vendor replacement in Q3. Compensating control: isolated VLAN with monitored access.',
      new Date(now + 120 * day).toISOString().slice(0, 10), userIds[ROLES.CUSTOMER_ADMIN], new Date(now - 3 * day).toISOString(), userIds[ROLES.CUSTOMER_ADMIN]]);
  }

  if (log) {
    console.log('Demo organisation ready: Northwind Health Partners (Demo)');
    console.log(`  Sign in as demo.admin@northwind-demo.test with password ${password}\n`);
  }
  return { tenantId, email: 'demo.admin@northwind-demo.test', password };
}

async function bootstrap(db, services, { adminEmail, adminPassword, seedDemo, log }) {
  const admin = await ensurePlatformAdmin(db, { adminEmail, adminPassword, log });
  let demoInfo = null;
  if (seedDemo) {
    const existing = await db.get('SELECT id FROM tenants WHERE is_demo = 1');
    if (!existing) demoInfo = await seedDemoTenant(db, services, { log });
  }
  return { admin, demo: demoInfo };
}

module.exports = { bootstrap, seedDemoTenant, BCRYPT_ROUNDS };
