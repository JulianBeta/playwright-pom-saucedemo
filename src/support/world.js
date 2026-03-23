const { setWorldConstructor } = require('@cucumber/cucumber');
const { Logger } = require('../utils/logger');

class CustomWorld {
  constructor({ parameters }) {
    this.parameters = parameters || {};
    this.browserName = process.env.BROWSER || 'chromium';
    this.logger = new Logger();
    this.browser = null; //Playwright browser instance
    this.context = null; //Playwright browser context
    this.page = null; //Playwright page instance
    this.attach = null; // cucumber will assign at runtime
  }
}

setWorldConstructor(CustomWorld);

module.exports = { CustomWorld };
