import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

console.log('Iniciando navegación al paywall...');

async function next() {
  await page.waitForTimeout(200);
  
  const ageBtn = page.locator('[aria-label*="faixa de idade"]').first();
  if (await ageBtn.count() > 0) {
    await ageBtn.click();
    await page.waitForTimeout(200);
    return;
  }
  
  const optBtn = page.locator('.quiz-option-btn:not([disabled])').first();
  if (await optBtn.count() > 0) {
    await optBtn.click();
    await page.waitForTimeout(150);
    const moreOpts = page.locator('.quiz-option-btn:not([disabled])');
    if (await moreOpts.count() > 1) {
      await moreOpts.nth(1).click();
    }
  }
  
  const inputs = await page.locator('input').all();
  for (const inp of inputs) {
    const type = await inp.getAttribute('type');
    const placeholder = await inp.getAttribute('placeholder') || '';
    const value = await inp.inputValue();
    if (!value) {
      if (type === 'email') await inp.fill('maria@test.com');
      else if (type === 'date') await inp.fill('2025-12-31');
      else if (placeholder.toLowerCase().includes('nome')) await inp.fill('Maria');
    }
  }
  
  const continuar = page.locator('button:has-text("Continuar"):not([disabled])');
  if (await continuar.count() > 0) {
    await continuar.click();
    await page.waitForTimeout(200);
    return;
  }
  
  const cta = page.locator('.cta-btn:not([disabled])');
  if (await cta.count() > 0) {
    await cta.click();
    await page.waitForTimeout(200);
    return;
  }
  
  const otherBtn = page.locator('button').filter({ hasText: /interessa|Quero|Ver meu|Não tenho/i });
  if (await otherBtn.count() > 0) {
    await otherBtn.click();
    await page.waitForTimeout(200);
  }
}

for (let i = 0; i < 25; i++) {
  const body = await page.innerHTML('body');
  if (body.includes('R$77,90') && body.includes('Plan Mensal')) {
    console.log('¡Llegamos al paywall!');
    break;
  }
  await next();
}

await page.waitForTimeout(2000);

// Captura inicial
await page.screenshot({ path: 'screenshots/paywall-plan-default.png', fullPage: true });
console.log('Captura 1: Plan default');

// Buscar el botón CTA con texto "Quero meu plano"
const ctaButton = page.locator('a.cta-btn').first();
const hrefAntes = await ctaButton.getAttribute('href').catch(() => 'no encontrado');
console.log('href default:', hrefAntes);

// Plan Mensal
const mensalBtn = page.locator('button:has-text("Plan Mensal")').first();
if (await mensalBtn.count() > 0) {
  await mensalBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/paywall-plan-mensal.png', fullPage: true });
  const hrefMensal = await ctaButton.getAttribute('href').catch(() => 'no encontrado');
  console.log('href Mensal:', hrefMensal);
  console.log('Captura 2: Plan Mensal');
}

// Plan Semestral
const semestralBtn = page.locator('button:has-text("Plan Semestral")').first();
if (await semestralBtn.count() > 0) {
  await semestralBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/paywall-plan-semestral.png', fullPage: true });
  const hrefSemestral = await ctaButton.getAttribute('href').catch(() => 'no encontrado');
  console.log('href Semestral:', hrefSemestral);
  console.log('Captura 3: Plan Semestral');
}

// Plan Trimestral
const trimestralBtn = page.locator('button:has-text("Plan Trimestral")').first();
if (await trimestralBtn.count() > 0) {
  await trimestralBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/paywall-plan-trimestral.png', fullPage: true });
  const hrefTrimestral = await ctaButton.getAttribute('href').catch(() => 'no encontrado');
  console.log('href Trimestral:', hrefTrimestral);
  console.log('Captura 4: Plan Trimestral');
}

console.log('¡Capturas completadas!');
await browser.close();
