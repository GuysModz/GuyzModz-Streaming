const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');

// 1. Create dist directory if it doesn't exist
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
}

// 2. Files to copy to dist
const filesToCopy = ['index.html', 'style.css', 'app.js'];

filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(distPath, file);
    
    if (fs.existsSync(src)) {
        let content = fs.readFileSync(src, 'utf8');
        
        // 3. If it's app.js, inject the key
        if (file === 'app.js') {
            const key = process.env.TMDB_KEY || '';
            content = content.replace('%%TMDB_KEY_PLACEHOLDER%%', key);
            console.log('Injected TMDB_KEY into dist/app.js');
        }
        
        fs.writeFileSync(dest, content);
        console.log(`Copied ${file} to dist/`);
    }
});

console.log('Build complete! Your site is ready in the "dist" folder.');
