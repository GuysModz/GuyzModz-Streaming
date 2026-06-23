const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');

// 1. Create dist directory if it doesn't exist
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
}

// 2. Files to copy to dist
const filesToCopy = ['index.html', 'style.css', 'app.js', 'player.html', 'player.js'];

// Read API key from environment variable (set in Vercel dashboard as TMDB_API_KEY)
const apiKey = process.env.TMDB_API_KEY || process.env.TMDB_KEY || '';

if (!apiKey) {
    console.warn('⚠️  WARNING: TMDB_API_KEY environment variable is not set!');
    console.warn('   Set it in Vercel: Settings → Environment Variables → TMDB_API_KEY');
} else {
    console.log('✅ TMDB_API_KEY found, injecting into build...');
}

filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(distPath, file);

    if (fs.existsSync(src)) {
        let content = fs.readFileSync(src, 'utf8');

        // Inject API key into app.js and player.js
        if (file === 'app.js' || file === 'player.js') {
            content = content.replace(/%%TMDB_API_KEY%%/g, apiKey);
            console.log(`  Injected TMDB_API_KEY into dist/${file}`);
        }

        fs.writeFileSync(dest, content);
        console.log(`  Copied ${file} → dist/`);
    } else {
        console.warn(`  Skipped (not found): ${file}`);
    }
});

console.log('\n✅ Build complete! Your site is ready in the "dist" folder.');
