import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type WorkScope = 'Locker Work' | 'Internal Task' | 'Razvoj';
export type WorkOrderType =
  | 'Preventive Maintenance'
  | 'Incident / Repair'
  | 'Installation'
  | 'Decommission'
  | 'Other'
  | 'Vehicle Service'
  | 'Procurement / Store Run'
  | 'Pickup / Dropoff'
  | 'Other Internal Task';
export type WorkOrderPriority = 'Low' | 'Medium' | 'High';

export class CreateWorkOrderModal extends BasePage {
  // ── Locators ───────────────────────────────────────────────────────────────
  private readonly modalTitle = () =>
    this.page.getByRole('heading', { name: 'Create Work Order' });
  private readonly closeButton = () =>
    this.page.getByRole('button', { name: 'Close' }).or(
      this.page.locator('[aria-label="Close"], button:has-text("×"), [data-testid="modal-close"]')
    ).first();
  private readonly nextButton = () =>
    this.page.getByRole('button', { name: 'Next' });
  private readonly backButton = () =>
    this.page.getByRole('button', { name: 'Back' });
  private readonly createWorkOrderButton = () =>
    this.page.getByRole('button', { name: 'Create Work Order' });

  // Step 1 – Location (Locker Work)
  private readonly workScopeDropdown = () =>
    this.page.getByLabel('Work Scope');
  private readonly companyDropdown = () =>
    this.page.getByLabel('Company').or(this.page.getByRole('combobox').filter({ hasText: 'Select company' })).first();
  private readonly siteSearchInput = () =>
    this.page.getByPlaceholder('Search by name, address, or city...');

  // Step 1 – Location (Internal Task)
  private readonly taskInput = () => this.page.getByLabel('Task');
  private readonly addressInput = () => this.page.getByLabel('Address');

  // Step 2 – Lockers
  private readonly lockerCheckbox = (lockerName: string) =>
    this.page.getByLabel(lockerName);

  // Step 3 – Details (Locker Work) / Step 2 – Details (Internal Task)
  private readonly typeDropdown = () => this.page.getByLabel('Type');
  private readonly priorityDropdown = () => this.page.getByLabel('Priority');
  private readonly plannedDateInput = () =>
    this.page.getByLabel('Planned Date').or(this.page.getByPlaceholder('Pick a date')).first();
  private readonly descriptionTextarea = () =>
    this.page.getByLabel('Description (optional)');
  private readonly addPhotoButton = () =>
    this.page.getByRole('button', { name: 'Add Photo' });

  // Step 4 – Assignment (Locker Work) / Step 3 – Assignment (Internal Task)
  private readonly assignedOrganizationDropdown = () =>
    this.page.getByLabel('Assigned Organization');
  private readonly assignedUserDropdown = () =>
    this.page.getByLabel('Assigned User (optional)');

  constructor(page: Page) {
    super(page);
  }

  // ── State ──────────────────────────────────────────────────────────────────

  async isModalOpen(): Promise<boolean> {
    return this.modalTitle().isVisible();
  }

  async closeModal(): Promise<void> {
    await this.closeButton().click();
  }

  // ── Navigation within modal ────────────────────────────────────────────────

  async clickNext(): Promise<void> {
    await this.nextButton().click();
  }

  async clickBack(): Promise<void> {
    await this.backButton().click();
  }

  async clickCreateWorkOrder(): Promise<void> {
    await this.createWorkOrderButton().click();
  }

  // ── Step 1: Work scope & location (Locker Work / Razvoj) ──────────────────

  async selectWorkScope(scope: WorkScope): Promise<void> {
    await this.selectComboboxOption(this.workScopeDropdown(), scope);
  }

  async selectCompany(companyName: string): Promise<void> {
    await this.selectComboboxOption(this.companyDropdown(), companyName);
  }

  async searchAndSelectSite(siteName: string): Promise<void> {
    await this.siteSearchInput().fill(siteName);
    await this.page.getByText(siteName).first().click();
  }

  // ── Step 1: Location (Internal Task) ─────────────────────────────────────

  async fillTaskName(taskName: string): Promise<void> {
    await this.taskInput().fill(taskName);
  }

  async fillAddress(address: string): Promise<void> {
    await this.addressInput().fill(address);
  }

  // ── Step 2: Locker selection ───────────────────────────────────────────────

  async selectLocker(lockerSerialOrLabel: string): Promise<void> {
    await this.lockerCheckbox(lockerSerialOrLabel).check();
  }

  async deselectLocker(lockerSerialOrLabel: string): Promise<void> {
    await this.lockerCheckbox(lockerSerialOrLabel).uncheck();
  }

  // ── Step Details ───────────────────────────────────────────────────────────

  async selectWorkOrderType(type: WorkOrderType): Promise<void> {
    await this.selectComboboxOption(this.typeDropdown(), type);
  }

  async selectPriority(priority: WorkOrderPriority): Promise<void> {
    await this.selectComboboxOption(this.priorityDropdown(), priority);
  }

  async selectPlannedDate(dateLabel: string): Promise<void> {
    await this.plannedDateInput().click();
    await this.page.getByRole('gridcell', { name: dateLabel }).click();
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionTextarea().fill(description);
  }

  // ── Step Assignment ────────────────────────────────────────────────────────

  async selectAssignedOrganization(orgName: string): Promise<void> {
    await this.selectComboboxOption(this.assignedOrganizationDropdown(), orgName);
  }

  async selectAssignedUser(userName: string): Promise<void> {
    await this.selectComboboxOption(this.assignedUserDropdown(), userName);
  }

  // ── Summary helpers ────────────────────────────────────────────────────────

  async getSummaryText(): Promise<string> {
    const summaryBox = this.page.locator(
      '[class*="summary"], [data-testid="summary"]'
    );
    return (await summaryBox.textContent()) ?? '';
  }

  async getStepIndicatorText(): Promise<string> {
    const stepIndicator = this.page.locator(
      '[class*="step"], [data-testid="step-indicator"]'
    ).first();
    return (await stepIndicator.textContent()) ?? '';
  }

  async isBackButtonDisabled(): Promise<boolean> {
    return this.backButton().isDisabled();
  }

  async isCreateWorkOrderButtonVisible(): Promise<boolean> {
    return this.createWorkOrderButton().isVisible();
  }
}
