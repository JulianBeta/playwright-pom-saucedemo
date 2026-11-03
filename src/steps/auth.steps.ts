import { expect } from '@playwright/test';
import { Given, PASSWORD, Then, When } from '../fixtures';
import { assertUsername } from '../data/users';
import { openDeepLink } from '../utils/navigation';

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

Given('I am signed in as {string}', async ({ signInAs, inventoryPage }, user: string) => {
  await signInAs(assertUsername(user));
  await inventoryPage.goto();
  await expect(inventoryPage.items.first()).toBeVisible({ timeout: 15_000 });
});

When('I log in as {string}', async ({ loginPage, scenario }, user: string) => {
  scenario.user = assertUsername(user);
  await loginPage.login(user, PASSWORD);
});

When('I log in as {string} and time it', async ({ loginPage, inventoryPage, scenario }, user: string) => {
  scenario.user = assertUsername(user);
  const started = Date.now();
  await loginPage.login(user, PASSWORD);
  await expect(inventoryPage.items.first()).toBeVisible({ timeout: 20_000 });
  scenario.loginDurationMs = Date.now() - started;
});

When(
  'I log in with username {string} and password {string}',
  async ({ loginPage }, username: string, password: string) => {
    await loginPage.login(username, password);
  },
);

When('I dismiss the login error', async ({ loginPage }) => {
  await loginPage.dismissError.click();
});

When('I open {string} without signing in', async ({ page }, path: string) => {
  await openDeepLink(page, path);
});

When('I log out', async ({ inventoryPage }) => {
  await inventoryPage.menu.choose('Logout');
});

When('I go back in the browser', async ({ page }) => {
  await page.goBack();
});

Then('I should see the products page', async ({ page, inventoryPage }) => {
  await expect(page).toHaveURL(/\/inventory\.html$/, { timeout: 15_000 });
  await expect(inventoryPage.header.title).toHaveText('Products');
});

Then('I should see the login page', async ({ loginPage }) => {
  await expect(loginPage.loginButton).toBeVisible();
});

Then('I should see the login error {string}', async ({ loginPage }, message: string) => {
  await expect(loginPage.error).toHaveText(message);
});

Then('no login error should be shown', async ({ loginPage }) => {
  await expect(loginPage.error).toBeHidden();
});

Then('the products page should have loaded within {int} ms', async ({ scenario, $testInfo }, budgetMs: number) => {
  $testInfo.annotations.push({ type: 'login duration', description: `${scenario.loginDurationMs} ms` });
  expect(scenario.loginDurationMs, 'login → products page duration (ms)').toBeLessThanOrEqual(budgetMs);
});

Then('no products should be visible', async ({ inventoryPage }) => {
  await expect(inventoryPage.items).toHaveCount(0);
});
