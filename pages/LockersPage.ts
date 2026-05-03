import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type LockerStatus = 'All Status' | 'Enabled' | 'Disabled' | 'Decommissioned';

export class LockersPage extends BasePage {
  // ── Locators ───────────────────────────────────────────────────────────────
  private readonly pageHeading = () =>
    this.page.getByRole('heading', { name: 'Lockers' });
  private readonly companyDropdown = () =>
    this.page.getByRole('combobox').filter({ hasText: 'Select company' }).first();
  private readonly lockerSearchInput = () =>
    this.page.getByPlaceholder('Search by serial, terminal, or site...');
  private readonly statusDropdown = () =>
    this.page.getByRole('combobox').filter({ hasText: /Enabled|All Status|Disabled|Decommissioned/ });
  private readonly emptyStateText = () =>
    this.page.getByText('Select a company to load lockers');

  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateToLockersPage(): Promise<void> {
    await this.navigateTo('/lockers');
    // Wait for the company combobox — confirms the React app has fully rendered
    await this.companyDropdown().waitFor({ state: 'visible' });
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async selectCompany(companyName: string): Promise<void> {
    await this.selectComboboxOption(this.companyDropdown(), companyName);
  }

  async searchLockers(query: string): Promise<void> {
    await this.lockerSearchInput().fill(query);
  }

  async clearSearch(): Promise<void> {
    await this.lockerSearchInput().clear();
  }

  async filterByStatus(status: LockerStatus): Promise<void> {
    await this.selectComboboxOption(this.statusDropdown(), status);
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

  async getLockerRowCount(): Promise<number> {
    const rows = this.page.getByRole('row').filter({ hasNot: this.page.getByRole('columnheader') });
    return rows.count();
  }
}
