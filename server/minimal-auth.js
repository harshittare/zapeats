// Minimal working authentication server
const http = require('http');

console.log('Starting minimal auth server...');

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/api/health') {
    res.writeHead(200);
    res.end('{"status":"OK","message":"Server running"}');
    return;
  }
  
  if (req.url === '/test' || req.url === '/') {
    const fs = require('fs');
    const path = require('path');
    try {
      const html = fs.readFileSync(path.join(__dirname, 'auth-test.html'), 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200);
      res.end(html);
    } catch (err) {
      res.writeHead(404);
      res.end('Test page not found');
    }
    return;
  }
  
  if (req.url === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      if (data.identifier === 'test@example.com' && data.password === '123456') {
        res.writeHead(200);
        res.end('{"success":true,"message":"Login successful","token":"token123","user":{"name":"Test User","email":"test@example.com"}}');
      } else {
        res.writeHead(401);
        res.end('{"success":false,"message":"Invalid credentials"}');
      }
    });
    return;
  }
  
  if (req.url === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      if (data.name && data.email && data.password) {
        res.writeHead(201);
        res.end('{"success":true,"message":"Registration successful","token":"token456","user":{"name":"' + data.name + '","email":"' + data.email + '"}}');
      } else {
        res.writeHead(400);
        res.end('{"success":false,"message":"Missing fields"}');
      }
    });
    return;
  }
  
  res.writeHead(404);
  res.end('{"error":"Not found"}');
});

server.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
  console.log('Health: http://localhost:3000/api/health');
  console.log('Login: http://localhost:3000/api/auth/login');
  console.log('Register: http://localhost:3000/api/auth/register');
  console.log('Test: test@example.com / 123456');
});

server.on('error', err => console.error('Server error:', err));