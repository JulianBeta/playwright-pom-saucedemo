import { expect } from '@playwright/test';
import { Given, Then, When } from '../fixtures';
import { randomCustomer } from '../data/customer';
import { productByName } from '../data/products';
import { formatCents, taxFor, TAX_RATE, toCents } from '../utils/money';

Given('I am on the checkout information page', async ({ cartPage }) => {
  await cartPage.goto();
  await cartPage.checkoutButton.click();
});

When('I go to the checkout overview', async ({ cartPage, checkoutInformationPage, scenario }) => {
  await cartPage.goto();
  await cartPage.checkoutButton.click();
  scenario.customer = randomCustomer();
  await checkoutInformationPage.submit(scenario.customer);
});

When('I check out with valid customer information', async ({ cartPage, checkoutInformationPage, scenario }) => {
  await cartPage.checkoutButton.click();
  scenario.customer = randomCustomer();
  await checkoutInformationPage.submit(scenario.customer);
});

When('I submit valid customer information', async ({ checkoutInformationPage, scenario }) => {
  scenario.customer = randomCustomer();
  await checkoutInformationPage.submit(scenario.customer);
});

When(
  'I submit first name {string}, last name {string} and postal code {string}',
  async ({ checkoutInformationPage }, firstName: string, lastName: string, postalCode: string) => {
    await checkoutInformationPage.submit({ firstName, lastName, postalCode });
  },
);

When('I type {string} into the last name field', async ({ checkoutInformationPage }, text: string) => {
  await checkoutInformationPage.lastName.pressSequentially(text);
});

When('I cancel the checkout', async ({ checkoutInformationPage }) => {
  // Both checkout steps use the same cancel button.
  await checkoutInformationPage.cancelButton.click();
});

When('I finish the order', async ({ checkoutOverviewPage }) => {
  await checkoutOverviewPage.finishButton.click();
});

When('I go back home', async ({ checkoutCompletePage }) => {
  await checkoutCompletePage.backHomeButton.click();
});

Then('I should see the checkout error {string}', async ({ checkoutInformationPage }, message: string) => {
  await expect(checkoutInformationPage.error).toHaveText(message);
});

Then('I should still be on the checkout information page', async ({ page }) => {
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
});

Then('the last name field should contain {string}', async ({ checkoutInformationPage }, text: string) => {
  await expect(checkoutInformationPage.lastName).toHaveValue(text);
});

Then('the overview should list exactly the products in my cart', async ({ checkoutOverviewPage, scenario }) => {
  await expect(checkoutOverviewPage.items.getByTestId('inventory-item-name')).toHaveText(scenario.cart);
  await expect(checkoutOverviewPage.items.getByTestId('inventory-item-price')).toHaveText(
    scenario.cart.map((name) => productByName(name).price),
  );
});

// Totals are checked against the catalog (an independent oracle), not against numbers read from the page.
const itemTotalFor = (cart: string[]) => cart.reduce((sum, name) => sum + toCents(productByName(name).price), 0);

Then('the item total should equal the sum of the product prices', async ({ checkoutOverviewPage, scenario }) => {
  await expect(checkoutOverviewPage.itemTotal).toHaveText(`Item total: ${formatCents(itemTotalFor(scenario.cart))}`);
});

Then('the tax should be {int}% of the item total', async ({ checkoutOverviewPage, scenario }, percent: number) => {
  expect(percent / 100, 'tax rate in the scenario matches TAX_RATE').toBe(TAX_RATE);
  await expect(checkoutOverviewPage.tax).toHaveText(`Tax: ${formatCents(taxFor(itemTotalFor(scenario.cart)))}`);
});

Then('the total should equal the item total plus tax', async ({ checkoutOverviewPage, scenario }) => {
  const itemTotal = itemTotalFor(scenario.cart);
  await expect(checkoutOverviewPage.total).toHaveText(`Total: ${formatCents(itemTotal + taxFor(itemTotal))}`);
});

Then('I should see the order confirmation {string}', async ({ checkoutCompletePage }, heading: string) => {
  await expect(checkoutCompletePage.heading).toHaveText(heading);
});
