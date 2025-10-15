const express = require('express');
const router = express.Router();

// Simple API key middleware
const API_KEY = 'your-api-key'; // Use env variable in production
router.use((req, res, next) => {
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// GET /api/integrations/status
router.get('/status', (req, res) => {
  res.json({ status: 'API is working', timestamp: new Date() });
});

// POST /api/integrations/webhook
router.post('/webhook', (req, res) => {
  // Placeholder: process webhook data
  res.json({ received: true, data: req.body });
});

module.exports = router;