// Export each .page element from user_manual.html to PNG using Playwright.
// Usage:
// 1) Install Node.js and run: npm install playwright
// 2) node export_manual_pages_playwright.js

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const htmlPath = path.resolve(__dirname, '..', 'user_manual.html');
  if (!fs.existsSync(htmlPath)) {
    console.error('user_manual.html not found at', htmlPath);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1400, height: 2000 } });
  const page = await context.newPage();
  const url = 'file://' + htmlPath.replace(/\\/g, '/');

  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });

  // Ensure fonts and images have loaded
  await page.waitForLoadState('networkidle', { timeout: 60000 });
  await page.evaluate(() => new Promise(res => setTimeout(res, 500))); // small pause

  const pages = await page.$$('div.page');
  if (!pages.length) {
    console.error('No .page elements found in the document.');
    await browser.close();
    process.exit(1);
  }

  console.log(`Found ${pages.length} pages; exporting...`);
  for (let i = 0; i < pages.length; i++) {
    const el = pages[i];

    // get bounding box via evaluate to avoid scrollIntoView issues
    const box = await el.evaluate(node => {
      const rect = node.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }; 
    });

    // clip must be integers
    const clip = {
      x: Math.max(0, Math.floor(box.x)),
      y: Math.max(0, Math.floor(box.y)),
      width: Math.max(1, Math.floor(box.width)),
      height: Math.max(1, Math.floor(box.height))
    };

    const outPath = path.resolve(__dirname, `..`, `manual_page_${String(i+1).padStart(2,'0')}.png`);
    try {
      await page.screenshot({ path: outPath, clip, omitBackground: false, timeout: 120000 });
      console.log('Saved', outPath);
    } catch (err) {
      console.warn('Element screenshot failed, falling back to fullPage screenshot for page', i+1, err.message);
      // fallback: capture a full page and crop locally if needed
      const fallbackPath = path.resolve(__dirname, `..`, `manual_page_${String(i+1).padStart(2,'0')}_full.png`);
      await page.screenshot({ path: fallbackPath, fullPage: true, timeout: 120000 });
      console.log('Saved fallback', fallbackPath);
    }
  }

  await browser.close();
  console.log('Export complete.');
})();
