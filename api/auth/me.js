// Vercel Serverless Function: GET /api/auth/me
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    const safeUser = {
      id: decoded.id || 'user-demo-01',
      username: decoded.username || 'dreamer',
      nickname: decoded.nickname || 'Luna Starweaver',
      seal: decoded.seal || '⭐ Star Wish',
      favoriteLullaby: "Pip's Sleepy Starlight Melody",
      createdAt: new Date().toISOString()
    };
    return res.status(200).json({ success: true, user: safeUser });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
