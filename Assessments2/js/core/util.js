// ============================================
// HawkSight — Client utilities
// Safe HTML templating, icons, formatting and event delegation.
// ============================================

(function (root) {
  // ── Safe templating ──
  // html`...` escapes every interpolated value unless it is SafeHtml (the
  // result of another html`` call or raw()). Arrays are joined.
  class SafeHtml {
    constructor(value) { this.value = value; }
    toString() { return this.value; }
  }

  function esc(value) {
    if (value === null || value === undefined || value === false) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function render(value) {
    if (value instanceof SafeHtml) return value.value;
    if (Array.isArray(value)) return value.map(render).join('');
    return esc(value);
  }

  function html(strings, ...values) {
    let out = '';
    strings.forEach((s, i) => {
      out += s;
      if (i < values.length) out += render(values[i]);
    });
    return new SafeHtml(out);
  }

  function raw(value) {
    return new SafeHtml(String(value));
  }

  // ── Icons (stroke icons, 24px grid) ──
  const ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    clipboard: '<path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z"/><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 12l2 2 4-4"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
    activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    log: '<path d="M8 4h11v16H8"/><path d="M5 4h.01M5 8h.01M5 12h.01M5 16h.01M5 20h.01"/><path d="M11 8h5M11 12h5M11 16h3"/>',
    inbox: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>',
    logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 16l-4-4 4-4M6 12h10"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M14 9l2 2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5"/><path d="M4 19h16"/>',
    upload: '<path d="M12 16V5M7 10l5-5 5 5"/><path d="M4 19h16"/>',
    printer: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="1"/><path d="M7 14h10v7H7z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
    paperclip: '<path d="M20 11l-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 7"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    alert: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17h.01"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/>',
    chevronRight: '<path d="M9 6l6 6-6 6"/>',
    chevronLeft: '<path d="M15 6l-6 6 6 6"/>',
    chevronDown: '<path d="M6 9l6 6 6-6"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8.5-8 9.5C7.5 20.5 4 17 4 12V6z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    message: '<path d="M4 5h16v11H9l-5 4z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    refresh: '<path d="M20 6v5h-5"/><path d="M4 18v-5h5"/><path d="M19 11a7 7 0 0 0-12.5-3.5M5 13a7 7 0 0 0 12.5 3.5"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    trendUp: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    zap: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    user2: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    compare: '<path d="M8 4v16M16 4v16"/><path d="M4 8l4-4 4 4M12 16l4 4 4-4"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    scale: '<path d="M12 3v18M7 21h10M4 7h16"/><path d="M4 7l-2 6a3 3 0 0 0 4 0zM20 7l-2 6a3 3 0 0 0 4 0z"/>',
    workflow: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M6 9v4a2 2 0 0 0 2 2h7"/>'
  };

  function icon(name, cls) {
    return raw(`<svg class="icon ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`);
  }

  // HawkSight brand assets (assets/brand). The master artwork is a silver
  // and HiQurate-red hawk on graphite (the earlier gold artwork is kept in
  // assets/brand/legacy-gold). On light surfaces the product uses the
  // graphite tile at small sizes and the graphite-ink mark at large sizes;
  // the reversed (original) artwork is used on graphite surfaces.
  const BRAND = '/assets/brand/';
  const LOGO = raw(`<img class="brand-mark" src="${BRAND}hawksight-mark-reversed.png" alt="" width="512" height="340">`);
  const LOGO_LIGHT = raw(`<img class="brand-mark" src="${BRAND}hawksight-mark.png" alt="" width="512" height="340">`);
  function wordmark(sub, variant) {
    const dark = variant === 'dark';
    const glyph = dark
      ? raw(`<img class="wm-glyph" src="${BRAND}hawksight-mark-reversed.png" alt="">`)
      : raw(`<img class="wm-tile" src="${BRAND}hawksight-tile.png" alt="">`);
    const type = raw(`<img class="wm-type" src="${BRAND}hawksight-wordmark${dark ? '-reversed' : ''}.png" alt="HawkSight">`);
    return html`<span class="wordmark ${dark ? 'wordmark-dark' : 'wordmark-light'}">${glyph}<span class="wm-text">${type}${sub ? html`<small>${sub}</small>` : ''}</span></span>`;
  }


  // ── Formatting ──
  function fmtDate(value, opts) {
    if (!value) return '—';
    const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-GB', opts || { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function fmtDateTime(value) {
    if (!value) return '—';
    const d = new Date(value);
    return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  }
  function fmtTime(value) {
    return new Date(value).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
  function daysBetween(a, b) {
    return Math.round((new Date(b) - new Date(a)) / 86400000);
  }
  function ageLabel(value) {
    if (!value) return '';
    const days = daysBetween(value, new Date());
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 31) return `${days} days ago`;
    const months = Math.round(days / 30.4);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    const years = Math.round((days / 365) * 10) / 10;
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
  function plural(n, word, pluralWord) {
    return `${n} ${n === 1 ? word : (pluralWord || `${word}s`)}`;
  }
  function fileSize(bytes) {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${Math.round(bytes / 102.4) / 10} KB`;
    return `${Math.round(bytes / 104857.6) / 10} MB`;
  }
  function pct(value) {
    return value === null || value === undefined ? '—' : `${value}`;
  }

  const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low', 'informational'];
  const SEVERITY_LABEL = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low', informational: 'Informational' };
  function severityBadge(sev) {
    return html`<span class="badge badge-${sev}">${SEVERITY_LABEL[sev] || sev}</span>`;
  }
  function scaleColor(p) {
    if (p === null || p === undefined) return null;
    if (p < 35) return 'var(--scale-0)';
    if (p < 55) return 'var(--scale-1)';
    if (p < 70) return 'var(--scale-2)';
    if (p < 85) return 'var(--scale-3)';
    return 'var(--scale-4)';
  }
  function band(score, bands) {
    if (score === null || score === undefined) return '';
    const b = bands || { strong: 75, moderate: 55 };
    return score >= b.strong ? 'Strong' : score >= b.moderate ? 'Moderate' : 'Weak';
  }

  // ── DOM helpers ──
  function $(sel, rootEl) { return (rootEl || document).querySelector(sel); }
  function $all(sel, rootEl) { return Array.from((rootEl || document).querySelectorAll(sel)); }
  function setHtml(el, content) {
    if (typeof el === 'string') el = $(el);
    if (el) el.innerHTML = content instanceof SafeHtml ? content.value : esc(content);
  }
  function formData(form) {
    const out = {};
    $all('input, select, textarea', form).forEach(el => {
      if (!el.name) return;
      if (el.type === 'checkbox') {
        if (el.dataset.group) {
          out[el.name] = out[el.name] || [];
          if (el.checked) out[el.name].push(el.value);
        } else {
          out[el.name] = el.checked;
        }
      } else if (el.type === 'radio') {
        if (el.checked) out[el.name] = el.value;
      } else {
        out[el.name] = el.value;
      }
    });
    return out;
  }
  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }
  function download(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ── Event delegation ──
  // Elements declare data-action="name" (click), data-change="name" (input
  // change) or data-submit="name" (form submit). Handlers receive (el, event).
  const handlers = { action: {}, change: {}, submit: {}, input: {} };
  function on(type, name, fn) { handlers[type][name] = fn; }
  function dispatch(type, attr, event) {
    const el = event.target.closest(`[data-${attr}]`);
    if (!el) return;
    const fn = handlers[type][el.dataset[attr]];
    if (!fn) return;
    if (type === 'submit' || (type === 'action' && el.tagName === 'A' && el.getAttribute('href') === '#')) event.preventDefault();
    Promise.resolve(fn(el, event)).catch(err => root.UI && root.UI.error(err));
  }
  document.addEventListener('click', e => dispatch('action', 'action', e));
  document.addEventListener('change', e => dispatch('change', 'change', e));
  document.addEventListener('input', e => dispatch('input', 'input', e));
  document.addEventListener('submit', e => {
    const form = e.target.closest('[data-submit]');
    if (form) { e.preventDefault(); dispatch('submit', 'submit', e); }
  });
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-action][role="button"], tr[data-action]')) {
      e.preventDefault();
      e.target.click();
    }
  });

  root.U = {
    SafeHtml, html, raw, esc, icon, LOGO, LOGO_LIGHT, wordmark,
    fmtDate, fmtDateTime, fmtTime, ageLabel, daysBetween, plural, fileSize, pct,
    SEVERITY_ORDER, SEVERITY_LABEL, severityBadge, scaleColor, band,
    $, $all, setHtml, formData, debounce, download, on
  };
})(window);
