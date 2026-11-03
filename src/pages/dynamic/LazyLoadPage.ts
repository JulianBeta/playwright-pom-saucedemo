import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class LazyLoadPage extends BasePage {
  readonly path = '/dynamic-catalog-lazy-load.html';
  readonly container: Locator;
  readonly sentinel: Locator;
  readonly names: Locator;
  readonly prices: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.getByTestId('dynamic-catalog-lazy-load-container');
    this.sentinel = page.getByTestId('dynamic-catalog-lazy-load-sentinel');
    this.names = this.container.getByTestId(/^lazy-load-item-\d+-name$/);
    this.prices = this.container.getByTestId(/^lazy-load-item-\d+-price$/);
  }

  /** Scrolls the sentinel into view, which triggers the next batch to load. */
  async loadMore() {
    const before = await this.names.count();
    await this.sentinel.scrollIntoViewIfNeeded();
    await this.page.mouse.wheel(0, 2_000);
    await expect.poll(() => this.names.count(), { message: 'next batch loaded' }).toBeGreaterThan(before);
  }
}
