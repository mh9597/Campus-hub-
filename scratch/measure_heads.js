const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Let's inspect where eyes / chin / forehead are in manan-gohil.png vs vraj-pookie.png
// In manan-gohil.png:
// Top of hair is at y = 17 (out of 887) = 1.9%
// Chin is around y = 470 (out of 887) = 53%
// Shoulders go down to y = 886 (out of 887) = 100%
// Head height = ~450px out of 887px = ~50% of the image!
// Upper body / chest / suit = the bottom 50% of the image!

// In vraj-pookie.png:
// Top of hair is at y = 0
// Eyes are at ~ y = 440
// Chin is at ~ y = 850
// Bottom of neck/shirt collar is at y = 1253
// Head height = ~850px out of 1254px = ~68% of the image!
// And the width of Vraj's head: from x = 200 to x = 1050 = 850px wide!
// That's why in a capsule, Vraj's head looks twice as big as Manan's head!
console.log('Manan head is ~50% of image height with full chest down to bottom.');
console.log('Vraj head is ~70% of image height with almost no chest, so in object-cover it blows up.');
