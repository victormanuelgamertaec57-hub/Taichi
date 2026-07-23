/**
 * scripts/optimize-images.mjs
 * Generates WebP variants (400w, 600w, 800w) at quality 75 for each photo in age-photos and info-photos.
 * Run: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, basename, extname } from 'path';

const DIRS = [
  { input: 'src/assets/age-photos', output: 'src/assets/age-photos/optimized' },
  { input: 'src/assets/info-photos', output: 'src/assets/info-photos/optimized' },
  { input: 'src/assets/avatars', output: 'src/assets/avatars/optimized' },
  { input: 'src/assets/testimonials', output: 'src/assets/testimonials/optimized' }
];

const WIDTHS = [400, 600, 800];
const QUALITY = 75;

for (const { input, output } of DIRS) {
  try {
    await mkdir(output, { recursive: true });
    const files = (await readdir(input)).filter((f) =>
      ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f).toLowerCase())
    );

    console.log(`\nOptimizando ${files.length} imagen(es) en ${input}...\n`);

    for (const file of files) {
      const inputPath = join(input, file);
      const name = basename(file, extname(file));

      for (const width of WIDTHS) {
        const outputPath = join(output, `${name}-${width}w.webp`);

        const info = await sharp(inputPath)
          .resize(width, null, { withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toFile(outputPath);

        const kb = (info.size / 1024).toFixed(1);
        console.log(`  OK ${name}-${width}w.webp -> ${kb} KB`);
      }
    }
  } catch (err) {
    console.error(`Error procesando directorio ${input}:`, err.message);
  }
}

console.log('\nOptimización completa.\n');
