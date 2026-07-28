// Render each PDF page to PNG for visual inspection
import { chromium } from '/Users/victorhoyos/.hermes/node/lib/node_modules/playwright/index.mjs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'page.html');
const outDir   = path.join(__dirname, 'preview');

import fs from 'fs';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 794, height: 1123 } });
const page = await context.newPage();

await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// Get number of sheets (each .sheet is one A4 page)
const totalPages = await page.evaluate(() => {
  return document.querySelectorAll('section.sheet, section.cover, section.ingredients-page').length || 5;
});

// Render each "sheet" as full A4 image
const sheets = await page.$$('section.sheet, section.cover');
for (let i = 0; i < sheets.length; i++) {
  const out = path.join(outDir, `page-${String(i + 1).padStart(2, '0')}.png`);
  await sheets[i].screenshot({ path: out, type: 'png' });
  console.log('Rendered', out);
}

await browser.close();
console.log('Done.');
