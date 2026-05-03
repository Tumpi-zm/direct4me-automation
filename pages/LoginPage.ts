import { Page } from '@playwright/test';
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
    this.page.locator('div:has(input[type="password"]) button').first();
  private readonly errorMessage = () =>
    this.page.getByText(/Login failed|Invalid.*credential/i).first();

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
