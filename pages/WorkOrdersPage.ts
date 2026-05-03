import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type WorkOrderTab =
  | 'All'
  | 'Triage'
  | 'Plan'
  | 'In Progress'
  | 'Paused'
  | 'Awaiting Review'
  | 'Completed';

export class WorkOrdersPage extends BasePage {
  // ── Locators ───────────────────────────────────────────────────────────────
  private readonly pageHeading = () =>
    this.page.getByRole('heading', { name: 'Work Orders' });
  private readonly newWorkOrderButton = () =>
    this.page.getByRole('button', { name: /New Work Order/i });
  private readonly exportButton = () =>
    this.page.getByRole('button', { name: 'Export' });
  private readonly searchInput = () =>
    this.page.getByPlaceholder('Search work orders');
  private readonly priorityDropdown = () =>
    this.page.getByRole('combobox').filter({ hasText: 'All Priorities' });
  private readonly dateDropdown = () =>
    this.page.getByRole('combobox').filter({ hasText: 'All dates' });
  private readonly listViewButton = () =>
    this.page.getByRole('button', { name: 'List' });
  private readonly mapViewButton = () =>
    this.page.getByRole('button', { name: 'Map' });
  private readonly emptyState = () =>
    this.page.getByText('No work orders found');

  private tab(name: WorkOrderTab) {
    return this.page.getByRole('tab', { name });
  }

  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateToWorkOrdersPage(): Promise<void> {
    await this.navigateTo('/work-orders');
    await this.pageHeading().waitFor({ state: 'visible' });
  }

  async navigateToWorkOrdersTab(tab: WorkOrderTab): Promise<void> {
    const tabMap: Record<WorkOrderTab, string> = {
      All: '/work-orders',
      Triage: '/work-orders?tab=triage',
      Plan: '/work-orders?tab=plan',
      'In Progress': '/work-orders?tab=in_progress',
      Paused: '/work-orders?tab=maintenance_paused',
      'Awaiting Review': '/work-orders?tab=maintenance_done',
      Completed: '/work-orders?tab=completed',
    };
    await this.navigateTo(tabMap[tab]);
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async clickTab(tab: WorkOrderTab): Promise<void> {
    await this.tab(tab).click();
  }

  async clickNewWorkOrderButton(): Promise<void> {
    await this.newWorkOrderButton().click();
  }

  async clickExportButton(): Promise<void> {
    await this.exportButton().click();
  }

  async searchWorkOrders(query: string): Promise<void> {
    await this.searchInput().fill(query);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput().clear();
  }

  async switchToListView(): Promise<void> {
    await this.listViewButton().click();
  }

  async switchToMapView(): Promise<void> {
    await this.mapViewButton().click();
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  async isPageHeadingVisible(): Promise<boolean> {
    return this.pageHeading().isVisible();
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return this.emptyState().isVisible();
  }

  async getEmptyStateText(): Promise<string> {
    return (await this.emptyState().textContent()) ?? '';
  }

  async isTabActive(tab: WorkOrderTab): Promise<boolean> {
    const ariaSelected = await this.tab(tab).getAttribute('aria-selected');
    const dataState = await this.tab(tab).getAttribute('data-state');
    return ariaSelected === 'true' || dataState === 'active';
  }

  async isNewWorkOrderButtonVisible(): Promise<boolean> {
    return this.newWorkOrderButton().isVisible();
  }

  async isExportButtonVisible(): Promise<boolean> {
    return this.exportButton().isVisible();
  }
}
