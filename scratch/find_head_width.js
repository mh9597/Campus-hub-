const path = require('path');
const sharp = require(path.join(__dirname, 'node_modules/sharp'));

async function findHeadWidth(fileName) {
  const filePath = path.join(__dirname, '../frontend/public/images/contributors', fileName);
  const img = sharp(filePath);
  const meta = await img.metadata();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  // Scan horizontal width at different Y percentages (20%, 30%, 40%, 50%, 60%, 70%, 80%)
  console.log(`\nWidth analysis for ${fileName} (${info.width}x${info.height}):`);
  for (let pct = 15; pct <= 85; pct += 10) {
    const y = Math.floor(info.height * (pct / 100));
    let minX = info.width, maxX = 0;
    for (let x = 0; x < info.width; x++) {
      const alpha = data[(y * info.width + x) * info.channels + 3];
      if (alpha > 30) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
    const rowWidth = maxX > minX ? maxX - minX : 0;
    console.log(`  at y=${pct}%: width=${rowWidth}px (${((rowWidth / info.width) * 100).toFixed(1)}%)`);
  }
}

async function run() {
  await findHeadWidth('manan-gohil.png');
  await findHeadWidth('manthan-prajapati.png');
  await findHeadWidth('vraj-pookie.png');
}

run().catch(console.error);
