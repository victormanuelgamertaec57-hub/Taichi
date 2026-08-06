import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  const dir = './qa-screenshots';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log('Launching browser with video recording enabled...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: dir,
      size: { width: 390, height: 844 }
    },
    viewport: { width: 390, height: 844 }
  });

  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  
  console.log('Recording 5 seconds of PreIntroScreen loader sequence...');
  await delay(5000);

  console.log('Closing context to save video...');
  await context.close();
  await browser.close();

  // Find the recorded video and rename it to a friendly name
  const files = fs.readdirSync(dir);
  const videoFile = files.find(file => file.endsWith('.webm') && !file.startsWith('preintro-loader'));
  if (videoFile) {
    const oldPath = path.join(dir, videoFile);
    const newPath = path.join(dir, 'preintro-loader.webm');
    if (fs.existsSync(newPath)) {
      fs.unlinkSync(newPath);
    }
    fs.renameSync(oldPath, newPath);
    console.log(`Video successfully saved to: ${newPath}`);
  } else {
    console.log('No video file found to rename.');
  }
} catch (e) {
  console.error('Error during video recording:', e);
}
