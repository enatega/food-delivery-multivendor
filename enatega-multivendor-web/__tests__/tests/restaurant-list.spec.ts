import { test, expect } from '@playwright/test';

test('Check for All Restaurants', async ({ page }) => {
    await page.goto('http://localhost:3000/#/restaurant-list');
  
    const inputLocator = page.locator('input[placeholder="Search for restaurant and cuisines"]');  // Replace with the actual placeholder text

    // input field is visible on the page
    await expect(inputLocator).toBeVisible();
  
    // input field is enabled
    await expect(inputLocator).toBeEnabled();

    // Check if the heading exists
    const targetHeader = 'All Restaurants'
    await expect(page.getByText(targetHeader).first()).toBeVisible();
     
     // Check if the heading exists
     const TimeText = '20'
     await expect(page.getByText(TimeText).first()).toBeVisible();

    //  const svgElement = await page.$('//svg[contains(@class, "MuiSvgIcon-root") and contains(@class, "MuiSvgIcon-fontSizeSmall") and contains(@class, "makeStyles-icon-481") and contains(@class, "css-ptiqhd-MuiSvgIcon-root") and @data-testid="FavoriteBorderIcon"]');
    //  expect(svgElement).not.toBeNull();


    // const spanLocator = page.getByText(':has-text("Rice,Gravy,Soups")').first();
    // await expect(spanLocator).toBeVisible();

   
  // Check if the restaurant name exists
  const Juiceheading = await page.locator('h6:has-text("Juice Bar-East")');
  expect(Juiceheading).not.toBeNull();

   const Chineseheading = await page.locator('h6:has-text("Chinese Food-East")');
   expect(Chineseheading).not.toBeNull();

   const IceCreameheading = await page.locator('h6:has-text("Ice-Cream Shop-East")');
   expect(IceCreameheading).not.toBeNull();

   const Italianheading = await page.locator('h6:has-text("Italian Food-East")');
   expect(Italianheading).not.toBeNull(); 

   const Probaheading = await page.locator(':has-text("Proba")');
   expect(Probaheading).not.toBeNull();

   const Popularheading = await page.locator(':has-text("Popular this week")');
   expect(Popularheading).not.toBeNull();

  });


  test('check presence of footer elements', async ({ page }) => {
    await page.goto('http://localhost:3000/#/restaurant-list');

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

