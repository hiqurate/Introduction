// ============================================
// HawkSight — Organisation settings
// Profile (risk context), people and invitations, report branding,
// reassessment schedule.
// ============================================

(function (root) {
  const { html, raw, icon, $, setHtml, on, formData, fmtDate, ageLabel } = root.U;
  const { App, API, UI } = root;

  const OPTIONS = {
    industry: [['healthcare', 'Healthcare'], ['pharma', 'Pharmaceutical and life sciences'], ['bfsi', 'Banking, financial services and insurance'], ['fintech', 'FinTech and payments'], ['technology', 'IT services and SaaS'], ['education', 'Education'], ['retail', 'Retail and e-commerce'], ['manufacturing', 'Manufacturing and industrial'], ['professional', 'Professional services'], ['hospitality', 'Hospitality'], ['logistics', 'Logistics and transport'], ['government', 'Government and public sector'], ['energy', 'Energy and utilities'], ['other', 'Other']],
    employeeCount: [['< 50', 'Fewer than 50'], ['50 - 250', '50 to 250'], ['250 - 1000', '250 to 1,000'], ['1000+', 'More than 1,000']],
    geography: [['India', 'India'], ['United States', 'United States'], ['United Kingdom', 'United Kingdom'], ['European Union', 'European Union'], ['Middle East', 'Middle East'], ['Asia Pacific', 'Asia Pacific'], ['Other', 'Other regions']],
    regulations: [['dpdp', 'DPDP Act (India)'], ['certin', 'CERT-In directions'], ['rbi', 'RBI cyber security framework'], ['sebi', 'SEBI CSCRF'], ['irdai', 'IRDAI guidelines'], ['gdpr', 'GDPR'], ['hipaa', 'HIPAA'], ['pci', 'PCI DSS'], ['iso27001', 'ISO/IEC 27001 certification'], ['soc2', 'SOC 2 attestation']],
    dataTypes: [['personal', 'Personal data'], ['health', 'Health records'], ['payment', 'Payment card data'], ['financial', 'Financial account data'], ['children', "Children's data"], ['biometric', 'Biometric data'], ['ip', 'Intellectual property'], ['government', 'Government or classified data']],
    technology: [['m365', 'Microsoft 365'], ['google', 'Google Workspace'], ['aws', 'AWS'], ['azure', 'Microsoft Azure'], ['gcp', 'Google Cloud'], ['saas', 'Business SaaS applications'], ['custom_apps', 'Custom-built applications'], ['ot', 'Operational technology, medical or IoT devices']],
    securityTools: [['SIEM', 'SIEM or log platform'], ['EDR', 'EDR / XDR'], ['Firewall', 'Next-generation firewall'], ['IAM', 'Identity provider / SSO'], ['PAM', 'Privileged access management'], ['DLP', 'Data loss prevention'], ['Email Security', 'Email security gateway'], ['Vulnerability Management', 'Vulnerability scanning'], ['WAF', 'Web application firewall'], ['CASB', 'CASB / SSE'], ['Backup Solution', 'Enterprise backup'], ['MDM', 'Mobile device management']]
  };

  let org = null;
  let tab = 'profile';

  App.route('/app/organisation', async () => {
    if (!App.tenantId) return App.renderApp(html`<div class="page">${UI.emptyState({ title: 'No organisation selected', message: 'Select an organisation first.' })}</div>`);
    App.renderApp(UI.skeleton());
    const t = await API.get(`/api/tenants/${App.tenantId}`);
    org = { tenant: t.tenant, profile: t.profile || {}, profileUpdatedAt: t.profileUpdatedAt };
    if (App.can('users:manage')) {
      const [u, inv] = await Promise.all([
        API.get(`/api/users${API.qs({ tenantId: App.tenantId })}`),
        API.get(`/api/invitations${API.qs({ tenantId: App.tenantId })}`)
      ]);
      org.users = u.users;
      org.assignable = u.assignableRoles.filter(r => ['customer_admin', 'contributor', 'read_only'].includes(r.id));
      org.invitations = inv.invitations;
    }
    render();
  });

  function tabs() {
    const list = [['profile', 'Organisation profile']];
    if (App.can('users:manage')) list.push(['people', 'People']);
    if (['customer_admin', 'platform_admin'].includes(App.role())) list.push(['branding', 'Report branding'], ['schedule', 'Reassessment schedule']);
    return html`<div class="tabs" role="tablist">${list.map(([k, l]) => html`<button class="tab" role="tab" aria-selected="${tab === k ? 'true' : 'false'}" data-action="org-tab" data-tab="${k}">${l}</button>`)}</div>`;
  }

  function render() {
    const body = tab === 'people' ? people() : tab === 'branding' ? branding() : tab === 'schedule' ? schedule() : profileForm();
    App.renderApp(html`<div class="page page-narrow" style="max-width:980px">
      <div class="page-head"><div><h1>${org.tenant.name}</h1><div class="sub">${org.tenant.package === 'snapshot' ? 'Snapshot plan' : org.tenant.package === 'managed' ? 'Managed plan' : 'Comprehensive plan'} · ${org.tenant.frameworks.length} assessment templates enabled</div></div></div>
      ${tabs()}
      ${body}
    </div>`);
  }
  on('action', 'org-tab', el => { tab = el.dataset.tab; render(); });

  // ── Profile ──
  function select(name, label, value, opts, required) {
    return html`<div class="field"><label for="pf-${name}">${label}${required ? html` <span class="required">*</span>` : ''}</label>
      <select class="select" id="pf-${name}" name="${name}" ${required ? raw('required') : ''} ${App.can('profile:edit') ? '' : raw('disabled')}><option value="">Select…</option>${opts.map(([v, l]) => html`<option value="${v}" ${String(value) === v ? raw('selected') : ''}>${l}</option>`)}</select></div>`;
  }
  function chips(name, label, values, opts, hint) {
    const set = new Set(values || []);
    return html`<div class="field full"><span class="label">${label}</span>${hint ? html`<span class="hint">${hint}</span>` : ''}
      <div class="checks">${opts.map(([v, l]) => html`<label class="check-chip"><input type="checkbox" name="${name}" data-group="1" value="${v}" ${set.has(v) ? raw('checked') : ''} ${App.can('profile:edit') ? '' : raw('disabled')}><span>${l}</span></label>`)}</div></div>`;
  }
  function text(name, label, value, opts = {}) {
    const dis = App.can('profile:edit') ? '' : raw('disabled');
    return html`<div class="field ${opts.full ? 'full' : ''}"><label for="pf-${name}">${label}${opts.required ? html` <span class="required">*</span>` : ''}</label>
      ${opts.area ? html`<textarea class="textarea" id="pf-${name}" name="${name}" rows="2" placeholder="${opts.placeholder || ''}" ${dis}>${value || ''}</textarea>`
        : html`<input class="input" id="pf-${name}" name="${name}" type="${opts.type || 'text'}" value="${value === undefined || value === null ? '' : value}" placeholder="${opts.placeholder || ''}" ${opts.required ? raw('required') : ''} ${opts.type === 'number' ? raw('min="0"') : ''} ${dis}>`}
      ${opts.hint ? html`<span class="hint">${opts.hint}</span>` : ''}</div>`;
  }

  function profileForm() {
    const p = org.profile;
    const editable = App.can('profile:edit');
    return html`<form class="card card-body" data-submit="save-profile" novalidate>
      <p class="muted">The profile tailors which questions apply, how findings are prioritised and how risk exposure is calculated. Changes apply to assessments in progress; issued reports keep the profile they were issued with.${org.profileUpdatedAt ? ` Last updated ${ageLabel(org.profileUpdatedAt)}.` : ''}</p>
      <div class="form-section"><h3>Organisation</h3><p>Basic facts used on reports and for industry comparisons.</p>
        <div class="form-grid">
          ${text('organizationName', 'Organisation name', p.organizationName || org.tenant.name, { required: true })}
          ${select('industry', 'Industry', p.industry, OPTIONS.industry, true)}
          ${select('employeeCount', 'Number of employees', p.employeeCount, OPTIONS.employeeCount, true)}
          ${text('officeLocations', 'Number of office locations', p.officeLocations, { type: 'number', hint: 'Enter 0 for a fully remote organisation.' })}
          ${chips('geography', 'Where you operate', p.geography, OPTIONS.geography)}
          ${text('businessDescription', 'What the organisation does', p.businessDescription, { area: true, full: true, placeholder: 'e.g. Diagnostic laboratory network serving hospitals in South India' })}
        </div></div>
      <div class="form-section"><h3>Risk context</h3><p>Sensitive data, regulation and business criticality increase the impact of control gaps.</p>
        <div class="form-grid">
          ${chips('regulations', 'Regulatory and contractual obligations', p.regulations, OPTIONS.regulations)}
          ${chips('dataTypes', 'Types of data you hold', p.dataTypes, OPTIONS.dataTypes)}
          ${text('criticalServices', 'Critical business services', p.criticalServices, { area: true, full: true, placeholder: 'Services whose disruption would stop the business, e.g. patient portal, ERP, payment gateway' })}
          ${select('businessCriticality', 'Tolerance for downtime of critical services', p.businessCriticality, [['high', 'Low tolerance (hours)'], ['medium', 'Moderate (a day or two)'], ['low', 'High tolerance']])}
          ${select('internetFacing', 'Customer-facing internet services', p.internetFacing, [['yes', 'Yes'], ['no', 'No']])}
          ${select('recentIncidents', 'Security incident in the last 24 months', p.recentIncidents, [['no', 'No'], ['yes', 'Yes'], ['unsure', 'Not sure']])}
        </div></div>
      <div class="form-section"><h3>Technology</h3><p>Used to suggest when controls are not applicable, for example data-centre controls in a cloud-only environment.</p>
        <div class="form-grid">
          ${select('itEnvironment', 'IT environment', p.itEnvironment, [['on-premises', 'On-premises'], ['cloud', 'Cloud only'], ['hybrid', 'Hybrid']])}
          ${select('developsSoftware', 'Develops software in-house', p.developsSoftware, [['yes', 'Yes'], ['no', 'No']])}
          ${chips('technology', 'Platforms in use', p.technology, OPTIONS.technology)}
          ${chips('securityTools', 'Security tools in place', p.securityTools, OPTIONS.securityTools, 'Recorded for context; the assessment itself determines how well each control works.')}
        </div></div>
      <div class="form-section"><h3>Priorities</h3>
        <div class="form-grid">
          ${text('securityConcerns', 'Main security concerns', p.securityConcerns, { area: true, full: true })}
          ${text('plannedImprovements', 'Improvements planned in the next 12 months', p.plannedImprovements, { area: true, full: true })}
          ${text('requirementsDetails', 'Scope notes and specific requirements', p.requirementsDetails, { area: true, full: true, placeholder: 'e.g. PCI DSS scope is limited to the e-commerce platform' })}
          ${text('defaultOwner', 'Default owner for remediation actions', p.defaultOwner, { placeholder: 'e.g. Head of IT' })}
        </div></div>
      ${editable ? html`<div class="row"><button class="btn btn-primary" type="submit">Save profile</button><span class="form-error" id="pf-error" role="alert"></span></div>` : html`<p class="small muted">Your role can view but not change the organisation profile.</p>`}
    </form>`;
  }

  on('submit', 'save-profile', async form => {
    const data = formData(form);
    const err = $('#pf-error');
    err.textContent = '';
    if (!data.organizationName || !data.industry || !data.employeeCount) { err.textContent = 'Organisation name, industry and size are required.'; return; }
    const profile = { ...data, officeLocations: data.officeLocations === '' ? undefined : Number(data.officeLocations) };
    try {
      const r = await API.put(`/api/tenants/${App.tenantId}/profile`, { profile });
      org.profile = r.profile;
      UI.toast('Organisation profile saved', 'success');
    } catch (e) {
      err.textContent = e.message;
    }
  });

  // ── People ──
  function people() {
    const me = App.session.user.id;
    return html`
      <div class="card">
        <div class="card-head"><h3>People</h3><div class="btn-group"><button class="btn btn-sm" data-action="org-add-user">${icon('plus')} Add user</button><button class="btn btn-sm btn-primary" data-action="org-invite">${icon('plus')} Invite</button></div></div>
        <div class="table-wrap"><table class="table">
          <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Last sign-in</th><th></th></tr></thead>
          <tbody>${org.users.map(u => html`<tr>
            <td><div class="strong">${u.name || '—'}</div><div class="small muted">${u.email}</div></td>
            <td>${u.id === me ? u.roleLabel : html`<select class="select" style="width:auto" data-change="org-user-role" data-id="${u.id}" aria-label="Role for ${u.email}">${org.assignable.map(r => html`<option value="${r.id}" ${u.role === r.id ? raw('selected') : ''}>${r.label}</option>`)}</select>`}</td>
            <td>${u.locked ? html`<span class="badge badge-high">Locked</span>` : u.status === 'active' ? html`<span class="badge badge-success">Active</span>` : html`<span class="badge">Disabled</span>`}</td>
            <td class="small">${u.lastLoginAt ? ageLabel(u.lastLoginAt) : 'Never'}</td>
            <td class="right">${u.id === me ? html`<span class="small muted">You</span>` : html`<div class="btn-group">
              ${u.locked ? html`<button class="btn btn-sm" data-action="org-user-update" data-id="${u.id}" data-op="unlock">Unlock</button>` : ''}
              <button class="btn btn-sm" data-action="org-user-update" data-id="${u.id}" data-op="${u.status === 'active' ? 'disable' : 'enable'}">${u.status === 'active' ? 'Disable' : 'Enable'}</button>
              <button class="btn btn-sm" data-action="org-user-reset" data-id="${u.id}" data-email="${u.email}">Reset password</button>
              <button class="btn btn-sm btn-ghost btn-danger" data-action="org-user-delete" data-id="${u.id}" data-email="${u.email}" aria-label="Delete ${u.email}">${icon('trash')}</button></div>`}</td></tr>`)}</tbody></table></div>
      </div>
      <div class="card mt-16"><div class="card-head"><h3>Invitations</h3><span class="muted">Links expire after 7 days</span></div>
        ${org.invitations.length ? html`<div class="table-wrap"><table class="table"><tbody>${org.invitations.map(i => html`<tr>
          <td><div class="strong">${i.email}</div><div class="small muted">${i.roleLabel}${i.sections.length ? ` · ${i.sections.length} sections` : ''}</div></td>
          <td class="small">Sent ${fmtDate(i.createdAt)}</td>
          <td><span class="badge ${i.status === 'accepted' ? 'badge-success' : i.status === 'pending' ? 'badge-brand' : ''}">${i.status[0].toUpperCase() + i.status.slice(1)}</span></td>
          <td class="right">${i.status === 'pending' ? html`<button class="btn btn-sm" data-action="org-revoke-invite" data-id="${i.id}">Revoke</button>` : ''}</td></tr>`)}</tbody></table></div>`
          : html`<div class="card-body muted">No invitations sent.</div>`}</div>`;
  }

  async function reloadPeople() {
    const [u, inv] = await Promise.all([API.get(`/api/users${API.qs({ tenantId: App.tenantId })}`), API.get(`/api/invitations${API.qs({ tenantId: App.tenantId })}`)]);
    org.users = u.users;
    org.invitations = inv.invitations;
    render();
  }

  function roleOptions() {
    return html`${org.assignable.map(r => html`<option value="${r.id}" ${r.id === 'contributor' ? raw('selected') : ''}>${r.label}</option>`)}`;
  }

  on('action', 'org-invite', async () => {
    const done = await UI.modal({
      title: 'Invite someone',
      body: html`<div class="stack"><p class="small muted">The invitee chooses their own password using a one-time link.</p>
        <div class="field"><label for="oi-email">Work email</label><input class="input" id="oi-email" name="email" type="email" required></div>
        <div class="field"><label for="oi-role">Role</label><select class="select" id="oi-role" name="role">${roleOptions()}</select></div></div>`,
      submitLabel: 'Create invitation',
      onSubmit: (f, d) => API.post('/api/invitations', { tenantId: App.tenantId, email: d.email, role: d.role })
    });
    if (done) {
      await UI.reveal({ title: 'Invitation created', intro: 'Share this link with the invitee through a trusted channel. It works once and expires in 7 days.', value: `${location.origin}${done.invitePath}`, note: 'For security, the link is shown only once.' });
      reloadPeople();
    }
  });

  on('action', 'org-add-user', async () => {
    const done = await UI.modal({
      title: 'Add user',
      body: html`<div class="stack"><p class="small muted">Creates the account with a temporary password that must be changed at first sign-in. Prefer invitations where possible.</p>
        <div class="field"><label for="ou-name">Name</label><input class="input" id="ou-name" name="name"></div>
        <div class="field"><label for="ou-email">Work email</label><input class="input" id="ou-email" name="email" type="email" required></div>
        <div class="field"><label for="ou-role">Role</label><select class="select" id="ou-role" name="role">${roleOptions()}</select></div></div>`,
      submitLabel: 'Create user',
      onSubmit: (f, d) => API.post('/api/users', { tenantId: App.tenantId, name: d.name, email: d.email, role: d.role })
    });
    if (done) {
      await UI.reveal({ title: 'User created', intro: `Temporary password for ${done.user.email}. Share it through a trusted channel; the user must change it at first sign-in.`, value: done.temporaryPassword, note: 'This password is shown only once.' });
      reloadPeople();
    }
  });

  on('change', 'org-user-role', async el => {
    await API.patch(`/api/users/${el.dataset.id}`, { role: el.value });
    UI.toast('Role updated', 'success');
  });
  on('action', 'org-user-update', async el => {
    const body = el.dataset.op === 'unlock' ? { unlock: true } : { status: el.dataset.op === 'disable' ? 'disabled' : 'active' };
    await API.patch(`/api/users/${el.dataset.id}`, body);
    UI.toast('User updated', 'success');
    reloadPeople();
  });
  on('action', 'org-user-reset', async el => {
    const ok = await UI.confirm({ title: 'Reset password', message: `A temporary password will be generated for ${el.dataset.email} and their sessions will be ended.`, confirmLabel: 'Reset password' });
    if (!ok) return;
    const r = await API.post(`/api/users/${el.dataset.id}/reset-password`);
    await UI.reveal({ title: 'Temporary password', intro: `Share this with ${el.dataset.email} through a trusted channel.`, value: r.temporaryPassword, note: 'Shown only once. The user must change it at sign-in.' });
  });
  on('action', 'org-user-delete', async el => {
    const ok = await UI.confirm({ title: 'Delete user', message: `Delete ${el.dataset.email}? Their past actions remain in the audit log.`, confirmLabel: 'Delete user', danger: true });
    if (!ok) return;
    await API.del(`/api/users/${el.dataset.id}`);
    UI.toast('User deleted');
    reloadPeople();
  });
  on('action', 'org-revoke-invite', async el => {
    await API.del(`/api/invitations/${el.dataset.id}`);
    UI.toast('Invitation revoked');
    reloadPeople();
  });

  // ── Branding ──
  function branding() {
    const b = org.tenant.branding || {};
    return html`<form class="card card-body stack" data-submit="save-branding" novalidate>
      <p class="muted">Branding applies to reports issued from now on. Issued reports keep the branding they were issued with.</p>
      <div class="form-grid">
        <div class="field"><label for="br-logo">Logo</label><input class="input" id="br-logo" name="logo" type="file" accept="image/png,image/jpeg" data-change="branding-logo"><span class="hint">PNG or JPEG, under 300 KB. Shown on the report cover.</span></div>
        <div class="field"><label for="br-color">Accent colour</label><input class="input" id="br-color" name="primaryColor" value="${b.primaryColor || '#5B2C8E'}" placeholder="#5B2C8E" pattern="#[0-9a-fA-F]{6}"></div>
        <div class="field"><label for="br-by">Prepared by</label><input class="input" id="br-by" name="preparedBy" value="${b.preparedBy || ''}" placeholder="HiQurate Ops using HawkSight"></div>
        <div class="field"><label for="br-foot">Report footer</label><input class="input" id="br-foot" name="reportFooter" value="${b.reportFooter || ''}" placeholder="e.g. Internal use only"></div>
      </div>
      <div class="panel"><div class="label mb-8">Logo preview</div><div id="logo-preview">${b.logoDataUrl ? html`<img src="${b.logoDataUrl}" alt="Current logo" style="max-height:48px">` : html`<span class="muted small">No logo</span>`}</div></div>
      <div class="row"><button class="btn btn-primary" type="submit">Save branding</button><span class="form-error" id="br-error" role="alert"></span></div>
    </form>`;
  }
  let pendingLogo = null;
  on('change', 'branding-logo', el => {
    const file = el.files[0];
    if (!file) return;
    if (file.size > 300 * 1024) { UI.toast('Logo must be smaller than 300 KB', 'error'); el.value = ''; return; }
    const reader = new FileReader();
    reader.onload = () => { pendingLogo = reader.result; setHtml('#logo-preview', html`<img src="${pendingLogo}" alt="New logo" style="max-height:48px">`); };
    reader.readAsDataURL(file);
  });
  on('submit', 'save-branding', async form => {
    const d = formData(form);
    const err = $('#br-error');
    err.textContent = '';
    const current = org.tenant.branding || {};
    try {
      const r = await API.put(`/api/tenants/${App.tenantId}/branding`, {
        logoDataUrl: pendingLogo || current.logoDataUrl, primaryColor: d.primaryColor, preparedBy: d.preparedBy, reportFooter: d.reportFooter
      });
      org.tenant.branding = r.branding;
      pendingLogo = null;
      UI.toast('Branding saved', 'success');
    } catch (e) {
      err.textContent = e.message;
    }
  });

  // ── Schedule ──
  function schedule() {
    const f = org.tenant.reassessmentFrequency || '';
    return html`<form class="card card-body stack" data-submit="save-schedule" novalidate>
      <p class="muted">A recurring schedule keeps results current. HawkSight shows a reminder on the overview 30 days before each reassessment is due, and marks results as stale once they pass the configured age.</p>
      <div class="field" style="max-width:320px"><label for="sc-freq">Reassess every</label><select class="select" id="sc-freq" name="frequency">
        ${[['', 'No schedule'], ['quarterly', 'Quarter'], ['semiannual', 'Six months'], ['annual', 'Year']].map(([v, l]) => html`<option value="${v}" ${f === v ? raw('selected') : ''}>${l}</option>`)}</select></div>
      <div><button class="btn btn-primary" type="submit">Save schedule</button></div>
    </form>`;
  }
  on('submit', 'save-schedule', async form => {
    const r = await API.patch(`/api/tenants/${App.tenantId}`, { reassessmentFrequency: form.frequency.value });
    org.tenant = r.tenant;
    UI.toast('Schedule saved', 'success');
  });

  root.OrgOptions = OPTIONS;
})(window);
