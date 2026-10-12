// HawkSight scoring engine — known-answer regression tests.
// Each fixture has a hand-calculated expected result. If a scoring change
// alters any of these numbers, the change must be deliberate and documented
// in METHODOLOGY.md.

const test = require('node:test');
const assert = require('node:assert/strict');
const Scoring = require('../js/engine/scoring.js');
const Controls = require('../js/engine/control-library.js');
const Threats = require('../js/engine/threat-library.js');
const content = require('../server/content.js');

// Questions are tagged with an explicit criticality so fixtures do not depend
// on keyword mapping.
function q(id, tier, options = [0, 1, 2]) {
  return { id, text: `Control ${id}`, criticality: tier, options: options.map(v => ({ label: `L${v}`, value: v })) };
}

function fixture(modules) {
  return {
    modules: modules.map(m => ({ id: m.id, name: m.name, categories: [{ id: `${m.id}-c`, name: 'Category', questions: m.questions }] }))
  };
}

const NO_RULES = { applicabilityRules: [] };

test('answer fractions are normalised to the option range', () => {
  const nist = q('n', 'medium', [1, 2, 3, 4]);
  assert.equal(Scoring.answerFraction(nist, 1), 0, 'lowest option on a 1-4 scale scores zero');
  assert.equal(Scoring.answerFraction(nist, 4), 1);
  assert.ok(Math.abs(Scoring.answerFraction(nist, 2) - 1 / 3) < 1e-9);
  const ind = q('i', 'medium', [0, 2, 5]);
  assert.equal(Scoring.answerFraction(ind, 2), 0.4);
});

test('weighted scoring: critical controls outweigh medium controls', () => {
  // critical (w4) fully met, medium (w2) not met -> 4 / 6 = 66.7%
  const data = fixture([{ id: 'm1', name: 'Domain', questions: [q('a', 'critical'), q('b', 'medium')] }]);
  const r1 = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { a: 2, b: 0 }, config: NO_RULES });
  assert.equal(r1.overall.healthScore, 67);
  // reversed: critical missing, medium met -> 2 / 6 = 33.3%, and gating applies
  const r2 = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { a: 0, b: 2 }, config: NO_RULES });
  assert.equal(r2.overall.rawScore, 33);
  assert.equal(r2.overall.criticalFailures.length, 1);
});

test('domain scores use equal weights by default and configured weights when set', () => {
  const data = fixture([
    { id: 'd1', name: 'One', questions: [q('a', 'medium')] },
    { id: 'd2', name: 'Two', questions: [q('b', 'medium'), q('c', 'medium'), q('d', 'medium')] }
  ]);
  const answers = { a: 2, b: 0, c: 0, d: 0 };
  // Equal domain weighting: (100 + 0) / 2 = 50, not the pooled 25.
  const eq = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers, config: NO_RULES });
  assert.equal(eq.overall.healthScore, 50);
  assert.equal(eq.overall.domainWeighting, 'equal');
  // Configured 80/20 weighting: 0.8 * 100 + 0.2 * 0 = 80.
  const weighted = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers, config: { ...NO_RULES, domainWeights: { fx: { d1: 80, d2: 20 } } } });
  assert.equal(weighted.overall.healthScore, 80);
  assert.equal(weighted.overall.domainWeighting, 'configured');
});

test('N/A is excluded; Unknown and Planned score zero', () => {
  const data = fixture([{ id: 'm', name: 'M', questions: [q('a', 'medium'), q('b', 'medium'), q('c', 'medium'), q('d', 'medium')] }]);
  const r = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { a: 2, b: 'NA', c: 'UNK', d: 'PLANNED' }, config: NO_RULES });
  // a = 2/2, c = 0, d = 0, b excluded -> 2/6 = 33%
  assert.equal(r.overall.healthScore, 33);
  assert.equal(r.overall.completion.applicable, 3);
  assert.equal(r.overall.completion.answered, 3);
  assert.equal(r.overall.completion.notApplicable, 1);
  assert.equal(r.overall.completion.unknown, 1);
  assert.equal(r.overall.completion.planned, 1);
  const states = Object.fromEntries(r.controls.map(c => [c.id, c.state]));
  assert.deepEqual(states, { a: 'scored', b: 'na', c: 'unknown', d: 'planned' });
});

test('legacy -1 answers are treated as N/A', () => {
  const data = fixture([{ id: 'm', name: 'M', questions: [q('a', 'medium'), q('b', 'medium')] }]);
  const r = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { a: 2, b: -1 }, config: NO_RULES });
  assert.equal(r.overall.healthScore, 100);
});

test('critical-control gating caps the score at 75 for one failure and 60 for three', () => {
  const many = Array.from({ length: 30 }, (_, i) => q(`s${i}`, 'medium'));
  const crit = [q('c1', 'critical'), q('c2', 'critical'), q('c3', 'critical')];
  const data = fixture([{ id: 'm', name: 'M', questions: [...crit, ...many] }]);
  const base = Object.fromEntries(many.map(x => [x.id, 2]));

  const one = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { ...base, c1: 0, c2: 2, c3: 2 }, config: NO_RULES });
  assert.ok(one.overall.rawScore > 75);
  assert.equal(one.overall.healthScore, 75);
  assert.equal(one.overall.capped, true);

  const three = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { ...base, c1: 0, c2: 0, c3: 'UNK' }, config: NO_RULES });
  assert.equal(three.overall.healthScore, 60);
  assert.equal(three.overall.criticalFailures.length, 3);

  const off = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { ...base, c1: 0, c2: 2, c3: 2 }, config: { ...NO_RULES, gating: { enabled: false } } });
  assert.equal(off.overall.capped, false);
  assert.equal(off.overall.healthScore, off.overall.rawScore);
});

test('a partially implemented critical control is not a gating failure', () => {
  const data = fixture([{ id: 'm', name: 'M', questions: [q('c', 'critical', [0, 1, 2, 3])] }]);
  const absent = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { c: 0 }, config: NO_RULES });
  assert.equal(absent.overall.criticalFailures.length, 1);
  const partial = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { c: 1 }, config: NO_RULES }); // one third
  assert.equal(partial.overall.criticalFailures.length, 0, 'a partial implementation is a gap, not a gating failure');
});

test('severity matrix follows control tier and gap size', () => {
  const data = fixture([{ id: 'm', name: 'M', questions: [
    q('c0', 'critical', [0, 1, 2, 3]), q('c1', 'critical', [0, 1, 2, 3]), q('c2', 'critical', [0, 1, 2, 3]),
    q('h0', 'high', [0, 1, 2, 3]), q('m0', 'medium', [0, 1, 2, 3]), q('f0', 'foundational', [0, 1, 2, 3]), q('f2', 'foundational', [0, 1, 2, 3]),
    q('ok', 'critical', [0, 1, 2, 3])
  ] }]);
  const r = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { c0: 0, c1: 1, c2: 2, h0: 0, m0: 0, f0: 0, f2: 2, ok: 3 }, config: NO_RULES });
  const sev = Object.fromEntries(r.findings.map(f => [f.id, f.severity]));
  assert.deepEqual(sev, { c0: 'critical', c1: 'high', c2: 'medium', h0: 'high', m0: 'medium', f0: 'low', f2: 'informational' });
  assert.equal(r.findings.find(f => f.id === 'c1').gapLevel, 'partial');
  assert.equal(r.findings.find(f => f.id === 'c2').gapLevel, 'minor');
  assert.ok(!sev.ok, 'fully implemented controls do not create findings');
  assert.equal(r.findings[0].severity, 'critical', 'findings are ordered by severity');
});

test('risk context raises findings on critical controls by one level, never to Critical', () => {
  const data = fixture([{ id: 'm', name: 'M', questions: [q('c', 'critical', [0, 1, 2, 3]), q('d', 'critical', [0, 1, 2, 3]), q('h', 'high', [0, 1, 2, 3])] }]);
  const profile = { dataTypes: ['health', 'payment', 'financial'], recentIncidents: 'yes', businessCriticality: 'high' };
  const r = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { c: 2, d: 0, h: 1 }, profile, config: NO_RULES });
  assert.ok(r.overall.riskContext.multiplier >= 1.25);
  const sev = Object.fromEntries(r.findings.map(f => [f.id, f.severity]));
  assert.equal(sev.c, 'high', 'minor gap on a critical control raised from medium to high');
  assert.equal(sev.d, 'critical');
  assert.equal(sev.h, 'medium', 'high-tier controls are not elevated (partial gap stays medium)');
});

test('health and risk are reported separately and risk reflects context', () => {
  const data = fixture([{ id: 'm', name: 'M', questions: [q('a', 'medium'), q('b', 'medium')] }]);
  const low = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { a: 2, b: 0 }, profile: {}, config: NO_RULES });
  const high = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { a: 2, b: 0 }, profile: { recentIncidents: 'yes', businessCriticality: 'high', employeeCount: '1000+' }, config: NO_RULES });
  assert.equal(low.overall.healthScore, high.overall.healthScore);
  assert.ok(high.overall.riskScore > low.overall.riskScore);
  const perfect = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { a: 2, b: 2 }, config: NO_RULES });
  assert.equal(perfect.overall.healthScore, 100);
  assert.equal(perfect.overall.riskScore, 0);
});

test('confidence distinguishes self-attested from validated answers', () => {
  const data = fixture([{ id: 'm', name: 'M', questions: [q('a', 'critical'), q('b', 'high')] }]);
  const self = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { a: 2, b: 2 }, config: NO_RULES });
  const validated = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { a: { v: 2, c: 'assessor-validated' }, b: { v: 2, c: 'externally-verified' } }, config: NO_RULES });
  assert.equal(self.overall.healthScore, validated.overall.healthScore);
  assert.notEqual(self.overall.confidence.label, 'High');
  assert.equal(validated.overall.confidence.label, 'High');
  assert.ok(validated.overall.confidence.score > self.overall.confidence.score);
  // Attached evidence upgrades self-attested support.
  const withEvidence = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { a: 2, b: 2 }, evidence: { a: 1, b: 2 }, config: NO_RULES });
  assert.ok(withEvidence.overall.confidence.factors.evidenceQuality > self.overall.confidence.factors.evidenceQuality);
  // Incomplete assessments cannot be High confidence.
  const partial = Scoring.scoreAssessment({ frameworkId: 'fx', data: fixture([{ id: 'm', name: 'M', questions: [q('a', 'critical'), q('b', 'high'), q('c', 'high')] }]), answers: { a: { v: 2, c: 'externally-verified' } }, config: NO_RULES });
  assert.equal(partial.overall.confidence.label, 'Low');
});

test('maturity levels map to documented thresholds', () => {
  assert.equal(Scoring.maturityFor(0).name, 'Initial');
  assert.equal(Scoring.maturityFor(34).name, 'Initial');
  assert.equal(Scoring.maturityFor(35).name, 'Developing');
  assert.equal(Scoring.maturityFor(55).name, 'Defined');
  assert.equal(Scoring.maturityFor(75).name, 'Managed');
  assert.equal(Scoring.maturityFor(90).name, 'Optimized');
});

test('evidence-required controls are listed until evidence or validation is recorded', () => {
  const data = fixture([{ id: 'm', name: 'M', questions: [q('a', 'critical')] }]);
  const cfg = { ...NO_RULES, questionOverrides: { a: { evidenceRequired: true } } };
  const missing = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { a: 2 }, config: cfg });
  assert.equal(missing.missingEvidence.length, 1);
  const supplied = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { a: 2 }, evidence: { a: 1 }, config: cfg });
  assert.equal(supplied.missingEvidence.length, 0);
  const validated = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { a: { v: 2, c: 'assessor-validated' } }, config: cfg });
  assert.equal(validated.missingEvidence.length, 0);
  const notImplemented = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { a: 0 }, config: cfg });
  assert.equal(notImplemented.missingEvidence.length, 0, 'evidence is only required for claimed implementation');
});

test('applicability rules hide or suggest N/A based on profile and previous answers', () => {
  const data = fixture([{ id: 'm', name: 'M', questions: [q('siem', 'critical'), q('tuning', 'high'), { ...q('dc', 'medium'), text: 'Is the server room locked?' }] }]);
  const rules = [
    { id: 'r1', enabled: true, effect: 'hide', scope: { questions: ['tuning'] }, when: [{ field: 'answer:siem', op: 'lte', value: 0 }], description: 'No SIEM' },
    { id: 'r2', enabled: true, effect: 'suggest_na', scope: { keywords: ['server room'] }, when: [{ field: 'profile.itEnvironment', op: 'eq', value: 'cloud' }], description: 'Cloud only' },
    { id: 'r3', enabled: false, effect: 'hide', scope: {}, when: [{ field: 'profile.itEnvironment', op: 'eq', value: 'cloud' }], description: 'Disabled rule' }
  ];
  const r = Scoring.scoreAssessment({ frameworkId: 'fx', data, answers: { siem: 0 }, profile: { itEnvironment: 'cloud' }, config: { applicabilityRules: rules } });
  const byId = Object.fromEntries(r.controls.map(c => [c.id, c]));
  assert.equal(byId.tuning.state, 'hidden');
  assert.equal(byId.dc.applicability.suggestNA, true);
  assert.equal(byId.siem.applicability.hidden, false, 'disabled rules are ignored');
  assert.equal(r.overall.completion.applicable, 2);
});

test('framework coverage aggregates by reference framework', () => {
  const data = content.getFrameworkData('healthcare');
  const r = Scoring.scoreAssessment({ frameworkId: 'healthcare', data, answers: {}, config: {} });
  assert.ok(r.frameworkCoverage.hipaa.length > 0);
  assert.ok(r.frameworkCoverage.iso27001.some(x => x.ref === '8.5'), 'MFA maps to ISO 27001 A.8.5');
});

test('every question in every template maps to a canonical control', () => {
  for (const fw of content.FRAMEWORK_ORDER) {
    const items = Scoring.buildItems(fw, content.getFrameworkData(fw), {});
    const unmapped = items.filter(i => !i.control);
    assert.equal(unmapped.length, 0, `${fw}: ${unmapped.map(i => i.id).join(', ')}`);
  }
});

test('control library mappings reference only known frameworks and controls', () => {
  const refs = Object.keys(Controls.FRAMEWORK_REFERENCES);
  for (const c of Controls.CONTROLS) {
    assert.ok(Controls.CRITICALITY_TIERS[c.criticality], `${c.id} tier`);
    assert.ok(Controls.DOMAINS.some(d => d.id === c.domain), `${c.id} domain`);
    Object.keys(c.mappings).forEach(k => assert.ok(refs.includes(k), `${c.id} maps to unknown framework ${k}`));
    assert.ok(c.remediation.quickWin && c.remediation.mediumTerm && c.remediation.longTerm, `${c.id} remediation`);
  }
  Object.values(Controls.EXPLICIT_QUESTION_MAP).forEach(id => assert.ok(Controls.CONTROL_INDEX[id], id));
});

test('keyword mapping respects word boundaries', () => {
  const map = text => Controls.mapQuestionToControl({ id: 'x', text }, { frameworkId: 'retail' }).control.id;
  assert.equal(map('Do you assess the cybersecurity posture of partners?'), 'HS-TPR-01', '"pos" must not match "posture"');
  assert.equal(map('Is multi-factor authentication enforced for VPN?'), 'HS-IAM-01');
  assert.equal(map('Are backups stored offline and tested?'), 'HS-RES-01');
});

test('demo seed scores are stable (regression guard)', () => {
  const demo = require('../server/demo.js');
  const answers = demo.generateAnswers('healthcare', { seed: 'current', shift: 0.08 });
  const r = Scoring.scoreAssessment({ frameworkId: 'healthcare', data: content.getFrameworkData('healthcare'), answers, profile: demo.DEMO_PROFILE, config: {} });
  assert.equal(r.overall.healthScore, 55);
  assert.equal(r.overall.maturity.name, 'Defined');
});

test('Snapshot scope covers each control exactly once', () => {
  for (const fw of content.FRAMEWORK_ORDER) {
    const data = content.getFrameworkData(fw);
    const full = Scoring.scoreAssessment({ frameworkId: fw, data, answers: {}, config: {} });
    const snap = Scoring.scoreAssessment({ frameworkId: fw, data, answers: {}, config: {}, scope: 'core' });
    const inScope = snap.controls.filter(c => c.applicability.ruleId !== 'scope');
    const controls = new Set(full.controls.map(c => c.controlId));
    assert.equal(new Set(inScope.map(c => c.controlId)).size, controls.size, `${fw}: every control is covered`);
    assert.equal(inScope.length, controls.size, `${fw}: one question per control`);
    assert.equal(snap.meta.scope, 'core');
    assert.ok(snap.overall.completion.applicable < full.overall.completion.applicable || controls.size === full.controls.length);
  }
});

test('remediation projection with no changes reproduces the issued scores', () => {
  for (const fw of content.FRAMEWORK_ORDER) {
    const data = content.getFrameworkData(fw, {});
    const answers = {};
    let i = 0;
    data.modules.forEach(m => m.categories.forEach(c => c.questions.forEach(qq => {
      const pick = i++ % 7;
      if (pick === 5) answers[qq.id] = 'UNK';
      else if (pick === 6) answers[qq.id] = 'PLANNED';
      else answers[qq.id] = qq.options[pick % qq.options.length].value;
    })));
    const profile = { dataTypes: ['health', 'payment'], recentIncidents: 'yes', businessCriticality: 'high' };
    const result = Scoring.scoreAssessment({ frameworkId: fw, data, answers, profile });
    const p = Scoring.projectScores(result, {});
    assert.equal(p.healthScore, result.overall.healthScore, `${fw}: health`);
    assert.equal(p.riskScore, result.overall.riskScore, `${fw}: risk`);
    assert.deepEqual(p.severityCounts, result.severityCounts, `${fw}: severity counts`);
  }
});

test('remediation stages improve the score step by step and end fully remediated', () => {
  const data = fixture([
    { id: 'a', name: 'Protect', questions: [q('mfa', 'critical', [1, 2, 3, 4]), q('edr', 'critical', [1, 2, 3, 4]), q('pol', 'foundational', [1, 2, 3, 4])] },
    { id: 'b', name: 'Recover', questions: [q('bak', 'critical', [1, 2, 3, 4]), q('rst', 'high', [1, 2, 3, 4])] }
  ]);
  const result = Scoring.scoreAssessment({ frameworkId: 'nist', data, answers: { mfa: 1, edr: 2, pol: 1, bak: 4, rst: 2 }, config: NO_RULES });
  const plan = Scoring.projectRemediation(result);
  assert.equal(plan.baseline.healthScore, result.overall.healthScore);
  const scores = [plan.baseline].concat(plan.stages).map(s => s.healthScore);
  const risks = [plan.baseline].concat(plan.stages).map(s => s.riskScore);
  for (let k = 1; k < scores.length; k++) {
    assert.ok(scores[k] > scores[k - 1], `stage ${k} raises the score`);
    assert.ok(risks[k] < risks[k - 1], `stage ${k} lowers risk`);
  }
  assert.equal(plan.stages[2].healthScore, 100);
  // MFA is a failed critical control: its quick win (Not implemented to
  // Partially) clears the gating failure.
  const mfa = plan.actions.find(a => a.findingIds.includes('mfa'));
  assert.ok(mfa.steps.now.health > 0);
  assert.equal(plan.actions.length, 4, 'one action per control with a gap');
});

// ── Question quality guarantees ──

test('every shipped question outside SOC-CMM names its control explicitly', () => {
  for (const fw of content.FRAMEWORK_ORDER.filter(f => f !== 'soc')) {
    const items = Scoring.buildItems(fw, content.getFrameworkData(fw), {});
    const implicit = items.filter(i => i.mappingMethod !== 'explicit');
    assert.equal(implicit.length, 0, `${fw}: ${implicit.map(i => i.id).join(', ')}`);
  }
});

test('question and category IDs are unique within each template', () => {
  for (const fw of content.FRAMEWORK_ORDER) {
    const data = content.getFrameworkData(fw);
    const qids = data.modules.flatMap(m => m.categories.flatMap(c => c.questions.map(q => q.id)));
    const cids = data.modules.flatMap(m => m.categories.map(c => c.id));
    assert.equal(new Set(qids).size, qids.length, `${fw}: duplicate question IDs`);
    assert.equal(new Set(cids).size, cids.length, `${fw}: duplicate category IDs`);
  }
});

test('industry questions describe every answer level and give attacker and verification context', () => {
  for (const fw of content.FRAMEWORK_ORDER.filter(f => content.FRAMEWORKS[f].type === 'industry')) {
    const data = content.getFrameworkData(fw);
    data.modules.forEach(m => m.categories.forEach(c => c.questions.forEach(q => {
      assert.equal(q.options.length, 4, `${q.id}: four answer levels`);
      q.options.forEach(o => assert.ok(o.detail && o.detail.length > 5, `${q.id}: level "${o.label}" is described`));
      assert.ok(q.attack && q.attack.length > 20, `${q.id}: attacker context`);
      assert.ok(q.verify && q.verify.length > 10, `${q.id}: verification guidance`);
    })));
  }
});

test('NIST template covers all 106 CSF 2.0 subcategories', () => {
  const ids = content.getFrameworkData('nist').modules.flatMap(m => m.categories.flatMap(c => c.questions.map(q => q.id)));
  assert.equal(ids.length, 106);
  assert.ok(ids.includes('GV.SC-10') && ids.includes('RC.CO-04') && ids.includes('PR.AA-06'));
  assert.ok(!ids.some(id => /^ID\.(BE|GV)|^PR\.(AC|IP|PT|MA)|^DE\.DP/.test(id)), 'no CSF 1.1 categories remain');
});

// ── Threat scenario library ──

test('threat scenarios reference known controls and valid relevance', () => {
  const levels = Object.keys(Threats.RELEVANCE_WEIGHT);
  for (const sc of Threats.SCENARIOS) {
    assert.ok(sc.stages.some(st => st.type === 'prevent'), `${sc.id}: has a prevention stage`);
    sc.stages.forEach(st => {
      assert.ok(['prevent', 'detect', 'recover'].includes(st.type), `${sc.id}.${st.id} type`);
      assert.ok(['all', 'any'].includes(st.mode), `${sc.id}.${st.id} mode`);
      st.controls.forEach(id => assert.ok(Controls.CONTROL_INDEX[id], `${sc.id}.${st.id}: unknown control ${id}`));
    });
    Object.entries(sc.relevance).forEach(([k, v]) => {
      assert.ok(k === 'default' || Threats.INDUSTRIES.includes(k), `${sc.id}: industry ${k}`);
      assert.ok(levels.includes(v), `${sc.id}: relevance ${v}`);
    });
    ((sc.when && sc.when.industries) || []).forEach(i => assert.ok(Threats.INDUSTRIES.includes(i), `${sc.id}: when industry ${i}`));
  }
});

test('chain readiness: complete barriers defend, absent barriers leave the path open', () => {
  const sc = { stages: [
    { id: 'a', type: 'prevent', mode: 'all', controls: ['X1', 'X2'] },
    { id: 'b', type: 'prevent', mode: 'any', controls: ['Y1', 'Y2'] },
    { id: 'c', type: 'detect', mode: 'all', controls: ['Z'] },
    { id: 'r', type: 'recover', mode: 'all', controls: ['R'] }
  ] };
  const all = v => ({ X1: v, X2: v, Y1: v, Y2: v, Z: v, R: 0 });
  // Three barriers each stopping 70% when fully implemented: 1 - 0.3^3 = 97.3%.
  assert.equal(Threats.chainReadiness(sc, all(1)), 97);
  assert.equal(Threats.chainReadiness(sc, all(0)), 0);
  // 'all': the weakest door decides. 'any': the strongest barrier decides.
  const weakDoor = Threats.chainReadiness(sc, { ...all(1), X2: 0 });
  const weakBarrier = Threats.chainReadiness(sc, { ...all(1), Y2: 0 });
  assert.ok(weakDoor < weakBarrier, 'an open alternative door matters more than one weak redundant barrier');
  assert.equal(weakBarrier, 97);
  // Recovery does not change readiness (it limits harm, not likelihood).
  assert.equal(Threats.chainReadiness(sc, { ...all(1), R: 1 }), 97);
  assert.equal(Threats.readinessBand(97), 'defended');
  assert.equal(Threats.readinessBand(60), 'partial');
  assert.equal(Threats.readinessBand(20), 'open');
});

test('scenario relevance follows industry and profile', () => {
  const skim = Threats.SCENARIO_INDEX['TS-WEBSKIM'];
  assert.equal(Threats.relevanceFor(skim, 'retail', {}), 'high');
  assert.equal(Threats.relevanceFor(skim, 'healthcare', {}), null, 'not relevant to a hospital without card payments');
  assert.equal(Threats.relevanceFor(skim, 'healthcare', { dataTypes: ['payment'] }), 'medium', 'profile-triggered scenarios are at least medium');
  assert.equal(Threats.resolveIndustry('nist', { industry: 'bfsi' }), 'fintech');
  assert.equal(Threats.resolveIndustry('retail', { industry: 'healthcare' }), 'retail', 'industry templates set the context');
});

test('assessment results include attack path analysis that responds to answers', () => {
  const data = content.getFrameworkData('retail');
  const items = Scoring.buildItems('retail', data, {});
  const answersAt = level => Object.fromEntries(items.map(i => [i.id, level]));
  const weak = Scoring.scoreAssessment({ frameworkId: 'retail', data, answers: answersAt(0), profile: { industry: 'retail' } });
  const strong = Scoring.scoreAssessment({ frameworkId: 'retail', data, answers: answersAt(3), profile: { industry: 'retail' } });
  assert.equal(weak.meta.scoringModelVersion, '2.1');
  assert.ok(weak.threats.scenarios.length >= 8);
  assert.ok(weak.threats.scenarios.every(s => s.status === 'open'));
  assert.ok(strong.threats.scenarios.every(s => s.status === 'defended'));
  assert.ok(weak.threats.breakers.length > 0, 'chain breakers are suggested when paths are open');
  assert.equal(strong.threats.breakers.length, 0);
  assert.ok(weak.threats.scenarios.some(s => s.id === 'TS-WEBSKIM'), 'retail-specific scenario evaluated');
  const empty = Scoring.scoreAssessment({ frameworkId: 'retail', data, answers: {}, profile: { industry: 'retail' } });
  assert.ok(empty.threats.scenarios.every(s => s.status === 'unassessed'));
});
