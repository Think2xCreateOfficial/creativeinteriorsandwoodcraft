const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.join(__dirname, '..');
const imagesDir = path.join(projectRoot, 'public/images');

async function convertDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await convertDir(full));
    } else if (/\.(jpe?g)$/i.test(entry.name)) {
      const ext = path.extname(entry.name);
      const baseName = path.basename(entry.name, ext);
      const webpName = `${baseName}.webp`;
      const webpFull = path.join(dir, webpName);

      const origStat = fs.statSync(full);
      const origSize = origStat.size;

      // High-fidelity WebP conversion (preserving color profiles, orientation, and dimensions)
      await sharp(full)
        .webp({ quality: 88, effort: 5, smartSubsample: true })
        .toFile(webpFull);

      const webpStat = fs.statSync(webpFull);
      const webpSize = webpStat.size;
      const savings = ((origSize - webpSize) / origSize) * 100;

      results.push({
        origFile: path.relative(projectRoot, full).replace(/\\/g, '/'),
        webpFile: path.relative(projectRoot, webpFull).replace(/\\/g, '/'),
        origKb: Number((origSize / 1024).toFixed(1)),
        webpKb: Number((webpSize / 1024).toFixed(1)),
        savedPercent: Number(savings.toFixed(1)),
      });
    }
  }

  return results;
}

async function run() {
  console.log('Starting high-fidelity WebP conversion...');
  const results = await convertDir(imagesDir);

  const totalOrigKb = results.reduce((sum, r) => sum + r.origKb, 0);
  const totalWebpKb = results.reduce((sum, r) => sum + r.webpKb, 0);
  const totalSavedPercent = ((totalOrigKb - totalWebpKb) / totalOrigKb) * 100;

  const report = {
    totalConverted: results.length,
    totalOrigKb: Number(totalOrigKb.toFixed(1)),
    totalWebpKb: Number(totalWebpKb.toFixed(1)),
    totalSavedKb: Number((totalOrigKb - totalWebpKb).toFixed(1)),
    totalSavedPercent: Number(totalSavedPercent.toFixed(1)),
    conversions: results,
  };

  fs.writeFileSync(
    path.join(projectRoot, 'lib/image-conversion-report.json'),
    JSON.stringify(report, null, 2),
  );

  console.log(`Converted ${results.length} images.`);
  console.log(`Original: ${(totalOrigKb / 1024).toFixed(2)} MB -> WebP: ${(totalWebpKb / 1024).toFixed(2)} MB`);
  console.log(`Total savings: ${totalSavedPercent.toFixed(1)}% (${((totalOrigKb - totalWebpKb) / 1024).toFixed(2)} MB saved)`);
}

run().catch(console.error);

