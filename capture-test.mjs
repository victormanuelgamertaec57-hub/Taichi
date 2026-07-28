import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();

  // Ir a la app
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Esperar a que cargue
  await page.waitForSelector('text=FirmMe', { timeout: 10000 });
  await page.waitForTimeout(2000);

  // Navegar a la pantalla de paywall usando el store de zustand
  // Primero necesitamos encontrar el store
  await page.evaluate(() => {
    // Simular respuestas del quiz y navegar al final
    // Buscar elementos del quiz para hacer click
    const buttons = document.querySelectorAll('button');
    for (let i = 0; i < Math.min(buttons.length, 5); i++) {
      if (buttons[i].textContent && !buttons[i].textContent.includes('Voltar')) {
        buttons[i].click();
      }
    }
  });

  await page.waitForTimeout(1000);

  // Tomar captura de lo que sea que esté en pantalla
  await page.screenshot({
    path: 'screenshots/current-screen.png',
    fullPage: true
  });

  console.log('Captura guardada en screenshots/current-screen.png');
  await browser.close();
}

capture().catch(console.error);
