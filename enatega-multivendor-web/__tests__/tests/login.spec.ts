import { test, expect } from '@playwright/test';


  test('has title', async ({ page }) => {
    await page.goto('http://localhost:3000/#/new-login');
  
    await expect(page).toHaveTitle(/Enatega-Food Delivery/);
  });


  test('Check for the existence of specific elements', async ({ page }) => {
    await page.goto('http://localhost:3000/#/login-email');
    
    const expectedRedirectUrl = 'http://localhost:3000/#/';
    const formHeadingText = 'Sign in with your email';
    const passwordInstructionText = 'Type your password';
    const forgotPasswordText = 'Forgot your password?';
    const continueButtonText = 'CONTINUE';
    await expect(page.getByText(formHeadingText)).toBeVisible();

    // Check for the password instruction
    await expect(page.getByText(passwordInstructionText)).toBeVisible();
  
    // Check for the Email label
    await expect(page.getByLabel('Email')).toBeVisible();
  
    // Check for the Password label
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
  
    // Check for the Forgot your password link text
    await expect(page.getByText(forgotPasswordText)).toBeVisible();
  
    // Check for the CONTINUE button text
    await expect(page.getByText(continueButtonText)).toBeVisible();
  
    // Click the CONTINUE button
    await page.getByText(continueButtonText).click();
  
    // Wait for the navigation to complete
    await page.waitForNavigation();
  
    // Check that the new URL is correct
    await expect(page).toHaveURL(expectedRedirectUrl);
    });


test('Check for the existence of specific elements by text content and redirection', async ({ page }) => {
  await page.goto('http://localhost:3000/#/login');

  const expectedRedirectUrl = 'http://localhost:3000/#/new-login'; 
  const welcomeText = 'Welcome!';
  const signUpOrLogInText = 'Sign up or log in to continue';
  const continueWithGoogleText = 'CONTINUE WITH GOOGLE';
  const continueWithEmailText = 'CONTINUE WITH EMAIL';
  const termsAndConditionsText = 'Terms and Conditions';
  const privacyPolicyText = 'Privacy Policy';


  // Check for the welcome text
  await expect(page.getByText(welcomeText)).toBeVisible();

  // Check for the sign-up or log-in text
  await expect(page.getByText(signUpOrLogInText)).toBeVisible();

  // Check for the CONTINUE WITH GOOGLE button text
  await expect(page.getByText(continueWithGoogleText)).toBeVisible();

  // Check for the "or" text
  await expect(page.getByText('or', { exact: true })).toBeVisible();

  // Check for the CONTINUE WITH EMAIL button text
  await expect(page.getByText(continueWithEmailText)).toBeVisible();

  // Check for the Terms and Conditions link text
  await expect(page.getByText(termsAndConditionsText)).toBeVisible();

  // Check for the Privacy Policy link text
  await expect(page.getByText(privacyPolicyText)).toBeVisible();

  // Click the CONTINUE WITH EMAIL button
  await page.getByText(continueWithEmailText).click();

  // Wait for the navigation to complete
  //await page.waitForNavigation();

  // Check that the new URL is correct
  await expect(page).toHaveURL(expectedRedirectUrl);
});