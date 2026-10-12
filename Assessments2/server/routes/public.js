// Public, unauthenticated endpoints: health, catalogue, methodology and the
// fictional sample report used on the landing page.

const Scoring = require('../../js/engine/scoring.js');
const Controls = require('../../js/engine/control-library.js');
const content = require('../content');
const demo = require('../demo');

let cachedSample = {};

module.exports = function publicRoutes(app, { asyncHandler, services }) {
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/public/catalog', (req, res) => {
    res.json({ frameworks: content.catalog() });
  });

  app.get('/api/public/methodology', asyncHandler(async (req, res) => {
    const cfg = await services.getActiveConfig();
    res.json({
      scoringModelVersion: Scoring.SCORING_MODEL_VERSION,
      configVersion: cfg.version,
      tiers: Object.values(Controls.CRITICALITY_TIERS).map(t => ({ ...t, weight: cfg.tierWeights[t.id] })),
      maturityLevels: Scoring.MATURITY_LEVELS,
      severityMatrix: Scoring.SEVERITY_MATRIX,
      severityTimeframes: Scoring.SEVERITY_TIMEFRAME,
      confidenceLevels: Scoring.CONFIDENCE_LEVELS,
      gating: cfg.gating,
      scoreBands: cfg.scoreBands,
      riskBands: cfg.riskBands,
      referenceFrameworks: Object.values(Controls.FRAMEWORK_REFERENCES),
      controlCount: Controls.CONTROLS.length,
      staleAfterDays: cfg.staleAfterDays,
      domains: Controls.DOMAINS
    });
  }));

  app.get('/api/public/sample-report', asyncHandler(async (req, res) => {
    const cfg = await services.getActiveConfig();
    const plan = req.query.plan === 'snapshot' ? 'snapshot' : 'comprehensive';
    const cached = cachedSample[plan];
    if (!cached || cached.result.meta.configVersion !== cfg.version) {
      const s = demo.sampleReport(cfg, plan === 'snapshot' ? 'core' : 'full');
      const fw = content.FRAMEWORKS.healthcare;
      cachedSample[plan] = {
        sample: true,
        title: `${fw.name} — ${s.profile.organizationName}`,
        frameworkId: 'healthcare',
        framework: { name: fw.name, shortName: fw.shortName, templateVersion: fw.templateVersion, basis: fw.basis },
        reviewType: plan === 'snapshot' ? 'Self-assessed' : 'Sample report (fictional data)',
        issuedAt: new Date().toISOString(),
        profile: s.profile,
        result: s.result
      };
    }
    res.json(cachedSample[plan]);
  }));
};
