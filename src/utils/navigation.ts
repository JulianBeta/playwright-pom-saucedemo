import type { Page } from '@playwright/test';

/**
 * saucedemo.com is a single-page app on static hosting: every deep link (e.g. /cart.html)
 * answers HTTP 404 with a page whose script redirects to "/?/cart.html". `page.goto()` resolves
 * on that 404 page, so we also wait for the real app to render before the next step runs.
 */
export async function waitForApp(page: Page) {
  // eslint-disable-next-line playwright/no-raw-locators -- the app root has no test id
  await page.locator('#root > *').first().waitFor();
}

export async function openDeepLink(page: Page, path: string) {
  await page.goto(path);
  await waitForApp(page);
}

export async function reloadApp(page: Page) {
  await page.reload();
  await waitForApp(page);
}
