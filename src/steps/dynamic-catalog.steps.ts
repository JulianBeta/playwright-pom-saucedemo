import { expect } from '@playwright/test';
import { Given, Then, When } from '../fixtures';
import { productByName, productForVariant } from '../data/products';
import type { DynamicCatalogPage } from '../components/SideMenu';

When('I open the {string} dynamic catalog from the menu', async ({ inventoryPage }, name: string) => {
  await inventoryPage.menu.openDynamicCatalog(name as DynamicCatalogPage);
});

// --- Spinner -------------------------------------------------------------

Then('a loading spinner should be shown', async ({ spinnerPage }) => {
  await expect(spinnerPage.spinner).toBeVisible();
});

Then('the spinner should disappear', async ({ spinnerPage }) => {
  await expect(spinnerPage.spinner).toBeHidden({ timeout: 10_000 });
});

Then('{int} products should be shown in the spinner catalog', async ({ spinnerPage }, count: number) => {
  await expect(spinnerPage.cards).toHaveCount(count, { timeout: 10_000 });
});

Then('every spinner catalog product should match its catalog price', async ({ spinnerPage }) => {
  await expect(spinnerPage.cards.first()).toBeVisible({ timeout: 10_000 });
  for (const card of await spinnerPage.cards.all()) {
    const name = (await spinnerPage.cardName(card).textContent()) ?? '';
    await expect.soft(spinnerPage.cardPrice(card), name).toHaveText(productByName(name).price);
  }
});

// --- Lazy load -----------------------------------------------------------

Then('some products should be listed', async ({ lazyLoadPage, scenario }) => {
  await expect(lazyLoadPage.names.first()).toBeVisible();
  scenario.listedCount = await lazyLoadPage.names.count();
});

When('I scroll to the end of the list', async ({ lazyLoadPage }) => {
  await lazyLoadPage.loadMore();
});

Then('more products should be listed', async ({ lazyLoadPage, scenario }) => {
  await expect.poll(() => lazyLoadPage.names.count()).toBeGreaterThan(scenario.listedCount ?? 0);
});

When('I scroll until the catalog starts repeating', async ({ lazyLoadPage }) => {
  await expect(lazyLoadPage.names.first()).toBeVisible();
  const first = await lazyLoadPage.names.first().textContent();
  for (let batch = 0; batch < 10; batch++) {
    const names = await lazyLoadPage.names.allTextContents();
    if (names.indexOf(first ?? '', 1) > 0) return;
    await lazyLoadPage.loadMore();
  }
  throw new Error('The lazy-loaded catalog never repeated within 10 batches');
});

/** Entries from the start of the list up to (not including) the first repeat of the first entry. */
async function oneCycle(names: string[]) {
  const repeatAt = names.indexOf(names[0], 1);
  return repeatAt > 0 ? names.slice(0, repeatAt) : names;
}

Then('every lazy-loaded variant should match its catalog price', async ({ lazyLoadPage }) => {
  const names = await lazyLoadPage.names.allTextContents();
  const prices = await lazyLoadPage.prices.allTextContents();
  const cycle = await oneCycle(names);
  cycle.forEach((name, i) => expect.soft(prices[i], name).toBe(productForVariant(name).price));
});

Then('no variant should appear twice within one catalog cycle', async ({ lazyLoadPage, $testInfo }) => {
  const cycle = await oneCycle(await lazyLoadPage.names.allTextContents());
  const duplicates = cycle.filter((name, i) => cycle.indexOf(name) !== i);
  await $testInfo.attach('catalog cycle', {
    body: cycle.map((n, i) => `${i + 1}. ${n}`).join('\n'),
    contentType: 'text/plain',
  });
  expect(duplicates, `duplicates within ${cycle.length} entries`).toEqual([]);
});

// --- Slider (time is controlled with page.clock) --------------------------

// Installed before the first navigation so the app's timers are fake from the start.
// Time keeps flowing (menus animate normally) until a step pauses it.
Given('the browser clock is under test control', async ({ page }) => {
  await page.clock.install();
});

When('time is paused', async ({ page }) => {
  // From here on, timers only fire when a step advances time explicitly.
  // pauseAt needs a moment in the future, but the fake clock keeps running while this step
  // talks to the browser; on a slow runner the target can slip into the past, so retry.
  for (let attempt = 1; ; attempt++) {
    const now = await page.evaluate(() => Date.now());
    try {
      await page.clock.pauseAt(now + 250 * attempt);
      return;
    } catch (error) {
      if (attempt >= 5 || !String(error).includes('fast-forward to the past')) throw error;
    }
  }
});

When('I select the slider dot for {string}', async ({ sliderPage }, name: string) => {
  await sliderPage.dotFor(name).click();
});

When('{int} seconds pass', async ({ page }, seconds: number) => {
  await page.clock.runFor(seconds * 1_000);
});

When('I hover over the slider', async ({ sliderPage }) => {
  await sliderPage.slide.hover();
});

// Arrange the starting slide explicitly instead of relying on where auto-play happened to be.
Given('the slider shows {string}', async ({ sliderPage }, name: string) => {
  await sliderPage.dotFor(name).click();
  await expect(sliderPage.slideName).toHaveText(name);
});

Then('the slider should show {string} at its catalog price', async ({ sliderPage }, name: string) => {
  await expect(sliderPage.slideName).toHaveText(name);
  await expect(sliderPage.slidePrice).toHaveText(productByName(name).price);
});

Then('only the dot for {string} should be marked as current', async ({ sliderPage }, name: string) => {
  await expect(sliderPage.dotFor(name)).toHaveAttribute('aria-current', 'true');
  const current = () =>
    sliderPage.dots.evaluateAll((dots) => dots.filter((dot) => dot.getAttribute('aria-current') === 'true').length);
  await expect.poll(current, { message: 'dots marked aria-current' }).toBe(1);
});

Then('the slider should no longer show {string}', async ({ sliderPage }, name: string) => {
  await expect(sliderPage.slideName).not.toHaveText(name);
});

Then('the slider should still show {string}', async ({ sliderPage }, name: string) => {
  await expect(sliderPage.slideName).toHaveText(name);
});
