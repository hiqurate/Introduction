// ============================================
// HawkSight — Application shell and router
// ============================================

(function (root) {
  const { html, icon, wordmark, $, setHtml, on } = root.U;
  const STAFF = ['platform_admin', 'assessor'];

  const App = {
    session: null,
    tenantId: null,
    tenants: [],
    routes: [],
    current: null,
    aiAvailable: false,

    route(pattern, handler, opts = {}) {
      const keys = [];
      const re = new RegExp(`^${pattern.replace(/:[a-zA-Z]+/g, m => { keys.push(m.slice(1)); return '([^/]+)'; })}$`);
      this.routes.push({ pattern, re, keys, handler, opts });
    },

    navigate(path) {
      if (`#${path}` === location.hash) this.handleRoute();
      else location.hash = path;
    },

    isStaff() { return !!(this.session && STAFF.includes(this.session.user.role)); },
    can(cap) { return !!(this.session && this.session.capabilities.includes(cap)); },
    role() { return this.session ? this.session.user.role : null; },

    async loadSession() {
      try {
        const me = await root.API.get('/api/auth/me', { quiet: true });
        this.session = me && me.authenticated ? me : null;
      } catch {
        this.session = null;
      }
      if (this.session) await this.afterLogin();
    },

    async afterLogin() {
      if (this.session.user.mustChangePassword) return;
      if (this.isStaff()) {
        const { tenants } = await root.API.get('/api/tenants');
        this.tenants = tenants;
        let stored = null;
        try { stored = Number(localStorage.getItem('hs.tenantContext')); } catch { stored = null; }
        this.tenantId = tenants.some(t => t.id === stored) ? stored : (tenants[0] ? tenants[0].id : null);
      } else {
        this.tenantId = this.session.user.tenantId;
        this.tenants = this.session.tenant ? [{ id: this.session.tenant.id, name: this.session.tenant.name, isDemo: !!this.session.tenant.is_demo, package: this.session.tenant.package }] : [];
      }
      root.API.get('/api/ai/status').then(r => { this.aiAvailable = !!r.available; }).catch(() => {});
    },

    // Switch organisation context, refreshing the list if the organisation is
    // new since sign-in (for example created by another administrator).
    async ensureTenant(id) {
      if (!this.tenants.some(t => t.id === Number(id)) && this.isStaff()) {
        this.tenants = (await root.API.get('/api/tenants')).tenants;
      }
      this.setTenant(id);
    },

    setTenant(id) {
      this.tenantId = Number(id);
      this.deadlineLoadedAt = 0;
      try { localStorage.setItem('hs.tenantContext', String(id)); } catch { /* storage unavailable */ }
    },

    currentTenant() {
      return this.tenants.find(t => t.id === this.tenantId) || null;
    },

    homePath() {
      if (!this.session) return '/';
      return this.isStaff() ? '/console' : '/app';
    },

    async handleRoute() {
      const path = (location.hash || '#/').slice(1) || '/';
      const match = this.routes.map(r => ({ r, m: r.re.exec(path) })).find(x => x.m);
      if (!match) return this.navigate(this.session ? this.homePath() : '/');
      const { r, m } = match;
      const params = {};
      r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });

      if (!r.opts.public) {
        if (!this.session) { this.pendingPath = path; return this.navigate('/login'); }
        if (this.session.user.mustChangePassword && path !== '/account/password') return this.navigate('/account/password');
        if (r.opts.staff && !this.isStaff()) return this.navigate('/app');
        if (r.opts.capability && !this.can(r.opts.capability)) return this.navigate(this.homePath());
      }
      this.current = { path, params, route: r };
      root.UI.closeDrawer();
      root.UI.closeModal();
      try {
        await r.handler(params);
      } catch (err) {
        if (err && err.status === 404) {
          this.renderApp(html`<div class="page">${root.UI.emptyState({ title: 'Not found', message: 'This item does not exist or you do not have access to it.', action: html`<a class="btn" href="#${this.homePath()}">Go to home</a>` })}</div>`);
        } else {
          root.UI.error(err);
        }
      }
      const main = document.getElementById('main');
      if (main && !r.opts.keepScroll) window.scrollTo(0, 0);
    },

    // ── Layouts ──
    renderPublic(content) {
      const signedIn = !!this.session;
      setHtml('#root', html`
        <header class="site-header">
          <div class="site-header-inner">
            <a href="#/" aria-label="HawkSight home">${wordmark('by HiQurate Ops')}</a>
            <nav class="site-nav" aria-label="Site">
              <a href="#/" data-action="scroll-to" data-target="product">Product</a>
              <a href="#/" data-action="scroll-to" data-target="attack-paths">Attack paths</a>
              <a href="#/" data-action="scroll-to" data-target="plans">Plans</a>
              <a href="#/sample-report">Sample report</a>
              ${signedIn ? html`<a class="btn hx-btn-accent btn-sm" href="#${this.homePath()}">Open HawkSight</a>` : html`<a class="btn hx-btn-accent btn-sm" href="#/login">Sign in</a>`}
            </nav>
          </div>
        </header>
        <main id="main">${content}</main>
        <footer class="site-footer">
          <div class="container row row-between row-wrap">
            <div class="row" style="gap:14px">${wordmark()}<span>Threat readiness assessment by HiQurate Ops.</span></div>
            <div class="row"><a href="#/sample-report">Sample report</a><a href="#/login">Sign in</a><a href="https://www.hiqurateops.com" target="_blank" rel="noopener noreferrer">hiqurateops.com</a></div>
          </div>
        </footer>`);
    },

    renderAuth(content) {
      setHtml('#root', content);
    },

    navItem(href, label, iconName, opts = {}) {
      const path = this.current ? this.current.path : '';
      const active = opts.exact ? path === href : (path === href || path.startsWith(`${href}/`));
      return html`<a class="nav-item" href="#${href}" ${active ? root.U.raw('aria-current="page"') : ''}>${icon(iconName)}<span>${label}</span>${opts.count ? html`<span class="count">${opts.count}</span>` : ''}</a>`;
    },

    sidebar() {
      const s = this.session;
      const staff = this.isStaff();
      const pa = s.user.role === 'platform_admin';
      const tenant = this.currentTenant();
      const workspace = html`
        <div class="sidebar-section">
          <div class="sidebar-label">${staff ? 'Organisation workspace' : 'Customer portal'}</div>
          ${this.navItem('/app', 'Overview', 'grid', { exact: true })}
          ${this.navItem('/app/assessments', 'Assessments', 'clipboard')}
          ${this.navItem('/app/reports', 'Reports', 'file')}
          ${this.navItem('/app/actions', 'Action plan', 'list')}
          ${this.navItem('/app/organisation', 'Organisation', 'building')}
        </div>`;
      return html`
        <aside class="sidebar" id="sidebar" aria-label="Main navigation">
          <div class="sidebar-brand"><a href="#${this.homePath()}" aria-label="HawkSight home">${wordmark(staff ? 'Assessor console' : 'Customer portal')}</a></div>
          ${staff ? html`
            <div class="sidebar-section">
              <div class="sidebar-label">Console</div>
              ${this.navItem('/console', 'Review queue', 'inbox', { exact: true })}
              ${this.navItem('/console/organisations', 'Organisations', 'building')}
              ${pa ? this.navItem('/console/users', 'Staff accounts', 'users') : ''}
              ${this.navItem('/console/library', 'Control library', 'book')}
              ${this.navItem('/console/templates', 'Templates', 'layers')}
              ${this.navItem('/methodology', 'Methodology', 'info')}
              ${pa ? this.navItem('/console/scoring', 'Scoring', 'sliders') : ''}
              ${pa ? this.navItem('/console/audit', 'Audit log', 'log') : ''}
              ${pa ? this.navItem('/console/analytics', 'Analytics', 'activity') : ''}
            </div>
            ${tenant ? workspace : ''}` : workspace}
          <div class="sidebar-foot">
            <div class="who">${s.user.name || s.user.email}</div>
            <div class="role">${s.user.roleLabel}${s.tenant ? html` · ${s.tenant.name}` : ''}</div>
            <div class="row mt-8">
              <a class="btn btn-ghost btn-sm" href="#/account/password">${icon('key')} Password</a>
              <button class="btn btn-ghost btn-sm" data-action="logout">${icon('logout')} Sign out</button>
            </div>
          </div>
        </aside>`;
    },

    topbar() {
      const staff = this.isStaff();
      const tenant = this.currentTenant();
      return html`
        <div class="topbar">
          <button class="btn btn-ghost btn-icon mobile-nav-toggle" data-action="toggle-nav" aria-label="Open navigation">${icon('menu')}</button>
          ${staff && this.tenants.length ? html`
            <div class="context">
              <label for="tenant-context" class="muted small">Organisation</label>
              <select id="tenant-context" class="select" data-change="switch-tenant">
                ${this.tenants.map(t => html`<option value="${t.id}" ${t.id === this.tenantId ? root.U.raw('selected') : ''}>${t.name}</option>`)}
              </select>
            </div>` : html`<div class="context strong">${tenant ? tenant.name : ''}</div>`}
          <div class="grow"></div>
          ${staff ? html`<a class="btn btn-ghost btn-sm topbar-help" href="#/methodology">${icon('info')} Methodology</a>` : html`<span id="deadline-chip" class="topbar-help"></span>`}
        </div>`;
    },

    // Nearest open deadline for the top bar (customer portal only).
    async refreshDeadline(force) {
      if (!this.session || this.isStaff() || !this.tenantId) return;
      if (!force && this.deadlineLoadedAt && Date.now() - this.deadlineLoadedAt < 60000) return this.paintDeadline();
      try {
        const { assessments } = await root.API.get(`/api/assessments${root.API.qs({ tenantId: this.tenantId })}`);
        const open = assessments.filter(a => a.dueDate && ['in_progress', 'evidence_requested'].includes(a.status)).sort((x, y) => x.dueDate.localeCompare(y.dueDate));
        this.deadlineAssessment = open[0] || null;
        this.deadlineLoadedAt = Date.now();
      } catch { this.deadlineAssessment = null; }
      this.paintDeadline();
    },

    paintDeadline() {
      const el = document.getElementById('deadline-chip');
      if (!el) return;
      const a = this.deadlineAssessment;
      if (!a) { el.innerHTML = ''; return; }
      el.innerHTML = html`<a href="#/app/assessments/${a.id}" class="deadline deadline-${(root.UI.deadline(a) || { tone: 'calm' }).tone}" title="${a.title}">${icon('calendar')}<span>${a.frameworkShortName} due ${root.U.fmtDate(a.dueDate, { day: 'numeric', month: 'short' })} · <strong>${(root.UI.deadline(a) || {}).when || ''}</strong></span></a>`.value;
    },

    renderApp(content) {
      const tenant = this.currentTenant();
      const showDemo = tenant && tenant.isDemo && this.current && this.current.path.startsWith('/app');
      setHtml('#root', html`
        <div class="app">
          ${this.sidebar()}
          <div class="main">
            ${this.topbar()}
            ${showDemo ? html`<div class="demo-banner">You are viewing the demonstration organisation. All names and data are fictional.</div>` : ''}
            <main id="main" tabindex="-1">${content}</main>
          </div>
        </div>`);
      this.refreshDeadline();
    },

    async start() {
      root.API.onUnauthorised(() => {
        if (this.session) {
          this.session = null;
          root.UI.toast('Your session has ended. Please sign in again.');
          this.navigate('/login');
        }
      });
      root.API.onPasswordChange(() => this.navigate('/account/password'));
      window.addEventListener('hashchange', () => this.handleRoute());
      await this.loadSession();
      this.handleRoute();
    }
  };

  on('action', 'logout', async () => {
    await root.API.post('/api/auth/logout').catch(() => {});
    App.session = null;
    App.tenants = [];
    App.tenantId = null;
    root.Content.clear();
    App.navigate('/login');
  });
  on('action', 'scroll-to', (el, e) => {
    e.preventDefault();
    const go = () => { const t = document.getElementById(el.dataset.target); if (t) t.scrollIntoView({ behavior: 'smooth' }); };
    if (App.current && App.current.path === '/') go();
    else { App.navigate('/'); setTimeout(go, 400); }
  });
  on('action', 'toggle-nav', () => { const s = $('#sidebar'); if (s) s.classList.toggle('open'); });
  on('change', 'switch-tenant', el => {
    App.setTenant(el.value);
    if (App.current && App.current.path.startsWith('/app')) {
      const base = App.current.path.split('/').slice(0, 3).join('/');
      App.navigate(['/app/assessments', '/app/reports', '/app/actions', '/app/organisation'].includes(base) ? base : '/app');
    } else {
      App.handleRoute();
    }
  });
  document.addEventListener('click', e => {
    const s = $('#sidebar');
    if (s && s.classList.contains('open') && !e.target.closest('#sidebar') && !e.target.closest('[data-action="toggle-nav"]')) s.classList.remove('open');
  });

  root.App = App;
  document.addEventListener('DOMContentLoaded', () => App.start());
})(window);
