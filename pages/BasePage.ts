import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async waitForURLToContain(urlSubstring: string): Promise<void> {
    await this.page.waitForURL(`**${urlSubstring}**`);
  }

  // ── Toast / notification helpers ───────────────────────────────────────────

  /**
   * Returns the first visible toast/snackbar text on the page.
   * Waits up to 5 s for it to appear.
   */
  async getToastMessage(): Promise<string> {
    const toast = this.page
      .locator(
        '[role="status"], [role="alert"], [data-sonner-toast], ' +
        '.toast, .Toastify__toast, ' +
        'div[class*="toast" i], div[class*="notification" i], div[class*="snack" i]'
      )
      .first();
    await toast.waitFor({ state: 'visible', timeout: 5_000 });
    return (await toast.textContent()) ?? '';
  }

  // ── Radix UI / custom combobox helper ──────────────────────────────────────

  /**
   * Selects an option from a Radix UI (or any custom) combobox.
   * Clicks the trigger to open the listbox, then clicks the matching option.
   */
  protected async selectComboboxOption(
    triggerLocator: Locator,
    optionText: string
  ): Promise<void> {
    await triggerLocator.click();
    await this.page
      .getByRole('option', { name: optionText })
      .click();
  }

  // ── Generic element helpers ────────────────────────────────────────────────

  async clickButtonByLabel(label: string): Promise<void> {
    await this.page.getByRole('button', { name: label }).click();
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
