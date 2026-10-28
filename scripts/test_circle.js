import sharp from 'sharp';

async function testCircleMask() {
  const scratchDir = 'C:/Users/Admin/.gemini/antigravity-ide/brain/5319ed6d-ceb0-42bd-9a0f-d2e3d3ea08ae/scratch';
  
  // Create circular SVG mask
  const circleMask = Buffer.from(`
    <svg width="400" height="400">
      <circle cx="200" cy="200" r="196" fill="#fff" />
    </svg>
  `);

  await sharp(`${scratchDir}/groom_crop_test.jpg`)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toFile(`${scratchDir}/groom_circle_test.png`);

  await sharp(`${scratchDir}/bride_crop_test.jpg`)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toFile(`${scratchDir}/bride_circle_test.png`);

  console.log('Circle tests created');
}

testCircleMask().catch(console.error);
