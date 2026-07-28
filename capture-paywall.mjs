import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 390, height: 844 } // iPhone 14 size
});

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

// Navegar directamente a la pantalla de paywall (id 23)
await page.evaluate(() => {
  // El store usa zustand, necesitamos acceder al state
  // Buscar el store en window o usar el hook
  const storeElement = document.querySelector('[data-zustand-store]');
  
  // Alternativa: navegar usando localStorage o directamente
  // Vamos a usar setTimeout para esperar a que React hydrata
  return new Promise(resolve => {
    setTimeout(() => {
      // Encontrar el store de zustand
      if (window.__ZUSTAND_STORE__) {
        window.__ZUSTAND_STORE__.getState().goTo(23);
      }
      resolve(true);
    }, 1000);
  });
});

// Esperar a que cargue la pantalla
await page.waitForTimeout(2000);

// Tomar captura
await page.screenshot({
  path: 'paywall-screenshot.png',
  fullPage: true
});

console.log('Captura guardada en paywall-screenshot.png');
await browser.close();
