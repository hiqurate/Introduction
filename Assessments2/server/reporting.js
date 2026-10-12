// ============================================
// HawkSight — Report issuance
// Reports are computed on the server from stored answers and frozen as an
// immutable snapshot with a content hash.
// ============================================

const content = require('./content');
const { parseJson } = require('./services');

async function issueReport(db, services, { assessment, user, reviewType, issuedAt = null, title = null, assessorName: assessorOverride = null }) {
  const config = await services.getActiveConfig();
  const result = await services.scoreAssessmentRow(assessment, config);
  const framework = content.FRAMEWORKS[assessment.framework_id];
  const tenant = await db.get('SELECT * FROM tenants WHERE id = ?', [assessment.tenant_id]);
  // Versions run across cycles for the same organisation and template.
  const prev = await db.get('SELECT MAX(version) AS v FROM reports WHERE tenant_id = ? AND framework_id = ?', [assessment.tenant_id, assessment.framework_id]);
  const version = (prev && prev.v ? prev.v : 0) + 1;
  const profile = parseJson(assessment.profile_json, {});
  const answers = parseJson(assessment.answers_json, {});
  const branding = parseJson(tenant.branding_json, {});
  const aiSummary = assessment.ai_summary_status === 'approved' ? assessment.ai_summary : null;
  let assessorName = assessorOverride;
  if (!assessorName && assessment.assessor_id) {
    const a = await db.get('SELECT name, email FROM users WHERE id = ?', [assessment.assessor_id]);
    if (a) assessorName = a.name || a.email;
  }
  const frameworkVersion = `${framework.shortName} template ${framework.templateVersion} (${framework.basis})`;
  const reportTitle = title || `${framework.name} — ${profile.organizationName || tenant.name}`;
  const issued = issuedAt || new Date().toISOString();

  const hashPayload = {
    tenantId: tenant.id, assessmentId: assessment.id, version, frameworkId: assessment.framework_id,
    result, profile, answers, reviewType, issuedAt: issued
  };
  const contentHash = services.hashReport(hashPayload);

  const ins = await db.run(`INSERT INTO reports (tenant_id, assessment_id, framework_id, version, title, review_type,
      scoring_model_version, config_version, framework_version, result_json, profile_json, answers_json, branding_json,
      ai_summary, assessor_name, health_score, risk_score, content_hash, issued_by, issued_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [tenant.id, assessment.id, assessment.framework_id, version, reportTitle, reviewType,
    result.meta.scoringModelVersion, result.meta.configVersion, frameworkVersion, JSON.stringify(result), JSON.stringify(profile),
    JSON.stringify(answers), JSON.stringify(branding), aiSummary, assessorName, result.overall.healthScore, result.overall.riskScore,
    contentHash, user ? user.id : null, issued]);

  return { id: ins.lastID, version, contentHash, result };
}

// Recompute the hash of a stored report to prove it has not changed.
function verifyReportRow(services, row) {
  const payload = {
    tenantId: row.tenant_id, assessmentId: row.assessment_id, version: row.version, frameworkId: row.framework_id,
    result: parseJson(row.result_json, {}), profile: parseJson(row.profile_json, {}), answers: parseJson(row.answers_json, {}),
    reviewType: row.review_type, issuedAt: row.issued_at
  };
  return services.hashReport(payload) === row.content_hash;
}

module.exports = { issueReport, verifyReportRow };
