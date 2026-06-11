// optimize-images.mjs
// Converts all illustration PNGs to WebP. Run from the repo root:
//
//   npm install -D sharp
//   node optimize-images.mjs
//
// Originals are untouched — .webp files are written alongside them.
// After running, update imports (see notes), test locally, then delete
// the .png files from src/assets when you're confident.

import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const ASSETS_DIR = "./src/assets"; // adjust if your illustrations live elsewhere
const MAX_WIDTH = 1080;            // keeps full quality for result cards; use 800 for max speed
const QUALITY = 82;

const files = (await readdir(ASSETS_DIR)).filter((f) => f.endsWith(".png"));

if (files.length === 0) {
  console.log(`No PNGs found in ${ASSETS_DIR} — check the path.`);
  process.exit(1);
}

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const src = path.join(ASSETS_DIR, file);
  const dest = src.replace(/\.png$/, ".webp");
  const before = (await stat(src)).size;

  await sharp(src)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(dest);

  const after = (await stat(dest)).size;
  totalBefore += before;
  totalAfter += after;

  const pct = Math.round(100 - (after / before) * 100);
  console.log(
    `${file.padEnd(40)} ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB  (${pct}% smaller)`
  );
}

console.log(
  `\nTOTAL: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB ` +
    `(${Math.round(100 - (totalAfter / totalBefore) * 100)}% reduction)`
);
console.log(`\nNext: find-and-replace the import extensions, e.g.`);
console.log(`  grep -rl "\\.png" src/ | xargs sed -i '' 's/\\.png/.webp/g'   (macOS)`);
console.log(`Then npm run dev, click through both quiz modes, and verify the share card still renders.`);
