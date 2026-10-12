// ============================================
// HawkSight — Demonstration organisation
// A fictional organisation with realistic, internally consistent answers.
// Used for sales demonstrations and the public sample report.
// All names are fictional.
// ============================================

const Scoring = require('../js/engine/scoring.js');
const content = require('./content');

const DEMO_TENANT = {
  name: 'Northwind Health Partners (Demo)',
  industry: 'healthcare',
  size: '250 - 1000',
  country: 'India',
  package: 'comprehensive',
  reassessment_frequency: 'semiannual'
};

const DEMO_PROFILE = {
  organizationName: 'Northwind Health Partners',
  industry: 'healthcare',
  employeeCount: '250 - 1000',
  officeLocations: 6,
  geography: ['India'],
  itEnvironment: 'hybrid',
  regulations: ['dpdp', 'hipaa', 'iso27001', 'certin'],
  dataTypes: ['personal', 'health', 'financial'],
  technology: ['m365', 'aws', 'ot', 'custom_apps'],
  developsSoftware: 'yes',
  internetFacing: 'yes',
  businessCriticality: 'high',
  criticalServices: 'Patient portal, electronic medical records, laboratory information system, billing',
  securityTools: ['EDR', 'Firewall', 'Email Security', 'Backup Solution', 'MDM'],
  recentIncidents: 'yes',
  securityConcerns: 'Ransomware disruption of clinical systems; exposure of patient records through third parties.',
  plannedImprovements: 'Centralised monitoring with a managed SOC; immutable backups; privileged access management.',
  defaultOwner: 'Head of IT Security'
};

// Deterministic pseudo-random generator so the demo is identical on every reset.
function seeded(seedText) {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6D2B79F5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Target implementation level per control for the "current" assessment.
// 0 = absent, 1 = full. The prior assessment is lower to show improvement.
const CONTROL_PROFILE = {
  'HS-IAM-01': 0.8, 'HS-END-01': 0.75, 'HS-MON-01': 0.3, 'HS-MON-02': 0.35, 'HS-RES-01': 0.6, 'HS-RES-02': 0.45,
  'HS-VUL-01': 0.5, 'HS-VUL-02': 0.55, 'HS-NET-01': 0.6, 'HS-IR-01': 0.55, 'HS-IR-03': 0.4, 'HS-IAM-04': 0.25,
  'HS-OT-01': 0.35, 'HS-DAT-01': 0.7, 'HS-DAT-02': 0.85, 'HS-PPL-01': 0.7, 'HS-PPL-02': 0.45, 'HS-TPR-01': 0.4,
  'HS-GOV-01': 0.85, 'HS-GOV-02': 0.7, 'HS-GOV-03': 0.55, 'HS-GOV-04': 0.65, 'HS-AST-01': 0.6, 'HS-PHY-01': 0.75,
  'HS-IAM-02': 0.65, 'HS-IAM-03': 0.6, 'HS-IAM-05': 0.7, 'HS-END-02': 0.65, 'HS-END-03': 0.7, 'HS-DAT-03': 0.5,
  'HS-VUL-03': 0.45, 'HS-IAM-06': 0.3, 'HS-IAM-07': 0.35, 'HS-PAY-02': 0.55, 'HS-RES-03': 0.4, 'HS-DAT-05': 0.3, 'HS-CLD-01': 0.55
};

function generateAnswers(frameworkId, { shift = 0, completion = 1, seed = 'current' } = {}) {
  const data = content.getFrameworkData(frameworkId);
  const items = Scoring.buildItems(frameworkId, data, {});
  const rand = seeded(`${frameworkId}:${seed}`);
  const answers = {};
  const total = items.length;
  items.forEach((item, idx) => {
    if (idx / total >= completion) return;
    const base = (item.control && CONTROL_PROFILE[item.control.id] !== undefined) ? CONTROL_PROFILE[item.control.id] : 0.6;
    const target = Math.max(0, Math.min(1, base + shift + (rand() - 0.5) * 0.35));
    const values = item.options.map(o => Number(o.value)).sort((a, b) => a - b);
    const min = values[0];
    const max = values[values.length - 1];
    let best = values[0];
    let bestDist = Infinity;
    values.forEach(v => {
      const f = max === min ? 1 : (v - min) / (max - min);
      const d = Math.abs(f - target);
      if (d < bestDist) { bestDist = d; best = v; }
    });
    const r = rand();
    let record;
    if (r < 0.03) record = { v: 'UNK' };
    else if (r < 0.05 && target < 0.5) record = { v: 'PLANNED' };
    else record = { v: best, c: r > 0.7 ? 'evidence-supported' : 'self-attested' };
    answers[item.id] = { ...record, at: new Date().toISOString() };
  });
  return answers;
}

// scope 'core' gives the Snapshot version of the same sample organisation.
function sampleReport(config, scope) {
  const answers = generateAnswers('healthcare', { seed: 'current', shift: 0.08 });
  const result = Scoring.scoreAssessment({
    frameworkId: 'healthcare',
    data: content.getFrameworkData('healthcare'),
    answers,
    evidence: {},
    profile: DEMO_PROFILE,
    config: config || {},
    scope: scope === 'core' ? 'core' : 'full'
  });
  return { profile: DEMO_PROFILE, answers, result };
}

module.exports = { DEMO_TENANT, DEMO_PROFILE, generateAnswers, sampleReport };
