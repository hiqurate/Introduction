// ============================================
// Hiqurates — Formal PDF Report Builder
// Vector PDF via jsPDF + autoTable
// ============================================

const PDF_THEME = {
  primary: [91, 44, 142],
  headerBg: [26, 26, 27],
  sectionBg: [148, 149, 153],
  text: [26, 26, 27],
  textMuted: [100, 100, 100],
  white: [255, 255, 255],
  criticality: {
    HIGH: [226, 31, 38],
    MEDIUM: [234, 178, 8],
    LOW: [0, 174, 239],
    ADVISORY: [26, 26, 27]
  }
};

class PdfReportBuilder {
  constructor(framework, scores, findings, orgSettings) {
    this.framework = framework;
    this.scores = scores;
    this.findings = findings;
    this.orgSettings = orgSettings || OrgSettings.get();
    this.doc = null;
    this.margin = 15;
    this.contentWidth = 180;
    this.contentTop = 22;
    this.footerY = 282;
  }

  download() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error('jsPDF library not loaded');
    }
    this.generate();
    const org = this.orgSettings.organizationName
      ? `${this.sanitizeFilename(this.orgSettings.organizationName)}_`
      : '';
    const filename = `${org}${this.framework.shortName}_Assessment_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    this.doc.save(filename);
  }

  sanitizeFilename(name) {
    return name.replace(/[^a-z0-9_-]/gi, '_').substring(0, 40);
  }

  getReportTitle() {
    const org = this.orgSettings.organizationName || 'Organization';
    return `${this.framework.shortName} Assessment Report – ${org}`;
  }

  generate() {
    const { jsPDF } = window.jspdf;
    this.doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    const isAdmin = window.app?.currentUser?.user?.role === 'admin';

    this.drawCover();
    this.drawIntroduction();
    this.drawExecutiveSummary();
    this.drawCriticalFindingsSection();

    if (isAdmin) {
      this.drawFindingsTable();
      this.drawObservationsTable();
      this.drawModuleSummary();
    }
    this.addFootersToAllPages();
  }

  addFootersToAllPages() {
    const total = this.doc.internal.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      this.doc.setPage(i);
      this.drawFooter(i);
    }
  }

  drawPageHeader() {
    const doc = this.doc;
    const title = this.getReportTitle();
    const titleLines = doc.splitTextToSize(title, this.contentWidth - 50);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_THEME.textMuted);
    doc.text(titleLines, this.margin, 10);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PDF_THEME.primary);
    doc.text('Hiqurates', this.margin + this.contentWidth, 10, { align: 'right' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(this.margin, 13, this.margin + this.contentWidth, 13);
  }

  drawFooter(pageNum) {
    const doc = this.doc;
    doc.setDrawColor(200, 200, 200);
    doc.line(this.margin, this.footerY - 3, this.margin + this.contentWidth, this.footerY - 3);
    doc.setFontSize(8);
    doc.setTextColor(...PDF_THEME.textMuted);
    doc.text('Hiqurates Security Assessment', this.margin, this.footerY);
    doc.text(String(pageNum), 105, this.footerY, { align: 'center' });
    doc.text('Confidential', this.margin + this.contentWidth, this.footerY, { align: 'right' });
  }

  drawCover() {
    const doc = this.doc;
    const orgName = this.orgSettings.organizationName || 'Organization';
    const footprint = this.orgSettings.employeeCount ? `${this.orgSettings.employeeCount} Employees • ${this.orgSettings.officeLocations} Offices` : '';
    const toolsStr = (this.orgSettings.securityTools || []).join(', ') || 'None reported';
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    doc.setFillColor(...PDF_THEME.primary);
    doc.rect(0, 0, 210, 45, 'F');

    doc.setTextColor(...PDF_THEME.white);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Hiqurates', this.margin, 28);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Security & Compliance Assessment', this.margin + this.contentWidth, 28, { align: 'right' });

    doc.setTextColor(...PDF_THEME.text);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(this.framework.name, this.contentWidth);
    doc.text(titleLines, this.margin, 68);

    let y = 68 + titleLines.length * 8 + 4;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_THEME.textMuted);
    doc.text(orgName, this.margin, y);
    y += 8;
    doc.setFontSize(11);
    if (footprint) {
      doc.text(`Size & Footprint: ${footprint}`, this.margin, y);
      y += 6;
    }
    doc.text(`Existing Technologies: ${toolsStr}`, this.margin, y);
    y += 6;
    doc.text(`Assessment Report • ${date}`, this.margin, y);

    if (this.orgSettings.requirementsDetails) {
      y += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...PDF_THEME.text);
      doc.text('Requirements & Context:', this.margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...PDF_THEME.textMuted);
      const reqLines = doc.splitTextToSize(this.orgSettings.requirementsDetails, this.contentWidth);
      doc.text(reqLines, this.margin, y);
      y += reqLines.length * 5;
    }

    doc.setDrawColor(...PDF_THEME.primary);
    doc.setLineWidth(0.8);
    doc.line(this.margin, y + 8, this.margin + 80, y + 8);

    y += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PDF_THEME.primary);
    doc.text('CONFIDENTIAL', this.margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_THEME.textMuted);
    const notice = doc.splitTextToSize(
      'This document contains proprietary assessment results prepared for the named organization. Distribution is limited to authorized personnel only.',
      this.contentWidth
    );
    doc.text(notice, this.margin, y);

    doc.addPage();
  }

  drawIntroduction() {
    const doc = this.doc;
    this.drawPageHeader();
    let y = this.contentTop;

    y = this.drawSectionHeading('1 Introduction', y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_THEME.text);

    const footprint = this.orgSettings.employeeCount ? ` (${this.orgSettings.employeeCount} employees across ${this.orgSettings.officeLocations} locations)` : '';
    const healthCheckIntro = `This report presents the results of a ${this.framework.shortName} security and compliance health check conducted for ${this.orgSettings.organizationName || 'the organization'}${footprint}. The findings are prioritized based on control criticality and the organization's unique operating scale and security profile.`;
    const introLines = doc.splitTextToSize(healthCheckIntro, this.contentWidth);
    doc.text(introLines, this.margin, y);
    y += introLines.length * 5 + 4;

    const frameworkDesc = this.framework.longDescription || this.framework.description || '';
    const descLines = doc.splitTextToSize(frameworkDesc, this.contentWidth);
    doc.text(descLines, this.margin, y);
    y += descLines.length * 5 + 8;

    y = this.drawSubheading('The scope of this assessment includes:', y);
    const scopeCheckmarks = (this.framework.tags || []).map(t => `\u2713  ${t}`);
    const defaultScope = [
      '\u2713  Control and maturity evaluation',
      '\u2713  Gap identification and risk prioritization',
      '\u2713  Remediation recommendations and action items'
    ];
    const scopeItems = scopeCheckmarks.length ? scopeCheckmarks : defaultScope;
    scopeItems.forEach(item => {
      const lines = doc.splitTextToSize(item, this.contentWidth - 4);
      doc.text(lines, this.margin + 2, y);
      y += lines.length * 5;
    });
    y += 4;

    const closing = doc.splitTextToSize(
      'Summary findings are tabulated by priority in this report. The organization should review all recommendations and close identified gaps within a reasonable timeframe.',
      this.contentWidth
    );
    doc.text(closing, this.margin, y);
    y += closing.length * 5 + 8;

    if (y > 240) {
      doc.addPage();
      this.drawPageHeader();
      y = this.contentTop;
    }

    y = this.drawSectionHeading('2 Target Audience', y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('The intended audience of this report are:', this.margin, y);
    y += 6;
    const audience = [
      '• Chief Information Security Officers',
      '• Security Operations Managers',
      '• Compliance and Risk Officers',
      '• Platform and IT Administrators',
      '• Content and Security Administrators'
    ];
    audience.forEach(item => {
      doc.text(item, this.margin + 2, y);
      y += 5;
    });
    y += 6;

    if (y > 230) {
      doc.addPage();
      this.drawPageHeader();
      y = this.contentTop;
    }

    y = this.drawSectionHeading('3 Scope', y);
    doc.setFontSize(10);
    doc.text('The health check executed is a comprehensive audit covering the following domains:', this.margin, y);
    y += 8;

    const scopeDomains = this.scores.modules.map((m, i) => `${i + 1}. ${m.name}`);
    scopeDomains.forEach(item => {
      const lines = doc.splitTextToSize(item, this.contentWidth - 4);
      doc.text(lines, this.margin + 2, y);
      y += lines.length * 5;
    });
    y += 6;

    if (y > 220) {
      doc.addPage();
      this.drawPageHeader();
      y = this.contentTop;
    }

    y = this.drawSectionHeading('4 Health Check Methodology and Process', y);
    doc.setFontSize(10);
    const methodologyIntro = `The objective of this health check is to review the current state of ${this.framework.shortName} controls and identify areas for improvement.`;
    const methodIntroLines = doc.splitTextToSize(methodologyIntro, this.contentWidth);
    doc.text(methodIntroLines, this.margin, y);
    y += methodIntroLines.length * 5 + 4;

    const methodology = [
      `• Structured questionnaire based on ${this.framework.scoringModel || 'maturity scoring'}`,
      `• ${this.scores.overall.total} assessment points evaluated across ${this.scores.modules.length} modules`,
      '• Summary findings tabulated by priority (High, Medium, Low, Advisory)',
      '• Detailed observations with recommendations and assigned actions',
      '• Customer to close all recommendations within a reasonable time'
    ];
    methodology.forEach(item => {
      const lines = doc.splitTextToSize(item, this.contentWidth);
      doc.text(lines, this.margin + 2, y);
      y += lines.length * 5;
    });

    doc.addPage();
  }

  drawExecutiveSummary() {
    const doc = this.doc;
    this.drawPageHeader();
    const { overall, modules } = this.scores;
    const counts = this.findings.priorityCounts;
    let y = this.contentTop;

    y = this.drawSectionHeading('5 Executive Summary', y);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_THEME.text);
    doc.text(`Organization: ${this.orgSettings.organizationName || '—'}`, this.margin, y);
    y += 5;
    doc.text(`Industry: ${OrgSettings.getIndustryLabel(this.orgSettings.industry)}`, this.margin, y);
    y += 5;
    doc.text(`Overall Readiness Score: ${overall.percentage}%`, this.margin, y);
    y += 5;
    doc.text(`Questions Answered: ${overall.answered} of ${overall.total}`, this.margin, y);
    y += 10;

    y = this.drawSubheading('Findings by Priority', y);
    this.drawPriorityBoxes(counts, y);
    y += 28;

    y = this.drawSubheading('Module Score Summary', y);
    const moduleBody = modules.map(m => [
      m.name,
      `${m.percentage}%`,
      m.percentage >= 70 ? 'Passing' : m.percentage >= 50 ? 'Needs Improvement' : 'Critical Gap'
    ]);

    doc.autoTable({
      startY: y,
      head: [['Module', 'Score', 'Status']],
      body: moduleBody,
      margin: { left: this.margin, right: this.margin, bottom: 22, top: 18 },
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: PDF_THEME.headerBg, textColor: PDF_THEME.white, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.addPage();
  }

  drawPriorityBoxes(counts, startY) {
    const doc = this.doc;
    const boxes = [
      { label: 'HIGH\nPriority', count: counts.high || 0, color: PDF_THEME.criticality.HIGH },
      { label: 'MEDIUM\nPriority', count: counts.medium || 0, color: PDF_THEME.criticality.MEDIUM },
      { label: 'LOW\nPriority', count: counts.low || 0, color: PDF_THEME.criticality.LOW },
      { label: 'ADVISORY', count: counts.advisory || 0, color: PDF_THEME.criticality.ADVISORY }
    ];
    const boxW = 42;
    const gap = 4;
    let x = this.margin;

    boxes.forEach(box => {
      doc.setFillColor(...box.color);
      doc.roundedRect(x, startY, boxW, 22, 2, 2, 'F');
      doc.setTextColor(...PDF_THEME.white);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(String(box.count).padStart(2, '0'), x + 8, startY + 14);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      const labelLines = box.label.split('\n');
      labelLines.forEach((line, i) => {
        doc.text(line, x + 22, startY + 8 + i * 4);
      });
      x += boxW + gap;
    });
  }

  drawCriticalFindingsSection() {
    const doc = this.doc;
    this.drawPageHeader();
    let y = this.contentTop;
    y = this.drawSectionHeading('6 Critical Security Findings', y);

    const criticalRows = this.findings.rows.filter(r => r.criticality === 'HIGH');
    const isAdmin = window.app?.currentUser?.user?.role === 'admin';
    if (criticalRows.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(...PDF_THEME.textMuted);
      doc.text('No critical, high-risk security gaps were identified during this assessment.', this.margin, y + 6);
      if (isAdmin) {
        doc.addPage();
      }
      return;
    }

    doc.setFontSize(10);
    doc.setTextColor(...PDF_THEME.text);
    const introText = doc.splitTextToSize(
      'The following critical security controls were found to be missing or only partially implemented. These represent the highest priority security risks and should be remediated immediately.',
      this.contentWidth
    );
    doc.text(introText, this.margin, y);
    y += introText.length * 5 + 6;

    const head = [['Ref', 'Area', 'Summary', 'Critical Risk & Recommendation']];
    const body = criticalRows.map(r => [
      r.ref,
      r.function,
      r.summary,
      `Observation: ${r.description}\n\nRecommendation: ${r.recommendation}`
    ]);

    doc.autoTable({
      startY: y,
      head,
      body,
      margin: { left: this.margin, right: this.margin, bottom: 22, top: 18 },
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak', valign: 'top' },
      headStyles: { fillColor: [226, 31, 38], textColor: PDF_THEME.white, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 15, fontStyle: 'bold' },
        1: { cellWidth: 35 },
        2: { cellWidth: 40 },
        3: { cellWidth: 90 }
      }
    });

    if (isAdmin) {
      doc.addPage();
    }
  }

  drawFindingsTable() {
    const doc = this.doc;
    this.drawPageHeader();
    let y = this.contentTop;
    y = this.drawSectionHeading('7 Detailed Findings', y);

    if (!this.findings.rows.length) {
      doc.setFontSize(10);
      doc.setTextColor(...PDF_THEME.textMuted);
      doc.text('No significant gaps identified. All assessed controls meet or exceed the compliance threshold.', this.margin, y + 6);
      doc.addPage();
      return;
    }

    const head = [['Ref', 'Function', 'Summary', 'Description', 'Criticality', 'Owner']];
    const body = [];

    this.findings.sections.forEach(section => {
      body.push([
        { content: section.sectionTitle, colSpan: 6, styles: { fillColor: PDF_THEME.sectionBg, textColor: PDF_THEME.white, fontStyle: 'bold', halign: 'left' } }
      ]);
      section.rows.forEach(row => {
        body.push([
          row.ref,
          row.function,
          row.finding,
          row.description,
          row.criticality,
          row.owner
        ]);
      });
    });

    doc.autoTable({
      startY: y,
      head,
      body,
      margin: { left: this.margin, right: this.margin, bottom: 22, top: 18 },
      styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak', valign: 'top' },
      headStyles: { fillColor: PDF_THEME.headerBg, textColor: PDF_THEME.white, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 26 },
        2: { cellWidth: 32 },
        3: { cellWidth: 68 },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 22 }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 4 && typeof data.cell.raw === 'string') {
          const crit = data.cell.raw;
          const rgb = PDF_THEME.criticality[crit];
          if (rgb) {
            data.cell.styles.fillColor = rgb;
            data.cell.styles.textColor = crit === 'MEDIUM' ? PDF_THEME.text : PDF_THEME.white;
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });

    doc.addPage();
  }

  drawObservationsTable() {
    const doc = this.doc;
    this.drawPageHeader();
    let y = this.contentTop;
    y = this.drawSectionHeading('8 Detailed Review and Observations', y);

    if (!this.findings.rows.length) {
      doc.setFontSize(10);
      doc.setTextColor(...PDF_THEME.textMuted);
      doc.text('No observations requiring remediation at this time.', this.margin, y + 6);
      return;
    }

    const head = [['Ref', 'Function', 'Finding', 'Recommendation', 'Action']];
    const body = [];

    this.findings.sections.forEach(section => {
      body.push([
        { content: section.sectionTitle, colSpan: 5, styles: { fillColor: PDF_THEME.sectionBg, textColor: PDF_THEME.white, fontStyle: 'bold' } }
      ]);
      section.rows.forEach(row => {
        body.push([row.ref, row.function, row.finding, row.recommendation, row.action]);
      });
    });

    doc.autoTable({
      startY: y,
      head,
      body,
      margin: { left: this.margin, right: this.margin, bottom: 22, top: 18 },
      styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak', valign: 'top' },
      headStyles: { fillColor: PDF_THEME.primary, textColor: PDF_THEME.white, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 26 },
        2: { cellWidth: 38 },
        3: { cellWidth: 48 },
        4: { cellWidth: 46 }
      }
    });
  }

  drawModuleSummary() {
    if (!this.scores.categories || this.scores.categories.length === 0) return;

    const doc = this.doc;
    doc.addPage();
    this.drawPageHeader();
    const y = this.drawSectionHeading('9 Category Score Summary', this.contentTop);
    const body = this.scores.categories.map(c => [
      c.name,
      `${c.percentage}%`,
      `${c.answered}/${c.total}`
    ]);

    doc.autoTable({
      startY: y,
      head: [['Category', 'Score', 'Answered']],
      body,
      margin: { left: this.margin, right: this.margin, bottom: 22, top: 18 },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: PDF_THEME.headerBg, textColor: PDF_THEME.white, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
  }

  drawSectionHeading(title, y) {
    const doc = this.doc;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PDF_THEME.primary);
    doc.text(title, this.margin, y);
    doc.setDrawColor(...PDF_THEME.primary);
    doc.setLineWidth(0.4);
    doc.line(this.margin, y + 2, this.margin + this.contentWidth, y + 2);
    return y + 10;
  }

  drawSubheading(title, y) {
    const doc = this.doc;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PDF_THEME.text);
    doc.text(title, this.margin, y);
    return y + 7;
  }
}
