// Organisations (tenants): creation, settings, entitlements, assessors,
// organisation profile and report branding.

const content = require('../content');

const PACKAGES = ['snapshot', 'comprehensive', 'managed'];
const FREQUENCIES = ['', 'quarterly', 'semiannual', 'annual'];

const PROFILE_FIELDS = {
  organizationName: 'string', industry: 'string', employeeCount: 'string', officeLocations: 'number',
  geography: 'array', itEnvironment: 'string', regulations: 'array', dataTypes: 'array', technology: 'array',
  developsSoftware: 'string', internetFacing: 'string', businessCriticality: 'string', criticalServices: 'string',
  securityTools: 'array', recentIncidents: 'string', securityConcerns: 'string', plannedImprovements: 'string',
  requirementsDetails: 'string', defaultOwner: 'string', businessDescription: 'string'
};

function cleanProfile(input) {
  const out = {};
  Object.keys(PROFILE_FIELDS).forEach(k => {
    const v = input[k];
    if (v === undefined || v === null) return;
    const type = PROFILE_FIELDS[k];
    if (type === 'string') out[k] = String(v).slice(0, 2000);
    else if (type === 'number') { const n = Number(v); if (Number.isFinite(n) && n >= 0 && n < 100000) out[k] = n; }
    else if (type === 'array' && Array.isArray(v)) out[k] = v.map(x => String(x).slice(0, 80)).slice(0, 40);
  });
  return out;
}

module.exports = function tenantRoutes(app, ctx) {
  const { db, services, security, asyncHandler } = ctx;
  const { HttpError, ROLES } = security;
  const auth = ctx.requireAuth;

  async function tenantSummary(t) {
    const frameworks = (await db.all('SELECT framework_id FROM tenant_frameworks WHERE tenant_id = ?', [t.id])).map(r => r.framework_id);
    const assessors = await db.all('SELECT u.id, u.name, u.email FROM tenant_assessors ta JOIN users u ON u.id = ta.user_id WHERE ta.tenant_id = ?', [t.id]);
    const counts = await db.get(`SELECT
        (SELECT COUNT(*) FROM users WHERE tenant_id = ?) AS users,
        (SELECT COUNT(*) FROM assessments WHERE tenant_id = ? AND status != 'archived') AS assessments,
        (SELECT COUNT(*) FROM reports WHERE tenant_id = ?) AS reports,
        (SELECT MAX(issued_at) FROM reports WHERE tenant_id = ?) AS last_report_at`, [t.id, t.id, t.id, t.id]);
    return {
      id: t.id, name: t.name, industry: t.industry, size: t.size, country: t.country, status: t.status,
      isDemo: !!t.is_demo, package: t.package, reassessmentFrequency: t.reassessment_frequency || '',
      branding: services.parseJson(t.branding_json, {}), createdAt: t.created_at,
      frameworks, assessors, counts
    };
  }

  app.get('/api/tenants', auth, asyncHandler(async (req, res) => {
    const ids = await services.accessibleTenantIds(req.user);
    const rows = ids === null
      ? await db.all('SELECT * FROM tenants ORDER BY is_demo DESC, name')
      : ids.length ? await db.all(`SELECT * FROM tenants WHERE id IN (${ids.map(() => '?').join(',')}) ORDER BY name`, ids) : [];
    const tenants = [];
    for (const t of rows) tenants.push(await tenantSummary(t));
    res.json({ tenants });
  }));

  app.post('/api/tenants', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'tenants:manage');
    const name = String(req.body.name || '').trim();
    if (!name) throw new HttpError(400, 'Organisation name is required');
    const pkg = PACKAGES.includes(req.body.package) ? req.body.package : 'snapshot';
    const frameworks = (Array.isArray(req.body.frameworks) ? req.body.frameworks : []).filter(content.isFramework);
    const id = await db.transaction(async tx => {
      // Managed organisations reassess on a schedule by default.
      const r = await tx.run('INSERT INTO tenants (name, industry, size, country, package, reassessment_frequency) VALUES (?, ?, ?, ?, ?, ?)',
        [name.slice(0, 160), String(req.body.industry || '').slice(0, 60), String(req.body.size || '').slice(0, 40), String(req.body.country || '').slice(0, 60), pkg, pkg === 'managed' ? 'semiannual' : null]);
      for (const f of frameworks) await tx.run('INSERT INTO tenant_frameworks (tenant_id, framework_id) VALUES (?, ?)', [r.lastID, f]);
      await tx.run('INSERT INTO tenant_profiles (tenant_id, profile_json) VALUES (?, ?)', [r.lastID, JSON.stringify({ organizationName: name, industry: req.body.industry || '' })]);
      return r.lastID;
    });
    await services.audit(req, 'TENANT_CREATED', { tenantId: id, target: `tenant:${id}`, details: { name, package: pkg, frameworks } });
    res.status(201).json({ tenant: await tenantSummary(await db.get('SELECT * FROM tenants WHERE id = ?', [id])) });
  }));

  app.get('/api/tenants/:id', auth, asyncHandler(async (req, res) => {
    const t = await services.requireTenant(req.user, req.params.id);
    const profileRow = await db.get('SELECT profile_json, updated_at FROM tenant_profiles WHERE tenant_id = ?', [t.id]);
    res.json({ tenant: await tenantSummary(t), profile: services.parseJson(profileRow && profileRow.profile_json, {}), profileUpdatedAt: profileRow && profileRow.updated_at });
  }));

  app.patch('/api/tenants/:id', auth, asyncHandler(async (req, res) => {
    const t = await services.requireTenant(req.user, req.params.id);
    const isPlatform = req.user.role === ROLES.PLATFORM_ADMIN;
    const isCustomerAdmin = req.user.role === ROLES.CUSTOMER_ADMIN;
    if (!isPlatform && !isCustomerAdmin) throw new HttpError(403, 'You do not have permission to change organisation settings');
    const b = req.body;
    const changes = {};
    if (isPlatform) {
      if (b.name !== undefined) changes.name = String(b.name).trim().slice(0, 160) || t.name;
      if (b.industry !== undefined) changes.industry = String(b.industry).slice(0, 60);
      if (b.size !== undefined) changes.size = String(b.size).slice(0, 40);
      if (b.country !== undefined) changes.country = String(b.country).slice(0, 60);
      if (b.status !== undefined && ['active', 'suspended'].includes(b.status)) changes.status = b.status;
      if (b.package !== undefined && PACKAGES.includes(b.package)) changes.package = b.package;
    }
    if (b.reassessmentFrequency !== undefined && FREQUENCIES.includes(b.reassessmentFrequency)) changes.reassessment_frequency = b.reassessmentFrequency;

    await db.transaction(async tx => {
      const keys = Object.keys(changes);
      if (keys.length) await tx.run(`UPDATE tenants SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`, [...keys.map(k => changes[k]), t.id]);
      if (isPlatform && Array.isArray(b.frameworks)) {
        await tx.run('DELETE FROM tenant_frameworks WHERE tenant_id = ?', [t.id]);
        for (const f of b.frameworks.filter(content.isFramework)) await tx.run('INSERT INTO tenant_frameworks (tenant_id, framework_id) VALUES (?, ?)', [t.id, f]);
      }
      if (isPlatform && Array.isArray(b.assessorIds)) {
        await tx.run('DELETE FROM tenant_assessors WHERE tenant_id = ?', [t.id]);
        for (const uid of b.assessorIds) {
          const u = await tx.get('SELECT id FROM users WHERE id = ? AND role = ?', [uid, ROLES.ASSESSOR]);
          if (u) await tx.run('INSERT INTO tenant_assessors (tenant_id, user_id) VALUES (?, ?)', [t.id, u.id]);
        }
      }
    });
    await services.audit(req, 'TENANT_UPDATED', { tenantId: t.id, target: `tenant:${t.id}`, details: { ...changes, frameworks: b.frameworks, assessorIds: b.assessorIds } });
    res.json({ tenant: await tenantSummary(await db.get('SELECT * FROM tenants WHERE id = ?', [t.id])) });
  }));

  app.delete('/api/tenants/:id', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'tenants:manage');
    const t = await services.requireTenant(req.user, req.params.id);
    if (String(req.body.confirmName || '') !== t.name) throw new HttpError(400, 'Type the organisation name to confirm deletion');
    const evidence = await db.all('SELECT storage_key FROM evidence WHERE tenant_id = ? AND storage_key IS NOT NULL', [t.id]);
    await db.run('DELETE FROM tenants WHERE id = ?', [t.id]);
    for (const e of evidence) await ctx.evidenceStore.remove(e.storage_key);
    await services.audit(req, 'TENANT_DELETED', { tenantId: t.id, target: `tenant:${t.id}`, details: { name: t.name } });
    res.json({ ok: true });
  }));

  // Organisation profile (risk context)
  app.get('/api/tenants/:id/profile', auth, asyncHandler(async (req, res) => {
    const t = await services.requireTenant(req.user, req.params.id);
    const row = await db.get('SELECT profile_json, updated_at FROM tenant_profiles WHERE tenant_id = ?', [t.id]);
    res.json({ profile: services.parseJson(row && row.profile_json, {}), updatedAt: row && row.updated_at });
  }));

  app.put('/api/tenants/:id/profile', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'profile:edit');
    const t = await services.requireTenant(req.user, req.params.id);
    const profile = cleanProfile(req.body.profile || {});
    if (!profile.organizationName) throw new HttpError(400, 'Organisation name is required');
    if (!profile.industry) throw new HttpError(400, 'Industry is required');
    if (!profile.employeeCount) throw new HttpError(400, 'Organisation size is required');
    await db.run(`INSERT INTO tenant_profiles (tenant_id, profile_json, updated_by, updated_at) VALUES (?, ?, ?, ?)
      ON CONFLICT(tenant_id) DO UPDATE SET profile_json = excluded.profile_json, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
    [t.id, JSON.stringify(profile), req.user.id, new Date().toISOString()]);
    // Keep open assessments in step with the organisation profile.
    await db.run("UPDATE assessments SET profile_json = ?, updated_at = ? WHERE tenant_id = ? AND status IN ('in_progress', 'evidence_requested')",
      [JSON.stringify(profile), new Date().toISOString(), t.id]);
    await services.audit(req, 'PROFILE_UPDATED', { tenantId: t.id, target: `tenant:${t.id}` });
    res.json({ profile });
  }));

  app.put('/api/tenants/:id/branding', auth, asyncHandler(async (req, res) => {
    const t = await services.requireTenant(req.user, req.params.id);
    if (![ROLES.PLATFORM_ADMIN, ROLES.CUSTOMER_ADMIN].includes(req.user.role)) throw new HttpError(403, 'You do not have permission to change branding');
    const b = req.body || {};
    const branding = {};
    if (b.logoDataUrl) {
      const m = /^data:(image\/png|image\/jpeg);base64,([A-Za-z0-9+/=]+)$/.exec(String(b.logoDataUrl));
      if (!m) throw new HttpError(400, 'Logo must be a PNG or JPEG image');
      if (Buffer.from(m[2], 'base64').length > 300 * 1024) throw new HttpError(400, 'Logo must be smaller than 300 KB');
      branding.logoDataUrl = b.logoDataUrl;
    }
    if (b.primaryColor) {
      if (!/^#[0-9a-fA-F]{6}$/.test(b.primaryColor)) throw new HttpError(400, 'Colour must be a hex value such as #1F4E8C');
      branding.primaryColor = b.primaryColor;
    }
    if (b.reportFooter !== undefined) branding.reportFooter = String(b.reportFooter).slice(0, 300);
    if (b.preparedBy !== undefined) branding.preparedBy = String(b.preparedBy).slice(0, 120);
    await db.run('UPDATE tenants SET branding_json = ? WHERE id = ?', [JSON.stringify(branding), t.id]);
    await services.audit(req, 'BRANDING_UPDATED', { tenantId: t.id, target: `tenant:${t.id}` });
    res.json({ branding });
  }));
};

module.exports.cleanProfile = cleanProfile;
