import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type DashboardCard =
  | 'Needs Planning'
  | 'Overdue Open'
  | 'Blocked (Paused)'
  | 'Needs Review'
  | 'Annual Preventive Due';

export class DashboardPage extends BasePage {
  // ── Locators ───────────────────────────────────────────────────────────────
  private readonly pageHeading = () =>
    this.page.getByRole('heading', { name: 'Dashboard' });
  private readonly pageSubtitle = () =>
    this.page.getByText('Operational command center');
  private readonly newWorkOrderButton = () =>
    this.page.getByRole('button', { name: /New Work Order/i });

  private readonly attentionQueuePanel = () =>
    this.page.getByText('Attention Queue');
  private readonly todaysPulsePanel = () =>
    this.page.getByText("Today's Pulse");

  private metricCard(cardTitle: DashboardCard) {
    return this.page.locator('[class*="card"], [data-testid*="card"]').filter({
      hasText: cardTitle,
    });
  }

  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateToDashboard(): Promise<void> {
    await this.navigateTo('/dashboard');
    await this.pageHeading().waitFor({ state: 'visible' });
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async clickNewWorkOrderButton(): Promise<void> {
    await this.newWorkOrderButton().click();
  }

  async clickNeedsPlanningCard(): Promise<void> {
    await this.metricCard('Needs Planning').click();
  }

  async clickOverdueOpenCard(): Promise<void> {
    await this.metricCard('Overdue Open').click();
  }

  async clickBlockedPausedCard(): Promise<void> {
    await this.metricCard('Blocked (Paused)').click();
  }

  async clickNeedsReviewCard(): Promise<void> {
    await this.metricCard('Needs Review').click();
  }

  async clickAnnualPreventiveDueCard(): Promise<void> {
    await this.metricCard('Annual Preventive Due').click();
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  async getDashboardCardCount(cardTitle: DashboardCard): Promise<string> {
    const card = this.metricCard(cardTitle);
    // The count is typically a prominent number inside the card
    const countEl = card.locator('[class*="count"], [class*="number"], h2, h3').first();
    return (await countEl.textContent()) ?? '0';
  }

  async isPageHeadingVisible(): Promise<boolean> {
    return this.pageHeading().isVisible();
  }

  async isNewWorkOrderButtonVisible(): Promise<boolean> {
    return this.newWorkOrderButton().isVisible();
  }

  async isAttentionQueuePanelVisible(): Promise<boolean> {
    return this.attentionQueuePanel().isVisible();
  }

  async isTodaysPulsePanelVisible(): Promise<boolean> {
    return this.todaysPulsePanel().isVisible();
  }

  async getAttentionQueueEmptyStateText(): Promise<string> {
    const emptyState = this.page.getByText('All clear — nothing needs attention.');
    return (await emptyState.textContent()) ?? '';
  }
}
