const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(String(pwd)).digest('hex');
}

function parseJsonBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
    if (body.length > 1e6) req.destroy();
  });
  req.on('end', () => {
    try {
      const data = JSON.parse(body || '{}');
      callback(null, data);
    } catch (e) {
      callback(e);
    }
  });
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json'
};

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const usersFile = path.join(__dirname, 'users.json');

  // -------------------------------------------------------------
  // Real Backend Auth APIs: /api/auth/signup & /api/auth/login & /api/auth/me
  // -------------------------------------------------------------
  if (pathname === '/api/auth/signup' && req.method === 'POST') {
    parseJsonBody(req, (err, payload) => {
      if (err || !payload.username || !payload.password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Username and password are required' }));
        return;
      }

      const username = String(payload.username).trim().toLowerCase();
      const password = String(payload.password);
      if (username.length < 3 || password.length < 4) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Username must be >= 3 chars, password >= 4 chars' }));
        return;
      }

      fs.readFile(usersFile, 'utf8', (readErr, data) => {
        let users = [];
        try {
          users = JSON.parse(data || '[]');
        } catch {
          users = [];
        }

        const existing = users.find(u => u.username.toLowerCase() === username);
        if (existing) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Username is already registered by a dreamer' }));
          return;
        }

        const newUser = {
          id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          username: username,
          passwordHash: hashPassword(password),
          nickname: String(payload.nickname || payload.username).slice(0, 30),
          seal: payload.seal || '⭐ Star Wish',
          favoriteLullaby: payload.favoriteLullaby || "Pip's Sleepy Starlight Melody",
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        fs.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf8', () => {
          const safeUser = {
            id: newUser.id,
            username: newUser.username,
            nickname: newUser.nickname,
            seal: newUser.seal,
            favoriteLullaby: newUser.favoriteLullaby,
            createdAt: newUser.createdAt
          };
          const token = Buffer.from(JSON.stringify({ id: newUser.id, username: newUser.username })).toString('base64');
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, user: safeUser, token }));
        });
      });
    });
    return;
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    parseJsonBody(req, (err, payload) => {
      if (err || !payload.username || !payload.password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Username and password are required' }));
        return;
      }

      const username = String(payload.username).trim().toLowerCase();
      const password = String(payload.password);
      const hashed = hashPassword(password);

      fs.readFile(usersFile, 'utf8', (readErr, data) => {
        let users = [];
        try {
          users = JSON.parse(data || '[]');
        } catch {
          users = [];
        }

        const user = users.find(u => u.username.toLowerCase() === username && u.passwordHash === hashed);
        if (!user) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid username or password' }));
          return;
        }

        const safeUser = {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          seal: user.seal,
          favoriteLullaby: user.favoriteLullaby,
          createdAt: user.createdAt
        };
        const token = Buffer.from(JSON.stringify({ id: user.id, username: user.username })).toString('base64');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: safeUser, token }));
      });
    });
    return;
  }

  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (!token) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
      fs.readFile(usersFile, 'utf8', (readErr, data) => {
        let users = [];
        try {
          users = JSON.parse(data || '[]');
        } catch {
          users = [];
        }
        const user = users.find(u => u.id === decoded.id);
        if (!user) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'User not found' }));
          return;
        }
        const safeUser = {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          seal: user.seal,
          favoriteLullaby: user.favoriteLullaby,
          createdAt: user.createdAt
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: safeUser }));
      });
    } catch {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid token' }));
    }
    return;
  }

  // Real backend API: Live Dream Guestbook (/api/wishes)
  if (pathname === '/api/wishes') {
    const wishesFile = path.join(__dirname, 'wishes.json');

    if (req.method === 'GET') {
      fs.readFile(wishesFile, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify([]));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      });
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        if (body.length > 1e6) req.destroy();
      });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          if (!payload.name || !payload.message) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Name and message are required' }));
            return;
          }

          const newWish = {
            id: `wish-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: String(payload.name).slice(0, 50),
            message: String(payload.message).slice(0, 200),
            seal: payload.seal || '⭐ Star Wish',
            date: 'Just now in Midnight Ledger',
            isLocalOnly: false
          };

          fs.readFile(wishesFile, 'utf8', (err, data) => {
            let list = [];
            try {
              list = JSON.parse(data || '[]');
            } catch {
              list = [];
            }
            list.unshift(newWish);
            // Cap at 100 recent wishes
            if (list.length > 100) list = list.slice(0, 100);

            fs.writeFile(wishesFile, JSON.stringify(list, null, 2), 'utf8', () => {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, entry: newWish, all: list }));
            });
          });
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
  }

  let reqPath = decodeURI(pathname);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  // Normalize path safely within current directory
  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  if (!filePath.toLowerCase().startsWith(__dirname.toLowerCase())) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      if (!res.headersSent) res.writeHead(500);
      res.end();
    });
    stream.pipe(res);
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Bind without specifying '0.0.0.0' or use '::' so it listens on both IPv4 (127.0.0.1) and IPv6 (::1 / localhost)
server.listen(PORT, '::', () => {
  console.log(`Pip's Workshop Server running at:`);
  console.log(`  - http://localhost:${PORT}/`);
  console.log(`  - http://127.0.0.1:${PORT}/`);
});
