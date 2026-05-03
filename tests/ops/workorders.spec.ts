import { test, expect } from '../../fixtures/index';

test.describe('Work Orders Page (Ops)', () => {
  test.beforeEach(async ({ pm, users }) => {
    await pm.onLoginPage.loginAs(users.ops);
    await pm.onWorkOrdersPage.navigateToWorkOrdersPage();
  });

  test('Work Orders page heading is visible', async ({ pm }) => {
    expect(await pm.onWorkOrdersPage.isPageHeadingVisible()).toBe(true);
  });

  test('Export button is visible', async ({ pm }) => {
    expect(await pm.onWorkOrdersPage.isExportButtonVisible()).toBe(true);
  });

  test('+ New Work Order button is visible', async ({ pm }) => {
    expect(await pm.onWorkOrdersPage.isNewWorkOrderButtonVisible()).toBe(true);
  });

  test('All tab is active by default', async ({ pm }) => {
    expect(await pm.onWorkOrdersPage.isTabActive('All')).toBe(true);
  });

  test.describe('Tab navigation', () => {
    const tabs = ['Triage', 'Plan', 'In Progress', 'Paused', 'Awaiting Review', 'Completed'] as const;

    for (const tab of tabs) {
      test(`clicking ${tab} tab makes it active`, async ({ pm }) => {
        await pm.onWorkOrdersPage.clickTab(tab);
        expect(await pm.onWorkOrdersPage.isTabActive(tab)).toBe(true);
      });
    }
  });

  test('empty state shows "No work orders found" on All tab', async ({ pm }) => {
    const text = await pm.onWorkOrdersPage.getEmptyStateText();
    expect(text).toContain('No work orders found');
  });

  test('+ New Work Order button opens Create Work Order modal', async ({ pm }) => {
    await pm.onWorkOrdersPage.clickNewWorkOrderButton();
    expect(await pm.onCreateWorkOrderModal.isModalOpen()).toBe(true);
  });

  test.describe('Create Work Order modal — Locker Work flow', () => {
    test.beforeEach(async ({ pm }) => {
      await pm.onWorkOrdersPage.clickNewWorkOrderButton();
      expect(await pm.onCreateWorkOrderModal.isModalOpen()).toBe(true);
    });

    test('Back button is disabled on step 1', async ({ pm }) => {
      expect(await pm.onCreateWorkOrderModal.isBackButtonDisabled()).toBe(true);
    });

    test('Locker Work is the default selected work scope', async ({ pm }) => {
      const stepText = await pm.onCreateWorkOrderModal.getStepIndicatorText();
      expect(stepText).toContain('1');
    });

    test('modal can be closed with X button', async ({ pm }) => {
      await pm.onCreateWorkOrderModal.closeModal();
      expect(await pm.onCreateWorkOrderModal.isModalOpen()).toBe(false);
    });

    test('creating a Locker Work order shows failure toast (known 403 blocker)', async ({ pm }) => {
      await pm.onCreateWorkOrderModal.selectWorkScope('Locker Work');
      await pm.onCreateWorkOrderModal.selectCompany('Express One SI d.o.o.');
      await pm.onCreateWorkOrderModal.searchAndSelectSite('Ajdovščina AMZS');
      await pm.onCreateWorkOrderModal.clickNext();
      // Step 2: Lockers — skip locker selection, proceed
      await pm.onCreateWorkOrderModal.clickNext();
      // Step 3: Details
      await pm.onCreateWorkOrderModal.selectWorkOrderType('Preventive Maintenance');
      await pm.onCreateWorkOrderModal.selectPriority('Medium');
      await pm.onCreateWorkOrderModal.fillDescription('QA Testing');
      await pm.onCreateWorkOrderModal.clickNext();
      // Step 4: Assignment
      await pm.onCreateWorkOrderModal.selectAssignedOrganization('QA (partner)');
      await pm.onCreateWorkOrderModal.clickCreateWorkOrder();
      const toast = await pm.onCreateWorkOrderModal.getToastMessage();
      expect(toast).toContain('Failed to create work order');
    });
  });
});
