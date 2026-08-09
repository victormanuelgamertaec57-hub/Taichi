import { chromium } from 'playwright';

async function testPerformance() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const start = performance.now();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  const totalLoad = performance.now() - start;

  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );

  const navigationEntries = JSON.parse(
    await page.evaluate(() => JSON.stringify(performance.getEntriesByType('navigation')[0]))
  );

  const paintEntries = JSON.parse(
    await page.evaluate(() => JSON.stringify(performance.getEntriesByType('paint')))
  );

  const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
  const fcp = fcpEntry ? Math.round(fcpEntry.startTime) : null;
  const domContentLoaded = Math.round(navigationEntries.domContentLoadedEventEnd - navigationEntries.startTime);
  const loadEvent = Math.round(navigationEntries.loadEventEnd - navigationEntries.startTime);

  console.log('=== Performance Metrics for http://localhost:5173 ===');
  console.log(`Total Network Idle Load Time: ${Math.round(totalLoad)}ms`);
  console.log(`First Contentful Paint (FCP): ${fcp}ms`);
  console.log(`DOM Content Loaded: ${domContentLoaded}ms`);
  console.log(`Load Event End: ${loadEvent}ms`);

  await browser.close();
}

testPerformance().catch(console.error);
