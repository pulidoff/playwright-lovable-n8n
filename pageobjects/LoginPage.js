class LoginPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('[data-testid="error-message"], .error, [role="alert"]');
    this.logoutButton = page.getByRole('button', { name: /sign out|log out|logout/i });
  }

  async goto() {
    await this.page.goto('/auth');
  }

  async login(email, password) {
    // Step 1: fill email and click Continue
    await this.emailInput.fill(email);
    await this.submitButton.click();

    // Step 2: wait for password field, fill it and submit
    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }

  async getErrorText() {
    return this.errorMessage.textContent();
  }
}

module.exports = { LoginPage };
