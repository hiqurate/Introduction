// ============================================
// CyberShield — Report Generator
// Interactive visual report with charts and PDF export
// ============================================

class ReportGenerator {
  constructor(frameworkId, scores) {
    this.frameworkId = frameworkId;
    this.framework = FRAMEWORKS[frameworkId];
    this.scores = scores;
    this.charts = [];
  }

  render() {
    const { overall, modules, gaps, recommendations } = this.scores;
    const scoreClass = getScoreClass(overall.percentage);
    const scoreLabel = getScoreLabel(overall.percentage);
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    let html = `
      <div class="report-page" id="report-content">
        <div class="back-link" onclick="app.showFramework('${this.frameworkId}')">← Back to ${this.framework.shortName}</div>

        <!-- Report Header -->
        <div class="report-header">
          <h1>${this.framework.name}</h1>
          <p class="report-meta">Assessment Report • Generated on ${date}</p>
          <div class="report-actions">
            <button class="btn btn-primary" onclick="app.reportGen.exportPDF()">📥 Download PDF Report</button>
            <button class="btn btn-secondary" onclick="app.startAssessment('${this.frameworkId}')">🔄 Retake Assessment</button>
            <button class="btn btn-ghost" onclick="window.print()">🖨️ Print</button>
          </div>
        </div>

        <!-- Executive Summary Score Gauge -->
        <div class="report-card" style="text-align:center;margin-bottom:var(--space-xl)">
          <h3><i>📊</i> Executive Summary</h3>
          <div class="score-gauge-section">
            <div class="score-gauge">
              <svg viewBox="0 0 260 260">
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:${this.getScoreColor(overall.percentage)}"/>
                    <stop offset="100%" style="stop-color:${this.getScoreColorEnd(overall.percentage)}"/>
                  </linearGradient>
                </defs>
                <circle class="gauge-bg" cx="130" cy="130" r="110" stroke-dasharray="${2 * Math.PI * 110 * 0.75}" stroke-dashoffset="0" transform="rotate(135 130 130)"/>
                <circle class="gauge-fill" cx="130" cy="130" r="110" stroke="url(#gaugeGrad)" stroke-dasharray="${2 * Math.PI * 110 * 0.75}" stroke-dashoffset="${2 * Math.PI * 110 * 0.75 * (1 - overall.percentage / 100)}" transform="rotate(135 130 130)" id="gauge-arc"/>
              </svg>
              <div class="gauge-center">
                <div class="gauge-score ${scoreClass}" id="gauge-score-num">${overall.percentage}%</div>
                <div class="gauge-label">Readiness Score</div>
                <span class="gauge-status ${scoreClass.replace(' ', '-')}">${scoreLabel}</span>
              </div>
            </div>
          </div>
          <div class="exec-summary-grid">
            <div class="exec-summary-item">
              <div class="value" style="color:var(--accent-cyan)">${overall.answered}</div>
              <div class="label">Questions Answered</div>
            </div>
            <div class="exec-summary-item">
              <div class="value" style="color:var(--color-${scoreClass === 'critical' || scoreClass === 'warning' ? 'warning' : 'success'})">${modules.length}</div>
              <div class="label">Modules Assessed</div>
            </div>
            <div class="exec-summary-item">
              <div class="value" style="color:var(--color-danger)">${gaps.filter(g => g.severity === 'critical').length}</div>
              <div class="label">Critical Gaps</div>
            </div>
            <div class="exec-summary-item">
              <div class="value" style="color:var(--color-success)">${modules.filter(m => m.percentage >= 70).length}</div>
              <div class="label">Passing Modules</div>
            </div>
          </div>
        </div>

        <div class="report-grid">
          <!-- Radar Chart -->
          <div class="report-card">
            <h3><i>🕸️</i> Module Comparison</h3>
            <div class="chart-container">
              <canvas id="radarChart"></canvas>
            </div>
          </div>

          <!-- Module Scores -->
          <div class="report-card">
            <h3><i>📊</i> Module Scores</h3>
            <div class="module-scores">
              ${modules.map(m => {
                const cls = getScoreClass(m.percentage);
                return `
                <div class="module-score-item">
                  <div class="module-score-header">
                    <span class="module-score-name">${m.icon || ''} ${m.name}</span>
                    <span class="module-score-value" style="color:var(--${cls === 'critical' ? 'color-danger' : cls === 'warning' ? 'color-warning' : cls === 'good' ? 'color-success' : 'accent-cyan'})">${m.percentage}%</span>
                  </div>
                  <div class="module-score-bar">
                    <div class="module-score-bar-fill ${cls}" style="width:${m.percentage}%"></div>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>

          <!-- Bar Chart -->
          <div class="report-card">
            <h3><i>📈</i> Category Breakdown</h3>
            <div class="chart-container">
              <canvas id="barChart"></canvas>
            </div>
          </div>

          <!-- Risk Heat Map -->
          <div class="report-card">
            <h3><i>🔥</i> Risk Heat Map</h3>
            <div class="heatmap-grid">
              ${this.scores.categories.map(c => {
                const cls = getScoreClass(c.percentage);
                return `
                <div class="heatmap-cell ${cls}" title="${c.name}: ${c.percentage}%">
                  <span class="cell-score">${c.percentage}%</span>
                  <span class="cell-label">${c.name.length > 20 ? c.name.substring(0, 18) + '…' : c.name}</span>
                </div>`;
              }).join('')}
            </div>
          </div>

          <!-- Gap Analysis -->
          <div class="report-card full-width">
            <h3><i>⚠️</i> Gap Analysis</h3>
            ${gaps.length > 0 ? `
            <table class="gap-table">
              <thead>
                <tr><th>Area</th><th>Score</th><th>Severity</th><th>Status</th></tr>
              </thead>
              <tbody>
                ${gaps.map(g => `
                <tr>
                  <td>${g.name}</td>
                  <td><strong>${g.percentage}%</strong></td>
                  <td><span class="severity-badge ${g.severity}">${g.severityLabel}</span></td>
                  <td style="color:var(--text-secondary)">${g.answered}/${g.total} answered</td>
                </tr>`).join('')}
              </tbody>
            </table>` : `<p style="color:var(--text-secondary);text-align:center;padding:24px">🎉 No significant gaps identified. All areas above 70% threshold.</p>`}
          </div>

          <!-- Recommendations -->
          <div class="report-card full-width">
            <h3><i>💡</i> Recommendations</h3>
            ${recommendations.length > 0 ? `
            <div class="recommendation-list">
              ${recommendations.map(r => `
              <div class="recommendation-item">
                <span class="priority ${r.priority.toLowerCase()}">${r.priority}</span>
                <div class="rec-content">
                  <h5>${r.title}</h5>
                  <p>${r.description}</p>
                </div>
              </div>`).join('')}
            </div>` : `<p style="color:var(--text-secondary);text-align:center;padding:24px">Excellent! No critical recommendations at this time.</p>`}
          </div>
        </div>

        <!-- Detailed Module Breakdown -->
        <div class="report-card full-width" style="margin-top:var(--space-xl)">
          <h3><i>📋</i> Detailed Module Breakdown</h3>
          <div class="chart-container" style="max-height:500px">
            <canvas id="detailedBarChart"></canvas>
          </div>
        </div>

      </div>`;

    return html;
  }

  getScoreColor(pct) {
    if (pct < 30) return '#ef4444';
    if (pct < 60) return '#f59e0b';
    if (pct < 80) return '#10b981';
    return '#00d4ff';
  }

  getScoreColorEnd(pct) {
    if (pct < 30) return '#f87171';
    if (pct < 60) return '#fbbf24';
    if (pct < 80) return '#34d399';
    return '#7c3aed';
  }

  initCharts() {
    this.destroyCharts();
    const { modules, categories } = this.scores;

    // Radar Chart
    const radarCtx = document.getElementById('radarChart');
    if (radarCtx) {
      const radarChart = new Chart(radarCtx.getContext('2d'), {
        type: 'radar',
        data: {
          labels: modules.map(m => m.name.length > 20 ? m.name.substring(0, 18) + '…' : m.name),
          datasets: [{
            label: 'Current Score',
            data: modules.map(m => m.percentage),
            backgroundColor: 'rgba(0, 212, 255, 0.15)',
            borderColor: '#00d4ff',
            borderWidth: 2,
            pointBackgroundColor: '#00d4ff',
            pointBorderColor: '#fff',
            pointRadius: 4
          }, {
            label: 'Target (80%)',
            data: modules.map(() => 80),
            backgroundColor: 'rgba(124, 58, 237, 0.05)',
            borderColor: 'rgba(124, 58, 237, 0.4)',
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: { stepSize: 20, color: '#64748b', backdropColor: 'transparent', font: { size: 10 } },
              grid: { color: 'rgba(148, 163, 184, 0.1)' },
              pointLabels: { color: '#94a3b8', font: { size: 11 } },
              angleLines: { color: 'rgba(148, 163, 184, 0.1)' }
            }
          },
          plugins: {
            legend: { labels: { color: '#94a3b8', usePointStyle: true, padding: 20 } }
          }
        }
      });
      this.charts.push(radarChart);
    }

    // Category Bar Chart
    const barCtx = document.getElementById('barChart');
    if (barCtx) {
      const topCategories = categories.slice(0, 12);
      const barChart = new Chart(barCtx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: topCategories.map(c => c.name.length > 25 ? c.name.substring(0, 22) + '…' : c.name),
          datasets: [{
            label: 'Score %',
            data: topCategories.map(c => c.percentage),
            backgroundColor: topCategories.map(c => {
              if (c.percentage < 30) return 'rgba(239, 68, 68, 0.6)';
              if (c.percentage < 60) return 'rgba(245, 158, 11, 0.6)';
              if (c.percentage < 80) return 'rgba(16, 185, 129, 0.6)';
              return 'rgba(0, 212, 255, 0.6)';
            }),
            borderColor: topCategories.map(c => {
              if (c.percentage < 30) return '#ef4444';
              if (c.percentage < 60) return '#f59e0b';
              if (c.percentage < 80) return '#10b981';
              return '#00d4ff';
            }),
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          indexAxis: 'y',
          scales: {
            x: { beginAtZero: true, max: 100, ticks: { color: '#64748b' }, grid: { color: 'rgba(148, 163, 184, 0.08)' } },
            y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { display: false } }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
      this.charts.push(barChart);
    }

    // Detailed Module Bar Chart
    const detailedCtx = document.getElementById('detailedBarChart');
    if (detailedCtx) {
      const allCats = [];
      modules.forEach(mod => {
        mod.categories.forEach(cat => {
          allCats.push({ name: `${cat.name}`, percentage: cat.percentage, module: mod.name });
        });
      });

      const detailedChart = new Chart(detailedCtx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: allCats.map(c => c.name.length > 30 ? c.name.substring(0, 27) + '…' : c.name),
          datasets: [{
            label: 'Score %',
            data: allCats.map(c => c.percentage),
            backgroundColor: allCats.map(c => {
              if (c.percentage < 30) return 'rgba(239, 68, 68, 0.5)';
              if (c.percentage < 60) return 'rgba(245, 158, 11, 0.5)';
              if (c.percentage < 80) return 'rgba(16, 185, 129, 0.5)';
              return 'rgba(0, 212, 255, 0.5)';
            }),
            borderColor: allCats.map(c => {
              if (c.percentage < 30) return '#ef4444';
              if (c.percentage < 60) return '#f59e0b';
              if (c.percentage < 80) return '#10b981';
              return '#00d4ff';
            }),
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, max: 100, ticks: { color: '#64748b' }, grid: { color: 'rgba(148, 163, 184, 0.08)' } },
            x: { ticks: { color: '#94a3b8', font: { size: 9 }, maxRotation: 45 }, grid: { display: false } }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                afterLabel: (ctx) => `Module: ${allCats[ctx.dataIndex].module}`
              }
            }
          }
        }
      });
      this.charts.push(detailedChart);
    }

    // Animate gauge
    this.animateGauge();
  }

  animateGauge() {
    const scoreEl = document.getElementById('gauge-score-num');
    if (!scoreEl) return;
    const target = this.scores.overall.percentage;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 60));
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

  async exportPDF() {
    const element = document.getElementById('report-content');
    if (!element) return;

    // Show loading
    const btn = event.target;
    const origText = btn.innerHTML;
    btn.innerHTML = '⏳ Generating PDF...';
    btn.disabled = true;

    try {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${this.framework.shortName}_Assessment_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0a0e1a' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF export requires html2pdf.js library. Please check your internet connection.');
    }

    btn.innerHTML = origText;
    btn.disabled = false;
  }
}
