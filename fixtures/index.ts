import { test as base, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import { loadUsers, type UsersData } from '../utils/helpers';

type Direct4meFixtures = {
  pm: PageManager;
  users: UsersData;
};

/**
 * Extended Playwright test with:
 *  - `pm`    — PageManager instance (all page objects in one)
 *  - `users` — Credentials loaded from data/users.json
 *
 * Import { test, expect } from this file instead of '@playwright/test'.
 */
export const test = base.extend<Direct4meFixtures>({
  pm: async ({ page }, use) => {
    const pm = new PageManager(page);
    await use(pm);
  },

  users: async ({}, use) => {
    const users = loadUsers();
    await use(users);
  },
});

export { expect };
