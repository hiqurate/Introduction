// ============================================
// CyberShield Assessments — Main Application
// SPA Router & Page Renderers
// ============================================

class CyberShieldApp {
  constructor() {
    this.currentPage = 'home';
    this.currentFramework = null;
    this.questionnaire = null;
    this.reportGen = null;
    this.currentUser = null;
    this.init();
  }

  async init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('scroll', () => this.handleScroll());
    await this.checkAuth();
    this.initCyberGrid();
    this.animateStats();
  }

  async checkAuth() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        this.currentUser = await res.json();
        document.getElementById('nav-logout-btn').style.display = 'inline-block';
        if (this.currentUser.user.role === 'admin') {
          document.getElementById('nav-admin-link').style.display = 'inline-block';
        }
        this.handleRoute();
      } else {
        this.showLogin();
      }
    } catch (e) {
      this.showLogin();
    }
  }

  async login(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        window.location.hash = 'home';
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || 'Login failed');
      }
    } catch(e) {
      alert('Login error');
    }
  }

  async logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.hash = 'login';
    window.location.reload();
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const parts = hash.split('/');

    if (!this.currentUser && hash !== 'login') {
      window.location.hash = 'login';
      return;
    }

    if (hash === 'login') {
      this.showLogin();
    } else if (hash === 'admin' && this.currentUser && this.currentUser.user.role === 'admin') {
      this.showAdminDashboard();
    } else if (parts[0] === 'framework' && parts[1]) {
      this.showFramework(parts[1]);
    } else if (parts[0] === 'setup' && parts[1]) {
      this.showAssessmentSetup(parts[1]);
    } else if (parts[0] === 'assess' && parts[1]) {
      this.startAssessment(parts[1]);
    } else if (parts[0] === 'report' && parts[1]) {
      this.showReport(parts[1]);
    } else if (parts[0] === 'assessments') {
      this.showAssessments();
    } else {
      this.showHome();
    }
  }

  handleScroll() {
    const header = document.querySelector('.header');
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }
  }

  // ── Navigation ──
  navigate(page, id) {
    if (id) {
      window.location.hash = `${page}/${id}`;
    } else {
      window.location.hash = page;
    }
  }

  updateNav(active) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === active);
    });
  }

  // ── Home Page ──
  showHome() {
    this.currentPage = 'home';
    this.updateNav('home');
    const content = document.getElementById('app-content');

    let totalQuestions = 0;
    
    const assignedFrameworks = this.currentUser.user.role === 'admin' ? FRAMEWORK_LIST : FRAMEWORK_LIST.filter(id => this.currentUser.assignments.includes(id));
    const assignedCompliances = this.currentUser.user.role === 'admin' ? COMPLIANCE_LIST : COMPLIANCE_LIST.filter(id => this.currentUser.assignments.includes(id));

    [...assignedFrameworks, ...assignedCompliances].forEach(fwId => {
      totalQuestions += FRAMEWORKS[fwId].totalQuestions || 0;
    });

    content.innerHTML = `
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-glow cyan"></div>
        <div class="hero-glow purple"></div>
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="hero-content">
          <div class="hero-badge">
            <span class="pulse-dot"></span>
            Cybersecurity Assessment Platform
          </div>
          <h1>Assess. <span class="gradient-text">Protect.</span> Fortify.</h1>
          <p class="hero-subtitle">Evaluate your organization's cybersecurity readiness across industry-leading frameworks. Get actionable insights with interactive assessments and comprehensive reports.</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="document.getElementById('frameworks-section').scrollIntoView({behavior:'smooth'})">Explore Frameworks ↓</button>
            <button class="btn btn-secondary btn-lg" onclick="document.getElementById('how-it-works').scrollIntoView({behavior:'smooth'})">How It Works</button>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card animate-in">
              <div class="stat-number" data-count="${FRAMEWORK_LIST.length}">0</div>
              <div class="stat-label">Security Frameworks</div>
            </div>
            <div class="stat-card animate-in animate-delay-1">
              <div class="stat-number" data-count="${COMPLIANCE_LIST.length}">0</div>
              <div class="stat-label">Industry Modules</div>
            </div>
            <div class="stat-card animate-in animate-delay-2">
              <div class="stat-number" data-count="${totalQuestions}">0</div>
              <div class="stat-label">Assessment Questions</div>
            </div>
            <div class="stat-card animate-in animate-delay-3">
              <div class="stat-number" data-count="100">0</div>
              <div class="stat-label">% Client-Side Privacy</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Frameworks Section -->
      <section class="section" id="frameworks-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">🏗️ Security Frameworks</span>
            <h2>Best-Practice <span class="gradient-text">Frameworks</span></h2>
            <p>Voluntary, industry-standard frameworks that provide structured methodologies for managing cybersecurity risk and improving your security posture.</p>
          </div>
          <div class="framework-grid">
            ${assignedFrameworks.length === 0 ? '<p>No frameworks assigned to you yet.</p>' : ''}
            ${assignedFrameworks.map((id, idx) => {
              const fw = FRAMEWORKS[id];
              const saved = localStorage.getItem(`cybershield_answers_${id}`);
              const progress = saved ? Object.keys(JSON.parse(saved)).length : 0;
              return `
              <div class="framework-card animate-in animate-delay-${idx % 4 + 1}" onclick="app.navigate('framework', '${id}')" id="card-${id}">
                <div class="framework-card-icon" style="background:${fw.colorGlow};color:${fw.color}">${fw.icon}</div>
                <h3>${fw.shortName}</h3>
                <p>${fw.description}</p>
                <div class="framework-card-meta">
                  <span><i>📝</i> ${fw.totalQuestions} questions</span>
                  <span><i>⏱️</i> ${fw.estimatedTime}</span>
                  ${progress > 0 ? `<span style="color:var(--color-success)"><i>✓</i> In progress</span>` : ''}
                </div>
                <div class="framework-card-type"><span class="type-badge type-framework">Framework</span></div>
              </div>`;
            }).join('')}
          </div>

          <div class="section-header" style="margin-top:64px">
            <span class="section-tag">🏢 Industry Modules</span>
            <h2>Industry-Specific <span class="gradient-text">Assessments</span></h2>
            <p>AI-powered risk assessments tailored to your specific sector, focusing on key threats, required controls, and realistic business impact.</p>
          </div>
          <div class="framework-grid">
            ${assignedCompliances.length === 0 ? '<p>No industry modules assigned to you yet.</p>' : ''}
            ${assignedCompliances.map((id, idx) => {
              const fw = FRAMEWORKS[id];
              const saved = localStorage.getItem(`cybershield_answers_${id}`);
              const progress = saved ? Object.keys(JSON.parse(saved)).length : 0;
              return `
              <div class="framework-card animate-in animate-delay-${idx % 4 + 1}" onclick="app.navigate('framework', '${id}')" id="card-${id}">
                <div class="framework-card-icon" style="background:${fw.colorGlow};color:${fw.color}">${fw.icon}</div>
                <h3>${fw.shortName}</h3>
                <p>${fw.description}</p>
                <div class="framework-card-meta">
                  <span><i>📝</i> ${fw.totalQuestions} questions</span>
                  <span><i>⏱️</i> ${fw.estimatedTime}</span>
                  ${progress > 0 ? `<span style="color:var(--color-success)"><i>✓</i> In progress</span>` : ''}
                </div>
                <div class="framework-card-type"><span class="type-badge type-compliance">Industry Module</span></div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="section" id="how-it-works">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">📋 Process</span>
            <h2>How It <span class="gradient-text">Works</span></h2>
            <p>Complete your cybersecurity assessment in four simple steps.</p>
          </div>
          <div class="stats-grid" style="max-width: 1000px; margin: 0 auto">
            <div class="stat-card" style="text-align:left;padding:32px">
              <div style="font-size:2rem;margin-bottom:12px">1️⃣</div>
              <h4 style="margin-bottom:8px">Select Framework</h4>
              <p style="color:var(--text-secondary);font-size:0.9rem">Choose from 8 industry-standard cybersecurity frameworks based on your compliance needs.</p>
            </div>
            <div class="stat-card" style="text-align:left;padding:32px">
              <div style="font-size:2rem;margin-bottom:12px">2️⃣</div>
              <h4 style="margin-bottom:8px">Answer Questions</h4>
              <p style="color:var(--text-secondary);font-size:0.9rem">Complete the interactive questionnaire at your own pace. Your progress auto-saves.</p>
            </div>
            <div class="stat-card" style="text-align:left;padding:32px">
              <div style="font-size:2rem;margin-bottom:12px">3️⃣</div>
              <h4 style="margin-bottom:8px">Review Results</h4>
              <p style="color:var(--text-secondary);font-size:0.9rem">Get an interactive report with scores, charts, gap analysis, and risk heat maps.</p>
            </div>
            <div class="stat-card" style="text-align:left;padding:32px">
              <div style="font-size:2rem;margin-bottom:12px">4️⃣</div>
              <h4 style="margin-bottom:8px">Take Action</h4>
              <p style="color:var(--text-secondary);font-size:0.9rem">Download your PDF report with prioritized recommendations and improvement roadmap.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <p>HawkSight Assessments • Built for comprehensive cybersecurity readiness evaluation</p>
          <p style="margin-top:8px;font-size:0.8rem">All assessments run locally in your browser. AI-powered remediation is provided by Hiqurates.</p>
        </div>
      </footer>`;

    this.animateStats();
  }

  showLogin() {
    this.currentPage = 'login';
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById('nav-logout-btn').style.display = 'none';
    document.getElementById('nav-admin-link').style.display = 'none';
    
    const content = document.getElementById('app-content');
    content.innerHTML = `
      <section class="section flex-center" style="min-height: 80vh">
        <div class="card" style="width: 100%; max-width: 400px; padding: 32px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; position: relative; z-index: 10;">
          <h2 style="text-align:center;margin-bottom:8px">Welcome to <span class="gradient-text">HawkSight</span></h2>
          <p style="text-align:center;color:var(--text-secondary);margin-bottom:24px">Sign in to access your assessments</p>
          
          <form onsubmit="event.preventDefault(); app.login(document.getElementById('login-email').value, document.getElementById('login-password').value)">
            <div class="form-group" style="margin-bottom: 16px">
              <label>Email Address</label>
              <input type="email" id="login-email" required class="form-control" style="width:100%;padding:12px;margin-top:8px;background:var(--bg-dark);border:1px solid var(--border-color);color:white;border-radius:8px;">
            </div>
            <div class="form-group" style="margin-bottom: 24px">
              <label>Password</label>
              <input type="password" id="login-password" required class="form-control" style="width:100%;padding:12px;margin-top:8px;background:var(--bg-dark);border:1px solid var(--border-color);color:white;border-radius:8px;">
            </div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Sign In</button>
          </form>
        </div>
      </section>
    `;
  }

  async showAdminDashboard() {
    this.currentPage = 'admin';
    this.updateNav('admin');
    const content = document.getElementById('app-content');
    content.innerHTML = await adminDashboard.render();
  }

  // ── Framework Detail Page ──
  showFramework(frameworkId) {
    this.currentPage = 'framework';
    this.currentFramework = frameworkId;
    this.updateNav('frameworks');
    const fw = FRAMEWORKS[frameworkId];
    const data = this.getFrameworkData(frameworkId);
    const content = document.getElementById('app-content');
    const saved = localStorage.getItem(`cybershield_answers_${frameworkId}`);
    const answeredCount = saved ? Object.keys(JSON.parse(saved)).length : 0;
    const hasProgress = answeredCount > 0;

    let totalQ = 0;
    data.modules.forEach(m => m.categories.forEach(c => { totalQ += c.questions.length; }));

    content.innerHTML = `
      <div class="framework-detail">
        <div class="container">
          <div class="back-link" onclick="app.navigate('home')">← Back to Frameworks</div>

          <div class="framework-banner">
            <div class="framework-banner-content">
              <div class="framework-banner-icon" style="background:${fw.colorGlow};color:${fw.color}">${fw.icon}</div>
              <div class="framework-banner-info">
                <h1>${fw.name}</h1>
                <p>${fw.longDescription}</p>
                <div class="framework-tags">
                  ${fw.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                  <span class="type-badge ${fw.type === 'framework' ? 'type-framework' : 'type-compliance'}">${fw.type === 'framework' ? '🏗️ Framework' : '🏢 Industry Module'}</span>
                </div>
                <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
                  <span class="tag" style="border-color:var(--accent-cyan);color:var(--accent-cyan)">📝 ${totalQ} Questions</span>
                  <span class="tag" style="border-color:var(--accent-cyan);color:var(--accent-cyan)">⏱️ ${fw.estimatedTime}</span>
                  <span class="tag" style="border-color:var(--accent-cyan);color:var(--accent-cyan)">📊 ${fw.scoringModel}</span>
                </div>
                <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap">
                  <button class="btn btn-primary btn-lg" onclick="app.startAssessment('${frameworkId}')">${hasProgress ? '▶ Continue Assessment' : '🚀 Start Assessment'}</button>
                  ${hasProgress ? `
                    <button class="btn btn-success" onclick="app.showReport('${frameworkId}')">📊 View Report (${Math.round(answeredCount/totalQ*100)}%)</button>
                    <button class="btn btn-danger btn-sm" onclick="if(confirm('This will clear all your answers. Are you sure?')){localStorage.removeItem('cybershield_answers_${frameworkId}');app.showFramework('${frameworkId}');}">Reset</button>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>

          <div class="section-header" style="margin-top:48px">
            <h2>Assessment <span class="gradient-text">Modules</span></h2>
            <p>This assessment is organized into ${data.modules.length} modules covering all key areas.</p>
          </div>

          <div class="module-grid">
            ${data.modules.map((mod, idx) => {
              let qCount = 0;
              mod.categories.forEach(c => { qCount += c.questions.length; });
              return `
              <div class="module-card animate-in animate-delay-${idx % 4 + 1}">
                <div class="module-number">${idx + 1}</div>
                <h4>${mod.icon || ''} ${mod.name}</h4>
                <p>${mod.description}</p>
                <div class="question-count">
                  ${mod.categories.length} categories • ${qCount} questions
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;

    window.scrollTo(0, 0);
  }

  // ── Assessment Setup (org details before questionnaire) ──
  showAssessmentSetup(frameworkId) {
    this.currentPage = 'setup';
    this.currentFramework = frameworkId;
    this.updateNav('frameworks');
    const fw = FRAMEWORKS[frameworkId];
    const content = document.getElementById('app-content');
    content.innerHTML = OrgSettings.renderSetupPage(frameworkId, fw);
    window.location.hash = `setup/${frameworkId}`;
    window.scrollTo(0, 0);
  }

  submitAssessmentSetup(frameworkId) {
    if (!OrgSettings.saveFromSetupForm()) return;
    this.launchQuestionnaire(frameworkId);
  }

  // ── Questionnaire Page ──
  startAssessment(frameworkId) {
    if (!OrgSettings.hasRequired()) {
      this.showAssessmentSetup(frameworkId);
      return;
    }
    this.launchQuestionnaire(frameworkId);
  }

  launchQuestionnaire(frameworkId) {
    this.currentPage = 'assess';
    this.currentFramework = frameworkId;
    this.updateNav('frameworks');
    this.questionnaire = new QuestionnaireEngine(frameworkId);
    window.location.hash = `assess/${frameworkId}`;
    this.renderQuestionnaire();
    window.scrollTo(0, 0);
  }

  renderQuestionnaire() {
    if (!this.questionnaire) return;
    const content = document.getElementById('app-content');

    content.innerHTML = `
      <div class="container">
        <div class="questionnaire-layout">
          <aside class="questionnaire-sidebar">
            ${this.questionnaire.renderSidebar()}
          </aside>
          <main class="question-area">
            ${this.questionnaire.renderQuestion()}
          </main>
        </div>
      </div>`;
  }

  selectAnswer(questionId, value, element) {
    this.questionnaire.answerQuestion(questionId, value);

    // Update UI
    const options = element.closest('.answer-options');
    options.querySelectorAll('.answer-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    // Show auto-save indicator
    const indicator = document.getElementById('autosave-indicator');
    if (indicator) {
      indicator.classList.add('visible');
      setTimeout(() => indicator.classList.remove('visible'), 2000);
    }

    // Update sidebar progress
    const sidebar = document.querySelector('.questionnaire-sidebar');
    if (sidebar) {
      sidebar.innerHTML = this.questionnaire.renderSidebar();
    }
  }

  nextQuestion() {
    if (!this.questionnaire) return;
    const q = this.questionnaire.getCurrentQuestion();

    if (this.questionnaire.currentFlatIndex === this.questionnaire.getTotalQuestions() - 1) {
      if (this.questionnaire.isComplete()) {
        this.showReport(this.currentFramework);
      } else {
        // Show completion with partial results option
        const content = document.querySelector('.question-area');
        if (content) {
          content.innerHTML = `
            <div class="completion-screen">
              <div class="completion-icon" style="background:rgba(0, 212, 255, 0.15);border-color:var(--accent-cyan)">📊</div>
              <h2>Assessment Review</h2>
              <p>You've completed ${this.questionnaire.getAnsweredCount()} of ${this.questionnaire.getTotalQuestions()} questions (${this.questionnaire.getProgress()}%). You can generate a partial report or continue answering remaining questions.</p>
              <div style="display:flex;gap:16px;justify-content:center;margin-top:24px;flex-wrap:wrap">
                <button class="btn btn-primary btn-lg" onclick="app.showReport('${this.currentFramework}')">📊 Generate Report</button>
                <button class="btn btn-secondary" onclick="app.questionnaire.goToQuestion(app.questionnaire.findFirstUnanswered()); app.renderQuestionnaire();">Continue Answering</button>
              </div>
            </div>`;
        }
      }
      return;
    }

    this.questionnaire.next();
    this.renderQuestionnaire();
  }

  prevQuestion() {
    if (!this.questionnaire) return;
    this.questionnaire.prev();
    this.renderQuestionnaire();
  }

  // ── Report Page ──
  showReport(frameworkId) {
    this.currentPage = 'report';
    this.currentFramework = frameworkId;
    this.updateNav('frameworks');
    window.location.hash = `report/${frameworkId}`;

    if (!this.questionnaire || this.questionnaire.frameworkId !== frameworkId) {
      this.questionnaire = new QuestionnaireEngine(frameworkId);
    }

    const scores = this.questionnaire.calculateScores();
    this.reportGen = new ReportGenerator(frameworkId, scores, this.questionnaire);
    const content = document.getElementById('app-content');
    content.innerHTML = `<div class="container">${this.reportGen.render()}</div>`;

    // Initialize charts after render
    setTimeout(() => this.reportGen.initCharts(), 100);
    window.scrollTo(0, 0);
  }

  // ── Assessments Landing Page ──
  showAssessments() {
    this.currentPage = 'assessments';
    this.updateNav('assessments');
    const content = document.getElementById('app-content');

    const assignedFrameworks = this.currentUser.user.role === 'admin' ? FRAMEWORK_LIST : FRAMEWORK_LIST.filter(id => this.currentUser.assignments.includes(id));
    const assignedCompliances = this.currentUser.user.role === 'admin' ? COMPLIANCE_LIST : COMPLIANCE_LIST.filter(id => this.currentUser.assignments.includes(id));

    content.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">🏗️ Security Frameworks</span>
            <h2>Framework <span class="gradient-text">Assessments</span></h2>
            <p>Start or continue voluntary framework-based assessments to evaluate your security posture.</p>
          </div>

          <div class="framework-grid">
            ${assignedFrameworks.length === 0 ? '<p>No frameworks assigned.</p>' : ''}
            ${assignedFrameworks.map((id, idx) => {
              const fw = FRAMEWORKS[id];
              const saved = localStorage.getItem(`cybershield_answers_${id}`);
              const progress = saved ? Object.keys(JSON.parse(saved)).length : 0;
              return `
                <div class="framework-card animate-in animate-delay-${idx % 4 + 1}" id="assess-card-${id}">
                  <div class="framework-card-icon" style="background:${fw.colorGlow};color:${fw.color}">${fw.icon}</div>
                  <h3>${fw.shortName}</h3>
                  <p>${fw.description}</p>
                  <div class="framework-card-meta">
                    <span><i>📝</i> ${fw.totalQuestions} questions</span>
                    <span><i>⏱️</i> ${fw.estimatedTime}</span>
                  </div>
                  <div class="framework-card-type"><span class="type-badge type-framework">Framework</span></div>
                  <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
                    <button class="btn btn-primary" onclick="app.startAssessment('${id}')">${progress > 0 ? 'Continue' : 'Start'} Assessment</button>
                    <button class="btn btn-secondary" onclick="app.showFramework('${id}')">Details</button>
                  </div>
                </div>`;
            }).join('')}
          </div>

          <div class="section-header" style="margin-top:64px">
            <span class="section-tag">🏢 Industry Modules</span>
            <h2>Industry <span class="gradient-text">Assessments</span></h2>
            <p>Assess your organization's adherence to industry-specific risk mitigation standards.</p>
          </div>

          <div class="framework-grid">
            ${assignedCompliances.length === 0 ? '<p>No industry modules assigned.</p>' : ''}
            ${assignedCompliances.map((id, idx) => {
              const fw = FRAMEWORKS[id];
              const saved = localStorage.getItem(`cybershield_answers_${id}`);
              const progress = saved ? Object.keys(JSON.parse(saved)).length : 0;
              return `
                <div class="framework-card animate-in animate-delay-${idx % 4 + 1}" id="assess-card-${id}">
                  <div class="framework-card-icon" style="background:${fw.colorGlow};color:${fw.color}">${fw.icon}</div>
                  <h3>${fw.shortName}</h3>
                  <p>${fw.description}</p>
                  <div class="framework-card-meta">
                    <span><i>📝</i> ${fw.totalQuestions} questions</span>
                    <span><i>⏱️</i> ${fw.estimatedTime}</span>
                  </div>
                  <div class="framework-card-type"><span class="type-badge type-compliance">Industry Module</span></div>
                  <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
                    <button class="btn btn-primary" onclick="app.startAssessment('${id}')">${progress > 0 ? 'Continue' : 'Start'} Assessment</button>
                    <button class="btn btn-secondary" onclick="app.showFramework('${id}')">Details</button>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>
      </section>`;

    window.scrollTo(0, 0);
  }

  // ── Helpers ──
  getFrameworkData(id) {
    const map = {
      nist: typeof NIST_DATA !== 'undefined' ? NIST_DATA : null,
      soc: typeof SOC_DATA !== 'undefined' ? SOC_DATA : null,
      retail: typeof RETAIL_DATA !== 'undefined' ? RETAIL_DATA : null,
      healthcare: typeof HEALTHCARE_DATA !== 'undefined' ? HEALTHCARE_DATA : null,
      fintech: typeof FINTECH_DATA !== 'undefined' ? FINTECH_DATA : null,
      manufacturing: typeof MANUFACTURING_DATA !== 'undefined' ? MANUFACTURING_DATA : null,
      education: typeof EDUCATION_DATA !== 'undefined' ? EDUCATION_DATA : null,
      itservices: typeof ITSERVICES_DATA !== 'undefined' ? ITSERVICES_DATA : null,
      hospitality: typeof HOSPITALITY_DATA !== 'undefined' ? HOSPITALITY_DATA : null,
      logistics: typeof LOGISTICS_DATA !== 'undefined' ? LOGISTICS_DATA : null,
      professional: typeof PROFESSIONAL_DATA !== 'undefined' ? PROFESSIONAL_DATA : null
    };
    return map[id];
  }

  animateStats() {
    setTimeout(() => {
      document.querySelectorAll('.stat-number[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        let current = 0;
        const increment = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current = Math.min(current + increment, target);
          el.textContent = current;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          }
        }, 30);
      });
    }, 500);
  }

  initCyberGrid() {
    // Subtle floating particle effect
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('cyber-bg');
    if (!container) return;
    container.appendChild(canvas);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.05 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };
    animate();
  }

  toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    if (nav) nav.classList.toggle('mobile-open');
  }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new CyberShieldApp();
});
