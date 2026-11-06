/**
 * frontend/server.js
 * Serveur HTTP local ultra-léger utilisant uniquement les modules intégrés de Node.js (http, fs, path).
 * Ne nécessite aucune installation de dépendance (zéro npm install).
 *
 * Utilisation :
 *   node server.js
 * ou depuis la racine :
 *   node frontend/server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const cleanUrl = req.url.split('?')[0];
  let relativePath = cleanUrl === '/' ? '/index.html' : cleanUrl;
  
  const safePath = path.normalize(decodeURIComponent(relativePath)).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(BASE_DIR, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>404 Fichier non trouvé</h1><p>Impossible de trouver <code>${safePath}</code></p>`);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>500 Erreur serveur</h1><p>${err.message}</p>`);
      }
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log('==============================================================');
  console.log(`  Serveur Front-end SOA démarré avec succès !`);
  console.log(`  👉 Ouvrez votre navigateur sur : http://localhost:${PORT}`);
  console.log('==============================================================');
  console.log('  Appuyez sur Ctrl + C pour arrêter le serveur.');
});

