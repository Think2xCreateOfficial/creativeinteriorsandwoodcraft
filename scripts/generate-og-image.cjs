const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.join(__dirname, '..');
const imagesDir = path.join(projectRoot, 'public/images');

async function createLandscapeOgImage() {
  const width = 1200;
  const height = 630;

  // Use the high-resolution authentic interior photo
  const bgImagePath = path.join(imagesDir, 'interior-poster.jpg');
  
  const background = await sharp(bgImagePath)
    .resize(width, height, { fit: 'cover', position: 'center' })
    .toBuffer();

  const overlaySvg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#171513" stop-opacity="0.90"/>
        <stop offset="45%" stop-color="#171513" stop-opacity="0.70"/>
        <stop offset="75%" stop-color="#171513" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#171513" stop-opacity="0.92"/>
      </linearGradient>
      <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F5E6D3"/>
        <stop offset="50%" stop-color="#D4AF87"/>
        <stop offset="100%" stop-color="#E8C9A3"/>
      </linearGradient>
    </defs>

    <!-- Scrim overlay for high contrast readability -->
    <rect width="${width}" height="${height}" fill="url(#scrim)"/>

    <!-- Dual framing border -->
    <rect x="28" y="28" width="${width - 56}" height="${height - 56}" fill="none" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1.5"/>
    <rect x="36" y="36" width="${width - 72}" height="${height - 72}" fill="none" stroke="#D4AF87" stroke-opacity="0.35" stroke-width="1"/>

    <!-- Top Left: Studio Badge -->
    <g transform="translate(68, 68)">
      <rect width="270" height="36" rx="18" fill="#FFFFFF" fill-opacity="0.95"/>
      <text x="135" y="23" font-family="Arial, Helvetica, sans-serif" font-size="11.5" font-weight="bold" letter-spacing="2" fill="#49372B" text-anchor="middle">
        INTERIOR ARCHITECTURE
      </text>
    </g>

    <!-- Top Right: Google 5.0 Rating Badge -->
    <g transform="translate(920, 68)">
      <rect width="212" height="36" rx="18" fill="#171513" fill-opacity="0.9" stroke="#D4AF87" stroke-opacity="0.65" stroke-width="1"/>
      <text x="106" y="23" font-family="Arial, Helvetica, sans-serif" font-size="11.5" font-weight="bold" letter-spacing="1.5" fill="#FFFFFF" text-anchor="middle">
        &#9733; 5.0 GOOGLE RATED
      </text>
    </g>

    <!-- Main Typography -->
    <!-- Location Pin Kicker -->
    <text x="68" y="240" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" letter-spacing="3.5" fill="#D4AF87">
      MOGAPPAIR EAST &#8226; CHENNAI
    </text>

    <!-- Brand Name Heading -->
    <text x="68" y="315" font-family="Georgia, serif" font-size="58" font-weight="bold" fill="#FFFFFF" letter-spacing="-0.5">
      CREATIVE INTERIORS
    </text>
    <text x="68" y="380" font-family="Georgia, serif" font-size="44" font-weight="normal" font-style="italic" fill="url(#goldText)">
      &amp; Woodcraft
    </text>

    <!-- Services / Subheading -->
    <text x="68" y="445" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="500" fill="#E5E0D8" letter-spacing="0.4">
      Modular Kitchens &#8226; Custom Wardrobes &#8226; Turnkey Residential Interiors
    </text>

    <!-- Hairline Separator -->
    <line x1="68" y1="488" x2="${width - 68}" y2="488" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1"/>

    <!-- Bottom Contact & Details -->
    <text x="68" y="534" font-family="Arial, Helvetica, sans-serif" font-size="14.5" font-weight="600" fill="#F5E6D3" letter-spacing="0.5">
      In-House Carpentry &#8226; Transparent Fixed Pricing &#8226; Quality Woodwork
    </text>

    <text x="${width - 68}" y="534" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="bold" letter-spacing="1" fill="#FFFFFF" text-anchor="end">
      +91 95001 83310
    </text>
  </svg>`;

  const composite = await sharp(background)
    .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
    .toBuffer();

  // Save 1200x630 as pristine JPEG, WebP and PNG
  await sharp(composite)
    .jpeg({ quality: 98, mozjpeg: true })
    .toFile(path.join(imagesDir, 'og.jpg'));

  await sharp(composite)
    .webp({ quality: 100, effort: 6, smartSubsample: false })
    .toFile(path.join(imagesDir, 'og.webp'));

  await sharp(composite)
    .png({ compressionLevel: 9 })
    .toFile(path.join(imagesDir, 'og.png'));

  console.log('Successfully generated 1200x630 Open Graph preview images (og.jpg, og.webp, og.png)');
}

async function createSquareOgImage() {
  const width = 800;
  const height = 800;

  const bgImagePath = path.join(imagesDir, 'interior-poster.jpg');
  
  const background = await sharp(bgImagePath)
    .resize(width, height, { fit: 'cover', position: 'center' })
    .toBuffer();

  const overlaySvg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#171513" stop-opacity="0.85"/>
        <stop offset="35%" stop-color="#171513" stop-opacity="0.45"/>
        <stop offset="65%" stop-color="#171513" stop-opacity="0.60"/>
        <stop offset="100%" stop-color="#171513" stop-opacity="0.95"/>
      </linearGradient>
      <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F5E6D3"/>
        <stop offset="100%" stop-color="#D4AF87"/>
      </linearGradient>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#scrim)"/>

    <rect x="28" y="28" width="${width - 56}" height="${height - 56}" fill="none" stroke="#FFFFFF" stroke-opacity="0.20" stroke-width="1.5"/>
    <rect x="36" y="36" width="${width - 72}" height="${height - 72}" fill="none" stroke="#D4AF87" stroke-opacity="0.35" stroke-width="1"/>

    <!-- Top Left: Studio Badge -->
    <g transform="translate(64, 76)">
      <rect width="220" height="34" rx="17" fill="#FFFFFF" fill-opacity="0.92"/>
      <text x="110" y="22" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="bold" letter-spacing="2" fill="#49372B" text-anchor="middle">
        INTERIOR ARCHITECTURE
      </text>
    </g>

    <!-- Top Right: Google 5.0 Rating Badge -->
    <g transform="translate(550, 76)">
      <rect width="186" height="34" rx="17" fill="#171513" fill-opacity="0.88" stroke="#D4AF87" stroke-opacity="0.6"/>
      <text x="93" y="22" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="bold" letter-spacing="1" fill="#FFFFFF" text-anchor="middle">
        &#9733; 5.0 GOOGLE RATED
      </text>
    </g>

    <!-- Content Area -->
    <text x="64" y="525" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" letter-spacing="3.5" fill="#D4AF87">
      MOGAPPAIR EAST, CHENNAI
    </text>

    <text x="64" y="585" font-family="Georgia, serif" font-size="46" font-weight="bold" fill="#FFFFFF" letter-spacing="-0.5">
      CREATIVE INTERIORS
    </text>
    <text x="64" y="638" font-family="Georgia, serif" font-size="34" font-weight="normal" font-style="italic" fill="url(#goldText)">
      &amp; Woodcraft
    </text>

    <text x="64" y="695" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="500" fill="#E5E0D8" letter-spacing="0.5">
      Modular Kitchens &#8226; Custom Woodwork &#8226; Turnkey Homes
    </text>
    <text x="64" y="730" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF" letter-spacing="0.5">
      Call: +91 95001 83310
    </text>
  </svg>`;

  const composite = await sharp(background)
    .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
    .toBuffer();

  await sharp(composite)
    .jpeg({ quality: 98, mozjpeg: true })
    .toFile(path.join(imagesDir, 'og-square.jpg'));

  await sharp(composite)
    .webp({ quality: 100, effort: 6, smartSubsample: false })
    .toFile(path.join(imagesDir, 'og-square.webp'));

  console.log('Successfully generated 800x800 square Open Graph preview image (og-square.jpg, og-square.webp)');
}

async function run() {
  await createLandscapeOgImage();
  await createSquareOgImage();
}

run().catch(console.error);
