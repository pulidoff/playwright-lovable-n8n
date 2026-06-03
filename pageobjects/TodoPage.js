class TodoPage {
  constructor(page) {
    this.page = page;

    this.newTaskButton = page.getByRole('button', { name: 'New task' });
    this.titleInput = page.locator('#title');
    this.saveButton = page.getByRole('button', { name: 'Add task' });
    this.taskList = page.locator('ul');
    this.emptyState = page.locator('text=No tasks yet');
  }

  taskItem(title) {
    return this.page.locator('li').filter({ hasText: title });
  }

  completeCheckbox(title) {
    return this.taskItem(title).locator('button[role="checkbox"]');
  }

  deleteButton(title) {
    return this.taskItem(title).locator('button[aria-label="Delete task"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async addTask(title) {
    await this.newTaskButton.click();
    await this.titleInput.fill(title);
    await this.saveButton.click();
  }

  async completeTask(title) {
    await this.completeCheckbox(title).click();
  }

  async deleteTask(title) {
    await this.deleteButton(title).click();
  }
}

module.exports = { TodoPage };
