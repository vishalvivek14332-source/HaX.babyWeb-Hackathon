// Vercel Serverless Function: POST /api/auth/signup
const crypto = require('crypto');

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(String(pwd)).digest('hex');
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password, nickname, seal, favoriteLullaby } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const cleanUser = String(username).trim().toLowerCase();
  const safeUser = {
    id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    username: cleanUser,
    nickname: String(nickname || cleanUser).slice(0, 30),
    seal: seal || '⭐ Star Wish',
    favoriteLullaby: favoriteLullaby || "Pip's Sleepy Starlight Melody",
    createdAt: new Date().toISOString()
  };

  const token = Buffer.from(JSON.stringify({ id: safeUser.id, username: safeUser.username })).toString('base64');
  return res.status(201).json({ success: true, user: safeUser, token });
};
