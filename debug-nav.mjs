import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Ver estructura de la primera pantalla
const btns = await page.locator('button').all();
console.log('Total buttons:', btns.length);

for (const btn of btns) {
  const text = await btn.textContent();
  const cls = await btn.getAttribute('class');
  console.log('- Text:', (text || '').trim().substring(0, 30), '| Class:', cls);
}

// Ver si hay opciones de quiz
const quizOpts = await page.locator('.quiz-option-btn').count();
console.log('\nQuiz options (.quiz-option-btn):', quizOpts);

// Ver botones de edad
const ageOpts = await page.locator('[aria-label*="faixa"]').count();
console.log('Age buttons:', ageOpts);

await browser.close();
