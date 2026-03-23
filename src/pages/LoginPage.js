class LoginPage {
  constructor(page, logger) {
    this.page = page;
    this.logger = logger;
    this.url = 'https://www.saucedemo.com/';
    this.sel = {
      username: '#user-name',
      password: '#password',
      loginBtn: '#login-button',
      error: '.error-message-container'
    };
  }

  async open() {
    this.logger.info('Navigating to login page', { url: this.url });
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  async login(username, password) {
    this.logger.info('Attempt login', { username });
    await this.page.fill(this.sel.username, username);
    await this.page.fill(this.sel.password, password);
    await this.page.click(this.sel.loginBtn);
  }
}

module.exports = { LoginPage };
