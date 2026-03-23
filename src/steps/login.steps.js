const { Given, When, Then } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { CartPage } = require('../pages/CartPage');

function loadCredentials() {
  const p = path.resolve('data/credentials.json');
  const data = fs.readFileSync(p, 'utf-8');
  return JSON.parse(data);
}

Given('I open the website', async function () {
  try {
    const loginPage = new LoginPage(this.page, this.logger);
    this.loginPage = loginPage;
    await loginPage.open();
  } catch (err) {
    this.logger.error('Error opening website', { error: err.message });
    throw err;
  }
});

When('I login as {string}', async function (userKey) {
  try {
    const creds = loadCredentials();
    const c = creds[userKey];
    if (!c) throw new Error(`No credentials for key: ${userKey}`);
    await this.loginPage.login(c.username, c.password);
  } catch (err) {
    this.logger.error('Error during login', { error: err.message });
    throw err;
  }
});

Then('I should see the products page', async function () {
  try {
    const productsPage = new ProductsPage(this.page, this.logger);
    this.productsPage = productsPage;
    const visible = await productsPage.isVisible();
    if (!visible) throw new Error('Products page is not visible');
  } catch (err) {
    this.logger.error('Products page not visible', { error: err.message });
    throw err;
  }
});

Then('I collect all products with name and price', async function () {
  try {
    const list = await this.productsPage.getAllProducts();
    this.products = list;
    this.logger.info('Products list', { products: list });
  } catch (err) {
    this.logger.error('Error collecting products', { error: err.message });
    throw err;
  }
});

Then('I add any product to the cart', async function () {
  try {
    await this.productsPage.addFirstProductToCart();
  } catch (err) {
    this.logger.error('Error adding product to cart', { error: err.message });
    throw err;
  }
});

Then('the cart quantity should be {int}', async function (qty) {
  try {
    const count = await this.productsPage.getCartQuantity();
    if (count !== qty) throw new Error(`Expected cart qty ${qty}, got ${count}`);
  } catch (err) {
    this.logger.error('Cart quantity mismatch', { error: err.message });
    throw err;
  }
});

When('I go to the cart page', async function () {
  try {
    await this.productsPage.openCart();
    this.cartPage = new CartPage(this.page, this.logger);
  } catch (err) {
    this.logger.error('Error opening cart page', { error: err.message });
    throw err;
  }
});

Then('I verify cart quantity and description', async function () {
  try {
    const qty = await this.cartPage.getQuantity();
    if (qty < 1) throw new Error('Cart quantity should be at least 1');
    const hasDesc = await this.cartPage.hasDescription();
    if (!hasDesc) throw new Error('Cart item description not visible');
  } catch (err) {
    this.logger.error('Cart content verification failed', { error: err.message });
    throw err;
  }
});

Then('remove, checkout, and continue buttons are enabled', async function () {
  try {
    const ok = await this.cartPage.verifyElementsEnabled();
    if (!ok) throw new Error('Cart page buttons are not enabled');
  } catch (err) {
    this.logger.error('Cart buttons verification failed', { error: err.message });
    throw err;
  }
});

Then('I remove the product from the cart', async function () {
  try {
    await this.cartPage.removeFirstItem();
  } catch (err) {
    this.logger.error('Error removing product from cart', { error: err.message });
    throw err;
  }
});

Then('the header cart quantity should be {int}', async function (qty) {
  try {
    const count = await this.cartPage.getHeaderCartCount();
    if (count !== qty) throw new Error(`Expected header cart qty ${qty}, got ${count}`);
  } catch (err) {
    this.logger.error('Header cart quantity mismatch', { error: err.message });
    throw err;
  }
});
