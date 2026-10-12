// Vercel build step. Vercel serves the output directory as static files
// before any rewrite, so it must contain nothing but robots.txt: the app,
// its question content and server code are served only through the
// function in api/index.js, which applies HawkSight's allow-list and
// security headers.
const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'public');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *\nDisallow: /api/\n');
console.log('Vercel output directory prepared: public/ (robots.txt only)');
