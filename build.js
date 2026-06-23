const fs   = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');
if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });

const apiKey = process.env.TMDB_API_KEY || process.env.TMDB_KEY || '';
if (!apiKey) {
    console.warn('⚠️  TMDB_API_KEY env variable is not set — content will not load!');
} else {
    console.log('✅ TMDB_API_KEY found, injecting...');
}

const files = ['index.html', 'style.css', 'app.js', 'player.html', 'player.js'];

files.forEach(file => {
    const src  = path.join(__dirname, file);
    const dest = path.join(dist, file);
    if (!fs.existsSync(src)) { console.warn(`  ⚠️  Missing: ${file}`); return; }

    let content = fs.readFileSync(src, 'utf8');

    // Inject API key into JS files
    if (file === 'app.js' || file === 'player.js') {
        content = content.replace(/%%TMDB_API_KEY%%/g, apiKey);
    }

    fs.writeFileSync(dest, content);
    console.log(`  ✅ ${file} → dist/`);
});

console.log('\n🎉 Build complete → dist/');
