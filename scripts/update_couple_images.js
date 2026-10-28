import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const groomInput = 'C:/Users/Admin/.gemini/antigravity-ide/brain/5319ed6d-ceb0-42bd-9a0f-d2e3d3ea08ae/.user_uploaded/media_1793196002520.jpg';
const brideInput = 'C:/Users/Admin/.gemini/antigravity-ide/brain/5319ed6d-ceb0-42bd-9a0f-d2e3d3ea08ae/.user_uploaded/media_1793196002540.jpg';

async function updateCoupleImages() {
  console.log('Reading groom image from:', groomInput);
  console.log('Reading bride image from:', brideInput);

  // Process Groom image - optimize with high quality 95
  const groomBuffer = await sharp(groomInput)
    .jpeg({ quality: 95, mozjpeg: true })
    .toBuffer();

  // Process Bride image - optimize with high quality 95
  const brideBuffer = await sharp(brideInput)
    .jpeg({ quality: 95, mozjpeg: true })
    .toBuffer();

  const destinations = [
    { dir: 'public/assets/images', groom: 'groom_portrait.jpg', bride: 'bride_portrait.jpg' },
    { dir: 'public/images/wedding', groom: 'groom_portrait.jpg', bride: 'bride_portrait.jpg' },
    { dir: 'assets/images', groom: 'groom_portrait.jpg', bride: 'bride_portrait.jpg' },
    { dir: 'dist/assets/images', groom: 'groom_portrait.jpg', bride: 'bride_portrait.jpg' },
    { dir: 'dist/images/wedding', groom: 'groom_portrait.jpg', bride: 'bride_portrait.jpg' },
  ];

  for (const dest of destinations) {
    if (fs.existsSync(dest.dir)) {
      const groomPath = path.join(dest.dir, dest.groom);
      const bridePath = path.join(dest.dir, dest.bride);
      fs.writeFileSync(groomPath, groomBuffer);
      fs.writeFileSync(bridePath, brideBuffer);
      console.log(`Saved to ${groomPath} (${groomBuffer.length} bytes) and ${bridePath} (${brideBuffer.length} bytes)`);
    } else {
      console.log(`Directory does not exist, skipping: ${dest.dir}`);
    }
  }

  console.log('Successfully updated couple portraits across all directories!');
}

updateCoupleImages().catch(err => {
  console.error('Error updating couple images:', err);
  process.exit(1);
});
