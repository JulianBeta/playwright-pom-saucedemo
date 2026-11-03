import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class SpinnerPage extends BasePage {
  readonly path = '/dynamic-catalog-spinner.html';
  readonly spinner: Locator;
  readonly grid: Locator;
  readonly cards: Locator;

  constructor(page: Page) {
    super(page);
    this.spinner = page.getByTestId('dynamic-catalog-spinner');
    this.grid = page.getByTestId('dynamic-catalog-spinner-grid');
    // Cards are numbered: spinner-item-0, spinner-item-1, ...
    this.cards = this.grid.getByTestId(/^spinner-item-\d+$/);
  }

  cardName(card: Locator): Locator {
    return card.getByTestId(/^spinner-item-\d+-name$/);
  }

  cardPrice(card: Locator): Locator {
    return card.getByTestId(/^spinner-item-\d+-price$/);
  }
}
