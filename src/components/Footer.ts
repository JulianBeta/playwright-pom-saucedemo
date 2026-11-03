import type { Locator, Page } from '@playwright/test';

export type SocialNetwork = 'X' | 'Facebook' | 'LinkedIn';

export class Footer {
  readonly copyright: Locator;

  constructor(private readonly page: Page) {
    this.copyright = page.getByTestId('footer-copy');
  }

  socialLink(network: SocialNetwork): Locator {
    return this.page.getByTestId(`social-${network.toLowerCase()}`);
  }
}
