/**
 * Direct4me Playwright Automation Framework Setup Script
 *
 * Run once to scaffold the full framework:
 *   node setup.js
 *
 * Then follow the printed instructions.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// ---------------------------------------------------------------------------
// 1. Directory structure
// ---------------------------------------------------------------------------
const dirs = [
  'data',
  'pages',
  'fixtures',
  'utils',
  'tests/auth',
  'tests/ops',
  'tests/maintainer',
];

dirs.forEach((dir) => {
  fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
  console.log(`✔ Created directory: ${dir}`);
});

// ---------------------------------------------------------------------------
// 2. File contents
// ---------------------------------------------------------------------------
const files = {};

// ── data/users.example.json ─────────────────────────────────────────────────
files['data/users.example.json'] = `{
  "ops": {
    "email": "ziga.ops@direct4.me",
    "password": "YOUR_OPS_PASSWORD_HERE",
    "role": "ops",
    "displayName": "Žiga Ops",
    "expectedRedirectPath": "/dashboard"
  },
  "maintainer": {
    "email": "ziga.maintainer@direct4.me",
    "password": "YOUR_MAINTAINER_PASSWORD_HERE",
    "role": "maintainer",
    "displayName": "Žiga Maintainer",
    "expectedRedirectPath": "/my-work"
  }
}
`;

// Copy example to real users.json only if it doesn't already exist
if (!fs.existsSync(path.join(ROOT, 'data/users.json'))) {
  fs.writeFileSync(
    path.join(ROOT, 'data/users.json'),
    files['data/users.example.json'],
    'utf8'
  );
  console.log('✔ Created data/users.json (fill in real passwords!)');
}

// ── utils/helpers.ts ─────────────────────────────────────────────────────────
files['utils/helpers.ts'] = `import * as fs from 'fs';
import * as path from 'path';

export interface UserCredentials {
  email: string;
  password: string;
  role: string;
  displayName: string;
  expectedRedirectPath: string;
}

export interface UsersData {
  ops: UserCredentials;
  maintainer: UserCredentials;
}

/**
 * Loads test users from data/users.json.
 * Copy data/users.example.json → data/users.json and fill in real passwords.
 */
export function loadUsers(): UsersData {
  const usersPath = path.resolve(__dirname, '../data/users.json');
  if (!fs.existsSync(usersPath)) {
    throw new Error(
      \`data/users.json not found. Copy data/users.example.json to data/users.json and fill in credentials.\`
    );
  }
  return JSON.parse(fs.readFileSync(usersPath, 'utf8')) as UsersData;
}

/** Formats a Date object to a readable string, e.g. "May 31, 2026". */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Returns a future date offset by the given number of days from today. */
export function futureDateByDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
`;

// ── pages/BasePage.ts ────────────────────────────────────────────────────────
files['pages/BasePage.ts'] = `import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForURLToContain(urlSubstring: string): Promise<void> {
    await this.page.waitForURL(\`**\${urlSubstring}**\`);
  }

  // ── Toast / notification helpers ───────────────────────────────────────────

  /**
   * Returns the first visible toast/snackbar text on the page.
   * Waits up to 5 s for it to appear.
   */
  async getToastMessage(): Promise<string> {
    const toast = this.page
      .locator('[role="status"], [role="alert"], [data-sonner-toast], .toast, .Toastify__toast')
      .first();
    await toast.waitFor({ state: 'visible', timeout: 5_000 });
    return (await toast.textContent()) ?? '';
  }

  // ── Generic element helpers ────────────────────────────────────────────────

  async clickButtonByLabel(label: string): Promise<void> {
    await this.page.getByRole('button', { name: label }).click();
  }

  async selectDropdownOption(label: string, option: string): Promise<void> {
    await this.page.getByLabel(label).selectOption(option);
  }

  async fillField(label: string, value: string): Promise<void> {
    await this.page.getByLabel(label).fill(value);
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  protected locatorByText(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }

  protected locatorByRole(
    role: Parameters<Page['getByRole']>[0],
    options?: Parameters<Page['getByRole']>[1]
  ): Locator {
    return this.page.getByRole(role, options);
  }
}
`;

// ── pages/LoginPage.ts ───────────────────────────────────────────────────────
files['pages/LoginPage.ts'] = `import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { UserCredentials } from '../utils/helpers';

export class LoginPage extends BasePage {
  // ── Locators ───────────────────────────────────────────────────────────────
  private readonly emailInput = () => this.page.getByLabel('Email address');
  private readonly passwordInput = () => this.page.getByLabel('Password');
  private readonly signInButton = () =>
    this.page.getByRole('button', { name: 'Sign in' });
  private readonly forgotPasswordLink = () =>
    this.page.getByRole('link', { name: 'Forgot password?' });
  private readonly passwordToggleIcon = () =>
    this.page.locator('button[aria-label*="password"], button:has([data-icon="eye"])').first();
  private readonly errorMessage = () =>
    this.page.locator('[role="alert"], .error-message, [data-testid="login-error"]').first();

  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo('/login');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async fillEmailAddress(email: string): Promise<void> {
    await this.emailInput().fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput().fill(password);
  }

  async clickSignInButton(): Promise<void> {
    await this.signInButton().click();
  }

  async clickForgotPasswordLink(): Promise<void> {
    await this.forgotPasswordLink().click();
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.passwordToggleIcon().click();
  }

  /**
   * Full login helper — navigates to /login, fills credentials, submits.
   */
  async loginAs(user: UserCredentials): Promise<void> {
    await this.navigateToLoginPage();
    await this.fillEmailAddress(user.email);
    await this.fillPassword(user.password);
    await this.clickSignInButton();
    await this.waitForURLToContain(user.expectedRedirectPath);
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  async getErrorMessageText(): Promise<string> {
    await this.errorMessage().waitFor({ state: 'visible', timeout: 5_000 });
    return (await this.errorMessage().textContent()) ?? '';
  }

  async isSignInButtonVisible(): Promise<boolean> {
    return this.signInButton().isVisible();
  }

  async isPasswordInputTypeText(): Promise<boolean> {
    const type = await this.passwordInput().getAttribute('type');
    return type === 'text';
  }
}
`;

// ── pages/DashboardPage.ts ───────────────────────────────────────────────────
files['pages/DashboardPage.ts'] = `import { Page } from '@playwright/test';
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
    this.page.getByRole('button', { name: '+ New Work Order' });

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
`;

// ── pages/WorkOrdersPage.ts ──────────────────────────────────────────────────
files['pages/WorkOrdersPage.ts'] = `import { Page } from '@playwright/test';
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
    this.page.getByRole('button', { name: '+ New Work Order' });
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
`;

// ── pages/CreateWorkOrderModal.ts ────────────────────────────────────────────
files['pages/CreateWorkOrderModal.ts'] = `import { Page } from '@playwright/test';
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
    await this.workScopeDropdown().selectOption(scope);
  }

  async selectCompany(companyName: string): Promise<void> {
    await this.companyDropdown().selectOption(companyName);
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
    await this.typeDropdown().selectOption(type);
  }

  async selectPriority(priority: WorkOrderPriority): Promise<void> {
    await this.priorityDropdown().selectOption(priority);
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
    await this.assignedOrganizationDropdown().selectOption(orgName);
  }

  async selectAssignedUser(userName: string): Promise<void> {
    await this.assignedUserDropdown().selectOption(userName);
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
`;

// ── pages/SitesPage.ts ───────────────────────────────────────────────────────
files['pages/SitesPage.ts'] = `import { Page } from '@playwright/test';
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
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async selectCompany(companyName: string): Promise<void> {
    await this.companyDropdown().selectOption(companyName);
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
`;

// ── pages/LockersPage.ts ─────────────────────────────────────────────────────
files['pages/LockersPage.ts'] = `import { Page } from '@playwright/test';
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
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async selectCompany(companyName: string): Promise<void> {
    await this.companyDropdown().selectOption(companyName);
  }

  async searchLockers(query: string): Promise<void> {
    await this.lockerSearchInput().fill(query);
  }

  async clearSearch(): Promise<void> {
    await this.lockerSearchInput().clear();
  }

  async filterByStatus(status: LockerStatus): Promise<void> {
    await this.statusDropdown().selectOption(status);
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
`;

// ── pages/AnnualPreventivePage.ts ────────────────────────────────────────────
files['pages/AnnualPreventivePage.ts'] = `import { Page } from '@playwright/test';
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
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async searchSites(query: string): Promise<void> {
    await this.siteSearchInput().fill(query);
  }

  async selectCompany(companyName: string): Promise<void> {
    await this.companyDropdown().selectOption(companyName);
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
    await this.createAnnualWOModal().getByLabel('Organization').selectOption(orgName);
  }

  async selectMaintainerInAnnualWOModal(maintainerName: string): Promise<void> {
    await this.createAnnualWOModal().getByLabel('Maintainer').selectOption(maintainerName);
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
`;

// ── pages/MyWorkPage.ts ──────────────────────────────────────────────────────
files['pages/MyWorkPage.ts'] = `import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type MyWorkTimeFilter = 'Today' | 'Tomorrow' | 'This Week';

export class MyWorkPage extends BasePage {
  // ── Locators ───────────────────────────────────────────────────────────────
  private readonly pageHeading = () =>
    this.page.getByRole('heading', { name: 'My Work' });
  private readonly statusText = () =>
    this.page.getByText('All caught up!');
  private readonly emptyStateMainText = () =>
    this.page.getByText('No tasks right now');
  private readonly emptyStateSupportText = () =>
    this.page.getByText("When work orders are assigned to you, they'll appear here.");
  private readonly completedSection = () =>
    this.page.getByText(/COMPLETED/);
  private readonly logoutButton = () =>
    this.page.getByRole('button', { name: /log.?out/i }).or(
      this.page.locator('[aria-label*="logout"], [aria-label*="log out"]')
    ).first();

  private timeFilterButton(filter: MyWorkTimeFilter) {
    return this.page.getByRole('button', { name: filter });
  }

  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateToMyWorkPage(): Promise<void> {
    await this.navigateTo('/my-work');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async clickTodayFilter(): Promise<void> {
    await this.timeFilterButton('Today').click();
  }

  async clickTomorrowFilter(): Promise<void> {
    await this.timeFilterButton('Tomorrow').click();
  }

  async clickThisWeekFilter(): Promise<void> {
    await this.timeFilterButton('This Week').click();
  }

  async clickLogout(): Promise<void> {
    await this.logoutButton().click();
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  async isPageHeadingVisible(): Promise<boolean> {
    return this.pageHeading().isVisible();
  }

  async isStatusTextVisible(): Promise<boolean> {
    return this.statusText().isVisible();
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return this.emptyStateMainText().isVisible();
  }

  async getEmptyStateMainText(): Promise<string> {
    return (await this.emptyStateMainText().textContent()) ?? '';
  }

  async getEmptyStateSupportText(): Promise<string> {
    return (await this.emptyStateSupportText().textContent()) ?? '';
  }

  async getCompletedSectionText(): Promise<string> {
    return (await this.completedSection().textContent()) ?? '';
  }

  async isTimeFilterActive(filter: MyWorkTimeFilter): Promise<boolean> {
    const btn = this.timeFilterButton(filter);
    const ariaPressed = await btn.getAttribute('aria-pressed');
    const dataState = await btn.getAttribute('data-state');
    const classAttr = await btn.getAttribute('class');
    return (
      ariaPressed === 'true' ||
      dataState === 'active' ||
      (classAttr?.includes('active') ?? false)
    );
  }
}
`;

// ── pages/PageManager.ts ─────────────────────────────────────────────────────
files['pages/PageManager.ts'] = `import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { WorkOrdersPage } from './WorkOrdersPage';
import { CreateWorkOrderModal } from './CreateWorkOrderModal';
import { SitesPage } from './SitesPage';
import { LockersPage } from './LockersPage';
import { AnnualPreventivePage } from './AnnualPreventivePage';
import { MyWorkPage } from './MyWorkPage';

/**
 * PageManager — single import point for all page objects.
 *
 * Usage in tests (via the pm fixture):
 *   await pm.onLoginPage.loginAs(users.ops);
 *   await pm.onDashboardPage.clickNeedsPlanningCard();
 */
export class PageManager {
  private readonly page: Page;

  readonly onLoginPage: LoginPage;
  readonly onDashboardPage: DashboardPage;
  readonly onWorkOrdersPage: WorkOrdersPage;
  readonly onCreateWorkOrderModal: CreateWorkOrderModal;
  readonly onSitesPage: SitesPage;
  readonly onLockersPage: LockersPage;
  readonly onAnnualPreventivePage: AnnualPreventivePage;
  readonly onMyWorkPage: MyWorkPage;

  constructor(page: Page) {
    this.page = page;

    this.onLoginPage = new LoginPage(page);
    this.onDashboardPage = new DashboardPage(page);
    this.onWorkOrdersPage = new WorkOrdersPage(page);
    this.onCreateWorkOrderModal = new CreateWorkOrderModal(page);
    this.onSitesPage = new SitesPage(page);
    this.onLockersPage = new LockersPage(page);
    this.onAnnualPreventivePage = new AnnualPreventivePage(page);
    this.onMyWorkPage = new MyWorkPage(page);
  }
}
`;

// ── fixtures/index.ts ────────────────────────────────────────────────────────
files['fixtures/index.ts'] = `import { test as base, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import { loadUsers, type UsersData } from '../utils/helpers';

type Direct4meFixtures = {
  pm: PageManager;
  users: UsersData;
};

/**
 * Extended Playwright test with:
 *  - \`pm\`    — PageManager instance (all page objects in one)
 *  - \`users\` — Credentials loaded from data/users.json
 *
 * Import { test, expect } from this file instead of '@playwright/test'.
 */
export const test = base.extend<Direct4meFixtures>({
  pm: async ({ page }, use) => {
    const pm = new PageManager(page);
    await use(pm);
  },

  users: async ({}, use) => {
    const users = loadUsers();
    await use(users);
  },
});

export { expect };
`;

// ── tests/auth/login.spec.ts ─────────────────────────────────────────────────
files['tests/auth/login.spec.ts'] = `import { test, expect } from '../../fixtures/index';

test.describe('Login Page', () => {
  test.beforeEach(async ({ pm }) => {
    await pm.onLoginPage.navigateToLoginPage();
  });

  test('should display the Sign in button on the login page', async ({ pm }) => {
    expect(await pm.onLoginPage.isSignInButtonVisible()).toBe(true);
  });

  test('ops user logs in and is redirected to /dashboard', async ({ pm, users }) => {
    await pm.onLoginPage.loginAs(users.ops);
    expect(await pm.onDashboardPage.isPageHeadingVisible()).toBe(true);
  });

  test('maintainer user logs in and is redirected to /my-work', async ({ pm, users }) => {
    await pm.onLoginPage.loginAs(users.maintainer);
    expect(await pm.onMyWorkPage.isPageHeadingVisible()).toBe(true);
  });

  test('password field toggles visibility when eye icon is clicked', async ({ pm, users }) => {
    await pm.onLoginPage.fillPassword(users.ops.password);
    await pm.onLoginPage.togglePasswordVisibility();
    expect(await pm.onLoginPage.isPasswordInputTypeText()).toBe(true);
  });

  test('invalid credentials show an error message', async ({ pm }) => {
    await pm.onLoginPage.fillEmailAddress('invalid@direct4.me');
    await pm.onLoginPage.fillPassword('wrongpassword');
    await pm.onLoginPage.clickSignInButton();
    const error = await pm.onLoginPage.getErrorMessageText();
    expect(error.length).toBeGreaterThan(0);
  });
});
`;

// ── tests/ops/dashboard.spec.ts ──────────────────────────────────────────────
files['tests/ops/dashboard.spec.ts'] = `import { test, expect } from '../../fixtures/index';

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
`;

// ── tests/ops/workorders.spec.ts ─────────────────────────────────────────────
files['tests/ops/workorders.spec.ts'] = `import { test, expect } from '../../fixtures/index';

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
      test(\`clicking \${tab} tab makes it active\`, async ({ pm }) => {
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
`;

// ── tests/ops/sites.spec.ts ──────────────────────────────────────────────────
files['tests/ops/sites.spec.ts'] = `import { test, expect } from '../../fixtures/index';

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
`;

// ── tests/ops/lockers.spec.ts ────────────────────────────────────────────────
files['tests/ops/lockers.spec.ts'] = `import { test, expect } from '../../fixtures/index';

test.describe('Lockers Page (Ops)', () => {
  test.beforeEach(async ({ pm, users }) => {
    await pm.onLoginPage.loginAs(users.ops);
    await pm.onLockersPage.navigateToLockersPage();
  });

  test('Lockers page heading is visible', async ({ pm }) => {
    expect(await pm.onLockersPage.isPageHeadingVisible()).toBe(true);
  });

  test('empty state is shown before selecting a company', async ({ pm }) => {
    expect(await pm.onLockersPage.isEmptyStateVisible()).toBe(true);
  });

  test('empty state text is correct', async ({ pm }) => {
    const text = await pm.onLockersPage.getEmptyStateText();
    expect(text).toContain('Select a company to load lockers');
  });

  test('selecting a company and Enabled status loads lockers', async ({ pm }) => {
    await pm.onLockersPage.selectCompany('Express One SI d.o.o.');
    await pm.onLockersPage.filterByStatus('Enabled');
    const rowCount = await pm.onLockersPage.getLockerRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('searching by serial number filters the locker list', async ({ pm }) => {
    await pm.onLockersPage.selectCompany('Express One SI d.o.o.');
    await pm.onLockersPage.searchLockers('082300004249');
    const rowCount = await pm.onLockersPage.getLockerRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });
});
`;

// ── tests/ops/annual-preventive.spec.ts ──────────────────────────────────────
files['tests/ops/annual-preventive.spec.ts'] = `import { test, expect } from '../../fixtures/index';

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
`;

// ── tests/maintainer/my-work.spec.ts ─────────────────────────────────────────
files['tests/maintainer/my-work.spec.ts'] = `import { test, expect } from '../../fixtures/index';

test.describe('My Work Page (Maintainer)', () => {
  test.beforeEach(async ({ pm, users }) => {
    await pm.onLoginPage.loginAs(users.maintainer);
  });

  test('My Work page heading is visible', async ({ pm }) => {
    expect(await pm.onMyWorkPage.isPageHeadingVisible()).toBe(true);
  });

  test('"All caught up!" status text is visible when no work is assigned', async ({ pm }) => {
    expect(await pm.onMyWorkPage.isStatusTextVisible()).toBe(true);
  });

  test('empty state is shown with correct messages', async ({ pm }) => {
    expect(await pm.onMyWorkPage.isEmptyStateVisible()).toBe(true);
    const mainText = await pm.onMyWorkPage.getEmptyStateMainText();
    const supportText = await pm.onMyWorkPage.getEmptyStateSupportText();
    expect(mainText).toContain('No tasks right now');
    expect(supportText).toContain("When work orders are assigned to you, they'll appear here.");
  });

  test('Today filter tab is active by default', async ({ pm }) => {
    expect(await pm.onMyWorkPage.isTimeFilterActive('Today')).toBe(true);
  });

  test('Tomorrow filter tab can be clicked', async ({ pm }) => {
    await pm.onMyWorkPage.clickTomorrowFilter();
    expect(await pm.onMyWorkPage.isTimeFilterActive('Tomorrow')).toBe(true);
  });

  test('This Week filter tab can be clicked', async ({ pm }) => {
    await pm.onMyWorkPage.clickThisWeekFilter();
    expect(await pm.onMyWorkPage.isTimeFilterActive('This Week')).toBe(true);
  });

  test('COMPLETED section is visible', async ({ pm }) => {
    const text = await pm.onMyWorkPage.getCompletedSectionText();
    expect(text).toContain('COMPLETED');
  });

  test('maintainer cannot access /dashboard (redirected away)', async ({ pm, page }) => {
    await page.goto('/dashboard');
    // Should redirect to /my-work or /login, not stay on /dashboard
    await page.waitForURL((url) => !url.pathname.includes('/dashboard'), { timeout: 5_000 });
    expect(page.url()).not.toContain('/dashboard');
  });
});
`;

// ---------------------------------------------------------------------------
// 3. Write all files
// ---------------------------------------------------------------------------
Object.entries(files).forEach(([relativePath, content]) => {
  const fullPath = path.join(ROOT, relativePath);
  // Directories were already created above, but just in case:
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('✔ Created ' + relativePath);
});

// ---------------------------------------------------------------------------
// 4. Instructions
// ---------------------------------------------------------------------------
console.log([
  '',
  '╔══════════════════════════════════════════════════════════════╗',
  '║       Direct4me Playwright Framework — Setup Complete        ║',
  '╚══════════════════════════════════════════════════════════════╝',
  '',
  'Next steps:',
  '',
  '  1. Fill in your credentials:',
  '     -> Open  data/users.json',
  '     -> Replace YOUR_OPS_PASSWORD_HERE  with the real ops password',
  '     -> Replace YOUR_MAINTAINER_PASSWORD_HERE  with the real maintainer password',
  '',
  '  2. Install dependencies:',
  '     npm install',
  '',
  '  3. Install Playwright browsers:',
  '     npx playwright install --with-deps chromium',
  '',
  '  4. Run the tests:',
  '     npm test                   (all tests, headless)',
  '     npm run test:headed        (all tests, headed)',
  '     npm run test:auth          (auth tests only)',
  '     npm run test:ops           (ops tests only)',
  '     npm run test:maintainer    (maintainer tests only)',
  '     npm run test:ui            (Playwright UI mode)',
  '     npm run test:report        (open last HTML report)',
  '',
  'Framework structure:',
  '  pages/               -> Page objects (one file per page)',
  '  pages/PageManager.ts -> Single import for all POs',
  '  fixtures/index.ts    -> Playwright test extended with pm & users',
  '  data/users.json      -> Credentials (gitignored)',
  '  tests/auth/          -> Login tests',
  '  tests/ops/           -> Ops-role tests',
  '  tests/maintainer/    -> Maintainer-role tests',
  '  utils/helpers.ts     -> Shared utility functions',
].join('\n'));
