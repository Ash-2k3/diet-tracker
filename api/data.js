const { kv } = require('@vercel/kv');

const KEY = 'ashwath_diet_tracker';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const data = await kv.get(KEY);
      return res.status(200).json(data || null);
    } catch (err) {
      console.error('GET error:', err);
      return res.status(500).json({ error: 'Failed to read data' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Invalid body' });
      }
      body.updatedAt = new Date().toISOString();
      await kv.set(KEY, body);
      return res.status(200).json({ success: true, updatedAt: body.updatedAt });
    } catch (err) {
      console.error('POST error:', err);
      return res.status(500).json({ error: 'Failed to save data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
