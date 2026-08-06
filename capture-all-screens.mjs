import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  // Ensure qa-screenshots directory exists
  const dir = './qa-screenshots';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await delay(2000);

  console.log('Seeding store state...');
  await page.evaluate(() => {
    if (!window.useQuizStore) {
      throw new Error('window.useQuizStore is not defined! Verify that the store is exposed correctly.');
    }
    const store = window.useQuizStore.getState();
    store.setUserName('Maria');
    store.setUserAge('60-69');
    store.setUserGender('female');
    store.setAnswer('painZones', ['knees', 'lower_back']);
    store.setAnswer('practiceTime', 'morning');
    store.setAnswer('metaIdeal', 'grandkids');
    store.setAnswer('fechaObjetivo', '2026-09-04');
  });

  const totalScreens = 39;
  for (let id = 1; id <= totalScreens; id++) {
    console.log(`Navigating to screen ${id}/${totalScreens}...`);
    await page.evaluate((screenId) => {
      window.useQuizStore.getState().goTo(screenId);
    }, id);

    // Wait extra time for animations or transition sequences to complete
    if (id === 35) {
      // Analysis loading screen - wait
      await delay(1500);
    } else if (id === 37) {
      // Fade Sequence - wait
      await delay(1500);
    } else if (id === 38) {
      // Paywall - wait for carousel/images
      await delay(2500);
    } else {
      await delay(600);
    }

    const filename = `screen-${String(id).padStart(2, '0')}.png`;
    const filepath = path.join(dir, filename);

    if (id === 3) {
      // Capture female first
      await page.evaluate(() => {
        window.useQuizStore.getState().setUserGender('female');
      });
      await delay(300);
      const filepathFemale = path.join(dir, 'screen-03-female.png');
      await page.screenshot({ path: filepathFemale });
      console.log(`Saved screenshot: ${filepathFemale}`);

      // Capture male second
      await page.evaluate(() => {
        window.useQuizStore.getState().setUserGender('male');
      });
      await delay(300);
      const filepathMale = path.join(dir, 'screen-03-male.png');
      await page.screenshot({ path: filepathMale });
      console.log(`Saved screenshot: ${filepathMale}`);

      // Revert to female to continue flow normally
      await page.evaluate(() => {
        window.useQuizStore.getState().setUserGender('female');
      });
      await delay(300);
    }

    if (id === 4) {
      // Capture female first
      await page.evaluate(() => {
        window.useQuizStore.getState().setUserGender('female');
      });
      await delay(300);
      const filepathFemale = path.join(dir, 'screen-04-female.png');
      await page.screenshot({ path: filepathFemale });
      console.log(`Saved screenshot: ${filepathFemale}`);

      // Capture male second
      await page.evaluate(() => {
        window.useQuizStore.getState().setUserGender('male');
      });
      await delay(300);
      const filepathMale = path.join(dir, 'screen-04-male.png');
      await page.screenshot({ path: filepathMale });
      console.log(`Saved screenshot: ${filepathMale}`);

      // Revert to female to continue flow normally
      await page.evaluate(() => {
        window.useQuizStore.getState().setUserGender('female');
      });
      await delay(300);
    }

    if (id === 11) {
      // Capture female first
      await page.evaluate(() => {
        window.useQuizStore.getState().setUserGender('female');
      });
      await delay(300);
      const filepathFemale = path.join(dir, 'screen-11-female.png');
      await page.screenshot({ path: filepathFemale });
      console.log(`Saved screenshot: ${filepathFemale}`);

      // Capture male second
      await page.evaluate(() => {
        window.useQuizStore.getState().setUserGender('male');
      });
      await delay(300);
      const filepathMale = path.join(dir, 'screen-11-male.png');
      await page.screenshot({ path: filepathMale });
      console.log(`Saved screenshot: ${filepathMale}`);

      // Revert to female to continue flow normally
      await page.evaluate(() => {
        window.useQuizStore.getState().setUserGender('female');
      });
      await delay(300);
    }

    if (id === 34) {
      // Capture female first
      await page.evaluate(() => {
        window.useQuizStore.getState().setUserGender('female');
      });
      await delay(300);
      const filepathFemale = path.join(dir, 'screen-34-female.png');
      await page.screenshot({ path: filepathFemale });
      console.log(`Saved screenshot: ${filepathFemale}`);

      // Capture male second
      await page.evaluate(() => {
        window.useQuizStore.getState().setUserGender('male');
      });
      await delay(300);
      const filepathMale = path.join(dir, 'screen-34-male.png');
      await page.screenshot({ path: filepathMale });
      console.log(`Saved screenshot: ${filepathMale}`);

      // Revert to female to continue flow normally
      await page.evaluate(() => {
        window.useQuizStore.getState().setUserGender('female');
      });
      await delay(300);
    }

    await page.screenshot({ path: filepath, fullPage: id === 38 }); // Full page for paywall
    console.log(`Saved screenshot: ${filepath}`);
  }

  console.log('Closing browser...');
  await browser.close();
  console.log('Done! All screenshots captured successfully.');
} catch (e) {
  console.error('Error during execution:', e);
}
