import { test, expect } from '../../fixtures/index';

test.describe('Annual Preventive Page (Ops)', () => {
  test.beforeEach(async ({ pm, users }) => {
    await pm.onLoginPage.loginAs(users.ops);
    await pm.onAnnualPreventivePage.navigateToAnnualPreventivePage();
  });

  test('Annual Preventive page heading is visible', async ({ pm }) => {
    expect(await pm.onAnnualPreventivePage.isPageHeadingVisible()).toBe(true);
  });

  test('status tabs are visible', async ({ pm, page }) => {
    await expect(page.getByRole('tab', { name: /All/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Needs setup/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Overdue/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Due soon/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Scheduled/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Up to date/ })).toBeVisible();
  });

  test('Update due date modal opens for a site', async ({ pm }) => {
    await pm.onAnnualPreventivePage.clickUpdateDueDateForSite('Ajdovščina AMZS');
    expect(await pm.onAnnualPreventivePage.isUpdateDueDateModalOpen()).toBe(true);
  });

  test('cancelling the due date modal closes it', async ({ pm }) => {
    await pm.onAnnualPreventivePage.clickUpdateDueDateForSite('Ajdovščina AMZS');
    await pm.onAnnualPreventivePage.cancelDueDateUpdate();
    expect(await pm.onAnnualPreventivePage.isUpdateDueDateModalOpen()).toBe(false);
  });

  test('Create WO modal opens for an Up to date site', async ({ pm }) => {
    await pm.onAnnualPreventivePage.clickCreateWorkOrderForSite('Ajdovščina AMZS');
    expect(await pm.onAnnualPreventivePage.isCreateAnnualWOModalOpen()).toBe(true);
  });

  test('submitting annual preventive WO shows failure toast (known 403 blocker)', async ({ pm }) => {
    await pm.onAnnualPreventivePage.clickCreateWorkOrderForSite('Ajdovščina AMZS');
    await pm.onAnnualPreventivePage.selectOrganizationInAnnualWOModal('QA');
    await pm.onAnnualPreventivePage.selectMaintainerInAnnualWOModal('Žiga Maintainer');
    await pm.onAnnualPreventivePage.fillDescriptionInAnnualWOModal('QA Test');
    await pm.onAnnualPreventivePage.submitAnnualWorkOrderCreation();
    const toast = await pm.onAnnualPreventivePage.getToastMessage();
    expect(toast).toContain('Failed to create annual preventive work order');
  });
});
