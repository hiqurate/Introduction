// AI assistance. AI output is advisory: it explains questions and drafts an
// executive narrative from verified results. It never changes answers or
// scores, and drafts must be reviewed and approved before use in a report.

const content = require('../content');

const MODEL = process.env.AI_MODEL || 'llama-3.1-8b-instant';
const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

async function complete(messages, { maxTokens = 900, temperature = 0.3 } = {}) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    const err = new Error('AI assistance is not configured on this server');
    err.status = 503;
    throw err;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: MODEL, messages, temperature, max_tokens: maxTokens }),
      signal: controller.signal
    });
    if (!res.ok) {
      const err = new Error('The AI provider could not complete the request');
      err.status = 502;
      throw err;
    }
    const data = await res.json();
    return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || '').trim();
  } finally {
    clearTimeout(timer);
  }
}

const SYSTEM = 'You are a senior cybersecurity assessor writing for business and IT audiences. Write in plain, precise British English. '
  + 'Do not use emoji, exclamation marks, marketing language or sales pitches. Do not invent facts, statistics, certifications or regulatory deadlines. '
  + 'If information is not provided, say so. Use short paragraphs and simple bullet lists where helpful.';

module.exports = function aiRoutes(app, ctx) {
  const { db, services, security, asyncHandler } = ctx;
  const { HttpError } = security;
  const auth = ctx.requireAuth;
  const limiter = security.rateLimit({ windowMs: 60 * 60 * 1000, max: 40, key: req => `ai:${req.user ? req.user.id : req.ip}`, message: 'AI request limit reached. Try again later.' });

  app.get('/api/ai/status', auth, (req, res) => {
    res.json({ available: !!process.env.GROQ_API_KEY });
  });

  // Question guidance. Only the question text and template guidance are sent
  // to the provider; no customer answers, names or evidence.
  app.post('/api/ai/explain', auth, limiter, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'ai:use');
    const a = await services.loadAssessment(req.user, req.body.assessmentId);
    const found = content.findQuestion(a.framework_id, String(req.body.questionId || ''));
    if (!found) throw new HttpError(400, 'Unknown question');
    const mode = ['explain', 'evidence', 'implement'].includes(req.body.mode) ? req.body.mode : 'explain';
    const prompts = {
      explain: 'Explain what this control means in practice, why it matters, and what "fully implemented" typically looks like. Do not tell the user which answer to choose.',
      evidence: 'List the kinds of evidence an assessor would normally accept for this control, with one line on what each should show.',
      implement: 'Outline practical steps to implement this control, ordered from quick wins to longer-term measures. Keep it vendor-neutral.'
    };
    const q = found.question;
    const text = await complete([
      { role: 'system', content: SYSTEM },
      { role: 'user', content: `Assessment: ${content.FRAMEWORKS[a.framework_id].name}\nArea: ${found.module.name} / ${found.category.name}\nControl question: ${q.text}\nTemplate guidance: ${q.context || 'none'}\n\n${prompts[mode]} Limit to 220 words.` }
    ], { maxTokens: 500 });
    await services.event(req, 'ai_explain', { tenantId: a.tenant_id, frameworkId: a.framework_id, assessmentId: a.id, meta: { mode } });
    res.json({ text, model: MODEL, generatedAt: new Date().toISOString() });
  }));

  // Executive summary draft built only from the server-computed results.
  app.post('/api/assessments/:id/ai-summary', auth, limiter, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'report:issue');
    const a = await services.loadAssessment(req.user, req.params.id);
    const result = await services.scoreAssessmentRow(a);
    if (!result.overall.completion.answered) throw new HttpError(409, 'Answer questions before generating a summary');
    const profile = services.parseJson(a.profile_json, {});
    const fw = content.FRAMEWORKS[a.framework_id];
    const top = result.findings.slice(0, 8).map(f => `- [${f.severityLabel}] ${f.controlName || 'Control'}: ${f.question} (current state: ${f.answerLabel || f.state})`).join('\n');
    const domains = result.modules.filter(m => m.percentage !== null).map(m => `- ${m.name}: ${m.percentage}% (${m.maturity.name})`).join('\n');
    const facts = `Organisation profile: ${profile.employeeCount || 'size not stated'} employees, industry ${profile.industry || 'not stated'}, IT environment ${profile.itEnvironment || 'not stated'}.
Assessment: ${fw.name}.
Cyber Health Score: ${result.overall.healthScore} (${result.overall.healthBand})${result.overall.capped ? `; ${result.overall.capReason}` : ''}.
Overall maturity: ${result.overall.maturity ? result.overall.maturity.name : 'not determined'}.
Risk exposure: ${result.overall.riskScore} (${result.overall.riskBand}).
Score confidence: ${result.overall.confidence.label} (${result.overall.confidence.factors.completion}% complete, evidence quality ${result.overall.confidence.factors.evidenceQuality}%).
Findings by severity: ${Object.entries(result.severityCounts).map(([k, v]) => `${k} ${v}`).join(', ')}.
Domain results:
${domains}
Highest-priority findings:
${top || '- none'}`;
    const text = await complete([
      { role: 'system', content: SYSTEM },
      { role: 'user', content: `Write an executive summary of four short paragraphs for the leadership of the assessed organisation, using only the facts below. Paragraph 1: overall posture and what the scores mean. Paragraph 2: the most significant risks and their business consequences. Paragraph 3: the priority actions for the next 90 days. Paragraph 4: how confident readers can be in these results and what would increase confidence. Do not name the organisation. Do not add facts.\n\n${facts}` }
    ], { maxTokens: 900 });
    await db.run("UPDATE assessments SET ai_summary = ?, ai_summary_status = 'draft', updated_at = ? WHERE id = ?", [text, new Date().toISOString(), a.id]);
    await services.audit(req, 'AI_SUMMARY_DRAFTED', { tenantId: a.tenant_id, target: `assessment:${a.id}`, details: { model: MODEL } });
    res.json({ text, status: 'draft', model: MODEL });
  }));

  app.put('/api/assessments/:id/ai-summary', auth, asyncHandler(async (req, res) => {
    services.assertCan(req.user, 'report:issue');
    const a = await services.loadAssessment(req.user, req.params.id);
    const text = String(req.body.text || '').trim();
    const status = req.body.status === 'approved' ? 'approved' : req.body.status === 'discarded' ? null : 'draft';
    await db.run('UPDATE assessments SET ai_summary = ?, ai_summary_status = ?, updated_at = ? WHERE id = ?',
      [status ? text.slice(0, 8000) : null, status, new Date().toISOString(), a.id]);
    await services.audit(req, status === 'approved' ? 'AI_SUMMARY_APPROVED' : status ? 'AI_SUMMARY_EDITED' : 'AI_SUMMARY_DISCARDED', { tenantId: a.tenant_id, target: `assessment:${a.id}` });
    res.json({ text: status ? text : null, status });
  }));
};
