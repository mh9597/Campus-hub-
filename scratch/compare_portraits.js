const path = require('path');
const fs = require('fs');
const sharp = require(path.join(__dirname, 'node_modules/sharp'));

async function inspect(fileName) {
  const filePath = path.join(__dirname, '../frontend/public/images/contributors', fileName);
  const img = sharp(filePath);
  const meta = await img.metadata();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  // Find bounding box and distribution of alpha
  let top = info.height, bottom = 0, left = info.width, right = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const alpha = data[idx + 3];
      if (alpha > 30) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }

  // Let's also find where the shoulders widen (width of silhouette at bottom 15% vs middle)
  const bottomRowY = bottom - 10;
  let bottomMinX = info.width, bottomMaxX = 0;
  for (let x = 0; x < info.width; x++) {
    const idx = (bottomRowY * info.width + x) * info.channels;
    if (data[idx + 3] > 30) {
      if (x < bottomMinX) bottomMinX = x;
      if (x > bottomMaxX) bottomMaxX = x;
    }
  }

  console.log(`\n=== ${fileName} ===`);
  console.log(`Dimensions: ${info.width}x${info.height}`);
  console.log(`BBox: top=${top} (${((top/info.height)*100).toFixed(1)}%), bottom=${bottom} (${((bottom/info.height)*100).toFixed(1)}%)`);
  console.log(`Height of figure: ${bottom - top}px (${(((bottom - top)/info.height)*100).toFixed(1)}%)`);
  console.log(`Width at bottom: ${bottomMaxX - bottomMinX}px (${(((bottomMaxX - bottomMinX)/info.width)*100).toFixed(1)}%)`);
}

async function run() {
  await inspect('manan-gohil.png');
  await inspect('manthan-prajapati.png');
  await inspect('vraj-pookie.png');
}

run().catch(console.error);
