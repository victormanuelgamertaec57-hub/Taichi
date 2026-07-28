import { chromium } from 'playwright';
import fs from 'fs';

async function completeQuizAndCapture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  const screenshots = [];

  try {
    console.log('Starting quiz at localhost:5173');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Helper to click first available button and wait
    async function clickAndWait(selector) {
      const btn = await page.$(selector);
      if (btn) {
        await btn.click();
        await page.waitForTimeout(800);
        return true;
      }
      return false;
    }

    // Helper to click button containing text
    async function clickByText(text) {
      const btns = await page.$$('button');
      for (const btn of btns) {
        const content = await btn.textContent();
        if (content?.includes(text)) {
          await btn.click();
          await page.waitForTimeout(800);
          return true;
        }
      }
      return false;
    }

    // Helper to fill input and submit
    async function fillInputAndSubmit(text) {
      const input = await page.$('input[type="text"], input[type="email"]');
      if (input) {
        await input.fill(text);
        const submitBtn = await page.$('button[type="submit"], button:has-text("Continuar"), button:has-text("Ver meu plano")');
        if (submitBtn) {
          await submitBtn.click();
          await page.waitForTimeout(800);
          return true;
        }
      }
      return false;
    }

    // Screen 1: Select age range
    console.log('Screen 1: Selecting age range...');
    await clickByText('50'); // "50 – 59 anos"
    await page.waitForTimeout(1000);

    // Screens 2-18: Auto-advance through most screens
    console.log('Advancing through quiz screens...');
    
    // Keep clicking Continue/Yes options until we reach the paywall
    let attempts = 0;
    while (attempts < 30) {
      // Check if we're at paywall
      const paywallText = await page.$('text=/R\\$\\d+/');
      if (paywallText) {
        console.log('Reached paywall!');
        break;
      }

      // Try to find and click a primary action button
      let clicked = false;
      
      // Look for Continue buttons first
      const continueBtn = await page.$('button:has-text("Continuar"), button:has-text("Isso é para mim"), button:has-text("Quero algo diferente"), button:has-text("Isso me interessa")');
      if (continueBtn) {
        await continueBtn.click();
        clicked = true;
      } else {
        // Try first option button
        const firstOption = await page.$('.quiz-option-btn');
        if (firstOption) {
          await firstOption.click();
          clicked = true;
        }
      }
      
      if (clicked) {
        await page.waitForTimeout(1000);
      } else {
        attempts++;
        await page.waitForTimeout(500);
      }
      
      // Safety check - try to skip to paywall area
      if (attempts > 20) {
        // Try typing name and email to advance
        const nameInput = await page.$('input[placeholder*="nome"]');
        if (nameInput) {
          await nameInput.fill('Maria Silva');
          const submit = await page.$('button:has-text("Continuar")');
          if (submit) await submit.click();
          await page.waitForTimeout(800);
        }
        
        const emailInput = await page.$('input[placeholder*="e-mail"]');
        if (emailInput) {
          await emailInput.fill('maria@test.com');
          const submit = await page.$('button:has-text("Ver meu plano"), button:has-text("Continuar")');
          if (submit) await submit.click();
          await page.waitForTimeout(800);
        }
      }
    }

    // Now check if we're at the paywall
    await page.waitForTimeout(2000);
    const pageContent = await page.textContent('body');
    
    if (!pageContent?.includes('R$')) {
      console.log('Did not reach paywall. Page content sample:');
      console.log(pageContent?.substring(0, 500));
      
      // Try to directly manipulate the store
      console.log('\nTrying to navigate directly to paywall...');
      await page.evaluate(() => {
        // Find the Zustand store
        const storeKey = Object.keys(window).find(k => 
          k.includes('zustand') || k.includes('store') || k.includes('quiz')
        );
        console.log('Found store key:', storeKey);
        
        // Try to find any React state
        const root = document.getElementById('root');
        if (root && root.__reactFiber) {
          console.log('Found React Fiber');
        }
      });
      
      // Take whatever screenshot we have
      await page.screenshot({ path: 'screenshots/current-state.png', fullPage: true });
      screenshots.push('screenshots/current-state.png');
    } else {
      console.log('At paywall! Taking screenshots...');
      
      // Screenshot 1: Default (Trimestral should be active)
      await page.screenshot({ path: 'screenshots/final-1-default-trimestral.png', fullPage: true });
      console.log('Screenshot 1: Default (Trimestral)');
      screenshots.push('screenshots/final-1-default-trimestral.png');

      // Check button hrefs
      const buttonInfo = await page.evaluate(() => {
        const btns = document.querySelectorAll('.checkout-btn-plan');
        return Array.from(btns).map((b, i) => ({
          index: i,
          href: b.getAttribute('href'),
          isActive: b.classList.contains('active')
        }));
      });
      console.log('Button info:', JSON.stringify(buttonInfo, null, 2));

      // Try clicking Mensal
      const mensalBtn = await page.$('button:has-text("R$77")');
      if (mensalBtn) {
        await mensalBtn.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'screenshots/final-2-mensal.png', fullPage: true });
        console.log('Screenshot 2: Mensal');
        screenshots.push('screenshots/final-2-mensal.png');
      }

      // Check Mensal href
      const mensalHref = await page.evaluate(() => {
        const active = document.querySelector('.checkout-btn-plan.active');
        return active ? active.getAttribute('href') : 'none';
      });
      console.log(`Mensal href: ${mensalHref}`);

      // Try clicking Semestral
      const semestralBtn = await page.$('button:has-text("R$239")');
      if (semestralBtn) {
        await semestralBtn.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'screenshots/final-3-semestral.png', fullPage: true });
        console.log('Screenshot 3: Semestral');
        screenshots.push('screenshots/final-3-semestral.png');
      }

      // Check Semestral href
      const semestralHref = await page.evaluate(() => {
        const active = document.querySelector('.checkout-btn-plan.active');
        return active ? active.getAttribute('href') : 'none';
      });
      console.log(`Semestral href: ${semestralHref}`);

      // Try clicking Trimestral
      const trimestralBtn = await page.$('button:has-text("R$132")');
      if (trimestralBtn) {
        await trimestralBtn.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'screenshots/final-4-trimestral.png', fullPage: true });
        console.log('Screenshot 4: Trimestral');
        screenshots.push('screenshots/final-4-trimestral.png');
      }

      // Check Trimestral href
      const trimestralHref = await page.evaluate(() => {
        const active = document.querySelector('.checkout-btn-plan.active');
        return active ? active.getAttribute('href') : 'none';
      });
      console.log(`Trimestral href: ${trimestralHref}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: 'screenshots/error-state.png', fullPage: true });
  }

  await browser.close();
  console.log('\n✓ Done! Screenshots saved to screenshots/ folder');
  return screenshots;
}

// Ensure screenshots folder exists
fs.mkdirSync('screenshots', { recursive: true });

completeQuizAndCapture().catch(console.error);
