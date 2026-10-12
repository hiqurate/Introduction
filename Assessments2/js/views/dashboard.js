// ============================================
// HawkSight — Executive overview (customer portal home)
// ============================================

(function (root) {
  const { html, icon, $, setHtml, on, fmtDate, ageLabel, daysBetween, plural, severityBadge } = root.U;
  const { App, API, UI, Content } = root;

  const FREQUENCY_DAYS = { quarterly: 91, semiannual: 182, annual: 365 };
  const FREQUENCY_LABEL = { quarterly: 'quarterly', semiannual: 'every six months', annual: 'annually' };
  let state = null;

  App.route('/app', async () => {
    if (!App.tenantId) {
      return App.renderApp(html`<div class="page">${UI.emptyState({ title: 'No organisation selected', message: App.isStaff() ? 'Create an organisation in the console, then select it from the organisation menu.' : 'Your account is not linked to an organisation.', action: App.isStaff() ? html`<a class="btn" href="#/console/organisations">Open organisations</a>` : '' })}</div>`);
    }
    App.renderApp(UI.skeleton());
    const tid = App.tenantId;
    const [tenantRes, assessRes, reportRes, actionRes, method] = await Promise.all([
      API.get(`/api/tenants/${tid}`),
      API.get(`/api/assessments${API.qs({ tenantId: tid })}`),
      API.get(`/api/reports${API.qs({ tenantId: tid })}`),
      API.get(`/api/actions${API.qs({ tenantId: tid })}`),
      Content.methodology()
    ]);
    const reports = reportRes.reports;
    const frameworks = [...new Set(reports.map(r => r.frameworkId))];
    state = { tenant: tenantRes.tenant, profile: tenantRes.profile, assessments: assessRes.assessments, reports, actions: actionRes, method, frameworks, selected: frameworks[0] || null, reportCache: {} };
    await renderOverview();
  });

  async function latestReport(frameworkId) {
    const r = state.reports.find(x => x.frameworkId === frameworkId);
    if (!r) return null;
    if (!state.reportCache[r.id]) state.reportCache[r.id] = await API.get(`/api/reports/${r.id}`);
    return state.reportCache[r.id];
  }

  function reminders() {
    const out = [];
    const t = state.tenant;
    const stale = state.method.staleAfterDays || 365;
    const profileComplete = state.profile && state.profile.organizationName && state.profile.industry && state.profile.employeeCount;
    if (!profileComplete) {
      out.push(html`<div class="callout callout-info">${icon('info')}<div class="grow"><strong>Complete your organisation profile.</strong> Industry, size, data types and regulatory exposure decide which questions apply and how risk is interpreted.</div>${App.can('profile:edit') ? html`<a class="btn btn-sm" href="#/app/organisation">Complete profile</a>` : ''}</div>`);
    }
    state.frameworks.forEach(fw => {
      const latest = state.reports.find(r => r.frameworkId === fw);
      const open = state.assessments.find(a => a.frameworkId === fw && a.status !== 'completed');
      const age = daysBetween(latest.issuedAt, new Date());
      if (age > stale && !open) {
        out.push(html`<div class="callout callout-warn">${icon('alert')}<div class="grow"><strong>${latest.frameworkName} results are stale.</strong> The latest report is ${ageLabel(latest.issuedAt)}. Cyber posture changes over time; reassess to keep results current.</div></div>`);
      } else if (t.reassessmentFrequency && !open) {
        const due = new Date(new Date(latest.issuedAt).getTime() + FREQUENCY_DAYS[t.reassessmentFrequency] * 86400000);
        const until = daysBetween(new Date(), due);
        if (until <= 30) {
          out.push(html`<div class="callout ${until < 0 ? 'callout-warn' : 'callout-info'}">${icon('calendar')}<div class="grow"><strong>${latest.frameworkName} reassessment ${until < 0 ? `overdue since ${fmtDate(due)}` : `due ${fmtDate(due)}`}.</strong> Your organisation reassesses ${FREQUENCY_LABEL[t.reassessmentFrequency]}.</div>${App.can('assessment:create') ? html`<button class="btn btn-sm" data-action="start-reassessment" data-framework="${fw}">Start reassessment</button>` : ''}</div>`);
        }
      }
    });
    state.assessments.filter(a => a.dueDate && a.status === 'in_progress' && a.dueDate < new Date().toISOString().slice(0, 10)).forEach(a => {
      out.push(html`<div class="callout callout-warn">${icon('calendar')}<div class="grow"><strong>${a.frameworkShortName} assessment passed its target date of ${fmtDate(a.dueDate)}.</strong> ${a.progress.percentage}% complete.</div><a class="btn btn-sm" href="#/app/assessments/${a.id}">Continue</a></div>`);
    });
    return out;
  }

  async function renderOverview() {
    const s = state;
    const open = s.assessments.filter(a => a.status !== 'completed');
    const head = html`<div class="page-head"><div><h1>Security overview</h1><div class="sub">${s.tenant.name} · latest issued results and work in progress</div></div>
      <div class="btn-group">${App.can('assessment:create') ? html`<a class="btn" href="#/app/assessments">${icon('plus')} New assessment</a>` : ''}</div></div>`;
    const remind = reminders();

    if (!s.selected) {
      App.renderApp(html`<div class="page">${head}<div class="stack">${remind}</div>
        <div class="card mt-16"><div class="card-body">
          <h2>Get started</h2>
          <p class="muted">No reports have been issued for ${s.tenant.name} yet. A typical first cycle takes two to four weeks.</p>
          <ol class="mt-16" style="padding-left:18px;line-height:2">
            <li>Complete the organisation profile so that questions and risk context are tailored.</li>
            <li>Start an assessment and assign sections to the people who own them.</li>
            <li>Answer questions and attach evidence for critical controls.</li>
            <li>Submit for review. Your report and action plan are issued from the submitted assessment.</li>
          </ol>
          <div class="btn-group mt-16"><a class="btn btn-primary" href="#/app/assessments">Go to assessments</a><a class="btn" href="#/sample-report">View a sample report</a></div>
        </div></div>
        ${open.length ? inProgressCard(open) : ''}</div>`);
      return;
    }

    const payload = await latestReport(s.selected);
    const rep = payload.report;
    const o = rep.result.overall;
    const prev = payload.previous;
    const healthDelta = prev ? o.healthScore - prev.healthScore : null;
    const findings = rep.result.findings;
    const actionItems = s.actions.items.filter(i => i.frameworkId === s.selected);
    const statusCount = st => actionItems.filter(i => i.status === st).length;
    const overdue = actionItems.filter(i => i.overdue).length;
    const priority = actionItems.filter(i => (i.severity === 'critical' || i.severity === 'high') && ['open', 'in_progress', 'acceptance_expired'].includes(i.status)).slice(0, 6);
    const heat = rep.result.heatmap.map(r => ({ ...r, overall: (rep.result.modules.find(m => m.id === r.moduleId) || {}).percentage }));
    const stale = daysBetween(rep.issuedAt, new Date()) > (s.method.staleAfterDays || 365);

    App.renderApp(html`<div class="page">
      ${head}
      ${remind.length ? html`<div class="stack mb-16">${remind}</div>` : ''}
      ${s.frameworks.length > 1 ? html`<div class="tabs" role="tablist">${s.frameworks.map(fw => {
        const r = s.reports.find(x => x.frameworkId === fw);
        return html`<button class="tab" role="tab" aria-selected="${fw === s.selected ? 'true' : 'false'}" data-action="overview-framework" data-framework="${fw}">${r.frameworkName}</button>`;
      })}</div>` : ''}

      <div class="card">
        <div class="card-head"><div><h3>${rep.frameworkName}</h3><div class="muted">Report v${rep.version} · issued ${fmtDate(rep.issuedAt)} (${ageLabel(rep.issuedAt)}) · ${rep.reviewType}${stale ? ' · stale' : ''}</div></div>
          <a class="btn btn-sm" href="#/app/reports/${rep.id}">Open report ${icon('chevronRight')}</a></div>
        <div class="card-body">
          <div class="row row-wrap" style="gap:32px;align-items:center">
            ${UI.scoreRing(o.healthScore, 'Cyber Health')}
            <div class="grid grid-4 grow" style="gap:0">
              <div class="metric"><div class="metric-label">Change since last report</div><div class="metric-value">${healthDelta === null ? '—' : html`<span class="${healthDelta >= 0 ? 'delta-up' : 'delta-down'}">${healthDelta > 0 ? '+' : ''}${healthDelta}</span>`}</div><div class="metric-sub">${prev ? `from ${prev.healthScore} on ${fmtDate(prev.issuedAt)}` : 'First issued report'}</div></div>
              <div class="metric"><div class="metric-label">Maturity</div><div class="metric-value" style="font-size:20px">${o.maturity.name}</div>${UI.maturityScale(o.maturity.level)}<div class="metric-sub">Level ${o.maturity.level} of 5</div></div>
              <div class="metric"><div class="metric-label">Risk exposure</div><div class="metric-value">${o.riskScore}</div><div class="metric-sub">${o.riskBand}</div></div>
              <div class="metric"><div class="metric-label">Score confidence</div><div class="metric-value" style="font-size:20px">${o.confidence.label}</div><div class="metric-sub">Evidence quality ${o.confidence.factors.evidenceQuality}%</div></div>
            </div>
          </div>
          ${o.capped ? html`<div class="callout callout-warn mt-16">${icon('lock')}<div>${o.capReason}</div></div>` : ''}
        </div>
      </div>

      <div class="grid grid-2 mt-16" style="align-items:start">
        <div class="card"><div class="card-head"><h3>Domain heatmap</h3><span class="muted">Score by domain and control criticality</span></div>
          <div class="card-body">${UI.heatmap(heat)}<p class="small mt-8"><a href="#/app/reports/${rep.id}">Open the full report</a></p></div></div>
        <div class="stack">
          <div class="card"><div class="card-head"><h3>Risk distribution</h3><span class="muted">${plural(findings.length, 'finding')}</span></div><div class="card-body">${UI.severityBar(rep.result.severityCounts)}</div></div>
          <div class="card"><div class="card-head"><h3>Remediation progress</h3><a class="small" href="#/app/actions">Action plan</a></div>
            <div class="grid grid-4" style="gap:0">
              <div class="metric"><div class="metric-label">Open</div><div class="metric-value">${statusCount('open') + statusCount('acceptance_expired')}</div></div>
              <div class="metric"><div class="metric-label">In progress</div><div class="metric-value">${statusCount('in_progress')}</div></div>
              <div class="metric"><div class="metric-label">Resolved</div><div class="metric-value">${statusCount('resolved')}</div></div>
              <div class="metric"><div class="metric-label">Risk accepted</div><div class="metric-value">${statusCount('risk_accepted')}</div></div>
            </div>
            ${overdue ? html`<div class="card-foot small" style="color:var(--critical)">${plural(overdue, 'action')} overdue</div>` : ''}
          </div>
        </div>
      </div>

      <div class="grid grid-2 mt-16" style="align-items:start">
        <div class="card"><div class="card-head"><h3>What to fix first</h3><span class="muted">Open critical and high findings</span></div>
          ${priority.length ? html`<div class="table-wrap"><table class="table"><tbody>${priority.map(i => html`<tr>
            <td style="width:90px">${severityBadge(i.severity)}</td>
            <td><div class="strong">${i.title}</div><div class="small muted">${i.question}</div></td>
            <td class="small nowrap">${i.owner || html`<span class="faint">No owner</span>`}<div class="faint">${i.dueDate ? `Due ${fmtDate(i.dueDate)}` : i.timeframe}</div></td></tr>`)}</tbody></table></div>`
            : html`<div class="card-body muted">No open critical or high findings.</div>`}
        </div>
        <div class="card"><div class="card-head"><h3>Score history</h3><span class="muted">${rep.frameworkName}</span></div>
          <div class="card-body">${UI.trendChart(payload.history.map(h => ({ label: fmtDate(h.issuedAt, { month: 'short', year: '2-digit' }), value: h.healthScore })))}</div></div>
      </div>

      ${open.length ? html`<div class="mt-16">${inProgressCard(open)}</div>` : ''}
    </div>`);
  }

  function inProgressCard(open) {
    return html`<div class="card"><div class="card-head"><h3>Assessments in progress</h3><a class="small" href="#/app/assessments">All assessments</a></div>
      <div class="table-wrap"><table class="table"><tbody>${open.map(a => html`<tr class="clickable" data-action="open-assessment" data-id="${a.id}" tabindex="0">
        <td><div class="strong">${a.title}</div><div class="small muted">${a.statusLabel} · updated ${ageLabel(a.updatedAt)}</div></td>
        <td style="width:200px"><div class="progress"><span style="width:${a.progress.percentage}%"></span></div><div class="small muted mt-8">${a.progress.answered} of ${a.progress.applicable} answered</div></td>
        <td class="nowrap">${UI.deadlineBadge(a)}</td>
        <td class="right"><span class="btn btn-sm">${a.status === 'in_progress' || a.status === 'evidence_requested' ? 'Resume' : 'View'}</span></td></tr>`)}</tbody></table></div></div>`;
  }

  on('action', 'overview-framework', el => { state.selected = el.dataset.framework; renderOverview(); });
  on('action', 'open-assessment', el => App.navigate(`/app/assessments/${el.dataset.id}`));
  on('action', 'start-reassessment', async el => {
    const ok = await UI.confirm({ title: 'Start a reassessment', message: 'A new assessment cycle will be created. Answers from the last completed cycle are carried forward as a starting point and marked for review.', confirmLabel: 'Start reassessment' });
    if (!ok) return;
    const r = await API.post('/api/assessments', { tenantId: App.tenantId, frameworkId: el.dataset.framework, carryForward: true });
    App.navigate(`/app/assessments/${r.assessment.id}`);
  });
})(window);
