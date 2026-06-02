class LoginPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.getByRole('textbox', { name: /email/i });
    this.passwordInput = page.getByRole('textbox', { name: /password/i });
    this.submitButton = page.getByRole('button', { name: /sign in|log in|entrar/i });
    this.errorMessage = page.locator('[data-testid="error-message"], .error, [role="alert"]');
    this.logoutButton = page.getByRole('button', { name: /sign out|log out|logout/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
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
