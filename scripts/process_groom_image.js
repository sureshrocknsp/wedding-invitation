import sharp from 'sharp';
import fs from 'fs';

async function processGroom() {
  const inputPath = 'C:/Users/Admin/.gemini/antigravity-ide/brain/4a880ea2-5b50-4b7f-9977-f02fa35dfe08/.user_uploaded/media_1793096130780.jpg';
  
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const width = metadata.width;
  const height = metadata.height;
  
  // Get raw RGBA buffer
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  
  // Helper to get pixel index
  function getIdx(x, y) {
    return (y * width + x) * 4;
  }
  
  function isCheckerboard(x, y) {
    const idx = getIdx(x, y);
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const diff = maxVal - minVal;
    
    // Neutral gray/white checkerboard pixel
    return diff <= 22 && r >= 120 && g >= 120 && b >= 120;
  }
  
  const visited = new Uint8Array(width * height);
  const queueX = [];
  const queueY = [];
  
  // Seed top and bottom borders
  for (let x = 0; x < width; x++) {
    if (isCheckerboard(x, 0)) {
      queueX.push(x);
      queueY.push(0);
      visited[0 * width + x] = 1;
    }
    if (isCheckerboard(x, height - 1)) {
      queueX.push(x);
      queueY.push(height - 1);
      visited[(height - 1) * width + x] = 1;
    }
  }
  
  // Seed left and right borders
  for (let y = 0; y < height; y++) {
    if (!visited[y * width + 0] && isCheckerboard(0, y)) {
      queueX.push(0);
      queueY.push(y);
      visited[y * width + 0] = 1;
    }
    if (!visited[y * width + (width - 1)] && isCheckerboard(width - 1, y)) {
      queueX.push(width - 1);
      queueY.push(y);
      visited[y * width + (width - 1)] = 1;
    }
  }
  
  let head = 0;
  let clearedCount = 0;
  
  while (head < queueX.length) {
    const cx = queueX[head];
    const cy = queueY[head];
    head++;
    
    const idx = getIdx(cx, cy);
    // Set to pure black and transparent alpha
    data[idx] = 0;
    data[idx + 1] = 0;
    data[idx + 2] = 0;
    data[idx + 3] = 0; // Transparent
    clearedCount++;
    
    // Check 4 neighbors
    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];
    
    for (let i = 0; i < 4; i++) {
      const nx = neighbors[i][0];
      const ny = neighbors[i][1];
      
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const vIdx = ny * width + nx;
        if (!visited[vIdx]) {
          visited[vIdx] = 1;
          if (isCheckerboard(nx, ny)) {
            queueX.push(nx);
            queueY.push(ny);
          }
        }
      }
    }
  }
  
  console.log(`Cleared ${clearedCount} checkerboard pixels out of ${width * height} total pixels.`);
  
  // Save as PNG with alpha
  await sharp(data, {
    raw: { width, height, channels: 4 }
  }).png().toFile('public/assets/images/groom_portrait.png');

  // Also save a version with solid black background (matching bride's background)
  const blackBgData = Buffer.from(data);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    if (blackBgData[idx + 3] === 0) {
      blackBgData[idx] = 0;     // R
      blackBgData[idx + 1] = 0; // G
      blackBgData[idx + 2] = 0; // B
      blackBgData[idx + 3] = 255; // Solid black
    }
  }

  await sharp(blackBgData, {
    raw: { width, height, channels: 4 }
  }).jpeg({ quality: 95 }).toFile('public/assets/images/groom_portrait.jpg');

  // Also copy to public/images/wedding and dist
  fs.copyFileSync('public/assets/images/groom_portrait.jpg', 'public/images/wedding/groom_portrait.jpg');
  fs.copyFileSync('public/assets/images/groom_portrait.png', 'public/images/wedding/groom_portrait.png');
  fs.copyFileSync('public/assets/images/groom_portrait.jpg', 'dist/assets/images/groom_portrait.jpg');
  fs.copyFileSync('public/assets/images/groom_portrait.jpg', 'dist/images/wedding/groom_portrait.jpg');

  console.log('Groom portrait successfully processed and saved!');
}

processGroom().catch(err => {
  console.error('Error processing groom image:', err);
  process.exit(1);
});
