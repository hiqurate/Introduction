// ============================================
// HawkSight — Management action plan
// ============================================

(function (root) {
  const { html, raw, icon, $, $all, setHtml, on, fmtDate, plural, severityBadge, SEVERITY_ORDER, SEVERITY_LABEL, download } = root.U;
  const { App, API, UI } = root;

  const STATUS = { open: 'Open', in_progress: 'In progress', resolved: 'Resolved', risk_accepted: 'Risk accepted', acceptance_expired: 'Acceptance expired' };
  const STATUS_BADGE = { open: '', in_progress: 'badge-brand', resolved: 'badge-success', risk_accepted: 'badge-medium', acceptance_expired: 'badge-high' };
  let plan = null;
  let filters = { framework: '', severity: '', status: 'active', q: '' };

  App.route('/app/actions', async () => {
    if (!App.tenantId) return App.renderApp(html`<div class="page">${UI.emptyState({ title: 'No organisation selected', message: 'Select an organisation to see its action plan.' })}</div>`);
    App.renderApp(UI.skeleton());
    plan = await API.get(`/api/actions${API.qs({ tenantId: App.tenantId })}`);
    render();
  });

  function visibleItems() {
    return plan.items.filter(i => {
      if (filters.framework && i.frameworkId !== filters.framework) return false;
      if (filters.severity && i.severity !== filters.severity) return false;
      if (filters.status === 'active' && !['open', 'in_progress', 'acceptance_expired'].includes(i.status)) return false;
      if (filters.status === 'overdue' && !i.overdue) return false;
      if (filters.status && !['active', 'overdue'].includes(filters.status) && i.status !== filters.status) return false;
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (![i.title, i.question, i.owner, i.moduleName, i.ref].some(x => String(x || '').toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }

  function render() {
    const s = plan.summary;
    const canEdit = App.can('actions:update');
    const frameworks = plan.sources;
    App.renderApp(html`<div class="page">
      <div class="page-head">
        <div><h1>Action plan</h1><div class="sub">Findings from the latest issued report for each assessment, with owners, due dates and status. Status changes are recorded in the audit log.</div></div>
        <div class="btn-group">
          <button class="btn" data-action="export-actions" data-format="xlsx">${icon('download')} Excel</button>
          <button class="btn" data-action="export-actions" data-format="csv">${icon('download')} CSV</button>
          <button class="btn" data-action="print-actions">${icon('printer')} Print</button>
        </div>
      </div>
      ${frameworks.some(f => f.source === 'provisional') ? html`<div class="callout callout-info mb-16 no-print">${icon('info')}<div>Some items come from an assessment that has not been issued yet. They are provisional and may change before the report is issued.</div></div>` : ''}
      <div class="grid grid-4">
        <div class="card metric"><div class="metric-label">Open</div><div class="metric-value">${s.open + s.acceptance_expired}</div><div class="metric-sub">${s.acceptance_expired ? `${s.acceptance_expired} with expired acceptance` : 'Not started'}</div></div>
        <div class="card metric"><div class="metric-label">In progress</div><div class="metric-value">${s.in_progress}</div><div class="metric-sub">${s.overdue ? html`<span style="color:var(--critical)">${s.overdue} overdue</span>` : 'None overdue'}</div></div>
        <div class="card metric"><div class="metric-label">Resolved</div><div class="metric-value">${s.resolved}</div><div class="metric-sub">Verified at next assessment</div></div>
        <div class="card metric"><div class="metric-label">Risk accepted</div><div class="metric-value">${s.risk_accepted}</div><div class="metric-sub">With owner and expiry</div></div>
      </div>
      <div class="card mt-16">
        <div class="card-head no-print" style="flex-wrap:wrap">
          <div class="row row-wrap">
            <input class="input" style="width:220px" type="search" placeholder="Search findings or owners" value="${filters.q}" data-input="action-search" aria-label="Search">
            ${frameworks.length > 1 ? html`<select class="select" style="width:auto" data-change="action-filter" data-key="framework" aria-label="Assessment"><option value="">All assessments</option>${frameworks.map(f => html`<option value="${f.frameworkId}" ${filters.framework === f.frameworkId ? raw('selected') : ''}>${f.frameworkName}</option>`)}</select>` : ''}
            <select class="select" style="width:auto" data-change="action-filter" data-key="severity" aria-label="Severity"><option value="">All severities</option>${SEVERITY_ORDER.map(sv => html`<option value="${sv}" ${filters.severity === sv ? raw('selected') : ''}>${SEVERITY_LABEL[sv]}</option>`)}</select>
            <select class="select" style="width:auto" data-change="action-filter" data-key="status" aria-label="Status">
              ${[['active', 'Open and in progress'], ['overdue', 'Overdue'], ['', 'All statuses'], ['open', 'Open'], ['in_progress', 'In progress'], ['resolved', 'Resolved'], ['risk_accepted', 'Risk accepted'], ['acceptance_expired', 'Acceptance expired']].map(([k, l]) => html`<option value="${k}" ${filters.status === k ? raw('selected') : ''}>${l}</option>`)}
            </select>
          </div>
          <span class="small muted" id="action-count"></span>
        </div>
        <div id="action-table">${table(canEdit)}</div>
      </div>
      ${frameworks.length ? html`<p class="small muted mt-16">Sources: ${frameworks.map(f => f.source === 'report' ? `${f.frameworkName} report v${f.reportVersion} (${fmtDate(f.issuedAt)})` : `${f.frameworkName} (provisional)`).join('; ')}.</p>` : ''}
    </div>`);
  }

  function table(canEdit) {
    const items = visibleItems();
    const count = $('#action-count');
    if (count) count.textContent = `${items.length} of ${plan.items.length} findings`;
    if (!plan.items.length) return UI.emptyState({ title: 'No findings yet', message: 'Findings appear here once an assessment has answers.' });
    if (!items.length) return html`<div class="card-body muted">No findings match these filters.</div>`;
    return html`<div class="table-wrap"><table class="table">
      <thead><tr><th>Severity</th><th style="width:36%">Finding</th><th>Owner</th><th>Due</th><th>Status</th><th class="no-print"></th></tr></thead>
      <tbody>${items.map(i => html`<tr>
        <td>${severityBadge(i.severity)}<div class="small faint mt-8">${i.timeframe}</div></td>
        <td><div class="strong">${i.title}</div><div class="small muted"><span class="mono">${i.questionId}</span> ${i.question}</div><div class="small faint">${i.frameworkName} · ${i.moduleName}</div>
          ${i.acceptance ? html`<div class="small mt-8" style="color:var(--medium)">Accepted until ${fmtDate(i.acceptance.expiry)}: ${i.acceptance.justification}</div>` : ''}
          ${i.notes ? html`<div class="small mt-8">${i.notes}</div>` : ''}</td>
        <td class="small">${i.owner || html`<span class="faint">Suggested: ${i.suggestedOwner || '—'}</span>`}${i.ticketRef ? html`<div class="faint">${i.ticketRef}</div>` : ''}</td>
        <td class="small nowrap ${i.overdue ? 'delta-down' : ''}">${i.dueDate ? fmtDate(i.dueDate) : '—'}${i.overdue ? html`<div>Overdue</div>` : ''}</td>
        <td><span class="badge ${STATUS_BADGE[i.status]}">${STATUS[i.status]}</span></td>
        <td class="right no-print">${canEdit ? html`<button class="btn btn-sm" data-action="edit-action" data-fw="${i.frameworkId}" data-qid="${i.questionId}">Update</button>` : ''}</td>
      </tr>`)}</tbody></table></div>`;
  }

  on('change', 'action-filter', el => { filters[el.dataset.key] = el.value; setHtml('#action-table', table(App.can('actions:update'))); });
  on('input', 'action-search', root.U.debounce(el => { filters.q = el.value; setHtml('#action-table', table(App.can('actions:update'))); }, 200));

  on('action', 'edit-action', async el => {
    const item = plan.items.find(i => i.frameworkId === el.dataset.fw && i.questionId === el.dataset.qid);
    const canAccept = App.can('risk:accept');
    const rec = item.recommendation || {};
    const result = await UI.modal({
      title: 'Update action',
      wide: true,
      body: html`<div class="stack">
        <div><div class="row">${severityBadge(item.severity)}<strong>${item.title}</strong></div><div class="small muted mt-8">${item.question}</div></div>
        <div class="panel small"><strong>Recommended:</strong> ${rec.quickWin} ${rec.mediumTerm}</div>
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
        const base = { tenantId: App.tenantId, frameworkId: item.frameworkId, questionId: item.questionId };
        if (data.status === 'risk_accepted') {
          await API.post('/api/actions/accept-risk', { ...base, owner: data.owner, justification: data.justification, compensatingControls: data.compensatingControls, expiry: data.expiry });
          await API.put('/api/actions', { ...base, dueDate: data.dueDate, notes: data.notes, ticketRef: data.ticketRef });
        } else {
          await API.put('/api/actions', { ...base, status: data.status, owner: data.owner, dueDate: data.dueDate, notes: data.notes, ticketRef: data.ticketRef });
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
