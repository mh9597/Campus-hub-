const path = require('path');
const fs = require('fs');
const sharp = require(path.join(__dirname, 'node_modules/sharp'));

const rootDir = path.resolve(__dirname, '..');

async function optimizePng(filePath, maxWidth = null, quality = 85) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  const originalSize = fs.statSync(filePath).size;
  const tempPath = filePath + '.tmp';
  
  let pipeline = sharp(filePath);
  const metadata = await pipeline.metadata();
  
  if (maxWidth && metadata.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }
  
  await pipeline
    .png({ quality: quality, compressionLevel: 9, adaptiveFiltering: true })
    .toFile(tempPath);
    
  const newSize = fs.statSync(tempPath).size;
  if (newSize < originalSize) {
    fs.renameSync(tempPath, filePath);
    const reduction = (((originalSize - newSize) / originalSize) * 100).toFixed(1);
    console.log(`✅ Optimized ${path.basename(filePath)}: ${(originalSize/1024).toFixed(1)}KB -> ${(newSize/1024).toFixed(1)}KB (-${reduction}%)`);
  } else {
    fs.unlinkSync(tempPath);
    console.log(`ℹ️ Kept original ${path.basename(filePath)} (${(originalSize/1024).toFixed(1)}KB)`);
  }
}

async function run() {
  console.log('🚀 Optimizing resource icons...');
  const resourceIcons = [
    { file: 'frontend/src/pages/Resources/sparkles-icon.png', max: 192 },
    { file: 'frontend/src/pages/Resources/hacker-icon.png', max: 192 },
    { file: 'frontend/src/pages/Resources/data-science-icon.png', max: 192 },
    { file: 'frontend/src/pages/Resources/database-icon.png', max: 192 },
    { file: 'frontend/src/pages/Resources/computer-icon.png', max: 192 },
    { file: 'frontend/src/pages/Resources/dna-icon.png', max: 192 },
    { file: 'frontend/src/pages/Resources/exception-icon.png', max: 192 },
  ];

  for (const item of resourceIcons) {
    await optimizePng(path.join(rootDir, item.file), item.max, 90);
  }

  console.log('\n🚀 Optimizing public images...');
  const publicImages = [
    { file: 'frontend/public/images/hero-student.png', max: 1200 },
    { file: 'frontend/public/images/resource-hero-section.png', max: 1200 },
    { file: 'frontend/public/images/cta-banner-bg.png', max: 1400 },
    { file: 'frontend/public/images/verified-content.png', max: 600 },
    { file: 'frontend/public/images/organized.png', max: 600 },
    { file: 'frontend/public/images/fast-downloads.png', max: 600 },
    { file: 'frontend/public/images/updated-regularly.png', max: 600 },
    { file: 'frontend/public/images/books-tablet-3d.png', max: 600 },
    { file: 'frontend/public/images/left-hero-vector.png', max: 600 },
    { file: 'frontend/public/images/left-airplane-loop.png', max: 600 },
    { file: 'frontend/public/logos/cisco.png', max: 300 },
    { file: 'frontend/public/logos/wscubetech.png', max: 300 },
    { file: 'frontend/public/logos/internshala.png', max: 300 },
  ];

  for (const item of publicImages) {
    await optimizePng(path.join(rootDir, item.file), item.max, 85);
  }

  console.log('\n✨ Image optimization completed!');
}

run().catch(console.error);
