const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const iconsDir = path.join(__dirname, 'src', 'icons');
const svgPath = path.join(iconsDir, 'icon.svg');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

for (const size of [16, 32, 48, 128]) {
  const outPath = path.join(iconsDir, `icon-${size}.png`);
  try {
    execSync(`rsvg-convert -w ${size} -h ${size} "${svgPath}" -o "${outPath}"`);
    console.log(`✓ Generated icon-${size}.png (${size}x${size})`);
  } catch (err) {
    console.error(`Error generating ${size}x${size} icon:`, err.message);
  }
}
