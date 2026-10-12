// ============================================
// HawkSight — Scoring Engine
// Deterministic, documented scoring used by both the browser and the server.
// The server recomputes every issued report with this module, so a report
// cannot be altered from the browser. See METHODOLOGY.md for the model.
// ============================================

(function (root) {
  const isNode = typeof module !== 'undefined' && module.exports;
  const Controls = isNode ? require('./control-library.js') : root.HawkControls;
  const Threats = isNode ? require('./threat-library.js') : root.HawkThreats;

  // 2.1 adds attack path analysis (threat-library.js). Health and risk
  // calculations are unchanged from 2.0.
  const SCORING_MODEL_VERSION = '2.1';

  const ANSWER_STATES = {
    NA: 'NA',           // Not applicable: excluded from numerator and denominator
    UNKNOWN: 'UNK',     // Unknown: scored as zero, reduces confidence
    PLANNED: 'PLANNED'  // Planned but not implemented: scored as zero, tracked in roadmap
  };

  const CONFIDENCE_LEVELS = {
    'self-attested': { label: 'Self-attested', weight: 0.3, rank: 0 },
    'evidence-supported': { label: 'Evidence-supported', weight: 0.7, rank: 1 },
    'assessor-validated': { label: 'Assessor-validated', weight: 0.9, rank: 2 },
    'externally-verified': { label: 'Externally verified', weight: 1.0, rank: 3 }
  };

  const MATURITY_LEVELS = [
    { level: 1, name: 'Initial', min: 0, description: 'Controls are absent or ad hoc. Outcomes depend on individual effort and are not repeatable.' },
    { level: 2, name: 'Developing', min: 35, description: 'Some controls exist but coverage is inconsistent and largely undocumented.' },
    { level: 3, name: 'Defined', min: 55, description: 'Controls are documented and applied across most of the environment, with known gaps.' },
    { level: 4, name: 'Managed', min: 75, description: 'Controls are consistently applied, measured and reviewed.' },
    { level: 5, name: 'Optimized', min: 90, description: 'Controls are comprehensive, automated where practical and continuously improved.' }
  ];

  const SEVERITIES = ['critical', 'high', 'medium', 'low', 'informational'];
  const SEVERITY_LABELS = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low', informational: 'Informational' };
  const SEVERITY_TIMEFRAME = { critical: '0-30 days', high: '0-30 days', medium: '31-90 days', low: '91-180 days', informational: 'Backlog' };

  // Severity matrix: control tier x gap level.
  const SEVERITY_MATRIX = {
    critical: { major: 'critical', partial: 'high', minor: 'medium' },
    high: { major: 'high', partial: 'medium', minor: 'low' },
    medium: { major: 'medium', partial: 'low', minor: 'informational' },
    foundational: { major: 'low', partial: 'informational', minor: 'informational' }
  };

  const DEFAULT_CONFIG = {
    version: 1,
    tierWeights: { critical: 4, high: 3, medium: 2, foundational: 1 },
    domainWeights: {},          // { [frameworkId]: { [moduleId]: weightPercent } }
    gating: {
      enabled: true,
      failureThreshold: 0.33,   // a critical control below this fraction (a major gap) counts as failed
      oneFailureCap: 75,
      multiFailureCap: 60,
      multiFailureCount: 3
    },
    scoreBands: { strong: 75, moderate: 55 },   // health score interpretation
    riskBands: { low: 25, moderate: 50, high: 75 },
    contextElevationThreshold: 1.25,
    staleAfterDays: 365,
    benchmarkMinimumPopulation: 10,
    questionOverrides: {},       // { [questionId]: { tier, controlId, evidenceRequired, weight } }
    applicabilityRules: null      // null = use DEFAULT_RULES
  };

  // Applicability rules. Each rule is data so administrators can add, edit or
  // disable rules from the console without code changes.
  const DEFAULT_RULES = [
    {
      id: 'remote-physical', enabled: true, effect: 'suggest_na',
      description: 'Fully remote organisations (no offices) may mark physical facility controls as not applicable.',
      scope: { domains: ['physical'] },
      when: [{ field: 'profile.officeLocations', op: 'eq', value: 0 }]
    },
    {
      id: 'cloud-facilities', enabled: true, effect: 'suggest_na',
      description: 'Cloud-only environments may mark on-premises data centre and server room controls as not applicable.',
      scope: { keywords: ['server room', 'data center', 'datacenter', 'network closet', 'wiring closet', 'ups', 'environmental controls'] },
      when: [{ field: 'profile.itEnvironment', op: 'eq', value: 'cloud' }]
    },
    {
      id: 'onprem-cloud', enabled: true, effect: 'suggest_na',
      description: 'On-premises-only environments may mark cloud posture controls as not applicable.',
      scope: { controls: ['HS-CLD-01'] },
      when: [{ field: 'profile.itEnvironment', op: 'eq', value: 'on-premises' }]
    },
    {
      id: 'no-ot', enabled: true, effect: 'suggest_na',
      description: 'Organisations without OT, medical or IoT devices may mark connected-device controls as not applicable.',
      scope: { controls: ['HS-OT-01'], excludeFrameworks: ['manufacturing'] },
      when: [{ field: 'profile.technology', op: 'notIncludes', value: 'ot' }]
    },
    {
      id: 'no-payments', enabled: true, effect: 'suggest_na',
      description: 'Organisations that do not store, process or transmit payment card data may mark payment controls as not applicable.',
      scope: { controls: ['HS-PAY-01'], keywords: ['pci', 'cardholder', 'card transactions', 'payment card'] },
      when: [{ field: 'profile.dataTypes', op: 'notIncludes', value: 'payment' }]
    },
    {
      id: 'no-development', enabled: true, effect: 'suggest_na',
      description: 'Organisations that do not develop software in-house may mark secure development controls as not applicable.',
      scope: { controls: ['HS-APP-01'], excludeFrameworks: ['itservices'] },
      when: [{ field: 'profile.developsSoftware', op: 'eq', value: 'no' }]
    },
    {
      id: 'soc-no-siem', enabled: true, effect: 'hide',
      description: 'When no SIEM exists, detailed SIEM tuning questions are hidden and the gap is captured by the SIEM existence question.',
      scope: { frameworks: ['soc'], questions: ['T1.2', 'T1.3', 'T1.4'] },
      when: [{ field: 'answer:T1.1', op: 'lte', value: 0 }]
    }
  ];

  function deepMerge(base, extra) {
    if (!extra) return JSON.parse(JSON.stringify(base));
    const out = Array.isArray(base) ? base.slice() : { ...base };
    Object.keys(extra).forEach(k => {
      const v = extra[k];
      if (v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) {
        out[k] = deepMerge(base[k], v);
      } else if (v !== undefined) {
        out[k] = v;
      }
    });
    return out;
  }

  function resolveConfig(config) {
    return deepMerge(DEFAULT_CONFIG, config || {});
  }

  // Normalise legacy answer formats (raw numbers, -1 / 'NA') into records.
  function normaliseAnswer(raw) {
    if (raw === undefined || raw === null || raw === '') return null;
    if (typeof raw === 'object') {
      if (raw.v === undefined || raw.v === null || raw.v === '') return null;
      return { v: raw.v === -1 ? ANSWER_STATES.NA : raw.v, c: raw.c || 'self-attested', n: raw.n || '', by: raw.by, at: raw.at };
    }
    if (raw === -1 || raw === 'NA') return { v: ANSWER_STATES.NA, c: 'self-attested' };
    return { v: raw, c: 'self-attested' };
  }

  function optionRange(question) {
    const values = (question.options || []).map(o => Number(o.value)).filter(v => !Number.isNaN(v));
    if (!values.length) return { min: 0, max: 1 };
    return { min: Math.min(...values), max: Math.max(...values) };
  }

  function answerFraction(question, value) {
    const { min, max } = optionRange(question);
    if (max === min) return value >= max ? 1 : 0;
    const f = (Number(value) - min) / (max - min);
    return Math.max(0, Math.min(1, f));
  }

  // Gap levels: a third of the scale or less is a major gap; two thirds or
  // more is a minor gap. Small tolerance keeps 1/3 and 2/3 on the intended side.
  function gapLevel(fraction) {
    if (fraction >= 1) return 'none';
    if (fraction >= 0.66) return 'minor';
    if (fraction >= 0.33) return 'partial';
    return 'major';
  }

  function maturityFor(percentage) {
    let m = MATURITY_LEVELS[0];
    for (const lvl of MATURITY_LEVELS) if (percentage >= lvl.min) m = lvl;
    return m;
  }

  function inferTier(question, control, overrides) {
    const ov = overrides && overrides[question.id];
    if (ov && ov.tier && Controls.CRITICALITY_TIERS[ov.tier]) return { tier: ov.tier, source: 'override' };
    if (question.criticality && Controls.CRITICALITY_TIERS[question.criticality]) return { tier: question.criticality, source: 'question' };
    if (control) return { tier: control.criticality, source: 'control' };
    if (question.weight >= 5) return { tier: 'high', source: 'weight' };
    if (question.weight === 4) return { tier: 'medium', source: 'weight' };
    if (question.weight && question.weight <= 3) return { tier: 'foundational', source: 'weight' };
    return { tier: 'medium', source: 'default' };
  }

  // ── Applicability ──
  function readField(field, ctx) {
    if (field.startsWith('profile.')) {
      const key = field.slice(8);
      return ctx.profile ? ctx.profile[key] : undefined;
    }
    if (field.startsWith('answer:')) {
      const qid = field.slice(7);
      const rec = normaliseAnswer(ctx.answers ? ctx.answers[qid] : undefined);
      if (!rec || typeof rec.v !== 'number') return undefined;
      const q = ctx.questionIndex ? ctx.questionIndex[qid] : null;
      return q ? answerFraction(q, rec.v) : rec.v;
    }
    return undefined;
  }

  function testCondition(cond, ctx) {
    const actual = readField(cond.field, ctx);
    const expected = cond.value;
    switch (cond.op) {
      case 'eq': return actual !== undefined && actual !== '' && String(actual) === String(expected);
      case 'neq': return String(actual) !== String(expected);
      case 'in': return Array.isArray(expected) && expected.map(String).includes(String(actual));
      case 'includes': return Array.isArray(actual) && actual.includes(expected);
      case 'notIncludes': return Array.isArray(actual) ? !actual.includes(expected) : (actual !== undefined);
      case 'lte': return actual !== undefined && actual !== '' && Number(actual) <= Number(expected);
      case 'gte': return actual !== undefined && actual !== '' && Number(actual) >= Number(expected);
      default: return false;
    }
  }

  function ruleMatchesQuestion(rule, item, frameworkId) {
    const s = rule.scope || {};
    if (s.frameworks && s.frameworks.length && !s.frameworks.includes(frameworkId)) return false;
    if (s.excludeFrameworks && s.excludeFrameworks.includes(frameworkId)) return false;
    const text = ` ${String(item.text || '').toLowerCase()} `;
    const checks = [];
    if (s.questions && s.questions.length) checks.push(s.questions.includes(item.id));
    if (s.controls && s.controls.length) checks.push(!!(item.control && s.controls.includes(item.control.id)));
    if (s.domains && s.domains.length) checks.push(!!(item.control && s.domains.includes(item.control.domain)));
    if (s.keywords && s.keywords.length) checks.push(s.keywords.some(k => new RegExp('(?<![a-z0-9])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![a-z0-9])').test(text)));
    if (!checks.length) return true;
    return checks.some(Boolean);
  }

  function evaluateApplicability(item, ctx) {
    const rules = ctx.rules || DEFAULT_RULES;
    for (const rule of rules) {
      if (!rule || rule.enabled === false) continue;
      if (!ruleMatchesQuestion(rule, item, ctx.frameworkId)) continue;
      const conditions = rule.when || [];
      if (conditions.length && conditions.every(c => testCondition(c, ctx))) {
        return { hidden: rule.effect === 'hide', suggestNA: rule.effect === 'suggest_na', reason: rule.description, ruleId: rule.id };
      }
    }
    return { hidden: false, suggestNA: false, reason: '', ruleId: null };
  }

  // ── Flatten framework data with control metadata ──
  function buildItems(frameworkId, data, config) {
    const cfg = resolveConfig(config);
    const items = [];
    (data.modules || []).forEach((mod, mi) => {
      (mod.categories || []).forEach((cat, ci) => {
        (cat.questions || []).forEach((q, qi) => {
          const mapped = Controls.mapQuestionToControl(q, { frameworkId, categoryId: cat.id, overrides: cfg.questionOverrides });
          const tierInfo = inferTier(q, mapped.control, cfg.questionOverrides);
          const ov = cfg.questionOverrides[q.id] || {};
          const evidenceRequired = ov.evidenceRequired !== undefined
            ? !!ov.evidenceRequired
            : !!(mapped.control && mapped.control.evidenceRequired && (tierInfo.tier === 'critical' || tierInfo.tier === 'high'));
          items.push({
            id: q.id,
            text: q.text,
            context: q.context || '',
            options: q.options || [],
            moduleIndex: mi, categoryIndex: ci, questionIndex: qi,
            moduleId: mod.id, moduleName: mod.name,
            categoryId: cat.id, categoryName: cat.name,
            control: mapped.control,
            mappingMethod: mapped.method,
            tier: tierInfo.tier,
            tierSource: tierInfo.source,
            weight: Number(ov.weight) > 0 ? Number(ov.weight) : (cfg.tierWeights[tierInfo.tier] || 1),
            evidenceRequired
          });
        });
      });
    });
    return items;
  }

  // ── Risk context ──
  function riskContext(profile) {
    const p = profile || {};
    const factors = [];
    let multiplier = 1;
    const add = (amount, label) => { multiplier += amount; factors.push({ factor: label, adjustment: amount }); };

    const dataTypes = Array.isArray(p.dataTypes) ? p.dataTypes : [];
    const sensitive = dataTypes.filter(d => ['health', 'payment', 'financial', 'children', 'biometric'].includes(d));
    if (sensitive.length) add(Math.min(0.2, Math.round(sensitive.length * 0.07 * 100) / 100), `Processes sensitive data (${sensitive.join(', ')})`);

    const regs = Array.isArray(p.regulations) ? p.regulations : [];
    if (regs.length >= 3) add(0.05, `Subject to ${regs.length} regulatory or contractual regimes`);

    if (p.recentIncidents === 'yes') add(0.1, 'Security incident in the last 24 months');
    if (p.employeeCount === '1000+') add(0.1, 'Large organisation (1000+ employees)');
    else if (p.employeeCount === '250 - 1000') add(0.05, 'Mid-sized organisation (250-1000 employees)');
    if (Array.isArray(p.technology) && p.technology.includes('ot')) add(0.05, 'Operational technology or connected devices in scope');
    if (p.internetFacing === 'yes') add(0.05, 'Customer-facing internet services');
    if (p.businessCriticality === 'high') add(0.1, 'Critical services with low tolerance for downtime');

    multiplier = Math.min(1.5, Math.round(multiplier * 100) / 100);
    return { multiplier, factors };
  }

  function severityFor(item, fraction, state, context, cfg) {
    const level = state === 'scored' ? gapLevel(fraction) : 'major';
    if (level === 'none') return null;
    let severity = SEVERITY_MATRIX[item.tier][level];
    const rationale = [`${Controls.CRITICALITY_TIERS[item.tier].label} control with ${level === 'major' ? 'a major' : level === 'partial' ? 'a partial' : 'a minor'} gap`];
    if (state === 'unknown') rationale.push('implementation status unknown, treated as not implemented');
    if (state === 'planned') rationale.push('control is planned but not yet implemented');
    // Context can raise a finding on a critical control by one level, but
    // never to Critical: that level is reserved for critical controls that
    // are essentially absent.
    if (context.multiplier >= cfg.contextElevationThreshold && item.tier === 'critical') {
      const idx = SEVERITIES.indexOf(severity);
      if (idx > 1) {
        severity = SEVERITIES[idx - 1];
        rationale.push(`raised one level for organisational risk context (multiplier ${context.multiplier})`);
      }
    }
    return { severity, gapLevel: level, rationale: rationale.join('; ') };
  }

  // Confidence reflects completion, the quality of support for critical and
  // high controls, and how many answers are "Unknown". A fully answered but
  // purely self-attested assessment cannot reach High confidence.
  function confidenceFor(stats) {
    const completion = stats.applicable > 0 ? stats.answered / stats.applicable : 0;
    const evidence = stats.evidenceBase > 0 ? stats.evidenceWeight / stats.evidenceBase : 0;
    const unknownRatio = stats.answered > 0 ? stats.unknown / stats.answered : 0;
    let score = Math.round(100 * (0.35 * completion + 0.50 * evidence + 0.15 * (1 - unknownRatio)));
    if (stats.answered === 0) score = 0;
    let label = score >= 75 && evidence >= 0.6 ? 'High' : score >= 50 ? 'Moderate' : 'Low';
    if (completion < 0.5) label = 'Low';
    return {
      score,
      label,
      factors: {
        completion: Math.round(completion * 100),
        evidenceQuality: Math.round(evidence * 100),
        unknownAnswers: stats.unknown,
        validatedControls: stats.validated
      }
    };
  }

  function buildRecommendation(item) {
    const c = item.control;
    if (!c) {
      return {
        summary: 'The control is implemented consistently and evidence of its operation is retained.',
        quickWin: 'Assign an owner and document the current state and gap.',
        mediumTerm: 'Implement the control and collect evidence of operation.',
        longTerm: 'Monitor effectiveness and review annually.',
        owner: 'Control owner',
        reference: ''
      };
    }
    return {
      summary: c.expectedState,
      quickWin: c.remediation.quickWin,
      mediumTerm: c.remediation.mediumTerm,
      longTerm: c.remediation.longTerm,
      owner: c.remediation.owner,
      reference: c.remediation.reference
    };
  }

  /**
   * Score an assessment.
   * @param {object} input
   *   frameworkId, data (framework modules), answers, evidence ({qid: count}),
   *   profile, config
   */
  // Snapshot scope: one question per canonical control (the most critical,
  // then the first in the template), so every control is covered once.
  function coreQuestionIds(items) {
    const rank = { critical: 0, high: 1, medium: 2, foundational: 3 };
    const best = {};
    items.forEach(it => {
      const key = it.control ? it.control.id : `q:${it.id}`;
      if (!best[key] || rank[it.tier] < rank[best[key].tier]) best[key] = it;
    });
    return new Set(Object.values(best).map(it => it.id));
  }

  function scoreAssessment(input) {
    const cfg = resolveConfig(input.config);
    const frameworkId = input.frameworkId;
    const scope = input.scope === 'core' ? 'core' : 'full';
    const answers = input.answers || {};
    const evidence = input.evidence || {};
    const profile = input.profile || {};
    const items = buildItems(frameworkId, input.data || { modules: [] }, cfg);
    const questionIndex = items.reduce((acc, it) => { acc[it.id] = it; return acc; }, {});
    const context = riskContext(profile);
    const core = scope === 'core' ? coreQuestionIds(items) : null;
    const rules = cfg.applicabilityRules || DEFAULT_RULES;
    const applyCtx = { profile, answers, frameworkId, rules, questionIndex };

    const domainWeights = (cfg.domainWeights && cfg.domainWeights[frameworkId]) || {};
    const moduleMap = new Map();
    const controlsOut = [];
    const findings = [];
    const criticalFailures = [];
    const stats = { total: items.length, applicable: 0, answered: 0, unknown: 0, planned: 0, na: 0, hidden: 0, evidenceWeight: 0, evidenceBase: 0, validated: 0 };
    const tierCells = {};
    const refCounters = {};

    items.forEach(item => {
      if (!moduleMap.has(item.moduleId)) {
        moduleMap.set(item.moduleId, {
          id: item.moduleId, name: item.moduleName, index: item.moduleIndex,
          earned: 0, possible: 0, answered: 0, applicable: 0, total: 0,
          criticalFailures: 0, categories: new Map()
        });
      }
      const mod = moduleMap.get(item.moduleId);
      mod.total++;
      if (!mod.categories.has(item.categoryId)) {
        mod.categories.set(item.categoryId, { id: item.categoryId, name: item.categoryName, earned: 0, possible: 0, answered: 0, total: 0 });
      }
      const cat = mod.categories.get(item.categoryId);
      cat.total++;

      const applicability = core && !core.has(item.id)
        ? { hidden: true, suggestNA: false, reason: 'Not part of the Snapshot scope', ruleId: 'scope' }
        : evaluateApplicability(item, applyCtx);
      const rec = normaliseAnswer(answers[item.id]);
      const evidenceCount = Number(evidence[item.id] || 0);
      let state = 'unanswered';
      let fraction = null;
      let answerLabel = '';

      if (applicability.hidden) {
        state = 'hidden';
        stats.hidden++;
      } else if (rec && rec.v === ANSWER_STATES.NA) {
        state = 'na';
        stats.na++;
        answerLabel = 'Not applicable';
      } else {
        stats.applicable++;
        mod.applicable++;
        if (rec) {
          if (rec.v === ANSWER_STATES.UNKNOWN) { state = 'unknown'; fraction = 0; answerLabel = 'Unknown'; stats.unknown++; }
          else if (rec.v === ANSWER_STATES.PLANNED) { state = 'planned'; fraction = 0; answerLabel = 'Planned'; stats.planned++; }
          else {
            state = 'scored';
            fraction = answerFraction(item, rec.v);
            const opt = item.options.find(o => Number(o.value) === Number(rec.v));
            answerLabel = opt ? opt.label : String(rec.v);
          }
        }
      }

      const answered = state === 'scored' || state === 'unknown' || state === 'planned';
      const earned = answered ? fraction * item.weight : 0;
      const possible = answered ? item.weight : 0;
      if (answered) {
        stats.answered++;
        mod.answered++;
        cat.answered++;
        mod.earned += earned; mod.possible += possible;
        cat.earned += earned; cat.possible += possible;

        if (item.tier === 'critical' || item.tier === 'high') {
          const level = CONFIDENCE_LEVELS[rec.c] || CONFIDENCE_LEVELS['self-attested'];
          let weight = level.weight;
          if (evidenceCount > 0 && level.rank === 0) weight = CONFIDENCE_LEVELS['evidence-supported'].weight;
          stats.evidenceWeight += weight;
          stats.evidenceBase += 1;
          if (level.rank >= 2) stats.validated++;
        }

        const cellKey = `${item.moduleId}|${item.tier}`;
        if (!tierCells[cellKey]) tierCells[cellKey] = { earned: 0, possible: 0, count: 0 };
        tierCells[cellKey].earned += earned;
        tierCells[cellKey].possible += possible;
        tierCells[cellKey].count++;
      }

      const isCriticalFailure = answered && item.tier === 'critical' && fraction < cfg.gating.failureThreshold;
      if (isCriticalFailure) {
        criticalFailures.push({ id: item.id, text: item.text, moduleName: item.moduleName, control: item.control ? item.control.id : null });
        mod.criticalFailures++;
      }

      const confidenceLevel = rec && rec.c ? rec.c : 'self-attested';
      controlsOut.push({
        id: item.id,
        text: item.text,
        moduleId: item.moduleId, moduleName: item.moduleName,
        categoryId: item.categoryId, categoryName: item.categoryName,
        controlId: item.control ? item.control.id : null,
        controlName: item.control ? item.control.name : null,
        domain: item.control ? item.control.domain : null,
        mappingMethod: item.mappingMethod,
        tier: item.tier,
        weight: item.weight,
        state,
        value: rec ? rec.v : null,
        answerLabel,
        fraction,
        earned: Math.round(earned * 100) / 100,
        possible,
        confidenceLevel,
        evidenceCount,
        evidenceRequired: item.evidenceRequired,
        applicability
      });

      // Findings for answered items with a gap
      if (answered) {
        const sev = severityFor(item, fraction, state, context, cfg);
        if (sev) {
          refCounters[item.moduleIndex] = (refCounters[item.moduleIndex] || 0) + 1;
          const ref = `${item.moduleIndex + 1}.${String(refCounters[item.moduleIndex]).padStart(2, '0')}`;
          const likelihood = sev.gapLevel === 'major' ? 3 : sev.gapLevel === 'partial' ? 2 : 1;
          const impact = { critical: 4, high: 3, medium: 2, foundational: 1 }[item.tier];
          const recommendation = buildRecommendation(item);
          findings.push({
            id: item.id,
            ref,
            title: item.control ? `${item.control.name}: ${item.text}` : item.text,
            question: item.text,
            controlId: item.control ? item.control.id : null,
            controlName: item.control ? item.control.name : null,
            controlObjective: item.control ? item.control.objective : '',
            domain: item.control ? item.control.domain : null,
            moduleId: item.moduleId,
            moduleName: item.moduleName,
            categoryName: item.categoryName,
            tier: item.tier,
            severity: sev.severity,
            severityLabel: SEVERITY_LABELS[sev.severity],
            severityRationale: sev.rationale,
            gapLevel: sev.gapLevel,
            state,
            answerLabel,
            fraction,
            likelihood,
            impact,
            timeframe: SEVERITY_TIMEFRAME[sev.severity],
            confidenceLevel,
            evidenceCount,
            evidenceRequired: item.evidenceRequired,
            frameworkRefs: item.control ? item.control.mappings : {},
            recommendation
          });
        }
      }
    });

    // Domain (module) scores
    const modules = Array.from(moduleMap.values()).sort((a, b) => a.index - b.index).map(m => {
      const percentage = m.possible > 0 ? Math.round((m.earned / m.possible) * 100) : null;
      const maturity = percentage === null ? null : maturityFor(percentage);
      const categories = Array.from(m.categories.values()).map(c => ({
        id: c.id, name: c.name, answered: c.answered, total: c.total,
        percentage: c.possible > 0 ? Math.round((c.earned / c.possible) * 100) : null
      }));
      const explanation = percentage === null
        ? 'Not yet assessed.'
        : `${maturity.name}: ${maturity.description} ${m.answered} of ${m.applicable} applicable controls assessed${m.criticalFailures ? `; ${m.criticalFailures} critical control${m.criticalFailures > 1 ? 's' : ''} not in place` : ''}.`;
      return {
        id: m.id, name: m.name,
        weight: domainWeights[m.id] !== undefined ? Number(domainWeights[m.id]) : null,
        earned: Math.round(m.earned * 100) / 100,
        possible: m.possible,
        percentage,
        maturity,
        explanation,
        answered: m.answered,
        applicable: m.applicable,
        total: m.total,
        criticalFailures: m.criticalFailures,
        categories
      };
    });

    // Domain weights: explicit weights if configured (must sum to 100), otherwise equal.
    const scoredModules = modules.filter(m => m.percentage !== null);
    const explicit = scoredModules.length > 0 && scoredModules.every(m => m.weight !== null);
    let weightSum = 0;
    let weighted = 0;
    scoredModules.forEach(m => {
      const w = explicit ? m.weight : 1;
      weightSum += w;
      weighted += w * (m.earned / m.possible) * 100;
    });
    modules.forEach(m => {
      if (m.percentage === null) { m.effectiveWeight = 0; return; }
      m.effectiveWeight = weightSum > 0 ? Math.round(((explicit ? m.weight : 1) / weightSum) * 1000) / 10 : 0;
    });
    const rawScore = weightSum > 0 ? Math.round(weighted / weightSum) : 0;

    // Critical-control gating
    let healthScore = rawScore;
    let capped = false;
    let capReason = '';
    if (cfg.gating.enabled && criticalFailures.length > 0) {
      const cap = criticalFailures.length >= cfg.gating.multiFailureCount ? cfg.gating.multiFailureCap : cfg.gating.oneFailureCap;
      if (rawScore > cap) {
        healthScore = cap;
        capped = true;
        capReason = `Score limited to ${cap} because ${criticalFailures.length} critical control${criticalFailures.length > 1 ? 's are' : ' is'} not in place.`;
      }
    }

    const severityCounts = SEVERITIES.reduce((acc, s) => { acc[s] = 0; return acc; }, {});
    findings.forEach(f => { severityCounts[f.severity]++; });
    findings.sort((a, b) => SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity) || (a.fraction - b.fraction));

    // Risk exposure is reported separately from health. It combines the
    // control gap, the concentration of critical/high findings and the
    // organisational risk context (see METHODOLOGY.md).
    const pressureBase = Math.max(10, stats.applicable * 0.25);
    const pressure = Math.min(1, (severityCounts.critical + 0.5 * severityCounts.high) / pressureBase) * 15;
    const contextFactor = 1 + (context.multiplier - 1) * 0.5;
    const riskScore = stats.answered === 0 ? null
      : Math.max(0, Math.min(100, Math.round(((100 - healthScore) * 0.85 + pressure) * contextFactor)));
    const riskBand = riskScore === null ? null
      : riskScore < cfg.riskBands.low ? 'Low'
      : riskScore < cfg.riskBands.moderate ? 'Moderate'
      : riskScore < cfg.riskBands.high ? 'High' : 'Severe';
    const healthBand = healthScore >= cfg.scoreBands.strong ? 'Strong' : healthScore >= cfg.scoreBands.moderate ? 'Moderate' : 'Weak';

    // Heatmap cells: module x tier
    const heatmap = modules.map(m => ({
      moduleId: m.id,
      moduleName: m.name,
      cells: Object.keys(Controls.CRITICALITY_TIERS).map(tier => {
        const cell = tierCells[`${m.id}|${tier}`];
        return { tier, count: cell ? cell.count : 0, percentage: cell && cell.possible > 0 ? Math.round((cell.earned / cell.possible) * 100) : null };
      })
    }));

    // Risk matrix: likelihood (gap) x impact (tier)
    const riskMatrix = {};
    findings.forEach(f => {
      const key = `${f.likelihood}|${f.impact}`;
      riskMatrix[key] = (riskMatrix[key] || 0) + 1;
    });

    // Evidence that must be attached before finalisation
    const missingEvidence = controlsOut.filter(c => c.evidenceRequired && c.state === 'scored' && c.fraction >= 0.66 && c.evidenceCount === 0 && (CONFIDENCE_LEVELS[c.confidenceLevel] || { rank: 0 }).rank < 2)
      .map(c => ({ id: c.id, text: c.text, controlId: c.controlId, moduleName: c.moduleName }));

    // Reference framework coverage
    const frameworkCoverage = {};
    Object.keys(Controls.FRAMEWORK_REFERENCES).forEach(refId => {
      const refs = {};
      controlsOut.forEach(c => {
        if (!c.controlId || c.state === 'hidden' || c.state === 'na') return;
        const ctrl = Controls.CONTROL_INDEX[c.controlId];
        (ctrl.mappings[refId] || []).filter(r => r && r !== '—').forEach(r => {
          if (!refs[r]) refs[r] = { ref: r, earned: 0, possible: 0, items: 0, controls: new Set() };
          refs[r].items++;
          refs[r].controls.add(c.controlId);
          if (c.fraction !== null) { refs[r].earned += c.fraction * c.weight; refs[r].possible += c.weight; }
        });
      });
      frameworkCoverage[refId] = Object.values(refs).map(r => ({
        ref: r.ref, items: r.items, controls: Array.from(r.controls),
        percentage: r.possible > 0 ? Math.round((r.earned / r.possible) * 100) : null
      })).sort((a, b) => String(a.ref).localeCompare(String(b.ref), undefined, { numeric: true }));
    });

    return {
      meta: {
        frameworkId, scope, scoringModelVersion: SCORING_MODEL_VERSION, configVersion: cfg.version, computedAt: new Date().toISOString(),
        // Parameters needed to re-score this result (remediation projections).
        model: { gating: cfg.gating, scoreBands: cfg.scoreBands, riskBands: cfg.riskBands, contextElevationThreshold: cfg.contextElevationThreshold }
      },
      overall: {
        healthScore,
        rawScore,
        healthBand,
        capped,
        capReason,
        maturity: stats.answered ? maturityFor(healthScore) : null,
        riskScore,
        riskBand,
        riskContext: context,
        confidence: confidenceFor(stats),
        completion: {
          answered: stats.answered,
          applicable: stats.applicable,
          total: stats.total,
          notApplicable: stats.na,
          hidden: stats.hidden,
          unknown: stats.unknown,
          planned: stats.planned,
          percentage: stats.applicable > 0 ? Math.round((stats.answered / stats.applicable) * 100) : 0
        },
        criticalFailures,
        domainWeighting: explicit ? 'configured' : 'equal'
      },
      modules,
      controls: controlsOut,
      findings,
      severityCounts,
      heatmap,
      riskMatrix,
      missingEvidence,
      frameworkCoverage,
      threats: Threats ? Threats.evaluateThreats({ frameworkId, profile, controls: controlsOut, controlIndex: Controls.CONTROL_INDEX }) : null
    };
  }

  // ── Remediation projection ──
  // Re-scores an existing result with some controls set to new answer
  // fractions, using the same aggregation, gating, severity and risk rules as
  // scoreAssessment. Used to estimate what each remediation step is worth.
  function projectScores(result, fractions) {
    const model = deepMerge(DEFAULT_CONFIG, (result.meta && result.meta.model) || {});
    const o = result.overall;
    const multiplier = (o.riskContext && o.riskContext.multiplier) || 1;
    const mods = {};
    const severityCounts = SEVERITIES.reduce((acc, s) => { acc[s] = 0; return acc; }, {});
    let criticalFailures = 0;
    result.controls.forEach(c => {
      if (!['scored', 'unknown', 'planned'].includes(c.state)) return;
      const f = fractions && fractions[c.id] !== undefined ? fractions[c.id] : c.fraction;
      const m = mods[c.moduleId] || (mods[c.moduleId] = { earned: 0, possible: 0 });
      m.earned += f * c.weight;
      m.possible += c.weight;
      if (c.tier === 'critical' && f < model.gating.failureThreshold) criticalFailures++;
      // Unknown and Planned answers that are not improved stay major gaps.
      const level = fractions && fractions[c.id] !== undefined ? gapLevel(f) : (c.state === 'scored' ? gapLevel(f) : 'major');
      if (level === 'none') return;
      let sev = SEVERITY_MATRIX[c.tier][level];
      if (multiplier >= model.contextElevationThreshold && c.tier === 'critical') {
        const idx = SEVERITIES.indexOf(sev);
        if (idx > 1) sev = SEVERITIES[idx - 1];
      }
      severityCounts[sev]++;
    });
    const explicit = o.domainWeighting === 'configured';
    let weightSum = 0;
    let weighted = 0;
    result.modules.forEach(mod => {
      const m = mods[mod.id];
      if (!m || m.possible <= 0) return;
      const w = explicit ? Number(mod.weight) || 0 : 1;
      weightSum += w;
      // Domain points are rounded to two decimals, as in scoreAssessment.
      weighted += w * ((Math.round(m.earned * 100) / 100) / m.possible) * 100;
    });
    const raw = weightSum > 0 ? weighted / weightSum : 0;
    let health = raw;
    if (model.gating.enabled && criticalFailures > 0) {
      const cap = criticalFailures >= model.gating.multiFailureCount ? model.gating.multiFailureCap : model.gating.oneFailureCap;
      // Gating compares the rounded score, as scoreAssessment does.
      if (Math.round(raw) > cap) health = cap;
    }
    const applicable = (o.completion && o.completion.applicable) || 0;
    const pressureBase = Math.max(10, applicable * 0.25);
    const pressure = Math.min(1, (severityCounts.critical + 0.5 * severityCounts.high) / pressureBase) * 15;
    const contextFactor = 1 + (multiplier - 1) * 0.5;
    // riskScore follows scoreAssessment exactly (rounded health); risk keeps
    // full precision so small per-action changes are not lost to rounding.
    const risk = Math.max(0, Math.min(100, ((100 - health) * 0.85 + pressure) * contextFactor));
    const healthScore = Math.round(health);
    const riskScore = Math.max(0, Math.min(100, Math.round(((100 - healthScore) * 0.85 + pressure) * contextFactor)));
    return {
      health, risk, healthScore, riskScore, criticalFailures, severityCounts,
      capped: health !== raw,
      healthBand: healthScore >= model.scoreBands.strong ? 'Strong' : healthScore >= model.scoreBands.moderate ? 'Moderate' : 'Weak',
      riskBand: riskScore < model.riskBands.low ? 'Low' : riskScore < model.riskBands.moderate ? 'Moderate' : riskScore < model.riskBands.high ? 'High' : 'Severe',
      maturity: maturityFor(healthScore)
    };
  }

  // Each remediation stage closes a share of the remaining gap on a control:
  // quick win one third, 1-3 month work two thirds, long-term work all of it.
  // From "Not implemented" this is Partially, then Largely, then Fully.
  const REMEDIATION_STAGES = [
    { id: 'now', step: 'quickWin', closes: 1 / 3 },
    { id: 'next', step: 'mediumTerm', closes: 2 / 3 },
    { id: 'later', step: 'longTerm', closes: 1 }
  ];

  function projectRemediation(result) {
    const baseline = projectScores(result, {});
    const findings = result.findings || [];
    const target = (f, closes) => {
      const from = f.fraction === null || f.fraction === undefined ? 0 : f.fraction;
      return closes >= 1 ? 1 : from + (1 - from) * closes;
    };
    const stageMap = closes => findings.reduce((acc, f) => { acc[f.id] = target(f, closes); return acc; }, {});
    const maps = REMEDIATION_STAGES.map(s => stageMap(s.closes));
    const totals = maps.map(m => projectScores(result, m));

    // Group findings by control, as the report does.
    const groups = new Map();
    findings.forEach(f => {
      const key = f.controlId || f.id;
      if (!groups.has(key)) groups.set(key, { key, controlId: f.controlId, controlName: f.controlName || f.question, severity: f.severity, recommendation: f.recommendation, items: [] });
      const g = groups.get(key);
      if (SEVERITIES.indexOf(f.severity) < SEVERITIES.indexOf(g.severity)) g.severity = f.severity;
      g.items.push(f);
    });

    const round1 = n => Math.round(n * 10) / 10;
    const actions = Array.from(groups.values()).map(g => {
      const steps = {};
      REMEDIATION_STAGES.forEach((s, i) => {
        const before = i === 0 ? {} : maps[i - 1];
        const beforeScores = i === 0 ? baseline : totals[i - 1];
        const fr = { ...before };
        g.items.forEach(f => { fr[f.id] = target(f, s.closes); });
        const after = projectScores(result, fr);
        steps[s.id] = {
          action: g.recommendation ? g.recommendation[s.step] : '',
          health: round1(after.health - beforeScores.health),
          risk: round1(after.risk - beforeScores.risk),
          liftsCap: beforeScores.capped && after.criticalFailures < beforeScores.criticalFailures
        };
      });
      return {
        key: g.key, controlId: g.controlId, controlName: g.controlName, severity: g.severity,
        owner: g.recommendation ? g.recommendation.owner : '', findingCount: g.items.length,
        findingIds: g.items.map(f => f.id), steps
      };
    }).sort((a, b) => SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity) || b.steps.now.health - a.steps.now.health);

    const summary = s => ({ healthScore: s.healthScore, riskScore: s.riskScore, healthBand: s.healthBand, riskBand: s.riskBand, maturity: s.maturity.name, capped: s.capped, criticalFailures: s.criticalFailures });
    return {
      baseline: summary(baseline),
      stages: REMEDIATION_STAGES.map((s, i) => ({ id: s.id, closes: s.closes, ...summary(totals[i]) })),
      actions
    };
  }

  // Score lift per fix. Controls are fixed one at a time in priority order
  // (most severe first, then the largest stand-alone gain), each re-scored on
  // top of the fixes before it. The gains therefore add up to the final score,
  // and the fix that lifts a critical-control cap is credited with that jump.
  function projectActionLadder(result) {
    const baseline = projectScores(result, {});
    const findings = result.findings || [];
    const sevIdx = s => SEVERITIES.indexOf(s);
    const round1 = n => Math.round(n * 10) / 10;

    const groups = new Map();
    findings.forEach(f => {
      const key = f.controlId || f.id;
      if (!groups.has(key)) groups.set(key, { key, controlId: f.controlId, controlName: f.controlName || f.question, severity: f.severity, timeframe: f.timeframe, recommendation: f.recommendation, items: [] });
      const g = groups.get(key);
      if (sevIdx(f.severity) < sevIdx(g.severity)) { g.severity = f.severity; g.timeframe = f.timeframe; }
      g.items.push(f);
    });
    const list = Array.from(groups.values());
    list.forEach(g => {
      const fr = {};
      g.items.forEach(f => { fr[f.id] = 1; });
      g.solo = projectScores(result, fr).health - baseline.health;
    });
    list.sort((a, b) => sevIdx(a.severity) - sevIdx(b.severity) || b.solo - a.solo || b.items.length - a.items.length);

    const fixed = {};
    let prev = baseline;
    const steps = list.map((g, i) => {
      const items = g.items.slice().sort((a, b) => sevIdx(a.severity) - sevIdx(b.severity)).map(f => {
        const before = projectScores(result, fixed).health;
        fixed[f.id] = 1;
        return { id: f.id, gain: round1(projectScores(result, fixed).health - before) };
      });
      const after = projectScores(result, fixed);
      const step = {
        rank: i + 1, key: g.key, controlId: g.controlId, controlName: g.controlName, severity: g.severity, timeframe: g.timeframe,
        recommendation: g.recommendation, owner: g.recommendation ? g.recommendation.owner : '', findingIds: g.items.map(f => f.id), items,
        gain: round1(after.health - prev.health), riskDrop: round1(prev.risk - after.risk),
        healthAfter: after.healthScore, riskAfter: after.riskScore, riskBandAfter: after.riskBand, maturityAfter: after.maturity.name,
        liftsCap: prev.capped && !after.capped
      };
      prev = after;
      return step;
    });
    return {
      baseline: { healthScore: baseline.healthScore, riskScore: baseline.riskScore, riskBand: baseline.riskBand, maturity: baseline.maturity.name, capped: baseline.capped },
      final: { healthScore: prev.healthScore, riskScore: prev.riskScore, riskBand: prev.riskBand, maturity: prev.maturity.name },
      steps
    };
  }

  const api = {
    SCORING_MODEL_VERSION,
    ANSWER_STATES,
    CONFIDENCE_LEVELS,
    MATURITY_LEVELS,
    SEVERITIES,
    SEVERITY_LABELS,
    SEVERITY_TIMEFRAME,
    SEVERITY_MATRIX,
    DEFAULT_CONFIG,
    DEFAULT_RULES,
    resolveConfig,
    normaliseAnswer,
    answerFraction,
    gapLevel,
    maturityFor,
    riskContext,
    buildItems,
    evaluateApplicability,
    coreQuestionIds,
    scoreAssessment,
    projectScores,
    projectRemediation,
    projectActionLadder,
    REMEDIATION_STAGES
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.HawkScoring = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
