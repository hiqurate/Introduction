# HawkSight

Cybersecurity assessment and cyber health platform by HiQurate Ops.

HawkSight is a threat-led assessment platform. It tests an organisation against the attack paths organisations in its industry are actually breached through, shows which paths are open and the fixes that break the most of them, and produces a Cyber Health Score, a separate risk exposure view, an immutable report and a tracked remediation plan. Every question maps to a unified control library cross-referenced to NIST CSF 2.0, ISO/IEC 27001:2022, CIS Controls v8.1, SOC 2, PCI DSS 4.0.1, HIPAA, DPDP and GDPR.

## Running locally

Requirements: Node.js 22 (18.18+ works for development).

```bash
npm install
cp .env.example .env    # optional for local use
npm start
```

Open http://localhost:3000. On first start the server:

- creates the database and encrypted evidence store in `storage/` (or `DATA_DIR`)
- creates the first platform administrator from `ADMIN_EMAIL` / `ADMIN_PASSWORD`, or prints a temporary password to the log
- seeds a fictional demonstration organisation (Northwind Health Partners) and prints its sign-in details

Run the test suites:

```bash
npm test
```

## Roles

| Role | Scope |
|---|---|
| Platform Administrator | All organisations, staff accounts, scoring configuration, templates, audit log, analytics |
| Assessor | Assigned organisations: review queue, evidence validation, report issue |
| Customer Administrator | Own organisation: profile, people, assessments, reports, action plan, risk acceptance |
| Contributor | Answers sections assigned to them; updates actions |
| Read Only | Views results and reports |

Staff land in the console (`#/console`); customers land in the portal (`#/app`). The scoring methodology page is available to staff in the console.

## Plans

The organisation's plan sets the depth of each new assessment. The questions are the same in every plan.

| Plan | Assessment | Report |
|---|---|---|
| Snapshot | One question per security control (11 to 34 questions depending on the template) | Self-issued by the customer |
| Comprehensive | Full template with evidence and assessor review | Issued by a HiQurate Ops assessor |
| Managed | As Comprehensive, repeated on a schedule (six-monthly by default) | Issued by an assessor each cycle |

## Architecture

```
server.js                 entry point
server/app.js             Express app: security headers, sessions, static allow-list
server/db.js              SQLite schema and migrations (local development)
server/db-pg.js           Postgres (Neon) schema and migrations
api/index.js              Vercel serverless entry point
server/security.js        RBAC capabilities, CSRF guard, rate limits, password policy, session store
server/services.js        audit log, product events, tenant checks, server-side scoring
server/evidence-store.js  AES-256-GCM encrypted evidence files
server/reporting.js       immutable report issue and fingerprint verification
server/routes/*.js        API routes
js/engine/                shared scoring engine, control library and threat scenario library (browser and server)
js/core/, js/views/       single-page client (no build step)
data/                     assessment templates (served only through the authenticated API); core.js holds the threat-led core shared by industry templates
METHODOLOGY.md            scoring methodology
tests/                    scoring regression fixtures and API authorisation tests
```

## Security model

- Every API route checks the signed-in user's role and the organisation that owns the record. Cross-organisation access returns 404.
- Only `index.html`, `styles.css`, `app.js`, `favicon.svg`, `js/` and `assets/` are served as static files. The database, server code, documents and question data are never exposed.
- Sessions use an HttpOnly, SameSite=Strict cookie, 30-minute idle timeout and 12-hour absolute lifetime, and are stored in SQLite.
- State-changing requests require the client header and a same-origin `Origin`.
- Sign-in is rate limited; accounts lock for 15 minutes after five failed attempts. Passwords need 12+ characters and three character types.
- Content-Security-Policy allows scripts only from the same origin, with no inline scripts.
- Evidence is type-checked by content, limited to 10 MB, encrypted at rest and downloadable only by authorised users. Access is audited.
- Issued reports and the audit log are protected by database triggers against modification.
- Secrets come only from the environment. No keys are stored in the repository.

## Database

- With `DATABASE_URL` set (Postgres, for example Neon), all data, sessions and encrypted evidence files are stored in Postgres. Nothing is written to disk.
- Without it, HawkSight uses a SQLite file and an evidence folder in `DATA_DIR` (default `storage/`). This suits local development and hosts with a persistent disk.
- The schema is created and upgraded automatically on start-up (`server/db-pg.js` for Postgres, `server/db.js` for SQLite).
- To run the API tests against Postgres: `TEST_DATABASE_URL=postgres://... npm test`. That database is wiped, so never use one holding real data.

## Deployment on Vercel with Neon

1. In the Vercel project settings, set **Root Directory** to `Assessments2`. `vercel.json` there routes every request through `api/index.js`, so only allow-listed files are served, with HawkSight's security headers.
2. Set these environment variables (Production, and Preview if used):
   - `DATABASE_URL`: the Neon pooled connection string
   - `SESSION_SECRET` and `EVIDENCE_ENCRYPTION_KEY`: generate as shown in `.env.example`
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD`: the first platform administrator
   - optionally `DEMO_PASSWORD`, `SEED_DEMO=false`, `GROQ_API_KEY`
3. Redeploy. The first request creates the administrator and, unless disabled, the demonstration organisation.
4. Check `/api/health`. If a setting is missing, every page shows "HawkSight is not available" and the function log names the missing setting.

Notes:
- Evidence uploads are limited to 3 MB on Vercel because of its 4.5 MB request limit.
- Keep the evidence key in a secrets manager; evidence cannot be decrypted without it. Neon handles database backups.

## Deployment on a server with a persistent disk (for example Render)

- Set `NODE_ENV=production`, `SESSION_SECRET`, `EVIDENCE_ENCRYPTION_KEY`, `ADMIN_EMAIL` and `ADMIN_PASSWORD`, plus either `DATABASE_URL` or a persistent disk with `DATA_DIR` set to its mount path.
- Back up `DATA_DIR` if you use SQLite.
- Health check path: `/api/health`.
- The previous version used `database.sqlite` in the project root. It is no longer read; accounts must be recreated.

## Configuration and content changes

- Scoring parameters, domain weights and applicability rules: console, Scoring. Each publication creates a new configuration version with a recorded reason.
- Question wording, guidance, criticality, control mapping and evidence requirements: console, Templates. Changes move through Draft, In review, Approved, Published, and require a second reviewer.
