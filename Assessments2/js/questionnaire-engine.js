// ============================================
// CyberShield — Questionnaire Engine
// Renders questions, handles answers, calculates scores
// ============================================

class QuestionnaireEngine {
  constructor(frameworkId) {
    this.frameworkId = frameworkId;
    this.framework = FRAMEWORKS[frameworkId];
    this.data = this.getFrameworkData(frameworkId);
    this.answers = this.loadAnswers();
    this.currentModuleIndex = 0;
    this.currentCategoryIndex = 0;
    this.currentQuestionIndex = 0;
    this.flatQuestions = this.flattenQuestions();
    this.currentFlatIndex = this.findFirstUnanswered();
  }

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

  flattenQuestions() {
    const flat = [];
    this.data.modules.forEach((mod, mi) => {
      mod.categories.forEach((cat, ci) => {
        cat.questions.forEach((q, qi) => {
          flat.push({ ...q, moduleIndex: mi, categoryIndex: ci, questionIndex: qi, moduleName: mod.name, categoryName: cat.name, moduleId: mod.id, categoryId: cat.id });
        });
      });
    });
    return flat;
  }

  findFirstUnanswered() {
    for (let i = 0; i < this.flatQuestions.length; i++) {
      if (!this.answers[this.flatQuestions[i].id]) return i;
    }
    return 0;
  }

  getCurrentQuestion() {
    return this.flatQuestions[this.currentFlatIndex];
  }

  getTotalQuestions() {
    return this.flatQuestions.length;
  }

  getAnsweredCount() {
    return Object.keys(this.answers).length;
  }

  getProgress() {
    return Math.round((this.getAnsweredCount() / this.getTotalQuestions()) * 100);
  }

  isComplete() {
    return this.getAnsweredCount() >= this.getTotalQuestions();
  }

  answerQuestion(questionId, value) {
    this.answers[questionId] = value;
    this.saveAnswers();
  }

  getAnswer(questionId) {
    return this.answers[questionId];
  }

  next() {
    if (this.currentFlatIndex < this.flatQuestions.length - 1) {
      this.currentFlatIndex++;
      return true;
    }
    return false;
  }

  prev() {
    if (this.currentFlatIndex > 0) {
      this.currentFlatIndex--;
      return true;
    }
    return false;
  }

  goToQuestion(index) {
    if (index >= 0 && index < this.flatQuestions.length) {
      this.currentFlatIndex = index;
    }
  }

  goToModule(moduleIndex) {
    const idx = this.flatQuestions.findIndex(q => q.moduleIndex === moduleIndex);
    if (idx !== -1) this.currentFlatIndex = idx;
  }

  getModuleProgress(moduleIndex) {
    const moduleQuestions = this.flatQuestions.filter(q => q.moduleIndex === moduleIndex);
    const answered = moduleQuestions.filter(q => this.answers[q.id]).length;
    return { answered, total: moduleQuestions.length, percentage: Math.round((answered / moduleQuestions.length) * 100) };
  }

  isModuleComplete(moduleIndex) {
    return this.getModuleProgress(moduleIndex).percentage === 100;
  }

  saveAnswers() {
    localStorage.setItem(`cybershield_answers_${this.frameworkId}`, JSON.stringify(this.answers));
  }

  loadAnswers() {
    const saved = localStorage.getItem(`cybershield_answers_${this.frameworkId}`);
    return saved ? JSON.parse(saved) : {};
  }

  clearAnswers() {
    this.answers = {};
    localStorage.removeItem(`cybershield_answers_${this.frameworkId}`);
  }

  calculateScores() {
    const moduleScores = [];
    const categoryScores = [];
    let totalScore = 0;
    let totalMax = 0;
    let totalAnswered = 0;

    this.data.modules.forEach((mod, mi) => {
      let modScore = 0;
      let modMax = 0;
      let modAnswered = 0;
      const catScores = [];

      mod.categories.forEach((cat, ci) => {
        let catScore = 0;
        let catMax = 0;
        let catAnswered = 0;

        cat.questions.forEach(q => {
          const maxVal = Math.max(...q.options.map(o => o.value));
          catMax += maxVal;
          if (this.answers[q.id]) {
            catScore += this.answers[q.id];
            catAnswered++;
          }
        });

        const catPercentage = catMax > 0 ? Math.round((catScore / catMax) * 100) : 0;
        catScores.push({ id: cat.id, name: cat.name, score: catScore, max: catMax, percentage: catPercentage, answered: catAnswered, total: cat.questions.length });
        modScore += catScore;
        modMax += catMax;
        modAnswered += catAnswered;
      });

      const modPercentage = modMax > 0 ? Math.round((modScore / modMax) * 100) : 0;
      moduleScores.push({ id: mod.id, name: mod.name, icon: mod.icon, score: modScore, max: modMax, percentage: modPercentage, answered: modAnswered, total: this.flatQuestions.filter(q => q.moduleIndex === mi).length, categories: catScores });
      categoryScores.push(...catScores);
      totalScore += modScore;
      totalMax += modMax;
      totalAnswered += modAnswered;
    });

    const overallPercentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

    return { overall: { score: totalScore, max: totalMax, percentage: overallPercentage, answered: totalAnswered, total: this.flatQuestions.length }, modules: moduleScores, categories: categoryScores, gaps: this.identifyGaps(categoryScores), recommendations: this.generateRecommendations(moduleScores, categoryScores) };
  }

  identifyGaps(categoryScores) {
    return categoryScores
      .filter(c => c.percentage < 70)
      .sort((a, b) => a.percentage - b.percentage)
      .map(c => ({
        ...c,
        severity: c.percentage < 30 ? 'critical' : c.percentage < 50 ? 'high' : c.percentage < 70 ? 'medium' : 'low',
        severityLabel: c.percentage < 30 ? 'Critical' : c.percentage < 50 ? 'High' : c.percentage < 70 ? 'Medium' : 'Low'
      }));
  }

  generateRecommendations(moduleScores, categoryScores) {
    const recommendations = [];
    const lowModules = moduleScores.filter(m => m.percentage < 50).sort((a, b) => a.percentage - b.percentage);
    const medModules = moduleScores.filter(m => m.percentage >= 50 && m.percentage < 70).sort((a, b) => a.percentage - b.percentage);

    lowModules.forEach(mod => {
      recommendations.push({
        priority: 'P1',
        title: `Strengthen ${mod.name}`,
        description: `This area scored ${mod.percentage}% which indicates critical gaps. Immediate action is needed to establish baseline controls and processes.`,
        module: mod.name,
        score: mod.percentage
      });
    });

    medModules.forEach(mod => {
      recommendations.push({
        priority: 'P2',
        title: `Improve ${mod.name}`,
        description: `Scoring ${mod.percentage}%, this area needs further development. Focus on formalizing processes and expanding coverage.`,
        module: mod.name,
        score: mod.percentage
      });
    });

    const lowCategories = categoryScores.filter(c => c.percentage < 40 && c.answered > 0).sort((a, b) => a.percentage - b.percentage).slice(0, 5);
    lowCategories.forEach(cat => {
      if (!recommendations.find(r => r.title.includes(cat.name))) {
        recommendations.push({
          priority: cat.percentage < 25 ? 'P1' : 'P2',
          title: `Address gaps in ${cat.name}`,
          description: `Scoring only ${cat.percentage}%, this specific area requires targeted improvement. Consider implementing controls and documenting procedures.`,
          module: cat.name,
          score: cat.percentage
        });
      }
    });

    const highModules = moduleScores.filter(m => m.percentage >= 70 && m.percentage < 90);
    highModules.forEach(mod => {
      recommendations.push({
        priority: 'P3',
        title: `Optimize ${mod.name}`,
        description: `Good progress at ${mod.percentage}%. Focus on automation, continuous improvement, and closing remaining gaps.`,
        module: mod.name,
        score: mod.percentage
      });
    });

    return recommendations.slice(0, 10);
  }

  getCriticality(pct, answerValue, maxVal) {
    if (answerValue >= maxVal) return null;
    if (pct < 40) return 'HIGH';
    if (pct < 70) return 'MEDIUM';
    if (pct < 85) return 'LOW';
    return 'ADVISORY';
  }

  buildFindings(orgSettings = {}) {
    const defaultOwner = orgSettings.defaultOwner || 'Organization';
    const frameworkName = this.framework?.name || 'Assessment';
    const rows = [];
    const moduleCounters = {};

    this.flatQuestions.forEach(q => {
      const answerValue = this.answers[q.id];
      if (answerValue === undefined || answerValue === null) return;

      const maxVal = Math.max(...q.options.map(o => o.value));
      if (maxVal <= 0) return;

      const pct = Math.round((answerValue / maxVal) * 100);
      const criticality = this.getCriticality(pct, answerValue, maxVal);
      if (!criticality) return;

      const selectedOption = q.options.find(o => o.value === answerValue);
      const label = selectedOption ? selectedOption.label : String(answerValue);
      const detail = selectedOption?.detail || '';

      moduleCounters[q.moduleIndex] = (moduleCounters[q.moduleIndex] || 0) + 1;
      const ref = `${q.moduleIndex + 1}.${String(moduleCounters[q.moduleIndex]).padStart(2, '0')}`;

      const description = detail ? `${label}. ${detail}` : label;
      const finding = `Current state: ${description}`;
      const recommendation = q.recommendation || this.generateFindingRecommendation(q, criticality, frameworkName, label, detail, orgSettings);
      const action = q.action || this.generateFindingAction(q, criticality, defaultOwner, label, detail, orgSettings);

      rows.push({
        ref,
        moduleIndex: q.moduleIndex,
        moduleName: q.moduleName,
        function: q.categoryName,
        summary: q.text,
        description,
        criticality,
        owner: q.owner || defaultOwner,
        finding,
        recommendation,
        action,
        pct
      });
    });

    const priorityCounts = { high: 0, medium: 0, low: 0, advisory: 0 };
    rows.forEach(r => {
      const key = r.criticality.toLowerCase();
      if (priorityCounts[key] !== undefined) priorityCounts[key]++;
    });

    const sections = [];
    const moduleIndices = [...new Set(rows.map(r => r.moduleIndex))].sort((a, b) => a - b);
    moduleIndices.forEach(mi => {
      const moduleRows = rows.filter(r => r.moduleIndex === mi);
      sections.push({
        moduleIndex: mi,
        moduleName: moduleRows[0].moduleName,
        sectionTitle: `${mi + 1} ${moduleRows[0].moduleName.toUpperCase()}`,
        rows: moduleRows
      });
    });

    return { rows, sections, priorityCounts };
  }

  generateFindingRecommendation(question, criticality, frameworkName, selectedLabel, detail, orgSettings = {}) {
    if (question.recommendation) return question.recommendation;

    const area = question.categoryName;
    const gap = detail || selectedLabel || 'partial implementation';
    const industry = orgSettings.industry ? OrgSettings.getIndustryLabel(orgSettings.industry) : '';
    const industryNote = industry ? ` Consider ${industry} regulatory expectations.` : '';

    const specific = `For "${question.text}": current rating is "${selectedLabel}" (${gap}).`;

    const guidance = {
      HIGH: `Prioritize immediate remediation in ${area}. Define accountable owner, target completion within 30 days, and map control to ${frameworkName}.${industryNote}`,
      MEDIUM: `Formalize ${area} controls: document procedure, assign owner, and schedule evidence review within 60 days per ${frameworkName}.${industryNote}`,
      LOW: `Close remaining ${area} gaps: standardize the control, add monitoring, and retain audit evidence within 90 days.${industryNote}`,
      ADVISORY: `Mature ${area}: automate checks where possible and align with ${frameworkName} best practices.${industryNote}`
    };

    return `${specific} ${guidance[criticality] || guidance.MEDIUM}`;
  }

  generateFindingAction(question, criticality, defaultOwner, selectedLabel, detail, orgSettings = {}) {
    if (question.action) return question.action;

    const owner = question.owner || defaultOwner;
    const gap = detail || selectedLabel;
    const req = orgSettings.requirementsDetails ? ` Align with stated requirements: ${orgSettings.requirementsDetails.substring(0, 120)}.` : '';

    const timelines = { HIGH: '30 days', MEDIUM: '60 days', LOW: '90 days', ADVISORY: 'next quarter' };
    const timeline = timelines[criticality] || '90 days';

    const steps = {
      HIGH: [
        `${owner}: open remediation ticket for "${question.text}"`,
        `Document gap ("${gap}") and assign SME within 5 business days`,
        `Implement interim control and collect evidence within ${timeline}`,
        `Verify fix with internal audit or control test`
      ],
      MEDIUM: [
        `${owner}: update procedure/SOP for ${question.categoryName}`,
        `Remediate "${question.text}" gap: ${gap}`,
        `Complete implementation and evidence upload within ${timeline}`
      ],
      LOW: [
        `${owner}: schedule improvement for "${question.text}"`,
        `Close gap (${gap}) and attach evidence within ${timeline}`
      ],
      ADVISORY: [
        `${owner}: review "${question.text}" for optimization opportunities`,
        `Plan enhancement in roadmap for ${timeline}`
      ]
    };

    return (steps[criticality] || steps.MEDIUM).join(' → ') + req;
  }

  renderSidebar() {
    const currentQ = this.getCurrentQuestion();
    const progress = this.getProgress();
    const circumference = 2 * Math.PI * 52;
    const dashOffset = circumference - (progress / 100) * circumference;

    let html = `
      <div class="sidebar-progress">
        <h4>Overall Progress</h4>
        <div class="progress-ring">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#00d4ff"/>
                <stop offset="100%" style="stop-color:#7c3aed"/>
              </linearGradient>
            </defs>
            <circle class="progress-ring-bg" cx="60" cy="60" r="52"/>
            <circle class="progress-ring-fill" cx="60" cy="60" r="52" stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}"/>
          </svg>
          <div class="progress-ring-text">
            <div class="percentage">${progress}%</div>
            <div class="label">Complete</div>
          </div>
        </div>
        <div style="text-align:center;font-size:0.8rem;color:var(--text-tertiary)">${this.getAnsweredCount()} of ${this.getTotalQuestions()} questions</div>
      </div>
      <div class="module-nav">`;

    this.data.modules.forEach((mod, idx) => {
      const modProgress = this.getModuleProgress(idx);
      const isActive = currentQ && currentQ.moduleIndex === idx;
      const isComplete = modProgress.percentage === 100;
      const stateClass = isComplete ? 'completed' : isActive ? 'active' : '';

      html += `
        <div class="module-nav-item ${stateClass}" onclick="app.questionnaire.goToModule(${idx}); app.renderQuestionnaire();">
          <div class="status-icon">${isComplete ? '✓' : idx + 1}</div>
          <span class="module-name" title="${mod.name}">${mod.name}</span>
        </div>`;
    });

    html += '</div>';
    return html;
  }

  renderQuestion() {
    const q = this.getCurrentQuestion();
    if (!q) return this.renderComplete();
    const idx = this.currentFlatIndex;
    const total = this.getTotalQuestions();
    const progressPct = ((idx + 1) / total) * 100;
    const currentAnswer = this.getAnswer(q.id);

    let html = `
      <div class="question-header">
        <div class="question-breadcrumb">
          <span>${this.framework.shortName}</span>
          <span class="separator">›</span>
          <span>${q.moduleName}</span>
          <span class="separator">›</span>
          <span class="current">${q.categoryName}</span>
        </div>
        <div class="progress-bar-wrapper">
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width: ${progressPct}%"></div>
          </div>
          <div class="progress-label">
            <span>Question ${idx + 1} of ${total}</span>
            <span>${Math.round(progressPct)}%</span>
          </div>
        </div>
      </div>
      <div class="question-card" id="question-card">
        <div class="question-number">${q.id}</div>
        <div class="question-text">${q.text}</div>
        ${q.context ? `<div class="question-context">${q.context}</div>` : ''}
        <div class="answer-options">`;

    q.options.forEach((opt, i) => {
      const selected = currentAnswer === opt.value ? 'selected' : '';
      html += `
          <label class="answer-option ${selected}" onclick="app.selectAnswer('${q.id}', ${opt.value}, this)">
            <input type="radio" name="answer-${q.id}" value="${opt.value}" ${selected ? 'checked' : ''}>
            <div class="answer-radio"></div>
            <span class="answer-label">${opt.label}${opt.detail ? ` — ${opt.detail}` : ''}</span>
            <span class="answer-score">${opt.value}/${Math.max(...q.options.map(o => o.value))}</span>
          </label>`;
    });

    html += `
        </div>
      </div>
      <div class="question-nav">
        <button class="btn btn-secondary" onclick="app.prevQuestion()" ${idx === 0 ? 'disabled style="opacity:0.5"' : ''}>← Previous</button>
        <div class="auto-save-indicator" id="autosave-indicator">
          <span>✓</span> Auto-saved
        </div>
        <button class="btn btn-primary" onclick="app.nextQuestion()">${idx === total - 1 ? 'Finish Assessment →' : 'Next →'}</button>
      </div>`;

    return html;
  }

  renderComplete() {
    return `
      <div class="completion-screen">
        <div class="completion-icon">🎉</div>
        <h2>Assessment Complete!</h2>
        <p>You have answered all ${this.getTotalQuestions()} questions in the ${this.framework.name} assessment. Generate your report to see your results.</p>
        <div style="display:flex;gap:16px;justify-content:center;margin-top:24px">
          <button class="btn btn-primary btn-lg" onclick="app.showReport('${this.frameworkId}')">📊 Generate Report</button>
          <button class="btn btn-secondary" onclick="app.questionnaire.goToQuestion(0); app.renderQuestionnaire();">Review Answers</button>
        </div>
      </div>`;
  }
}
