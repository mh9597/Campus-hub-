const path = require('path');
const sharp = require(path.join(__dirname, 'node_modules/sharp'));

async function inspectShirt() {
  const filePath = path.join(__dirname, '../frontend/public/images/contributors/vraj-pookie.png');
  const img = sharp(filePath);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  console.log(`Image info: ${info.width}x${info.height}`);
  // Check the bottom 100 rows
  for (let y = info.height - 100; y < info.height; y += 20) {
    let nonZero = 0;
    let colors = [];
    for (let x = 0; x < info.width; x += 50) {
      const idx = (y * info.width + x) * info.channels;
      if (data[idx + 3] > 30) {
        nonZero++;
        colors.push(`rgb(${data[idx]},${data[idx+1]},${data[idx+2]})`);
      }
    }
    console.log(`Row y=${y}: ${nonZero} non-transparent samples. Sample color: ${colors[Math.floor(colors.length/2)]}`);
  }
}

inspectShirt().catch(console.error);
