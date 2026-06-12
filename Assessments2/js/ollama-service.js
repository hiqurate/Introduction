// ============================================
// Hiqurates — AI Recommendation Service
// Uses credentials from js/ai-config.js
// ============================================

class AIService {
  constructor() {
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    const c = typeof HIQURATES_AI_CONFIG !== 'undefined' ? HIQURATES_AI_CONFIG : {};

    this.provider = c.provider || 'groq';
    this.apiKey = c.geminiApiKey || '';
    this.model = c.geminiModel || 'gemini-2.0-flash';
    this.ollamaUrl = c.ollamaUrl || 'http://localhost:11434';
    this.ollamaModel = c.ollamaModel || 'llama3';
    this.groqApiKey = c.groqApiKey || '';
    this.groqModel = c.groqModel || 'llama-3.1-8b-instant';

    // Server-side proxy endpoints (key stays on server)
    this.proxyCompleteUrl = c.proxyCompleteUrl || '/api/ai/complete';
    this.proxyStreamUrl = c.proxyStreamUrl || '/api/ai/stream';

    this.isConfigured = this.checkConfigured();
  }

  checkConfigured() {
    if (this.provider === 'ollama') return !!this.ollamaUrl;
    if (this.provider === 'groq') return true; // key is on the server
    return !!this.apiKey;
  }

  /**
   * Check if API key is valid by making a small test request
   */
  async checkAvailability() {
    if (!this.apiKey) return false;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(
        `${this.apiUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Say "ok"' }] }],
            generationConfig: { maxOutputTokens: 5 }
          }),
          signal: controller.signal
        }
      );
      clearTimeout(timeout);
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  /**
   * Build the prompt from assessment data
   */
  buildPrompt(frameworkName, overallScore, gaps, recommendations, modules, orgSettings = {}) {
    const orgName = orgSettings.organizationName || 'Organization';
    const employees = orgSettings.employeeCount || 'not specified';
    const offices = orgSettings.officeLocations || 'not specified';
    const tools = (orgSettings.securityTools || []).join(', ') || 'None reported';

    const gapSummary = gaps.slice(0, 10).map(g =>
      `- ${g.name}: ${g.percentage}% (${g.severityLabel} severity, ${g.answered}/${g.total} answered)`
    ).join('\n');

    const moduleSummary = modules.map(m =>
      `- ${m.name}: ${m.percentage}%`
    ).join('\n');

    const recSummary = recommendations.slice(0, 5).map(r =>
      `- [${r.priority}] ${r.title}: ${r.description}`
    ).join('\n');

    return `You are an expert cybersecurity advisory consultant from HiQurate.
Based on the following ${frameworkName} assessment results, provide specific, highly tailored, and actionable remediation recommendations for ${orgName}.

## Organization Profile
- Company Name: ${orgName}
- Company Size: ${employees} employees
- Office Locations: ${offices} locations
- Existing Security Technologies: ${tools}

## Assessment Overview
- Overall Score: ${overallScore}%
- Framework: ${frameworkName}

## Module Scores
${moduleSummary}

## Identified Gaps (areas scoring below 70%)
${gapSummary || 'No significant gaps identified.'}

## Current Recommendations
${recSummary || 'No critical recommendations.'}

## Instructions for Report Generation & Advisory Alignment:
1. **Contextual Tailoring**: Customize all findings, risks, and timelines specifically to the company's size (${employees} employees) and footprint (${offices} locations). For example, a larger footprint requires centralized, automated controls rather than localized manual checks.
2. **Existing Technologies Integration**: Do not suggest implementing tools they already have (which are: ${tools}). Instead, recommend *integrating* or *optimizing* those existing technologies (e.g. integrating EDR logs with SIEM).
3. **Advisory Remediation Pathways**: Provide a natural, professional path toward HiQurate's security remediation services. The tone must be expert and advisory, NOT sales-oriented.
   - For example: if they lack SIEM: "The organization currently lacks centralized security monitoring and alert management capabilities. Implementing a SIEM platform integrated with key security technologies such as endpoint protection, firewalls, identity systems, and cloud services would improve threat detection, incident visibility, and compliance reporting."
   - If they lack EDR: "To mitigate endpoint risks, establish an EDR program covering all workstations to provide behavior-based threat hunting, isolation capabilities, and detailed forensic logging."
   - If they lack Vulnerability Management: "Establish a continuous vulnerability management program to identify and remediate server and endpoint vulnerabilities before exploitation."
4. **Structured Format**: For each major gap area, structure your output as:
   - **What's at risk**: Contextual risk explanation
   - **Remediation Strategy**: Actionable steps mapped to 1-2 weeks (Quick wins), 1-3 months (Medium-term), and 3-12 months (Long-term)
   - **Strategic Advisory**: How they can partner with HiQurate to build, manage, or audit this capability.

Keep recommendations specific, practical, and highly aligned with their actual organization profile. Under 800 words.`;
  }

  /**
   * Get cache key for a framework
   */
  getCacheKey(frameworkId) {
    return `cybershield_ai_recs_${frameworkId}`;
  }

  getFindingsCacheKey(frameworkId) {
    return `cybershield_ai_findings_${frameworkId}`;
  }

  applyCachedEnrichment(frameworkId, findings) {
    try {
      const cached = localStorage.getItem(this.getFindingsCacheKey(frameworkId));
      if (!cached) return findings;
      const data = JSON.parse(cached);
      const currentAnswers = localStorage.getItem(`cybershield_answers_${frameworkId}`);
      if (data.answersHash !== this.hashString(currentAnswers || '')) return findings;
      return this.applyEnrichmentMap(findings, data.enrichment || {});
    } catch {
      return findings;
    }
  }

  applyEnrichmentMap(findings, enrichmentMap) {
    const applyRow = (row) => {
      const item = enrichmentMap[row.ref];
      if (!item) return row;
      return {
        ...row,
        recommendation: item.recommendation || row.recommendation,
        action: item.action || row.action,
        finding: item.finding || row.finding
      };
    };
    return {
      ...findings,
      rows: findings.rows.map(applyRow),
      sections: findings.sections.map(s => ({
        ...s,
        rows: s.rows.map(applyRow)
      }))
    };
  }

  buildFindingsEnrichmentPrompt(framework, scores, findings, orgSettings) {
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2, ADVISORY: 3 };
    const topRows = [...findings.rows]
      .sort((a, b) => priorityOrder[a.criticality] - priorityOrder[b.criticality])
      .slice(0, 18);

    const items = topRows.map(r => ({
      ref: r.ref,
      module: r.moduleName,
      area: r.function,
      control: r.summary,
      currentState: r.description,
      priority: r.criticality,
      owner: r.owner
    }));

    const org = orgSettings.organizationName || 'Organization';
    const employees = orgSettings.employeeCount || 'not specified';
    const offices = orgSettings.officeLocations || 'not specified';
    const tools = (orgSettings.securityTools || []).join(', ') || 'None';
    const req = orgSettings.requirementsDetails || 'None specified';

    return `You are a senior cybersecurity assessor from HiQurate writing remediation text for a formal audit report.

Organization: ${org}
Company Size: ${employees} employees
Footprint: ${offices} office locations
Existing Security Technologies: ${tools}
Framework: ${framework.name}
Overall score: ${scores.overall.percentage}%
Requirements context: ${req}

For EACH finding below, write specific, practical content (not generic boilerplate). Reference the actual control, the current state, and the organization's size/footprint context.
Align recommendations with their existing technologies (${tools}). For example, if they have SIEM but lack central logging on endpoints, recommend forwarding logs to the existing SIEM.
Ensure recommendations offer a natural path to HiQurate's advisory and implementation services in a non-salesy, professional manner (e.g. suggesting implementing a SIEM platform, EDR deployment, IAM strategy, or vulnerability program audits).

Return ONLY a JSON array (no markdown fences, no extra text, valid JSON), where each object is:
{"ref":"[ref]","finding":"one sentence current-state summary tailored to company profile","recommendation":"2-3 sentences: what to do, why, and how it aligns with their IT footprint, incorporating advisory pathways","action":"numbered steps the owner can execute in 30-90 days"}

Findings:
${JSON.stringify(items, null, 2)}`;
  }

  parseFindingsJson(text) {
    const trimmed = text.trim();
    const jsonMatch = trimmed.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return {};
    const arr = JSON.parse(jsonMatch[0]);
    const map = {};
    arr.forEach(item => {
      if (item && item.ref) map[item.ref] = item;
    });
    return map;
  }

  async completePrompt(prompt) {
    if (this.provider === 'groq') {
      const res = await fetch(this.proxyCompleteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.groqModel,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.4,
          max_tokens: 4096
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `AI proxy error ${res.status}`);
      }
      const data = await res.json();
      return data?.choices?.[0]?.message?.content || '';
    }

    if (this.provider === 'ollama') {
      const res = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.ollamaModel,
          prompt,
          stream: false,
          options: { temperature: 0.4, num_predict: 4096 }
        })
      });
      if (!res.ok) throw new Error(`Ollama error ${res.status}`);
      const data = await res.json();
      return data.response || '';
    }

    const res = await fetch(
      `${this.apiUrl}/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 4096, temperature: 0.4 }
        })
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Gemini API error ${res.status}`);
    }
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  async enrichFindingsForPdf(frameworkId, findings, orgSettings, scores) {
    if (!this.isConfigured || !findings.rows.length) return findings;

    const cached = this.applyCachedEnrichment(frameworkId, findings);
    const currentAnswers = localStorage.getItem(`cybershield_answers_${frameworkId}`);
    const cachedRaw = localStorage.getItem(this.getFindingsCacheKey(frameworkId));
    if (cachedRaw) {
      try {
        const data = JSON.parse(cachedRaw);
        if (data.answersHash === this.hashString(currentAnswers || '')) {
          return cached;
        }
      } catch { /* regenerate */ }
    }

    const framework = FRAMEWORKS[frameworkId];
    const prompt = this.buildFindingsEnrichmentPrompt(framework, scores, findings, orgSettings);
    const response = await this.completePrompt(prompt);
    const enrichmentMap = this.parseFindingsJson(response);

    localStorage.setItem(this.getFindingsCacheKey(frameworkId), JSON.stringify({
      enrichment: enrichmentMap,
      answersHash: this.hashString(currentAnswers || ''),
      timestamp: Date.now()
    }));

    return this.applyEnrichmentMap(findings, enrichmentMap);
  }

  /**
   * Get cached AI response if it exists and answers haven't changed
   */
  getCachedResponse(frameworkId) {
    try {
      const cached = localStorage.getItem(this.getCacheKey(frameworkId));
      if (!cached) return null;
      const data = JSON.parse(cached);

      // Check if the answers have changed since last AI generation
      const currentAnswers = localStorage.getItem(`cybershield_answers_${frameworkId}`);
      if (data.answersHash !== this.hashString(currentAnswers || '')) {
        return null; // Answers changed, invalidate cache
      }

      return data.response;
    } catch {
      return null;
    }
  }

  /**
   * Cache an AI response
   */
  cacheResponse(frameworkId, response) {
    const currentAnswers = localStorage.getItem(`cybershield_answers_${frameworkId}`);
    localStorage.setItem(this.getCacheKey(frameworkId), JSON.stringify({
      response,
      answersHash: this.hashString(currentAnswers || ''),
      timestamp: Date.now()
    }));
  }

  /**
   * Simple string hash for cache invalidation
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return hash.toString(36);
  }

  renderUnavailableMessage() {
    return `
      <div class="ai-error-box">
        <p><strong>AI service unavailable</strong></p>
        <p>Remediation AI is not configured. Please contact your Hiqurates administrator.</p>
      </div>`;
  }

  /**
   * Stream AI recommendations using Gemini API with SSE
   * @param {string} frameworkId - The framework ID
   * @param {object} scores - The calculated scores object
   * @param {HTMLElement} targetEl - The element to stream text into
   * @param {function} onComplete - Callback when streaming is done
   */
  async streamRecommendations(frameworkId, scores, targetEl, onComplete) {
    const framework = FRAMEWORKS[frameworkId];
    if (!framework) {
      targetEl.innerHTML = '<p class="ai-error">Framework not found.</p>';
      if (onComplete) onComplete(false);
      return;
    }

    if (!this.isConfigured) {
      targetEl.innerHTML = this.renderUnavailableMessage();
      if (onComplete) onComplete(false);
      return;
    }

    // Check cache first
    const cached = this.getCachedResponse(frameworkId);
    if (cached) {
      targetEl.innerHTML = this.formatMarkdown(cached);
      targetEl.classList.add('ai-loaded');
      if (onComplete) onComplete(true);
      return;
    }

    // Build prompt and stream
    const orgSettings = OrgSettings.get();
    const prompt = this.buildPrompt(
      framework.name,
      scores.overall.percentage,
      scores.gaps,
      scores.recommendations,
      scores.modules,
      orgSettings
    );

    targetEl.innerHTML = '<span class="ai-cursor">▊</span>';
    targetEl.classList.add('ai-streaming');

    let fullResponse = '';

    try {
      if (this.provider === 'groq') {
        // --- GROQ STREAMING via SERVER PROXY ---
        const res = await fetch(this.proxyStreamUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: this.groqModel,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 2048,
            top_p: 0.9
          })
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error?.message || `AI proxy returned status ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (!jsonStr || jsonStr === '[DONE]') continue;

              try {
                const json = JSON.parse(jsonStr);
                const text = json?.choices?.[0]?.delta?.content || '';
                if (text) {
                  fullResponse += text;
                  targetEl.innerHTML = this.formatMarkdown(fullResponse) + '<span class="ai-cursor">▊</span>';
                  targetEl.scrollTop = targetEl.scrollHeight;
                }
              } catch (e) {}
            }
          }
        }

        if (buffer.startsWith('data: ')) {
          const jsonStr = buffer.slice(6).trim();
          if (jsonStr && jsonStr !== '[DONE]') {
            try {
              const json = JSON.parse(jsonStr);
              const text = json?.choices?.[0]?.delta?.content || '';
              if (text) fullResponse += text;
            } catch (e) {}
          }
        }

      } else if (this.provider === 'ollama') {
        // --- OLLAMA STREAMING LOGIC ---
        const res = await fetch(`${this.ollamaUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.ollamaModel,
            prompt: prompt,
            stream: true,
            options: {
              temperature: 0.7,
              top_p: 0.9,
              num_predict: 2048
            }
          })
        });

        if (!res.ok) {
          throw new Error(`Ollama returned status ${res.status}. Ensure the model '${this.ollamaModel}' is downloaded.`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const json = JSON.parse(line);
              if (json.response) {
                fullResponse += json.response;
                targetEl.innerHTML = this.formatMarkdown(fullResponse) + '<span class="ai-cursor">▊</span>';
                targetEl.scrollTop = targetEl.scrollHeight;
              }
            } catch (e) {}
          }
        }
        
        // Finalize remaining buffer
        if (buffer.trim()) {
          try {
            const json = JSON.parse(buffer);
            if (json.response) fullResponse += json.response;
          } catch (e) {}
        }

      } else {
        // --- GEMINI STREAMING LOGIC ---
        let res;
        let retries = 3;
        let delay = 2000;

        while (retries > 0) {
          res = await fetch(
            `${this.apiUrl}/${this.model}:streamGenerateContent?alt=sse&key=${this.apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  maxOutputTokens: 2048,
                  temperature: 0.7,
                  topP: 0.9
                }
              })
            }
          );

          if (res.status === 429 && retries > 1) {
            retries--;
            targetEl.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-secondary);"><div class="ai-loading-spinner" style="margin: 0 auto 10px;"></div><p>Rate limit reached. Automatically retrying in ${delay/1000} seconds...</p></div>`;
            await new Promise(r => setTimeout(r, delay));
            delay *= 2;
            targetEl.innerHTML = '<span class="ai-cursor">▊</span>';
            continue;
          }
          break;
        }

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const errorMsg = errorData?.error?.message || `API returned status ${res.status}`;
          throw new Error(errorMsg);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (!jsonStr || jsonStr === '[DONE]') continue;

              try {
                const json = JSON.parse(jsonStr);
                const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                if (text) {
                  fullResponse += text;
                  targetEl.innerHTML = this.formatMarkdown(fullResponse) + '<span class="ai-cursor">▊</span>';
                  targetEl.scrollTop = targetEl.scrollHeight;
                }
              } catch (parseErr) {}
            }
          }
        }

        if (buffer.startsWith('data: ')) {
          const jsonStr = buffer.slice(6).trim();
          if (jsonStr && jsonStr !== '[DONE]') {
            try {
              const json = JSON.parse(jsonStr);
              const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (text) fullResponse += text;
            } catch (e) {}
          }
        }
      }

      // Finalize
      targetEl.classList.remove('ai-streaming');
      targetEl.classList.add('ai-loaded');
      targetEl.innerHTML = this.formatMarkdown(fullResponse);

      // Cache the response
      this.cacheResponse(frameworkId, fullResponse);

      if (onComplete) onComplete(true);

    } catch (err) {
      console.error('API streaming error:', err);
      targetEl.classList.remove('ai-streaming');

      let errorHtml = '';
      if (err.message.includes('API_KEY_INVALID') || err.message.includes('API key')) {
        errorHtml = `
          <div class="ai-error-box">
            <p><strong>Warning: AI authentication failed</strong></p>
            <p>The configured AI credentials are invalid or expired. Please contact your Hiqurates administrator.</p>
            <button class="btn btn-secondary" onclick="app.reportGen.retryAI()" style="margin-top:12px">Retry</button>
          </div>`;
      } else if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('RATE_LIMIT')) {
        errorHtml = `
          <div class="ai-error-box">
            <p><strong>Warning: Rate Limit Reached</strong></p>
            <p>You've exceeded the free tier rate limit. Please wait a moment and try again.</p>
            <button class="btn btn-secondary" onclick="app.reportGen.retryAI()" style="margin-top:12px">Retry</button>
          </div>`;
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorHtml = `
          <div class="ai-error-box">
            <p><strong>Warning: Connection Failed</strong></p>
            <p>Could not reach the AI service. Check your network connection and try again.</p>
            <button class="btn btn-secondary" onclick="app.reportGen.retryAI()" style="margin-top:12px">Retry</button>
          </div>`;
      } else {
        errorHtml = `
          <div class="ai-error-box">
            <p><strong>Warning: AI Generation Failed</strong></p>
            <p>${err.message}</p>
            <button class="btn btn-secondary" onclick="app.reportGen.retryAI()" style="margin-top:12px">Retry</button>
          </div>`;
      }

      targetEl.innerHTML = errorHtml;
      if (onComplete) onComplete(false);
    }
  }

  /**
   * Convert markdown-like text to HTML
   */
  formatMarkdown(text) {
    let html = text
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Headers
      .replace(/^### (.+)$/gm, '<h5 class="ai-h3">$1</h5>')
      .replace(/^## (.+)$/gm, '<h4 class="ai-h2">$1</h4>')
      .replace(/^# (.+)$/gm, '<h3 class="ai-h1">$1</h3>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // Numbered lists
      .replace(/^\d+\.\s(.+)$/gm, '<li class="ai-numbered">$1</li>')
      // Bullet points
      .replace(/^[-•]\s(.+)$/gm, '<li>$1</li>')
      // Wrap consecutive <li> in <ul>
      .replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="ai-list">$1</ul>')
      // Paragraphs (double newlines)
      .replace(/\n\n/g, '</p><p>')
      // Single newlines
      .replace(/\n/g, '<br>');

    return `<div class="ai-content"><p>${html}</p></div>`;
  }
}

// Global instance
const aiService = new AIService();
