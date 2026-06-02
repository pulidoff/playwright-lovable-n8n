const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');

test.describe('Authentication', () => {
  test('authenticated user lands on the app, not on /auth', async ({ page }) => {
    await page.goto('/');

    await expect(page).not.toHaveURL(/\/auth/);
  });

  test('unauthenticated user is redirected to /auth', async ({ browser }) => {
    const context = await browser.newContext(); // no storageState
    const page = await context.newPage();

    await page.goto('https://abb95dd7-0f35-4a7d-b005-a2633f7e6534.lovableproject.com/');

    await expect(page).toHaveURL(/\/auth/);
    await context.close();
  });

  test('logout returns user to /auth', async ({ page }) => {
    await page.goto('/');

    const poManager = new POManager(page);
    await poManager.getLoginPage().logout();

    await expect(page).toHaveURL(/\/auth/);
  });
});
