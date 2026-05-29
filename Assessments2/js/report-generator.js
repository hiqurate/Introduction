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

    let html = `
      <div class="report-page">
        <div class="back-link" onclick="app.showFramework('${this.frameworkId}')">← Back to ${this.framework.shortName}</div>

        <div class="report-header">
          <h1>${this.framework.name}</h1>
          <p class="report-meta">Assessment Report • Generated on ${date}</p>
          <div class="report-actions">
            <button class="btn btn-primary" id="download-pdf-btn" onclick="app.reportGen.exportPDF(event)">📥 Download PDF Report</button>
            <button class="btn btn-secondary" onclick="app.startAssessment('${this.frameworkId}')">🔄 Retake Assessment</button>
            <button class="btn btn-ghost" onclick="window.print()">🖨️ Print</button>
          </div>
        </div>

        ${OrgSettings.renderSettingsBar()}

        <div id="report-content" class="formal-report-doc">
          ${this.renderFormalCover(orgSettings, date, overall, scoreClass, scoreLabel)}
          ${this.renderExecutiveSection(overall, modules, counts)}
          ${this.renderModuleScoresSection(modules)}
          ${this.renderFindingsSection(findings)}
          ${this.renderAiSection()}
        </div>
      </div>`;

    return html;
  }

  renderFormalCover(org, date, overall, scoreClass, scoreLabel) {
    const orgName = org.organizationName || 'Organization';
    const industry = org.industry ? OrgSettings.getIndustryLabel(org.industry) : '';
    return `
      <div class="formal-cover">
        <div class="formal-cover-top">
          <span class="formal-brand">Hiqurates</span>
          <span class="formal-cover-tag">Security & Compliance Assessment</span>
        </div>
        <h2 class="formal-cover-title">${this.escapeHtml(this.framework.name)}</h2>
        <p class="formal-cover-org">${this.escapeHtml(orgName)}</p>
        ${industry ? `<p class="formal-cover-meta">Industry: ${this.escapeHtml(industry)}</p>` : ''}
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
                <td class="col-summary">${this.escapeHtml(r.summary)}</td>
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
    return `
      <section class="formal-section formal-section-ai">
        <h3 class="formal-section-title">AI Remediation</h3>
        <p class="formal-section-note">PDF findings use Hiqurates AI for control-specific recommendations. Generate an executive remediation summary below.</p>
        <div id="ai-recommendations-content" class="ai-recommendations-content">
          <button class="btn btn-ai" id="generate-ai-btn" onclick="app.reportGen.generateAIRecommendations()">
            <span class="ai-btn-icon">✨</span> Generate Executive Summary
          </button>
          <button class="btn btn-ghost" style="margin-left:8px" onclick="app.reportGen.enrichFindingsNow()">🔄 Refresh PDF recommendations</button>
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
              🔄 Regenerate Recommendations
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
