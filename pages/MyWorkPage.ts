import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type MyWorkTimeFilter = 'Today' | 'Tomorrow' | 'This Week';

export class MyWorkPage extends BasePage {
  // ── Locators ───────────────────────────────────────────────────────────────
  private readonly pageHeading = () =>
    this.page.getByRole('heading', { name: 'My Work' });
  private readonly allCaughtUpText = () =>
    this.page.getByText('All caught up!');
  private readonly completedSection = () =>
    this.page.getByText(/COMPLETED/i).first();

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
    await this.pageHeading().waitFor({ state: 'visible' });
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

  /** Returns true when the "All caught up!" subtitle is visible (no pending tasks). */
  async isAllCaughtUpVisible(): Promise<boolean> {
    return this.allCaughtUpText().isVisible();
  }

  /**
   * Checks whether the given time filter button is active.
   * The active button has white text on the app's teal primary background;
   * inactive buttons have dark text on a gray background.
   */
  async isTimeFilterActive(filter: MyWorkTimeFilter): Promise<boolean> {
    const btn = this.timeFilterButton(filter);
    const textColor = await btn.evaluate(
      (el) => window.getComputedStyle(el).color
    );
    // Active button renders white text: rgb(255, 255, 255)
    return textColor === 'rgb(255, 255, 255)';
  }

  /**
   * Returns true when a COMPLETED section label is present on the page.
   * This section only appears once completed work orders exist for the user.
   */
  async isCompletedSectionVisible(): Promise<boolean> {
    return this.completedSection().isVisible({ timeout: 3_000 }).catch(() => false);
  }
}
