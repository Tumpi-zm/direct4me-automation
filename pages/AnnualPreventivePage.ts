import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type AnnualStatusTab =
  | 'All'
  | 'Needs setup'
  | 'Overdue'
  | 'Due soon'
  | 'Scheduled'
  | 'Up to date';

export class AnnualPreventivePage extends BasePage {
  // ── Locators ───────────────────────────────────────────────────────────────
  private readonly pageHeading = () =>
    this.page.getByRole('heading', { name: 'Annual Preventive' });
  private readonly siteSearchInput = () =>
    this.page.getByPlaceholder('Search company, site, code, or address...');
  private readonly companyDropdown = () =>
    this.page.getByRole('combobox').filter({ hasText: /All companies|Express One/ });
  private readonly rowCountDropdown = () =>
    this.page.getByRole('combobox').filter({ hasText: /rows/ });

  // Update due date modal
  private readonly updateDueDateModal = () =>
    this.page.getByRole('dialog').filter({ hasText: 'Update due date' });
  private readonly dueDateInput = () =>
    this.updateDueDateModal().getByLabel('Due date');
  private readonly saveDueDateButton = () =>
    this.updateDueDateModal().getByRole('button', { name: 'Save' });
  private readonly cancelDueDateButton = () =>
    this.updateDueDateModal().getByRole('button', { name: 'Cancel' });

  // Create annual preventive WO modal
  private readonly createAnnualWOModal = () =>
    this.page.getByRole('dialog').filter({ hasText: 'Create Annual Preventive Work Order' });
  private readonly createAnnualWOButton = () =>
    this.createAnnualWOModal().getByRole('button', { name: 'Create Work Order' });
  private readonly cancelAnnualWOButton = () =>
    this.createAnnualWOModal().getByRole('button', { name: 'Cancel' });

  private tab(name: AnnualStatusTab) {
    return this.page.getByRole('tab', { name: new RegExp(name) });
  }

  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateToAnnualPreventivePage(): Promise<void> {
    await this.navigateTo('/annual-preventive');
    await this.siteSearchInput().waitFor({ state: 'visible' });
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async searchSites(query: string): Promise<void> {
    await this.siteSearchInput().fill(query);
  }

  async selectCompany(companyName: string): Promise<void> {
    await this.selectComboboxOption(this.companyDropdown(), companyName);
  }

  async clickStatusTab(tab: AnnualStatusTab): Promise<void> {
    await this.tab(tab).click();
  }

  async clickUpdateDueDateForSite(siteName: string): Promise<void> {
    const row = this.page.getByRole('row').filter({ hasText: siteName });
    await row.getByRole('button', { name: 'Update due date' }).click();
  }

  async setDueDate(dateValue: string): Promise<void> {
    await this.dueDateInput().fill(dateValue);
  }

  async saveDueDate(): Promise<void> {
    await this.saveDueDateButton().click();
  }

  async cancelDueDateUpdate(): Promise<void> {
    await this.cancelDueDateButton().click();
  }

  async clickCreateWorkOrderForSite(siteName: string): Promise<void> {
    const row = this.page.getByRole('row').filter({ hasText: siteName });
    await row.getByRole('button', { name: 'Create WO' }).click();
  }

  async selectOrganizationInAnnualWOModal(orgName: string): Promise<void> {
    const trigger = this.createAnnualWOModal()
      .getByRole('combobox')
      .filter({ hasText: /Select org|organization/i })
      .first();
    await this.selectComboboxOption(trigger, orgName);
  }

  async selectMaintainerInAnnualWOModal(maintainerName: string): Promise<void> {
    const trigger = this.createAnnualWOModal()
      .getByRole('combobox')
      .filter({ hasText: /Select user|maintainer/i })
      .first();
    await this.selectComboboxOption(trigger, maintainerName);
  }

  async fillDescriptionInAnnualWOModal(description: string): Promise<void> {
    await this.createAnnualWOModal().getByLabel('Description').fill(description);
  }

  async submitAnnualWorkOrderCreation(): Promise<void> {
    await this.createAnnualWOButton().click();
  }

  async cancelAnnualWorkOrderCreation(): Promise<void> {
    await this.cancelAnnualWOButton().click();
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  async isPageHeadingVisible(): Promise<boolean> {
    return this.pageHeading().isVisible();
  }

  async getStatusForSite(siteName: string): Promise<string> {
    const row = this.page.getByRole('row').filter({ hasText: siteName });
    const statusCell = row.locator('[class*="status"], [data-testid*="status"]').first();
    return (await statusCell.textContent()) ?? '';
  }

  async getNextDueForSite(siteName: string): Promise<string> {
    const row = this.page.getByRole('row').filter({ hasText: siteName });
    const dueDateCell = row.locator('[class*="due"], [data-testid*="due"]').first();
    return (await dueDateCell.textContent()) ?? '';
  }

  async isUpdateDueDateModalOpen(): Promise<boolean> {
    return this.updateDueDateModal().isVisible();
  }

  async isCreateAnnualWOModalOpen(): Promise<boolean> {
    return this.createAnnualWOModal().isVisible();
  }
}
