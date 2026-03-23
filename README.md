# Playwright + Cucumber (JavaScript) Automation Framework

Automates login and cart flow on Swag Labs (https://www.saucedemo.com/) using Playwright and CucumberJS with a Page Object Model.

## Prerequisites
- Node.js 18+ installed
- Browsers are managed by Playwright (installed automatically on first run)

## Install

```bash
npm install
```

## Project Structure
- features/ - Gherkin features
- src/pages/ - POM classes for pages
- src/steps/ - Step definitions
- src/support/ - Cucumber hooks and world
- data/credentials.json - Login users and passwords
- reports/ - JSON, screenshots, and generated HTML report

## Credentials
Stored in [credentials.json](//FPTLA-QATest/data/credentials.json). Valid demo users include: standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user. All use password `secret_sauce`.

## Run Tests
- All browsers in parallel and generate HTML report:
```bash
npm test
```
- Headed mode (visual execution) examples:
```bash
# Single browser headed
npm run test:chromium:headed
npm run test:firefox:headed
npm run test:webkit:headed

# All browsers headed (with slower actions)
npm run test:all:headed
```
You can also use environment variables directly:
```bash
HEADLESS=false SLOWMO=200 BROWSER=chromium cucumber-js --require src/support/world.js --require src/support/hooks.js --require src/steps/**/*.js
```
- Single browser:
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

## Reports
- Per-browser HTML reports:
  - Chromium: [reports/html/chromium/index.html](file:///Users/julianbetancourt/Documents/FPTLA-QATest/reports/html/chromium/index.html)
  - Firefox: [reports/html/firefox/index.html](file:///Users/julianbetancourt/Documents/FPTLA-QATest/reports/html/firefox/index.html)
  - WebKit: [reports/html/webkit/index.html](file:///Users/julianbetancourt/Documents/FPTLA-QATest/reports/html/webkit/index.html)
- Index page linking to all: [reports/html/index.html](file:///Users/julianbetancourt/Documents/FPTLA-QATest/reports/html/index.html)
- Screenshots on failure: [reports/screenshots](file:///Users/julianbetancourt/Documents/FPTLA-QATest/reports/screenshots)

## Debug Logging
A simple logger writes console output and a JSON log file under [reports/logs](file:///Users/julianbetancourt/Documents/FPTLA-QATest/reports/logs). Hooks log browser lifecycle and failures.

## Error Handling
- Hooks wrap setup/teardown in try/catch and rethrow to fail scenarios.
- Steps validate expected states and throw errors with descriptive messages.
- Failures capture screenshots and attach to the Cucumber report.

## Test Case Covered
- Open website
- Login using `standard_user` from credentials.json
- Verify products page visible
- Collect all product names and prices
- Add a product to cart and verify cart quantity
- Navigate to cart page, verify quantity and description, and that Remove/Checkout/Continue buttons are enabled
- Remove the product and verify cart quantity returns to 0

## Notes
- Parallel execution is enabled both across browsers and via Cucumber `--parallel`.
- Environment variable `BROWSER` selects the Playwright browser (`chromium`, `firefox`, `webkit`) in hooks.
