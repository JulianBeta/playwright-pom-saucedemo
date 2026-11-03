import type { Locator, Page } from '@playwright/test';
import { openDeepLink } from '../utils/navigation';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly path = '/inventory-item.html';
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly image: Locator;
  readonly addButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    const details = page.getByTestId('inventory-item');
    this.name = details.getByTestId('inventory-item-name');
    this.description = details.getByTestId('inventory-item-desc');
    this.price = details.getByTestId('inventory-item-price');
    this.image = details.getByRole('img');
    this.addButton = page.getByRole('button', { name: 'Add to cart' });
    this.removeButton = page.getByRole('button', { name: 'Remove' });
    this.backButton = page.getByTestId('back-to-products');
  }

  async gotoProduct(id: number) {
    await openDeepLink(this.page, `${this.path}?id=${id}`);
  }
}
