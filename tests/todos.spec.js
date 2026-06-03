const { test, expect } = require('@playwright/test');
const { TodoPage } = require('../pageobjects/TodoPage');

test.describe('Todo List', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('add a new task', async ({ page }) => {
    const title = `Task ${Date.now()}`;

    await todoPage.addTask(title);

    await expect(todoPage.taskItem(title)).toBeVisible();
  });

  test('mark a task as complete', async ({ page }) => {
    const title = `Complete ${Date.now()}`;

    await todoPage.addTask(title);
    await todoPage.completeTask(title);

    await expect(todoPage.completeCheckbox(title)).toHaveAttribute('data-state', 'checked');
  });

  test('delete a task', async ({ page }) => {
    const title = `Delete ${Date.now()}`;

    await todoPage.addTask(title);
    await expect(todoPage.taskItem(title)).toBeVisible();

    await todoPage.deleteTask(title);

    await expect(todoPage.taskItem(title)).not.toBeVisible();
  });

  test('empty state is shown when no tasks exist', async () => {
    await expect(todoPage.emptyState).toBeVisible();
  });
});
