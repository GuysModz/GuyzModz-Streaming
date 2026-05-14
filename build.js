const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

const key = process.env.TMDB_KEY || '';

// Replace the placeholder with the actual key from Vercel
content = content.replace('%%TMDB_KEY_PLACEHOLDER%%', key);

fs.writeFileSync(appJsPath, content);
console.log('Build complete: Injected TMDB_KEY into app.js');
