import { chromium } from 'playwright';
import path from 'path';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await delay(1000);

  // 1. Capture Screen 34 (CommitmentScreen - Male & Female)
  console.log('Capturing Screen 34...');
  await page.evaluate(() => {
    const store = window.useQuizStore.getState();
    store.setUserGender('female');
    store.setUserName('Maria');
    store.goTo(34);
  });
  await delay(400);
  await page.screenshot({ path: 'qa-screenshots/screen-34-female.png' });

  await page.evaluate(() => {
    const store = window.useQuizStore.getState();
    store.setUserGender('male');
    store.setUserName('Carlos');
    store.goTo(34);
  });
  await delay(400);
  await page.screenshot({ path: 'qa-screenshots/screen-34-male.png' });

  // 2. Capture Screen 36 (ProjectionScreen - Male & Female)
  console.log('Capturing Screen 36...');
  await page.evaluate(() => {
    const store = window.useQuizStore.getState();
    store.setUserGender('female');
    store.setUserName('Maria');
    store.setAnswer('fechaObjetivo', '2026-09-04');
    store.goTo(36);
  });
  await delay(400);
  await page.screenshot({ path: 'qa-screenshots/screen-36-female.png' });

  await page.evaluate(() => {
    const store = window.useQuizStore.getState();
    store.setUserGender('male');
    store.setUserName('Carlos');
    store.setAnswer('fechaObjetivo', '2026-09-04');
    store.goTo(36);
  });
  await delay(400);
  await page.screenshot({ path: 'qa-screenshots/screen-36-male.png' });

  // 3. Capture Screen 37 (FadeSequence - Female at line 2 with highlighted date)
  console.log('Capturing Screen 37 Female...');
  const pageF = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pageF.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await pageF.evaluate(() => {
    const store = window.useQuizStore.getState();
    store.setUserGender('female');
    store.setUserName('Maria');
    store.setAnswer('fechaObjetivo', '2026-09-04');
    store.goTo(37);
  });
  await delay(6300); // Reaches line 2: "El 28 de agosto, sentirás más estabilidad"
  await pageF.screenshot({ path: 'qa-screenshots/screen-37-female.png' });
  await pageF.close();

  // 4. Capture Screen 37 (FadeSequence - Male at line 2 with highlighted date)
  console.log('Capturing Screen 37 Male...');
  const pageM = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pageM.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await pageM.evaluate(() => {
    const store = window.useQuizStore.getState();
    store.setUserGender('male');
    store.setUserName('Carlos');
    store.setAnswer('fechaObjetivo', '2026-09-04');
    store.goTo(37);
  });
  await delay(6300); // Reaches line 2: "El 28 de agosto, sentirás más estabilidad"
  await pageM.screenshot({ path: 'qa-screenshots/screen-37-male.png' });
  await pageM.close();

  await browser.close();
  console.log('Finished capturing all targeted screens.');
}

run().catch(console.error);
