import type { Dialog } from '@playwright/test';
import { createBdd, test as base } from 'playwright-bdd';
import type { Customer } from '../data/customer';
import { productByName } from '../data/products';
import { PASSWORD, type Username } from '../data/users';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { LazyLoadPage } from '../pages/dynamic/LazyLoadPage';
import { SliderPage } from '../pages/dynamic/SliderPage';
import { SpinnerPage } from '../pages/dynamic/SpinnerPage';
import { openDeepLink, reloadApp } from '../utils/navigation';

/** Per-scenario state shared between steps. */
export interface Scenario {
  user?: Username;
  customer?: Customer;
  /** Names of products the scenario put in the cart. */
  cart: string[];
  dialogs: string[];
  loginDurationMs?: number;
  /** Product counts observed on the lazy-load page. */
  listedCount?: number;
}

interface Fixtures {
  scenario: Scenario;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutInformationPage: CheckoutInformationPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  spinnerPage: SpinnerPage;
  lazyLoadPage: LazyLoadPage;
  sliderPage: SliderPage;
  /** Starts a session without the login form (sets the same cookie the app sets). */
  signInAs: (user: Username) => Promise<void>;
  /** Seeds the cart the way the app stores it (localStorage) for fast checkout setup. */
  seedCart: (productNames: string[]) => Promise<void>;
}

export const test = base.extend<Fixtures>({
  // auto: starts with every scenario so alerts are recorded even before a step asks for them.
  scenario: [
    async ({ page }, use) => {
      const scenario: Scenario = { cart: [], dialogs: [] };
      // Record and dismiss alerts so known-bug scenarios can assert on them.
      const onDialog = (dialog: Dialog) => {
        scenario.dialogs.push(dialog.message());
        void dialog.dismiss();
      };
      page.on('dialog', onDialog);
      await use(scenario);
      page.off('dialog', onDialog);
    },
    { auto: true },
  ],
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  productDetailPage: async ({ page }, use) => use(new ProductDetailPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutInformationPage: async ({ page }, use) => use(new CheckoutInformationPage(page)),
  checkoutOverviewPage: async ({ page }, use) => use(new CheckoutOverviewPage(page)),
  checkoutCompletePage: async ({ page }, use) => use(new CheckoutCompletePage(page)),
  spinnerPage: async ({ page }, use) => use(new SpinnerPage(page)),
  lazyLoadPage: async ({ page }, use) => use(new LazyLoadPage(page)),
  sliderPage: async ({ page }, use) => use(new SliderPage(page)),
  signInAs: async ({ context, baseURL, scenario }, use) => {
    await use(async (user) => {
      scenario.user = user;
      await context.addCookies([{ name: 'session-username', value: user, url: baseURL! }]);
    });
  },
  seedCart: async ({ page, scenario }, use) => {
    await use(async (productNames) => {
      const ids = productNames.map((name) => productByName(name).id);
      await openDeepLink(page, '/inventory.html');
      await page.evaluate((cart) => localStorage.setItem('cart-contents', JSON.stringify(cart)), ids);
      await reloadApp(page);
      scenario.cart = [...productNames];
    });
  },
});

export { PASSWORD };
export const { Given, When, Then, Before, After } = createBdd(test);
