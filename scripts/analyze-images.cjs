const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function analyzeAll() {
  const dir = path.join(__dirname, '..', 'public/images/interiors');
  const files = fs.readdirSync(dir);
  const items = [];

  for (const f of files) {
    if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    const meta = await sharp(full).metadata();
    items.push({
      file: f,
      width: meta.width,
      height: meta.height,
      orientation: meta.width > meta.height ? 'Landscape' : meta.width < meta.height ? 'Portrait' : 'Square',
      aspect: Number((meta.width / meta.height).toFixed(2)),
      sizeKb: Math.round(stat.size / 1024),
    });
  }

  const rootDir = path.join(__dirname, '..', 'public/images');
  const rootFiles = fs.readdirSync(rootDir).filter(f => !fs.statSync(path.join(rootDir, f)).isDirectory());
  const rootItems = [];
  for (const f of rootFiles) {
    if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
    const full = path.join(rootDir, f);
    const stat = fs.statSync(full);
    const meta = await sharp(full).metadata();
    rootItems.push({
      file: f,
      width: meta.width,
      height: meta.height,
      orientation: meta.width > meta.height ? 'Landscape' : meta.width < meta.height ? 'Portrait' : 'Square',
      aspect: Number((meta.width / meta.height).toFixed(2)),
      sizeKb: Math.round(stat.size / 1024),
    });
  }

  const result = {
    interiorsCount: items.length,
    rootCount: rootItems.length,
    totalCount: items.length + rootItems.length,
    rootItems,
    interiors: items,
  };

  fs.writeFileSync(path.join(__dirname, '..', 'lib/image-inventory.json'), JSON.stringify(result, null, 2));
  console.log(`Saved image inventory (${result.totalCount} images) to lib/image-inventory.json`);
}

analyzeAll().catch(console.error);
