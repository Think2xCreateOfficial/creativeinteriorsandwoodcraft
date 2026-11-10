const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.join(__dirname, '..');
const imagesDir = path.join(projectRoot, 'public/images');

async function createOgImage() {
  const width = 800;
  const height = 800;

  // Use the high-res authentic interior photo as base
  const bgImagePath = path.join(imagesDir, 'interiors/modular-kitchen.jpg');
  
  // Resize background photo to 800x800 with center crop
  const background = await sharp(bgImagePath)
    .resize(width, height, { fit: 'cover', position: 'center' })
    .toBuffer();

  // Create SVG overlay with editorial typography, subtle scrim, and brand badges
  const overlaySvg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#171513" stop-opacity="0.75"/>
        <stop offset="35%" stop-color="#171513" stop-opacity="0.30"/>
        <stop offset="60%" stop-color="#171513" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#171513" stop-opacity="0.94"/>
      </linearGradient>
      <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#D4AF87"/>
        <stop offset="100%" stop-color="#F5E6D3"/>
      </linearGradient>
    </defs>

    <!-- Dark gradient overlay for contrast -->
    <rect width="${width}" height="${height}" fill="url(#scrim)"/>

    <!-- Subtle framing border -->
    <rect x="28" y="28" width="${width - 56}" height="${height - 56}" fill="none" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="1.5"/>
    <rect x="36" y="36" width="${width - 72}" height="${height - 72}" fill="none" stroke="#D4AF87" stroke-opacity="0.35" stroke-width="1"/>

    <!-- Top Left: Studio Badge -->
    <g transform="translate(64, 76)">
      <rect width="210" height="34" rx="17" fill="#FFFFFF" fill-opacity="0.92"/>
      <text x="105" y="22" font-family="Arial, sans-serif" font-size="11" font-weight="bold" letter-spacing="2" fill="#49372B" text-anchor="middle">
        INTERIOR ARCHITECTURE
      </text>
    </g>

    <!-- Top Right: Google 5.0 Rating Badge -->
    <g transform="translate(560, 76)">
      <rect width="176" height="34" rx="17" fill="#171513" fill-opacity="0.85" stroke="#FFFFFF" stroke-opacity="0.2"/>
      <text x="88" y="22" font-family="Arial, sans-serif" font-size="11" font-weight="bold" letter-spacing="1" fill="#FFFFFF" text-anchor="middle">
        ★ 5.0 GOOGLE RATED
      </text>
    </g>

    <!-- Bottom Content Area -->
    <!-- Location Pin -->
    <text x="64" y="550" font-family="Arial, sans-serif" font-size="12" font-weight="bold" letter-spacing="3.5" fill="#D4AF87">
      MOGAPPAIR EAST, CHENNAI
    </text>

    <!-- Brand Name Heading -->
    <text x="64" y="610" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="#FFFFFF" letter-spacing="-0.5">
      CREATIVE INTERIORS
    </text>
    <text x="64" y="662" font-family="Georgia, serif" font-size="34" font-weight="normal" font-style="italic" fill="url(#goldText)">
      &amp; Woodcraft
    </text>

    <!-- Tagline -->
    <text x="64" y="718" font-family="Arial, sans-serif" font-size="15" font-weight="500" fill="#E5E0D8" letter-spacing="0.5">
      Thoughtful Spaces. Beautiful Craftsmanship.
    </text>
  </svg>`;

  const overlayBuffer = Buffer.from(overlaySvg);

  const composite = await sharp(background)
    .composite([{ input: overlayBuffer, top: 0, left: 0 }])
    .toBuffer();

  // Save 800x800 as JPEG, WebP and PNG
  await sharp(composite)
    .jpeg({ quality: 90 })
    .toFile(path.join(imagesDir, 'og.jpg'));

  await sharp(composite)
    .webp({ quality: 90 })
    .toFile(path.join(imagesDir, 'og.webp'));

  await sharp(composite)
    .png({ quality: 95 })
    .toFile(path.join(imagesDir, 'og.png'));

  console.log(`Successfully generated 800x800 Open Graph preview image (og.jpg, og.webp, og.png)`);
}

createOgImage().catch(console.error);

