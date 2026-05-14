// api/index.js — Sert index.html sans cache CDN
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  
  const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
  res.send(html);
};
