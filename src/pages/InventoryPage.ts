import type { Locator, Page } from '@playwright/test';
import { ProductCard } from '../components/ProductCard';
import { BasePage } from './BasePage';

export type SortOption = 'Name (A to Z)' | 'Name (Z to A)' | 'Price (low to high)' | 'Price (high to low)';

export class InventoryPage extends BasePage {
  readonly path = '/inventory.html';
  readonly items: Locator;
  readonly sortSelect: Locator;
  readonly activeSort: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.activeSort = page.getByTestId('active-option');
  }

  product(name: string): ProductCard {
    return new ProductCard(
      this.items.filter({ has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }) }),
    );
  }

  cardAt(index: number): ProductCard {
    return new ProductCard(this.items.nth(index));
  }

  async names(): Promise<string[]> {
    return this.items.getByTestId('inventory-item-name').allTextContents();
  }

  async prices(): Promise<string[]> {
    return this.items.getByTestId('inventory-item-price').allTextContents();
  }

  async sortBy(option: SortOption) {
    await this.sortSelect.selectOption({ label: option });
  }
}
