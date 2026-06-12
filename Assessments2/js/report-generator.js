// ============================================
// Hiqurates — Report Generator
// Formal document-style UI aligned with PDF export
// ============================================

class ReportGenerator {
  constructor(frameworkId, scores, questionnaire) {
    this.frameworkId = frameworkId;
    this.framework = FRAMEWORKS[frameworkId];
    this.scores = scores;
    this.questionnaire = questionnaire;
    this.charts = [];
  }

  getFindings() {
    const orgSettings = OrgSettings.get();
    let findings = this.questionnaire
      ? this.questionnaire.buildFindings(orgSettings)
      : { rows: [], sections: [], priorityCounts: { high: 0, medium: 0, low: 0, advisory: 0 } };
    return aiService.applyCachedEnrichment(this.frameworkId, findings);
  }

  render() {
    const { overall, modules } = this.scores;
    const scoreClass = getScoreClass(overall.percentage);
    const scoreLabel = getScoreLabel(overall.percentage);
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const orgSettings = OrgSettings.get();
    const findings = this.getFindings();
    const counts = findings.priorityCounts;
    const isAdmin = app.currentUser?.user?.role === 'admin';

    let html = `
      <div class="report-page">
        <div class="back-link" onclick="app.showFramework('${this.frameworkId}')">← Back to ${this.framework.shortName}</div>

        ${window.adminViewingUserReport ? `
        <div style="background: var(--accent-pink); color: white; padding: 12px; text-align: center; border-radius: 8px; margin-bottom: 24px; font-weight: bold;">
          Viewing as Admin: Read-Only User Report (User ID: ${window.adminViewingUserReport.userId})
        </div>` : ''}
        <div class="report-header">
          <h1>${this.framework.name}</h1>
          <p class="report-meta">Assessment Report • Generated on ${date}</p>
          <div class="report-actions">
            <button class="btn btn-primary" id="download-pdf-btn" onclick="app.reportGen.exportPDF(event)">Download PDF Report</button>
            ${!window.adminViewingUserReport ? `<button class="btn btn-secondary" onclick="app.startAssessment('${this.frameworkId}')">Retake Assessment</button>` : ''}
          </div>
        </div>

        ${!window.adminViewingUserReport ? OrgSettings.renderSettingsBar() : ''}

        <div id="report-content" class="formal-report-doc">
          ${this.renderFormalCover(orgSettings, date, overall, scoreClass, scoreLabel)}
          ${this.renderExecutiveSection(overall, modules, counts)}
          ${this.renderCriticalFindingsSection(findings)}
          ${this.renderModuleScoresSection(modules)}
          ${isAdmin ? this.renderFindingsSection(findings) : ''}
          ${this.renderAiSection()}
        </div>
      </div>`;

    return html;
  }

  renderFormalCover(org, date, overall, scoreClass, scoreLabel) {
    const orgName = org.organizationName || 'Organization';
    const footprint = org.employeeCount ? `${org.employeeCount} Employees • ${org.officeLocations} Offices` : '';
    return `
      <div class="formal-cover">
        <div class="formal-cover-top">
          <span class="formal-brand">Hiqurates</span>
          <span class="formal-cover-tag">Security & Compliance Assessment</span>
        </div>
        <h2 class="formal-cover-title">${this.escapeHtml(this.framework.name)}</h2>
        <p class="formal-cover-org">${this.escapeHtml(orgName)}</p>
        ${footprint ? `<p class="formal-cover-meta">${this.escapeHtml(footprint)}</p>` : ''}
        <p class="formal-cover-meta">Assessment Report • ${date}</p>
        ${org.requirementsDetails ? `<p class="formal-cover-req"><strong>Requirements:</strong> ${this.escapeHtml(org.requirementsDetails)}</p>` : ''}
        <div class="formal-cover-score">
          <div class="formal-score-ring ${scoreClass}">
            <span class="formal-score-value" id="gauge-score-num">${overall.percentage}%</span>
          </div>
          <div class="formal-score-info">
            <span class="formal-score-label">Overall Readiness</span>
            <span class="formal-score-status ${scoreClass.replace(' ', '-')}">${scoreLabel}</span>
            <span class="formal-score-sub">${overall.answered} of ${overall.total} questions answered</span>
          </div>
        </div>
      </div>`;
  }

  renderExecutiveSection(overall, modules, counts) {
    const passing = modules.filter(m => m.percentage >= 70).length;
    return `
      <section class="formal-section">
        <h3 class="formal-section-title">Executive Summary</h3>
        <div class="formal-stats-row">
          <div class="formal-stat"><span class="formal-stat-val">${overall.percentage}%</span><span class="formal-stat-lbl">Readiness</span></div>
          <div class="formal-stat"><span class="formal-stat-val">${overall.answered}</span><span class="formal-stat-lbl">Answered</span></div>
          <div class="formal-stat"><span class="formal-stat-val">${modules.length}</span><span class="formal-stat-lbl">Modules</span></div>
          <div class="formal-stat"><span class="formal-stat-val">${passing}</span><span class="formal-stat-lbl">Passing</span></div>
        </div>
        <h4 class="formal-subtitle">Findings by Priority</h4>
        ${this.renderPriorityBoxes(counts)}
      </section>`;
  }

  renderCriticalFindingsSection(findings) {
    const criticalRows = findings.rows.filter(r => r.criticality === 'HIGH');
    if (criticalRows.length === 0) {
      return '';
    }

    return `
      <section class="formal-section critical-findings-section" style="border: 2px solid #ef4444; border-radius: 8px; padding: 24px; background: rgba(239, 68, 68, 0.02); margin-top: 24px;">
        <h3 class="formal-section-title" style="color: #ef4444; margin-top: 0; display: flex; align-items: center; gap: 8px; font-size: 1.2rem; border-bottom: 2px solid #ef4444; padding-bottom: 8px;">
          <span>Critical Findings & Urgent Gaps</span>
        </h3>
        <p class="formal-section-note" style="color: #64748b; margin-bottom: 16px; font-size: 0.85rem;">The following high-priority controls are missing or only partially implemented, representing immediate security exposure. Remediate these items urgently.</p>
        <div class="critical-findings-grid" style="display: flex; flex-direction: column; gap: 16px;">
          ${criticalRows.map(r => `
            <div class="critical-finding-card" style="border-left: 4px solid #ef4444; background: #fff; border-top: 1px solid #e2e4e8; border-right: 1px solid #e2e4e8; border-bottom: 1px solid #e2e4e8; border-radius: 6px; padding: 18px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; gap: 12px; flex-wrap: wrap;">
                <span style="font-weight: 700; color: #1a1a1b; font-size: 1rem; font-family: inherit;">[Ref ${r.ref}] ${this.escapeHtml(r.summary)}</span>
                <span class="criticality-badge high" style="flex-shrink:0;">${r.criticality}</span>
              </div>
              <div style="font-size: 0.88rem; color: #475569; margin-bottom: 10px; line-height: 1.45;">
                <strong>Current State / Gap:</strong> ${this.escapeHtml(r.description)}
              </div>
              <div style="font-size: 0.88rem; color: #1a1a1b; line-height: 1.5; padding: 12px; background: #fbf9ff; border-left: 3px solid #5b2c8e; border-radius: 0 4px 4px 0;">
                <strong>HiQurate Advisory Recommendation:</strong> ${this.escapeHtml(r.recommendation)}
              </div>
              ${r.action ? `
                <div style="font-size: 0.82rem; color: #475569; margin-top: 10px; padding-top: 8px; border-top: 1px dashed #e2e4e8; line-height: 1.4;">
                  <strong>Remediation Steps:</strong> ${this.escapeHtml(r.action)}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  renderPriorityBoxes(counts) {
    const boxes = [
      { key: 'high', label: 'HIGH Priority', count: counts.high || 0, class: 'priority-high' },
      { key: 'medium', label: 'MEDIUM Priority', count: counts.medium || 0, class: 'priority-medium' },
      { key: 'low', label: 'LOW Priority', count: counts.low || 0, class: 'priority-low' },
      { key: 'advisory', label: 'ADVISORY', count: counts.advisory || 0, class: 'priority-advisory' }
    ];
    return `
      <div class="formal-priority-boxes">
        ${boxes.map(b => `
        <div class="formal-priority-box ${b.class}">
          <span class="formal-priority-count">${String(b.count).padStart(2, '0')}</span>
          <span class="formal-priority-label">${b.label}</span>
        </div>`).join('')}
      </div>`;
  }

  renderModuleScoresSection(modules) {
    return `
      <section class="formal-section">
        <h3 class="formal-section-title">Module Scores</h3>
        <div class="formal-module-bars">
          ${modules.map(m => {
            const cls = getScoreClass(m.percentage);
            const status = m.percentage >= 70 ? 'pass' : m.percentage >= 50 ? 'warn' : 'fail';
            const statusLabel = m.percentage >= 70 ? 'Passing' : m.percentage >= 50 ? 'Needs Improvement' : 'Critical Gap';
            return `
            <div class="formal-module-bar-item">
              <div class="formal-module-bar-header">
                <span>${m.icon || ''} ${this.escapeHtml(m.name)}</span>
                <span class="formal-module-bar-meta">
                  <strong class="formal-bar-pct ${cls}">${m.percentage}%</strong>
                  <span class="formal-status-pill ${status}">${statusLabel}</span>
                </span>
              </div>
              <div class="formal-module-bar-track">
                <div class="formal-module-bar-fill ${cls}" style="width:${m.percentage}%"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </section>`;
  }

  renderFindingsSection(findings) {
    if (!findings.rows.length) {
      return `
      <section class="formal-section">
        <h3 class="formal-section-title">Detailed Findings</h3>
        <p class="formal-empty">No gaps requiring remediation. All assessed controls meet the compliance threshold.</p>
      </section>`;
    }

    const displayRows = findings.rows.slice(0, 25);
    const hasMore = findings.rows.length > 25;

    return `
      <section class="formal-section">
        <h3 class="formal-section-title">Detailed Findings</h3>
        <p class="formal-section-note">Controls not at full maturity. PDF export includes AI-enhanced, control-specific recommendations and actions.</p>
        <div class="formal-table-wrap formal-table-scroll">
          <table class="formal-table formal-findings-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Area</th>
                <th>Summary</th>
                <th>Recommendation</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              ${displayRows.map(r => `
              <tr>
                <td class="col-ref">${r.ref}</td>
                <td>${this.escapeHtml(r.function)}</td>
                <td class="col-summary">${this.escapeHtml(r.finding)}</td>
                <td class="col-rec">${this.escapeHtml(this.truncate(r.recommendation, 160))}</td>
                <td><span class="criticality-badge ${r.criticality.toLowerCase()}">${r.criticality}</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        ${hasMore ? `<p class="formal-section-note">Showing 25 of ${findings.rows.length} findings — full list and actions in PDF report.</p>` : ''}
      </section>`;
  }

  renderAiSection() {
    const isAdmin = app.currentUser?.user?.role === 'admin';
    return `
      <section class="formal-section formal-section-ai">
        <h3 class="formal-section-title">AI Remediation</h3>
        <p class="formal-section-note">PDF findings use Hiqurates AI for control-specific recommendations. Generate an executive remediation summary below.</p>
        <div id="ai-recommendations-content" class="ai-recommendations-content">
          <button class="btn btn-ai" id="generate-ai-btn" onclick="app.reportGen.generateAIRecommendations()">
            <span class="ai-btn-icon"></span> Generate Executive Summary
          </button>
          ${isAdmin ? `<button class="btn btn-ghost" style="margin-left:8px" onclick="app.reportGen.enrichFindingsNow()">Refresh PDF recommendations</button>` : ''}
        </div>
      </section>`;
  }

  truncate(str, len) {
    if (!str || str.length <= len) return str || '';
    return str.substring(0, len) + '…';
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  initCharts() {
    this.destroyCharts();
    this.animateScore();
    this.autoEnrichFindings();
  }

  async autoEnrichFindings() {
    if (!aiService.isConfigured || !this.questionnaire) return;

    const currentAnswers = localStorage.getItem(`cybershield_answers_${this.frameworkId}`);
    const cachedRaw = localStorage.getItem(aiService.getFindingsCacheKey(this.frameworkId));
    if (cachedRaw) {
      try {
        const data = JSON.parse(cachedRaw);
        if (data.answersHash === aiService.hashString(currentAnswers || '')) {
          return; // Valid cache exists, skip
        }
      } catch (e) {}
    }

    const findingsTable = document.querySelector('.formal-findings-table');
    if (findingsTable) {
      const loader = document.createElement('div');
      loader.id = 'ai-enrichment-loader';
      loader.style.cssText = 'display:flex;align-items:center;gap:8px;padding:12px;background:rgba(91,44,142,0.05);border:1px solid rgba(91,44,142,0.2);border-radius:6px;margin-bottom:12px;font-size:0.85rem;color:#5b2c8e;';
      loader.innerHTML = `
        <div class="ai-loading-spinner" style="width:14px;height:14px;border:2px solid #5b2c8e;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div>
        <span>Enhancing report findings and recommendations with AI...</span>
      `;
      findingsTable.parentNode.insertBefore(loader, findingsTable);
    }

    try {
      const orgSettings = OrgSettings.get();
      const rawFindings = this.questionnaire.buildFindings(orgSettings);
      const scores = this.questionnaire.calculateScores();
      await aiService.enrichFindingsForPdf(this.frameworkId, rawFindings, orgSettings, scores);
      
      // Re-render report view to load enriched content
      app.showReport(this.frameworkId);
    } catch (err) {
      console.warn('Auto AI enrichment failed:', err);
      const loader = document.getElementById('ai-enrichment-loader');
      if (loader) loader.remove();
    }
  }

  animateScore() {
    const scoreEl = document.getElementById('gauge-score-num');
    if (!scoreEl) return;
    const target = this.scores.overall.percentage;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const animate = () => {
      current = Math.min(current + step, target);
      scoreEl.textContent = current + '%';
      if (current < target) requestAnimationFrame(animate);
    };
    animate();
  }

  destroyCharts() {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }

  async exportPDF(evt) {
    if (!this.questionnaire) {
      alert('Assessment data not available. Please reopen the report from your assessment.');
      return;
    }

    OrgSettings.saveFromReportForm();
    const btn = (evt && evt.target) || document.getElementById('download-pdf-btn');
    const origText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.innerHTML = '⏳ Generating PDF...';
      btn.disabled = true;
    }

    try {
      const orgSettings = OrgSettings.get();
      let findings = this.questionnaire.buildFindings(orgSettings);

      if (aiService.isConfigured && findings.rows.length > 0) {
        if (btn) btn.innerHTML = '⏳ Enhancing with AI...';
        try {
          findings = await aiService.enrichFindingsForPdf(
            this.frameworkId, findings, orgSettings, this.scores
          );
        } catch (aiErr) {
          console.warn('AI enrichment failed, using detailed templates:', aiErr);
        }
      }

      if (btn) btn.innerHTML = '⏳ Building PDF...';
      const builder = new PdfReportBuilder(this.framework, this.scores, findings, orgSettings);
      builder.download();
    } catch (err) {
      console.error('PDF export failed:', err);
      alert(err.message || 'PDF export failed. Please check your connection and try again.');
    }

    if (btn) {
      btn.innerHTML = origText;
      btn.disabled = false;
    }
  }

  async generateAIRecommendations() {
    const targetEl = document.getElementById('ai-recommendations-content');
    if (!targetEl) return;

    if (!aiService.isConfigured) {
      targetEl.innerHTML = aiService.renderUnavailableMessage();
      return;
    }

    const providerLabel = aiService.provider === 'groq' ? 'Groq' : aiService.provider === 'ollama' ? 'Ollama' : 'Gemini';
    targetEl.innerHTML = `
      <div class="ai-loading">
        <div class="ai-loading-spinner"></div>
        <p>Connecting to ${providerLabel}...</p>
        <p class="ai-loading-sub">Generating tailored remediation recommendations</p>
      </div>`;

    await aiService.streamRecommendations(
      this.frameworkId,
      this.scores,
      targetEl,
      (success) => {
        if (success) {
          const regenBtn = document.createElement('div');
          regenBtn.className = 'ai-regen-actions';
          regenBtn.innerHTML = `
            <button class="btn btn-ghost" onclick="localStorage.removeItem('${aiService.getCacheKey(this.frameworkId)}'); app.reportGen.generateAIRecommendations();">
              Regenerate Recommendations
            </button>`;
          targetEl.appendChild(regenBtn);
        }
      }
    );
  }

  retryAI() {
    this.generateAIRecommendations();
  }

  async enrichFindingsNow() {
    if (!this.questionnaire) return;
    if (!aiService.isConfigured) {
      alert('AI service is not configured. Contact your Hiqurates administrator.');
      return;
    }
    localStorage.removeItem(aiService.getFindingsCacheKey(this.frameworkId));
    const btn = document.getElementById('generate-ai-btn');
    const orig = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '⏳ Refreshing...';
    }
    try {
      const orgSettings = OrgSettings.get();
      const findings = this.questionnaire.buildFindings(orgSettings);
      await aiService.enrichFindingsForPdf(this.frameworkId, findings, orgSettings, this.scores);
      app.showReport(this.frameworkId);
    } catch (e) {
      alert('Could not refresh AI recommendations: ' + (e.message || 'Unknown error'));
    }
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = orig;
    }
  }
}
