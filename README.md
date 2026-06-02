# playwright-lovable-n8n

![CI](https://github.com/pulidoff/playwright-lovable-n8n/actions/workflows/ci.yml/badge.svg)

End-to-end test suite for a task manager app built with [Lovable](https://lovable.dev), automated with Playwright.

## Description

This project covers authentication and task management flows using the Page Object Model pattern. Tests run in CI on every push and pull request to `main`.

## Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev) | Browser automation & test runner |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable management |
| Node.js / CommonJS | Runtime & module system |
| GitHub Actions | CI pipeline |

## Project Structure

```
playwright-lovable-n8n/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI pipeline
├── pageobjects/
│   ├── LoginPage.js        # Login page locators and methods
│   ├── DashboardPage.js    # Dashboard locators and task methods
│   └── POManager.js        # Page Object factory
├── tests/
│   ├── auth.spec.js        # 3 auth tests: login, failed login, logout
│   └── tasks.spec.js       # 4 task tests: create, complete, delete, empty state
├── .env                    # Local credentials (git-ignored)
├── .gitignore
├── playwright.config.js
├── package.json
└── README.md
```

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps chromium
```

Create a `.env` file in the project root:

```env
TEST_EMAIL=your@email.com
TEST_PASSWORD=yourpassword
```

## Commands

```bash
# Run all tests (headless)
npm test

# Run tests in headed mode
npm run test:headed

# Open Playwright UI mode
npm run test:ui

# Show last HTML report
npm run report
```

## CI

Tests run automatically on push and pull requests to `main`. Set the following repository secrets in GitHub:

- `TEST_EMAIL`
- `TEST_PASSWORD`
