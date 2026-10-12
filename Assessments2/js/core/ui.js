// ============================================
// HawkSight — UI components
// Toasts, modals, drawers and data visualisations.
// ============================================

(function (root) {
  const { html, raw, esc, icon, $, setHtml, SEVERITY_ORDER, SEVERITY_LABEL, scaleColor } = root.U;

  // ── Toasts ──
  function toast(message, type = 'info', timeout = 4000) {
    const host = $('#toasts');
    const el = document.createElement('div');
    el.className = `toast ${type === 'error' ? 'toast-error' : type === 'success' ? 'toast-success' : ''}`;
    el.innerHTML = html`${icon(type === 'error' ? 'alert' : type === 'success' ? 'check' : 'info')}<div>${message}</div>`.value;
    host.appendChild(el);
    setTimeout(() => el.remove(), timeout);
  }

  function error(err) {
    if (!err) return;
    if (err.code === 'PASSWORD_CHANGE_REQUIRED') return;
    if (err.status === 401) return;
    console.error(err);
    toast(err.message || 'Something went wrong', 'error', 6000);
  }

  // ── Modal ──
  let lastFocus = null;
  function closeModal() {
    const el = document.getElementById('modal-root');
    if (el) el.remove();
    document.removeEventListener('keydown', escListener);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function escListener(e) { if (e.key === 'Escape') closeModal(); }

  // open({ title, body (SafeHtml), actions: [{label, kind, value}], wide, onSubmit(form) })
  function modal({ title, body, actions, wide, onSubmit, submitLabel = 'Save', cancelLabel = 'Cancel', danger }) {
    closeModal();
    lastFocus = document.activeElement;
    return new Promise(resolve => {
      const wrap = document.createElement('div');
      wrap.id = 'modal-root';
      wrap.className = 'modal-backdrop';
      const footer = actions !== null ? html`
        <div class="modal-foot">
          <button type="button" class="btn" data-modal-cancel>${cancelLabel}</button>
          ${onSubmit ? html`<button type="submit" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-modal-submit>${submitLabel}</button>` : ''}
        </div>` : '';
      wrap.innerHTML = html`
        <div class="modal ${wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <form novalidate>
            <div class="modal-head">
              <h2 id="modal-title" style="font-size:16px">${title}</h2>
              <button type="button" class="btn btn-ghost btn-icon" data-modal-cancel aria-label="Close">${icon('x')}</button>
            </div>
            <div class="modal-body">${body}<div class="form-error mt-8" data-modal-error role="alert"></div></div>
            ${footer}
          </form>
        </div>`.value;
      document.body.appendChild(wrap);
      const form = wrap.querySelector('form');
      const first = form.querySelector('input:not([type=hidden]), select, textarea, button[type=submit]');
      if (first) first.focus();
      document.addEventListener('keydown', escListener);
      wrap.addEventListener('mousedown', e => { if (e.target === wrap) { closeModal(); resolve(null); } });
      wrap.querySelectorAll('[data-modal-cancel]').forEach(b => b.addEventListener('click', () => { closeModal(); resolve(null); }));
      form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!onSubmit) return;
        const btn = form.querySelector('[data-modal-submit]');
        const errEl = form.querySelector('[data-modal-error]');
        errEl.textContent = '';
        btn.disabled = true;
        try {
          const result = await onSubmit(form, root.U.formData(form));
          if (result === false) { btn.disabled = false; return; }
          closeModal();
          resolve(result === undefined ? true : result);
        } catch (err) {
          errEl.textContent = err.message || 'Something went wrong';
          btn.disabled = false;
        }
      });
    });
  }

  function confirm({ title, message, confirmLabel = 'Confirm', danger = false }) {
    return modal({ title, body: html`<p>${message}</p>`, onSubmit: () => true, submitLabel: confirmLabel, danger }).then(Boolean);
  }

  // Show a value once (temporary passwords, invite links).
  function reveal({ title, intro, value, note }) {
    return modal({
      title,
      body: html`
        <p>${intro}</p>
        <div class="panel mono" style="word-break:break-all;font-size:13px">${value}</div>
        <div class="row mt-8"><button type="button" class="btn btn-sm" data-copy>${icon('clipboard')} Copy</button></div>
        ${note ? html`<p class="small muted mt-16">${note}</p>` : ''}`,
      cancelLabel: 'Done'
    }).then(() => {});
  }
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const text = btn.closest('.modal-body').querySelector('.mono').textContent;
    navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard', 'success'));
  });

  // ── Drawer ──
  function drawer({ title, subtitle, body }) {
    closeDrawer();
    lastFocus = document.activeElement;
    const back = document.createElement('div');
    back.id = 'drawer-backdrop';
    back.className = 'drawer-backdrop';
    const d = document.createElement('aside');
    d.id = 'drawer-root';
    d.className = 'drawer';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'true');
    d.innerHTML = html`
      <div class="drawer-head">
        <div><h2 style="font-size:16px">${title}</h2>${subtitle ? html`<div class="small muted mt-8">${subtitle}</div>` : ''}</div>
        <button type="button" class="btn btn-ghost btn-icon" data-drawer-close aria-label="Close">${icon('x')}</button>
      </div>
      <div class="drawer-body" id="drawer-body">${body}</div>`.value;
    document.body.appendChild(back);
    document.body.appendChild(d);
    back.addEventListener('click', closeDrawer);
    d.querySelector('[data-drawer-close]').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', drawerEsc);
    d.querySelector('[data-drawer-close]').focus();
    return d;
  }
  function drawerEsc(e) { if (e.key === 'Escape' && !document.getElementById('modal-root')) closeDrawer(); }
  function closeDrawer() {
    ['drawer-root', 'drawer-backdrop'].forEach(id => { const el = document.getElementById(id); if (el) el.remove(); });
    document.removeEventListener('keydown', drawerEsc);
    if (lastFocus && lastFocus.focus && document.body.contains(lastFocus)) lastFocus.focus();
  }

  // ── Loading states ──
  function skeleton(lines = 6) {
    return html`<div class="page"><div class="skeleton skeleton-line" style="width:30%;height:20px"></div>
      <div class="grid grid-4 mt-24">${[1, 2, 3, 4].map(() => html`<div class="skeleton skeleton-block"></div>`)}</div>
      <div class="card mt-24 card-body">${Array.from({ length: lines }, (_, i) => html`<div class="skeleton skeleton-line" style="width:${90 - (i % 3) * 15}%"></div>`)}</div></div>`;
  }
  function emptyState({ title, message, action }) {
    return html`<div class="empty"><h3>${title}</h3><p>${message}</p>${action || ''}</div>`;
  }

  // ── Visualisations ──
  function scoreRing(value, label, color) {
    const r = 52;
    const c = 2 * Math.PI * r;
    const v = value === null || value === undefined ? 0 : Math.max(0, Math.min(100, value));
    const stroke = color || scaleColor(v) || 'var(--ink-300)';
    return html`<div class="score-ring" role="img" aria-label="${label}: ${value === null ? 'not available' : value + ' out of 100'}">
      <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${r}" fill="none" stroke="#eef2f6" stroke-width="10"/>
      <circle cx="60" cy="60" r="${r}" fill="none" stroke="${stroke}" stroke-width="10" stroke-dasharray="${c}" stroke-dashoffset="${c - (v / 100) * c}" stroke-linecap="butt"/></svg>
      <div class="value"><strong>${value === null || value === undefined ? '—' : value}</strong><span>${label}</span></div></div>`;
  }

  function maturityScale(level) {
    return html`<div class="maturity-scale" aria-hidden="true">${[1, 2, 3, 4, 5].map(i => html`<span class="${i <= (level || 0) ? 'on' : ''}"></span>`)}</div>`;
  }

  function severityBar(counts, { legend = true } = {}) {
    const total = SEVERITY_ORDER.reduce((n, s) => n + (counts[s] || 0), 0);
    if (!total) return html`<div class="sevbar"></div><div class="small muted mt-8">No findings</div>`;
    return html`
      <div class="sevbar" role="img" aria-label="${SEVERITY_ORDER.map(s => `${counts[s] || 0} ${SEVERITY_LABEL[s]}`).join(', ')}">
        ${SEVERITY_ORDER.map(s => counts[s] ? html`<span class="sev-${s}" style="width:${(counts[s] / total) * 100}%" title="${SEVERITY_LABEL[s]}: ${counts[s]}"></span>` : '')}
      </div>
      ${legend ? html`<div class="legend">${SEVERITY_ORDER.map(s => html`<span><i class="sev-${s}"></i>${SEVERITY_LABEL[s]} ${counts[s] || 0}</span>`)}</div>` : ''}`;
  }

  function pctBar(value, color) {
    if (value === null || value === undefined) return html`<div class="bar"></div>`;
    return html`<div class="bar" role="img" aria-label="${value} percent"><span style="width:${value}%;background:${color || scaleColor(value)}"></span></div>`;
  }

  // Line chart for score history. points: [{ label, value }]
  function trendChart(points, { height = 120, max = 100 } = {}) {
    if (!points || points.length < 2) return html`<div class="small muted">A trend appears after two or more issued reports.</div>`;
    const w = 600;
    const pad = { l: 28, r: 12, t: 12, b: 22 };
    const iw = w - pad.l - pad.r;
    const ih = height - pad.t - pad.b;
    const x = i => pad.l + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw);
    const y = v => pad.t + ih - (v / max) * ih;
    const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
    return html`<div class="trend"><svg viewBox="0 0 ${w} ${height}" preserveAspectRatio="none" role="img" aria-label="Score trend: ${points.map(p => `${p.label} ${p.value}`).join(', ')}">
      ${[0, 50, 100].map(g => html`<line x1="${pad.l}" x2="${w - pad.r}" y1="${y(g)}" y2="${y(g)}" stroke="#e3e8ef" stroke-width="1"/><text x="${pad.l - 6}" y="${y(g) + 3}" font-size="10" text-anchor="end" fill="#7d8ba0">${g}</text>`)}
      <path d="${path}" fill="none" stroke="#0b63ce" stroke-width="2"/>
      ${points.map((p, i) => html`<circle cx="${x(i)}" cy="${y(p.value)}" r="3.5" fill="#fff" stroke="#0b63ce" stroke-width="2"/><text x="${x(i)}" y="${height - 6}" font-size="10" text-anchor="middle" fill="#7d8ba0">${p.label}</text><text x="${x(i)}" y="${y(p.value) - 8}" font-size="10" text-anchor="middle" fill="#0f1b2d" font-weight="600">${p.value}</text>`)}
    </svg></div>`;
  }

  // Domain heatmap: rows = domains, columns = control tiers. Cells link to findings.
  function heatmap(rows, { action } = {}) {
    const tiers = [['critical', 'Critical'], ['high', 'High'], ['medium', 'Medium'], ['foundational', 'Foundational']];
    return html`<div class="table-wrap"><table class="heatmap">
      <thead><tr><th class="row-head">Domain</th>${tiers.map(([, l]) => html`<th>${l}</th>`)}<th>Overall</th></tr></thead>
      <tbody>${rows.map(r => html`<tr>
        <th class="row-head" scope="row">${r.moduleName}</th>
        ${r.cells.map(c => c.percentage === null
          ? html`<td class="na">—</td>`
          : html`<td class="${action ? 'link' : ''}" style="background:${scaleColor(c.percentage)}" ${action ? raw(`data-action="${esc(action)}" data-module="${esc(r.moduleId)}" data-tier="${esc(c.tier)}" tabindex="0" role="button"`) : ''} title="${r.moduleName}, ${c.tier} controls: ${c.percentage}% across ${c.count} controls">${c.percentage}</td>`)}
        ${r.overall === null || r.overall === undefined ? html`<td class="na">—</td>` : html`<td style="background:${scaleColor(r.overall)}">${r.overall}</td>`}
      </tr>`)}</tbody></table></div>
      <div class="legend"><span><i style="background:var(--scale-0)"></i>Below 35</span><span><i style="background:var(--scale-1)"></i>35–54</span><span><i style="background:var(--scale-2)"></i>55–69</span><span><i style="background:var(--scale-3)"></i>70–84</span><span><i style="background:var(--scale-4)"></i>85 and above</span></div>`;
  }

  // Likelihood (gap size) x impact (control tier) matrix with finding counts.
  function riskMatrix(matrix, { action } = {}) {
    const impacts = [[4, 'Critical'], [3, 'High'], [2, 'Medium'], [1, 'Foundational']];
    const likelihoods = [[1, 'Minor gap'], [2, 'Partial gap'], [3, 'Major gap']];
    const max = Math.max(1, ...Object.values(matrix || {}));
    const tone = (l, i) => {
      const s = l * i;
      return s >= 9 ? '#f6c7c2' : s >= 6 ? '#fbd9c2' : s >= 3 ? '#fcebc4' : '#e7eef7';
    };
    return html`<div class="matrix" role="table" aria-label="Findings by impact and likelihood">
      <div></div>${likelihoods.map(([, l]) => html`<div class="axis axis-x">${l}</div>`)}<div></div>
      ${impacts.map(([iv, il]) => html`
        <div class="axis">${il} control</div>
        ${likelihoods.map(([lv]) => {
          const n = (matrix || {})[`${lv}|${iv}`] || 0;
          return html`<div class="cell ${n && action ? 'link' : ''}" style="background:${tone(lv, iv)};opacity:${n ? 0.55 + 0.45 * (n / max) : 0.5}" ${n && action ? raw(`data-action="${esc(action)}" data-likelihood="${lv}" data-impact="${iv}" tabindex="0" role="button"`) : ''}>${n || ''}</div>`;
        })}
        <div></div>`)}
    </div><div class="small muted mt-8">Rows: criticality of the affected control. Columns: size of the implementation gap.</div>`;
  }

  // ── Deadlines ──
  // Works out days left and whether the assessment is on pace. Tone stays
  // calm unless the date is close and progress is behind, or it has passed.
  const OPEN = ['in_progress', 'evidence_requested'];
  function deadline(a) {
    if (!a || !a.dueDate || !OPEN.includes(a.status)) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const due = new Date(`${a.dueDate}T00:00:00`);
    const days = Math.round((due - today) / 86400000);
    const pctDone = a.progress ? a.progress.percentage : 0;
    const remaining = a.progress ? Math.max(0, a.progress.applicable - a.progress.answered) : 0;
    const started = a.createdAt ? new Date(a.createdAt) : today;
    const span = Math.max(1, Math.round((due - started) / 86400000));
    const elapsed = Math.min(100, Math.max(0, Math.round(((today - started) / 86400000 / span) * 100)));
    let tone = 'calm';
    if (days < 0) tone = 'overdue';
    else if (days === 0 || (days <= 7 && pctDone < 90) || (days <= 14 && pctDone < 60) || elapsed - pctDone > 25) tone = 'attention';
    const when = days < 0 ? `${Math.abs(days)} day${days === -1 ? '' : 's'} overdue` : days === 0 ? 'Due today' : `${days} day${days === 1 ? '' : 's'} left`;
    const perDay = days > 0 && remaining ? Math.ceil(remaining / days) : remaining;
    const pace = remaining === 0 ? 'All questions answered. Ready to submit.'
      : days < 0 ? `${remaining} question${remaining === 1 ? '' : 's'} still to answer.`
      : tone === 'attention' ? `About ${perDay} question${perDay === 1 ? '' : 's'} a day to finish on time.`
      : 'On track for the target date.';
    return { days, tone, when, pace, elapsed, pctDone, date: root.U.fmtDate(a.dueDate, { day: 'numeric', month: 'short' }), fullDate: root.U.fmtDate(a.dueDate, { day: 'numeric', month: 'long', year: 'numeric' }) };
  }
  function deadlineBadge(a, opts = {}) {
    const d = deadline(a);
    if (!d) return a && a.dueDate ? html`<span class="small muted">Due ${root.U.fmtDate(a.dueDate)}</span>` : html`<span class="small faint">No target date</span>`;
    return html`<span class="deadline deadline-${d.tone}" title="${d.pace}">${icon('calendar')}<span>${opts.short ? d.when : html`Due ${d.date} · <strong>${d.when}</strong>`}</span></span>`;
  }
  function deadlineStrip(a) {
    const d = deadline(a);
    if (!d) return '';
    return html`<div class="deadline-strip deadline-strip-${d.tone}" role="status">
      <div class="deadline-strip-main">${icon('calendar')}<div><div class="deadline-strip-title">Target completion <strong>${d.fullDate}</strong></div><div class="deadline-strip-sub">${d.pace}</div></div></div>
      <div class="deadline-strip-when">${d.when}</div>
      <div class="deadline-strip-bars" aria-hidden="true">
        <div><span>Time used</span><div class="bar"><span style="width:${d.elapsed}%;background:var(--ink-300)"></span></div></div>
        <div><span>Completed</span><div class="bar"><span style="width:${d.pctDone}%;background:var(--accent)"></span></div></div>
      </div>
    </div>`;
  }

  // ── Portal building blocks ──
  // Page header with an eyebrow, optional stat tiles and actions.
  function pageHero({ eyebrow, title, sub, actions, stats, icon: iconName }) {
    return html`<header class="page-hero">
      <div class="page-hero-main">
        ${iconName ? html`<span class="page-hero-icon">${icon(iconName)}</span>` : ''}
        <div class="grow">
          ${eyebrow ? html`<div class="eyebrow">${eyebrow}</div>` : ''}
          <h1>${title}</h1>
          ${sub ? html`<div class="sub">${sub}</div>` : ''}
        </div>
        ${actions ? html`<div class="btn-group">${actions}</div>` : ''}
      </div>
      ${stats && stats.length ? html`<div class="hero-stats">${stats.map(s => html`<div class="hero-stat ${s.tone ? `hero-stat-${s.tone}` : ''}">
        <span class="hero-stat-label">${s.label}</span><strong>${s.value}</strong>${s.sub ? html`<span class="hero-stat-sub">${s.sub}</span>` : ''}</div>`)}</div>` : ''}
    </header>`;
  }

  // Score points gained by completing a fix.
  function fmtGain(gain) {
    if (!gain || gain <= 0) return '';
    return gain < 1 ? '+<1' : `+${Math.round(gain)}`;
  }
  function liftChip(gain, { size, label = 'pts' } = {}) {
    const text = fmtGain(gain);
    if (!text) return '';
    return html`<span class="lift ${size === 'lg' ? 'lift-lg' : ''}" title="Expected rise in Cyber Health Score when this is fixed">${icon('trendUp')}${text}<small>${label}</small></span>`;
  }

  // Horizontal bar: where the score is, what resolved work has banked, and
  // what the open work would add.
  function scorePath({ now, banked = 0, potential, labels = {} }) {
    const clamp = v => Math.max(0, Math.min(100, v));
    const a = clamp(now);
    const b = clamp(now + banked);
    const c = clamp(potential);
    return html`<div class="score-path" role="img" aria-label="Score now ${a}${banked ? `, ${Math.round(b)} with resolved fixes` : ''}, ${Math.round(c)} when every open fix is complete">
      <div class="score-path-track">
        <span class="score-path-now" style="width:${a}%"></span>
        ${b > a ? html`<span class="score-path-banked" style="left:${a}%;width:${b - a}%"></span>` : ''}
        ${c > b ? html`<span class="score-path-gain" style="left:${b}%;width:${c - b}%"></span>` : ''}
        <i class="score-path-mark ${a < 10 ? 'edge-start' : a > 90 ? 'edge-end' : ''}" style="left:${a}%"><b>${Math.round(a)}</b><em>${labels.now || 'Now'}</em></i>
        ${c > b ? html`<i class="score-path-mark score-path-mark-end ${c > 90 ? 'edge-end' : ''}" style="left:${c}%"><b>${Math.round(c)}</b><em>${labels.potential || 'When fixed'}</em></i>` : ''}
      </div>
    </div>`;
  }

  // Small ring for completion percentages.
  function miniRing(pct, { size = 44, color, label } = {}) {
    const r = 18;
    const c = 2 * Math.PI * r;
    const v = Math.max(0, Math.min(100, pct || 0));
    return html`<span class="mini-ring" style="width:${size}px;height:${size}px" role="img" aria-label="${label || `${v} percent`}">
      <svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="${r}" fill="none" stroke="var(--subtle)" stroke-width="5"/>
      <circle cx="22" cy="22" r="${r}" fill="none" stroke="${color || (v === 100 ? 'var(--success)' : 'var(--accent)')}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c - (v / 100) * c}" transform="rotate(-90 22 22)"/></svg>
      <b>${Math.round(v)}%</b></span>`;
  }

  root.UI = { pageHero, fmtGain, liftChip, scorePath, miniRing, deadline, deadlineBadge, deadlineStrip, toast, error, modal, confirm, reveal, closeModal, drawer, closeDrawer, skeleton, emptyState, scoreRing, maturityScale, severityBar, pctBar, trendChart, heatmap, riskMatrix };
})(window);
