import { expect } from '@playwright/test';
import { Then, When } from '../fixtures';
import { PRODUCTS, productByName } from '../data/products';
import type { SortOption } from '../pages/InventoryPage';
import { toCents } from '../utils/money';

const byName = (a: string, b: string) => a.localeCompare(b);

When('I sort products by {string}', async ({ inventoryPage }, option: string) => {
  await inventoryPage.sortBy(option as SortOption);
});

When('I open the details of {string}', async ({ inventoryPage, productDetailPage }, name: string) => {
  await inventoryPage.product(name).openDetails();
  await expect(productDetailPage.backButton).toBeVisible();
});

When('I open the product with id {int}', async ({ productDetailPage }, id: number) => {
  await productDetailPage.gotoProduct(id);
});

When('I add the product to the cart from its details page', async ({ productDetailPage, scenario }) => {
  scenario.cart.push((await productDetailPage.name.textContent()) ?? '');
  await productDetailPage.addButton.click();
});

When('I go back to the products', async ({ productDetailPage }) => {
  await productDetailPage.backButton.click();
});

Then('I should see {int} products', async ({ inventoryPage }, count: number) => {
  await expect(inventoryPage.items).toHaveCount(count);
});

Then('every product should match the catalog', async ({ inventoryPage }) => {
  await expect(inventoryPage.items).toHaveCount(PRODUCTS.length);
  for (const product of PRODUCTS) {
    const card = inventoryPage.product(product.name);
    await expect.soft(card.description, product.name).toHaveText(product.description);
    await expect.soft(card.price, product.name).toHaveText(product.price);
  }
});

Then('every product should show its own image', async ({ inventoryPage }) => {
  for (const product of PRODUCTS) {
    const image = inventoryPage.product(product.name).image;
    await expect.soft(image, product.name).toHaveAttribute('src', new RegExp(`/${product.image}`));
    await expect.soft(image, product.name).toHaveAttribute('alt', product.name);
    // A loaded image has a natural width; a broken one does not.
    await expect.soft(image, `${product.name} loaded`).toHaveJSProperty('complete', true);
    expect
      .soft(await image.evaluate((img: HTMLImageElement) => img.naturalWidth), `${product.name} pixels`)
      .toBeGreaterThan(0);
  }
});

Then('the active sort should be {string}', async ({ inventoryPage }, option: string) => {
  await expect(inventoryPage.activeSort).toHaveText(option);
});

Then(
  'products should be sorted by {word} in {word} order',
  async ({ inventoryPage }, field: string, direction: string) => {
    const descending = direction === 'descending';
    if (field === 'name') {
      const expected = PRODUCTS.map((p) => p.name).sort(byName);
      if (descending) expected.reverse();
      await expect(inventoryPage.items.getByTestId('inventory-item-name')).toHaveText(expected);
    } else if (field === 'price') {
      const expected = PRODUCTS.map((p) => p.price).sort((a, b) => toCents(a) - toCents(b));
      if (descending) expected.reverse();
      await expect(inventoryPage.items.getByTestId('inventory-item-price')).toHaveText(expected);
    } else {
      throw new Error(`Unknown sort field "${field}"`);
    }
  },
);

Then('every product link should open its own details page', async ({ inventoryPage, productDetailPage }) => {
  for (const product of PRODUCTS) {
    await inventoryPage.goto();
    await inventoryPage.product(product.name).openDetails();
    await expect(productDetailPage.backButton).toBeVisible();
    await expect.soft(productDetailPage.name, `link for ${product.name}`).toHaveText(product.name);
  }
});

Then('the product details should match the catalog entry for {string}', async ({ productDetailPage }, name: string) => {
  const product = productByName(name);
  await expect(productDetailPage.page).toHaveURL(new RegExp(`id=${product.id}$`));
  await expect(productDetailPage.name).toHaveText(product.name);
  await expect(productDetailPage.description).toHaveText(product.description);
  await expect(productDetailPage.price).toHaveText(product.price);
  await expect(productDetailPage.image).toHaveAttribute('src', new RegExp(`/${product.image}`));
});

Then('the product name should be {string}', async ({ productDetailPage }, name: string) => {
  await expect(productDetailPage.name).toHaveText(name);
});

Then('no error alert should have been shown', async ({ scenario }) => {
  expect(scenario.dialogs, 'alerts shown').toEqual([]);
});
