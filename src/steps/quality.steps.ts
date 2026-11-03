import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { Then, When } from '../fixtures';

const SCREENS = [
  'inventory',
  'product details',
  'cart',
  'checkout info',
  'checkout overview',
  'checkout complete',
] as const;
type Screen = (typeof SCREENS)[number];

When(
  'I visit the {string} screen',
  async (
    {
      seedCart,
      inventoryPage,
      productDetailPage,
      cartPage,
      checkoutInformationPage,
      checkoutOverviewPage,
      checkoutCompletePage,
    },
    screen: string,
  ) => {
    if (!SCREENS.includes(screen as Screen)) throw new Error(`Unknown screen "${screen}"`);
    if (screen !== 'inventory' && screen !== 'product details') await seedCart(['Sauce Labs Backpack']);
    const pages: Record<Screen, () => Promise<void>> = {
      inventory: () => inventoryPage.goto(),
      'product details': () => productDetailPage.gotoProduct(4),
      cart: () => cartPage.goto(),
      'checkout info': () => checkoutInformationPage.goto(),
      'checkout overview': () => checkoutOverviewPage.goto(),
      'checkout complete': () => checkoutCompletePage.goto(),
    };
    await pages[screen as Screen]();
  },
);

Then('the screen should match the {string} baseline', async ({ page }, name: string) => {
  // Wait until every image has finished loading (or failed) so screenshots are stable.
  await page.waitForFunction(() => [...document.images].every((img) => img.complete));
  await expect(page).toHaveScreenshot(`${name.replace(/\s+/g, '-')}.png`, {
    fullPage: true,
    // The copyright year changes every January; it is covered by a functional test instead.
    mask: [page.getByTestId('footer-copy')],
  });
});

Then('the screen should have no WCAG 2.1 AA violations', async ({ page, $testInfo }) => {
  const wcag = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const bestPractice = await new AxeBuilder({ page }).withTags(['best-practice']).analyze();
  await $testInfo.attach('axe WCAG 2.1 AA results', {
    body: JSON.stringify(wcag.violations, null, 2),
    contentType: 'application/json',
  });
  await $testInfo.attach('axe best-practice findings', {
    body:
      bestPractice.violations.map((v) => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`).join('\n') || 'none',
    contentType: 'text/plain',
  });
  expect(wcag.violations.map((v) => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`)).toEqual([]);
});
