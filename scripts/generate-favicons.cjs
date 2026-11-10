const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.join(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

// Distinctive architectural woodcraft emblem:
// Dark charcoal foundation with warm deep brown (#49372B) & bronze (#A5815B) geometric timber fluting & calipers
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1F1C1A"/>
      <stop offset="100%" stop-color="#141210"/>
    </linearGradient>
    <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF87"/>
      <stop offset="50%" stop-color="#A5815B"/>
      <stop offset="100%" stop-color="#806653"/>
    </linearGradient>
  </defs>

  <!-- Background tile with subtle border -->
  <rect width="512" height="512" rx="108" fill="url(#bgGrad)"/>
  <rect x="12" y="12" width="488" height="488" rx="96" fill="none" stroke="url(#bronzeGrad)" stroke-width="6" stroke-opacity="0.45"/>

  <!-- Architectural grid accents -->
  <line x1="120" y1="40" x2="120" y2="472" stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="2"/>
  <line x1="392" y1="40" x2="392" y2="472" stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="2"/>
  <line x1="40" y1="120" x2="472" y2="120" stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="2"/>
  <line x1="40" y1="392" x2="472" y2="392" stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="2"/>

  <!-- Stylized C & I Architectural Woodcraft Monogram -->
  <!-- Outer C Curve -->
  <path d="M 330 148 C 220 148 152 200 152 256 C 152 312 220 364 330 364" 
        fill="none" 
        stroke="url(#bronzeGrad)" 
        stroke-width="36" 
        stroke-linecap="round"/>

  <!-- Vertical I pillar with architectural wood fluting -->
  <rect x="238" y="172" width="36" height="168" rx="8" fill="#FFFFFF"/>
  <rect x="290" y="200" width="22" height="112" rx="6" fill="url(#bronzeGrad)"/>

  <!-- Golden square precision point -->
  <rect x="320" y="246" width="20" height="20" rx="3" fill="#D4AF87" transform="rotate(45 330 256)"/>
</svg>`;

/**
 * Creates a valid single-image ICO file from a PNG buffer.
 */
function createIcoFromPng(pngBuffer, width, height) {
  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(1, 4); // 1 image

  // Directory entry: 16 bytes
  const entry = Buffer.alloc(16);
  entry.writeUInt8(width >= 256 ? 0 : width, 0);
  entry.writeUInt8(height >= 256 ? 0 : height, 1);
  entry.writeUInt8(0, 2); // Color palette
  entry.writeUInt8(0, 3); // Reserved
  entry.writeUInt16LE(1, 4); // Color planes
  entry.writeUInt16LE(32, 6); // Bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // Image size in bytes
  entry.writeUInt32LE(6 + 16, 12); // Offset of image data

  return Buffer.concat([header, entry, pngBuffer]);
}

async function run() {
  // 1. Save favicon.svg and icon.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');
  console.log('Saved favicon.svg and icon.svg');

  const svgBuffer = Buffer.from(svgContent);

  // 2. Generate PNG sizes
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-512x512.png', size: 512 },
  ];

  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(path.join(publicDir, name));
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // 3. Generate favicon.ico (32x32 ICO wrapper)
  const png32 = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();
  const icoBuffer = createIcoFromPng(png32, 32, 32);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated favicon.ico (32x32 ICO)');
}

run().catch(console.error);

