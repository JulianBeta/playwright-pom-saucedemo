import type { Locator } from '@playwright/test';

/** One product tile on the inventory page or one row in the cart. */
export class ProductCard {
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly image: Locator;
  readonly addButton: Locator;
  readonly removeButton: Locator;
  /** Whichever of Add to cart / Remove is currently shown. */
  readonly cartButton: Locator;

  constructor(readonly root: Locator) {
    this.name = root.getByTestId('inventory-item-name');
    this.description = root.getByTestId('inventory-item-desc');
    this.price = root.getByTestId('inventory-item-price');
    this.image = root.getByRole('img');
    this.addButton = root.getByRole('button', { name: 'Add to cart' });
    this.removeButton = root.getByRole('button', { name: 'Remove' });
    this.cartButton = root.getByRole('button', { name: /^(Add to cart|Remove)$/ });
  }

  async addToCart() {
    await this.addButton.click();
  }

  async remove() {
    await this.removeButton.click();
  }

  async openDetails() {
    await this.name.click();
  }
}
