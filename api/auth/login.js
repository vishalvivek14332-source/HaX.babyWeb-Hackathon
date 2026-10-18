// Vercel Serverless Function: POST /api/auth/login
const crypto = require('crypto');

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(String(pwd)).digest('hex');
}

// In-memory / demo users fallback
const DEMO_USERS = [
  {
    id: "user-demo-01",
    username: "dreamer",
    passwordHash: hashPassword("password"),
    nickname: "Luna Starweaver",
    seal: "⭐ Star Wish",
    favoriteLullaby: "Pip's Sleepy Starlight Melody",
    createdAt: "2026-10-18T10:00:00.000Z"
  }
];

module.exports = (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const cleanUser = String(username).trim().toLowerCase();
  const hashed = hashPassword(password);

  const matched = DEMO_USERS.find(u => u.username.toLowerCase() === cleanUser && u.passwordHash === hashed);

  if (matched || (cleanUser === 'dreamer' && password === 'password')) {
    const user = matched || DEMO_USERS[0];
    const safeUser = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      seal: user.seal,
      favoriteLullaby: user.favoriteLullaby,
      createdAt: user.createdAt
    };
    const token = Buffer.from(JSON.stringify({ id: user.id, username: user.username })).toString('base64');
    return res.status(200).json({ success: true, user: safeUser, token });
  }

  // Allow any new dreamer test credentials on serverless
  const dynamicUser = {
    id: `user-${Date.now()}`,
    username: cleanUser,
    nickname: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
    seal: '⭐ Star Wish',
    favoriteLullaby: "Pip's Sleepy Starlight Melody",
    createdAt: new Date().toISOString()
  };
  const token = Buffer.from(JSON.stringify({ id: dynamicUser.id, username: dynamicUser.username })).toString('base64');
  return res.status(200).json({ success: true, user: dynamicUser, token });
};
