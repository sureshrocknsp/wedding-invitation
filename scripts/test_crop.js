import sharp from 'sharp';
import fs from 'fs';

async function testCrops() {
  const scratchDir = 'C:/Users/Admin/.gemini/antigravity-ide/brain/5319ed6d-ceb0-42bd-9a0f-d2e3d3ea08ae/scratch';
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  // Groom at 15% offset (top = 31px)
  await sharp('public/assets/images/groom_portrait.jpg')
    .extract({ left: 0, top: 31, width: 819, height: 819 })
    .resize(400, 400)
    .jpeg({ quality: 90 })
    .toFile(`${scratchDir}/groom_crop_test.jpg`);

  // Bride at 10% offset (top = 20px)
  await sharp('public/assets/images/bride_portrait.jpg')
    .extract({ left: 0, top: 20, width: 819, height: 819 })
    .resize(400, 400)
    .jpeg({ quality: 90 })
    .toFile(`${scratchDir}/bride_crop_test.jpg`);

  console.log('Test crops generated successfully');
}

testCrops().catch(console.error);
