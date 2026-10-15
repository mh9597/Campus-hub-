const fs = require('fs');
const path = require('path');

// Read PNG header to get width and height
function getPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.toString('ascii', 1, 4) !== 'PNG') {
    return null;
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height, size: fs.statSync(filePath).size };
}

const dir = path.join(__dirname, '../frontend/public/images/contributors');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

for (const f of files) {
  const p = path.join(dir, f);
  console.log(`${f}:`, getPngDimensions(p));
}
