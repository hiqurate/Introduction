// ============================================
// HawkSight — Database access and schema migrations
// SQLite via sqlite3 with a small promise wrapper, used for local
// development and tests. Hosted deployments use Postgres (db-pg.js) through
// the same interface: run, get, all, exec, transaction, withLock.
// ============================================

class Database {
  constructor(filename) {
    this.filename = filename;
    this.db = null;
    this.dialect = 'sqlite';
  }

  open() {
    // Loaded lazily so hosted (Postgres) deployments do not need sqlite3.
    const sqlite3 = require('sqlite3');
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.filename, err => (err ? reject(err) : resolve(this)));
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve();
      this.db.close(err => (err ? reject(err) : resolve()));
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function onRun(err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows || [])));
    });
  }

  exec(sql) {
    return new Promise((resolve, reject) => {
      this.db.exec(sql, err => (err ? reject(err) : resolve()));
    });
  }

  // Transactions share one connection, so they are serialised through a
  // promise queue to prevent nested BEGIN statements from concurrent requests.
  transaction(fn) {
    const run = async () => {
      await this.run('BEGIN IMMEDIATE');
      try {
        const result = await fn(this);
        await this.run('COMMIT');
        return result;
      } catch (err) {
        await this.run('ROLLBACK').catch(() => {});
        throw err;
      }
    };
    const next = (this.txQueue || Promise.resolve()).then(run, run);
    this.txQueue = next.catch(() => {});
    return next;
  }

  // A single process owns the SQLite file, so no cross-process lock is needed.
  async withLock(fn) {
    return fn();
  }
}

// Ordered list of migrations. Never edit an applied migration; append a new one.
const MIGRATIONS = [
  {
    id: 1,
    name: 'initial schema',
    sql: `
      CREATE TABLE tenants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        industry TEXT,
        size TEXT,
        country TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        is_demo INTEGER NOT NULL DEFAULT 0,
        package TEXT NOT NULL DEFAULT 'snapshot',
        reassessment_frequency TEXT,
        branding_json TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      );

      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        name TEXT NOT NULL DEFAULT '',
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        must_change_password INTEGER NOT NULL DEFAULT 0,
        failed_attempts INTEGER NOT NULL DEFAULT 0,
        locked_until TEXT,
        last_login_at TEXT,
        password_changed_at TEXT,
        created_by INTEGER,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      );
      CREATE INDEX idx_users_tenant ON users(tenant_id);

      CREATE TABLE invites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        email TEXT NOT NULL COLLATE NOCASE,
        role TEXT NOT NULL,
        token_hash TEXT NOT NULL UNIQUE,
        assessment_id INTEGER,
        sections_json TEXT NOT NULL DEFAULT '[]',
        expires_at TEXT NOT NULL,
        accepted_at TEXT,
        revoked_at TEXT,
        created_by INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      );

      CREATE TABLE tenant_assessors (
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        PRIMARY KEY (tenant_id, user_id)
      );

      CREATE TABLE tenant_frameworks (
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        framework_id TEXT NOT NULL,
        PRIMARY KEY (tenant_id, framework_id)
      );

      CREATE TABLE tenant_profiles (
        tenant_id INTEGER PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
        profile_json TEXT NOT NULL DEFAULT '{}',
        updated_by INTEGER,
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      );

      CREATE TABLE assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        framework_id TEXT NOT NULL,
        title TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'in_progress',
        profile_json TEXT NOT NULL DEFAULT '{}',
        answers_json TEXT NOT NULL DEFAULT '{}',
        assessor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        due_date TEXT,
        review_notes TEXT,
        ai_summary TEXT,
        ai_summary_status TEXT,
        created_by INTEGER,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        submitted_at TEXT,
        completed_at TEXT
      );
      CREATE INDEX idx_assessments_tenant ON assessments(tenant_id, framework_id);

      CREATE TABLE assessment_sections (
        assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
        module_id TEXT NOT NULL,
        owner_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        status TEXT NOT NULL DEFAULT 'not_started',
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        PRIMARY KEY (assessment_id, module_id)
      );

      CREATE TABLE evidence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
        question_id TEXT NOT NULL,
        kind TEXT NOT NULL,
        filename TEXT,
        mime_type TEXT,
        size_bytes INTEGER,
        sha256 TEXT,
        storage_key TEXT,
        url_reference TEXT,
        policy_reference TEXT,
        notes TEXT,
        uploaded_by INTEGER,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        deleted_at TEXT,
        deleted_by INTEGER
      );
      CREATE INDEX idx_evidence_assessment ON evidence(assessment_id, question_id);

      CREATE TABLE reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
        framework_id TEXT NOT NULL,
        version INTEGER NOT NULL,
        title TEXT NOT NULL,
        review_type TEXT NOT NULL,
        scoring_model_version TEXT NOT NULL,
        config_version INTEGER NOT NULL,
        framework_version TEXT,
        result_json TEXT NOT NULL,
        profile_json TEXT NOT NULL,
        answers_json TEXT NOT NULL,
        branding_json TEXT NOT NULL DEFAULT '{}',
        ai_summary TEXT,
        assessor_name TEXT,
        health_score INTEGER,
        risk_score INTEGER,
        content_hash TEXT NOT NULL,
        issued_by INTEGER,
        issued_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      );
      CREATE INDEX idx_reports_tenant ON reports(tenant_id, framework_id, issued_at);
      CREATE TRIGGER reports_no_update BEFORE UPDATE ON reports BEGIN SELECT RAISE(ABORT, 'Issued reports are immutable'); END;

      CREATE TABLE finding_actions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        framework_id TEXT NOT NULL,
        question_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        owner TEXT,
        due_date TEXT,
        notes TEXT,
        ticket_ref TEXT,
        acceptance_justification TEXT,
        acceptance_expiry TEXT,
        accepted_by INTEGER,
        accepted_at TEXT,
        updated_by INTEGER,
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        UNIQUE (tenant_id, framework_id, question_id)
      );

      CREATE TABLE scoring_configs (
        version INTEGER PRIMARY KEY AUTOINCREMENT,
        config_json TEXT NOT NULL,
        note TEXT,
        created_by INTEGER,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      );

      CREATE TABLE audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER,
        user_id INTEGER,
        user_email TEXT,
        action TEXT NOT NULL,
        target TEXT,
        details TEXT,
        ip_address TEXT,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      );
      CREATE INDEX idx_audit_created ON audit_logs(created_at);
      CREATE TRIGGER audit_no_update BEFORE UPDATE ON audit_logs BEGIN SELECT RAISE(ABORT, 'Audit log is append-only'); END;
      CREATE TRIGGER audit_no_delete BEFORE DELETE ON audit_logs BEGIN SELECT RAISE(ABORT, 'Audit log is append-only'); END;

      CREATE TABLE events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER,
        user_id INTEGER,
        type TEXT NOT NULL,
        framework_id TEXT,
        assessment_id INTEGER,
        meta_json TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      );
      CREATE INDEX idx_events_type ON events(type, created_at);

      CREATE TABLE sessions (
        sid TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        expires_at INTEGER NOT NULL
      );
    `
  },
  {
    id: 2,
    name: 'question templates lifecycle',
    sql: `
      CREATE TABLE template_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        framework_id TEXT NOT NULL,
        version TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        changes_json TEXT NOT NULL DEFAULT '{}',
        note TEXT,
        created_by INTEGER,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        reviewed_by INTEGER,
        reviewed_at TEXT,
        published_by INTEGER,
        published_at TEXT
      );
      CREATE INDEX idx_template_versions ON template_versions(framework_id, status);
    `
  },
  {
    id: 3,
    name: 'assessment scope by plan',
    sql: `ALTER TABLE assessments ADD COLUMN scope TEXT NOT NULL DEFAULT 'full';`
  }
];

async function migrate(db) {
  await db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  await db.run(`CREATE TABLE IF NOT EXISTS schema_migrations (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  )`);
  const applied = new Set((await db.all('SELECT id FROM schema_migrations')).map(r => r.id));
  for (const m of MIGRATIONS) {
    if (applied.has(m.id)) continue;
    await db.exec('BEGIN');
    try {
      await db.exec(m.sql);
      await db.run('INSERT INTO schema_migrations (id, name) VALUES (?, ?)', [m.id, m.name]);
      await db.exec('COMMIT');
    } catch (err) {
      await db.exec('ROLLBACK').catch(() => {});
      throw new Error(`Migration ${m.id} (${m.name}) failed: ${err.message}`);
    }
  }
}

// target: a SQLite file path, or { url } for Postgres.
async function openDatabase(target) {
  if (target && typeof target === 'object' && target.url) {
    const { openPostgres } = require('./db-pg');
    return openPostgres(target.url);
  }
  const db = new Database(target);
  await db.open();
  await migrate(db);
  return db;
}

module.exports = { openDatabase, Database, MIGRATIONS };
