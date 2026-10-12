// ============================================
// HawkSight — Assessments: list, start, workspace, review and issue
// ============================================

(function (root) {
  const { html, raw, icon, $, setHtml, on, formData, fmtDate, fmtDateTime, ageLabel, plural } = root.U;
  const { App, API, UI, Content } = root;

  const STATUS_BADGE = {
    in_progress: 'badge-brand', submitted: 'badge-low', evidence_requested: 'badge-medium', in_review: 'badge-low', completed: 'badge-success', archived: ''
  };
  const SECTION_STATUS = { not_started: 'Not started', in_progress: 'In progress', complete: 'Complete' };

  function statusBadge(a) {
    return html`<span class="badge ${STATUS_BADGE[a.status] || ''}">${a.statusLabel}</span>`;
  }

  // ── List ──
  App.route('/app/assessments', async () => {
    if (!App.tenantId) return App.renderApp(html`<div class="page">${UI.emptyState({ title: 'No organisation selected', message: 'Select an organisation to manage assessments.' })}</div>`);
    App.renderApp(UI.skeleton());
    const [{ assessments }, tenantRes, catalog] = await Promise.all([
      API.get(`/api/assessments${API.qs({ tenantId: App.tenantId })}`),
      API.get(`/api/tenants/${App.tenantId}`),
      Content.catalog()
    ]);
    const tenant = tenantRes.tenant;
    const active = assessments.filter(a => a.status !== 'completed');
    const done = assessments.filter(a => a.status === 'completed');
    const entitled = catalog.filter(f => tenant.frameworks.includes(f.id));
    const canCreate = App.can('assessment:create');

    App.renderApp(html`<div class="page">
      <div class="page-head"><div><h1>Assessments</h1><div class="sub">${tenant.name} · ${tenant.package === 'snapshot' ? 'Snapshot plan: self-assessed, covering each security control once' : tenant.package === 'managed' ? 'Managed plan: assessor-led assessments on a schedule' : 'Comprehensive plan: full assessment reviewed by HiQurate Ops'}</div></div></div>

      <div class="card">
        <div class="card-head"><h3>Active assessments</h3><span class="muted">${active.length}</span></div>
        ${active.length ? html`<div class="table-wrap"><table class="table">
          <thead><tr><th>Assessment</th><th>Status</th><th style="width:200px">Progress</th><th class="num">Provisional health</th><th>Due</th><th></th></tr></thead>
          <tbody>${active.map(a => html`<tr class="clickable" data-action="open-assessment" data-id="${a.id}" tabindex="0">
            <td><div class="strong">${a.title}</div><div class="small muted">${a.frameworkName} · started ${fmtDate(a.createdAt)} · updated ${ageLabel(a.updatedAt)}</div></td>
            <td>${statusBadge(a)}${a.missingEvidence ? html`<div class="small" style="color:var(--medium);margin-top:4px">${plural(a.missingEvidence, 'evidence gap')}</div>` : ''}</td>
            <td><div class="progress"><span style="width:${a.progress.percentage}%"></span></div><div class="small muted mt-8">${a.progress.answered} of ${a.progress.applicable} · ${a.progress.percentage}%</div></td>
            <td class="num">${a.healthScore === null ? '—' : a.healthScore}</td>
            <td class="nowrap">${UI.deadlineBadge(a)}</td>
            <td class="right">${icon('chevronRight')}</td></tr>`)}</tbody></table></div>`
          : html`<div class="card-body muted">No assessments are in progress.</div>`}
      </div>

      ${canCreate ? html`<div class="card mt-16">
        <div class="card-head"><h3>Start an assessment</h3><span class="muted">Templates enabled for ${tenant.name}</span></div>
        ${entitled.length ? html`<div class="table-wrap"><table class="table"><tbody>${entitled.map(f => {
          const openOne = active.find(a => a.frameworkId === f.id);
          const hasCompleted = done.some(a => a.frameworkId === f.id);
          return html`<tr>
            <td><div class="strong">${f.name}</div><div class="small muted">${f.description}</div></td>
            <td class="small nowrap">${tenant.package === 'snapshot' ? html`${f.snapshotQuestionCount} questions<div class="faint">about 15 to 25 minutes</div>` : html`${f.questionCount} questions<div class="faint">${f.estimatedTime}</div>`}</td>
            <td class="small nowrap">Template v${f.templateVersion}</td>
            <td class="right">${openOne ? html`<a class="btn btn-sm" href="#/app/assessments/${openOne.id}">Open current</a>` : html`<button class="btn btn-sm btn-primary" data-action="start-assessment" data-framework="${f.id}" data-name="${f.name}" data-carry="${hasCompleted ? '1' : ''}">${hasCompleted ? 'Start new cycle' : 'Start'}</button>`}</td></tr>`;
        })}</tbody></table></div>` : html`<div class="card-body muted">No templates are enabled for this organisation. ${App.isStaff() ? 'Enable templates in the organisation settings.' : 'Contact your HiQurate Ops assessor.'}</div>`}
      </div>` : ''}

      <div class="card mt-16">
        <div class="card-head"><h3>Completed</h3><span class="muted">${done.length}</span></div>
        ${done.length ? html`<div class="table-wrap"><table class="table"><tbody>${done.map(a => html`<tr class="clickable" data-action="open-assessment" data-id="${a.id}" tabindex="0">
          <td><div class="strong">${a.title}</div><div class="small muted">${a.frameworkName} · completed ${fmtDate(a.completedAt)}</div></td>
          <td class="num">${a.lastReport ? html`<span class="strong">${a.lastReport.healthScore}</span><div class="small muted">Health</div>` : ''}</td>
          <td class="right">${a.lastReport ? html`<a class="btn btn-sm" href="#/app/reports/${a.lastReport.id}">Report v${a.lastReport.version}</a>` : ''}</td></tr>`)}</tbody></table></div>`
          : html`<div class="card-body muted">No completed assessments yet.</div>`}
      </div>
    </div>`);
  });

  on('action', 'start-assessment', async el => {
    const carry = el.dataset.carry === '1';
    const result = await UI.modal({
      title: `Start ${el.dataset.name}`,
      body: html`
        <div class="stack">
          <div class="field"><label for="na-title">Title</label><input class="input" id="na-title" name="title" placeholder="${el.dataset.name} — ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}"></div>
          <div class="field"><label for="na-due">Target completion date</label><input class="input" id="na-due" name="dueDate" type="date"></div>
          ${carry ? html`<label class="row small"><input type="checkbox" name="carryForward" checked> Start from the answers of the last completed cycle. Carried answers are marked for review and reset to self-attested.</label>` : ''}
        </div>`,
      submitLabel: 'Start assessment',
      onSubmit: async (form, data) => {
        try {
          const r = await API.post('/api/assessments', { tenantId: App.tenantId, frameworkId: el.dataset.framework, title: data.title, dueDate: data.dueDate, carryForward: !!data.carryForward });
          return r.assessment.id;
        } catch (e) {
          if (e.details && e.details.code === 'PROFILE_REQUIRED') {
            UI.closeModal();
            UI.toast('Complete the organisation profile before starting an assessment.');
            App.navigate('/app/organisation');
            return false;
          }
          throw e;
        }
      }
    });
    if (result) App.navigate(`/app/assessments/${result}`);
  });

  on('action', 'open-assessment', el => App.navigate(`/app/assessments/${el.dataset.id}`));

  // ── Workspace ──
  let ws = null;

  App.route('/app/assessments/:id', async ({ id }) => {
    App.renderApp(UI.skeleton());
    const detail = await API.get(`/api/assessments/${encodeURIComponent(id)}`);
    if (App.isStaff() && detail.assessment.tenantId !== App.tenantId) await App.ensureTenant(detail.assessment.tenantId);
    const [users, template] = await Promise.all([
      App.can('assessment:assign') ? API.get(`/api/users${API.qs({ tenantId: detail.assessment.tenantId })}`).then(r => r.users).catch(() => []) : Promise.resolve([]),
      Content.template(detail.assessment.frameworkId)
    ]);
    ws = { detail, users, template };
    renderWorkspace();
  });

  function renderWorkspace() {
    const { detail, users, template } = ws;
    const a = detail.assessment;
    const p = detail.permissions;
    const r = detail.result;
    const o = r.overall;
    const staff = App.isStaff();
    const sections = detail.sections.reduce((acc, s) => { acc[s.module_id] = s; return acc; }, {});
    const firstOpen = r.modules.find(m => m.answered < m.applicable) || r.modules[0];
    const canIssue = p.canIssue && ((staff && ['submitted', 'in_review'].includes(a.status)) || (!staff && detail.tenant.package === 'snapshot' && a.status === 'submitted'));
    const customers = users.filter(u => ['customer_admin', 'contributor'].includes(u.role) && u.status === 'active');

    App.renderApp(html`<div class="page">
      <div class="breadcrumb"><a href="#/app/assessments">Assessments</a>${icon('chevronRight')}<span>${a.frameworkShortName}</span></div>
      <div class="page-head">
        <div><h1>${a.title}</h1>
          <div class="sub row row-wrap" style="gap:8px">${statusBadge(a)}<span>${template.framework.name} · template v${template.framework.templateVersion}</span>${a.scope === 'core' ? html`<span class="badge badge-outline">Snapshot: each control covered once</span>` : ''}</div></div>
        <div class="btn-group">
          ${p.editable && p.canAnswer ? html`<a class="btn btn-primary" href="#/app/assessments/${a.id}/section/${firstOpen.id}">${o.completion.answered ? 'Continue answering' : 'Start answering'}</a>` : html`<a class="btn" href="#/app/assessments/${a.id}/section/${r.modules[0].id}">View answers</a>`}
          ${p.canSubmit ? html`<button class="btn" data-action="submit-assessment">${icon('check')} Submit</button>` : ''}
          ${staff && p.canReview && a.status === 'submitted' ? html`<button class="btn" data-action="review" data-op="start">Start review</button>` : ''}
          ${staff && p.canReview && ['submitted', 'in_review'].includes(a.status) ? html`<button class="btn" data-action="review" data-op="request_evidence">Request evidence</button><button class="btn" data-action="review" data-op="return">Return to customer</button>` : ''}
          ${canIssue ? html`<button class="btn btn-primary" data-action="issue-report">${icon('file')} Issue report</button>` : ''}
          ${a.lastReport ? html`<a class="btn" href="#/app/reports/${a.lastReport.id}">Report v${a.lastReport.version}</a>` : ''}
        </div>
      </div>

      ${a.status === 'evidence_requested' ? html`<div class="callout callout-warn mb-16">${icon('alert')}<div><strong>Your assessor has requested more evidence.</strong>${detail.reviewNotes ? html`<div class="mt-8">${detail.reviewNotes}</div>` : ''}<div class="mt-8">Add the evidence, then submit again.</div></div></div>` : ''}
      ${a.status === 'submitted' && !staff ? html`<div class="callout callout-info mb-16">${icon('info')}<div>${detail.tenant.package === 'snapshot' ? 'Submitted. Answers are locked. Issue the report when you are ready.' : 'Submitted for assessor review. Answers are locked while the review takes place.'}</div></div>` : ''}
      ${detail.reviewNotes && a.status !== 'evidence_requested' && staff ? html`<div class="callout mb-16">${icon('message')}<div><strong>Review notes.</strong> ${detail.reviewNotes}</div></div>` : ''}

      ${UI.deadlineStrip(a)}
      <div class="grid grid-4">
        <div class="card metric"><div class="metric-label">Completion</div><div class="metric-value">${o.completion.percentage}<small>%</small></div><div class="progress mt-8"><span style="width:${o.completion.percentage}%"></span></div><div class="metric-sub">${o.completion.answered} of ${o.completion.applicable} applicable questions</div></div>
        <div class="card metric"><div class="metric-label">Provisional Cyber Health</div><div class="metric-value">${o.completion.answered ? o.healthScore : '—'}</div><div class="metric-sub">${o.completion.answered ? `${o.maturity.name} · not a report` : 'Answer questions to see a score'}</div></div>
        <div class="card metric"><div class="metric-label">Answer quality</div><div class="metric-value" style="font-size:20px">${o.confidence.label}</div><div class="metric-sub">${o.completion.unknown} unknown · ${o.completion.planned} planned · ${o.completion.notApplicable} not applicable</div></div>
        <div class="card metric"><div class="metric-label">Evidence required</div><div class="metric-value">${r.missingEvidence.length}</div><div class="metric-sub">${r.missingEvidence.length ? 'Controls need evidence before submission' : 'No evidence gaps'}</div></div>
      </div>

      <div class="card mt-16">
        <div class="card-head"><h3>Sections</h3><div class="row">${App.can('users:manage') ? html`<button class="btn btn-sm" data-action="invite-collaborator">${icon('plus')} Invite a collaborator</button>` : ''}</div></div>
        <div class="table-wrap"><table class="table">
          <thead><tr><th>Section</th><th>Owner</th><th>Status</th><th style="width:200px">Progress</th><th class="num">Provisional score</th><th></th></tr></thead>
          <tbody>${r.modules.map(m => {
            const s = sections[m.id] || {};
            const pctDone = m.applicable ? Math.round((m.answered / m.applicable) * 100) : 0;
            return html`<tr>
              <td><a class="strong" href="#/app/assessments/${a.id}/section/${m.id}">${m.name}</a><div class="small muted">${m.total} questions</div></td>
              <td>${p.canAssign && p.editable ? html`<select class="select" style="min-width:180px" data-change="assign-section" data-module="${m.id}" aria-label="Owner for ${m.name}">
                  <option value="">Unassigned</option>${customers.map(u => html`<option value="${u.id}" ${s.owner_user_id === u.id ? raw('selected') : ''}>${u.name || u.email}</option>`)}</select>`
                : html`<span class="small">${s.owner_name || s.owner_email || 'Unassigned'}</span>`}</td>
              <td><span class="badge ${s.status === 'complete' ? 'badge-success' : s.status === 'in_progress' ? 'badge-brand' : ''}">${SECTION_STATUS[s.status] || 'Not started'}</span></td>
              <td><div class="progress"><span style="width:${pctDone}%"></span></div><div class="small muted mt-8">${m.answered} of ${m.applicable}</div></td>
              <td class="num">${m.percentage === null ? '—' : m.percentage}</td>
              <td class="right"><a class="btn btn-sm" href="#/app/assessments/${a.id}/section/${m.id}">Open</a></td></tr>`;
          })}</tbody></table></div>
      </div>

      ${r.missingEvidence.length ? html`<div class="card mt-16"><div class="card-head"><h3>Evidence required before submission</h3><span class="muted">Critical and high controls claimed as implemented</span></div>
        <div class="table-wrap"><table class="table table-compact"><tbody>${r.missingEvidence.map(m => {
          const item = r.controls.find(c => c.id === m.id);
          return html`<tr><td class="mono faint" style="width:80px">${m.id}</td><td>${m.text}<div class="small muted">${m.moduleName}</div></td><td class="right"><a class="btn btn-sm" href="#/app/assessments/${a.id}/section/${item ? item.moduleId : r.modules[0].id}">Add evidence</a></td></tr>`;
        })}</tbody></table></div></div>` : ''}

      ${p.canIssue ? aiSummaryCard(detail) : ''}

      <div class="card mt-16"><div class="card-head"><h3>Risk context used for this assessment</h3>${App.can('profile:edit') ? html`<a class="small" href="#/app/organisation">Edit organisation profile</a>` : ''}</div>
        <div class="card-body small">${profileSummary(detail.profile, o.riskContext)}</div></div>

      ${staff || App.role() === 'customer_admin' ? html`<div class="row mt-24"><button class="btn btn-ghost btn-sm btn-danger" data-action="archive-assessment">${icon('trash')} Archive assessment</button></div>` : ''}
    </div>`);
  }

  function profileSummary(p, ctx) {
    const opts = root.OrgOptions || {};
    const label = (key, v) => {
      const found = (opts[key] || []).find(o => o[0] === String(v));
      return found ? found[1] : v;
    };
    const list = (title, v, key) => v !== undefined && v !== null && (Array.isArray(v) ? v.length : String(v).trim()) ? html`<div><span class="muted">${title}:</span> ${Array.isArray(v) ? v.map(x => label(key, x)).join(', ') : label(key, v)}</div>` : '';
    return html`<div class="grid grid-2" style="gap:6px 24px">
      ${list('Organisation', p.organizationName)}${list('Industry', p.industry, 'industry')}${list('Employees', p.employeeCount, 'employeeCount')}${list('Locations', p.officeLocations)}
      ${list('IT environment', p.itEnvironment)}${list('Regulations', p.regulations, 'regulations')}${list('Data types', p.dataTypes, 'dataTypes')}${list('Technology', p.technology, 'technology')}
      ${list('Critical services', p.criticalServices)}${list('Recent incidents', p.recentIncidents)}
    </div>
    <div class="mt-16"><strong>Risk context multiplier ×${ctx.multiplier}</strong>${ctx.factors.length ? html`<ul class="mt-8" style="padding-left:18px">${ctx.factors.map(f => html`<li>${f.factor} (+${f.adjustment})</li>`)}</ul>` : html`<div class="muted">No additional context factors.</div>`}</div>`;
  }

  function aiSummaryCard(detail) {
    const s = detail.aiSummary;
    return html`<div class="card mt-16" id="ai-summary-card">
      <div class="card-head"><div><h3>Executive narrative</h3><div class="muted">Optional. Drafted from verified results; included in the report only after approval.</div></div>
        ${s ? html`<span class="badge ${s.status === 'approved' ? 'badge-success' : 'badge-medium'}">${s.status === 'approved' ? 'Approved' : 'Draft'}</span>` : ''}</div>
      <div class="card-body">
        ${s ? html`<textarea class="textarea" id="ai-summary-text" rows="10" aria-label="Executive narrative">${s.text}</textarea>
          <div class="row mt-8"><button class="btn btn-primary btn-sm" data-action="ai-summary-save" data-status="approved">Approve for report</button><button class="btn btn-sm" data-action="ai-summary-save" data-status="draft">Save draft</button><button class="btn btn-sm btn-ghost" data-action="ai-summary-save" data-status="discarded">Discard</button>
          ${App.aiAvailable ? html`<button class="btn btn-sm btn-ghost" data-action="ai-summary-generate">${icon('refresh')} Regenerate</button>` : ''}</div>`
        : App.aiAvailable ? html`<p class="muted small">Generates a four-paragraph narrative from the calculated scores and findings. Only aggregated results are sent to the AI provider; no evidence, names or free-text answers.</p><button class="btn btn-sm" data-action="ai-summary-generate">${icon('message')} Draft narrative</button>`
          : html`<p class="muted small">AI assistance is not enabled on this server. The report always includes a calculated executive summary.</p>`}
      </div></div>`;
  }

  on('change', 'assign-section', async el => {
    const a = ws.detail.assessment;
    await API.put(`/api/assessments/${a.id}/sections/${encodeURIComponent(el.dataset.module)}`, { ownerUserId: el.value ? Number(el.value) : null });
    UI.toast('Section owner updated', 'success');
  });

  on('action', 'submit-assessment', async () => {
    const a = ws.detail.assessment;
    const ok = await UI.confirm({ title: 'Submit assessment', message: 'Answers will be locked while the assessment is reviewed or the report is issued. Make sure every applicable question is answered and evidence is attached for critical controls.', confirmLabel: 'Submit' });
    if (!ok) return;
    try {
      await API.post(`/api/assessments/${a.id}/submit`);
      UI.toast('Assessment submitted', 'success');
      App.handleRoute();
    } catch (e) {
      if (e.details && e.details.code === 'EVIDENCE_REQUIRED') {
        UI.modal({ title: 'Evidence required', body: html`<p>${e.message}</p><ul>${e.details.items.map(i => html`<li><span class="mono">${i.id}</span> ${i.text}</li>`)}</ul><p class="small muted">Attach a document, link or policy reference to each control, or ask your assessor to validate it.</p>`, cancelLabel: 'Close' });
      } else {
        UI.error(e);
      }
    }
  });

  on('action', 'review', async el => {
    const a = ws.detail.assessment;
    const op = el.dataset.op;
    const labels = { start: 'Start review', request_evidence: 'Request evidence', return: 'Return to customer' };
    const done = await UI.modal({
      title: labels[op],
      body: html`<div class="field"><label for="rv-notes">${op === 'start' ? 'Review notes (optional)' : 'Message to the customer'}</label><textarea class="textarea" id="rv-notes" name="notes" rows="5">${ws.detail.reviewNotes || ''}</textarea></div>`,
      submitLabel: labels[op],
      onSubmit: (f, data) => API.post(`/api/assessments/${a.id}/review`, { action: op, notes: data.notes })
    });
    if (done) { UI.toast('Assessment updated', 'success'); App.handleRoute(); }
  });

  on('action', 'issue-report', async () => {
    const a = ws.detail.assessment;
    const staff = App.isStaff();
    const ai = ws.detail.aiSummary;
    const done = await UI.modal({
      title: 'Issue report',
      body: html`<p>The report is calculated on the server from the submitted answers and frozen as the next report version for this template. It cannot be edited after issue.</p>
        <ul><li>Review type: <strong>${staff ? 'Assessor reviewed' : 'Self-assessed'}</strong></li>
        <li>Executive narrative: <strong>${ai && ai.status === 'approved' ? 'included (approved)' : 'not included'}</strong></li></ul>`,
      submitLabel: 'Issue report',
      onSubmit: () => API.post(`/api/assessments/${a.id}/reports`)
    });
    if (done) { UI.toast('Report issued', 'success'); App.navigate(`/app/reports/${done.reportId}`); }
  });

  on('action', 'archive-assessment', async () => {
    const a = ws.detail.assessment;
    const ok = await UI.confirm({ title: 'Archive assessment', message: 'The assessment will be removed from active lists. Issued reports are kept.', confirmLabel: 'Archive', danger: true });
    if (!ok) return;
    await API.del(`/api/assessments/${a.id}`);
    UI.toast('Assessment archived');
    App.navigate('/app/assessments');
  });

  on('action', 'ai-summary-generate', async el => {
    const a = ws.detail.assessment;
    el.disabled = true;
    el.innerHTML = html`<span class="spinner"></span> Drafting…`.value;
    try {
      const r = await API.post(`/api/assessments/${a.id}/ai-summary`);
      ws.detail.aiSummary = { text: r.text, status: 'draft' };
      const card = $('#ai-summary-card');
      if (card) card.outerHTML = aiSummaryCard(ws.detail).value;
    } catch (e) {
      UI.error(e);
      el.disabled = false;
      el.textContent = 'Draft narrative';
    }
  });

  on('action', 'ai-summary-save', async el => {
    const a = ws.detail.assessment;
    const text = $('#ai-summary-text') ? $('#ai-summary-text').value : '';
    const r = await API.put(`/api/assessments/${a.id}/ai-summary`, { text, status: el.dataset.status });
    ws.detail.aiSummary = r.status ? { text: r.text, status: r.status } : null;
    const card = $('#ai-summary-card');
    if (card) card.outerHTML = aiSummaryCard(ws.detail).value;
    UI.toast(r.status === 'approved' ? 'Narrative approved for the report' : r.status ? 'Draft saved' : 'Narrative discarded', 'success');
  });

  on('action', 'invite-collaborator', async () => {
    const a = ws.detail.assessment;
    const mods = ws.detail.result.modules;
    const done = await UI.modal({
      title: 'Invite a collaborator',
      body: html`<div class="stack">
        <p class="muted small">The invitee receives a one-time link to create their account. Contributors can only answer the sections you select.</p>
        <div class="field"><label for="inv-email">Work email</label><input class="input" id="inv-email" name="email" type="email" required></div>
        <div class="field"><label for="inv-role">Role</label><select class="select" id="inv-role" name="role"><option value="contributor">Contributor (answers assigned sections)</option><option value="read_only">Read only (views results)</option><option value="customer_admin">Customer administrator</option></select></div>
        <div class="field"><span class="label">Sections to assign</span><div class="checks">${mods.map(m => html`<label class="check-chip"><input type="checkbox" name="sections" data-group="1" value="${m.id}"><span>${m.name}</span></label>`)}</div></div>
      </div>`,
      submitLabel: 'Create invitation',
      onSubmit: (f, data) => API.post('/api/invitations', { tenantId: a.tenantId, email: data.email, role: data.role, assessmentId: a.id, sections: data.sections || [] })
    });
    if (done) {
      await UI.reveal({ title: 'Invitation created', intro: 'Share this link with the invitee through a trusted channel. It works once and expires in 7 days.', value: `${location.origin}${done.invitePath}`, note: 'For security, the link is shown only once.' });
    }
  });

  root.Assessments = { statusBadge };
})(window);
