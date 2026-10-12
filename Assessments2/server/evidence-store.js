// ============================================
// HawkSight — Encrypted evidence storage
// Files are encrypted with AES-256-GCM before they touch disk and are kept
// outside the web root. They are only returned through an authenticated,
// tenant-checked API route.
// ============================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ALLOWED_TYPES = {
  'application/pdf': '.pdf',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'text/plain': '.txt',
  'text/csv': '.csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx'
};

const MAX_BYTES = 10 * 1024 * 1024;

// Magic-number checks so a renamed executable cannot be stored as a PDF.
function sniffMatches(mime, buf) {
  const startsWith = sig => sig.every((b, i) => buf[i] === b);
  switch (mime) {
    case 'application/pdf': return startsWith([0x25, 0x50, 0x44, 0x46]);
    case 'image/png': return startsWith([0x89, 0x50, 0x4e, 0x47]);
    case 'image/jpeg': return startsWith([0xff, 0xd8, 0xff]);
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return startsWith([0x50, 0x4b, 0x03, 0x04]);
    case 'text/plain':
    case 'text/csv':
      return !buf.subarray(0, 4096).includes(0);
    default: return false;
  }
}

class EvidenceStore {
  constructor({ directory, key }) {
    this.directory = directory;
    this.key = key;
    fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  }

  static loadKey({ envKey, keyFile, production }) {
    if (envKey) {
      const key = Buffer.from(envKey, 'base64');
      if (key.length !== 32) throw new Error('EVIDENCE_ENCRYPTION_KEY must be 32 bytes, base64 encoded');
      return key;
    }
    if (production) {
      throw new Error('EVIDENCE_ENCRYPTION_KEY is required in production');
    }
    if (fs.existsSync(keyFile)) return Buffer.from(fs.readFileSync(keyFile, 'utf8').trim(), 'base64');
    const key = crypto.randomBytes(32);
    fs.mkdirSync(path.dirname(keyFile), { recursive: true });
    fs.writeFileSync(keyFile, key.toString('base64'), { mode: 0o600 });
    return key;
  }

  validate({ mime, buffer, filename }) {
    if (!ALLOWED_TYPES[mime]) return 'File type not permitted. Upload PDF, image, text or Office documents.';
    if (!buffer || !buffer.length) return 'File is empty.';
    if (buffer.length > MAX_BYTES) return 'File exceeds the 10 MB limit.';
    if (!sniffMatches(mime, buffer)) return 'File content does not match its declared type.';
    if (!filename || filename.length > 200) return 'Invalid file name.';
    return null;
  }

  async save(tenantId, buffer) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const tag = cipher.getAuthTag();
    const storageKey = `${Number(tenantId)}/${crypto.randomBytes(16).toString('hex')}.bin`;
    const fullPath = path.join(this.directory, storageKey);
    await fs.promises.mkdir(path.dirname(fullPath), { recursive: true, mode: 0o700 });
    await fs.promises.writeFile(fullPath, Buffer.concat([iv, tag, encrypted]), { mode: 0o600 });
    return {
      storageKey,
      sha256: crypto.createHash('sha256').update(buffer).digest('hex')
    };
  }

  async read(storageKey) {
    if (!/^\d+\/[a-f0-9]{32}\.bin$/.test(storageKey)) throw new Error('Invalid storage key');
    const blob = await fs.promises.readFile(path.join(this.directory, storageKey));
    const iv = blob.subarray(0, 12);
    const tag = blob.subarray(12, 28);
    const data = blob.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]);
  }

  async remove(storageKey) {
    if (!/^\d+\/[a-f0-9]{32}\.bin$/.test(storageKey)) return;
    await fs.promises.unlink(path.join(this.directory, storageKey)).catch(() => {});
  }
}

module.exports = { EvidenceStore, ALLOWED_TYPES, MAX_BYTES };
