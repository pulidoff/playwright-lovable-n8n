const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');

test.describe('Task Management', () => {
  let poManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto('/');
  });

  test('create a new task', async ({ page }) => {
    const dashboardPage = poManager.getDashboardPage();
    const taskText = `Test task ${Date.now()}`;

    await dashboardPage.createTask(taskText);

    await expect(page.locator('body')).toContainText(taskText);
  });

  test('mark a task as complete', async ({ page }) => {
    const dashboardPage = poManager.getDashboardPage();
    const taskText = `Complete me ${Date.now()}`;

    await dashboardPage.createTask(taskText);
    await dashboardPage.completeTask(taskText);

    const checkbox = dashboardPage.taskCompleteCheckbox(taskText);
    await expect(checkbox).toBeChecked();
  });

  test('delete an existing task', async ({ page }) => {
    const dashboardPage = poManager.getDashboardPage();
    const taskText = `Delete me ${Date.now()}`;

    await dashboardPage.createTask(taskText);
    await expect(page.locator('body')).toContainText(taskText);

    await dashboardPage.deleteTask(taskText);

    await expect(page.locator('body')).not.toContainText(taskText);
  });

  test('empty state is shown when no tasks exist', async ({ page }) => {
    const dashboardPage = poManager.getDashboardPage();
    const taskText = `Solo task ${Date.now()}`;

    await dashboardPage.createTask(taskText);
    await dashboardPage.deleteTask(taskText);

    const emptyVisible = await dashboardPage.isEmptyStateVisible();
    const bodyText = await page.locator('body').textContent();
    const hasEmptySignal =
      emptyVisible || /no tasks|empty|nothing|add your first/i.test(bodyText);

    expect(hasEmptySignal).toBe(true);
  });
});
