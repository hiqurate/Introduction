// Issued reports, report comparison, score history and benchmarks.

const content = require('../content');
const { verifyReportRow } = require('../reporting');

module.exports = function reportRoutes(app, ctx) {
  const { db, services, security, asyncHandler } = ctx;
  const { HttpError } = security;
  const auth = ctx.requireAuth;

  function summary(r) {
    const fw = content.FRAMEWORKS[r.framework_id];
    return {
      id: r.id, tenantId: r.tenant_id, assessmentId: r.assessment_id, frameworkId: r.framework_id,
      frameworkName: fw ? fw.name : r.framework_id, frameworkShortName: fw ? fw.shortName : r.framework_id,
      version: r.version, title: r.title, reviewType: r.review_type, healthScore: r.health_score, riskScore: r.risk_score,
      issuedAt: r.issued_at, contentHash: r.content_hash
    };
  }

  async function loadReport(user, id) {
    const r = await db.get('SELECT * FROM reports WHERE id = ?', [id]);
    if (!r || !(await services.canAccessTenant(user, r.tenant_id))) throw new HttpError(404, 'Report not found');
    return r;
  }

  app.get('/api/reports', auth, asyncHandler(async (req, res) => {
    let rows;
    const params = [];
    let where = '1 = 1';
    if (req.query.tenantId) {
      const t = await services.requireTenant(req.user, req.query.tenantId);
      where += ' AND tenant_id = ?'; params.push(t.id);
    } else {
      const ids = await services.accessibleTenantIds(req.user);
      if (ids !== null) {
        if (!ids.length) return res.json({ reports: [] });
        where += ` AND tenant_id IN (${ids.map(() => '?').join(',')})`; params.push(...ids);
      }
    }
    if (req.query.frameworkId) { where += ' AND framework_id = ?'; params.push(String(req.query.frameworkId)); }
    rows = await db.all(`SELECT id, tenant_id, assessment_id, framework_id, version, title, review_type, health_score, risk_score, issued_at, content_hash
      FROM reports WHERE ${where} ORDER BY issued_at DESC`, params);
    res.json({ reports: rows.map(summary) });
  }));

  app.get('/api/reports/:id', auth, asyncHandler(async (req, res) => {
    const r = await loadReport(req.user, req.params.id);
    const tenant = await db.get('SELECT id, name, is_demo FROM tenants WHERE id = ?', [r.tenant_id]);
    const fw = content.FRAMEWORKS[r.framework_id];
    const previous = await db.get('SELECT id, version, issued_at, health_score FROM reports WHERE tenant_id = ? AND framework_id = ? AND issued_at < ? ORDER BY issued_at DESC LIMIT 1',
      [r.tenant_id, r.framework_id, r.issued_at]);
    const history = await db.all('SELECT id, version, issued_at, health_score, risk_score FROM reports WHERE tenant_id = ? AND framework_id = ? ORDER BY issued_at ASC',
      [r.tenant_id, r.framework_id]);
    await services.event(req, 'report_viewed', { tenantId: r.tenant_id, frameworkId: r.framework_id, assessmentId: r.assessment_id, meta: { reportId: r.id } });
    res.json({
      report: {
        ...summary(r),
        frameworkVersion: r.framework_version,
        scoringModelVersion: r.scoring_model_version,
        configVersion: r.config_version,
        framework: fw ? { name: fw.name, shortName: fw.shortName, templateVersion: fw.templateVersion, basis: fw.basis, referenceFrameworks: fw.referenceFrameworks } : null,
        result: services.parseJson(r.result_json, {}),
        profile: services.parseJson(r.profile_json, {}),
        branding: services.parseJson(r.branding_json, {}),
        aiSummary: r.ai_summary,
        assessorName: r.assessor_name,
        tenant: { id: tenant.id, name: tenant.name, isDemo: !!tenant.is_demo }
      },
      previous: previous ? { id: previous.id, version: previous.version, issuedAt: previous.issued_at, healthScore: previous.health_score } : null,
      history: history.map(h => ({ id: h.id, version: h.version, issuedAt: h.issued_at, healthScore: h.health_score, riskScore: h.risk_score }))
    });
  }));

  app.get('/api/reports/:id/verify', auth, asyncHandler(async (req, res) => {
    const r = await loadReport(req.user, req.params.id);
    res.json({ verified: verifyReportRow(services, r), contentHash: r.content_hash });
  }));

  app.post('/api/reports/:id/exported', auth, asyncHandler(async (req, res) => {
    const r = await loadReport(req.user, req.params.id);
    await services.audit(req, 'REPORT_EXPORTED', { tenantId: r.tenant_id, target: `report:${r.id}`, details: { format: String(req.body.format || 'pdf').slice(0, 10) } });
    await services.event(req, 'report_exported', { tenantId: r.tenant_id, frameworkId: r.framework_id, meta: { reportId: r.id } });
    res.json({ ok: true });
  }));

  // Compare two reports of the same template for the same organisation.
  app.get('/api/reports/compare/:baseId/:targetId', auth, asyncHandler(async (req, res) => {
    const base = await loadReport(req.user, req.params.baseId);
    const target = await loadReport(req.user, req.params.targetId);
    if (base.tenant_id !== target.tenant_id || base.framework_id !== target.framework_id) {
      throw new HttpError(400, 'Reports must be for the same organisation and assessment template');
    }
    const b = services.parseJson(base.result_json, {});
    const t = services.parseJson(target.result_json, {});
    const bFindings = new Map((b.findings || []).map(f => [f.id, f]));
    const tFindings = new Map((t.findings || []).map(f => [f.id, f]));
    const newFindings = [];
    const closed = [];
    const recurring = [];
    for (const [id, f] of tFindings) {
      if (bFindings.has(id)) recurring.push({ ...f, previousSeverity: bFindings.get(id).severity });
      else newFindings.push(f);
    }
    for (const [id, f] of bFindings) if (!tFindings.has(id)) closed.push(f);
    const domains = (t.modules || []).map(m => {
      const prev = (b.modules || []).find(x => x.id === m.id);
      return {
        id: m.id, name: m.name,
        before: prev ? prev.percentage : null, after: m.percentage,
        delta: prev && prev.percentage !== null && m.percentage !== null ? m.percentage - prev.percentage : null,
        maturityBefore: prev && prev.maturity ? prev.maturity.name : null,
        maturityAfter: m.maturity ? m.maturity.name : null
      };
    });
    res.json({
      base: summary(base),
      target: summary(target),
      overall: {
        healthBefore: b.overall.healthScore, healthAfter: t.overall.healthScore,
        riskBefore: b.overall.riskScore, riskAfter: t.overall.riskScore,
        maturityBefore: b.overall.maturity ? b.overall.maturity.name : null,
        maturityAfter: t.overall.maturity ? t.overall.maturity.name : null,
        severityBefore: b.severityCounts, severityAfter: t.severityCounts
      },
      domains,
      findings: { new: newFindings, closed, recurring }
    });
  }));

  // Benchmarks use the latest issued report per organisation and are only
  // shown when the population meets the configured minimum.
  app.get('/api/benchmarks/:frameworkId', auth, asyncHandler(async (req, res) => {
    const frameworkId = String(req.params.frameworkId);
    if (!content.isFramework(frameworkId)) throw new HttpError(404, 'Unknown assessment template');
    const config = await services.getActiveConfig();
    const minimum = config.benchmarkMinimumPopulation || 10;
    let industry = null;
    if (req.query.tenantId) {
      const t = await services.requireTenant(req.user, req.query.tenantId);
      industry = t.industry || null;
    }
    const rows = await db.all(`SELECT r.tenant_id, r.health_score, r.result_json, r.issued_at, t.industry
      FROM reports r JOIN tenants t ON t.id = r.tenant_id
      WHERE r.framework_id = ? AND t.is_demo = 0
        AND r.issued_at = (SELECT MAX(r2.issued_at) FROM reports r2 WHERE r2.tenant_id = r.tenant_id AND r2.framework_id = r.framework_id)`, [frameworkId]);

    function stats(list) {
      const scores = list.map(r => r.health_score).filter(s => s !== null).sort((x, y) => x - y);
      const q = p => scores.length ? scores[Math.min(scores.length - 1, Math.floor(p * (scores.length - 1)))] : null;
      const dates = list.map(r => r.issued_at).sort();
      const domainTotals = {};
      list.forEach(r => {
        const result = services.parseJson(r.result_json, {});
        (result.modules || []).forEach(m => {
          if (m.percentage === null) return;
          if (!domainTotals[m.id]) domainTotals[m.id] = { id: m.id, name: m.name, values: [] };
          domainTotals[m.id].values.push(m.percentage);
        });
      });
      const domains = Object.values(domainTotals).map(d => {
        const v = d.values.sort((x, y) => x - y);
        return { id: d.id, name: d.name, median: v[Math.floor((v.length - 1) / 2)], count: v.length };
      });
      return { population: scores.length, median: q(0.5), lowerQuartile: q(0.25), upperQuartile: q(0.75), from: dates[0] || null, to: dates[dates.length - 1] || null, domains };
    }

    const all = stats(rows);
    const cohort = industry ? stats(rows.filter(r => r.industry === industry)) : null;
    res.json({
      minimumPopulation: minimum,
      overall: all.population >= minimum ? { available: true, ...all } : { available: false, population: all.population },
      industry: cohort ? (cohort.population >= minimum ? { available: true, industry, ...cohort } : { available: false, industry, population: cohort.population }) : null,
      methodology: `Benchmarks use the most recent issued report for each organisation (demonstration data excluded). Results are shown only when at least ${minimum} organisations contribute, and individual organisations are never identified.`
    });
  }));
};
