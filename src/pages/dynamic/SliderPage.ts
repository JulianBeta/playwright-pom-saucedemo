import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class SliderPage extends BasePage {
  readonly path = '/dynamic-catalog-slider.html';
  readonly slide: Locator;
  readonly slideName: Locator;
  readonly slidePrice: Locator;
  readonly dots: Locator;

  constructor(page: Page) {
    super(page);
    this.slide = page.getByTestId('dynamic-catalog-slider-item');
    this.slideName = page.getByTestId('dynamic-catalog-slider-item-name');
    this.slidePrice = page.getByTestId('dynamic-catalog-slider-item-price');
    this.dots = page.getByTestId('dynamic-catalog-slider-dots').getByRole('button');
  }

  dotFor(productName: string): Locator {
    return this.page.getByRole('button', { name: `Show ${productName}`, exact: true });
  }
}
