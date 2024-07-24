import { test, expect } from '@playwright/test';


test('[/burger-shop-east] Check if elements exist', async ({ page }) => {
    await page.goto('http://localhost:3000/#/restaurant/burger-shop-east'); 

    // Check for the parent container
    const container = await page.locator('div.MuiBox-root.css-70qvj9');
    await expect(container).toBeVisible();
  
    // Check for the child div
    const childDiv = await container.locator('div.MuiBox-root.css-gmuwbf');
    await expect(childDiv).toBeVisible();
  
    // image element
    const image = await childDiv.locator('img[src^="data:image/png;base64"]');
    await expect(image).toBeVisible();
  
    //'Your Cart' 
    const cartText = await container.locator('p.MuiTypography-root.MuiTypography-body1');
    await expect(cartText).toHaveText('Your Cart');
  
    // 'Start adding items to your cart'
    const startText = await container.locator('h6.MuiTypography-root.MuiTypography-h6');
    await expect(startText).toHaveText('Start adding items to your cart');
  });


  test('[/burger-shop-east] Header elements', async ({ page }) => {
    await page.goto('http://localhost:3000/#/restaurant/burger-shop-east'); 
    
  // Wait for the image container
  const imageContainer = page.locator('div.makeStyles-imageContainer-6.MuiBox-root');
  await expect(imageContainer).toBeVisible({ timeout: 10000 });

  // detail container
  const restaurantDetail = imageContainer.locator('div.makeStyles-restaurantDetail-13.MuiBox-root');
  await expect(restaurantDetail).toBeVisible({ timeout: 10000 });

  // restaurant title 
  const restaurantTitle = restaurantDetail.locator('text=Burger Shop-East');
  await expect(restaurantTitle).toBeVisible({ timeout: 10000 });

  //  button inside the image container exists
  const button = imageContainer.locator('button.MuiButtonBase-root');
  await expect(button).toBeVisible({ timeout: 10000 });

  //  new tag exists by its text content
  const newTag = restaurantDetail.getByText('NEW');
  await expect(newTag).toBeVisible({ timeout: 10000 });

  // icon and text exist
  const ratingIcon = restaurantDetail.locator('svg[data-testid="StarSharpIcon"]');
  await expect(ratingIcon).toBeVisible({ timeout: 10000 });
  const currentRatingText = restaurantDetail.getByText('3');
  await expect(currentRatingText).toBeVisible({ timeout: 10000 });
  const totalRatingText = restaurantDetail.getByText('/5');
  await expect(totalRatingText).toBeVisible({ timeout: 10000 });

  // delivery time 
  const deliveryTime = restaurantDetail.getByText('Delivery 1 Minute');
  await expect(deliveryTime).toBeVisible({ timeout: 10000 });
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