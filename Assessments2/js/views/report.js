// ============================================
// HawkSight — Reports
// Report document (issued and sample), report list and comparison.
// ============================================

(function (root) {
  const { html, raw, icon, esc, $, $all, setHtml, on, fmtDate, fmtDateTime, ageLabel, plural, severityBadge, SEVERITY_ORDER, SEVERITY_LABEL, scaleColor } = root.U;
  const { App, API, UI, Content } = root;
  const Controls = root.HawkControls;
  const Threats = root.HawkThreats;

  const TIER_LABEL = { critical: 'Critical', high: 'High', medium: 'Medium', foundational: 'Foundational' };
  const STATE_LABEL = { scored: 'Answered', na: 'Not applicable', unknown: 'Unknown', planned: 'Planned', unanswered: 'Not answered', hidden: 'Not in scope' };
  const CONF_LABEL = { 'self-attested': 'Self-attested', 'evidence-supported': 'Evidence-supported', 'assessor-validated': 'Assessor-validated', 'externally-verified': 'Externally verified' };
  const REF_ORDER = ['nist_csf_2', 'iso27001', 'cis_v8', 'soc2', 'pci_dss', 'hipaa', 'dpdp', 'gdpr'];

  let doc = null; // current report model for interactive handlers

  // Remediation stages as presented to the reader. The engine estimates the
  // position after each stage (HawkScoring.projectRemediation).
  const STAGES = [
    { id: 'now', step: 'quickWin', title: 'Quick wins', when: 'Next 30 days',
      framing: 'Low-effort actions using the tools and people you already have.' },
    { id: 'next', step: 'mediumTerm', title: 'Core improvements', when: '1 to 3 months',
      framing: 'Planned changes with a named owner, usually configuration work, a process change or modest spend.' },
    { id: 'later', step: 'longTerm', title: 'Long-term investments', when: '3 to 12 months',
      framing: 'Capabilities that make the improvement last. They need budget and a sponsor in leadership.' }
  ];
  const STAGE_LIMIT = 6;

  function withPlan(d) {
    d.ladder = root.HawkScoring.projectActionLadder(d.result);
    d.liftByControl = {};
    d.ladder.steps.forEach(st => { d.liftByControl[st.key] = st; });
    return d;
  }

  // Score once every critical and high fix is done (or the first five fixes).
  function priorityMilestone(d) {
    const steps = d.ladder.steps;
    if (!steps.length) return null;
    const urgent = steps.filter(st => st.severity === 'critical' || st.severity === 'high');
    const upto = urgent.length && urgent.length < steps.length ? urgent.length : Math.min(5, steps.length);
    const last = steps[upto - 1];
    return { count: upto, urgent: urgent.length > 0 && urgent.length < steps.length, healthScore: last.healthAfter, riskBand: last.riskBandAfter };
  }

  function isSnapshot(d) {
    return !!(d.result.meta && d.result.meta.scope === 'core');
  }

  function normalise(payload) {
    if (payload.sample) {
      return {
        sample: true, reportId: null, title: payload.title, orgName: payload.profile.organizationName,
        framework: payload.framework, frameworkVersion: `${payload.framework.shortName} template ${payload.framework.templateVersion} (${payload.framework.basis})`,
        version: 1, reviewType: payload.reviewType, issuedAt: payload.issuedAt, hash: null, branding: {}, profile: payload.profile,
        result: payload.result, aiSummary: null, assessorName: null, history: [], previous: null, scoringModelVersion: payload.result.meta.scoringModelVersion,
        configVersion: payload.result.meta.configVersion, tenantId: null, frameworkId: payload.frameworkId
      };
    }
    const r = payload.report;
    return {
      sample: false, reportId: r.id, title: r.title, orgName: r.profile.organizationName || r.tenant.name, framework: r.framework,
      frameworkVersion: r.frameworkVersion, version: r.version, reviewType: r.reviewType, issuedAt: r.issuedAt, hash: r.contentHash,
      branding: r.branding || {}, profile: r.profile, result: r.result, aiSummary: r.aiSummary, assessorName: r.assessorName,
      history: payload.history || [], previous: payload.previous, scoringModelVersion: r.scoringModelVersion, configVersion: r.configVersion,
      tenantId: r.tenantId, frameworkId: r.frameworkId, isDemo: r.tenant && r.tenant.isDemo
    };
  }
  function prepare(payload) {
    return withPlan(normalise(payload));
  }

  // Lower-case the first letter unless it starts an acronym (e.g. "OT").
  // A single-letter word such as "A" is not an acronym.
  function lowerFirst(text) {
    return /^[A-Z]([a-z]|\s)/.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text;
  }

  // ── Deterministic executive summary ──
  function executiveSummary(d) {
    const o = d.result.overall;
    const mods = d.result.modules.filter(m => m.percentage !== null).slice().sort((a, b) => b.percentage - a.percentage);
    const paras = [];
    paras.push(`${d.orgName} scores ${o.healthScore} out of 100 for cyber health, which HawkSight rates as ${o.healthBand.toLowerCase()}, at maturity level ${o.maturity.level} (${o.maturity.name}).${o.capped ? ` The score is held at ${o.healthScore} because ${o.criticalFailures.length === 1 ? 'a critical safeguard is' : 'critical safeguards are'} not in place; it would otherwise be ${o.rawScore}.` : ''} Risk exposure is ${o.riskBand.toLowerCase()} (${o.riskScore} out of 100).`);
    const attack = attackSummaryText(d);
    if (attack) paras.push(attack);
    if (mods.length > 1) {
      const strongest = mods[0];
      const weakest = mods.slice(-2).reverse();
      paras.push(`${strongest.name} is the strongest area (${strongest.percentage}). The most attention is needed in ${weakest.map(m => `${m.name} (${m.percentage})`).join(' and ')}.`);
    }
    const top = groupFindings(d, ['critical', 'high']).slice(0, 3).map(g => g.controlName);
    const ms = priorityMilestone(d);
    if (top.length && ms) paras.push(`The most urgent priorities are ${top.length > 1 ? `${top.slice(0, -1).map(lowerFirst).join(', ')} and ${lowerFirst(top[top.length - 1])}` : lowerFirst(top[0])}. Fixing the ${ms.count} ${ms.urgent ? 'critical and high priority controls' : 'highest-priority controls'} in the remediation plan is expected to raise the score to about ${ms.healthScore} and bring risk exposure to ${ms.riskBand.toLowerCase()}.`);
    const c = o.confidence;
    paras.push(`Confidence in these results is ${c.label.toLowerCase()}: ${c.factors.completion}% of questions answered and ${c.factors.evidenceQuality}% evidence quality for the most important controls${c.factors.validatedControls ? `, with ${plural(c.factors.validatedControls, 'control')} independently validated` : ''}.`);
    return paras;
  }

  // Group findings by control so related questions appear once, with one
  // recommendation, ordered by the most severe finding in the group.
  function groupFindings(d, severities) {
    const groups = new Map();
    d.result.findings.filter(f => !severities || severities.includes(f.severity)).forEach(f => {
      const key = f.controlId || f.id;
      if (!groups.has(key)) groups.set(key, { key, controlName: f.controlName || f.question, severity: f.severity, timeframe: f.timeframe, recommendation: f.recommendation, objective: f.controlObjective, items: [] });
      const g = groups.get(key);
      if (SEVERITY_ORDER.indexOf(f.severity) < SEVERITY_ORDER.indexOf(g.severity)) { g.severity = f.severity; g.timeframe = f.timeframe; }
      g.items.push(f);
    });
    return Array.from(groups.values()).sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) || b.items.length - a.items.length);
  }

  function moduleOverall(result) {
    const map = {};
    result.modules.forEach(m => { map[m.id] = m.percentage; });
    return result.heatmap.map(r => ({ ...r, overall: map[r.moduleId] }));
  }


  // ── Attack paths ──
  const INDUSTRY_PEERS = {
    healthcare: 'healthcare organisations', retail: 'retailers', fintech: 'financial services firms', manufacturing: 'manufacturers',
    education: 'education institutions', itservices: 'IT services and SaaS companies', hospitality: 'hospitality businesses',
    logistics: 'logistics operators', professional: 'professional services firms'
  };
  const PATH_STATUS = {
    open: ['Open', 'badge-critical'], partial: ['Partly defended', 'badge-medium'],
    defended: ['Defended', 'badge-success'], unassessed: ['Not assessed', 'badge-outline']
  };
  const STAGE_STATUS = { strong: 'Strong', weak: 'Weak', open: 'Open', unassessed: 'Not assessed' };
  const RECOVERY_TEXT = {
    strong: 'Recovery capability is strong if this attack succeeds.',
    weak: 'Recovery would be slow if this attack succeeds.',
    open: 'Recovery would be severely disrupted if this attack succeeds.',
    unassessed: ''
  };

  function threatModel(d) {
    const t = d.result.threats;
    return t && Array.isArray(t.scenarios) ? t : null;
  }

  function assessedPaths(t) {
    return t.scenarios.filter(s => s.status !== 'unassessed');
  }

  function attackSummaryText(d) {
    const t = threatModel(d);
    if (!t) return '';
    const paths = assessedPaths(t);
    if (!paths.length) return '';
    const peers = INDUSTRY_PEERS[t.industry] || 'organisations like yours';
    const first = paths[0];
    const lead = `HawkSight tested ${plural(paths.length, 'attack path')} that ${peers} are breached through. ${t.summary.open} ${t.summary.open === 1 ? 'is' : 'are'} open, ${t.summary.partial} only partly defended and ${t.summary.defended} defended.`;
    if (first.status === 'defended') return lead;
    return `${lead} The most exposed is ${lowerFirst(first.name)}${first.breaker ? `; strengthening ${lowerFirst(first.breaker.controlName)} would do the most to close it` : ''}.`;
  }

  function stageChain(sc) {
    return html`<ol class="attack-chain">${sc.stages.map(st => {
      const key = st.keyControl ? st.controls.find(c => c.id === st.keyControl) : null;
      const note = !key ? '' : st.mode === 'any' ? `Best barrier: ${key.name}` : st.controls.length > 1 ? `Weakest: ${key.name}` : key.name;
      return html`<li class="stage stage-${st.status} stage-type-${st.type}">
        <span class="stage-kind">${st.type === 'recover' ? 'Recover' : st.type === 'detect' ? 'Detect' : 'Stop'}</span>
        <span class="stage-name">${st.name}</span>
        <span class="stage-state">${STAGE_STATUS[st.status]}${st.strength !== null ? ` · ${Math.round(st.strength * 100)}%` : ''}</span>
        ${note ? html`<span class="stage-ctrl">${note}</span>` : ''}
      </li>`;
    })}</ol>`;
  }

  function attackCard(sc) {
    const lib = Threats ? Threats.SCENARIO_INDEX[sc.id] : null;
    const [label, cls] = PATH_STATUS[sc.status];
    return html`<div class="attack-card attack-${sc.status}">
      <div class="attack-head">
        <div><div class="finding-label">${sc.category} · ${sc.relevance} relevance</div><h4>${sc.name}</h4></div>
        <div class="attack-score"><span class="badge ${cls}">${label}</span>${sc.readiness !== null ? html`<span class="attack-readiness">Readiness <strong>${sc.readiness}</strong>/100</span>` : ''}</div>
      </div>
      ${lib ? html`<p class="attack-hook">${lib.hook}</p>` : ''}
      ${stageChain(sc)}
      ${sc.breaker ? html`<div class="attack-fix">${icon('shield')}<span><span class="muted">Best single fix:</span> <strong>${sc.breaker.controlName}</strong></span><span class="lift">+${sc.breaker.gain}<small>readiness</small></span></div>` : ''}
      ${lib ? html`<details class="readmore"><summary>How the attack works ${icon('chevronDown')}</summary>
        <p class="attack-story">${lib.narrative}</p>
        ${RECOVERY_TEXT[sc.recoveryStatus] ? html`<p class="attack-story"><strong>If it succeeds:</strong> ${lib.impact} ${RECOVERY_TEXT[sc.recoveryStatus]}</p>` : ''}
        ${lib.examples.length ? html`<div class="attack-examples"><span class="finding-label">It has happened before</span>${lib.examples.map(e => html`<p><strong>${e.org} (${e.year}).</strong> ${e.summary}</p>`)}</div>` : ''}
      </details>` : ''}
    </div>`;
  }

  function attackSection(d) {
    const t = threatModel(d);
    if (!t) return '';
    const paths = assessedPaths(t);
    if (!paths.length) return '';
    const shown = d.full ? paths : paths.filter(s => s.status !== 'defended').slice(0, 5);
    const peers = INDUSTRY_PEERS[t.industry] || 'organisations like yours';
    return html`
      <section class="report-section attack-section">
        <h2>How you could be attacked</h2>
        <p class="section-intro">Real attack paths used against ${peers}, tested against your answers. An attacker must pass every stage; one strong barrier stops them.</p>
        <div class="attack-tally">
          <div class="tally-open"><strong>${t.summary.open}</strong><span>Open</span></div>
          <div class="tally-partial"><strong>${t.summary.partial}</strong><span>Partly defended</span></div>
          <div class="tally-defended"><strong>${t.summary.defended}</strong><span>Defended</span></div>
        </div>
        ${t.breakers.length ? html`<h3 class="mt-24 mb-8">Fixes that break the most attack paths</h3>
          <div class="breaker-chips">${t.breakers.slice(0, 3).map((b, n) => html`<div class="breaker-chip" title="${b.scenarios.map(x => x.name).join('; ')}"><span class="finding-num">${n + 1}</span><strong>${b.controlName}</strong><span class="muted">breaks ${plural(b.scenarios.length, 'path')}</span></div>`)}</div>` : ''}
        <div class="mt-24">${shown.map(attackCard)}</div>
        ${!d.full && paths.length > shown.length ? html`<p class="small muted mt-8">${plural(paths.length - shown.length, 'further path')} ${paths.length - shown.length === 1 ? 'is' : 'are'} defended or lower priority; the detailed report shows every path.</p>` : ''}
        <p class="small muted mt-8">Readiness is directional, not a probability; see the methodology.</p>
      </section>`;
  }

  function snapshotAttacks(d) {
    const t = threatModel(d);
    if (!t) return '';
    const top = assessedPaths(t).filter(s => s.status !== 'defended').slice(0, 3);
    if (!top.length) return '';
    return html`<section class="report-section">
      <h2>How attackers could get in</h2>
      <p class="section-intro">The attack paths most likely to succeed against you today, and the single fix that would do most to stop each.</p>
      <div class="snap-attacks">${top.map(sc => {
        const lib = Threats ? Threats.SCENARIO_INDEX[sc.id] : null;
        const [label, cls] = PATH_STATUS[sc.status];
        return html`<div class="snap-attack snap-attack-${sc.status}"><div class="row" style="gap:8px"><strong>${sc.name}</strong><span class="badge ${cls}">${label}</span></div>
          ${lib ? html`<p>${lib.hook}</p>` : ''}
          ${sc.breaker ? html`<p class="small"><span class="muted">Break it:</span> ${sc.breaker.controlName}</p>` : ''}</div>`;
      })}</div>
    </section>`;
  }

  // ── Sections ──
  function cover(d) {
    const b = d.branding || {};
    return html`
      <section class="report-cover" style="${b.primaryColor ? `--report-accent:${esc(b.primaryColor)}` : ''}">
        <div class="cover-top">
          <div class="cover-logo">${b.logoDataUrl ? html`<img src="${b.logoDataUrl}" alt="${d.orgName} logo">` : root.U.wordmark('by HiQurate Ops', 'light')}</div>
          <div class="right small muted">${d.sample ? 'Sample report — fictional organisation' : 'Confidential'}<br>Report version ${d.version}</div>
        </div>
        <div class="eyebrow mt-24" style="margin-top:56px">${d.reviewType}</div>
        <h1 style="margin-top:8px">${d.framework.name}</h1>
        <div class="cover-org">${d.orgName}</div>
        <dl class="cover-meta">
          <div><dt>Issued</dt><dd>${fmtDate(d.issuedAt, { day: 'numeric', month: 'long', year: 'numeric' })}</dd></div>
          <div><dt>Template</dt><dd>${d.framework.shortName} v${d.framework.templateVersion}</dd></div>
          <div><dt>Scoring model</dt><dd>v${d.scoringModelVersion} · configuration ${d.configVersion}</dd></div>
          <div><dt>Assessor</dt><dd>${d.assessorName || (d.reviewType === 'Self-assessed' ? 'Self-assessment' : '—')}</dd></div>
          <div><dt>Prepared by</dt><dd>${b.preparedBy || 'HiQurate Ops using HawkSight'}</dd></div>
          <div><dt>Report fingerprint</dt><dd class="mono" title="${d.hash || ''}">${d.hash ? `${d.hash.slice(0, 16)}…` : '—'}</dd></div>
        </dl>
      </section>`;
  }

  function summarySection(d) {
    const o = d.result.overall;
    const paras = executiveSummary(d);
    return html`
      <section class="report-section">
        <h2>Executive summary</h2>
        <div class="headline mt-16">
          <div class="headline-score">${UI.scoreRing(o.healthScore, 'Cyber Health')}<div><div class="metric-label">Cyber Health Score</div><div class="metric-value" style="font-size:22px">${o.healthBand}</div><div class="metric-sub">${o.healthScore} out of 100${o.capped ? html` · held from ${o.rawScore}` : ''}</div></div></div>
          <div><div class="metric-label">Maturity</div><div class="metric-value" style="font-size:22px">${o.maturity.name}</div>${UI.maturityScale(o.maturity.level)}<div class="metric-sub">Level ${o.maturity.level} of 5</div></div>
          <div><div class="metric-label">Risk exposure</div><div class="metric-value" style="font-size:22px">${o.riskBand}</div><div class="metric-sub">${o.riskScore} out of 100</div></div>
          <div><div class="metric-label">Confidence</div><div class="metric-value" style="font-size:22px">${o.confidence.label}</div><div class="metric-sub">${o.completion.answered} of ${o.completion.applicable} answered</div></div>
        </div>
        ${takeaways(d)}
        <details class="readmore mt-16"><summary>Read the full summary ${icon('chevronDown')}</summary><div class="summary-text">${paras.map(p => html`<p>${p}</p>`)}</div></details>
        ${d.aiSummary ? html`<div class="panel mt-16"><div class="label mb-8">Executive narrative</div><div class="ai-output">${d.aiSummary}</div><div class="ai-label">Drafted with AI assistance from the verified results and reviewed before issue.</div></div>` : ''}
        <h3 class="mt-24 mb-8">Findings by severity</h3>
        ${severityBreakdown(d)}
      </section>`;
  }

  // Four short, scannable conclusions; the full narrative sits underneath.
  function takeaways(d) {
    const o = d.result.overall;
    const t = threatModel(d);
    const paths = t ? assessedPaths(t) : [];
    const exposed = paths.find(x => x.status !== 'defended');
    const mods = d.result.modules.filter(m => m.percentage !== null).slice().sort((a, b) => a.percentage - b.percentage);
    const ms = priorityMilestone(d);
    const cards = [];
    if (paths.length) cards.push({ tone: t.summary.open ? 'bad' : 'ok', label: 'Attack paths', value: `${t.summary.open} of ${paths.length} open`, sub: exposed ? `Most exposed: ${lowerFirst(exposed.name)}` : 'Every tested path is defended' });
    if (mods.length) cards.push({ tone: mods[0].percentage < 55 ? 'bad' : 'warn', label: 'Weakest area', value: `${mods[0].name}`, sub: `Scores ${mods[0].percentage}; strongest is ${mods[mods.length - 1].name} (${mods[mods.length - 1].percentage})` });
    const top = groupFindings(d, ['critical', 'high'])[0];
    if (top) cards.push({ tone: 'warn', label: 'Fix first', value: top.controlName, sub: d.liftByControl[top.key] ? `Adds about ${UI.fmtGain(d.liftByControl[top.key].gain).replace('+', '')} points on its own` : `${SEVERITY_LABEL[top.severity]} priority` });
    if (ms) cards.push({ tone: 'good', label: 'Where you could be', value: `${o.healthScore} → ${ms.healthScore}`, sub: `After the first ${ms.count} fixes · ${ms.riskBand.toLowerCase()} risk` });
    return html`<div class="takeaways mt-16">${cards.map(c => html`<div class="takeaway takeaway-${c.tone}"><span class="takeaway-label">${c.label}</span><strong>${c.value}</strong><span class="takeaway-sub">${c.sub}</span></div>`)}</div>`;
  }

  function explainSection(d) {
    const o = d.result.overall;
    const mods = d.result.modules.filter(m => m.percentage !== null);
    const openCount = id => d.result.findings.filter(f => f.moduleId === id && (f.severity === 'critical' || f.severity === 'high')).length;
    return html`
      <section class="report-section domain-section">
        <h2>Results by domain</h2>
        <p class="section-intro no-print">Select a domain to see the controls and answers behind its score.</p>
        <div class="table-wrap"><table class="table explain-table">
          <thead><tr><th>Domain</th><th style="width:30%">Score</th><th>Maturity</th><th class="num">Priority findings</th><th class="no-print"></th></tr></thead>
          <tbody>
            ${mods.map(m => html`
              <tr class="clickable" data-action="explain-domain" data-module="${m.id}" tabindex="0" aria-expanded="false">
                <td class="strong">${m.name}</td>
                <td><div class="row"><div class="grow">${UI.pctBar(m.percentage)}</div><strong style="width:28px;text-align:right">${m.percentage}</strong></div></td>
                <td class="nowrap">${m.maturity.name}</td>
                <td class="num">${openCount(m.id) || html`<span class="faint">None</span>`}</td>
                <td class="no-print right">${icon('chevronDown')}</td>
              </tr>
              <tr class="explain hidden" data-explain="${m.id}"><td colspan="5"></td></tr>`)}
          </tbody>
        </table></div>
        <p class="small muted mt-8">Overall score ${o.capped ? `${o.rawScore}, held at ${o.healthScore} by critical-control gating` : o.healthScore}; domains are ${o.domainWeighting === 'configured' ? 'weighted as configured for this template' : 'weighted equally'}.</p>
      </section>`;
  }

  function explainRows(d, moduleId) {
    const rows = d.result.controls.filter(c => c.moduleId === moduleId && c.state !== 'hidden');
    return html`<table class="table table-compact">
      <thead><tr><th>Control question</th><th>Criticality</th><th>Answer</th><th class="num">Weight</th><th class="num">Points</th></tr></thead>
      <tbody>${rows.map(c => html`<tr>
        <td><span class="mono faint">${c.id}</span> ${c.text}</td>
        <td>${TIER_LABEL[c.tier]}</td>
        <td>${c.answerLabel || STATE_LABEL[c.state]}</td>
        <td class="num">${c.weight}</td>
        <td class="num">${c.state === 'na' || c.state === 'unanswered' ? '—' : `${c.earned} / ${c.possible}`}</td>
      </tr>`)}</tbody></table>`;
  }

  function riskSection(d) {
    return html`
      <section class="report-section">
        <h2>Domain performance and risk picture</h2>
        <p class="section-intro">Heatmap of control performance by domain and criticality, and the distribution of findings by impact and gap size. Select a cell to filter the control appendix.</p>
        <div class="grid grid-2 risk-grid" style="align-items:start;gap:32px">
          <div>${UI.heatmap(moduleOverall(d.result), { action: d.sample ? null : 'heat-filter' })}</div>
          <div>${UI.riskMatrix(d.result.riskMatrix, { action: 'matrix-filter' })}</div>
        </div>
      </section>`;
  }

  function findingCard(f) {
    const r = f.recommendation || {};
    return html`<div class="finding">
      <div class="finding-head">
        <div><h4>${f.controlName || 'Control gap'}</h4><div class="question-ref"><span class="mono faint">${f.id}</span> ${f.question}</div></div>
        <div class="row">${severityBadge(f.severity)}<span class="badge badge-outline">${f.timeframe}</span></div>
      </div>
      <div class="small muted mt-8">Current state: ${f.answerLabel || f.state} · ${f.moduleName} · ${f.severityRationale}</div>
      <div class="rec"><strong>Target state.</strong> ${r.summary}</div>
      <div class="steps"><div><strong>Quick win</strong>${r.quickWin}</div><div><strong>1–3 months</strong>${r.mediumTerm}</div><div><strong>Longer term</strong>${r.longTerm}</div></div>
      <div class="small muted mt-8">Suggested owner: ${r.owner || '—'}${r.reference ? ` · Reference: ${r.reference}` : ''}</div>
    </div>`;
  }

  function severityBreakdown(d) {
    const counts = d.result.severityCounts || SEVERITY_ORDER.reduce((acc, sev) => { acc[sev] = d.result.findings.filter(f => f.severity === sev).length; return acc; }, {});
    const total = SEVERITY_ORDER.reduce((n, sev) => n + (counts[sev] || 0), 0);
    const controls = groupFindings(d).length;
    return html`<div class="sev-breakdown">
      <div class="sev-total"><strong>${total}</strong><span>${total === 1 ? 'finding' : 'findings'} across ${plural(controls, 'control')}</span></div>
      ${total ? html`<div class="sev-bar" role="img" aria-label="${SEVERITY_ORDER.map(sev => `${counts[sev] || 0} ${SEVERITY_LABEL[sev]}`).join(', ')}">${SEVERITY_ORDER.filter(sev => counts[sev]).map(sev => html`<i class="sev-fill-${sev}" style="flex:${counts[sev]}"></i>`)}</div>` : ''}
      <div class="sev-counts">${SEVERITY_ORDER.map(sev => html`<div class="${counts[sev] ? '' : 'is-zero'}"><span class="sev-dot sev-fill-${sev}"></span><span class="sev-name">${SEVERITY_LABEL[sev]}</span><strong>${counts[sev] || 0}</strong></div>`)}</div>
    </div>`;
  }

  function findingsSection(d) {
    const groups = groupFindings(d, ['critical', 'high']);
    const shown = d.full ? groups : groups.slice(0, 6);
    return html`
      <section class="report-section">
        <div class="section-head">
          <div><h2>Priority findings</h2><p class="section-intro">${groups.length ? `Critical and high gaps, one per control${groups.length > shown.length ? ` (top ${shown.length} of ${groups.length}; the detailed report lists all)` : ''}.` : 'No critical or high findings were recorded.'}</p></div>
          <button class="btn btn-sm no-print" data-action="print-report" data-full="1">${icon('download')} Download detailed report</button>
        </div>
        ${shown.map((g, n) => {
          const r = g.recommendation || {};
          const lift = d.liftByControl[g.key];
          return html`<div class="finding finding-${g.severity}">
            <div class="finding-head"><h4><span class="finding-num">${n + 1}</span>${g.controlName}</h4><div class="row">${lift ? UI.liftChip(lift.gain) : ''}${severityBadge(g.severity)}<span class="badge badge-outline">Fix within ${g.timeframe.replace('-', '–')}</span></div></div>
            <p class="finding-target"><span class="finding-label">Target</span>${r.summary}</p>
            <details class="readmore"><summary>${plural(g.items.length, 'question')} behind this${r.owner ? ` · owner: ${r.owner}` : ''} ${icon('chevronDown')}</summary>
              <ul class="finding-items">${g.items.map(f => html`<li><span>${f.question}</span><span class="faint nowrap">${f.answerLabel || f.state}</span></li>`)}</ul></details>
          </div>`;
        })}
      </section>`;
  }

  // Detailed report only: every finding, grouped by severity.
  function registerSection(d) {
    const bySev = SEVERITY_ORDER.map(sev => [sev, d.result.findings.filter(f => f.severity === sev)]).filter(([, list]) => list.length);
    return html`
      <section class="report-section page-break">
        <h2>Findings register</h2>
        <p class="section-intro">All ${d.result.findings.length} findings with their current answer, timeframe, owner and recommended steps.</p>
        ${bySev.map(([sev, list]) => html`
          <h3 class="mt-16 mb-8 row">${severityBadge(sev)}<span>${plural(list.length, 'finding')}</span></h3>
          <div class="table-wrap"><table class="table table-compact register-table">
            <thead><tr><th>Ref</th><th style="width:30%">Finding</th><th>Current answer</th><th>Fix within</th><th>Owner</th><th style="width:34%">Recommended steps</th></tr></thead>
            <tbody>${list.map(f => {
              const r = f.recommendation || {};
              return html`<tr>
                <td class="mono nowrap">${f.ref}</td>
                <td><div class="strong">${f.controlName || 'Control gap'}</div><div class="small">${f.question}</div><div class="small faint">${f.moduleName}</div></td>
                <td class="small">${f.answerLabel || f.state}</td>
                <td class="small nowrap">${f.timeframe}</td>
                <td class="small">${r.owner || '—'}</td>
                <td class="small"><div><strong>Quick win:</strong> ${r.quickWin}</div><div><strong>1–3 months:</strong> ${r.mediumTerm}</div><div><strong>Long term:</strong> ${r.longTerm}</div></td>
              </tr>`;
            })}</tbody>
          </table></div>`)}
      </section>`;
  }

  const LADDER_LIMIT = 10;
  function roadmapSection(d) {
    const L = d.ladder;
    if (!L.steps.length) {
      return html`<section class="report-section"><h2>Remediation plan</h2><p>No remediation is needed for the controls assessed.</p></section>`;
    }
    const ms = priorityMilestone(d);
    const shown = d.full ? L.steps : L.steps.slice(0, LADDER_LIMIT);
    const base = L.baseline.healthScore;
    return html`
      <section class="report-section">
        <h2>Remediation plan</h2>
        <p class="section-intro">Every fix in priority order, with the points it adds. The running score shows where you stand once you reach that line.</p>
        <div class="ladder">
          <div class="ladder-milestones">
            <div class="milestone"><span>Today</span><strong>${base}</strong><em>${L.baseline.riskBand} risk · ${L.baseline.maturity}</em></div>
            ${ms ? html`<div class="milestone"><span>After the first ${ms.count} fixes</span><strong>${ms.healthScore}<small>+${ms.healthScore - base}</small></strong><em>${ms.urgent ? 'All critical and high priorities closed' : 'The highest-priority fixes'} · ${ms.riskBand} risk</em></div>` : ''}
            <div class="milestone milestone-goal"><span>Every fix complete</span><strong>${L.final.healthScore}<small>+${L.final.healthScore - base}</small></strong><em>${L.final.riskBand} risk · ${L.final.maturity}</em></div>
          </div>
          ${shown.map(st => ladderRow(st, base, d.full))}
          ${L.steps.length > shown.length ? html`<div class="ladder-more">${plural(L.steps.length - shown.length, 'further fix', 'further fixes')} worth about ${UI.fmtGain(L.steps.slice(shown.length).reduce((n, x) => n + x.gain, 0)) || '+0'} points are in the detailed report and the action plan.</div>` : ''}
        </div>
        <p class="small muted mt-8">Points are estimates from re-scoring the assessment with each fix in place; the real change is measured at the next assessment.</p>
      </section>`;
  }

  function ladderRow(st, base, full) {
    const r = st.recommendation || {};
    const before = Math.max(0, st.healthAfter - st.gain);
    return html`<div class="ladder-row ladder-${st.severity}">
      <span class="ladder-rank">${st.rank}</span>
      <div style="min-width:0">
        <div class="ladder-name">${st.controlName}${severityBadge(st.severity)}${st.liftsCap ? html`<span class="ladder-cap">Removes the score cap</span>` : ''}</div>
        ${r.quickWin ? html`<div class="ladder-do"><strong>Start:</strong> ${r.quickWin}</div>` : ''}
        <div class="ladder-meta">${st.owner ? `${st.owner} · ` : ''}fix within ${String(st.timeframe || '').replace('-', '–')}${st.findingIds.length > 1 ? ` · closes ${st.findingIds.length} findings` : ''}</div>
        ${r.mediumTerm || r.longTerm ? html`<details class="ladder-steps" ${full ? raw('open') : ''}><summary>Full steps ${icon('chevronDown')}</summary><ol>
          ${r.quickWin ? html`<li><b>Next 30 days:</b> ${r.quickWin}</li>` : ''}
          ${r.mediumTerm ? html`<li><b>1 to 3 months:</b> ${r.mediumTerm}</li>` : ''}
          ${r.longTerm ? html`<li><b>3 to 12 months:</b> ${r.longTerm}</li>` : ''}</ol></details>` : ''}
      </div>
      <div>${UI.liftChip(st.gain) || html`<span class="lift lift-muted" title="Lowers risk; the score effect is under one point">Risk ↓</span>`}</div>
      <div class="ladder-total"><span>Score after this fix <strong>${st.healthAfter}</strong></span>
        <div class="ladder-bar"><i style="width:${before}%"></i><u style="left:${before}%;width:${Math.max(0, st.healthAfter - before)}%"></u></div></div>
    </div>`;
  }

  function trendSection(d) {
    if (d.sample || d.history.length < 2) return '';
    const points = d.history.map(h => ({ label: fmtDate(h.issuedAt, { month: 'short', year: '2-digit' }), value: h.healthScore }));
    const prev = d.previous;
    return html`
      <section class="report-section">
        <h2>Progress over time</h2>
        <p class="section-intro">Cyber Health Score across issued reports for this template.${prev ? ` Change since ${fmtDate(prev.issuedAt)}: ${d.result.overall.healthScore - prev.healthScore >= 0 ? '+' : ''}${d.result.overall.healthScore - prev.healthScore} points.` : ''}</p>
        ${UI.trendChart(points)}
        ${prev ? html`<p class="no-print mt-8"><a href="#/app/compare/${prev.id}/${d.reportId}">${icon('compare')} Compare with the previous report</a></p>` : ''}
      </section>`;
  }

  function benchmarkSection() {
    return html`<section class="report-section hidden" id="benchmark-section"><h2>Peer benchmark</h2><div class="small muted" id="benchmark-body"></div></section>`;
  }

  async function loadBenchmark(d) {
    if (d.sample) { const s = $('#benchmark-section'); if (s) s.remove(); return; }
    try {
      const b = await API.get(`/api/benchmarks/${d.frameworkId}${API.qs({ tenantId: d.tenantId })}`);
      const cohort = b.industry && b.industry.available ? b.industry : b.overall.available ? b.overall : null;
      if (!cohort) {
        const sec = $('#benchmark-section'); if (sec) sec.remove();
        return;
      }
      const h = d.result.overall.healthScore;
      const secShow = $('#benchmark-section'); if (secShow) secShow.classList.remove('hidden');
      setHtml('#benchmark-body', html`
        <p>${cohort.industry ? `Compared with ${cohort.population} organisations in the same industry` : `Compared with ${cohort.population} organisations`} assessed between ${fmtDate(cohort.from)} and ${fmtDate(cohort.to)}.</p>
        <div class="grid grid-3"><div class="panel"><div class="metric-label">This organisation</div><div class="metric-value">${h}</div></div>
        <div class="panel"><div class="metric-label">Peer median</div><div class="metric-value">${cohort.median}</div></div>
        <div class="panel"><div class="metric-label">Peer interquartile range</div><div class="metric-value">${cohort.lowerQuartile}–${cohort.upperQuartile}</div></div></div>
        <p class="small muted mt-8">${b.methodology}</p>`);
    } catch {
      const s = $('#benchmark-section'); if (s) s.remove();
    }
  }

  function coverageSection(d) {
    const refs = (d.framework.referenceFrameworks && d.framework.referenceFrameworks.length ? d.framework.referenceFrameworks : REF_ORDER).filter(r => d.result.frameworkCoverage[r]);
    const first = refs[0];
    return html`
      <section class="report-section page-break">
        <div class="row row-between row-wrap">
          <div><h2>Framework view</h2><p class="section-intro" style="margin-bottom:0">Results expressed against reference frameworks through the HawkSight control library. Indicative crosswalk for gap analysis, not a certification.</p></div>
          <label class="no-print row small"><span class="muted">Framework</span>
            <select class="select" data-change="coverage-framework" style="width:auto">${REF_ORDER.filter(r => d.result.frameworkCoverage[r] && d.result.frameworkCoverage[r].length).map(r => html`<option value="${r}" ${r === first ? raw('selected') : ''}>${Controls.FRAMEWORK_REFERENCES[r].name} ${Controls.FRAMEWORK_REFERENCES[r].version}</option>`)}</select>
          </label>
        </div>
        <div id="coverage-body" class="mt-16">${coverageTable(d, first)}</div>
        <div class="print-only-coverage">${refs.slice(1).map(r => html`<div class="hidden-screen mt-24">${coverageTable(d, r)}</div>`)}</div>
      </section>`;
  }

  function coverageTable(d, refId) {
    const ref = Controls.FRAMEWORK_REFERENCES[refId];
    const rows = d.result.frameworkCoverage[refId] || [];
    if (!rows.length) return html`<p class="muted">No questions in this template map to ${ref.name}.</p>`;
    const assessed = rows.filter(r => r.percentage !== null);
    const avg = assessed.length ? Math.round(assessed.reduce((n, r) => n + r.percentage, 0) / assessed.length) : null;
    return html`
      <h3 class="mb-8">${ref.name} ${ref.version}</h3>
      <p class="small muted">${rows.length} referenced requirements covered by this assessment${avg !== null ? `; average implementation ${avg}%` : ''}. Version ${ref.version}, published by ${ref.publisher}.</p>
      <div class="table-wrap"><table class="table table-compact">
        <thead><tr><th>Reference</th><th>HawkSight controls</th><th class="num">Questions</th><th style="width:30%">Implementation</th></tr></thead>
        <tbody>${rows.map(r => html`<tr><td class="strong nowrap">${r.ref}</td><td class="small">${r.controls.map(c => Controls.CONTROL_INDEX[c] ? Controls.CONTROL_INDEX[c].name : c).join(', ')}</td><td class="num">${r.items}</td>
          <td>${r.percentage === null ? html`<span class="muted small">Not assessed</span>` : html`<div class="row"><div class="grow">${UI.pctBar(r.percentage)}</div><span class="small strong" style="width:28px;text-align:right">${r.percentage}</span></div>`}</td></tr>`)}</tbody>
      </table></div>`;
  }

  function methodologySection(d) {
    const p = d.profile || {};
    const o = d.result.overall;
    const snapshot = d.result.meta && d.result.meta.scope === 'core';
    return html`
      <section class="report-section">
        <h2>Scope and method</h2>
        <div class="method-grid mt-16">
          <div><h4>Scope</h4><p>${d.framework.name} (template ${d.framework.templateVersion})${snapshot ? ', Snapshot plan covering each security control once' : ''}. ${o.completion.applicable} questions in scope${o.completion.notApplicable ? `, ${o.completion.notApplicable} marked not applicable` : ''}. Organisation context: ${p.employeeCount || 'size not stated'} employees, ${p.itEnvironment || 'environment not stated'} IT.</p></div>
          <div><h4>How scores work</h4><p>Each answer counts towards its control, weighted by how critical the control is. Missing critical safeguards limit the overall score. Risk exposure also reflects the organisation's context.</p></div>
          <div><h4>Confidence</h4><p>${o.confidence.label} (${o.confidence.score}/100), based on completion, the evidence supporting the most important controls, and answers marked unknown.</p></div>
        </div>
      </section>`;
  }

  function appendixSection(d) {
    const modules = d.result.modules;
    return html`
      <section class="report-section page-break" id="appendix">
        <h2>Appendix: control detail</h2>
        <p class="section-intro">Every control question with its answer, support, score contribution, severity and framework references.</p>
        <div class="row row-wrap no-print mb-16">
          <select class="select" style="width:auto" data-change="appendix-filter" data-filter="module"><option value="">All domains</option>${modules.map(m => html`<option value="${m.id}">${m.name}</option>`)}</select>
          <select class="select" style="width:auto" data-change="appendix-filter" data-filter="severity"><option value="">All results</option><option value="finding">Findings only</option>${SEVERITY_ORDER.map(s => html`<option value="${s}">${SEVERITY_LABEL[s]}</option>`)}<option value="met">Fully implemented</option></select>
          <select class="select" style="width:auto" data-change="appendix-filter" data-filter="tier"><option value="">All criticality levels</option>${Object.keys(TIER_LABEL).map(t => html`<option value="${t}">${TIER_LABEL[t]}</option>`)}</select>
          <select class="select" style="width:auto" data-change="appendix-filter" data-filter="ref">${REF_ORDER.map(r => html`<option value="${r}" ${r === 'iso27001' ? raw('selected') : ''}>References: ${Controls.FRAMEWORK_REFERENCES[r].name}</option>`)}</select>
          <button class="btn btn-sm btn-ghost" data-action="appendix-reset">Clear filters</button>
          <span class="small muted" id="appendix-count"></span>
        </div>
        <div id="appendix-body">${appendixTable(d, {})}</div>
      </section>`;
  }

  function appendixTable(d, filters) {
    const findings = {};
    d.result.findings.forEach(f => { findings[f.id] = f; });
    const ref = filters.ref || 'iso27001';
    const rows = d.result.controls.filter(c => {
      if (c.state === 'hidden') return false;
      if (filters.module && c.moduleId !== filters.module) return false;
      if (filters.tier && c.tier !== filters.tier) return false;
      const f = findings[c.id];
      if (filters.severity === 'finding' && !f) return false;
      if (filters.severity === 'met' && !(c.state === 'scored' && c.fraction === 1)) return false;
      if (filters.severity && !['finding', 'met'].includes(filters.severity) && (!f || f.severity !== filters.severity)) return false;
      if (filters.likelihood && (!f || String(f.likelihood) !== String(filters.likelihood) || String(f.impact) !== String(filters.impact))) return false;
      return true;
    });
    const countEl = $('#appendix-count');
    if (countEl) countEl.textContent = `${rows.length} of ${d.result.controls.filter(c => c.state !== 'hidden').length} controls`;
    const grouped = {};
    rows.forEach(r => { (grouped[r.moduleName] = grouped[r.moduleName] || []).push(r); });
    if (!rows.length) return html`<p class="muted">No controls match these filters.</p>`;
    return html`${Object.keys(grouped).map(name => html`
      <h3 class="mt-16 mb-8">${name}</h3>
      <div class="table-wrap"><table class="table table-compact">
        <thead><tr><th style="width:34%">Control question</th><th>Control</th><th>Answer</th><th>Support</th><th class="num">Points</th><th>Result</th><th>${Controls.FRAMEWORK_REFERENCES[ref].name}</th></tr></thead>
        <tbody>${grouped[name].map(c => {
          const f = findings[c.id];
          const ctrl = c.controlId ? Controls.CONTROL_INDEX[c.controlId] : null;
          const refs = ctrl ? (ctrl.mappings[ref] || []).filter(x => x && x !== '—') : [];
          return html`<tr>
            <td><span class="mono faint">${c.id}</span> ${c.text}</td>
            <td class="small">${ctrl ? html`${ctrl.name}<div class="faint">${c.controlId} · ${TIER_LABEL[c.tier]}</div>` : '—'}</td>
            <td class="small">${c.answerLabel || STATE_LABEL[c.state]}</td>
            <td class="small">${c.state === 'scored' || c.state === 'unknown' || c.state === 'planned' ? html`${CONF_LABEL[c.confidenceLevel] || ''}${c.evidenceCount ? html`<div class="faint">${plural(c.evidenceCount, 'evidence item')}</div>` : ''}` : '—'}</td>
            <td class="num small">${c.state === 'na' || c.state === 'unanswered' ? '—' : `${c.earned}/${c.possible}`}</td>
            <td>${f ? severityBadge(f.severity) : c.state === 'scored' && c.fraction === 1 ? html`<span class="badge badge-success">Met</span>` : html`<span class="muted small">${STATE_LABEL[c.state]}</span>`}</td>
            <td class="small">${refs.length ? refs.join(', ') : '—'}</td>
          </tr>`;
        })}</tbody>
      </table></div>`)}`;
  }

  function renderDocument(d) {
    return html`
      <article class="report-doc" id="report-doc">
        ${cover(d)}
        ${summarySection(d)}
        ${attackSection(d)}
        ${explainSection(d)}
        ${findingsSection(d)}
        ${roadmapSection(d)}
        ${trendSection(d)}
        ${benchmarkSection()}
        ${methodologySection(d)}
        ${d.full ? html`
          <div class="report-section page-break appendix-intro"><div class="eyebrow">Detailed report</div><h2 style="margin-top:6px">Full findings and control detail</h2><p class="section-intro">Every finding, the risk picture, framework crosswalks and control-level results.</p></div>
          ${registerSection(d)}
          ${riskSection(d)}
          ${coverageSection(d)}
          ${appendixSection(d)}` : ''}
        <footer class="report-foot"><span>${d.orgName} · ${d.framework.shortName} report v${d.version}</span><span>${d.sample ? 'Sample report with fictional data' : 'Confidential'}${d.branding && d.branding.reportFooter ? ` · ${d.branding.reportFooter}` : ''}</span><span>Generated by HawkSight</span></footer>
      </article>`;
  }


  // ── Snapshot report ──
  // A short, self-assessed report for the Snapshot plan: where you stand,
  // what you do well, what to fix first and what to do next.
  const BAND_TEXT = {
    Strong: 'Core protections are in place and working. Keep them maintained and close the remaining gaps.',
    Moderate: 'Many protections are in place, but there are gaps an attacker could use. A few focused actions will make a real difference.',
    Weak: 'Important protections are missing. Acting on the priorities below should be treated as urgent.'
  };
  const AREA_STATUS = p => p >= 75 ? ['Strong', 'good'] : p >= 55 ? ['Fair', 'fair'] : ['Needs attention', 'poor'];

  function snapshotStrengths(d) {
    const rank = { critical: 0, high: 1, medium: 2, foundational: 3 };
    const seen = new Set();
    return d.result.controls
      .filter(c => c.state === 'scored' && c.fraction === 1 && c.controlName)
      .sort((a, b) => rank[a.tier] - rank[b.tier])
      .filter(c => !seen.has(c.controlId) && seen.add(c.controlId))
      .slice(0, 4);
  }

  function renderSnapshot(d) {
    const o = d.result.overall;
    const mods = d.result.modules.filter(m => m.percentage !== null);
    const priorities = groupFindings(d).slice(0, 5);
    const strengths = snapshotStrengths(d);
    const counts = d.result.severityCounts || {};
    const urgent = (counts.critical || 0) + (counts.high || 0);
    const ms = priorityMilestone(d);
    return html`
      <article class="report-doc snapshot-doc" id="report-doc">
        <header class="snap-head">
          <div class="snap-brand">${root.U.wordmark('by HiQurate Ops', 'light')}<div class="right small muted">${d.sample ? 'Sample, fictional organisation' : 'Confidential'}<br>${fmtDate(d.issuedAt, { day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
          <div class="eyebrow mt-24">Cyber Health Snapshot · Self-assessment</div>
          <h1>${d.orgName}</h1>
          <div class="muted">${d.framework.name}</div>
        </header>

        <section class="report-section snap-hero">
          <div class="snap-score">${UI.scoreRing(o.healthScore, 'of 100', scaleColor(o.healthScore))}</div>
          <div class="snap-verdict">
            <div class="finding-label">Your Cyber Health Score</div>
            <h2>${o.healthBand === 'Weak' ? 'Needs urgent attention' : o.healthBand}</h2>
            <p>${BAND_TEXT[o.healthBand]}</p>
            <dl class="snap-facts">
              <div><dt>Maturity</dt><dd>${o.maturity.name}</dd></div>
              <div><dt>Risk level</dt><dd>${o.riskBand}</dd></div>
              <div><dt>Urgent gaps</dt><dd>${urgent}</dd></div>
            </dl>
          </div>
        </section>

        ${snapshotAttacks(d)}

        <section class="report-section">
          <h2>Your security at a glance</h2>
          <div class="snap-areas">${mods.map(m => {
            const [label, cls] = AREA_STATUS(m.percentage);
            return html`<div class="snap-area"><span class="snap-area-name">${m.name}</span><div class="snap-area-bar">${UI.pctBar(m.percentage)}</div><span class="snap-status snap-${cls}">${label}</span></div>`;
          })}</div>
        </section>

        <section class="report-section snap-two">
          <div>
            <h2>What you do well</h2>
            ${strengths.length ? html`<ul class="snap-list snap-good">${strengths.map(c => html`<li>${c.controlName}</li>`)}</ul>` : html`<p class="muted">No security control is fully in place yet. The priorities on the right are the place to start.</p>`}
          </div>
          <div>
            <h2>Fix these first</h2>
            ${priorities.length ? html`<ol class="snap-fix">${priorities.map(g => html`<li>
              <div class="row" style="gap:8px"><strong class="grow">${g.controlName}</strong>${d.liftByControl[g.key] ? UI.liftChip(d.liftByControl[g.key].gain) : ''}${severityBadge(g.severity)}</div>
              <div class="snap-fix-action">${g.recommendation ? g.recommendation.quickWin : ''}</div>
            </li>`)}</ol>` : html`<p class="muted">No gaps were found in the controls assessed.</p>`}
          </div>
        </section>

        <section class="report-section">
          <h2>Next steps</h2>
          <ol class="snap-steps">
            <li><strong>Start with the priorities above.</strong> Each starts with a quick win using tools and people you already have. ${ms ? `Fixing the first ${ms.count} is expected to lift your score from ${o.healthScore} to about ${ms.healthScore}; fixing every gap would take it to about ${d.ladder.final.healthScore}.` : ''}</li>
            <li><strong>Track progress in your action plan.</strong> Every gap is listed there with an owner and a due date.</li>
            <li><strong>Get an independent view.</strong> A Comprehensive assessment covers the full question set, checks your evidence and gives you an assessor-issued report and remediation roadmap for your board.</li>
          </ol>
        </section>

        <footer class="report-foot"><span>${d.orgName} · Cyber Health Snapshot</span><span>Self-assessed: ${o.completion.answered} questions, one for each security control</span><span>Generated by HawkSight</span></footer>
      </article>`;
  }

  function toolbar(d) {
    return html`
      <div class="report-toolbar no-print">
        <div>
          ${d.sample ? html`<div class="breadcrumb"><a href="#/">HawkSight</a>${icon('chevronRight')}<span>${isSnapshot(d) ? 'Sample Snapshot report' : 'Sample report'}</span></div>`
            : html`<div class="breadcrumb"><a href="#/app/reports">Reports</a>${icon('chevronRight')}<span>${d.framework.shortName} v${d.version}</span></div>`}
          <h1 style="font-size:20px">${d.title}</h1>
          <div class="small muted mt-8">${d.reviewType} · issued ${fmtDateTime(d.issuedAt)}${d.sample ? '' : ` · ${ageLabel(d.issuedAt)}`}</div>
        </div>
        <div class="btn-group">
          ${!d.sample ? html`<button class="btn" data-action="verify-report">${icon('shield')} Verify integrity</button>` : ''}
          ${!d.sample ? html`<a class="btn" href="#/app/actions">${icon('list')} Action plan</a>` : ''}
          ${isSnapshot(d) ? '' : html`<button class="btn" data-action="print-report" data-full="1" title="All findings, the risk picture, framework crosswalks and control detail">${icon('download')} Detailed report</button>`}
          <button class="btn btn-primary" data-action="print-report">${icon('download')} Download report</button>
        </div>
      </div>
      ${d.sample ? html`<div class="callout callout-info no-print mb-16">${icon('info')}<div>This sample uses a fictional organisation to show the structure of a HawkSight report. To keep a copy, choose <strong>Save as PDF</strong> in the print dialog.</div></div>` : html`<p class="small muted no-print">Download report gives this summary; Detailed report adds every finding and control. Choose <strong>Save as PDF</strong> in the print dialog.</p>`}`;
  }

  function renderReport(d) {
    return isSnapshot(d) ? renderSnapshot(d) : renderDocument(d);
  }

  function mount(d) {
    doc = d;
    loadBenchmark(d);
  }

  // ── Routes ──
  async function showSample(plan) {
    const payload = await API.get(`/api/public/sample-report${plan === 'snapshot' ? '?plan=snapshot' : ''}`);
    const d = prepare(payload);
    const content = html`<div class="container" style="padding-top:24px;padding-bottom:48px">${toolbar(d)}<div id="report-doc-wrap">${renderReport(d)}</div></div>`;
    if (App.session && !App.session.user.mustChangePassword) App.renderApp(html`<div class="page">${toolbar(d)}<div id="report-doc-wrap">${renderReport(d)}</div></div>`);
    else App.renderPublic(content);
    mount(d);
  }
  App.route('/sample-report', () => showSample('comprehensive'), { public: true });
  App.route('/sample-snapshot', () => showSample('snapshot'), { public: true });

  App.route('/app/reports/:id', async ({ id }) => {
    App.renderApp(UI.skeleton());
    const payload = await API.get(`/api/reports/${encodeURIComponent(id)}`);
    const d = prepare(payload);
    if (App.isStaff() && d.tenantId && d.tenantId !== App.tenantId) await App.ensureTenant(d.tenantId);
    App.renderApp(html`<div class="page">${toolbar(d)}<div id="report-doc-wrap">${renderReport(d)}</div></div>`);
    mount(d);
  });

  function rerender() {
    setHtml('#report-doc-wrap', renderReport(doc));
    loadBenchmark(doc);
  }

  on('action', 'print-report', el => {
    if (!doc) return;
    const full = el.dataset.full === '1';
    const prev = document.title;
    document.title = `${doc.orgName} - ${doc.framework.shortName} report v${doc.version}${full ? ' (detailed)' : ''} - ${fmtDate(doc.issuedAt, { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}`;
    if (full) {
      doc.full = true;
      rerender();
      if ($('#appendix-body')) setHtml('#appendix-body', appendixTable(doc, { ref: 'iso27001' }));
    }
    const closed = $all('#report-doc details:not([open])');
    closed.forEach(el => { el.open = true; });
    const restore = () => {
      closed.forEach(el => { if (document.body.contains(el)) el.open = false; });
      document.title = prev;
      if (doc.full) { doc.full = false; rerender(); }
    };
    window.addEventListener('afterprint', restore, { once: true });
    if (doc.reportId) API.post(`/api/reports/${doc.reportId}/exported`, { format: full ? 'pdf-full' : 'pdf' }).catch(() => {});
    window.print();
  });

  on('action', 'verify-report', async () => {
    const r = await API.get(`/api/reports/${doc.reportId}/verify`);
    if (r.verified) UI.toast('Integrity verified: this report matches its issued fingerprint.', 'success', 6000);
    else UI.toast('Integrity check failed. Contact your administrator.', 'error', 8000);
  });

  on('action', 'explain-domain', el => {
    const id = el.dataset.module;
    const row = $(`[data-explain="${CSS.escape(id)}"]`);
    if (!row) return;
    const open = row.classList.toggle('hidden') === false;
    el.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open && !row.dataset.loaded) {
      setHtml(row.querySelector('td'), explainRows(doc, id));
      row.dataset.loaded = '1';
    }
  });

  on('change', 'coverage-framework', el => setHtml('#coverage-body', coverageTable(doc, el.value)));

  function currentRef() {
    const sel = $('[data-filter="ref"]');
    return sel ? sel.value : 'iso27001';
  }
  function readFilters() {
    const f = {};
    $all('[data-change="appendix-filter"]').forEach(s => { if (s.value) f[s.dataset.filter] = s.value; });
    return f;
  }
  on('change', 'appendix-filter', () => setHtml('#appendix-body', appendixTable(doc, readFilters())));
  on('action', 'appendix-reset', () => {
    $all('[data-change="appendix-filter"]').forEach(s => { s.value = s.dataset.filter === 'ref' ? 'iso27001' : ''; });
    setHtml('#appendix-body', appendixTable(doc, { ref: 'iso27001' }));
  });
  on('action', 'heat-filter', el => {
    const mod = $('[data-filter="module"]');
    const tier = $('[data-filter="tier"]');
    const sev = $('[data-filter="severity"]');
    if (mod) mod.value = el.dataset.module;
    if (tier) tier.value = el.dataset.tier;
    if (sev) sev.value = '';
    setHtml('#appendix-body', appendixTable(doc, readFilters()));
    $('#appendix').scrollIntoView({ behavior: 'smooth' });
  });
  on('action', 'matrix-filter', el => {
    setHtml('#appendix-body', appendixTable(doc, { ref: currentRef(), likelihood: el.dataset.likelihood, impact: el.dataset.impact }));
    const countEl = $('#appendix-count');
    if (countEl) countEl.textContent += ' · filtered from risk matrix';
    $('#appendix').scrollIntoView({ behavior: 'smooth' });
  });

  // ── Report list ──
  App.route('/app/reports', async () => {
    if (!App.tenantId) return App.renderApp(html`<div class="page">${UI.emptyState({ title: 'No organisation selected', message: 'Select an organisation to see its reports.' })}</div>`);
    App.renderApp(UI.skeleton());
    const { reports } = await API.get(`/api/reports${API.qs({ tenantId: App.tenantId })}`);
    const byFramework = {};
    reports.forEach(r => { (byFramework[r.frameworkId] = byFramework[r.frameworkId] || []).push(r); });
    const latest = reports[0];
    const prevSame = latest ? (byFramework[latest.frameworkId] || [])[1] : null;
    const change = latest && prevSame ? latest.healthScore - prevSame.healthScore : null;
    App.renderApp(html`<div class="page">
      ${UI.pageHero({
        icon: 'file', eyebrow: 'Reports', title: 'Issued reports',
        sub: 'Every issued report is fingerprinted and never changes. Each new cycle adds a version, so you can see how far you have come.',
        stats: latest ? [
          { label: 'Latest score', value: latest.healthScore, sub: latest.frameworkName },
          { label: 'Change', value: change === null ? '—' : `${change > 0 ? '+' : ''}${change}`, tone: change > 0 ? 'success' : change < 0 ? 'critical' : '', sub: prevSame ? `Since v${prevSame.version}` : 'First report' },
          { label: 'Reports issued', value: reports.length, sub: plural(Object.keys(byFramework).length, 'assessment type') },
          { label: 'Last issued', value: fmtDate(latest.issuedAt, { day: 'numeric', month: 'short' }), sub: ageLabel(latest.issuedAt) }
        ] : []
      })}
      ${!reports.length ? html`<div class="card">${UI.emptyState({ title: 'No reports yet', message: 'Reports appear here once an assessment has been submitted and issued.', action: html`<a class="btn" href="#/app/assessments">Go to assessments</a>` })}</div>` : ''}
      ${Object.keys(byFramework).map(fw => {
        const list = byFramework[fw];
        const top = list[0];
        const delta = list[1] ? top.healthScore - list[1].healthScore : null;
        return html`<div class="card mb-16">
          <div class="card-head" style="padding:18px 20px">
            <div class="row" style="gap:16px">${UI.scoreRing(top.healthScore, 'Health')}
              <div><div class="eyebrow">${list[0].reviewType}</div><h3 style="font-size:17px;margin-top:3px">${list[0].frameworkName}</h3>
                <div class="small muted mt-8">Latest v${top.version} · issued ${fmtDate(top.issuedAt)}${delta !== null ? html` · <span class="delta-chip ${delta >= 0 ? 'delta-up' : 'delta-down'}">${delta > 0 ? '+' : ''}${delta} since v${list[1].version}</span>` : ''}</div></div></div>
            <div class="btn-group">
              ${list.length > 1 ? html`<button class="btn btn-sm" data-action="compare-latest" data-a="${list[1].id}" data-b="${list[0].id}">${icon('compare')} Compare latest two</button>` : ''}
              <a class="btn btn-sm btn-primary" href="#/app/reports/${top.id}">Open latest ${icon('chevronRight')}</a>
            </div>
          </div>
          <ul class="version-list">${list.map((r, i) => html`<li data-action="open-report" data-id="${r.id}" tabindex="0" role="button">
            <span class="version-dot"></span>
            <div><div class="strong">Version ${r.version}${i === 0 ? html` <span class="badge badge-brand">Latest</span>` : ''}</div><div class="small muted">${fmtDate(r.issuedAt)} · ${ageLabel(r.issuedAt)} · ${r.reviewType} · <span class="mono faint">${r.contentHash.slice(0, 10)}</span></div></div>
            <span class="small muted">Health <strong class="tile-score" style="font-size:20px">${r.healthScore}</strong></span>
            <span class="small muted">Risk <strong style="color:var(--ink-900)">${r.riskScore}</strong> ${icon('chevronRight')}</span>
          </li>`)}</ul></div>`;
      })}
    </div>`);
  });
  on('action', 'open-report', el => App.navigate(`/app/reports/${el.dataset.id}`));
  on('action', 'compare-latest', (el, e) => { e.stopPropagation(); App.navigate(`/app/compare/${el.dataset.a}/${el.dataset.b}`); });

  // ── Comparison ──
  App.route('/app/compare/:a/:b', async ({ a, b }) => {
    App.renderApp(UI.skeleton());
    const c = await API.get(`/api/reports/compare/${encodeURIComponent(a)}/${encodeURIComponent(b)}`);
    const o = c.overall;
    const delta = (x, y, invert) => {
      if (x === null || y === null || x === undefined || y === undefined) return '';
      const d = y - x;
      const good = invert ? d < 0 : d > 0;
      return html`<span class="${d === 0 ? 'muted' : good ? 'delta-up' : 'delta-down'}">${d > 0 ? '+' : ''}${d}</span>`;
    };
    const list = (items, empty) => items.length ? html`<div class="table-wrap"><table class="table table-compact"><tbody>${items.map(f => html`<tr><td style="width:110px">${severityBadge(f.severity)}</td><td><div class="strong">${f.controlName || ''}</div><div class="small muted">${f.question}</div></td>${f.previousSeverity ? html`<td class="small nowrap">was ${SEVERITY_LABEL[f.previousSeverity]}</td>` : ''}</tr>`)}</tbody></table></div>` : html`<p class="muted small" style="padding:12px 16px">${empty}</p>`;
    App.renderApp(html`<div class="page">
      <div class="breadcrumb"><a href="#/app/reports">Reports</a>${icon('chevronRight')}<span>Comparison</span></div>
      <div class="page-head"><div><h1>${c.target.frameworkName}: before and after</h1><div class="sub">Version ${c.base.version} (${fmtDate(c.base.issuedAt)}) compared with version ${c.target.version} (${fmtDate(c.target.issuedAt)})</div></div>
        <div class="btn-group"><a class="btn" href="#/app/reports/${c.base.id}">Open v${c.base.version}</a><a class="btn" href="#/app/reports/${c.target.id}">Open v${c.target.version}</a></div></div>
      <div class="grid grid-4">
        <div class="card metric"><div class="metric-label">Cyber Health Score</div><div class="metric-value">${o.healthBefore} → ${o.healthAfter}</div><div class="metric-sub">${delta(o.healthBefore, o.healthAfter)} points</div></div>
        <div class="card metric"><div class="metric-label">Risk exposure</div><div class="metric-value">${o.riskBefore} → ${o.riskAfter}</div><div class="metric-sub">${delta(o.riskBefore, o.riskAfter, true)} points</div></div>
        <div class="card metric"><div class="metric-label">Maturity</div><div class="metric-value" style="font-size:18px">${o.maturityBefore} → ${o.maturityAfter}</div></div>
        <div class="card metric"><div class="metric-label">Findings</div><div class="metric-value" style="font-size:18px">${c.findings.closed.length} closed · ${c.findings.new.length} new</div><div class="metric-sub">${c.findings.recurring.length} recurring</div></div>
      </div>
      <div class="card mt-16"><div class="card-head"><h3>Domain change</h3></div><div class="table-wrap"><table class="table">
        <thead><tr><th>Domain</th><th class="num">Before</th><th class="num">After</th><th class="num">Change</th><th>Maturity</th></tr></thead>
        <tbody>${c.domains.map(d => html`<tr><td>${d.name}</td><td class="num">${d.before === null ? '—' : d.before}</td><td class="num strong">${d.after === null ? '—' : d.after}</td><td class="num">${delta(d.before, d.after)}</td><td class="small">${d.maturityBefore || '—'} → ${d.maturityAfter || '—'}</td></tr>`)}</tbody>
      </table></div></div>
      <div class="grid grid-3 mt-16" style="align-items:start">
        <div class="card"><div class="card-head"><h3>Closed findings</h3><span class="badge badge-success">${c.findings.closed.length}</span></div>${list(c.findings.closed, 'No findings were closed.')}</div>
        <div class="card"><div class="card-head"><h3>New findings</h3><span class="badge badge-high">${c.findings.new.length}</span></div>${list(c.findings.new, 'No new findings.')}</div>
        <div class="card"><div class="card-head"><h3>Recurring findings</h3><span class="badge">${c.findings.recurring.length}</span></div>${list(c.findings.recurring, 'No recurring findings.')}</div>
      </div>
    </div>`);
  });

  root.Report = { normalise, prepare, renderDocument, renderSnapshot, renderReport, executiveSummary, findingCard };
})(window);
