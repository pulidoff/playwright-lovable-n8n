class DashboardPage {
  constructor(page) {
    this.page = page;

    this.newTaskInput = page.getByPlaceholder(/add.*task|new task|task name|what needs/i);
    this.addTaskButton = page.getByRole('button', { name: /add|create|submit/i });
    this.taskList = page.locator('[data-testid="task-list"], ul, .task-list');
    this.emptyState = page.locator('[data-testid="empty-state"], .empty, .no-tasks');
  }

  taskItem(taskText) {
    return this.page.locator(`text=${taskText}`).first();
  }

  taskCompleteCheckbox(taskText) {
    return this.page
      .locator('li, [data-testid="task-item"]')
      .filter({ hasText: taskText })
      .getByRole('checkbox');
  }

  taskDeleteButton(taskText) {
    return this.page
      .locator('li, [data-testid="task-item"]')
      .filter({ hasText: taskText })
      .getByRole('button', { name: /delete|remove|trash/i });
  }

  async createTask(taskText) {
    await this.newTaskInput.fill(taskText);
    await this.addTaskButton.click();
  }

  async completeTask(taskText) {
    await this.taskCompleteCheckbox(taskText).check();
  }

  async deleteTask(taskText) {
    await this.taskDeleteButton(taskText).click();
  }

  async isTaskVisible(taskText) {
    return this.taskItem(taskText).isVisible();
  }

  async isEmptyStateVisible() {
    return this.emptyState.isVisible();
  }
}

module.exports = { DashboardPage };
