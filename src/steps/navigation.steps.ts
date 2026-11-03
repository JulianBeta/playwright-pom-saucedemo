import { expect } from '@playwright/test';
import { Then, When } from '../fixtures';
import type { SocialNetwork } from '../components/Footer';

type MenuItem = 'All Items' | 'About' | 'Logout' | 'Reset App State';

When('I choose {string} from the menu', async ({ inventoryPage }, item: string) => {
  await inventoryPage.menu.choose(item as MenuItem);
});

When('I open the menu', async ({ inventoryPage }) => {
  await inventoryPage.menu.open();
});

When('I close the menu', async ({ inventoryPage }) => {
  await inventoryPage.menu.closeButton.click();
});

Then('the {string} menu link should point to {string}', async ({ inventoryPage }, item: string, url: string) => {
  const links: Record<string, typeof inventoryPage.menu.about> = { About: inventoryPage.menu.about };
  await expect(links[item]).toHaveAttribute('href', url);
});

Then('the menu should be hidden', async ({ inventoryPage }) => {
  await expect(inventoryPage.menu.allItems).toBeHidden();
});

Then('the {string} footer link should point to {string}', async ({ inventoryPage }, network: string, url: string) => {
  await expect(inventoryPage.footer.socialLink(network as SocialNetwork)).toHaveAttribute('href', url);
});

Then('the {string} footer link should open in a new tab', async ({ inventoryPage }, network: string) => {
  await expect(inventoryPage.footer.socialLink(network as SocialNetwork)).toHaveAttribute('target', '_blank');
});

Then('the footer should show the copyright for the current year', async ({ inventoryPage }) => {
  await expect(inventoryPage.footer.copyright).toContainText(`© ${new Date().getFullYear()} Sauce Labs`);
});
