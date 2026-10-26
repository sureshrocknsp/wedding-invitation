/**
 * Wedding Invitation QR Code Generator Script
 * 
 * Usage:
 *   node scripts/generate-qr.js <PUBLIC_PRODUCTION_URL>
 * 
 * Example:
 *   node scripts/generate-qr.js https://lahari-weds-shivakumar.com
 * 
 * Generates high-resolution PNG & SVG assets in public/assets/images/
 * styled to match the South Indian wedding burgundy and gold palette.
 */

import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const inputUrl = process.argv[2] || process.env.VITE_PUBLIC_URL;

if (!inputUrl) {
  console.log(`
================================================================================
⚠️  WEDDING INVITATION QR CODE GENERATOR
================================================================================
Please provide the live production URL to generate a scannable QR code.

Usage:
  node scripts/generate-qr.js <PUBLIC_PRODUCTION_URL>

Example:
  node scripts/generate-qr.js https://lahari-weds-shivakumar.com

Note: Per wedding publishing guidelines, QR codes must only be generated
for real, publicly accessible production addresses to ensure guests on
mobile networks can scan and open the invitation seamlessly.
================================================================================
`);
  process.exit(0);
}

// Validation: Ensure valid URL and reject localhost or placeholder
try {
  const parsed = new URL(inputUrl);
  if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
    console.error('❌ Error: QR code cannot be generated for localhost or loopback addresses.');
    process.exit(1);
  }
} catch {
  console.error(`❌ Error: Invalid URL format: "${inputUrl}". Expected format: https://your-domain.com`);
  process.exit(1);
}

const outputDir = path.join(projectRoot, 'public', 'assets', 'images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const pngPath = path.join(outputDir, 'wedding_qr_code.png');
const svgPath = path.join(outputDir, 'wedding_qr_code.svg');

const qrOptions = {
  errorCorrectionLevel: 'H', // High error correction (30%)
  margin: 4,                 // 4-module quiet zone margin
  color: {
    dark: '#26080D',         // Deep Royal Burgundy
    light: '#FFF8EC'         // Warm Temple Ivory
  }
};

async function generate() {
  console.log(`\n🪔 Generating Auspicious Wedding QR Code for:\n👉 ${inputUrl}\n`);

  // 1. Generate High-Res PNG (1024x1024)
  await QRCode.toFile(pngPath, inputUrl, {
    ...qrOptions,
    width: 1024
  });
  console.log(`✅ High-resolution PNG saved to:\n   ${pngPath}`);

  // 2. Generate Scalable Vector SVG
  const svgString = await QRCode.toString(inputUrl, {
    ...qrOptions,
    type: 'svg'
  });
  fs.writeFileSync(svgPath, svgString, 'utf-8');
  console.log(`✅ Scalable Vector SVG saved to:\n   ${svgPath}`);

  console.log(`\n✨ QR Code successfully generated with burgundy-on-ivory palette and 4-module quiet zone!\n`);
}

generate().catch((err) => {
  console.error('Failed to generate QR code:', err);
  process.exit(1);
});
