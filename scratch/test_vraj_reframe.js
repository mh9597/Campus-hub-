const path = require('path');
const sharp = require(path.join(__dirname, 'node_modules/sharp'));

async function reframe() {
  const vrajPath = path.join(__dirname, '../frontend/public/images/contributors/vraj-pookie.png');
  const mananPath = path.join(__dirname, '../frontend/public/images/contributors/manan-gohil.png');

  const mananMeta = await sharp(mananPath).metadata();
  console.log('Target Canvas:', mananMeta.width, 'x', mananMeta.height); // 887 x 887

  // Load Vraj original
  const vrajImg = sharp(vrajPath);
  const vrajMeta = await vrajImg.metadata();

  // We want Vraj's head (hair top to chin) to match Manan's head height (~450px)
  // Original head height = 845px
  // Target head height = 455px
  const scale = 455 / 845; // ~0.5385
  const newWidth = Math.round(vrajMeta.width * scale);
  const newHeight = Math.round(vrajMeta.height * scale);

  console.log(`Resizing Vraj to ${newWidth}x${newHeight} (scale: ${scale.toFixed(4)})`);
  const resizedBuffer = await vrajImg
    .resize({ width: newWidth, height: newHeight, fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Now create an 887 x 887 transparent canvas
  const canvasWidth = 887;
  const canvasHeight = 887;
  const canvasBuffer = Buffer.alloc(canvasWidth * canvasHeight * 4, 0);

  // Position Vraj so hair top is at y = 25px, horizontally centered
  const targetX = Math.round((canvasWidth - newWidth) / 2);
  const targetY = 25; // hair top at y=25 matches Manan at y=23

  console.log(`Pasting Vraj at x=${targetX}, y=${targetY}`);

  // Copy resized Vraj onto canvas
  const { data: vData, info: vInfo } = resizedBuffer;
  for (let y = 0; y < vInfo.height; y++) {
    const cy = targetY + y;
    if (cy >= canvasHeight) break;
    for (let x = 0; x < vInfo.width; x++) {
      const cx = targetX + x;
      if (cx < 0 || cx >= canvasWidth) continue;
      const srcIdx = (y * vInfo.width + x) * vInfo.channels;
      const dstIdx = (cy * canvasWidth + cx) * 4;
      canvasBuffer[dstIdx] = vData[srcIdx];
      canvasBuffer[dstIdx + 1] = vData[srcIdx + 1];
      canvasBuffer[dstIdx + 2] = vData[srcIdx + 2];
      canvasBuffer[dstIdx + 3] = vData[srcIdx + 3];
    }
  }

  // Where does Vraj's figure end?
  const figureBottomY = targetY + vInfo.height - 1;
  console.log(`Figure currently ends at y=${figureBottomY}. Remaining to canvas bottom: ${canvasHeight - figureBottomY}px`);

  // To naturally extend the navy shirt to the bottom:
  // For each column x, sample the last non-transparent pixel in that column
  // and extend downwards with natural shoulder outward flare and subtle vertical gradient
  for (let x = 0; x < canvasWidth; x++) {
    // Find the lowest non-transparent pixel in this column near figureBottomY
    let lastY = -1;
    let r = 0, g = 0, b = 0, a = 0;
    for (let y = figureBottomY; y >= figureBottomY - 30; y--) {
      const idx = (y * canvasWidth + x) * 4;
      if (canvasBuffer[idx + 3] > 100) {
        lastY = y;
        r = canvasBuffer[idx];
        g = canvasBuffer[idx + 1];
        b = canvasBuffer[idx + 2];
        a = canvasBuffer[idx + 3];
        break;
      }
    }

    if (lastY > 0) {
      // Extend downwards from lastY to canvasHeight
      for (let y = lastY + 1; y < canvasHeight; y++) {
        const dstIdx = (y * canvasWidth + x) * 4;
        // Keep the fabric color
        canvasBuffer[dstIdx] = r;
        canvasBuffer[dstIdx + 1] = g;
        canvasBuffer[dstIdx + 2] = b;
        canvasBuffer[dstIdx + 3] = 255;
      }
    }
  }

  // Also widen shoulders out towards left and right edges as it goes down
  // At figureBottomY, shoulders might not reach all the way to 0 and canvasWidth
  // Let's slope the shirt boundary outward naturally
  for (let y = figureBottomY - 80; y < canvasHeight; y++) {
    let firstX = -1, lastX = -1;
    for (let x = 0; x < canvasWidth; x++) {
      if (canvasBuffer[(y * canvasWidth + x) * 4 + 3] > 100) {
        if (firstX === -1) firstX = x;
        lastX = x;
      }
    }
    if (firstX !== -1 && lastX !== -1) {
      // Flare left shoulder outward
      const flare = Math.round((y - (figureBottomY - 80)) * 0.9);
      const newFirstX = Math.max(0, firstX - flare);
      const newLastX = Math.min(canvasWidth - 1, lastX + flare);
      
      const leftColorIdx = (y * canvasWidth + firstX) * 4;
      const lR = canvasBuffer[leftColorIdx], lG = canvasBuffer[leftColorIdx + 1], lB = canvasBuffer[leftColorIdx + 2];
      for (let x = newFirstX; x < firstX; x++) {
        const dstIdx = (y * canvasWidth + x) * 4;
        canvasBuffer[dstIdx] = lR;
        canvasBuffer[dstIdx + 1] = lG;
        canvasBuffer[dstIdx + 2] = lB;
        canvasBuffer[dstIdx + 3] = 255;
      }

      const rightColorIdx = (y * canvasWidth + lastX) * 4;
      const rR = canvasBuffer[rightColorIdx], rG = canvasBuffer[rightColorIdx + 1], rB = canvasBuffer[rightColorIdx + 2];
      for (let x = lastX + 1; x <= newLastX; x++) {
        const dstIdx = (y * canvasWidth + x) * 4;
        canvasBuffer[dstIdx] = rR;
        canvasBuffer[dstIdx + 1] = rG;
        canvasBuffer[dstIdx + 2] = rB;
        canvasBuffer[dstIdx + 3] = 255;
      }
    }
  }

  const outPath = path.join(__dirname, 'vraj_reframed.png');
  await sharp(canvasBuffer, {
    raw: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
    },
  })
    .png()
    .toFile(outPath);

  console.log('Saved reframed Vraj to:', outPath);
}

reframe().catch(console.error);
