// ============================================
// Hiqurates — Organization & Assessment Settings
// ============================================

const OrgSettings = {
  STORAGE_KEY: 'cybershield_org_settings',

  INDUSTRIES: [
    { id: 'banking', label: 'Banking & Financial Services' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'education', label: 'Education' },
    { id: 'retail', label: 'Retail & E-Commerce' },
    { id: 'government', label: 'Government & Public Sector' },
    { id: 'technology', label: 'Technology' },
    { id: 'manufacturing', label: 'Manufacturing' },
    { id: 'energy', label: 'Energy & Utilities' },
    { id: 'other', label: 'Other' }
  ],

  defaults() {
    return {
      organizationName: '',
      employeeCount: '',
      officeLocations: '',
      securityTools: [],
      requirementsDetails: '',
      defaultOwner: 'Organization'
    };
  },

  get() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? { ...this.defaults(), ...JSON.parse(saved) } : this.defaults();
    } catch {
      return this.defaults();
    }
  },

  set(partial) {
    const current = this.get();
    const next = { ...current, ...partial };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(next));
    return next;
  },

  hasRequired() {
    const s = this.get();
    return Boolean(s.organizationName.trim() && s.employeeCount && s.officeLocations);
  },

  getIndustryLabel(industryId) {
    const found = this.INDUSTRIES.find(i => i.id === industryId);
    return found ? found.label : industryId || 'General';
  },

  getIndustryContext(industryId) {
    const contexts = {
      banking: 'Assessment tailored for financial services, covering regulatory expectations for data protection, fraud prevention, and operational resilience.',
      healthcare: 'Assessment aligned with healthcare environments, emphasizing PHI protection, clinical system security, and HIPAA-relevant safeguards.',
      education: 'Assessment for educational institutions, addressing student data privacy, research systems, and campus-wide IT security governance.',
      retail: 'Assessment for retail and e-commerce, focusing on payment data protection, customer privacy, and supply chain security.',
      government: 'Assessment for public sector organizations, emphasizing citizen data protection, compliance mandates, and critical infrastructure security.',
      technology: 'Assessment for technology organizations, covering SaaS security, intellectual property protection, and secure development practices.',
      manufacturing: 'Assessment for manufacturing environments, addressing OT/IT convergence, supply chain risk, and operational technology security.',
      energy: 'Assessment for energy and utilities, focusing on critical infrastructure protection and industrial control system security.',
      other: 'Assessment customized for your organizational context and stated requirements.'
    };
    return contexts[industryId] || contexts.other;
  },

  renderSetupPage(frameworkId, framework) {
    const settings = this.get();
    const securityTools = settings.securityTools || [];

    const employeeOptions = [
      { value: '< 50', label: 'Under 50 employees (Small)' },
      { value: '50 - 250', label: '50 to 250 employees (Medium)' },
      { value: '250 - 1000', label: '250 to 1000 employees (Enterprise)' },
      { value: '1000+', label: '1000+ employees (Large Enterprise)' }
    ].map(opt => `
      <option value="${opt.value}" ${settings.employeeCount === opt.value ? 'selected' : ''}>${opt.label}</option>
    `).join('');

    const toolsList = [
      { id: 'SIEM', label: 'SIEM (Centralized Log Monitoring)' },
      { id: 'EDR', label: 'EDR / Behavior-based Antivirus' },
      { id: 'Firewall', label: 'Next-Generation Firewall' },
      { id: 'IAM', label: 'IAM (Identity & Access Management / SSO)' },
      { id: 'DLP', label: 'DLP (Data Loss Prevention)' },
      { id: 'Email Security', label: 'Secure Email Gateway' },
      { id: 'Vulnerability Management', label: 'Vulnerability Scanning program' }
    ];

    return `
      <div class="assessment-setup-page">
        <div class="container">
          <div class="back-link" onclick="app.showFramework('${frameworkId}')">← Back to ${framework.shortName}</div>

          <div class="assessment-setup-card">
            <div class="setup-header">
              <span class="setup-framework-icon" style="color:${framework.color}">${framework.icon}</span>
              <div>
                <h1>Assessment Setup</h1>
                <p>Before starting <strong>${framework.name}</strong>, provide your organization details. These appear on your formal PDF report.</p>
              </div>
            </div>

            <form id="assessment-setup-form" class="assessment-setup-form" onsubmit="event.preventDefault(); app.submitAssessmentSetup('${frameworkId}');">
              <div class="setup-form-grid">
                <label class="setup-field setup-field-full">
                  <span>Company Name <em class="required">*</em></span>
                  <input type="text" id="setup-org-name" required
                    placeholder="e.g. Acme Corporation"
                    value="${this.escapeHtml(settings.organizationName)}">
                </label>

                <label class="setup-field">
                  <span>Number of Employees <em class="required">*</em></span>
                  <select id="setup-employee-count" required>
                    <option value="">Select size...</option>
                    ${employeeOptions}
                  </select>
                </label>

                <label class="setup-field">
                  <span>Number of Office Locations <em class="required">*</em></span>
                  <input type="number" id="setup-office-locations" required min="1"
                    placeholder="e.g. 3"
                    value="${this.escapeHtml(settings.officeLocations || '1')}">
                </label>

                <div class="setup-field setup-field-full">
                  <span>Existing Security Technologies/Tools</span>
                  <div class="tools-checkbox-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; margin-top: 8px; padding: 16px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                    ${toolsList.map(t => `
                      <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.9rem;">
                        <input type="checkbox" class="setup-tool-checkbox" value="${t.id}" ${securityTools.includes(t.id) ? 'checked' : ''}>
                        <span>${t.label}</span>
                      </label>
                    `).join('')}
                  </div>
                </div>

                <label class="setup-field">
                  <span>Default Owner (findings table)</span>
                  <input type="text" id="setup-default-owner"
                    placeholder="e.g. Security Team, IT Operations"
                    value="${this.escapeHtml(settings.defaultOwner)}">
                </label>

                <label class="setup-field setup-field-full">
                  <span>Requirements & Context</span>
                  <textarea id="setup-requirements" rows="4"
                    placeholder="e.g. PCI-DSS scope for card processing, HIPAA Business Associate, SOC 2 Type II readiness, specific regulatory deadlines...">${this.escapeHtml(settings.requirementsDetails)}</textarea>
                  <small class="field-hint">Optional — describe compliance drivers, scope boundaries, or special requirements.</small>
                </label>
              </div>

              <div class="setup-actions">
                <button type="submit" class="btn btn-primary btn-lg">Continue to Assessment →</button>
                <button type="button" class="btn btn-ghost" onclick="app.showFramework('${frameworkId}')">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>`;
  },

  saveFromSetupForm() {
    const orgInput = document.getElementById('setup-org-name');
    const employeeInput = document.getElementById('setup-employee-count');
    const officeInput = document.getElementById('setup-office-locations');
    const requirementsInput = document.getElementById('setup-requirements');
    const ownerInput = document.getElementById('setup-default-owner');
    
    const checkboxes = document.querySelectorAll('.setup-tool-checkbox');
    const securityTools = [];
    checkboxes.forEach(cb => {
      if (cb.checked) securityTools.push(cb.value);
    });

    const organizationName = orgInput ? orgInput.value.trim() : '';
    const employeeCount = employeeInput ? employeeInput.value : '';
    const officeLocations = officeInput ? officeInput.value.trim() : '1';
    const requirementsDetails = requirementsInput ? requirementsInput.value.trim() : '';
    const defaultOwner = ownerInput ? ownerInput.value.trim() || 'Organization' : 'Organization';

    if (!organizationName) {
      if (orgInput) orgInput.focus();
      return false;
    }
    if (!employeeCount) {
      if (employeeInput) employeeInput.focus();
      return false;
    }
    if (!officeLocations) {
      if (officeInput) officeInput.focus();
      return false;
    }

    this.set({ organizationName, employeeCount, officeLocations, securityTools, requirementsDetails, defaultOwner });
    return true;
  },

  renderSettingsBar() {
    const settings = this.get();
    const toolsStr = (settings.securityTools || []).join(', ') || 'None reported';
    return `
      <div class="report-settings-bar" id="report-settings-bar">
        <h4>Report Details</h4>
        <p class="report-settings-hint">Captured at assessment setup. <a href="#" onclick="app.showAssessmentSetup(app.currentFramework); return false;">Edit details</a></p>
        <div class="report-settings-summary">
          <div><strong>Organization:</strong> ${this.escapeHtml(settings.organizationName) || '—'}</div>
          <div><strong>Size & Footprint:</strong> ${this.escapeHtml(settings.employeeCount)} Employees • ${parseInt(settings.officeLocations) || 1} Offices</div>
          <div><strong>Existing Tech:</strong> ${this.escapeHtml(toolsStr)}</div>
          ${settings.requirementsDetails ? `<div><strong>Requirements:</strong> ${this.escapeHtml(settings.requirementsDetails)}</div>` : ''}
        </div>
        <div class="report-settings-fields" style="margin-top:12px">
          <label class="report-settings-field">
            <span>Default Owner (findings table)</span>
            <input type="text" id="default-owner-input" placeholder="e.g. Security Team"
              value="${this.escapeHtml(settings.defaultOwner)}"
              onchange="OrgSettings.saveFromReportForm()" onblur="OrgSettings.saveFromReportForm()">
          </label>
        </div>
      </div>`;
  },

  saveFromReportForm() {
    const ownerInput = document.getElementById('default-owner-input');
    this.set({
      defaultOwner: ownerInput ? ownerInput.value.trim() || 'Organization' : 'Organization'
    });
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
};
