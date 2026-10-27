import sharp from 'sharp';
import fs from 'fs';

async function processGroomAllCheckerboard() {
  const inputPath = 'C:/Users/Admin/.gemini/antigravity-ide/brain/4a880ea2-5b50-4b7f-9977-f02fa35dfe08/.user_uploaded/media_1793096130780.jpg';
  
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const width = metadata.width;
  const height = metadata.height;
  
  // Get raw RGBA buffer
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  
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
    
    // Check if neutral gray/white checkerboard pixel
    // Checkerboard squares are between 140 and 255 with diff <= 18
    return diff <= 18 && r >= 140 && g >= 140 && b >= 140;
  }
  
  // Seed points:
  // 1. Borders (outside the ring)
  // 2. Behind head left: (280, 250)
  // 3. Behind head right: (700, 250)
  // 4. Above head: (512, 100)
  const queueX = [];
  const queueY = [];
  const visited = new Uint8Array(width * height);
  
  function tryEnqueue(x, y) {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const vIdx = y * width + x;
      if (!visited[vIdx] && isCheckerboard(x, y)) {
        visited[vIdx] = 1;
        queueX.push(x);
        queueY.push(y);
      }
    }
  }

  // Borders
  for (let x = 0; x < width; x++) {
    tryEnqueue(x, 0);
    tryEnqueue(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    tryEnqueue(0, y);
    tryEnqueue(width - 1, y);
  }
  
  // Also seed inside the ring in the background zones:
  // Above head & around ears
  for (let x = 200; x <= 820; x += 20) {
    for (let y = 70; y <= 350; y += 20) {
      tryEnqueue(x, y);
    }
  }

  let head = 0;
  let clearedCount = 0;
  
  while (head < queueX.length) {
    const cx = queueX[head];
    const cy = queueY[head];
    head++;
    
    const idx = getIdx(cx, cy);
    data[idx] = 0;
    data[idx + 1] = 0;
    data[idx + 2] = 0;
    data[idx + 3] = 255; // Solid black
    clearedCount++;
    
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
  
  console.log(`Cleared ${clearedCount} checkerboard pixels (both inside and outside ring).`);
  
  await sharp(data, {
    raw: { width, height, channels: 4 }
  }).jpeg({ quality: 95 }).toFile('public/assets/images/groom_portrait.jpg');

  // Also copy to destinations
  fs.copyFileSync('public/assets/images/groom_portrait.jpg', 'public/images/wedding/groom_portrait.jpg');
  fs.copyFileSync('public/assets/images/groom_portrait.jpg', 'dist/assets/images/groom_portrait.jpg');
  fs.copyFileSync('public/assets/images/groom_portrait.jpg', 'dist/images/wedding/groom_portrait.jpg');

  console.log('Complete grooming done!');
}

processGroomAllCheckerboard().catch(console.error);
