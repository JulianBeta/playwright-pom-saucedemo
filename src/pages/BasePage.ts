import type { Page } from '@playwright/test';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { SideMenu } from '../components/SideMenu';
import { openDeepLink } from '../utils/navigation';

export abstract class BasePage {
  readonly header: Header;
  readonly menu: SideMenu;
  readonly footer: Footer;

  /** Path relative to baseURL. */
  abstract readonly path: string;

  constructor(readonly page: Page) {
    this.header = new Header(page);
    this.menu = new SideMenu(page, this.header.menuButton);
    this.footer = new Footer(page);
  }

  async goto() {
    await openDeepLink(this.page, this.path);
  }
}
