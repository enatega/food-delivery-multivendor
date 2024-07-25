import { test, expect } from '@playwright/test';

test('check specific elements existence', async ({ page }) => {
  await page.goto('http://localhost:3000/#/');

  // Check if the first image with alt "fruits2" is present
//   await expect(page.locator('img[alt="fruits2"]')).toBeVisible();

  // Check if the banner images are present
  await expect(page.locator('img[alt="banner2"]')).toBeVisible();
  await expect(page.locator('img[alt="banner1"]')).toBeVisible();

  // Check if the text "Put us in your pocket" is present
  await expect(page.locator('p:has-text("Put us in your pocket")')).toBeVisible();

  // Check if the "Ios Store" button is present
  await expect(page. getByRole('button', { name: 'playstore Ios Store' })).toBeVisible();

  // Check if the "Play Store" button is present
  await expect(page.getByRole('button', { name: 'appstore Play Store' }).nth(1)).toBeVisible();
});

test('check presence of elements', async ({ page }) => {
    await page.goto('http://localhost:3000/#/');
    
    // Check for the presence of the "FEATURES" text
    const featuresText = await page.locator('p:has-text("FEATURES")');
    await expect(featuresText).toBeVisible();
  
    // Check for the presence of Rider App section
    await expect(page.locator('h5:has-text("Rider App")')).toBeVisible();
    await expect(page.locator('img[alt="apps"][src="/static/media/rider-app.5d2d755f.png"]')).toBeVisible();
    await expect(page.getByText('• Finding address using GPS').first()).toBeVisible();
    await expect(page.getByText('• Zones functionality for').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'appstore Play Store' }).nth(1)).toBeVisible();
    await expect(page.getByRole('button', { name: 'playstore Ios Store' })).toBeVisible();
  
    // Check for the presence of Restaurant App section
    await expect(page.locator('h5:has-text("Restaurant App")')).toBeVisible();
    await expect(page.locator('img[alt="apps"][src="/static/media/restaurant-app.7c194106.png"]')).toBeVisible();
    await expect(page.locator('p:has-text("Multiple Restaurant adding feature")')).toBeVisible();
    await expect(page.locator('p:has-text("Real-time order receiving updates")')).toBeVisible();
    await expect(page.getByRole('button', { name: 'appstore Play Store' }).nth(1)).toBeVisible();
    await expect(page.getByRole('button', { name: 'playstore Ios Store' })).toBeVisible();
  
  
    // Check for the presence of Customer App section
    await expect(page.locator('h5:has-text("Customer App")')).toBeVisible();
    await expect(page.locator('img[alt="apps"][src="/static/media/cust-app.381e11da.png"]')).toBeVisible();
    await expect(page.locator('p:has-text("Different sections feature for promoting restaurants")')).toBeVisible();
    await expect(page.locator('p:has-text("Previous order history and adding favorite restaurants")')).toBeVisible();
    await expect(page.getByRole('button', { name: 'appstore Play Store' }).nth(1)).toBeVisible();
    await expect(page.getByRole('button', { name: 'playstore Ios Store' })).toBeVisible(); 
  
    // Check for the presence of Admin Dashboard section
    await expect(page.locator('h5:has-text("Admin Dashboard")')).toBeVisible();
    await expect(page.locator('img[alt="apps"][src="/static/media/dashboard.1da8f08f.png"]')).toBeVisible();
    await expect(page.getByText('• Finding address using GPS').first()).toBeVisible();
    await expect(page.getByText('• Zones functionality for').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Demo Demo' }).first()).toBeVisible();
  
    // Check for the presence of Product Page section
    await expect(page.locator('h5:has-text("Product Page")')).toBeVisible();
    await expect(page.locator('img[alt="apps"][src="/static/media/webapp.e31445e6.png"]')).toBeVisible();
    await expect(page.locator('p:has-text("Our delivery management system is designed for the future.")')).toBeVisible();
    await expect(page.locator('p:has-text("Built on community-driven principles.")')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Demo Demo' }).first()).toBeVisible();
  });


  test('check presence of footer elements', async ({ page }) => {
    await page.goto('http://localhost:3000/#/');
  
    // Check for the presence of "Enatega" header and description
    const header = page.locator('h4:has-text("Enatega")');
    const description = page.locator('p:has-text("Enatega is an open-source delivery management platform for the future.")');
    
    await expect(header).toBeVisible();
    await expect(description).toBeVisible();
  
    // Check for the presence of "Links" section
    await expect(page.locator('p:has-text("Links")')).toBeVisible();
    await expect(page.locator('a:has-text("Home")')).toBeVisible();
    await expect(page.locator('a:has-text("Privacy Policy")')).toBeVisible();
    await expect(page.locator('a:has-text("Terms and Conditions")')).toBeVisible();
  
    // Check for the presence of social media icons in the "Follow Us" section
    await expect(page.locator('svg[data-testid="FacebookIcon"]')).toBeVisible();
    await expect(page.locator('svg[data-testid="TwitterIcon"]')).toBeVisible();
    await expect(page.locator('svg[data-testid="InstagramIcon"]')).toBeVisible();
    await expect(page.locator('svg[data-testid="LinkedInIcon"]')).toBeVisible();
    await expect(page.locator('svg[data-testid="GitHubIcon"]')).toBeVisible();
  
    // Check for the presence of "Powered By" section with "ninjascode"
    await expect(page.locator('p:has-text("Powered By")')).toBeVisible();
    await expect(page.locator('p:has-text("ninjascode")')).toBeVisible();
  });