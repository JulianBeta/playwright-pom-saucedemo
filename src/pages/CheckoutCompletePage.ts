import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly path = '/checkout-complete.html';
  readonly heading: Locator;
  readonly message: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('complete-header');
    this.message = page.getByTestId('complete-text');
    this.backHomeButton = page.getByTestId('back-to-products');
  }
}
