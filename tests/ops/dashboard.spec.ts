import { test, expect } from '../../fixtures/index';

test.describe('Dashboard Page (Ops)', () => {
  test.beforeEach(async ({ pm, users }) => {
    await pm.onLoginPage.loginAs(users.ops);
  });

  test('dashboard heading and subtitle are visible', async ({ pm }) => {
    expect(await pm.onDashboardPage.isPageHeadingVisible()).toBe(true);
  });

  test('+ New Work Order button is visible', async ({ pm }) => {
    expect(await pm.onDashboardPage.isNewWorkOrderButtonVisible()).toBe(true);
  });

  test('Attention Queue panel is visible', async ({ pm }) => {
    expect(await pm.onDashboardPage.isAttentionQueuePanelVisible()).toBe(true);
  });

  test("Today's Pulse panel is visible", async ({ pm }) => {
    expect(await pm.onDashboardPage.isTodaysPulsePanelVisible()).toBe(true);
  });

  test('clicking Needs Planning card navigates to Work Orders Triage tab', async ({ pm, page }) => {
    await pm.onDashboardPage.clickNeedsPlanningCard();
    await expect(page).toHaveURL(/work-orders/);
  });

  test('clicking Overdue Open card navigates to Work Orders Triage tab', async ({ pm, page }) => {
    await pm.onDashboardPage.clickOverdueOpenCard();
    await expect(page).toHaveURL(/work-orders/);
  });

  test('clicking Blocked (Paused) card navigates to Work Orders Paused tab', async ({ pm, page }) => {
    await pm.onDashboardPage.clickBlockedPausedCard();
    await expect(page).toHaveURL(/work-orders/);
  });

  test('clicking Needs Review card navigates to Work Orders Awaiting Review tab', async ({ pm, page }) => {
    await pm.onDashboardPage.clickNeedsReviewCard();
    await expect(page).toHaveURL(/work-orders/);
  });

  test('clicking Annual Preventive Due card navigates to Annual Preventive page', async ({ pm, page }) => {
    await pm.onDashboardPage.clickAnnualPreventiveDueCard();
    await expect(page).toHaveURL(/annual-preventive/);
  });

  test('+ New Work Order button opens Create Work Order modal', async ({ pm }) => {
    await pm.onDashboardPage.clickNewWorkOrderButton();
    expect(await pm.onCreateWorkOrderModal.isModalOpen()).toBe(true);
  });
});
