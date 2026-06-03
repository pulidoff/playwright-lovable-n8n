# playwright-lovable-n8n

![CI](https://github.com/pulidoff/playwright-lovable-n8n/actions/workflows/ci.yml/badge.svg)

End-to-end test suite for [Task Bliss](https://task-bliss-app-82.lovable.app) — a no-auth todo app built with [Lovable](https://lovable.dev), automated with Playwright.

## Description

Covers the full task lifecycle (add, complete, delete, empty state) using the Page Object Model pattern. No login required — tests run against the live app in headless Chromium.

## Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev) | Browser automation & test runner |
| Node.js / CommonJS | Runtime & module system |
| GitHub Actions | CI pipeline |

## Project Structure

```
playwright-lovable-n8n/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI pipeline
├── pageobjects/
│   └── TodoPage.js         # Locators and actions for the todo app
├── tests/
│   └── todos.spec.js       # 4 tests: add, complete, delete, empty state
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

Tests run automatically on every push and pull request to `main`. Artifacts (HTML report and screenshots) are uploaded on failure.
