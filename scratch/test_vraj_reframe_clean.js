const path = require('path');
const sharp = require(path.join(__dirname, 'node_modules/sharp'));

async function reframeNatural() {
  const vrajPath = path.join(__dirname, '../frontend/public/images/contributors/vraj-pookie.png');

  const vrajImg = sharp(vrajPath);
  const vrajMeta = await vrajImg.metadata();

  // Head height in original vraj-pookie.png:
  // Top of hair is at y=2, chin is at y=845 -> head height = 843px.
  // In manan-gohil.png (887x887): head height is 445px (50.1%).
  // Target head height on 887x887 canvas: 450px.
  const scale = 450 / 843; // ~0.5338
  const newWidth = Math.round(vrajMeta.width * scale);
  const newHeight = Math.round(vrajMeta.height * scale);

  const resizedBuffer = await vrajImg
    .resize({ width: newWidth, height: newHeight, fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const canvasWidth = 887;
  const canvasHeight = 887;
  const canvasBuffer = Buffer.alloc(canvasWidth * canvasHeight * 4, 0);

  // Center horizontally, place top of hair at y = 28px (matching Manan at y=23px)
  const targetX = Math.round((canvasWidth - newWidth) / 2);
  const targetY = 28;

  const { data: vData, info: vInfo } = resizedBuffer;

  // Blit resized Vraj onto canvas
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

  const figureBottomY = targetY + vInfo.height - 1; // ~y=696
  const centerX = Math.round(canvasWidth / 2);

  // Typical navy blue shirt color on Vraj's shirt:
  // Dark navy: R=18, G=34, B=76 (hex #12224c)
  // Shadow navy: R=12, G=24, B=58 (hex #0c183a)
  // Highlight navy: R=28, G=48, B=98 (hex #1c3062)

  // 1. Where does the collar V-notch end?
  // Let's locate the bottom of the V-neck skin opening in the center column
  let vNeckBottomY = figureBottomY;
  for (let y = figureBottomY; y >= figureBottomY - 150; y--) {
    const idx = (y * canvasWidth + centerX) * 4;
    const r = canvasBuffer[idx], g = canvasBuffer[idx + 1], b = canvasBuffer[idx + 2];
    // Check if it's skin color (R > 180, G > 120)
    if (r > 180 && g > 120) {
      vNeckBottomY = y;
      break;
    }
  }

  console.log(`V-neck opening ends at y=${vNeckBottomY}, figure ends at y=${figureBottomY}`);

  // Below vNeckBottomY + 15, the shirt naturally overlaps/buttons into navy fabric!
  // Let's blend from vNeckBottomY into navy blue shirt fabric in the center
  const buttonOverlapY = vNeckBottomY + 12;

  // 2. Synthesize clean navy shirt fabric downwards from figureBottomY - 40 down to canvasHeight
  for (let y = figureBottomY - 40; y < canvasHeight; y++) {
    // Shoulder width expands smoothly down to the edges
    const progress = (y - (figureBottomY - 40)) / (canvasHeight - (figureBottomY - 40));
    // Shoulders flare from ~width 650px to 887px
    const halfWidth = Math.round(340 + progress * 130);
    const minX = Math.max(0, centerX - halfWidth);
    const maxX = Math.min(canvasWidth - 1, centerX + halfWidth);

    for (let x = minX; x <= maxX; x++) {
      const dstIdx = (y * canvasWidth + x) * 4;
      const distFromCenter = Math.abs(x - centerX);

      // If we are below the figure original bottom OR in the closed placket region
      const isOriginalPixel = y < figureBottomY && canvasBuffer[dstIdx + 3] > 200;
      const isSkinInPlacket = y >= buttonOverlapY && distFromCenter < 28 && canvasBuffer[dstIdx] > 150;

      if (!isOriginalPixel || isSkinInPlacket) {
        // Compute realistic navy shirt shading:
        // - Center button placket has subtle vertical shadow
        // - Sides have gentle shoulder curve shadow
        // - Add micro fabric noise
        let baseR = 18;
        let baseG = 34;
        let baseB = 76;

        // Subtle vertical placket line in the middle (x within 8px of center)
        if (distFromCenter < 10) {
          if (distFromCenter < 2) {
            // Seam line
            baseR = 12; baseG = 22; baseB = 52;
          } else if (x > centerX) {
            // Fold shadow
            baseR = 14; baseG = 26; baseB = 60;
          } else {
            // Fold highlight
            baseR = 24; baseG = 42; baseB = 88;
          }
        } else {
          // Subtle fabric gradient
          const shoulderCurve = (distFromCenter / halfWidth);
          const shadowFactor = 1.0 - (shoulderCurve * 0.25) + ((y - figureBottomY) / 300) * 0.05;
          baseR = Math.round(baseR * shadowFactor);
          baseG = Math.round(baseG * shadowFactor);
          baseB = Math.round(baseB * shadowFactor);
        }

        // Add subtle natural fabric grain
        const noise = ((x * 17 + y * 31) % 7) - 3;
        canvasBuffer[dstIdx] = Math.max(8, Math.min(255, baseR + noise));
        canvasBuffer[dstIdx + 1] = Math.max(16, Math.min(255, baseG + noise));
        canvasBuffer[dstIdx + 2] = Math.max(40, Math.min(255, baseB + noise));
        canvasBuffer[dstIdx + 3] = 255;
      }
    }
  }

  // Smooth blending transition at the boundary
  const blendStartY = figureBottomY - 15;
  const blendEndY = figureBottomY + 5;
  for (let y = blendStartY; y <= blendEndY; y++) {
    const alphaBlend = (y - blendStartY) / (blendEndY - blendStartY);
    for (let x = 0; x < canvasWidth; x++) {
      const idx = (y * canvasWidth + x) * 4;
      if (canvasBuffer[idx + 3] > 0) {
        // Ensure smooth anti-aliased edges
      }
    }
  }

  const outPath = path.join(__dirname, 'vraj_reframed_clean.png');
  await sharp(canvasBuffer, {
    raw: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
    },
  })
    .png()
    .toFile(outPath);

  console.log('Saved clean reframed Vraj to:', outPath);
}

reframeNatural().catch(console.error);
