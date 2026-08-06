import { chromium } from 'playwright';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  console.log('Launching browser for performance measurement...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navigating to http://localhost:5173...');
  
  const start = Date.now();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  const loadTime = Date.now() - start;

  // Retrieve Performance Timing metrics from the browser
  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );
  
  const paintMetrics = await page.evaluate(() => {
    return performance.getEntriesByType('paint').map(entry => ({
      name: entry.name,
      startTime: entry.startTime
    }));
  });

  const fcp = paintMetrics.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
  const fp = paintMetrics.find(p => p.name === 'first-paint')?.startTime || 0;
  const domReady = performanceTiming.domContentLoadedEventEnd - performanceTiming.navigationStart;

  console.log('\n--- PreIntroScreen Performance Metrics ---');
  console.log(`DOM Content Loaded (DOM Ready): ${domReady.toFixed(2)} ms`);
  console.log(`First Paint (FP): ${fp.toFixed(2)} ms`);
  console.log(`First Contentful Paint (FCP): ${fcp.toFixed(2)} ms`);
  console.log(`Total Page Load Time (Network Idle): ${loadTime} ms`);

  // Now navigate to StatScreen (screen 8)
  console.log('\nNavigating to StatScreen (Screen 8) to measure load time...');
  const navigateStart = Date.now();
  await page.evaluate(() => {
    window.useQuizStore.getState().goTo(8);
  });
  // Wait for the SVG components to render
  await page.waitForSelector('svg');
  const statLoadTime = Date.now() - navigateStart;

  console.log('--- StatScreen Performance Metrics ---');
  console.log(`Screen Transition & Stat Render Time: ${statLoadTime} ms`);

  await browser.close();
} catch (e) {
  console.error('Error during performance measurement:', e);
}
