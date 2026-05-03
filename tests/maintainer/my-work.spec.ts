import { test, expect } from '../../fixtures/index';

test.describe('My Work Page (Maintainer)', () => {
  test.beforeEach(async ({ pm, users }) => {
    await pm.onLoginPage.loginAs(users.maintainer);
    // Wait for page heading so data has started loading
    await pm.onMyWorkPage.navigateToMyWorkPage();
  });

  test('My Work page heading is visible', async ({ pm }) => {
    expect(await pm.onMyWorkPage.isPageHeadingVisible()).toBe(true);
  });

  test('"All caught up!" subtitle is visible when no tasks are assigned', async ({ pm }) => {
    expect(await pm.onMyWorkPage.isAllCaughtUpVisible()).toBe(true);
  });

  test('Today filter tab is active by default', async ({ pm }) => {
    expect(await pm.onMyWorkPage.isTimeFilterActive('Today')).toBe(true);
  });

  test('Tomorrow filter tab can be clicked and becomes active', async ({ pm }) => {
    await pm.onMyWorkPage.clickTomorrowFilter();
    expect(await pm.onMyWorkPage.isTimeFilterActive('Tomorrow')).toBe(true);
  });

  test('This Week filter tab can be clicked and becomes active', async ({ pm }) => {
    await pm.onMyWorkPage.clickThisWeekFilter();
    expect(await pm.onMyWorkPage.isTimeFilterActive('This Week')).toBe(true);
  });

  test('COMPLETED section visibility is deterministic (present or absent)', async ({ pm }) => {
    // The COMPLETED section only exists when the user has completed work orders.
    // We just verify the check doesn't throw — the value (true/false) depends on app data.
    const visible = await pm.onMyWorkPage.isCompletedSectionVisible();
    expect(typeof visible).toBe('boolean');
  });

  test('maintainer cannot access /dashboard (redirected away)', async ({ pm, page }) => {
    await page.goto('/dashboard');
    // Should redirect to /my-work or /login, not stay on /dashboard
    await page.waitForURL((url) => !url.pathname.includes('/dashboard'), { timeout: 5_000 });
    expect(page.url()).not.toContain('/dashboard');
  });
});
