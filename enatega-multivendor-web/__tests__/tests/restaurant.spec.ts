import { test, expect } from '@playwright/test';


test('[/burger-shop-east] Check if main elements exist', async ({ page }) => {
    await page.goto('http://localhost:3000/#/restaurant/burger-shop-east'); 

    // Check for the parent container
    const parentContainer = await page.locator('div.MuiBox-root.css-70qvj9');
    await expect(parentContainer).toBeVisible();
  
    // Check for the child div
    const childDiv = await parentContainer.locator('div.MuiBox-root.css-gmuwbf');
    await expect(childDiv).toBeVisible();
  
    // Check for the image element
    const imageElement = await childDiv.locator('img[src^="data:image/png;base64"]');
    await expect(imageElement).toBeVisible();
  
    // Check for 'Your Cart' text
    const cartText = await parentContainer.locator('p.MuiTypography-root.MuiTypography-body1');
    await expect(cartText).toHaveText('Your Cart');
  
    // Check for 'Start adding items to your cart' text
    const startText = await parentContainer.locator('h6.MuiTypography-root.MuiTypography-h6');
    await expect(startText).toHaveText('Start adding items to your cart');
  });


  test('[/burger-shop-east] Check header elements', async ({ page }) => {
    await page.goto('http://localhost:3000/#/restaurant/burger-shop-east'); 
    
  // Wait for the image container
  const imageContainer = page.locator('div.makeStyles-imageContainer-6.MuiBox-root');
  await expect(imageContainer).toBeVisible({ timeout: 10000 });

  // Check for the detail container
  const detailContainer = imageContainer.locator('div.makeStyles-restaurantDetail-13.MuiBox-root');
  await expect(detailContainer).toBeVisible({ timeout: 10000 });

  // Check for the restaurant title 
  const restaurantTitle = detailContainer.locator('text=Burger Shop-East');
  await expect(restaurantTitle).toBeVisible({ timeout: 10000 });

  // Check for the button inside the image container
  const buttonElement = imageContainer.locator('button.MuiButtonBase-root');
  await expect(buttonElement).toBeVisible({ timeout: 10000 });

  // Check for the 'NEW' tag
  const newTagElement = detailContainer.getByText('NEW');
  await expect(newTagElement).toBeVisible({ timeout: 10000 });

  // Check for the rating icon and text
  const ratingIcon = detailContainer.locator('svg[data-testid="StarSharpIcon"]');
  await expect(ratingIcon).toBeVisible({ timeout: 10000 });
  const currentRatingText = detailContainer.getByText('3');
  await expect(currentRatingText).toBeVisible({ timeout: 10000 });
  const totalRatingText = detailContainer.getByText('/5');
  await expect(totalRatingText).toBeVisible({ timeout: 10000 });

  // Check for the delivery time text
  const deliveryTimeText = detailContainer.getByText('Delivery 1 Minute');
  await expect(deliveryTimeText).toBeVisible({ timeout: 10000 });
  });

  
  test('[/burger-shop-east] Check navigation buttons', async ({ page }) => {
    await page.goto('http://localhost:3000/#/restaurant/burger-shop-east');

    // Wait for the container to be visible
    const mainContainer = page.locator('div.MuiContainer-root.MuiContainer-maxWidthLg.css-1oqqzyl-MuiContainer-root');
    await expect(mainContainer).toBeVisible({ timeout: 10000 });
  
    // Check visibility of each specific tab item by text
    await expect(page.locator('h5').filter({ hasText: 'Burgers' })).toBeVisible();
    await expect(page.locator('h5').filter({ hasText: 'Burritos' })).toBeVisible();
    await expect(page.locator('h5').filter({ hasText: 'Fries' })).toBeVisible();
    await expect(page.locator('h5').filter({ hasText: 'Beverages' })).toBeVisible();
    await expect(page.locator('h5').filter({ hasText: 'Popular' })).toBeVisible();
  });