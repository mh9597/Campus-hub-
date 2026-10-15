const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Minimal PNG alpha reader to find bounding box of alpha > 20
function analyzePng(filePath) {
  const buffer = fs.readFileSync(filePath);
  let offset = 8;
  let width, height;
  const idatChunks = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
      width = buffer.readUInt32BE(offset + 8);
      height = buffer.readUInt32BE(offset + 12);
    } else if (type === 'IDAT') {
      idatChunks.push(buffer.subarray(offset + 8, offset + 8 + length));
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + length;
  }

  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
  // Assuming RGBA (colorType 6, bitDepth 8)
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel + 1; // 1 filter byte per row

  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * stride + 1; // skip filter byte
    for (let x = 0; x < width; x++) {
      const alpha = decompressed[rowOffset + x * bytesPerPixel + 3];
      if (alpha > 30) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  return {
    file: path.basename(filePath),
    width,
    height,
    personBox: { minX, maxX, minY, maxY, personWidth: maxX - minX, personHeight: maxY - minY },
    topPercent: ((minY / height) * 100).toFixed(1) + '%',
    heightPercent: (((maxY - minY) / height) * 100).toFixed(1) + '%',
    widthPercent: (((maxX - minX) / width) * 100).toFixed(1) + '%',
  };
}

try {
  const dir = path.join(__dirname, '../frontend/public/images/contributors');
  console.log(analyzePng(path.join(dir, 'manan-gohil.png')));
  console.log(analyzePng(path.join(dir, 'akshat-khatri.png')));
  console.log(analyzePng(path.join(dir, 'manthan-prajapati.png')));
  console.log(analyzePng(path.join(dir, 'vraj-pookie.png')));
} catch (e) {
  console.error(e);
}
