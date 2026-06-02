const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');

const EMAIL = process.env.TEST_EMAIL;
const PASSWORD = process.env.TEST_PASSWORD;

test.describe('Authentication', () => {
  let poManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await poManager.getLoginPage().goto();
  });

  test('successful login with valid credentials', async ({ page }) => {
    const loginPage = poManager.getLoginPage();

    await loginPage.login(EMAIL, PASSWORD);

    await expect(page).not.toHaveURL(/login|sign-in/i);
    await expect(page.locator('body')).not.toContainText(/invalid|incorrect|error/i);
  });

  test('failed login with invalid credentials', async ({ page }) => {
    const loginPage = poManager.getLoginPage();

    await loginPage.login('wrong@example.com', 'WrongPassword123!');

    await expect(page.locator('body')).toContainText(/invalid|incorrect|error|wrong/i);
  });

  test('successful logout after login', async ({ page }) => {
    const loginPage = poManager.getLoginPage();

    await loginPage.login(EMAIL, PASSWORD);
    await expect(page).not.toHaveURL(/login|sign-in/i);

    await loginPage.logout();

    await expect(page).toHaveURL(/login|sign-in|\//i);
  });
});
