const fs = require('fs');
const path = require('path');

const root = __dirname;
const dist = path.join(root, 'dist');

// Always rebuild dist from scratch so old/corrupt files cannot stay cached.
if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const apiKey = process.env.TMDB_API_KEY || process.env.TMDB_KEY || '';

if (!apiKey) {
  console.warn('⚠️  TMDB_API_KEY/TMDB_KEY env variable is not set — TMDB live content/search may not load.');
} else {
  console.log('✅ TMDB_API_KEY found, injecting...');
}

const files = ['index.html', 'style.css', 'app.js', 'player.html', 'player.js'];

for (const file of files) {
  const src = path.join(root, file);
  const dest = path.join(dist, file);

  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Missing: ${file}`);
    continue;
  }

  let content = fs.readFileSync(src, 'utf8');

  if (file.endsWith('.js')) {
    content = content.replace(/%%TMDB_API_KEY%%/g, apiKey);
  }

  fs.writeFileSync(dest, content);
  console.log(`✅ ${file} → dist/`);
}

console.log('🎉 Build complete → dist/');
