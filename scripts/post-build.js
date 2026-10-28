import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

if (fs.existsSync(distDir)) {
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    // 1. Copy to 404.html for GitHub Pages / Cloudflare fallback
    fs.copyFileSync(indexPath, path.join(distDir, '404.html'));
    console.log('✓ Created dist/404.html for SPA fallback');

    // 2. Copy to 200.html for Surge / Static hosting fallback
    fs.copyFileSync(indexPath, path.join(distDir, '200.html'));
    console.log('✓ Created dist/200.html for static fallback');

    // 3. Create dist/kalyanam/index.html for zero-config direct path routing on Vercel/Netlify
    const kalyanamDir = path.join(distDir, 'kalyanam');
    if (!fs.existsSync(kalyanamDir)) {
      fs.mkdirSync(kalyanamDir, { recursive: true });
    }
    fs.copyFileSync(indexPath, path.join(kalyanamDir, 'index.html'));
    console.log('✓ Created dist/kalyanam/index.html for direct route support');
  }
}
