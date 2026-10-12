// ============================================
// HawkSight — Management action plan
// ============================================

(function (root) {
  const { html, raw, icon, $, $all, setHtml, on, fmtDate, plural, severityBadge, SEVERITY_ORDER, SEVERITY_LABEL, download } = root.U;
  const { App, API, UI } = root;

  const STATUS = { open: 'Open', in_progress: 'In progress', resolved: 'Resolved', risk_accepted: 'Risk accepted', acceptance_expired: 'Acceptance expired' };
  const STATUS_BADGE = { open: '', in_progress: 'badge-brand', resolved: 'badge-success', risk_accepted: 'badge-medium', acceptance_expired: 'badge-high' };
  const ACTIVE = ['open', 'in_progress', 'acceptance_expired'];
  const SEV_COLOR = { critical: 'var(--critical)', high: 'var(--high)', medium: '#d4a20f', low: 'var(--low)', informational: '#98a2b3' };
  let plan = null;
  let filters = { framework: '', severity: '', status: 'active', q: '' };

  App.route('/app/actions', async () => {
    if (!App.tenantId) return App.renderApp(html`<div class="page">${UI.emptyState({ title: 'No organisation selected', message: 'Select an organisation to see its action plan.' })}</div>`);
    App.renderApp(UI.skeleton());
    plan = await API.get(`/api/actions${API.qs({ tenantId: App.tenantId })}`);
    if (plan.sources.length > 1 && !plan.sources.some(f => f.frameworkId === filters.framework)) filters.framework = plan.sources[0].frameworkId;
    if (plan.sources.length <= 1) filters.framework = '';
    render();
  });

  // Items for the selected assessment (all of them when there is only one).
  function scoped() {
    return plan.items.filter(i => !filters.framework || i.frameworkId === filters.framework);
  }
  function isFiltered() {
    return !!(filters.q || filters.severity || filters.status !== 'active');
  }

  function visibleItems() {
    return scoped().filter(i => {
      if (filters.severity && i.severity !== filters.severity) return false;
      if (filters.status === 'active' && !ACTIVE.includes(i.status)) return false;
      if (filters.status === 'todo' && !['open', 'acceptance_expired'].includes(i.status)) return false;
      if (filters.status === 'overdue' && !i.overdue) return false;
      if (filters.status && !['active', 'overdue', 'todo'].includes(filters.status) && i.status !== filters.status) return false;
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (![i.title, i.question, i.owner, i.moduleName, i.ref].some(x => String(x || '').toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }

  const controlKey = i => `${i.frameworkId}|${i.controlId || i.questionId}`;

  // Highest-impact controls with open critical or high findings. A control's
  // findings are fixed together, so its points are the sum of its open items.
  function spotlightGroups() {
    const groups = new Map();
    scoped().filter(i => ACTIVE.includes(i.status)).forEach(i => {
      const k = controlKey(i);
      if (!groups.has(k)) groups.set(k, { key: k, items: [], severity: i.severity });
      const g = groups.get(k);
      g.items.push(i);
      if (SEVERITY_ORDER.indexOf(i.severity) < SEVERITY_ORDER.indexOf(g.severity)) g.severity = i.severity;
    });
    return Array.from(groups.values())
      .filter(g => g.severity === 'critical' || g.severity === 'high')
      .map(g => ({ ...g, gain: sum(g.items, i => i.gain), lead: g.items.slice().sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) || b.gain - a.gain)[0] }))
      .sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) || b.gain - a.gain)
      .slice(0, 6);
  }

  function sum(list, f) { return list.reduce((n, i) => n + (f(i) || 0), 0); }

  function hero(items) {
    const src = plan.sources.find(f => f.frameworkId === filters.framework) || plan.sources[0];
    const active = items.filter(i => ACTIVE.includes(i.status));
    const resolved = items.filter(i => i.status === 'resolved');
    const accepted = items.filter(i => i.status === 'risk_accepted');
    const done = resolved.length + accepted.length;
    const pctDone = items.length ? Math.round((done / items.length) * 100) : 0;
    const tabs = plan.sources.length > 1 ? html`<div class="plan-hero-tabs no-print">${plan.sources.map(f => html`<button type="button" data-action="action-framework" data-framework="${f.frameworkId}" aria-pressed="${f.frameworkId === filters.framework ? 'true' : 'false'}">${f.frameworkName}</button>`)}</div>` : '';
    if (!src || !src.baseline) {
      return html`<section class="plan-hero"><div><div class="eyebrow">Action plan</div><div class="plan-hero-big">${active.length}<small>actions to do</small></div>${tabs}</div></section>`;
    }
    const now = src.baseline.healthScore;
    const banked = sum(resolved, i => i.gain);
    const remaining = sum(active, i => i.gain);
    const potential = Math.min(100, Math.round(now + banked + remaining));
    const allDone = !active.length;
    return html`<section class="plan-hero">
      <div>
        <div class="eyebrow">${src.frameworkName} action plan${src.source === 'provisional' ? html` <span class="badge badge-outline" title="From an assessment that has not been issued yet; items may change before the report is issued.">Provisional</span>` : ''}</div>
        <h1>${allDone ? 'Every action is closed' : 'Your path to a stronger score'}</h1>
        <div class="plan-hero-big">${now}<span class="arrow">→</span><span class="to">${potential}</span><small>Cyber Health Score</small></div>
        <p class="plan-hero-copy">${allDone
          ? html`All actions are resolved or accepted. The improvement is confirmed when you next reassess.`
          : html`<strong>${plural(active.length, 'open action')}</strong> worth about <strong>${UI.fmtGain(remaining) || '+0'} points</strong>. Each one shows its share.`}</p>
        ${UI.scorePath({ now, banked, potential, labels: { now: 'Last report', potential: 'All fixed' } })}
        ${tabs}
      </div>
      <aside class="plan-hero-side" title="Points are estimates from re-scoring your last ${src.source === 'report' ? 'report' : 'answers'}; they are confirmed at the next assessment.">
        <div class="row">${UI.miniRing(pctDone, { size: 64, label: `${pctDone}% of actions closed` })}<div class="plan-hero-kv"><strong>${done} of ${items.length} closed</strong>Resolved or risk accepted</div></div>
        <div class="plan-hero-list">
          <div><span>Banked by resolved actions</span><b class="ok">${UI.fmtGain(banked) || '0'} pts</b></div>
          <div><span>Still available</span><b>${UI.fmtGain(remaining) || '0'} pts</b></div>
          <div><span>Risk exposure</span><b>${src.baseline.riskBand}${src.final && !allDone ? html` → ${src.final.riskBand}` : ''}</b></div>
        </div>
      </aside>
    </section>`;
  }

  function statusTiles(items) {
    const n = st => items.filter(i => st.includes(i.status)).length;
    const tiles = [
      ['todo', 'To do', n(['open', 'acceptance_expired']), 'var(--ink-400)'],
      ['in_progress', 'In progress', n(['in_progress']), 'var(--accent)'],
      ['overdue', 'Overdue', items.filter(i => i.overdue).length, 'var(--critical)'],
      ['resolved', 'Resolved', n(['resolved']), 'var(--success)'],
      ['risk_accepted', 'Risk accepted', n(['risk_accepted']), 'var(--medium)']
    ];
    return html`<div class="status-tiles no-print">${tiles.map(([k, l, v, c]) => html`<button type="button" class="status-tile ${k === 'overdue' && v ? 'status-tile-overdue' : ''}" data-action="status-tile" data-status="${k}" aria-pressed="${filters.status === k ? 'true' : 'false'}"><span><i style="background:${c}"></i>${l}</span><strong>${v}</strong></button>`)}</div>`;
  }

  function spotCard(g, n, canEdit) {
    const i = g.lead;
    const rec = i.recommendation || {};
    const due = g.items.filter(x => x.dueDate).map(x => x.dueDate).sort()[0];
    const overdue = g.items.some(x => x.overdue);
    const owner = (g.items.find(x => x.owner) || {}).owner;
    return html`<article class="spot spot-${g.severity}">
      <div class="spot-top"><span class="spot-sev">${g.severity === 'critical' ? html`<span class="pulse"></span>` : ''}#${n} · ${SEVERITY_LABEL[g.severity]}</span>${UI.liftChip(g.gain, { size: 'lg' })}</div>
      <div><h4>${i.title}</h4><div class="small muted mt-8">${g.items.length > 1 ? `${g.items.length} findings · ` : ''}fix within ${String(i.timeframe).replace('-', '–')}</div></div>
      <p class="spot-do">${rec.quickWin || i.question}</p>
      <div class="spot-foot">${icon('user2')}<span class="grow">${owner || html`<span class="faint">Suggested: ${i.suggestedOwner || 'unassigned'}</span>`}</span>
        ${due ? html`<span class="${overdue ? 'delta-down' : 'faint'} nowrap">${overdue ? 'Overdue' : 'Due'} ${fmtDate(due, { day: 'numeric', month: 'short' })}</span>` : ''}
        ${canEdit ? html`<button class="btn btn-sm" data-action="edit-action" data-fw="${i.frameworkId}" data-qid="${i.questionId}" data-group="${g.items.map(x => x.questionId).join(',')}">Update</button>` : ''}</div>
    </article>`;
  }

  function render() {
    const canEdit = App.can('actions:update');
    const items = scoped();
    const spot = isFiltered() ? [] : spotlightGroups();
    App.renderApp(html`<div class="page">
      <div class="page-head no-print" style="margin-bottom:14px">
        <div><div class="eyebrow">Management action plan</div><h1 style="margin-top:4px">Action plan</h1></div>
        <div class="btn-group">
          <button class="btn btn-sm btn-ghost" data-action="export-actions" data-format="xlsx">${icon('download')} Excel</button>
          <button class="btn btn-sm btn-ghost" data-action="export-actions" data-format="csv">${icon('download')} CSV</button>
          <button class="btn btn-sm btn-ghost" data-action="print-actions">${icon('printer')} Print</button>
        </div>
      </div>
      ${plan.items.length ? html`${hero(items)}${statusTiles(items)}` : ''}
      <div id="action-body">${body(canEdit, spot)}</div>
      ${plan.sources.length ? html`<p class="small muted mt-16">Sources: ${plan.sources.map(f => f.source === 'report' ? `${f.frameworkName} report v${f.reportVersion} (${fmtDate(f.issuedAt)})` : `${f.frameworkName} (provisional)`).join('; ')}. Status changes are recorded in the audit log.</p>` : ''}
    </div>`);
  }

  function body(canEdit, spot) {
    if (!plan.items.length) return html`<div class="card">${UI.emptyState({ title: 'No findings yet', message: 'Findings appear here once an assessment has answers.' })}</div>`;
    const shown = new Set(spot.map(g => g.key));
    const rest = visibleItems().filter(i => !shown.has(controlKey(i)));
    return html`
      ${spot.length ? html`<div class="section-title"><h2>${icon('zap')} Fix these first</h2><span class="muted">The critical and high actions that lift your score the most</span></div>
        <div class="spotlight">${spot.map((g, n) => spotCard(g, n + 1, canEdit))}</div>` : ''}
      <div class="section-title"><h2>${spot.length ? 'Everything else' : 'Actions'}</h2><span class="muted" id="action-count">${plural(new Set(rest.map(controlKey)).size, 'control')} · ${plural(rest.length, 'finding')}</span></div>
      <div class="card">
        <div class="act-toolbar no-print">
          <div class="row row-wrap">
            <input class="input" style="width:240px" type="search" placeholder="Search actions or owners" value="${filters.q}" data-input="action-search" aria-label="Search">
            <select class="select" style="width:auto" data-change="action-filter" data-key="severity" aria-label="Severity"><option value="">All severities</option>${SEVERITY_ORDER.map(sv => html`<option value="${sv}" ${filters.severity === sv ? raw('selected') : ''}>${SEVERITY_LABEL[sv]}</option>`)}</select>
            <select class="select" style="width:auto" data-change="action-filter" data-key="status" aria-label="Status">
              ${[['active', 'Open and in progress'], ['todo', 'To do'], ['overdue', 'Overdue'], ['', 'All statuses'], ['in_progress', 'In progress'], ['resolved', 'Resolved'], ['risk_accepted', 'Risk accepted'], ['acceptance_expired', 'Acceptance expired']].map(([k, l]) => html`<option value="${k}" ${filters.status === k ? raw('selected') : ''}>${l}</option>`)}
            </select>
            ${isFiltered() ? html`<button class="btn btn-sm btn-ghost" data-action="action-reset">Clear filters</button>` : ''}
          </div>
          <span class="small muted">${icon('trendUp')} Points = expected score rise</span>
        </div>
        <div id="action-table">${table(canEdit, rest)}</div>
      </div>`;
  }

  // One row per control; its findings open underneath.
  function table(canEdit, items) {
    if (!items.length) return html`<div class="card-body muted">${isFiltered() ? 'No actions match these filters.' : 'Nothing else is open. Use the status tiles to see resolved or accepted actions.'}</div>`;
    const controls = new Map();
    items.forEach(i => {
      const k = controlKey(i);
      if (!controls.has(k)) controls.set(k, { key: k, items: [], severity: i.severity });
      const g = controls.get(k);
      g.items.push(i);
      if (SEVERITY_ORDER.indexOf(i.severity) < SEVERITY_ORDER.indexOf(g.severity)) g.severity = i.severity;
    });
    const all = Array.from(controls.values()).map(g => ({ ...g, gain: sum(g.items.filter(i => ACTIVE.includes(i.status)), i => i.gain) }));
    const groups = SEVERITY_ORDER.map(sv => [sv, all.filter(g => g.severity === sv).sort((a, b) => b.gain - a.gain)]).filter(([, l]) => l.length);
    return html`${groups.map(([sv, list]) => {
      const lift = sum(list, g => g.gain);
      return html`<div class="act-group">
        <div class="act-group-head"><span class="sev-dot sev-fill-${sv}"></span><strong>${SEVERITY_LABEL[sv]}</strong><span>${plural(list.length, 'control')}</span>${UI.fmtGain(lift) ? html`<span class="grow"></span><span>worth up to <strong>${UI.fmtGain(lift)} pts</strong></span>` : ''}</div>
        ${list.map(g => row(g, canEdit))}
      </div>`;
    })}`;
  }

  function statusSummary(items) {
    const kinds = [...new Set(items.map(i => i.status))];
    if (kinds.length === 1) return html`<span class="badge ${STATUS_BADGE[kinds[0]]}">${STATUS[kinds[0]]}</span>`;
    const closed = items.filter(i => i.status === 'resolved' || i.status === 'risk_accepted').length;
    return html`<span class="badge badge-outline">${closed} of ${items.length} closed</span>`;
  }

  function row(g, canEdit) {
    const i = g.items[0];
    const done = g.items.every(x => x.status === 'resolved' || x.status === 'risk_accepted');
    const owner = (g.items.find(x => x.owner) || {}).owner;
    const due = g.items.filter(x => x.dueDate).map(x => x.dueDate).sort()[0];
    const overdue = g.items.some(x => x.overdue);
    const notes = g.items.filter(x => x.notes || x.acceptance);
    return html`<details class="act-item">
      <summary class="act-row ${done ? 'is-done' : ''}">
        <span class="act-stripe" style="background:${SEV_COLOR[g.severity]}"></span>
        <div style="min-width:0"><div class="act-title">${i.title}</div>
          <div class="act-sub">${icon('chevronDown')} ${plural(g.items.length, 'finding')}${notes.length ? html` · ${icon('message')} ${notes.length}` : ''}${plan.sources.length > 1 && !filters.framework ? ` · ${i.frameworkName}` : ''}</div></div>
        <div>${UI.liftChip(g.gain) || html`<span class="faint small">—</span>`}</div>
        <div class="act-cell act-owner"><strong>${owner || html`<span class="faint" style="font-weight:400">${i.suggestedOwner || 'Unassigned'}</span>`}</strong></div>
        <div class="act-cell act-due"><strong style="${overdue ? 'color:var(--critical)' : ''}">${due ? fmtDate(due, { day: 'numeric', month: 'short' }) : html`<span class="faint" style="font-weight:400">${String(i.timeframe).replace('-', '–')}</span>`}</strong>${overdue ? html`<span style="color:var(--critical)">Overdue</span>` : ''}</div>
        <div class="act-status">${statusSummary(g.items)}</div>
        <div class="act-btn right no-print">${canEdit ? html`<button class="btn btn-sm" data-action="edit-action" data-fw="${i.frameworkId}" data-qid="${i.questionId}" ${g.items.length > 1 ? raw(`data-group="${g.items.map(x => x.questionId).join(',')}"`) : ''}>Update</button>` : ''}</div>
      </summary>
      <ul class="act-findings">${g.items.map(x => html`<li>
        <span class="mono faint">${x.questionId}</span>
        <div style="min-width:0">${x.question}
          ${x.acceptance ? html`<div class="act-note" style="color:var(--medium)">Accepted until ${fmtDate(x.acceptance.expiry)}: ${x.acceptance.justification}</div>` : ''}
          ${x.notes ? html`<div class="act-note muted">${icon('message')} ${x.notes}</div>` : ''}</div>
        <span>${UI.liftChip(x.gain)}</span>
        <span class="badge ${STATUS_BADGE[x.status]}">${STATUS[x.status]}</span>
        ${canEdit ? html`<button class="btn btn-sm btn-ghost no-print" data-action="edit-action" data-fw="${x.frameworkId}" data-qid="${x.questionId}">Edit</button>` : html`<span></span>`}
      </li>`)}</ul>
    </details>`;
  }

  function refreshList() {
    const canEdit = App.can('actions:update');
    setHtml('#action-body', body(canEdit, isFiltered() ? [] : spotlightGroups()));
    $all('[data-action="status-tile"]').forEach(b => b.setAttribute('aria-pressed', b.dataset.status === filters.status ? 'true' : 'false'));
  }

  on('change', 'action-filter', el => { filters[el.dataset.key] = el.value; refreshList(); });
  on('input', 'action-search', root.U.debounce(el => {
    filters.q = el.value;
    refreshList();
    const input = $('[data-input="action-search"]');
    if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  }, 250));
  on('action', 'status-tile', el => { filters.status = filters.status === el.dataset.status ? 'active' : el.dataset.status; refreshList(); });
  on('action', 'action-reset', () => { filters = { ...filters, severity: '', status: 'active', q: '' }; refreshList(); });
  on('action', 'action-framework', el => { filters.framework = el.dataset.framework; render(); });

  on('action', 'edit-action', async (el, e) => {
    if (e && e.target.closest('summary')) e.preventDefault(); // do not toggle the row
    const item = plan.items.find(i => i.frameworkId === el.dataset.fw && i.questionId === el.dataset.qid);
    const group = el.dataset.group ? el.dataset.group.split(',').map(q => plan.items.find(i => i.frameworkId === item.frameworkId && i.questionId === q)).filter(Boolean) : [item];
    const gain = sum(group, i => i.gain);
    const canAccept = App.can('risk:accept');
    const rec = item.recommendation || {};
    const result = await UI.modal({
      title: 'Update action',
      wide: true,
      body: html`<div class="stack">
        <div><div class="row">${severityBadge(item.severity)}<strong class="grow">${item.title}</strong>${UI.liftChip(gain)}</div>
          ${group.length > 1 ? html`<div class="mt-8"><div class="label mb-8">Apply this update to</div>${group.map(g => html`<label class="apply-item"><input type="checkbox" name="apply" data-group="1" value="${g.questionId}" checked><span><span class="mono faint">${g.questionId}</span> ${g.question}</span><span class="badge ${STATUS_BADGE[g.status]}">${STATUS[g.status]}</span></label>`)}</div>`
            : html`<div class="small muted mt-8">${item.question}</div>`}</div>
        <div class="panel small"><strong>Recommended:</strong> ${rec.quickWin} ${rec.mediumTerm}${gain ? html`<div class="mt-8 muted">Completing this is expected to raise the Cyber Health Score by about ${UI.fmtGain(gain).replace('+', '')} point${gain >= 1.5 ? 's' : ''}.</div>` : ''}</div>
        <div class="form-grid">
          <div class="field"><label for="ac-status">Status</label><select class="select" id="ac-status" name="status">
            ${['open', 'in_progress', 'resolved'].map(s => html`<option value="${s}" ${item.status === s ? raw('selected') : ''}>${STATUS[s]}</option>`)}
            ${canAccept ? html`<option value="risk_accepted" ${item.status === 'risk_accepted' ? raw('selected') : ''}>Accept risk…</option>` : ''}</select></div>
          <div class="field"><label for="ac-owner">Owner</label><input class="input" id="ac-owner" name="owner" value="${item.owner || item.suggestedOwner || ''}"></div>
          <div class="field"><label for="ac-due">Due date</label><input class="input" id="ac-due" name="dueDate" type="date" value="${item.dueDate || ''}"></div>
          <div class="field"><label for="ac-ticket">Ticket reference</label><input class="input" id="ac-ticket" name="ticketRef" placeholder="e.g. SEC-142" value="${item.ticketRef || ''}"></div>
          <div class="field full"><label for="ac-notes">Notes</label><textarea class="textarea" id="ac-notes" name="notes" rows="3">${item.notes || ''}</textarea></div>
        </div>
        ${canAccept ? html`<div id="accept-fields" class="${item.status === 'risk_accepted' ? '' : 'hidden'} stack">
          <div class="callout callout-warn">${icon('alert')}<div>Accepting a risk records a management decision not to remediate for now. It requires a business justification and expires within 12 months.</div></div>
          <div class="field"><label for="ac-just">Business justification <span class="required">*</span></label><textarea class="textarea" id="ac-just" name="justification" rows="3">${item.acceptance ? item.acceptance.justification : ''}</textarea></div>
          <div class="form-grid"><div class="field"><label for="ac-comp">Compensating controls</label><input class="input" id="ac-comp" name="compensatingControls"></div>
          <div class="field"><label for="ac-exp">Review or expiry date <span class="required">*</span></label><input class="input" id="ac-exp" name="expiry" type="date" value="${item.acceptance ? item.acceptance.expiry : new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10)}"></div></div>
        </div>` : ''}
      </div>`,
      onSubmit: async (form, data) => {
        const targets = group.length > 1 ? data.apply : [item.questionId];
        if (!targets.length) throw new Error('Choose at least one finding to update.');
        for (const questionId of targets) {
          const base = { tenantId: App.tenantId, frameworkId: item.frameworkId, questionId };
          if (data.status === 'risk_accepted') {
            await API.post('/api/actions/accept-risk', { ...base, owner: data.owner, justification: data.justification, compensatingControls: data.compensatingControls, expiry: data.expiry });
            await API.put('/api/actions', { ...base, dueDate: data.dueDate, notes: data.notes, ticketRef: data.ticketRef });
          } else {
            await API.put('/api/actions', { ...base, status: data.status, owner: data.owner, dueDate: data.dueDate, notes: data.notes, ticketRef: data.ticketRef });
          }
        }
        return true;
      }
    });
    if (result) {
      UI.toast('Action updated', 'success');
      plan = await API.get(`/api/actions${API.qs({ tenantId: App.tenantId })}`);
      render();
    }
  });
  document.addEventListener('change', e => {
    if (e.target.id === 'ac-status') {
      const f = $('#accept-fields');
      if (f) f.classList.toggle('hidden', e.target.value !== 'risk_accepted');
    }
  });

  on('action', 'export-actions', async el => {
    const fmt = el.dataset.format;
    const { blob, filename } = await API.blob(`/api/actions/export.${fmt}${API.qs({ tenantId: App.tenantId, frameworkId: filters.framework })}`);
    download(filename || `action-plan.${fmt}`, blob);
  });
  on('action', 'print-actions', () => window.print());
})(window);
