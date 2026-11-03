import type { Locator, Page } from '@playwright/test';

export type DynamicCatalogPage = 'Lazy Load' | 'Spinner' | 'Slider';

export class SideMenu {
  readonly allItems: Locator;
  readonly dynamicCatalog: Locator;
  readonly about: Locator;
  readonly logout: Locator;
  readonly resetAppState: Locator;
  readonly closeButton: Locator;

  constructor(
    private readonly page: Page,
    private readonly openButton: Locator,
  ) {
    this.allItems = page.getByTestId('inventory-sidebar-link');
    this.dynamicCatalog = page.getByTestId('dynamic-catalog-sidebar-link');
    this.about = page.getByTestId('about-sidebar-link');
    this.logout = page.getByTestId('logout-sidebar-link');
    this.resetAppState = page.getByTestId('reset-sidebar-link');
    this.closeButton = page.getByRole('button', { name: 'Close Menu' });
  }

  async open() {
    await this.openButton.click();
  }

  async choose(item: 'All Items' | 'About' | 'Logout' | 'Reset App State') {
    await this.open();
    const links = {
      'All Items': this.allItems,
      About: this.about,
      Logout: this.logout,
      'Reset App State': this.resetAppState,
    };
    await links[item].click();
  }

  async openDynamicCatalog(page: DynamicCatalogPage) {
    await this.open();
    await this.dynamicCatalog.click();
    const slug = page.toLowerCase().replace(' ', '-');
    await this.page.getByTestId(`dynamic-catalog-${slug}-link`).click();
  }
}
