import { test, expect } from '../../fixtures/index';

test.describe('Sites Page (Ops)', () => {
  test.beforeEach(async ({ pm, users }) => {
    await pm.onLoginPage.loginAs(users.ops);
    await pm.onSitesPage.navigateToSitesPage();
  });

  test('Sites page heading is visible', async ({ pm }) => {
    expect(await pm.onSitesPage.isPageHeadingVisible()).toBe(true);
  });

  test('empty state is shown before selecting a company', async ({ pm }) => {
    expect(await pm.onSitesPage.isEmptyStateVisible()).toBe(true);
  });

  test('empty state text is correct', async ({ pm }) => {
    const text = await pm.onSitesPage.getEmptyStateText();
    expect(text).toContain('Select a company to load sites');
  });

  test('selecting a company loads site tabs', async ({ pm }) => {
    await pm.onSitesPage.selectCompany('Express One SI d.o.o.');
    expect(await pm.onSitesPage.isTabVisible('All')).toBe(true);
    expect(await pm.onSitesPage.isTabVisible('With Lockers')).toBe(true);
    expect(await pm.onSitesPage.isTabVisible('Without Lockers')).toBe(true);
  });

  test('searching for a site filters the list', async ({ pm }) => {
    await pm.onSitesPage.selectCompany('Express One SI d.o.o.');
    await pm.onSitesPage.searchSites('Ajdovščina');
    const rowCount = await pm.onSitesPage.getSiteRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });
});
