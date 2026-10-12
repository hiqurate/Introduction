# HawkSight Bugs workbook: implementation status

Status of every action item in the "Hawksight Bugs" sheet of *HiQurate Ops - To Do List.xlsx* after the October 2026 maturity pass.

**Done** means it is implemented and tested. **Partial** means the core is in place but part of the acceptance criteria needs further work or an external dependency. **Not started** means it needs a decision, data or an integration that is not available yet.

| # | Area | Item | Status | Notes |
|---|---|---|---|---|
| 1 | Architecture | Separate customer and admin experiences | Done | Customer portal (`#/app`) and assessor console (`#/console`), role-based navigation, enforced server-side |
| 2 | Authentication | Robust RBAC | Done | Platform Admin, Assessor, Customer Admin, Contributor, Read Only; capability matrix checked on every route |
| 3 | Multi-tenancy | Tenant isolation | Done | All records scoped to an organisation; automated tests prove cross-tenant access is denied |
| 4 | Landing page | Rewrite hero | Done | Problem, outcome, frameworks and calls to action, with a live sample preview |
| 5 | Landing page | Methodology/trust section | Done | Landing section plus a full methodology page |
| 6 | Engine | Weighted scoring | Done | Tier weights, documented and unit-tested |
| 7 | Engine | Domain weights | Done | Configurable per template; validated to total 100 |
| 8 | Engine | Control criticality | Done | Critical, High, Medium, Foundational; drives weight, gating and severity |
| 9 | Engine | Maturity levels | Done | Initial to Optimized, with an explanation per domain |
| 10 | Questionnaire | Control-oriented questions | Partial | Every question is linked to a control with objective, expected state and metadata. Rewording the 520 questions themselves is content work, now possible through the template lifecycle |
| 11 | Questionnaire | Answer states beyond yes/no | Done | Native scale plus Not applicable, Unknown and Planned, each with a documented effect |
| 12 | Questionnaire | Evidence collection | Done | Files, links, policy references and notes; timestamped and permission-controlled |
| 13 | Questionnaire | Evidence confidence | Done | Self-attested, evidence-supported, assessor-validated, externally verified |
| 14 | Questionnaire | Conditional logic | Done | Rule engine on profile and previous answers, editable in the console without code |
| 15 | Questionnaire | Assessment profile setup | Done | Industry, size, geography, regulation, data types, technology and critical services |
| 16 | Questionnaire | Industry packs | Partial | Healthcare & Pharma, BFSI & FinTech, IT/SaaS, Education, Manufacturing, Professional Services, Retail, Hospitality, Logistics. A separate Pharma pack is not yet written |
| 17 | Frameworks | Methodology separate from mappings | Done | Unified control library with many-to-many mappings |
| 18 | Frameworks | Framework version metadata | Done | Template and reference framework versions shown on every report |
| 19 | Findings | Findings from failed controls | Done | Title, severity, domain, control, evidence, rationale, remediation |
| 20 | Findings | Severity model | Done | Critical to Informational; documented matrix |
| 21 | Recommendations | Remediation library | Done | Quick win, medium and long-term steps, owner and reference per control |
| 22 | Reporting | Executive report | Done | Print-quality report with score, risk, maturity, findings, roadmap and methodology |
| 23 | Reporting | Methodology page in report | Done | |
| 24 | Reporting | Control appendix | Done | Filterable by domain, severity and criticality, with framework references |
| 25 | Dashboard | Executive dashboard | Done | |
| 26 | Dashboard | Score history | Done | Trend across issued reports |
| 27 | Dashboard | Domain heatmap | Done | Links to findings in the report appendix |
| 28 | Flow | Progress indicator | Done | Overall and per section, persisted |
| 29 | Flow | Autosave | Done | Debounced, queued while offline, with save status |
| 30 | Flow | Section navigation | Done | |
| 31 | Flow | Save and resume | Done | Server-side; resumes on any device |
| 32 | Flow | Guidance/tooltips | Done | Guidance, control objective, typical evidence; optional AI explanation |
| 33 | Flow | Collaborator invitations | Done | One-time invitation links scoped to sections |
| 34 | Flow | Section ownership | Done | Owner and status per section; contributors limited to their sections |
| 35 | Scoring | Risk context multiplier | Done | Visible in methodology and report |
| 36 | Scoring | Health separate from risk | Done | |
| 37 | Scoring | Explainability | Done | Domain to control drill-down with weights and points |
| 38 | Scoring | Score confidence | Done | |
| 39 | Scoring | Critical-control gating | Done | Configurable caps |
| 40 | Questionnaire | Question metadata model | Done | Editable through the template lifecycle |
| 41 | Questionnaire | Evidence-required controls | Done | Submission blocked until evidence or validation is recorded |
| 42 | Frameworks | Unified control library | Done | 50 controls, 8 reference frameworks; every shipped question mapped explicitly |
| 43 | Frameworks | Mapping coverage dashboard | Done | Console, Control library |
| 44 | Reports | Remediation roadmap | Done | 0-30, 31-90, 91-180 days and backlog |
| 45 | Reports | Management action plan | Done | Open, In progress, Risk accepted, Resolved |
| 46 | Reports | Before/after comparison | Done | New, closed and recurring findings |
| 47 | Reports | Framework-specific views | Done | Report section per reference framework |
| 48 | Reports | White-label branding | Done | Logo, colour, prepared-by and footer per organisation |
| 49 | Reports | Versioning and audit trail | Done | Immutable reports with verifiable fingerprint |
| 50 | Admin | Template manager | Partial | Versioned change lifecycle for existing templates. Creating or cloning whole new templates still requires a code change |
| 51 | Admin | Scoring configuration console | Done | Versioned and audited |
| 52 | Admin | Review queue | Done | Filter by status and organisation; assessor and due date shown |
| 53 | Admin | Tenant management | Done | |
| 54 | Admin | Audit logging | Done | Append-only, searchable, exportable |
| 55 | Security | Harden authentication | Partial | Password policy, rate limiting, lockout, session expiry, secure cookies, CSRF defence. MFA is a roadmap item |
| 56 | Security | Protect evidence | Done | AES-256-GCM at rest, tenant- and role-checked downloads |
| 57 | Security | Secret management | Done | Environment-only secrets; rotation guidance in README |
| 58 | Security | Security headers | Done | CSP, HSTS, frame, referrer and permissions policies; HTTPS enforced in production |
| 59 | Performance | Render deployment | Partial | Lean static assets, caching and a health check. Needs a persistent disk on Render (see README) |
| 60 | UX | Design system | Done | Single token-based stylesheet |
| 61 | UX | Loading and feedback | Done | Skeletons, save states, toasts, error states |
| 62 | UX | Responsive layouts | Done | No horizontal overflow at 375 px |
| 63 | UX | Accessibility | Partial | Keyboard navigation, labels, focus states, skip link. A formal WCAG audit is still needed |
| 64 | Landing page | Product walkthrough | Done | Seven-step journey and public sample report |
| 65 | Landing page | Use cases | Done | Five buyer outcomes |
| 66 | Landing page | Trust signals | Done | Accurate, reviewable statements only |
| 67 | Benchmarking | Peer benchmark | Done | Shown only above a minimum population |
| 68 | Benchmarking | Industry views | Partial | Overall industry cohort score; per-domain cohort view not yet shown in the UI |
| 69 | Risk analytics | Risk heatmap | Done | Impact by gap size, linked to findings |
| 70 | Risk analytics | Business-impact context | Partial | Critical services and data types are captured per organisation, not per finding |
| 71 | Integrations | Evidence connectors (M365, Entra etc.) | Not started | Needs connector design and customer consent model |
| 72 | Integrations | Ticketing integration | Partial | Ticket reference per action and Excel/CSV export; no live Jira or ServiceNow API sync |
| 73 | AI | AI assistant | Done | Explanations only; never changes scoring |
| 74 | AI | AI executive summary | Done | Draft from verified results; approval required |
| 75 | Governance | Risk acceptance | Done | Role-restricted, justification, expiry within 12 months |
| 76 | Governance | Recurring scheduling | Partial | Schedule and in-app reminders; no email reminders yet |
| 77 | Governance | Assessment expiry | Done | Configurable stale period shown on the dashboard |
| 78 | Analytics | Product usage analytics | Done | Aggregate, privacy-conscious |
| 79 | Commercial | Demo mode | Done | Resettable fictional organisation with history, findings and actions |
| 80 | Commercial | Assessment packages | Done | Snapshot (each control once, self-issued), Comprehensive (full, assessor-led), Managed (Comprehensive on a schedule); the plan sets assessment depth |
| 81 | Commercial | Action plan export | Done | Excel, CSV and print |
| 82 | Quality | Scoring test suite | Done | Known-answer fixtures plus API authorisation tests (`npm test`) |
| 83 | Quality | Question review workflow | Done | Draft, In review, Approved, Published, with a second reviewer |
| 84 | Quality | Methodology documentation | Done | `METHODOLOGY.md` and in-app methodology page |
