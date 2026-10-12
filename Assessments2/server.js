// ============================================
// HawkSight — Server entry point
// ============================================

require('dotenv').config();
const { createApp } = require('./server/app');

const PORT = Number(process.env.PORT) || 3000;

createApp()
  .then(app => {
    app.listen(PORT, () => {
      console.log(`HawkSight listening on http://localhost:${PORT}`);
      console.log(`AI assistance: ${process.env.GROQ_API_KEY ? 'enabled' : 'disabled (set GROQ_API_KEY to enable)'}`);
    });
  })
  .catch(err => {
    console.error('HawkSight failed to start:', err.message);
    process.exit(1);
  });
