const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('playwright');
const path = require('path');
const fs = require('fs');

setDefaultTimeout(60 * 1000);

function isHeaded() {
  if (process.env.HEADED && process.env.HEADED.toLowerCase() === 'true') return true;
  if (process.env.HEADLESS && process.env.HEADLESS.toLowerCase() === 'false') return true;
  return false;
}

function getSlowMo() {
  const val = parseInt(process.env.SLOWMO || '0', 10);
  return Number.isFinite(val) ? val : 0;
}

async function launchBrowser(name) {
  const options = { headless: !isHeaded(), slowMo: getSlowMo() };
  switch (name) {
    case 'firefox': return await firefox.launch(options);
    case 'webkit': return await webkit.launch(options);
    case 'chromium':
    default: return await chromium.launch(options);
  }
}

Before(async function () {
  try {
    this.logger.info('Launching browser', { browser: this.browserName });
    this.browser = await launchBrowser(this.browserName);
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    if (this.attach) {
      await this.attach(`Browser: ${this.browserName}`, 'text/plain');
    }
  try {
    const metaDir = path.resolve(`reports/json/${this.browserName}`);
    fs.mkdirSync(metaDir, { recursive: true });
    fs.writeFileSync(path.join(metaDir, 'run-start.txt'), new Date().toISOString(), 'utf-8');
  } catch (e) {
    this.logger.warn('Unable to write run-start meta', { error: e.message });
  }
  } catch (err) {
    this.logger.error('Error in Before hook', { error: err.message });
    throw err;
  }
});

After(async function (scenario) {
  try {
    const status = scenario && scenario.result ? scenario.result.status : 'unknown';
    if (this.logger) this.logger.info('Scenario finished', { status });
    if (status !== 'passed' && this.page) {
      const runId = process.env.RUN_ID || '';
      const baseDir = runId ? `reports/screenshots/${runId}/${this.browserName}` : `reports/screenshots/${this.browserName}`;
      const dir = path.resolve(baseDir);
      fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, `${Date.now()}-${(scenario.pickle && scenario.pickle.name || 'scenario').replace(/\\s+/g, '_')}.png`);
      const buffer = await this.page.screenshot({ path: filePath });
      if (this.attach) {
        await this.attach(buffer, 'image/png');
      }
      this.logger.error('Scenario failed, screenshot captured', { path: filePath });
    }
  } catch (err) {
    this.logger.error('Error capturing screenshot', { error: err.message });
  } finally {
    try {
      if (this.page) await this.page.close();
      if (this.context) await this.context.close();
      if (this.browser) await this.browser.close();
      this.logger.info('Closed browser resources');
    } catch (err) {
      this.logger.warn('Error closing browser resources', { error: err.message });
    }
  }
});

