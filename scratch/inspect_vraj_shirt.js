const path = require('path');
const sharp = require(path.join(__dirname, 'node_modules/sharp'));

async function inspectVrajShirt() {
  const filePath = path.join(__dirname, '../frontend/public/images/contributors/vraj-pookie.png');
  const img = sharp(filePath);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  // Chin is at y = 845
  // Neck is from y = 845 to y = 1000
  // Shirt collar starts around y = 980 - 1050
  // Shirt shoulders go to y = 1253
  console.log('Height:', info.height, 'Width:', info.width);
  console.log('Chin ~ y=845');
  console.log('Collar ~ y=1020');
  console.log('Bottom ~ y=1253');
  console.log('Total shirt height present:', 1253 - 1020, 'px = ~233px');
}

inspectVrajShirt().catch(console.error);
