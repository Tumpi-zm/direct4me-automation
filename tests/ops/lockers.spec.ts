import { test, expect } from '../../fixtures/index';

test.describe('Lockers Page (Ops)', () => {
  test.beforeEach(async ({ pm, users }) => {
    await pm.onLoginPage.loginAs(users.ops);
    await pm.onLockersPage.navigateToLockersPage();
  });

  test('Lockers page heading is visible', async ({ pm }) => {
    expect(await pm.onLockersPage.isPageHeadingVisible()).toBe(true);
  });

  test('empty state is shown before selecting a company', async ({ pm }) => {
    expect(await pm.onLockersPage.isEmptyStateVisible()).toBe(true);
  });

  test('empty state text is correct', async ({ pm }) => {
    const text = await pm.onLockersPage.getEmptyStateText();
    expect(text).toContain('Select a company to load lockers');
  });

  test('selecting a company and Enabled status loads lockers', async ({ pm }) => {
    await pm.onLockersPage.selectCompany('Express One SI d.o.o.');
    await pm.onLockersPage.filterByStatus('Enabled');
    const rowCount = await pm.onLockersPage.getLockerRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('searching by serial number filters the locker list', async ({ pm }) => {
    await pm.onLockersPage.selectCompany('Express One SI d.o.o.');
    await pm.onLockersPage.searchLockers('082300004249');
    const rowCount = await pm.onLockersPage.getLockerRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });
});
