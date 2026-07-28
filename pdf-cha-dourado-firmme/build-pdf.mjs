// Convert page.html → A4 PDF with Playwright
// Run: node build-pdf.mjs
import { chromium } from '/Users/victorhoyos/.hermes/node/lib/node_modules/playwright/index.mjs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'page.html');
const pdfPath  = path.join(__dirname, 'cha-dourado-firmme.pdf');

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
// Ensure web fonts are fully loaded before snapshotting
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);

await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});

await browser.close();
console.log('PDF created at:', pdfPath);
