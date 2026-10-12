// ============================================
// HawkSight — Assessor and administrator console
// ============================================

(function (root) {
  const { html, raw, icon, $, $all, setHtml, on, formData, fmtDate, fmtDateTime, ageLabel, plural, download } = root.U;
  const { App, API, UI, Content } = root;
  const Controls = root.HawkControls;

  const PACKAGES = [['snapshot', 'Snapshot: self-assessed, each control once'], ['comprehensive', 'Comprehensive: assessor-led, full assessment'], ['managed', 'Managed: Comprehensive on a schedule']];
  const STATUS_LABEL = { in_progress: 'In progress', submitted: 'Submitted', evidence_requested: 'Evidence requested', in_review: 'In review', completed: 'Completed' };
  const STATUS_BADGE = { in_progress: 'badge-brand', submitted: 'badge-low', evidence_requested: 'badge-medium', in_review: 'badge-low', completed: 'badge-success' };
  const isPA = () => App.role() === 'platform_admin';
  let libState = null;
  let tplState = null;
  let auditState = null;

  function pageHead(title, sub, actions) {
    return html`<div class="page-head"><div><h1>${title}</h1>${sub ? html`<div class="sub">${sub}</div>` : ''}</div>${actions ? html`<div class="btn-group">${actions}</div>` : ''}</div>`;
  }

  // ── Review queue ──
  let queueFilters = { status: '', tenantId: '' };
  App.route('/console', async () => {
    App.renderApp(UI.skeleton());
    const { items } = await API.get(`/api/admin/queue${API.qs(queueFilters)}`);
    const all = queueFilters.status || queueFilters.tenantId ? (await API.get('/api/admin/queue')).items : items;
    const count = st => all.filter(i => i.status === st).length;
    App.renderApp(html`<div class="page">
      ${pageHead('Review queue', 'Assessments across the organisations you support, ordered by what needs attention first.')}
      <div class="grid grid-4">
        <div class="card metric"><div class="metric-label">Awaiting review</div><div class="metric-value">${count('submitted')}</div></div>
        <div class="card metric"><div class="metric-label">In review</div><div class="metric-value">${count('in_review')}</div></div>
        <div class="card metric"><div class="metric-label">Evidence requested</div><div class="metric-value">${count('evidence_requested')}</div></div>
        <div class="card metric"><div class="metric-label">Overdue</div><div class="metric-value">${all.filter(i => i.overdue).length}</div></div>
      </div>
      <div class="card mt-16">
        <div class="card-head"><div class="row row-wrap">
          <select class="select" style="width:auto" data-change="queue-filter" data-key="status" aria-label="Status"><option value="">All statuses</option>${Object.keys(STATUS_LABEL).map(s => html`<option value="${s}" ${queueFilters.status === s ? raw('selected') : ''}>${STATUS_LABEL[s]}</option>`)}</select>
          <select class="select" style="width:auto" data-change="queue-filter" data-key="tenantId" aria-label="Organisation"><option value="">All organisations</option>${App.tenants.map(t => html`<option value="${t.id}" ${String(queueFilters.tenantId) === String(t.id) ? raw('selected') : ''}>${t.name}</option>`)}</select>
        </div><span class="muted">${plural(items.length, 'assessment')}</span></div>
        ${items.length ? html`<div class="table-wrap"><table class="table">
          <thead><tr><th>Organisation</th><th>Assessment</th><th>Status</th><th style="width:150px">Progress</th><th>Assessor</th><th>Due</th><th></th></tr></thead>
          <tbody>${items.map(i => html`<tr class="clickable" data-action="queue-open" data-id="${i.id}" data-tenant="${i.tenantId}" tabindex="0">
            <td><div class="strong">${i.tenantName}</div><div class="small muted">${PACKAGES.find(p => p[0] === i.package)[1]}</div></td>
            <td>${i.frameworkName}<div class="small muted">${i.title}</div></td>
            <td><span class="badge ${STATUS_BADGE[i.status]}">${STATUS_LABEL[i.status]}</span>${i.missingEvidence && i.status !== 'completed' ? html`<div class="small mt-8" style="color:var(--medium)">${plural(i.missingEvidence, 'evidence gap')}</div>` : ''}</td>
            <td><div class="progress"><span style="width:${i.progress}%"></span></div><div class="small muted mt-8">${i.progress}%</div></td>
            <td class="small">${i.assessorName || html`<span class="faint">Unassigned</span>`}</td>
            <td class="small nowrap ${i.overdue ? 'delta-down' : ''}">${i.dueDate ? fmtDate(i.dueDate) : '—'}</td>
            <td class="right">${icon('chevronRight')}</td></tr>`)}</tbody></table></div>`
          : html`<div class="card-body muted">Nothing matches these filters.</div>`}
      </div>
    </div>`);
  }, { staff: true });
  on('change', 'queue-filter', el => { queueFilters[el.dataset.key] = el.value; App.handleRoute(); });
  on('action', 'queue-open', async el => { await App.ensureTenant(el.dataset.tenant); App.navigate(`/app/assessments/${el.dataset.id}`); });

  // ── Organisations ──
  App.route('/console/organisations', async () => {
    App.renderApp(UI.skeleton());
    const [{ tenants }, catalog] = await Promise.all([API.get('/api/tenants'), Content.catalog()]);
    App.tenants = tenants;
    App.renderApp(html`<div class="page">
      ${pageHead('Organisations', 'Customer organisations, their package and enabled assessment templates.', html`
        ${isPA() ? html`<button class="btn" data-action="demo-reset">${icon('refresh')} Reset demo organisation</button><button class="btn btn-primary" data-action="tenant-create">${icon('plus')} New organisation</button>` : ''}`)}
      <div class="card"><div class="table-wrap"><table class="table">
        <thead><tr><th>Organisation</th><th>Package</th><th>Templates</th><th class="num">Users</th><th class="num">Assessments</th><th>Last report</th><th></th></tr></thead>
        <tbody>${tenants.map(t => html`<tr class="clickable" data-action="tenant-open" data-id="${t.id}" tabindex="0">
          <td><div class="strong">${t.name}${t.isDemo ? html` <span class="badge badge-medium">Demo</span>` : ''}${t.status !== 'active' ? html` <span class="badge">${t.status}</span>` : ''}</div><div class="small muted">${t.industry || '—'}${t.country ? ` · ${t.country}` : ''}</div></td>
          <td class="small">${(PACKAGES.find(p => p[0] === t.package) || [0, t.package])[1]}</td>
          <td class="small">${t.frameworks.map(f => Content.frameworkName(catalog, f)).join(', ') || '—'}</td>
          <td class="num">${t.counts.users}</td><td class="num">${t.counts.assessments}</td>
          <td class="small">${t.counts.last_report_at ? ageLabel(t.counts.last_report_at) : 'None'}</td>
          <td class="right">${icon('chevronRight')}</td></tr>`)}</tbody></table></div>
        ${!tenants.length ? UI.emptyState({ title: 'No organisations', message: isPA() ? 'Create the first customer organisation.' : 'No organisations are assigned to you yet.' }) : ''}</div>
    </div>`);
  }, { staff: true });

  on('action', 'tenant-open', el => App.navigate(`/console/organisations/${el.dataset.id}`));

  on('action', 'demo-reset', async () => {
    const ok = await UI.confirm({ title: 'Reset demo organisation', message: 'The demonstration organisation and its users will be recreated with fresh sample data. Any changes made to it will be lost.', confirmLabel: 'Reset demo' });
    if (!ok) return;
    const r = await API.post('/api/admin/demo/reset');
    const { tenants } = await API.get('/api/tenants');
    App.tenants = tenants;
    await UI.reveal({ title: 'Demo organisation ready', intro: `Sign in as ${r.email} (customer administrator). Also available: demo.it@northwind-demo.test (contributor) and demo.board@northwind-demo.test (read only), with the same password:`, value: r.password, note: 'Shown once. Reset again to generate a new password.' });
    App.handleRoute();
  });

  async function frameworkChecks(selected) {
    const catalog = await Content.catalog();
    const set = new Set(selected || []);
    return html`<div class="checks">${catalog.map(f => html`<label class="check-chip"><input type="checkbox" name="frameworks" data-group="1" value="${f.id}" ${set.has(f.id) ? raw('checked') : ''}><span>${f.shortName}</span></label>`)}</div>`;
  }

  on('action', 'tenant-create', async () => {
    const checks = await frameworkChecks([]);
    const done = await UI.modal({
      title: 'New organisation', wide: true,
      body: html`<div class="form-grid">
        <div class="field full"><label for="tc-name">Organisation name <span class="required">*</span></label><input class="input" id="tc-name" name="name" required></div>
        <div class="field"><label for="tc-ind">Industry</label><select class="select" id="tc-ind" name="industry"><option value="">Select…</option>${root.OrgOptions.industry.map(([v, l]) => html`<option value="${v}">${l}</option>`)}</select></div>
        <div class="field"><label for="tc-size">Size</label><select class="select" id="tc-size" name="size"><option value="">Select…</option>${root.OrgOptions.employeeCount.map(([v, l]) => html`<option value="${v}">${l}</option>`)}</select></div>
        <div class="field"><label for="tc-country">Country</label><input class="input" id="tc-country" name="country"></div>
        <div class="field"><label for="tc-pkg">Package</label><select class="select" id="tc-pkg" name="package">${PACKAGES.map(([v, l]) => html`<option value="${v}">${l}</option>`)}</select></div>
        <div class="field full"><span class="label">Assessment templates</span>${checks}</div></div>`,
      submitLabel: 'Create organisation',
      onSubmit: (f, d) => API.post('/api/tenants', d)
    });
    if (done) { UI.toast('Organisation created', 'success'); App.navigate(`/console/organisations/${done.tenant.id}`); }
  });

  App.route('/console/organisations/:id', async ({ id }) => {
    App.renderApp(UI.skeleton());
    const [t, users, staff] = await Promise.all([
      API.get(`/api/tenants/${encodeURIComponent(id)}`),
      API.get(`/api/users${API.qs({ tenantId: id })}`),
      isPA() ? API.get('/api/users?tenantId=staff') : Promise.resolve({ users: [] })
    ]);
    const tenant = t.tenant;
    const assessors = staff.users.filter(u => u.role === 'assessor');
    const assigned = new Set(tenant.assessors.map(a => a.id));
    const checks = await frameworkChecks(tenant.frameworks);
    App.renderApp(html`<div class="page">
      <div class="breadcrumb"><a href="#/console/organisations">Organisations</a>${icon('chevronRight')}<span>${tenant.name}</span></div>
      ${pageHead(tenant.name, `${tenant.industry || 'Industry not set'} · created ${fmtDate(tenant.createdAt)}`, html`<button class="btn btn-primary" data-action="tenant-workspace" data-id="${tenant.id}">Open workspace ${icon('chevronRight')}</button>`)}
      <div class="grid grid-2" style="align-items:start">
        <form class="card" data-submit="tenant-save" data-id="${tenant.id}" novalidate>
          <div class="card-head"><h3>Settings</h3></div>
          <div class="card-body stack">
            ${isPA() ? html`<div class="form-grid">
              <div class="field full"><label for="ts-name">Name</label><input class="input" id="ts-name" name="name" value="${tenant.name}"></div>
              <div class="field"><label for="ts-ind">Industry</label><select class="select" id="ts-ind" name="industry"><option value="">Select…</option>${root.OrgOptions.industry.map(([v, l]) => html`<option value="${v}" ${tenant.industry === v ? raw('selected') : ''}>${l}</option>`)}</select></div>
              <div class="field"><label for="ts-pkg">Package</label><select class="select" id="ts-pkg" name="package">${PACKAGES.map(([v, l]) => html`<option value="${v}" ${tenant.package === v ? raw('selected') : ''}>${l}</option>`)}</select></div>
              <div class="field"><label for="ts-status">Status</label><select class="select" id="ts-status" name="status"><option value="active" ${tenant.status === 'active' ? raw('selected') : ''}>Active</option><option value="suspended" ${tenant.status === 'suspended' ? raw('selected') : ''}>Suspended</option></select></div>
              <div class="field"><label for="ts-country">Country</label><input class="input" id="ts-country" name="country" value="${tenant.country || ''}"></div>
            </div>
            <div class="field"><span class="label">Enabled assessment templates</span>${checks}</div>
            <div class="field"><span class="label">Assigned assessors</span>${assessors.length ? html`<div class="checks">${assessors.map(a => html`<label class="check-chip"><input type="checkbox" name="assessorIds" data-group="1" value="${a.id}" ${assigned.has(a.id) ? raw('checked') : ''}><span>${a.name || a.email}</span></label>`)}</div>` : html`<span class="small muted">No assessor accounts exist yet. Create them under Staff accounts.</span>`}</div>
            <div><button class="btn btn-primary" type="submit">Save settings</button></div>`
            : html`<div class="small"><div><span class="muted">Package:</span> ${(PACKAGES.find(p => p[0] === tenant.package) || [0, tenant.package])[1]}</div><div><span class="muted">Templates:</span> ${tenant.frameworks.join(', ')}</div></div>`}
          </div>
        </form>
        <div class="card">
          <div class="card-head"><h3>Users</h3>${isPA() ? html`<button class="btn btn-sm" data-action="tenant-add-user" data-id="${tenant.id}">${icon('plus')} Add user</button>` : ''}</div>
          ${users.users.length ? html`<div class="table-wrap"><table class="table"><tbody>${users.users.map(u => html`<tr><td><div class="strong">${u.name || u.email}</div><div class="small muted">${u.email}</div></td><td class="small">${u.roleLabel}</td><td class="small">${u.lastLoginAt ? ageLabel(u.lastLoginAt) : 'Never signed in'}</td></tr>`)}</tbody></table></div>`
            : html`<div class="card-body muted">No users yet. Add a customer administrator to get started.</div>`}
          <div class="card-foot small muted">Customer administrators manage their own people from the organisation workspace.</div>
        </div>
      </div>
      ${isPA() && !tenant.isDemo ? html`<div class="card mt-24" style="border-color:#f3c4bf"><div class="card-head"><h3 style="color:var(--critical)">Delete organisation</h3></div><div class="card-body row row-between row-wrap"><p class="small muted" style="margin:0">Deletes all assessments, evidence, reports and users for this organisation. The audit log is kept.</p><button class="btn btn-danger" data-action="tenant-delete" data-id="${tenant.id}" data-name="${tenant.name}">Delete organisation</button></div></div>` : ''}
    </div>`);
  }, { staff: true });

  on('action', 'tenant-workspace', async el => { await App.ensureTenant(el.dataset.id); App.navigate('/app'); });
  on('submit', 'tenant-save', async form => {
    const d = formData(form);
    const r = await API.patch(`/api/tenants/${form.dataset.id}`, { ...d, assessorIds: (d.assessorIds || []).map(Number) });
    const idx = App.tenants.findIndex(t => t.id === r.tenant.id);
    if (idx >= 0) App.tenants[idx] = r.tenant;
    UI.toast('Organisation updated', 'success');
  });
  on('action', 'tenant-add-user', async el => {
    const done = await UI.modal({
      title: 'Add customer user',
      body: html`<div class="stack"><div class="field"><label for="tu-name">Name</label><input class="input" id="tu-name" name="name"></div>
        <div class="field"><label for="tu-email">Email</label><input class="input" id="tu-email" name="email" type="email" required></div>
        <div class="field"><label for="tu-role">Role</label><select class="select" id="tu-role" name="role"><option value="customer_admin">Customer administrator</option><option value="contributor">Contributor</option><option value="read_only">Read only</option></select></div></div>`,
      submitLabel: 'Create user',
      onSubmit: (f, d) => API.post('/api/users', { ...d, tenantId: Number(el.dataset.id) })
    });
    if (done) {
      await UI.reveal({ title: 'User created', intro: `Temporary password for ${done.user.email}:`, value: done.temporaryPassword, note: 'Shown once. The user must change it at first sign-in.' });
      App.handleRoute();
    }
  });
  on('action', 'tenant-delete', async el => {
    const done = await UI.modal({
      title: 'Delete organisation', danger: true, submitLabel: 'Delete permanently',
      body: html`<p>This permanently deletes <strong>${el.dataset.name}</strong> and all of its data. Type the organisation name to confirm.</p><div class="field"><input class="input" name="confirmName" aria-label="Organisation name" autocomplete="off"></div>`,
      onSubmit: (f, d) => API.del(`/api/tenants/${el.dataset.id}`, { confirmName: d.confirmName })
    });
    if (done) {
      App.tenants = (await API.get('/api/tenants')).tenants;
      if (!App.tenants.some(t => t.id === App.tenantId)) App.tenantId = App.tenants[0] ? App.tenants[0].id : null;
      UI.toast('Organisation deleted');
      App.navigate('/console/organisations');
    }
  });

  // ── Staff accounts ──
  App.route('/console/users', async () => {
    App.renderApp(UI.skeleton());
    const { users } = await API.get('/api/users?tenantId=staff');
    const me = App.session.user.id;
    App.renderApp(html`<div class="page">
      ${pageHead('Staff accounts', 'Platform administrators and assessors. Assessors only see organisations they are assigned to.', html`<button class="btn btn-primary" data-action="staff-create">${icon('plus')} New staff account</button>`)}
      <div class="card"><div class="table-wrap"><table class="table">
        <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Last sign-in</th><th></th></tr></thead>
        <tbody>${users.map(u => html`<tr>
          <td><div class="strong">${u.name || '—'}</div><div class="small muted">${u.email}</div></td>
          <td>${u.id === me ? u.roleLabel : html`<select class="select" style="width:auto" data-change="staff-role" data-id="${u.id}" aria-label="Role"><option value="platform_admin" ${u.role === 'platform_admin' ? raw('selected') : ''}>Platform Administrator</option><option value="assessor" ${u.role === 'assessor' ? raw('selected') : ''}>Assessor</option></select>`}</td>
          <td>${u.locked ? html`<span class="badge badge-high">Locked</span>` : u.status === 'active' ? html`<span class="badge badge-success">Active</span>` : html`<span class="badge">Disabled</span>`}</td>
          <td class="small">${u.lastLoginAt ? ageLabel(u.lastLoginAt) : 'Never'}</td>
          <td class="right">${u.id === me ? html`<span class="small muted">You</span>` : html`<div class="btn-group">
            ${u.locked ? html`<button class="btn btn-sm" data-action="staff-update" data-id="${u.id}" data-op="unlock">Unlock</button>` : ''}
            <button class="btn btn-sm" data-action="staff-update" data-id="${u.id}" data-op="${u.status === 'active' ? 'disable' : 'enable'}">${u.status === 'active' ? 'Disable' : 'Enable'}</button>
            <button class="btn btn-sm" data-action="staff-reset" data-id="${u.id}" data-email="${u.email}">Reset password</button>
            <button class="btn btn-sm btn-ghost btn-danger" data-action="staff-delete" data-id="${u.id}" data-email="${u.email}" aria-label="Delete">${icon('trash')}</button></div>`}</td></tr>`)}</tbody></table></div></div>
    </div>`);
  }, { staff: true, capability: 'tenants:manage' });

  on('action', 'staff-create', async () => {
    const done = await UI.modal({
      title: 'New staff account',
      body: html`<div class="stack"><div class="field"><label for="sc-name">Name</label><input class="input" id="sc-name" name="name"></div>
        <div class="field"><label for="sc-email">Email</label><input class="input" id="sc-email" name="email" type="email" required></div>
        <div class="field"><label for="sc-role">Role</label><select class="select" id="sc-role" name="role"><option value="assessor">Assessor</option><option value="platform_admin">Platform Administrator</option></select></div></div>`,
      submitLabel: 'Create account',
      onSubmit: (f, d) => API.post('/api/users', d)
    });
    if (done) {
      await UI.reveal({ title: 'Account created', intro: `Temporary password for ${done.user.email}:`, value: done.temporaryPassword, note: 'Shown once. The user must change it at first sign-in.' });
      App.handleRoute();
    }
  });
  on('change', 'staff-role', async el => { await API.patch(`/api/users/${el.dataset.id}`, { role: el.value }); UI.toast('Role updated', 'success'); });
  on('action', 'staff-update', async el => {
    await API.patch(`/api/users/${el.dataset.id}`, el.dataset.op === 'unlock' ? { unlock: true } : { status: el.dataset.op === 'disable' ? 'disabled' : 'active' });
    UI.toast('Account updated', 'success');
    App.handleRoute();
  });
  on('action', 'staff-reset', async el => {
    const ok = await UI.confirm({ title: 'Reset password', message: `Generate a temporary password for ${el.dataset.email}?`, confirmLabel: 'Reset' });
    if (!ok) return;
    const r = await API.post(`/api/users/${el.dataset.id}/reset-password`);
    await UI.reveal({ title: 'Temporary password', intro: `Share with ${el.dataset.email} through a trusted channel.`, value: r.temporaryPassword });
  });
  on('action', 'staff-delete', async el => {
    const ok = await UI.confirm({ title: 'Delete account', message: `Delete ${el.dataset.email}?`, confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    await API.del(`/api/users/${el.dataset.id}`);
    UI.toast('Account deleted');
    App.handleRoute();
  });

  // ── Scoring configuration ──
  let cfgState = null;
  App.route('/console/scoring', async () => {
    App.renderApp(UI.skeleton());
    cfgState = await API.get('/api/admin/config');
    renderScoring();
  }, { staff: true, capability: 'config:manage' });

  function renderScoring() {
    const { config, history, modules } = cfgState;
    const tiers = Object.values(Controls.CRITICALITY_TIERS);
    const catalogNames = Object.keys(modules);
    const rules = config.applicabilityRules || [];
    App.renderApp(html`<div class="page">
      ${pageHead('Scoring configuration', `Active configuration version ${config.version}. Every change creates a new version; issued reports keep the version they were calculated with.`)}
      <form data-submit="config-save" novalidate class="stack">
        <div class="card"><div class="card-head"><h3>Control weights</h3><span class="muted">Points per control at full implementation</span></div>
          <div class="card-body"><div class="grid grid-4">${tiers.map(t => html`<div class="field"><label for="tw-${t.id}">${t.label}</label><input class="input" id="tw-${t.id}" type="number" step="0.5" min="0.5" max="100" name="tier_${t.id}" value="${config.tierWeights[t.id]}"><span class="hint">${t.description}</span></div>`)}</div></div></div>

        <div class="card"><div class="card-head"><h3>Critical-control gating</h3></div>
          <div class="card-body"><div class="grid grid-4">
            <label class="field"><span class="label">Gating enabled</span><select class="select" name="gating_enabled"><option value="true" ${config.gating.enabled ? raw('selected') : ''}>Enabled</option><option value="false" ${!config.gating.enabled ? raw('selected') : ''}>Disabled</option></select></label>
            <div class="field"><label for="g1">Cap with one failure</label><input class="input" id="g1" type="number" min="0" max="100" name="gating_one" value="${config.gating.oneFailureCap}"></div>
            <div class="field"><label for="g2">Cap with multiple failures</label><input class="input" id="g2" type="number" min="0" max="100" name="gating_multi" value="${config.gating.multiFailureCap}"></div>
            <div class="field"><label for="g3">Failures for the lower cap</label><input class="input" id="g3" type="number" min="2" max="20" name="gating_count" value="${config.gating.multiFailureCount}"></div>
          </div></div></div>

        <div class="card"><div class="card-head"><h3>Bands and thresholds</h3></div>
          <div class="card-body"><div class="grid grid-4">
            <div class="field"><label for="b1">Health "Strong" from</label><input class="input" id="b1" type="number" name="band_strong" value="${config.scoreBands.strong}"></div>
            <div class="field"><label for="b2">Health "Moderate" from</label><input class="input" id="b2" type="number" name="band_moderate" value="${config.scoreBands.moderate}"></div>
            <div class="field"><label for="b3">Results stale after (days)</label><input class="input" id="b3" type="number" name="stale" value="${config.staleAfterDays}"></div>
            <div class="field"><label for="b4">Minimum benchmark population</label><input class="input" id="b4" type="number" min="5" name="bench" value="${config.benchmarkMinimumPopulation}"></div>
            <div class="field"><label for="b5">Risk "Low" below</label><input class="input" id="b5" type="number" name="risk_low" value="${config.riskBands.low}"></div>
            <div class="field"><label for="b6">Risk "Moderate" below</label><input class="input" id="b6" type="number" name="risk_moderate" value="${config.riskBands.moderate}"></div>
            <div class="field"><label for="b7">Risk "High" below</label><input class="input" id="b7" type="number" name="risk_high" value="${config.riskBands.high}"></div>
            <div class="field"><label for="b8">Context elevation threshold</label><input class="input" id="b8" type="number" step="0.05" name="elevation" value="${config.contextElevationThreshold}"></div>
          </div></div></div>

        <div class="card"><div class="card-head"><h3>Domain weights</h3><span class="muted">Leave blank for equal weighting. If set, weights must total 100.</span></div>
          <div class="card-body stack">${catalogNames.map(fw => {
            const w = (config.domainWeights || {})[fw] || {};
            return html`<details ${Object.keys(w).length ? raw('open') : ''}><summary class="strong" style="cursor:pointer">${fw.toUpperCase()} <span class="small muted" data-sum="${fw}">${Object.keys(w).length ? `Total ${Object.values(w).reduce((n, v) => n + Number(v), 0)}` : 'Equal weighting'}</span></summary>
              <div class="grid grid-4 mt-8">${modules[fw].map(m => html`<div class="field"><label for="dw-${fw}-${m.id}">${m.name}</label><input class="input" id="dw-${fw}-${m.id}" type="number" min="0" max="100" step="0.5" name="dw|${fw}|${m.id}" value="${w[m.id] !== undefined ? w[m.id] : ''}" data-input="dw-sum" data-fw="${fw}"></div>`)}</div></details>`;
          })}</div></div>

        <div class="card"><div class="card-head"><h3>Applicability rules</h3><span class="muted">Conditional logic that hides questions or suggests Not applicable</span></div>
          <div class="table-wrap"><table class="table"><tbody>${rules.map((r, i) => html`<tr>
            <td style="width:60px"><input type="checkbox" name="rule_${i}" ${r.enabled !== false ? raw('checked') : ''} aria-label="Enable rule ${r.id}"></td>
            <td><div class="strong">${r.id}</div><div class="small muted">${r.description}</div></td>
            <td class="small"><span class="badge ${r.effect === 'hide' ? 'badge-medium' : 'badge-low'}">${r.effect === 'hide' ? 'Hide' : 'Suggest N/A'}</span></td>
            <td class="small mono">${r.when.map(c => `${c.field} ${c.op} ${JSON.stringify(c.value)}`).join(' and ')}</td>
            <td class="right"><button type="button" class="btn btn-sm btn-ghost" data-action="rule-remove" data-index="${i}" aria-label="Remove rule">${icon('trash')}</button></td></tr>`)}</tbody></table></div>
          <div class="card-foot"><button type="button" class="btn btn-sm" data-action="rule-add">${icon('plus')} Add rule</button></div></div>

        <div class="card"><div class="card-body row row-wrap">
          <div class="field grow"><label for="cfg-note">Reason for change <span class="required">*</span></label><input class="input" id="cfg-note" name="note" placeholder="e.g. Increase weight of critical controls following methodology review"></div>
          <button class="btn btn-primary" type="submit" style="align-self:flex-end">Publish configuration</button></div></div>
      </form>

      <div class="card mt-16"><div class="card-head"><h3>Version history</h3></div>
        <div class="table-wrap"><table class="table"><thead><tr><th>Version</th><th>Reason</th><th>By</th><th>Date</th></tr></thead>
        <tbody>${history.map(h => html`<tr><td class="strong">${h.version}</td><td>${h.note || '—'}</td><td class="small">${h.created_by || 'System'}</td><td class="small">${fmtDateTime(h.created_at)}</td></tr>`)}
        ${!history.length ? html`<tr><td colspan="4" class="muted">Using built-in defaults (version 0).</td></tr>` : ''}</tbody></table></div></div>
    </div>`);
  }

  on('input', 'dw-sum', el => {
    const fw = el.dataset.fw;
    const vals = $all(`[data-fw="${CSS.escape(fw)}"]`).map(i => i.value).filter(v => v !== '');
    const sum = vals.reduce((n, v) => n + Number(v), 0);
    const label = $(`[data-sum="${CSS.escape(fw)}"]`);
    if (label) {
      label.textContent = vals.length ? `Total ${Math.round(sum * 10) / 10}${Math.abs(sum - 100) > 0.01 ? ' (must be 100)' : ''}` : 'Equal weighting';
      label.style.color = vals.length && Math.abs(sum - 100) > 0.01 ? 'var(--critical)' : '';
    }
  });
  on('action', 'rule-remove', el => {
    cfgState.config.applicabilityRules.splice(Number(el.dataset.index), 1);
    renderScoring();
    UI.toast('Rule removed. Publish the configuration to apply.');
  });
  on('action', 'rule-add', async () => {
    const example = { id: 'my-rule', enabled: true, effect: 'suggest_na', description: 'Explain when this rule applies', scope: { controls: ['HS-CLD-01'] }, when: [{ field: 'profile.itEnvironment', op: 'eq', value: 'on-premises' }] };
    const done = await UI.modal({
      title: 'Add applicability rule', wide: true,
      body: html`<p class="small muted">Rules are data, not code. Scope can list <code>frameworks</code>, <code>questions</code>, <code>controls</code>, <code>domains</code> or <code>keywords</code>. Conditions use <code>profile.&lt;field&gt;</code> or <code>answer:&lt;questionId&gt;</code> (answer as a 0–1 fraction) with <code>eq</code>, <code>neq</code>, <code>in</code>, <code>includes</code>, <code>notIncludes</code>, <code>lte</code> or <code>gte</code>.</p>
        <textarea class="textarea mono" name="rule" rows="12" aria-label="Rule definition">${JSON.stringify(example, null, 2)}</textarea>`,
      submitLabel: 'Add rule',
      onSubmit: (f, d) => {
        let rule;
        try { rule = JSON.parse(d.rule); } catch { throw new Error('The rule is not valid JSON'); }
        if (!rule.id || !['hide', 'suggest_na'].includes(rule.effect) || !Array.isArray(rule.when) || !rule.when.length) throw new Error('A rule needs an id, an effect (hide or suggest_na) and at least one condition');
        if ((cfgState.config.applicabilityRules || []).some(r => r.id === rule.id)) throw new Error('A rule with this id already exists');
        return rule;
      }
    });
    if (done) {
      cfgState.config.applicabilityRules = [...(cfgState.config.applicabilityRules || []), done];
      renderScoring();
      UI.toast('Rule added. Publish the configuration to apply.');
    }
  });
  on('submit', 'config-save', async form => {
    const d = formData(form);
    const config = cfgState.config;
    const tierWeights = {};
    Object.keys(Controls.CRITICALITY_TIERS).forEach(t => { tierWeights[t] = Number(d[`tier_${t}`]); });
    const domainWeights = {};
    Object.keys(d).filter(k => k.startsWith('dw|')).forEach(k => {
      const [, fw, mod] = k.split('|');
      if (d[k] === '') return;
      domainWeights[fw] = domainWeights[fw] || {};
      domainWeights[fw][mod] = Number(d[k]);
    });
    const rules = (config.applicabilityRules || []).map((r, i) => ({ ...r, enabled: !!d[`rule_${i}`] }));
    const body = {
      note: d.note,
      config: {
        tierWeights,
        domainWeights,
        gating: { ...config.gating, enabled: d.gating_enabled === 'true', oneFailureCap: Number(d.gating_one), multiFailureCap: Number(d.gating_multi), multiFailureCount: Number(d.gating_count) },
        scoreBands: { strong: Number(d.band_strong), moderate: Number(d.band_moderate) },
        riskBands: { low: Number(d.risk_low), moderate: Number(d.risk_moderate), high: Number(d.risk_high) },
        staleAfterDays: Number(d.stale),
        benchmarkMinimumPopulation: Number(d.bench),
        contextElevationThreshold: Number(d.elevation),
        applicabilityRules: rules
      }
    };
    const r = await API.post('/api/admin/config', body);
    Content.clear();
    UI.toast(`Configuration version ${r.version} published`, 'success');
    App.handleRoute();
  });

  // ── Control library ──
  App.route('/console/library', async () => {
    App.renderApp(UI.skeleton());
    const lib = await API.get('/api/admin/library');
    App.renderApp(html`<div class="page">
      ${pageHead('Control library', `${lib.controls.length} canonical HawkSight controls. Questions from every template map to these controls, which carry criticality, evidence requirements, remediation guidance and framework references.`)}
      <div class="card"><div class="card-head"><h3>Mapping coverage by template</h3><span class="muted">How questions are linked to controls</span></div>
        <div class="table-wrap"><table class="table">
          <thead><tr><th>Template</th><th class="num">Questions</th><th class="num">Mapped</th><th>Method</th><th>Criticality mix</th><th></th></tr></thead>
          <tbody>${lib.coverage.map(c => html`<tr>
            <td class="strong">${c.name}</td><td class="num">${c.questions}</td>
            <td class="num ${c.mapped < c.questions ? 'delta-down' : ''}">${Math.round((c.mapped / c.questions) * 100)}%</td>
            <td class="small">${Object.entries(c.methods).map(([k, v]) => `${k} ${v}`).join(' · ')}</td>
            <td class="small">${['critical', 'high', 'medium', 'foundational'].map(t => `${lib.tiers[t].label} ${c.tiers[t] || 0}`).join(' · ')}</td>
            <td class="right"><button class="btn btn-sm" data-action="coverage-detail" data-fw="${c.frameworkId}">Questions</button></td></tr>`)}</tbody></table></div>
        ${lib.unusedControls.length ? html`<div class="card-foot small">Controls not used by any template: ${lib.unusedControls.join(', ')}</div>` : ''}</div>

      <div class="card mt-16"><div class="card-head"><h3>Controls</h3><input class="input" style="width:240px" type="search" placeholder="Filter controls" data-input="control-filter" aria-label="Filter controls"></div>
        <div class="table-wrap"><table class="table" id="control-table">
          <thead><tr><th>Control</th><th>Domain</th><th>Criticality</th><th>Evidence</th><th class="num">Questions</th><th>Missing references</th><th></th></tr></thead>
          <tbody>${lib.controls.map(c => html`<tr data-text="${(c.id + ' ' + c.name + ' ' + c.domain).toLowerCase()}">
            <td><div class="strong">${c.name}</div><div class="small mono faint">${c.id}</div></td>
            <td class="small">${(lib.domains.find(d => d.id === c.domain) || {}).name}</td>
            <td><span class="badge ${c.criticality === 'critical' ? 'badge-critical' : c.criticality === 'high' ? 'badge-high' : 'badge-outline'}">${lib.tiers[c.criticality].label}</span></td>
            <td class="small">${c.evidenceRequired ? 'Required' : 'Optional'}</td>
            <td class="num">${Object.values(c.usage).reduce((n, v) => n + v, 0)}</td>
            <td class="small">${c.unmappedReferences.length ? c.unmappedReferences.map(r => lib.referenceFrameworks[r].name.split(' ')[0]).join(', ') : html`<span class="faint">None</span>`}</td>
            <td class="right"><button class="btn btn-sm" data-action="control-detail" data-id="${c.id}">Details</button></td></tr>`)}</tbody></table></div></div>
    </div>`);
    libState = lib;
  }, { staff: true });

  on('input', 'control-filter', el => {
    const q = el.value.toLowerCase();
    $all('#control-table tbody tr').forEach(tr => { tr.classList.toggle('hidden', !!q && !tr.dataset.text.includes(q)); });
  });
  on('action', 'control-detail', el => {
    const lib = libState;
    const c = lib.controls.find(x => x.id === el.dataset.id);
    UI.drawer({
      title: c.name, subtitle: html`<span class="mono">${c.id}</span> · ${lib.tiers[c.criticality].label}`,
      body: html`<div class="stack">
        <div><div class="label">Objective</div><p>${c.objective}</p></div>
        <div><div class="label">Expected state</div><p>${c.expectedState}</p></div>
        <div><div class="label">Evidence examples</div><p>${c.evidenceExamples.join('; ')}</p></div>
        <div><div class="label">Framework references</div><table class="table table-compact"><tbody>${Object.keys(lib.referenceFrameworks).map(r => html`<tr><td class="small">${lib.referenceFrameworks[r].name} ${lib.referenceFrameworks[r].version}</td><td class="small strong">${(c.mappings[r] || []).join(', ') || '—'}</td></tr>`)}</tbody></table></div>
        <div><div class="label">Remediation</div><ul class="small"><li><strong>Quick win:</strong> ${c.remediation.quickWin}</li><li><strong>1–3 months:</strong> ${c.remediation.mediumTerm}</li><li><strong>Longer term:</strong> ${c.remediation.longTerm}</li></ul><p class="small muted">Owner: ${c.remediation.owner} · ${c.remediation.reference}</p></div>
        <div><div class="label">Used by</div><p class="small">${Object.entries(c.usage).map(([fw, n]) => `${fw} (${n})`).join(', ') || 'Not used'}</p></div>
      </div>`
    });
  });
  on('action', 'coverage-detail', el => {
    const lib = libState;
    const c = lib.coverage.find(x => x.frameworkId === el.dataset.fw);
    UI.drawer({
      title: `${c.name}: question mapping`, subtitle: `${c.mapped} of ${c.questions} questions mapped`,
      body: html`<table class="table table-compact"><thead><tr><th>Question</th><th>Control</th><th>Method</th></tr></thead><tbody>${c.items.map(i => html`<tr><td class="small"><span class="mono faint">${i.id}</span> ${i.text}</td><td class="small nowrap">${i.controlId || html`<span class="delta-down">Unmapped</span>`}<div class="faint">${i.tier}${i.evidenceRequired ? ' · evidence' : ''}</div></td><td class="small">${i.method}</td></tr>`)}</tbody></table>`
    });
  });

  // ── Templates ──
  App.route('/console/templates', async () => {
    App.renderApp(UI.skeleton());
    const data = await API.get('/api/admin/templates');
    const me = App.session.user.email;
    const STATUS = { draft: 'Draft', in_review: 'In review', approved: 'Approved', published: 'Published', rejected: 'Rejected' };
    const BADGE = { draft: '', in_review: 'badge-low', approved: 'badge-brand', published: 'badge-success', rejected: 'badge-high' };
    App.renderApp(html`<div class="page">
      ${pageHead('Assessment templates', 'Question wording, guidance, criticality and evidence requirements change through a Draft, Review, Approved, Published lifecycle. A second person must approve every change.', isPA() ? html`<button class="btn btn-primary" data-action="template-draft">${icon('plus')} Propose a change</button>` : '')}
      <div class="card"><div class="table-wrap"><table class="table">
        <thead><tr><th>Template</th><th>Version</th><th>Basis</th><th class="num">Questions</th></tr></thead>
        <tbody>${data.templates.map(t => html`<tr><td class="strong">${t.name}</td><td>v${t.templateVersion}</td><td class="small">${t.basis}</td><td class="num">${t.questionCount}</td></tr>`)}</tbody></table></div></div>
      <div class="card mt-16"><div class="card-head"><h3>Change requests</h3></div>
        ${data.versions.length ? html`<div class="table-wrap"><table class="table">
          <thead><tr><th>Change</th><th>Status</th><th>Author</th><th>Reviewer</th><th></th></tr></thead>
          <tbody>${data.versions.map(v => html`<tr>
            <td><div class="strong">${v.frameworkId} v${v.version}</div><div class="small muted">${v.note || ''}</div><div class="small faint">${Object.keys(v.changes.questions || {}).join(', ')}</div></td>
            <td><span class="badge ${BADGE[v.status]}">${STATUS[v.status]}</span></td>
            <td class="small">${v.author}<div class="faint">${fmtDate(v.createdAt)}</div></td>
            <td class="small">${v.reviewer || '—'}${v.publishedAt ? html`<div class="faint">Published ${fmtDate(v.publishedAt)}</div>` : ''}</td>
            <td class="right"><div class="btn-group">
              <button class="btn btn-sm btn-ghost" data-action="template-view" data-id="${v.id}">View</button>
              ${v.status === 'draft' ? html`<button class="btn btn-sm" data-action="template-move" data-id="${v.id}" data-to="in_review">Submit for review</button>` : ''}
              ${v.status === 'in_review' && v.author !== me ? html`<button class="btn btn-sm" data-action="template-move" data-id="${v.id}" data-to="approved">Approve</button><button class="btn btn-sm" data-action="template-move" data-id="${v.id}" data-to="rejected">Reject</button>` : ''}
              ${v.status === 'approved' && isPA() ? html`<button class="btn btn-sm btn-primary" data-action="template-move" data-id="${v.id}" data-to="published">Publish</button>` : ''}
            </div></td></tr>`)}</tbody></table></div>` : html`<div class="card-body muted">No change requests yet.</div>`}</div>
    </div>`);
    tplState = data;
  }, { staff: true });

  on('action', 'template-view', el => {
    const v = tplState.versions.find(x => String(x.id) === el.dataset.id);
    UI.drawer({ title: `${v.frameworkId} v${v.version}`, subtitle: v.note, body: html`<table class="table table-compact"><thead><tr><th>Question</th><th>Change</th></tr></thead><tbody>${Object.entries(v.changes.questions || {}).map(([q, c]) => html`<tr><td class="mono small">${q}</td><td class="small">${Object.entries(c).map(([k, val]) => html`<div><strong>${k}:</strong> ${String(val)}</div>`)}</td></tr>`)}</tbody></table>` });
  });
  on('action', 'template-move', async el => {
    const labels = { in_review: 'Submit for review', approved: 'Approve change', rejected: 'Reject change', published: 'Publish change' };
    const ok = await UI.confirm({ title: labels[el.dataset.to], message: el.dataset.to === 'published' ? 'Publishing creates a new scoring configuration version. Open assessments use the change immediately; issued reports are not affected.' : 'The change request will move to the next stage.', confirmLabel: labels[el.dataset.to] });
    if (!ok) return;
    await API.post(`/api/admin/templates/versions/${el.dataset.id}/transition`, { to: el.dataset.to });
    if (el.dataset.to === 'published') Content.clear();
    UI.toast('Change request updated', 'success');
    App.handleRoute();
  });
  on('action', 'template-draft', async () => {
    const catalog = await Content.catalog();
    const done = await UI.modal({
      title: 'Propose a template change', wide: true,
      body: html`<div class="form-grid">
        <div class="field"><label for="td-fw">Template</label><select class="select" id="td-fw" name="frameworkId">${catalog.map(f => html`<option value="${f.id}">${f.shortName}</option>`)}</select></div>
        <div class="field"><label for="td-q">Question ID</label><input class="input" id="td-q" name="questionId" placeholder="e.g. HC-IN-01 or PR.AA-03" required></div>
        <div class="field full"><label for="td-text">New wording (optional)</label><textarea class="textarea" id="td-text" name="text" rows="2"></textarea></div>
        <div class="field full"><label for="td-guid">New guidance (optional)</label><textarea class="textarea" id="td-guid" name="guidance" rows="2"></textarea></div>
        <div class="field"><label for="td-tier">Criticality override</label><select class="select" id="td-tier" name="tier"><option value="">No change</option>${Object.values(Controls.CRITICALITY_TIERS).map(t => html`<option value="${t.id}">${t.label}</option>`)}</select></div>
        <div class="field"><label for="td-ctrl">Control mapping override</label><select class="select" id="td-ctrl" name="controlId"><option value="">No change</option>${Controls.CONTROLS.map(c => html`<option value="${c.id}">${c.id} ${c.name}</option>`)}</select></div>
        <div class="field"><label for="td-ev">Evidence requirement</label><select class="select" id="td-ev" name="evidence"><option value="">No change</option><option value="yes">Required</option><option value="no">Not required</option></select></div>
        <div class="field"><label for="td-ret">Retire question</label><select class="select" id="td-ret" name="retired"><option value="">No</option><option value="yes">Yes, remove from the template</option></select></div>
        <div class="field full"><label for="td-note">Reason <span class="required">*</span></label><input class="input" id="td-note" name="note" required></div></div>`,
      submitLabel: 'Create draft',
      onSubmit: (f, d) => {
        if (!d.note) throw new Error('Give a reason for the change');
        const change = {};
        if (d.text) change.text = d.text;
        if (d.guidance) change.guidance = d.guidance;
        if (d.tier) change.tier = d.tier;
        if (d.controlId) change.controlId = d.controlId;
        if (d.evidence) change.evidenceRequired = d.evidence === 'yes';
        if (d.retired) change.retired = true;
        return API.post(`/api/admin/templates/${encodeURIComponent(d.frameworkId)}/versions`, { note: d.note, changes: { questions: { [d.questionId.trim()]: change } } });
      }
    });
    if (done) { UI.toast(`Draft v${done.version} created`, 'success'); App.handleRoute(); }
  });

  // ── Audit log ──
  let auditFilters = { q: '', action: '', tenantId: '', from: '', to: '' };
  App.route('/console/audit', async () => {
    App.renderApp(UI.skeleton());
    const data = await API.get(`/api/admin/audit${API.qs({ ...auditFilters, limit: 300 })}`);
    auditState = data;
    App.renderApp(html`<div class="page">
      ${pageHead('Audit log', 'Append-only record of security-relevant activity. Entries cannot be edited or deleted.', html`<button class="btn" data-action="audit-export">${icon('download')} Export CSV</button>`)}
      <form class="card card-body row row-wrap" data-submit="audit-search" novalidate>
        <input class="input" style="width:240px" name="q" type="search" placeholder="Search user, action or detail" value="${auditFilters.q}" aria-label="Search">
        <select class="select" style="width:auto" name="action" aria-label="Action"><option value="">All actions</option>${data.actions.map(a => html`<option value="${a}" ${auditFilters.action === a ? raw('selected') : ''}>${a}</option>`)}</select>
        <select class="select" style="width:auto" name="tenantId" aria-label="Organisation"><option value="">All organisations</option>${App.tenants.map(t => html`<option value="${t.id}" ${String(auditFilters.tenantId) === String(t.id) ? raw('selected') : ''}>${t.name}</option>`)}</select>
        <label class="row small"><span class="muted">From</span><input class="input" style="width:auto" type="date" name="from" value="${auditFilters.from}"></label>
        <label class="row small"><span class="muted">To</span><input class="input" style="width:auto" type="date" name="to" value="${auditFilters.to}"></label>
        <button class="btn btn-primary" type="submit">Search</button>
      </form>
      <div class="card mt-16"><div class="table-wrap"><table class="table table-compact">
        <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Organisation</th><th>Target</th><th>Details</th><th>IP</th></tr></thead>
        <tbody>${data.logs.map(l => html`<tr><td class="small nowrap">${fmtDateTime(l.created_at)}</td><td class="small">${l.user_email || 'System'}</td><td><span class="badge badge-outline">${l.action}</span></td><td class="small">${l.tenant_name || '—'}</td><td class="small mono">${l.target || ''}</td><td class="small mono" style="max-width:320px;word-break:break-word">${l.details ? (typeof l.details === 'string' ? l.details : JSON.stringify(l.details)) : ''}</td><td class="small mono">${l.ip_address || ''}</td></tr>`)}
        ${!data.logs.length ? html`<tr><td colspan="7" class="muted">No entries match.</td></tr>` : ''}</tbody></table></div></div>
    </div>`);
  }, { staff: true, capability: 'audit:view' });
  on('submit', 'audit-search', form => { auditFilters = { ...auditFilters, ...formData(form) }; App.handleRoute(); });
  on('action', 'audit-export', () => {
    const rows = [['Time', 'User', 'Action', 'Organisation', 'Target', 'Details', 'IP']];
    auditState.logs.forEach(l => rows.push([l.created_at, l.user_email || '', l.action, l.tenant_name || '', l.target || '', typeof l.details === 'string' ? l.details : JSON.stringify(l.details || ''), l.ip_address || '']));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""').replace(/^([=+\-@])/, "'$1")}"`).join(',')).join('\r\n');
    download(`hawksight-audit-${new Date().toISOString().slice(0, 10)}.csv`, new Blob(['﻿' + csv], { type: 'text/csv' }));
  });

  // ── Analytics ──
  App.route('/console/analytics', async () => {
    App.renderApp(UI.skeleton());
    const a = await API.get('/api/admin/analytics?days=90');
    const weeks = [...new Set(a.weekly.map(w => w.week))];
    const val = (week, type) => (a.weekly.find(w => w.week === week && w.type === type) || {}).n || 0;
    App.renderApp(html`<div class="page">
      ${pageHead('Product analytics', `Last ${a.periodDays} days. ${a.note}`)}
      <div class="grid grid-4">
        <div class="card metric"><div class="metric-label">Assessments started</div><div class="metric-value">${a.funnel.started}</div></div>
        <div class="card metric"><div class="metric-label">Submitted</div><div class="metric-value">${a.funnel.submitted}</div><div class="metric-sub">${a.funnel.completionRate === null ? '—' : `${a.funnel.completionRate}% of starts`}</div></div>
        <div class="card metric"><div class="metric-label">Reports issued</div><div class="metric-value">${a.funnel.issued}</div></div>
        <div class="card metric"><div class="metric-label">Inactive over 30 days</div><div class="metric-value">${a.abandonment.inactiveOver30Days}</div><div class="metric-sub">Open assessments at risk of abandonment</div></div>
      </div>
      <div class="grid grid-2 mt-16" style="align-items:start">
        <div class="card"><div class="card-head"><h3>Engagement</h3></div><div class="grid grid-2" style="gap:0">
          <div class="metric"><div class="metric-label">Sign-ins</div><div class="metric-value">${a.engagement.logins}</div></div>
          <div class="metric"><div class="metric-label">Report views</div><div class="metric-value">${a.engagement.reportViews}</div></div>
          <div class="metric"><div class="metric-label">PDF exports</div><div class="metric-value">${a.engagement.reportExports}</div></div>
          <div class="metric"><div class="metric-label">Sections completed</div><div class="metric-value">${a.engagement.sectionsCompleted}</div></div></div></div>
        <div class="card"><div class="card-head"><h3>Time to complete</h3><span class="muted">Start to completion, median days</span></div>
          ${a.completionTime.length ? html`<div class="table-wrap"><table class="table"><tbody>${a.completionTime.map(c => html`<tr><td>${c.name}</td><td class="num">${c.completed} completed</td><td class="num strong">${c.medianDays} days</td></tr>`)}</tbody></table></div>` : html`<div class="card-body muted">No completed assessments in this period.</div>`}</div>
      </div>
      <div class="card mt-16"><div class="card-head"><h3>Weekly activity</h3></div>
        ${weeks.length ? html`<div class="table-wrap"><table class="table table-compact"><thead><tr><th>Week</th><th class="num">Started</th><th class="num">Submitted</th><th class="num">Reports issued</th></tr></thead>
          <tbody>${weeks.map(w => html`<tr><td>${w}</td><td class="num">${val(w, 'assessment_started')}</td><td class="num">${val(w, 'assessment_submitted')}</td><td class="num">${val(w, 'report_issued')}</td></tr>`)}</tbody></table></div>` : html`<div class="card-body muted">No activity recorded yet.</div>`}</div>
    </div>`);
  }, { staff: true, capability: 'analytics:view' });

})(window);
