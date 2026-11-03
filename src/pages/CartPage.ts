import type { Locator, Page } from '@playwright/test';
import { ProductCard } from '../components/ProductCard';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly path = '/cart.html';
  readonly items: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  item(name: string): ProductCard {
    return new ProductCard(
      this.items.filter({ has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }) }),
    );
  }

  quantityOf(name: string): Locator {
    return this.item(name).root.getByTestId('item-quantity');
  }

  async names(): Promise<string[]> {
    return this.items.getByTestId('inventory-item-name').allTextContents();
  }
}
