import { test, expect } from '../../fixtures/index';

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
