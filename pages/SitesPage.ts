import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type SitesTab = 'All' | 'With Lockers' | 'Without Lockers';

export class SitesPage extends BasePage {
  // ── Locators ───────────────────────────────────────────────────────────────
  private readonly pageHeading = () =>
    this.page.getByRole('heading', { name: 'Sites' });
  private readonly companyDropdown = () =>
    this.page.getByRole('combobox').filter({ hasText: 'Select company' }).first();
  private readonly siteSearchInput = () =>
    this.page.getByPlaceholder('Search sites...');
  private readonly emptyStateText = () =>
    this.page.getByText('Select a company to load sites');

  private tab(name: SitesTab) {
    return this.page.getByRole('tab', { name: new RegExp(name) });
  }

  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateToSitesPage(): Promise<void> {
    await this.navigateTo('/sites');
    await this.companyDropdown().waitFor({ state: 'visible' });
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async selectCompany(companyName: string): Promise<void> {
    await this.selectComboboxOption(this.companyDropdown(), companyName);
  }

  async searchSites(query: string): Promise<void> {
    await this.siteSearchInput().fill(query);
  }

  async clearSearch(): Promise<void> {
    await this.siteSearchInput().clear();
  }

  async clickTab(tab: SitesTab): Promise<void> {
    await this.tab(tab).click();
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  async isPageHeadingVisible(): Promise<boolean> {
    return this.pageHeading().isVisible();
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return this.emptyStateText().isVisible();
  }

  async getEmptyStateText(): Promise<string> {
    return (await this.emptyStateText().textContent()) ?? '';
  }

  async isTabVisible(tab: SitesTab): Promise<boolean> {
    return this.tab(tab).isVisible();
  }

  async getSiteRowCount(): Promise<number> {
    const rows = this.page.getByRole('row').filter({ hasNot: this.page.getByRole('columnheader') });
    return rows.count();
  }
}
