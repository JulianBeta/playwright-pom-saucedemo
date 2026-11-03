import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['src/fixtures/index.ts', 'src/steps/**/*.ts'],
  missingSteps: 'fail-on-gen',
});

const isCI = !!process.env.CI;

export default defineConfig({
  testDir,
  // Baselines are committed; generated specs (.features-gen) are not.
  snapshotPathTemplate: 'screenshots/{testFilePath}/{arg}-{projectName}-{platform}{ext}',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  reporter: isCI ? [['blob'], ['github']] : [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  expect: {
    timeout: 7_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Visual baselines are rendered per browser; keep them to Chromium.
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, grepInvert: /@visual/ },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, grepInvert: /@visual/ },
  ],
});
