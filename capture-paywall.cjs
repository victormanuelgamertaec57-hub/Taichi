const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 }
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Ir a la pantalla de paywall (id 23)
  await page.evaluate(() => {
    // Esperar a que el store esté disponible
    return new Promise(resolve => {
      setTimeout(() => {
        // Buscar en el DOM el provider de zustand
        const root = document.getElementById('root');
        if (root && root._reactRootContainer) {
          // Intentar con window.store si está expuesto
        }
        resolve(true);
      }, 500);
    });
  });

  // Tomar captura de la página
  await page.screenshot({
    path: 'screenshots/paywall-before.png',
    fullPage: true
  });

  console.log('Captura guardada');
  await browser.close();
})();
