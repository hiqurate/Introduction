// ============================================
// HawkSight — Questionnaire
// Section-based answering with autosave, guidance, evidence and
// confidence. Scores are recalculated locally with the shared engine.
// ============================================

(function (root) {
  // Upload limit set by the server (lower on serverless hosts).
  const evidenceLimitMb = () => (root.App && root.App.session && root.App.session.limits && root.App.session.limits.evidenceMb) || 10;
  const { html, raw, icon, esc, $, $all, setHtml, on, fmtTime, fmtDateTime, fileSize, plural } = root.U;
  const { App, API, UI, Content } = root;
  const Scoring = root.HawkScoring;
  const Controls = root.HawkControls;
  const Threats = root.HawkThreats;

  const TIER_LABEL = { critical: 'Critical control', high: 'High', medium: 'Medium', foundational: 'Foundational' };
  const TIER_BADGE = { critical: 'badge-critical', high: 'badge-high', medium: 'badge-outline', foundational: 'badge-outline' };
  const SECONDARY = [
    { v: 'NA', label: 'Not applicable', help: 'Outside the scope of this organisation; excluded from scoring.' },
    { v: 'UNK', label: 'Unknown', help: 'Not known; scored as not implemented and lowers confidence.' },
    { v: 'PLANNED', label: 'Planned', help: 'Not yet implemented but scheduled; scored as not implemented.' }
  ];
  const CONFIDENCE = [
    ['self-attested', 'Self-attested'],
    ['evidence-supported', 'Evidence-supported'],
    ['assessor-validated', 'Assessor-validated'],
    ['externally-verified', 'Externally verified']
  ];

  let qs = null;

  // ── Autosave ──
  const saver = {
    pending: {},
    inflight: null,
    lastSaved: null,
    error: null,
    timer: null,
    assessmentId: null,
    queue(qid, record) {
      this.pending[qid] = record;
      this.error = null;
      this.render();
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.flush(), 450);
    },
    async flush() {
      clearTimeout(this.timer);
      if (this.inflight || !Object.keys(this.pending).length) return;
      const batch = this.pending;
      this.pending = {};
      this.inflight = batch;
      this.render();
      try {
        const res = await API.patch(`/api/assessments/${this.assessmentId}/answers`, { answers: batch });
        this.lastSaved = res.savedAt;
        this.inflight = null;
        this.render();
        if (Object.keys(this.pending).length) this.flush();
      } catch (e) {
        // Put the batch back unless newer edits replaced it.
        Object.keys(batch).forEach(k => { if (!(k in this.pending)) this.pending[k] = batch[k]; });
        this.inflight = null;
        this.error = e;
        this.render();
        if (e.status === 0) setTimeout(() => this.flush(), 5000);
        else UI.error(e);
      }
    },
    busy() { return !!this.inflight || Object.keys(this.pending).length > 0; },
    render() {
      const el = $('#save-state');
      if (!el) return;
      if (this.error) {
        el.className = 'save-state error';
        el.innerHTML = html`${icon('alert')} ${this.error.status === 0 ? 'Offline. Changes will be saved when the connection returns.' : 'Not saved.'} <button class="btn btn-sm" data-action="retry-save">Retry</button>`.value;
      } else if (this.busy()) {
        el.className = 'save-state';
        el.innerHTML = html`<span class="spinner"></span> Saving…`.value;
      } else if (this.lastSaved) {
        el.className = 'save-state';
        el.innerHTML = html`${icon('check')} All changes saved at ${fmtTime(this.lastSaved)}`.value;
      } else {
        el.className = 'save-state';
        el.innerHTML = html`${icon('check')} Answers save automatically`.value;
      }
    }
  };
  window.addEventListener('beforeunload', e => {
    if (saver.busy()) { saver.flush(); e.preventDefault(); e.returnValue = ''; }
  });
  window.addEventListener('hashchange', () => { if (saver.busy()) saver.flush(); });
  window.addEventListener('online', () => { if (saver.busy()) saver.flush(); });
  on('action', 'retry-save', () => { saver.error = null; saver.flush(); });

  function recompute() {
    qs.result = Scoring.scoreAssessment({
      frameworkId: qs.detail.assessment.frameworkId,
      data: qs.template.data,
      answers: qs.answers,
      evidence: qs.evidence,
      profile: qs.detail.profile,
      scope: qs.detail.assessment.scope,
      config: {
        tierWeights: qs.detail.config.tierWeights,
        domainWeights: qs.detail.config.domainWeights,
        gating: qs.detail.config.gating,
        questionOverrides: qs.detail.config.questionOverrides,
        applicabilityRules: qs.detail.config.rules
      }
    });
    qs.items = qs.result.controls.reduce((acc, c) => { acc[c.id] = c; return acc; }, {});
  }

  function canEditModule(moduleId) {
    const p = qs.detail.permissions;
    if (!p.canAnswer || !p.editable) return false;
    return !p.answerableModules || p.answerableModules.includes(moduleId);
  }

  App.route('/app/assessments/:id/section/:moduleId', async ({ id, moduleId }) => {
    const sameAssessment = qs && String(qs.detail.assessment.id) === String(id);
    if (!sameAssessment) {
      App.renderApp(UI.skeleton());
      if (saver.busy()) await saver.flush();
      const detail = await API.get(`/api/assessments/${encodeURIComponent(id)}`);
      if (App.isStaff() && detail.assessment.tenantId !== App.tenantId) await App.ensureTenant(detail.assessment.tenantId);
      const template = await Content.template(detail.assessment.frameworkId);
      const evidence = {};
      detail.result.controls.forEach(c => { if (c.evidenceCount) evidence[c.id] = c.evidenceCount; });
      qs = { detail, template, answers: { ...detail.answers }, evidence, filter: 'all', open: {}, cur: {}, dir: 1 };
      saver.assessmentId = detail.assessment.id;
      saver.lastSaved = null;
      saver.error = null;
    }
    qs.moduleId = moduleId;
    recompute();
    render();
  }, { keepScroll: false });

  function moduleData(moduleId) {
    return qs.template.data.modules.find(m => m.id === moduleId);
  }

  function render() {
    const a = qs.detail.assessment;
    const mod = moduleData(qs.moduleId) || qs.template.data.modules[0];
    const modules = qs.result.modules;
    const idx = qs.template.data.modules.findIndex(m => m.id === mod.id);
    const prev = qs.template.data.modules[idx - 1];
    const next = qs.template.data.modules[idx + 1];
    const editable = canEditModule(mod.id);
    const section = qs.detail.sections.find(s => s.module_id === mod.id) || {};
    const isOwner = section.owner_user_id === App.session.user.id;
    const canMark = editable && (isOwner || App.can('assessment:assign'));
    const modResult = modules.find(m => m.id === mod.id);
    const hiddenCount = qs.result.controls.filter(c => c.moduleId === mod.id && c.state === 'hidden' && c.applicability.ruleId !== 'scope').length;
    const pct = modResult && modResult.applicable ? Math.round((modResult.answered / modResult.applicable) * 100) : 0;

    App.renderApp(html`<div class="page">
      <div class="breadcrumb"><a href="#/app/assessments">Assessments</a>${icon('chevronRight')}<a href="#/app/assessments/${a.id}">${a.title}</a>${icon('chevronRight')}<span>${mod.name}</span></div>
      <div class="workspace">
        <nav class="section-nav" aria-label="Assessment sections">
          <div class="card card-body" style="padding:14px">
            <div class="small muted">Overall progress</div>
            <div class="row row-between mt-8"><strong id="overall-progress">${qs.result.overall.completion.percentage}%</strong><span class="small muted" id="overall-count">${qs.result.overall.completion.answered} of ${qs.result.overall.completion.applicable}</span></div>
            <div class="progress mt-8"><span id="overall-bar" style="width:${qs.result.overall.completion.percentage}%"></span></div>
          </div>
          <div class="mt-16" id="section-links">${sectionLinks()}</div>
        </nav>
        <div>
          <div class="card q-card">
            <div class="q-section-head">
              <span id="section-ring">${UI.miniRing(pct, { size: 52, label: `${pct}% of this section answered` })}</span>
              <div class="grow" style="min-width:220px">
                <div class="eyebrow">Section ${idx + 1} of ${qs.template.data.modules.length}</div>
                <h2 style="margin-top:3px">${mod.name}</h2>
                <div class="small muted mt-8">Owner: ${section.owner_name || section.owner_email || 'Unassigned'}<span id="section-count">${modResult ? ` · ${modResult.answered} of ${modResult.applicable} answered` : ''}</span>${hiddenCount ? ` · ${plural(hiddenCount, 'question')} hidden by applicability rules` : ''}</div>
              </div>
              <div class="stack-sm right">
                <span id="section-deadline">${deadlineNow()}</span>
                <span id="save-state" class="save-state"></span>
                ${canMark ? html`<div><button class="btn btn-sm" data-action="mark-section" data-status="${section.status === 'complete' ? 'in_progress' : 'complete'}">${section.status === 'complete' ? 'Reopen section' : html`${icon('check')} Mark section complete`}</button></div>` : ''}
              </div>
            </div>
            ${!editable ? html`<div class="callout callout-info" style="margin:16px 22px 0">${icon('lock')}<div>${!qs.detail.permissions.editable ? 'This assessment is locked for review. Answers are read-only.' : !qs.detail.permissions.canAnswer ? 'Your role can view answers but not change them.' : 'This section is assigned to someone else. You can view it but not change it.'}</div></div>` : ''}
            <div class="q-filters">
              <span class="small muted">Show</span>
              ${[['all', 'All questions'], ['unanswered', 'Unanswered'], ['gaps', 'Gaps'], ['evidence', 'Evidence required'], ['carried', 'Carried forward']].map(([k, l]) => html`<button class="btn btn-sm ${qs.filter === k ? 'btn-dark' : ''}" data-action="q-filter" data-filter="${k}">${l}</button>`)}
            </div>
            <div class="q-nav" id="q-nav">${navDots()}</div>
            <div id="q-stage">${stage(editable)}</div>
            <div class="q-footer" id="q-footer">${footer(prev, next)}</div>
          </div>
          <div class="row row-between mt-16">
            ${prev ? html`<a class="btn btn-ghost" href="#/app/assessments/${a.id}/section/${prev.id}">${icon('chevronLeft')} ${prev.name}</a>` : html`<span></span>`}
            ${next ? html`<a class="btn btn-ghost" href="#/app/assessments/${a.id}/section/${next.id}">${next.name} ${icon('chevronRight')}</a>` : html`<a class="btn btn-ghost" href="#/app/assessments/${a.id}">Review and submit ${icon('chevronRight')}</a>`}
          </div>
        </div>
      </div>
    </div>`);
    saver.render();
  }

  // ── One question at a time ──
  function matchesFilter(item, q) {
    const f = qs.filter;
    if (f === 'unanswered') return item.state === 'unanswered';
    if (f === 'gaps') return item.state === 'unknown' || item.state === 'planned' || (item.state === 'scored' && item.fraction < 1);
    if (f === 'evidence') return item.evidenceRequired;
    if (f === 'carried') return !!(qs.answers[q.id] && qs.answers[q.id].carried);
    return true;
  }

  // Questions in this section that are in scope and match the filter.
  function visibleList() {
    const mod = moduleData(qs.moduleId) || qs.template.data.modules[0];
    const out = [];
    mod.categories.forEach(cat => cat.questions.forEach(q => {
      const item = qs.items[q.id];
      if (item && item.state !== 'hidden' && matchesFilter(item, q)) out.push({ q, cat });
    }));
    return out;
  }

  function currentIndex(list) {
    const id = qs.cur[qs.moduleId];
    const i = list.findIndex(x => x.q.id === id);
    if (i >= 0) return i;
    // Start at the first unanswered question when entering a section.
    const firstOpen = list.findIndex(x => qs.items[x.q.id].state === 'unanswered');
    return list.length ? Math.max(0, firstOpen) : -1;
  }

  function navDots() {
    const list = visibleList();
    const at = currentIndex(list);
    if (!list.length) return html`<span class="small muted">No questions match this filter in this section.</span>`;
    return html`${list.map((x, i) => {
      const it = qs.items[x.q.id];
      const cls = it.state === 'unanswered' ? '' : it.state === 'na' ? 'is-other' : it.state === 'unknown' || it.state === 'planned' ? 'is-gap' : 'is-answered';
      return html`<button type="button" class="q-dot ${cls}" data-action="q-go" data-qid="${x.q.id}" aria-current="${i === at ? 'true' : 'false'}" title="${x.q.text}" aria-label="Question ${i + 1}">${i + 1}</button>`;
    })}
    <span class="q-legend"><span><i style="background:var(--ink-900);border-color:var(--ink-900)"></i>Answered</span><span><i style="background:#fff3dc;border-color:#f2cf8a"></i>Unknown or planned</span><span><i></i>To answer</span></span>`;
  }

  function stage(editable) {
    const list = visibleList();
    const at = currentIndex(list);
    if (at < 0) return html`<div class="q-done"><div class="q-done-icon">${icon('check')}</div><h3>Nothing to show here</h3><p class="muted">No questions in this section match the current filter.</p><button class="btn" data-action="q-filter" data-filter="all">Show all questions</button></div>`;
    const { q, cat } = list[at];
    qs.cur[qs.moduleId] = q.id;
    return html`<div class="q-stage ${qs.dir < 0 ? 'q-back' : ''}">
      <div class="q-counter"><span class="eyebrow">Question <b>${at + 1}</b> of ${list.length} · ${cat.name}</span></div>
      ${questionCard(q, editable === undefined ? canEditModule(qs.moduleId) : editable)}
    </div>`;
  }

  function footer(prevMod, nextMod) {
    const a = qs.detail.assessment;
    const idx = qs.template.data.modules.findIndex(m => m.id === qs.moduleId);
    prevMod = prevMod || qs.template.data.modules[idx - 1];
    nextMod = nextMod || qs.template.data.modules[idx + 1];
    const list = visibleList();
    const at = currentIndex(list);
    const last = at >= list.length - 1;
    return html`
      <button class="btn" data-action="q-step" data-dir="-1" ${at <= 0 ? raw('disabled') : ''}>${icon('chevronLeft')} Previous</button>
      <span class="q-hint">${icon('keyboard')} <span class="kbd">1</span>–<span class="kbd">4</span> to answer · <span class="kbd">←</span> <span class="kbd">→</span> to move</span>
      ${!last ? html`<button class="btn btn-primary" data-action="q-step" data-dir="1">Next question ${icon('chevronRight')}</button>`
        : nextMod ? html`<a class="btn btn-primary" href="#/app/assessments/${a.id}/section/${nextMod.id}">Next section: ${nextMod.name} ${icon('chevronRight')}</a>`
        : html`<a class="btn btn-primary" href="#/app/assessments/${a.id}">Review and submit ${icon('chevronRight')}</a>`}`;
  }

  function showQuestion(qid, dir) {
    qs.dir = dir || 1;
    qs.cur[qs.moduleId] = qid;
    setHtml('#q-stage', stage());
    setHtml('#q-nav', navDots());
    setHtml('#q-footer', footer());
    const stageEl = $('#q-stage');
    if (stageEl && stageEl.getBoundingClientRect().top < 60) stageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Move relative to the current question's place in the section, so this
  // still works when the current question has just dropped out of a filter.
  function step(dir) {
    const list = visibleList();
    const mod = moduleData(qs.moduleId) || qs.template.data.modules[0];
    const order = mod.categories.flatMap(c => c.questions.map(q => q.id));
    const pos = order.indexOf(qs.cur[qs.moduleId]);
    const candidates = dir > 0 ? list.filter(x => order.indexOf(x.q.id) > pos) : list.filter(x => order.indexOf(x.q.id) < pos).reverse();
    const target = candidates[0];
    if (target) showQuestion(target.q.id, dir);
  }

  on('action', 'q-step', el => step(Number(el.dataset.dir)));
  on('action', 'q-go', el => {
    const list = visibleList();
    const from = currentIndex(list);
    const to = list.findIndex(x => x.q.id === el.dataset.qid);
    showQuestion(el.dataset.qid, to < from ? -1 : 1);
  });

  // Keyboard: number keys answer, arrow keys move between questions.
  document.addEventListener('keydown', e => {
    if (!qs || !App.current || !/\/section\//.test(App.current.path)) return;
    if (document.getElementById('modal-root') || document.getElementById('drawer-root')) return;
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest('input:not([type=radio]), textarea, select, [contenteditable]')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); return; }
    if (/^[1-9]$/.test(e.key)) {
      const radios = $all('#q-stage .opt input[type=radio]');
      const r = radios[Number(e.key) - 1];
      if (r && !r.disabled) { e.preventDefault(); r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
    }
  });

  function deadlineNow() {
    const a = qs.detail.assessment;
    return UI.deadlineBadge({ ...a, progress: qs.result.overall.completion });
  }

  function sectionLinks() {
    const a = qs.detail.assessment;
    return html`${qs.result.modules.map(m => {
      const done = m.applicable ? Math.round((m.answered / m.applicable) * 100) : 0;
      return html`<a class="section-link" href="#/app/assessments/${a.id}/section/${m.id}" aria-current="${m.id === qs.moduleId ? 'true' : 'false'}">
        <span class="name">${m.name}</span>
        <span class="meta"><span>${m.answered}/${m.applicable}</span><span>${canEditModule(m.id) ? '' : 'View only'}</span></span>
        <span class="progress ${done === 100 ? 'progress-success' : ''}"><span style="width:${done}%"></span></span></a>`;
    })}`;
  }

  function questionCard(q, editable) {
    const item = qs.items[q.id];
    if (!item || item.state === 'hidden') return html`<div class="question is-hidden" data-qid="${q.id}"></div>`;
    const rec = Scoring.normaliseAnswer(qs.answers[q.id]);
    const value = rec ? rec.v : null;
    const control = item.controlId ? Controls.CONTROL_INDEX[item.controlId] : null;
    const evidenceCount = qs.evidence[q.id] || 0;
    const needsEvidence = qs.result.missingEvidence.some(m => m.id === q.id);
    const carried = qs.answers[q.id] && qs.answers[q.id].carried;
    const name = `q-${q.id}`;
    const canValidate = qs.detail.permissions.canValidate;
    const open = qs.open[q.id] || {};
    const isIndustry = qs.template.framework.type === 'industry';
    const disabled = editable ? '' : raw('disabled');
    const secondary = html`${SECONDARY.map(s => html`<label class="option option-secondary ${value === s.v ? 'selected' : ''}" title="${s.help}">
          <input type="radio" name="${name}" value="${s.v}" aria-label="${s.label}" ${value === s.v ? raw('checked') : ''} ${disabled} data-change="answer-radio" data-qid="${q.id}"><span>${s.label}</span></label>`)}`;

    return html`<div class="question" data-qid="${q.id}" data-state="${item.state}" data-fraction="${item.fraction === null ? '' : item.fraction}" data-evidence-required="${item.evidenceRequired ? '1' : ''}" data-carried="${carried ? '1' : ''}">
      <div class="question-meta">
        <span class="mono">${q.id}</span>
        ${control ? html`<span>${control.name}</span>` : ''}
        <span class="badge ${TIER_BADGE[item.tier]}">${TIER_LABEL[item.tier]}</span>
        ${item.evidenceRequired ? html`<span class="badge ${needsEvidence ? 'badge-medium' : 'badge-outline'}">${needsEvidence ? 'Evidence needed' : 'Evidence required'}</span>` : ''}
        ${carried ? html`<span class="badge badge-low">Carried forward — confirm</span>` : ''}
      </div>
      <div class="question-text" id="qt-${q.id}">${q.text}</div>
      ${q.attack ? html`<div class="attacker-note">${icon('target')}<div><span class="attacker-label">Attacker's view</span>${q.attack}</div></div>` : ''}
      ${item.applicability && item.applicability.suggestNA && value !== 'NA' ? html`<div class="callout callout-info question-hint mb-8">${icon('info')}<div class="grow small">${item.applicability.reason}</div>${editable ? html`<button class="btn btn-sm" data-action="answer" data-qid="${q.id}" data-value="NA">Mark not applicable</button>` : ''}</div>` : ''}
      <div role="radiogroup" aria-labelledby="qt-${q.id}">
        <div class="option-list">
          ${q.options.map((o, k) => html`<label class="opt ${value === o.value ? 'selected' : ''} ${editable ? '' : 'is-disabled'}">
            <input type="radio" name="${name}" value="${o.value}" aria-label="${o.label}${o.detail ? `: ${o.detail}` : ''}" ${value === o.value ? raw('checked') : ''} ${disabled} data-change="answer-radio" data-qid="${q.id}">
            <span class="opt-key" aria-hidden="true">${k + 1}</span>
            <span><span class="opt-label">${o.label}</span>${o.detail ? html`<span class="opt-detail">${o.detail}</span>` : ''}</span>
            <span class="opt-check" aria-hidden="true">${icon('check')}</span></label>`)}
        </div>
        <div class="opt-alt"><span>None of these fit?</span>${secondary}</div>
      </div>
      <div class="question-tools">
        <button class="btn btn-sm btn-ghost" data-action="toggle-guidance" data-qid="${q.id}" aria-expanded="${open.guidance ? 'true' : 'false'}">${icon('info')} Guidance</button>
        <button class="btn btn-sm btn-ghost" data-action="open-evidence" data-qid="${q.id}">${icon('paperclip')} Evidence${evidenceCount ? ` (${evidenceCount})` : ''}</button>
        <button class="btn btn-sm btn-ghost" data-action="toggle-note" data-qid="${q.id}" aria-expanded="${open.note ? 'true' : 'false'}">${icon('message')} Note${rec && rec.n ? ' (1)' : ''}</button>
        ${App.aiAvailable ? html`<button class="btn btn-sm btn-ghost" data-action="ai-explain" data-qid="${q.id}">${icon('book')} Explain</button>` : ''}
        ${carried && editable ? html`<button class="btn btn-sm" data-action="confirm-carried" data-qid="${q.id}">${icon('check')} Confirm answer</button>` : ''}
        ${rec && typeof rec.v === 'number' || (rec && rec.v === 'PLANNED') ? html`<label class="row small" style="margin-left:auto;gap:6px"><span class="muted">Support</span>
          <select class="select" style="width:auto;min-height:28px;padding:3px 8px" data-change="answer-confidence" data-qid="${q.id}" ${disabled} aria-label="Answer support level">
            ${CONFIDENCE.map(([k, l]) => html`<option value="${k}" ${rec.c === k ? raw('selected') : ''} ${(k === 'assessor-validated' || k === 'externally-verified') && !canValidate && rec.c !== k ? raw('disabled') : ''}>${l}</option>`)}
          </select></label>` : ''}
      </div>
      ${open.guidance ? guidance(q, control, isIndustry) : ''}
      ${open.note ? html`<div class="field mt-8"><label for="note-${q.id}">Note for reviewers</label><textarea class="textarea" id="note-${q.id}" data-change="answer-note" data-qid="${q.id}" rows="2" ${disabled} placeholder="Context, scope limits or compensating controls">${rec && rec.n ? rec.n : ''}</textarea></div>` : ''}
    </div>`;
  }

  function guidance(q, control, isIndustry) {
    const paths = control && Threats ? Threats.scenariosForControl(control.id) : [];
    return html`<dl class="guidance">
      ${q.context ? html`<dt>${isIndustry ? 'What to consider' : 'In practice'}</dt><dd>${q.context}</dd>` : ''}
      ${q.verify ? html`<dt>How to verify</dt><dd>${q.verify}</dd>` : ''}
      ${paths.length ? html`<dt>Attack paths this helps stop</dt><dd>${paths.map(p => p.name).join(' · ')}</dd>` : ''}
      ${control ? html`<dt>Control objective</dt><dd>${control.objective}</dd>
        <dt>What good looks like</dt><dd>${control.expectedState}</dd>
        <dt>Typical evidence</dt><dd>${control.evidenceExamples.join('; ')}</dd>
        <dt>Framework references</dt><dd>${['nist_csf_2', 'iso27001', 'cis_v8'].map(r => `${Controls.FRAMEWORK_REFERENCES[r].name}: ${(control.mappings[r] || []).filter(x => x !== '—').join(', ') || '—'}`).join(' · ')}</dd>` : ''}
      <dt>Answering</dt><dd>Choose the option that describes the current state, not the intended state. Use Planned for work that is scheduled but not in place, and Unknown if you need to check with a colleague.</dd>
    </dl>`;
  }

  function refreshQuestion(qid) {
    const q = qs.template.data.modules.flatMap(m => m.categories.flatMap(c => c.questions)).find(x => x.id === qid);
    const el = $(`.question[data-qid="${CSS.escape(qid)}"]`);
    if (!q || !el) return;
    const mod = qs.result.controls.find(c => c.id === qid);
    el.outerHTML = questionCard(q, canEditModule(mod ? mod.moduleId : qs.moduleId)).value;
  }

  function refreshProgress(changedQid) {
    const before = new Set(qs.result.controls.filter(c => c.state === 'hidden').map(c => c.id));
    recompute();
    const after = new Set(qs.result.controls.filter(c => c.state === 'hidden').map(c => c.id));
    // Applicability can change when answers change (rules on previous answers).
    const changed = [...before].filter(x => !after.has(x)).concat([...after].filter(x => !before.has(x)));
    if (changedQid) refreshQuestion(changedQid);
    changed.forEach(refreshQuestion);
    const c = qs.result.overall.completion;
    const p = $('#overall-progress'); if (p) p.textContent = `${c.percentage}%`;
    const n = $('#overall-count'); if (n) n.textContent = `${c.answered} of ${c.applicable}`;
    const b = $('#overall-bar'); if (b) b.style.width = `${c.percentage}%`;
    setHtml('#section-links', sectionLinks());
    const m = qs.result.modules.find(x => x.id === qs.moduleId);
    const sc = $('#section-count'); if (sc && m) sc.textContent = ` · ${m.answered} of ${m.applicable} answered`;
    setHtml('#section-deadline', deadlineNow());
    if (m) setHtml('#section-ring', UI.miniRing(m.applicable ? Math.round((m.answered / m.applicable) * 100) : 0, { size: 52 }));
    // Applicability can add or remove questions; keep the current one if it is still in scope.
    if (changed.length && !visibleList().some(x => x.q.id === qs.cur[qs.moduleId])) setHtml('#q-stage', stage());
    setHtml('#q-nav', navDots());
    setHtml('#q-footer', footer());
  }

  function setAnswer(qid, patch) {
    const current = Scoring.normaliseAnswer(qs.answers[qid]) || {};
    const record = { v: current.v, c: current.c || 'self-attested', n: current.n || '', ...patch };
    if (record.v === undefined || record.v === null) return;
    qs.answers[qid] = { ...record, at: new Date().toISOString() };
    saver.queue(qid, { v: record.v, c: record.c, n: record.n });
    refreshProgress(qid);
  }

  on('change', 'answer-radio', el => {
    const raw = el.value;
    const v = ['NA', 'UNK', 'PLANNED'].includes(raw) ? raw : Number(raw);
    const qid = el.dataset.qid;
    const firstAnswer = !Scoring.normaliseAnswer(qs.answers[qid]);
    // Move on after a first answer; a changed answer stays put so notes and evidence can follow.
    if (firstAnswer) setTimeout(() => { if (qs.cur[qs.moduleId] === qid) step(1); }, 420);
    const patch = { v };
    if (qs.evidence[el.dataset.qid] && typeof v === 'number') {
      const cur = Scoring.normaliseAnswer(qs.answers[el.dataset.qid]);
      if (!cur || cur.c === 'self-attested') patch.c = 'evidence-supported';
    }
    setAnswer(el.dataset.qid, patch);
  });
  on('action', 'answer', el => {
    const v = ['NA', 'UNK', 'PLANNED'].includes(el.dataset.value) ? el.dataset.value : Number(el.dataset.value);
    setAnswer(el.dataset.qid, { v });
  });
  on('action', 'confirm-carried', el => setAnswer(el.dataset.qid, {}));
  on('change', 'answer-confidence', el => setAnswer(el.dataset.qid, { c: el.value }));
  on('change', 'answer-note', el => {
    const cur = Scoring.normaliseAnswer(qs.answers[el.dataset.qid]);
    if (!cur) { UI.toast('Choose an answer before adding a note.'); return; }
    setAnswer(el.dataset.qid, { n: el.value.slice(0, 2000) });
  });

  function toggleOpen(qid, key) {
    qs.open[qid] = qs.open[qid] || {};
    qs.open[qid][key] = !qs.open[qid][key];
    refreshQuestion(qid);
    if (key === 'note' && qs.open[qid][key]) { const t = $(`#note-${CSS.escape(qid)}`); if (t) t.focus(); }
  }
  on('action', 'toggle-guidance', el => toggleOpen(el.dataset.qid, 'guidance'));
  on('action', 'toggle-note', el => toggleOpen(el.dataset.qid, 'note'));

  on('action', 'q-filter', el => {
    qs.filter = el.dataset.filter;
    $all('[data-action="q-filter"]').forEach(b => b.classList.toggle('btn-dark', b.dataset.filter === qs.filter));
    const list = visibleList();
    if (!list.some(x => x.q.id === qs.cur[qs.moduleId])) qs.cur[qs.moduleId] = list.length ? list[0].q.id : null;
    setHtml('#q-stage', stage());
    setHtml('#q-nav', navDots());
    setHtml('#q-footer', footer());
  });

  on('action', 'mark-section', async el => {
    const a = qs.detail.assessment;
    if (saver.busy()) await saver.flush();
    const r = await API.put(`/api/assessments/${a.id}/sections/${encodeURIComponent(qs.moduleId)}`, { status: el.dataset.status });
    qs.detail.sections = r.sections;
    UI.toast(el.dataset.status === 'complete' ? 'Section marked complete' : 'Section reopened', 'success');
    render();
  });

  // ── Evidence drawer ──
  async function openEvidence(qid) {
    const a = qs.detail.assessment;
    const item = qs.items[qid];
    const control = item.controlId ? Controls.CONTROL_INDEX[item.controlId] : null;
    const editable = canEditModule(item.moduleId) || (qs.detail.permissions.canValidate && ['in_review', 'submitted', 'evidence_requested', 'in_progress'].includes(a.status));
    UI.drawer({ title: 'Evidence', subtitle: html`<span class="mono">${qid}</span> ${item.text}`, body: html`<div class="spinner"></div>` });
    const { evidence } = await API.get(`/api/assessments/${a.id}/evidence${API.qs({ questionId: qid })}`);
    qs.evidence[qid] = evidence.length;
    setHtml('#drawer-body', html`
      ${control ? html`<div class="panel small mb-16"><strong>Typical evidence:</strong> ${control.evidenceExamples.join('; ')}</div>` : ''}
      <h3 class="mb-8">Attached (${evidence.length})</h3>
      ${evidence.length ? html`<div class="stack-sm">${evidence.map(e => html`<div class="card card-body" style="padding:12px 14px">
        <div class="row row-between"><div class="row">${icon(e.kind === 'file' ? 'file' : e.kind === 'link' ? 'link' : e.kind === 'policy' ? 'book' : 'message')}
          <div>${e.kind === 'file' ? html`<a href="/api/evidence/${e.id}/download">${e.filename}</a> <span class="small muted">${fileSize(e.sizeBytes)}</span>`
            : e.kind === 'link' ? html`<a href="${e.urlReference}" target="_blank" rel="noopener noreferrer">${e.urlReference}</a>`
            : e.kind === 'policy' ? html`<strong>${e.policyReference}</strong>` : html`<span>Note</span>`}</div></div>
          ${editable ? html`<button class="btn btn-ghost btn-sm" data-action="evidence-delete" data-id="${e.id}" data-qid="${qid}" aria-label="Remove evidence">${icon('trash')}</button>` : ''}</div>
        ${e.notes ? html`<div class="small mt-8">${e.notes}</div>` : ''}
        <div class="small faint mt-8">Added by ${e.uploadedBy || 'unknown'} · ${fmtDateTime(e.createdAt)}${e.sha256 ? html` · SHA-256 <span class="mono">${e.sha256.slice(0, 12)}</span>` : ''}</div>
      </div>`)}</div>` : html`<p class="muted small">No evidence attached yet.</p>`}
      ${editable ? html`<hr><h3 class="mb-8">Add evidence</h3>
        <form class="stack" data-submit="evidence-add" data-qid="${qid}" novalidate>
          <div class="field"><label for="ev-kind">Type</label><select class="select" id="ev-kind" name="kind" data-change="evidence-kind">
            <option value="file">Document or screenshot</option><option value="link">Link to a system or repository</option><option value="policy">Policy or document reference</option><option value="note">Assessor or implementation note</option></select></div>
          <div class="field" data-ev="file"><label for="ev-file">File</label><input class="input" id="ev-file" name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.txt,.csv,.docx,.xlsx,.pptx"><span class="hint">PDF, image, text or Office document up to ${evidenceLimitMb()} MB. Files are encrypted at rest.</span></div>
          <div class="field hidden" data-ev="link"><label for="ev-url">Link</label><input class="input" id="ev-url" name="urlReference" type="url" placeholder="https://"></div>
          <div class="field hidden" data-ev="policy"><label for="ev-policy">Reference</label><input class="input" id="ev-policy" name="policyReference" placeholder="e.g. SEC-POL-04 Access Control Policy v3, section 5"></div>
          <div class="field"><label for="ev-notes">Notes</label><textarea class="textarea" id="ev-notes" name="notes" rows="3" placeholder="What this evidence shows and its scope"></textarea></div>
          <div class="form-error" id="ev-error" role="alert"></div>
          <div><button class="btn btn-primary" type="submit">Add evidence</button></div>
        </form>` : ''}`);
  }

  on('action', 'open-evidence', el => openEvidence(el.dataset.qid));
  on('change', 'evidence-kind', el => {
    $all('[data-ev]').forEach(f => f.classList.toggle('hidden', f.dataset.ev !== el.value));
  });
  on('submit', 'evidence-add', async form => {
    const qid = form.dataset.qid;
    const a = qs.detail.assessment;
    const kind = form.kind.value;
    const err = $('#ev-error');
    err.textContent = '';
    const body = { questionId: qid, kind, notes: form.notes.value };
    if (kind === 'file') {
      const file = form.file.files[0];
      if (!file) { err.textContent = 'Choose a file.'; return; }
      if (file.size > evidenceLimitMb() * 1024 * 1024) { err.textContent = `File exceeds the ${evidenceLimitMb()} MB limit.`; return; }
      body.filename = file.name;
      body.mimeType = file.type || (file.name.endsWith('.csv') ? 'text/csv' : 'application/octet-stream');
      body.dataBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
        reader.onerror = () => reject(new Error('Could not read the file'));
        reader.readAsDataURL(file);
      });
    } else if (kind === 'link') body.urlReference = form.urlReference.value;
    else if (kind === 'policy') body.policyReference = form.policyReference.value;
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    try {
      await API.post(`/api/assessments/${a.id}/evidence`, body);
      UI.toast('Evidence added', 'success');
      const cur = Scoring.normaliseAnswer(qs.answers[qid]);
      qs.evidence[qid] = (qs.evidence[qid] || 0) + 1;
      if (cur && typeof cur.v === 'number' && cur.c === 'self-attested' && canEditModule(qs.items[qid].moduleId)) setAnswer(qid, { c: 'evidence-supported' });
      else refreshProgress(qid);
      await openEvidence(qid);
    } catch (e) {
      err.textContent = e.message;
      btn.disabled = false;
    }
  });
  on('action', 'evidence-delete', async el => {
    const ok = await UI.confirm({ title: 'Remove evidence', message: 'The file will be deleted and the removal recorded in the audit log.', confirmLabel: 'Remove', danger: true });
    if (!ok) return;
    await API.del(`/api/evidence/${el.dataset.id}`);
    qs.evidence[el.dataset.qid] = Math.max(0, (qs.evidence[el.dataset.qid] || 1) - 1);
    refreshProgress(el.dataset.qid);
    UI.toast('Evidence removed');
    openEvidence(el.dataset.qid);
  });

  // ── AI explanation ──
  on('action', 'ai-explain', el => {
    const qid = el.dataset.qid;
    const item = qs.items[qid];
    UI.drawer({
      title: 'Explain this control',
      subtitle: html`<span class="mono">${qid}</span> ${item.text}`,
      body: html`<p class="small muted">Only the question and its template guidance are sent to the AI provider. The explanation does not suggest an answer and does not affect scoring.</p>
        <div class="btn-group mb-16">
          <button class="btn btn-sm" data-action="ai-explain-run" data-qid="${qid}" data-mode="explain">What it means</button>
          <button class="btn btn-sm" data-action="ai-explain-run" data-qid="${qid}" data-mode="evidence">Acceptable evidence</button>
          <button class="btn btn-sm" data-action="ai-explain-run" data-qid="${qid}" data-mode="implement">How to implement</button>
        </div>
        <div id="ai-explain-output" class="muted small">Choose a topic.</div>`
    });
  });
  on('action', 'ai-explain-run', async el => {
    const out = $('#ai-explain-output');
    out.className = '';
    setHtml(out, html`<span class="spinner"></span>`);
    try {
      const r = await API.post('/api/ai/explain', { assessmentId: qs.detail.assessment.id, questionId: el.dataset.qid, mode: el.dataset.mode });
      setHtml(out, html`<div class="ai-output">${r.text}</div><div class="ai-label">AI-generated guidance (${r.model}). Verify against your own policies before relying on it.</div>`);
    } catch (e) {
      setHtml(out, html`<div class="callout callout-danger">${icon('alert')}<div>${e.message}</div></div>`);
    }
  });
})(window);
