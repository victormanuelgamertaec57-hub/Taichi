import { chromium } from 'playwright';

try {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log('Page loaded');

  for (let i = 0; i < 30; i++) {
    const step = await page.locator('span').filter({ hasText: /Passo/ }).textContent().catch(() => '?');
    
    // Click en Quero meu plano
    const queroBtn = page.locator('button').filter({ hasText: /Quero meu plano/i });
    if (await queroBtn.count() > 0) {
      await queroBtn.click();
      await page.waitForTimeout(800);
      console.log(i+1, step, '- Quero meu plano!');
      continue;
    }
    
    // Click en edad
    const ageBtn = page.locator('[aria-label*="faixa de idade"]').first();
    if (await ageBtn.count() > 0) {
      await ageBtn.click();
      await page.waitForTimeout(300);
      console.log(i+1, step, '- Age');
      continue;
    }
    
    // Click en opciones de quiz
    const optBtn = page.locator('.quiz-option-btn').first();
    if (await optBtn.count() > 0) {
      await optBtn.click();
      await page.waitForTimeout(150);
      const moreOpts = page.locator('.quiz-option-btn:not([disabled])');
      if (await moreOpts.count() > 1) {
        await moreOpts.nth(1).click();
      }
      await page.waitForTimeout(150);
    }
    
    // Inputs - usar selectors más amplios
    const allInputs = await page.locator('input').all();
    for (const inp of allInputs) {
      const type = await inp.getAttribute('type');
      const placeholder = await inp.getAttribute('placeholder') || '';
      const value = await inp.inputValue();
      
      if (!value) {
        if (type === 'email') {
          await inp.fill('maria@test.com');
        } else if (type === 'date') {
          await inp.fill('2025-12-31');
        } else if (placeholder.toLowerCase().includes('nome') || placeholder.toLowerCase().includes('name')) {
          await inp.fill('Maria');
        }
      }
    }
    
    await page.waitForTimeout(100);
    
    // Continuar
    const continuar = page.locator('button:has-text("Continuar"):not([disabled])');
    if (await continuar.count() > 0) {
      await continuar.click();
      await page.waitForTimeout(300);
      console.log(i+1, step, '- Continuar');
      continue;
    }
    
    // CTA
    const cta = page.locator('.cta-btn:not([disabled])').first();
    if (await cta.count() > 0) {
      const text = await cta.textContent();
      await cta.click();
      await page.waitForTimeout(300);
      console.log(i+1, step, '- CTA:', (text || '').trim().substring(0, 15));
      continue;
    }
    
    // Otros botones
    const textBtn = page.locator('button').filter({ hasText: /interessa|Quero|Ver meu|Não tenho/i });
    if (await textBtn.count() > 0) {
      const text = await textBtn.textContent();
      await textBtn.click();
      await page.waitForTimeout(300);
      console.log(i+1, step, '- Text:', (text || '').trim().substring(0, 15));
      continue;
    }
    
    console.log(i+1, step, '- No action');
    await page.waitForTimeout(300);
  }

  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/paywall-final.png', fullPage: true });
  console.log('Captura guardada');
  await browser.close();
} catch (e) {
  console.error('Error:', e.message);
}
