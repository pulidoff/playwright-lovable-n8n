const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const WAIT_SECONDS = 60;
const BASE_URL = 'https://abb95dd7-0f35-4a7d-b005-a2633f7e6534.lovableproject.com';
const STATE_PATH = path.join(__dirname, '..', 'auth', 'storageState.json');

(async () => {
  const authDir = path.dirname(STATE_PATH);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/auth`);

  console.log(`\nBrowser opened at ${BASE_URL}/auth`);
  console.log(`Please complete the login manually. Waiting ${WAIT_SECONDS} seconds...\n`);

  for (let i = WAIT_SECONDS; i > 0; i--) {
    process.stdout.write(`\r  Saving in ${i}s... `);
    await page.waitForTimeout(1000);
  }

  console.log('\n\nSaving storageState...');
  await context.storageState({ path: STATE_PATH });
  console.log(`Done. State saved to: ${STATE_PATH}`);

  await browser.close();
})();
