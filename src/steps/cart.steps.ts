import { expect } from '@playwright/test';
import { Given, Then, When } from '../fixtures';
import { PRODUCTS } from '../data/products';
import { reloadApp } from '../utils/navigation';

const quoted = (list: string) => [...list.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

Given(/^my cart contains ((?:"[^"]+"(?:, )?)+)$/, async ({ seedCart }, list: string) => {
  await seedCart(quoted(list));
});

When('I add {string} to the cart', async ({ inventoryPage, scenario }, name: string) => {
  await inventoryPage.product(name).addToCart();
  scenario.cart.push(name);
});

When('I add every product to the cart', async ({ inventoryPage, scenario }) => {
  for (const { name } of PRODUCTS) {
    await inventoryPage.product(name).addToCart();
    scenario.cart.push(name);
  }
});

When('I remove {string} from the inventory page', async ({ inventoryPage, scenario }, name: string) => {
  await inventoryPage.product(name).remove();
  scenario.cart = scenario.cart.filter((n) => n !== name);
});

When('I remove {string} from the cart page', async ({ cartPage, scenario }, name: string) => {
  await cartPage.item(name).remove();
  scenario.cart = scenario.cart.filter((n) => n !== name);
});

When('I open the cart', async ({ inventoryPage }) => {
  await inventoryPage.header.openCart();
});

When('I continue shopping', async ({ cartPage }) => {
  await cartPage.continueShoppingButton.click();
});

When('I start the checkout', async ({ cartPage }) => {
  await cartPage.checkoutButton.click();
});

When('I reload the page', async ({ page }) => {
  await reloadApp(page);
});

Then('the cart badge should show {int}', async ({ inventoryPage }, count: number) => {
  await expect(inventoryPage.header.cartBadge).toHaveText(String(count));
});

Then('the cart badge should not be shown', async ({ inventoryPage }) => {
  await expect(inventoryPage.header.cartBadge).toBeHidden();
});

Then('{string} should show a {string} button', async ({ inventoryPage }, name: string, label: string) => {
  await expect(inventoryPage.product(name).cartButton).toHaveText(label);
});

Then('the cart should contain exactly the products I added', async ({ cartPage, scenario }) => {
  await expect(cartPage.items.getByTestId('inventory-item-name')).toHaveText(scenario.cart);
});

Then('the cart should contain only {string}', async ({ cartPage }, name: string) => {
  await expect(cartPage.items.getByTestId('inventory-item-name')).toHaveText([name]);
});

Then('the quantity of {string} should be {int}', async ({ cartPage }, name: string, quantity: number) => {
  await expect(cartPage.quantityOf(name)).toHaveText(String(quantity));
});

Then('I should be on the cart page', async ({ page, cartPage }) => {
  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(cartPage.header.title).toHaveText('Your Cart');
});
