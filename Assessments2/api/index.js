// ============================================
// HawkSight — Vercel serverless entry point
// Every request is routed here (see vercel.json), so the same Express app
// that runs locally serves the API and the allow-listed static files, with
// the same security headers. The app is created once per instance.
// ============================================

const { createApp } = require('../server/app');

let appPromise = null;

module.exports = async (req, res) => {
  try {
    if (!appPromise) appPromise = createApp();
    const app = await appPromise;
    return app(req, res);
  } catch (err) {
    // Retry start-up on the next request instead of caching the failure.
    appPromise = null;
    console.error('HawkSight failed to start:', err.message);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end('HawkSight is not available: the server is not configured correctly. The deployment logs give the reason.');
  }
};
