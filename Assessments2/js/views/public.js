// ============================================
// HawkSight — Public site, sign-in and account pages
// ============================================

(function (root) {
  const { html, raw, icon, wordmark, $, setHtml, on, formData, plural } = root.U;
  const { App, API, UI, Content } = root;

  // ── Landing page ──
  // Positioning: threat readiness, not audit. The page leads with the attack
  // paths organisations are actually breached through, using the same
  // scenario library (HawkThreats) and sample report the product uses.
  const Threats = root.HawkThreats;
  const FRAMEWORKS_MAPPED = ['NIST CSF 2.0', 'ISO/IEC 27001:2022', 'CIS Controls v8.1', 'SOC 2', 'PCI DSS 4.0.1', 'HIPAA', 'DPDP Act 2023'];
  const PLANS = [
    { id: 'snapshot', name: 'Snapshot', tag: 'Your first look at your attack paths', sample: '#/sample-snapshot',
      points: ['One question per security control, about 30 to 35 in total', 'Self-assessed in the portal at your own pace', 'The three attack paths most likely to succeed against you, and how to break each'] },
    { id: 'comprehensive', name: 'Comprehensive', tag: 'Assessor-led threat readiness', featured: true, sample: '#/sample-report',
      points: ['Your industry\'s full question set: the shared attack-path core plus the attacks specific to your sector', 'Answers that decide your attack paths are checked against evidence by HiQurate Ops assessors', 'A board report showing every attack path, the fixes that break the most of them, and a 30, 90 and 180 day plan'] },
    { id: 'managed', name: 'Managed', tag: 'Readiness that keeps up with attackers',
      points: ['Comprehensive assessments repeated on a schedule', 'Watch attack paths close from one cycle to the next', 'Each cycle runs against the latest version of the scenario library'] }
  ];
  // Real questions from the core set, contrasted with the checklist versions
  // customers are used to.
  const CONTRAST = [
    ['Do you use multi-factor authentication?', 'Which of your sign-ins can still be used with a stolen password alone?', 'Most organisations "have MFA". Attackers find the VPN, legacy app or admin account that does not.'],
    ['Do you have a password reset procedure?', 'When someone calls the helpdesk to reset their MFA, how do you confirm who they are?', 'Attackers phone helpdesks pretending to be staff. It is how several of the largest breaches of recent years began.'],
    ['Do you take regular backups?', 'If an attacker had full admin control of your network, could they delete your backups?', 'Ransomware groups destroy backups first. A backup the attacker can reach is not a recovery plan.'],
    ['Do you have a supplier management policy?', 'If a supplier emails new bank details, what has to happen before the next payment goes out?', 'Payment diversion arrives in a real email thread from a real, compromised supplier mailbox.']
  ];
  const PATH_BADGE = { open: ['Open', 'hx-path-open'], partial: ['Partly defended', 'hx-path-partial'], defended: ['Defended', 'hx-path-defended'] };
  const label = (n, text) => html`<div class="hx-label"><span>${n}</span>${text}</div>`;
  let landingIndustry = 'all';
  let industryNames = {};

  function scenarioCards() {
    if (!Threats) return '';
    // For a chosen industry, paths specific to it come before the ones every
    // industry faces: those are the ones visitors are least likely to know.
    const specific = sc => (sc.relevance.default === 'high' ? 1 : 0);
    const list = Threats.SCENARIOS
      .filter(sc => landingIndustry === 'all' || Threats.relevanceFor(sc, landingIndustry, {}) === 'high')
      .map((sc, i) => ({ sc, i }))
      .sort((a, b) => (landingIndustry === 'all' ? 0 : specific(a.sc) - specific(b.sc)) || a.i - b.i)
      .map(x => x.sc);
    const shown = list.slice(0, 6);
    return html`<div class="hx-paths">${shown.map(sc => {
      const ex = sc.examples[0];
      const high = Object.keys(sc.relevance).filter(k => k !== 'default' && sc.relevance[k] === 'high');
      const who = sc.relevance.default === 'high' ? 'Every industry' : high.map(k => industryNames[k] || k).join(' · ');
      return html`<article class="hx-path">
        <div class="hx-path-cat">${sc.category}</div>
        <h3>${sc.name}</h3>
        <p class="hx-path-hook">${sc.hook}</p>
        ${ex ? html`<p class="hx-path-ex"><span>Real-world case</span>${ex.org} (${ex.year})</p>` : ''}
        <div class="hx-path-who">${who}</div>
      </article>`;
    })}</div>
    ${list.length > shown.length ? html`<p class="hx-note">and ${list.length - shown.length} more ${landingIndustry === 'all' ? '' : 'for this industry '}in every assessment.</p>` : ''}`;
  }

  on('action', 'hx-industry', el => {
    landingIndustry = el.dataset.industry;
    document.querySelectorAll('[data-action="hx-industry"]').forEach(b => b.setAttribute('aria-pressed', b.dataset.industry === landingIndustry ? 'true' : 'false'));
    setHtml('#hx-paths', scenarioCards());
  });

  App.route('/', async () => {
    const catalog = await Content.catalog();
    const industries = catalog.filter(f => f.type === 'industry');
    industryNames = industries.reduce((acc, f) => { acc[f.id] = f.shortName; return acc; }, {});
    landingIndustry = 'all';
    const scenarioCount = Threats ? Threats.SCENARIOS.length : 0;
    const incidentCount = Threats ? Threats.SCENARIOS.reduce((n, sc) => n + sc.examples.length, 0) : 0;

    App.renderPublic(html`
      <section class="hx-hero" id="product">
        <div class="hx-hero-mark" aria-hidden="true">${root.U.LOGO_LIGHT}</div>
        <div class="container hx-hero-grid">
          <div>
            <div class="hx-kicker"><span class="hx-dot"></span>Threat readiness assessment</div>
            <h1 class="hx-title">See how you would be attacked.<span>Before someone tries.</span></h1>
            <p class="hx-lead">HawkSight tests your organisation against the attack paths businesses like yours are actually breached through, from a phone call to your helpdesk to ransomware through your own VPN. You see which paths are open today and the few fixes that would close the most of them.</p>
            <div class="btn-group">
              <a class="btn btn-lg hx-btn-accent" href="#/sample-report">See a sample report ${icon('chevronRight')}</a>
              <a class="btn btn-lg hx-btn-ghost" href="#/" data-action="scroll-to" data-target="attack-paths">Explore attack paths</a>
            </div>
            <dl class="hx-stats">
              <div><dt>Attack paths tested</dt><dd>${scenarioCount}</dd></div>
              <div><dt>Industry packs</dt><dd>${industries.length}</dd></div>
              <div><dt>Real incidents behind them</dt><dd>${incidentCount}</dd></div>
            </dl>
          </div>
          <div class="hx-preview" id="hx-preview" aria-label="Sample results">
            <div class="hx-panel"><div class="skeleton" style="height:320px;opacity:.08"></div></div>
          </div>
        </div>
        <div class="container"><div class="hx-mapped"><span>Results also expressed against</span>${FRAMEWORKS_MAPPED.map(f => html`<em>${f}</em>`)}</div></div>
      </section>

      <section class="hx-section">
        <div class="container">
          ${label('01', 'The difference')}
          <h2 class="hx-h2">Checklists ask what you have. Attackers look for what you missed.</h2>
          <p class="hx-sub">Most assessments confirm that a control exists. HawkSight asks whether it would actually stop an attack, in plain language anyone on your team can answer.</p>
          <div class="hx-contrast" role="table" aria-label="Checklist questions compared with HawkSight questions">
            <div class="hx-contrast-row hx-contrast-head" role="row"><span role="columnheader">A compliance checklist asks</span><span role="columnheader">HawkSight asks</span><span role="columnheader">Why it matters</span></div>
            ${CONTRAST.map(([a, b, why]) => html`<div class="hx-contrast-row" role="row">
              <span role="cell" class="hx-contrast-old">${a}</span>
              <span role="cell" class="hx-contrast-new">${b}</span>
              <span role="cell" class="hx-contrast-why">${why}</span>
            </div>`)}
          </div>
        </div>
      </section>

      <section class="hx-section hx-section-alt" id="attack-paths">
        <div class="container">
          ${label('02', 'Attack paths')}
          <h2 class="hx-h2">The ways in you may not know about yet.</h2>
          <p class="hx-sub">Every assessment is tested against a library of real attack paths, each traced to public incidents. Choose your industry to see the ones that hit organisations like yours hardest.</p>
          <div class="hx-chips" role="group" aria-label="Filter by industry">
            <button class="hx-chip" data-action="hx-industry" data-industry="all" aria-pressed="true">All industries</button>
            ${industries.map(f => html`<button class="hx-chip" data-action="hx-industry" data-industry="${f.id}" aria-pressed="false">${f.shortName}</button>`)}
          </div>
          <div id="hx-paths">${scenarioCards()}</div>
        </div>
      </section>

      <section class="hx-section">
        <div class="container">
          ${label('03', 'What you get')}
          <h2 class="hx-h2">Not a list of gaps. A picture of how you would be breached, and how to stop it.</h2>
          <div class="hx-grid-3">
            ${[
              ['Your open attack paths', 'Each attack path is drawn as a chain: getting in, taking control, spreading, being noticed, recovering. You see exactly which stage an attacker would get through, and why.'],
              ['The fixes that break the most paths', 'Priorities are set by how many real attacks a fix would stop, not by checklist order. One well-chosen control often closes several paths at once.'],
              ['Evidence leadership can rely on', 'A Cyber Health Score, risk exposure and confidence level, with assessor-validated evidence and results expressed against NIST CSF 2.0, ISO/IEC 27001 and others for your auditors.']
            ].map(([t, d]) => html`<div class="hx-feature"><h3>${t}</h3><p>${d}</p></div>`)}
          </div>
        </div>
      </section>

      <section class="hx-section hx-section-alt">
        <div class="container">
          ${label('04', 'How it works')}
          <h2 class="hx-h2">From questions to closed attack paths in four steps.</h2>
          <ol class="hx-steps">
            ${[
              ['Tell us who you are',
                'Your industry, size, the data you hold and the systems you run decide which attack paths are tested and how much each one matters to you.',
                'The attack paths that apply to you'],
              ['Answer with your team',
                'Each question shows how attackers use the gap it covers, and every answer level is described, so honest answers are consistent. Give each section to the person who knows it best and attach evidence as you go.',
                'Your team learns while answering'],
              ['See your attack paths',
                'Every path is rated Open, Partly defended or Defended, with the stage an attacker would get through. On assessor-led plans, HiQurate Ops verifies the evidence first.',
                'A report written for leadership'],
              ['Break the chains',
                'Each gap becomes an action with an owner and a due date, ordered by how many attack paths it closes. Reassess to show the paths you have shut.',
                'A tracked remediation plan']
            ].map(([t, d, out], i) => html`<li>
              <span class="hx-step">Step ${i + 1}</span>
              <h3>${t}</h3>
              <p>${d}</p>
              <div class="hx-step-out"><span>You get</span>${out}</div>
            </li>`)}
          </ol>
        </div>
      </section>

      <section class="hx-section" id="plans">
        <div class="container">
          ${label('05', 'Plans')}
          <h2 class="hx-h2">Choose how deep you go.</h2>
          <p class="hx-sub">Every plan uses the same attack paths and control library, so results stay comparable as you move from a first look to an ongoing programme.</p>
          <div class="hx-grid-3">
            ${PLANS.map(p => html`<div class="hx-plan ${p.featured ? 'hx-plan-featured' : ''}">
              <div class="hx-plan-top"><h3>${p.name}</h3>${p.featured ? html`<span class="hx-tag">Recommended</span>` : ''}</div>
              <div class="hx-plan-tag">${p.tag}</div>
              <ul>${p.points.map(x => html`<li>${x}</li>`)}</ul>
              ${p.sample ? html`<a class="hx-plan-link" href="${p.sample}">See a sample report ${icon('chevronRight')}</a>` : ''}
            </div>`)}
          </div>
        </div>
      </section>

      <section class="hx-section hx-section-alt">
        <div class="container hx-split">
          <div>${label('06', 'Your data')}<h2 class="hx-h2">Your weak points, treated as the sensitive data they are.</h2></div>
          <ul class="hx-list">
            <li><strong>Isolated by organisation.</strong> Access is checked on every request.</li>
            <li><strong>Encrypted evidence.</strong> Files are encrypted at rest and only available to your authorised users.</li>
            <li><strong>Tamper-evident reports.</strong> Issued reports cannot be altered; every sign-in and change is logged.</li>
            <li><strong>Readiness, not audit.</strong> HawkSight shows how you would hold up against real attacks and what to do about it. It is not a certification or audit opinion.</li>
          </ul>
        </div>
      </section>

      <section class="hx-cta">
        <div class="container hx-cta-inner">
          <h2>Find your open attack paths before an attacker does.</h2>
          <div class="btn-group"><a class="btn btn-lg hx-btn-accent" href="#/sample-report">See a sample report</a><a class="btn btn-lg hx-btn-ghost" href="https://www.hiqurateops.com" rel="noopener noreferrer" target="_blank">Talk to HiQurate Ops</a></div>
        </div>
      </section>`);

    API.get('/api/public/sample-report').then(sample => {
      const o = sample.result.overall;
      const t = sample.result.threats;
      const paths = t ? t.scenarios.filter(sc => sc.status !== 'unassessed') : [];
      const top = paths.filter(sc => sc.status !== 'defended').slice(0, 3);
      const breaker = t && t.breakers[0];
      setHtml('#hx-preview', html`
        <div class="hx-panel">
          <div class="hx-panel-head"><span>Attack paths</span><span>Sample hospital</span></div>
          ${t ? html`<div class="hx-panel-tally">
            <div class="hx-path-open"><strong>${t.summary.open}</strong><span>Open</span></div>
            <div class="hx-path-partial"><strong>${t.summary.partial}</strong><span>Partly defended</span></div>
            <div class="hx-path-defended"><strong>${t.summary.defended}</strong><span>Defended</span></div>
          </div>` : ''}
          <div class="hx-panel-block">
            <div class="hx-panel-sub">Most likely to succeed</div>
            ${top.map(sc => html`<div class="hx-panel-path"><span class="hx-path-badge ${PATH_BADGE[sc.status][1]}">${PATH_BADGE[sc.status][0]}</span><span>${sc.name}</span></div>`)}
          </div>
          ${breaker ? html`<div class="hx-panel-block">
            <div class="hx-panel-sub">Fix that breaks the most paths</div>
            <div class="hx-panel-fix"><strong>${breaker.controlName}</strong><span>Strengthens ${plural(breaker.scenarios.length, 'attack path')}</span></div>
          </div>` : ''}
          <div class="hx-panel-block hx-panel-foot">
            <div><span>Cyber health</span><strong>${o.healthScore}/100</strong></div>
            <div><span>Risk exposure</span><strong>${o.riskBand}</strong></div>
            <div><span>Confidence</span><strong>${o.confidence.label}</strong></div>
          </div>
        </div>`);
    }).catch(() => {});
  }, { public: true });

  on('action', 'noop', () => {});

  // ── Sign in ──
  function authLayout(content) {
    return html`
      <div class="auth-page">
        <div class="auth-aside">
          <div class="auth-mark" aria-hidden="true">${root.U.LOGO}</div>
          <a href="#/" aria-label="HawkSight home">${wordmark('by HiQurate Ops', 'dark')}</a>
          <div>
            <div class="eyebrow">Threat readiness</div>
            <h2>See which attack paths are open, close them, and show the progress.</h2>
            <p>Use the account provided by your organisation administrator or HiQurate assessor.</p>
          </div>
          <div class="small">Access is logged. Sessions end after 30 minutes of inactivity.</div>
        </div>
        <main class="auth-main" id="main"><div class="auth-inner"><a href="#/" class="auth-mobile-brand" aria-label="HawkSight home">${wordmark(null, 'light')}</a>${content}</div></main>
      </div>`;
  }

  App.route('/login', async () => {
    if (App.session && !App.session.user.mustChangePassword) return App.navigate(App.homePath());
    App.renderAuth(authLayout(html`
      <form class="auth-form stack" data-submit="login" novalidate>
        <div><h1>Sign in</h1><p class="muted">Enter your work email and password.</p></div>
        <div class="field"><label for="login-email">Email</label><input class="input" id="login-email" name="email" type="email" autocomplete="username" required></div>
        <div class="field"><label for="login-password">Password</label><input class="input" id="login-password" name="password" type="password" autocomplete="current-password" required></div>
        <div class="form-error" id="login-error" role="alert"></div>
        <button class="btn btn-primary btn-lg btn-block" type="submit">Sign in</button>
        <p class="small muted">Forgotten your password? Ask your organisation administrator to reset it.</p>
        <p class="small"><a href="#/">${icon('chevronLeft')} Back to HawkSight</a></p>
      </form>`));
    $('#login-email').focus();
  }, { public: true });

  on('submit', 'login', async form => {
    const data = formData(form);
    const err = $('#login-error');
    err.textContent = '';
    if (!data.email || !data.password) { err.textContent = 'Enter your email and password.'; return; }
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    try {
      App.session = await API.post('/api/auth/login', { email: data.email, password: data.password });
      await App.afterLogin();
      if (App.session.user.mustChangePassword) return App.navigate('/account/password');
      const next = App.pendingPath;
      App.pendingPath = null;
      App.navigate(next && next !== '/login' ? next : App.homePath());
    } catch (e) {
      err.textContent = e.message;
      btn.disabled = false;
    }
  });

  // ── Invitation acceptance ──
  App.route('/invite/:token', async ({ token }) => {
    let invite;
    try {
      invite = await API.get(`/api/invites/${encodeURIComponent(token)}`, { quiet: true });
    } catch (e) {
      App.renderAuth(authLayout(html`<div class="auth-form"><h1>Invitation unavailable</h1><p class="muted">${e.message}. Ask your administrator for a new invitation.</p><a class="btn" href="#/login">Go to sign in</a></div>`));
      return;
    }
    App.renderAuth(authLayout(html`
      <form class="auth-form stack" data-submit="accept-invite" data-token="${token}" novalidate>
        <div><h1>Join ${invite.organisation}</h1><p class="muted">You have been invited as <strong>${invite.roleLabel}</strong> using ${invite.email}.</p></div>
        <div class="field"><label for="inv-name">Full name</label><input class="input" id="inv-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="inv-pw">Create a password</label><input class="input" id="inv-pw" name="password" type="password" autocomplete="new-password" required>
          <span class="hint">At least 12 characters, using three of: lower-case, upper-case, numbers, symbols.</span></div>
        <div class="field"><label for="inv-pw2">Confirm password</label><input class="input" id="inv-pw2" name="confirm" type="password" autocomplete="new-password" required></div>
        <div class="form-error" id="invite-error" role="alert"></div>
        <button class="btn btn-primary btn-lg btn-block" type="submit">Create account</button>
      </form>`));
  }, { public: true });

  on('submit', 'accept-invite', async form => {
    const data = formData(form);
    const err = $('#invite-error');
    err.textContent = '';
    if (data.password !== data.confirm) { err.textContent = 'Passwords do not match.'; return; }
    try {
      App.session = await API.post('/api/invites/accept', { token: form.dataset.token, name: data.name, password: data.password });
      await App.afterLogin();
      UI.toast('Welcome to HawkSight', 'success');
      App.navigate(App.homePath());
    } catch (e) {
      err.textContent = e.message;
    }
  });

  // ── Change password ──
  App.route('/account/password', async () => {
    const forced = App.session.user.mustChangePassword;
    const form = html`
      <form class="${forced ? 'auth-form' : 'card card-body'} stack" data-submit="change-password" novalidate style="${forced ? '' : 'max-width:460px'}">
        ${forced ? html`<div><h1>Set a new password</h1><p class="muted">Your account uses a temporary password. Choose a new one to continue.</p></div>` : ''}
        <div class="field"><label for="pw-current">${forced ? 'Temporary password' : 'Current password'}</label><input class="input" id="pw-current" name="currentPassword" type="password" autocomplete="current-password" required></div>
        <div class="field"><label for="pw-new">New password</label><input class="input" id="pw-new" name="newPassword" type="password" autocomplete="new-password" required>
          <span class="hint">At least 12 characters, using three of: lower-case, upper-case, numbers, symbols. Must not contain your email name.</span></div>
        <div class="field"><label for="pw-confirm">Confirm new password</label><input class="input" id="pw-confirm" name="confirm" type="password" autocomplete="new-password" required></div>
        <div class="form-error" id="pw-error" role="alert"></div>
        <div class="row"><button class="btn btn-primary" type="submit">Update password</button>${forced ? html`<button class="btn btn-ghost" type="button" data-action="logout">Sign out</button>` : ''}</div>
      </form>`;
    if (forced) App.renderAuth(authLayout(form));
    else App.renderApp(html`<div class="page page-narrow"><div class="page-head"><div><h1>Change password</h1><div class="sub">Changing your password signs you out of other devices.</div></div></div>${form}</div>`);
  });

  on('submit', 'change-password', async form => {
    const data = formData(form);
    const err = $('#pw-error');
    err.textContent = '';
    if (data.newPassword !== data.confirm) { err.textContent = 'New passwords do not match.'; return; }
    try {
      App.session = await API.post('/api/auth/change-password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      await App.afterLogin();
      UI.toast('Password updated', 'success');
      App.navigate(App.homePath());
    } catch (e) {
      err.textContent = e.message;
    }
  });

  // ── Methodology (assessor console only) ──
  App.route('/methodology', async () => {
    const m = await Content.methodology();
    const tierRows = m.tiers;
    const sev = m.severityMatrix;
    const body = html`
      <div class="container" style="padding-top:40px;padding-bottom:64px;max-width:920px">
        <div class="eyebrow">Methodology</div>
        <h1 style="font-size:30px;margin:8px 0 12px">How HawkSight scores an assessment</h1>
        <p class="muted" style="font-size:15px">Scoring model version ${m.scoringModelVersion}, configuration version ${m.configVersion}. This page documents how answers become scores, findings and priorities. The same calculation runs in the browser and on the server; issued reports are recalculated on the server and frozen.</p>

        <div class="card mt-24"><div class="card-body stack">
          <h2>1. Answers</h2>
          <p>Each question is answered on its template's scale. The answer is converted to a fraction of full implementation: <code>(answer − lowest option) ÷ (highest option − lowest option)</code>. On a four-point scale, "Not implemented" scores 0, "Partially" 0.33, "Largely" 0.67 and "Fully" 1.</p>
          <div class="table-wrap"><table class="table table-compact">
            <thead><tr><th>Answer state</th><th>Effect on score</th><th>Effect on confidence</th></tr></thead>
            <tbody>
              <tr><td>Scale answer</td><td>Fraction of full implementation</td><td>Depends on evidence and validation</td></tr>
              <tr><td>Not applicable</td><td>Excluded from numerator and denominator</td><td>None</td></tr>
              <tr><td>Unknown</td><td>Scored as not implemented</td><td>Reduces confidence</td></tr>
              <tr><td>Planned</td><td>Scored as not implemented; shown on the roadmap</td><td>None</td></tr>
            </tbody></table></div>

          <h2>2. Control criticality and weights</h2>
          <p>Every question maps to one of ${m.controlCount} canonical HawkSight controls, which sets its criticality. Earned points are the answer fraction multiplied by the weight.</p>
          <div class="table-wrap"><table class="table table-compact">
            <thead><tr><th>Criticality</th><th class="num">Weight</th><th>Meaning</th></tr></thead>
            <tbody>${tierRows.map(t => html`<tr><td class="strong">${t.label}</td><td class="num">${t.weight}</td><td>${t.description}</td></tr>`)}</tbody></table></div>

          <h2>3. Domain and overall scores</h2>
          <p>A domain score is earned points ÷ possible points for answered, applicable questions in that domain, as a percentage. The overall Cyber Health Score is the weighted average of domain scores. Domains are weighted equally unless a configured weighting (which must total 100%) is published for the template. Unanswered questions do not count towards the score but reduce completion and confidence.</p>

          <h2>4. Critical-control gating</h2>
          <p>A critical control answered below one third of full implementation, or answered Unknown or Planned, is a critical failure. With one or two failures the Cyber Health Score is capped at ${m.gating.oneFailureCap}; with ${m.gating.multiFailureCount} or more it is capped at ${m.gating.multiFailureCap}. The uncapped score is shown alongside so the effect is visible.</p>

          <h2>5. Maturity levels</h2>
          <div class="table-wrap"><table class="table table-compact">
            <thead><tr><th>Level</th><th>Score range</th><th>Description</th></tr></thead>
            <tbody>${m.maturityLevels.map((l, i) => html`<tr><td class="strong">${l.level}. ${l.name}</td><td class="nowrap">${l.min}–${i < m.maturityLevels.length - 1 ? m.maturityLevels[i + 1].min - 1 : 100}</td><td>${l.description}</td></tr>`)}</tbody></table></div>

          <h2>6. Findings and severity</h2>
          <p>Every answered control below full implementation becomes a finding. Gap size: a third of the scale or less is a major gap, two thirds or more is a minor gap, otherwise partial. Severity combines the control's criticality with the gap size.</p>
          <div class="table-wrap"><table class="table table-compact">
            <thead><tr><th>Criticality</th><th>Major gap</th><th>Partial gap</th><th>Minor gap</th></tr></thead>
            <tbody>${Object.keys(sev).map(t => html`<tr><td class="strong">${t[0].toUpperCase() + t.slice(1)}</td>${['major', 'partial', 'minor'].map(g => html`<td>${root.U.severityBadge(sev[t][g])}</td>`)}</tr>`)}</tbody></table></div>
          <p>Where the organisation's risk context multiplier is 1.25 or more, findings on critical controls are raised by one level, but never to Critical, which is reserved for critical controls that are essentially absent.</p>
          <div class="table-wrap"><table class="table table-compact"><thead><tr><th>Severity</th><th>Target timeframe</th></tr></thead>
            <tbody>${Object.keys(m.severityTimeframes).map(s => html`<tr><td>${root.U.severityBadge(s)}</td><td>${m.severityTimeframes[s]}</td></tr>`)}</tbody></table></div>

          <h2>7. Risk exposure</h2>
          <p>Risk Exposure is reported separately from Cyber Health. It starts from the control gap (100 − health) × 0.85, adds up to 15 points for the concentration of critical and high findings, and is adjusted by half of the organisational risk context. Context factors include sensitive data (health, payment, financial, children's or biometric), regulatory exposure, recent incidents, organisation size, operational technology, customer-facing services and business criticality. Bands: Low below ${m.riskBands.low}, Moderate below ${m.riskBands.moderate}, High below ${m.riskBands.high}, otherwise Severe.</p>

          <h2>8. Score confidence</h2>
          <p>Confidence combines completion (35%), the strength of support for critical and high controls (50%) and the share of non-Unknown answers (15%). Support levels count as: ${Object.values(m.confidenceLevels).map(c => `${c.label.toLowerCase()} ${c.weight}`).join(', ')}. Attaching evidence to a self-attested answer counts as evidence-supported. High confidence requires a score of 75 or more and evidence quality of at least 60%; assessments under half complete are always Low.</p>

          <h2>9. Reference frameworks</h2>
          <div class="table-wrap"><table class="table table-compact">
            <thead><tr><th>Framework</th><th>Version</th><th>Publisher</th></tr></thead>
            <tbody>${m.referenceFrameworks.map(f => html`<tr><td>${f.name}</td><td>${f.version}</td><td>${f.publisher}</td></tr>`)}</tbody></table></div>
          <p class="small muted">Mappings are indicative crosswalks maintained by HiQurate Ops for gap analysis. They do not establish compliance or certification.</p>

          <h2>10. Scope and limitations</h2>
          <ul>
            <li>Results reflect the answers and evidence provided. Self-attested answers are not verified unless an assessor validates them.</li>
            <li>An assessment is a point-in-time view. Reports older than the configured period are marked as stale.</li>
            <li>AI assistance is advisory and never alters answers, scores or findings.</li>
            <li>Benchmarks are shown only when enough organisations contribute; demonstration data is excluded.</li>
          </ul>
        </div></div>
      </div>`;
    App.renderApp(html`<div class="page" style="padding:0">${body}</div>`);
  }, { staff: true });
})(window);
