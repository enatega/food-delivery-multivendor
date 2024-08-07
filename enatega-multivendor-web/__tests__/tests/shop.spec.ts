import { test, expect } from '@playwright/test';

test('check specific elements exist', async ({ page }) => {
    await page.goto('http://localhost:3000/#/restaurant/pizza-shop');
  
    const pepperoniDescriptionText = 'Loaded with Pepperoni and extra Cheese on a Pizza Sauce Base';
    
    const spicyItalianText = 'Spicy Italian';
    const spicyItalianDescriptionText = 'Pepperoni, Double Italian Sausage, Red Chilli Flakes and a Pizza Sauce Base';
    
    const papasFavouriteText = "Papa's Favourite";
    const papasFavouriteDescriptionText = 'Pepperoni, Italian Sausage, Mozzarella Cheeses, Italian Seasoning on a Pizza Sau...';
    
    const americanHotText = 'American Hot';
    const americanHotDescriptionText = 'Loaded with Pepperoni, Jalapenos and Extra Cheese on a Pizza Sauce Base with Red...';
    
    const superPapasText = "Super Papa's";
    const superPapasDescriptionText = 'Pepperoni, Italian Sausage, Mushrooms, Onions, Green Peppers, Black Olives on a ...';
    const signaturePizzasTitle = 'Signature Pizzas';
    const addButtonSelector = '.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary.MuiButton-sizeMedium.MuiButton-textSizeMedium.makeStyles-addContainer-504.css-1fvkalb-MuiButtonBase-root-MuiButton-root';
  
    // Check for the Pepperoni item text
    await expect(page.getByText('Pepperoni', { exact: true })).toBeVisible();
    await expect(page.getByText(pepperoniDescriptionText)).toBeVisible();
    await expect(page.locator('.MuiPaper-root > div > p').first()).toBeVisible();
    await expect(page.locator('.MuiTypography-root > .MuiTypography-root').first()).toBeVisible();
  
     // Check for the Signature Pizzas title
    await expect(page.locator('a').filter({ hasText: 'Signature Pizzas' })).toBeVisible();

    // Check for the Spicy Italian item text
    await expect(page.getByText(spicyItalianText)).toBeVisible();
    await expect(page.getByText(spicyItalianDescriptionText)).toBeVisible();
  
    // Check for the Papa's Favourite item text
    await expect(page.getByText(papasFavouriteText)).toBeVisible();
    await expect(page.getByText(papasFavouriteDescriptionText)).toBeVisible();
  
    // Check for the American Hot item text
    await expect(page.getByText('American Hot').first()).toBeVisible();
    await expect(page.getByText(americanHotDescriptionText)).toBeVisible();
    await expect(page.getByText('$ 5.60$').first()).toBeVisible();
    await expect(page.getByText('$ 10.60').first()).toBeVisible();
  
    // Check for the Super Papa's item text
    await expect(page.getByText(superPapasText)).toBeVisible();
    await expect(page.getByText(superPapasDescriptionText)).toBeVisible();
  
    // Check for the Add buttons
//     await expect(page.locator(addButtonSelector).nth(0)).toBeVisible();
//   await expect(page.locator(addButtonSelector).nth(1)).toBeVisible();
//   await expect(page.locator(addButtonSelector).nth(2)).toBeVisible();
//   await expect(page.locator(addButtonSelector).nth(3)).toBeVisible();
//   await expect(page.locator(addButtonSelector).nth(4)).toBeVisible();
  });

  test('Check existence of elements2', async ({ page }) => {
    await page.goto('http://localhost:3000/#/restaurant/pizza-shop');
  
    // Check for Fajita Chicken
    await expect(page.locator('text=Fajita Chicken')).toBeVisible();
    await expect(page.locator('text=Spicy Chicken,Jalapenos, Onions, Corn, Green Pepper, Ranch Drizzle on a Peri Per...')).toBeVisible();
    await expect(page.getByText('$ 5.60$').nth(1)).toBeVisible();
    await expect(page.getByText('$ 10.60').nth(1)).toBeVisible();
  
    // Check for Peri Peri Chicken
    await expect(page.getByText('Peri Peri Chicken', { exact: true })).toBeVisible();
    await expect(page.locator('text=Peri Peri Chicken, Onion, Green Pepper, Jalapenos , PERI PERI Sauce Drizzle on a...')).toBeVisible();
    await expect(page.locator('div:nth-child(2) > .MuiPaper-root > div > p').first()).toBeVisible();
    await expect(page.locator('div:nth-child(2) > .MuiPaper-root > div > p > .MuiTypography-root').first()).toBeVisible();
  
    // Check for Garden Special
    await expect(page.getByText('Tandoori Chicken', { exact: true })).toBeVisible();
    await expect(page.locator('text=Green Peppers, Mushrooms, Onions, Tomatoes, Black Olives, Italian Seasoning on a...')).toBeVisible();
    await expect(page.locator('div:nth-child(3) > .MuiPaper-root > div > p').first()).toBeVisible();
    await expect(page.locator('div:nth-child(3) > .MuiPaper-root > div > p > .MuiTypography-root').first()).toBeVisible();
  
    // Check for Tandoori Chicken
    await expect(page.getByText('Tandoori Chicken', { exact: true })).toBeVisible();
    await expect(page.locator('text=Spicy Chicken, Green Chilli, Green Peppers, Onions on a Tandoori Pizza Sauce Bas...')).toBeVisible();
    await expect(page.locator('div:nth-child(4) > .MuiPaper-root > div > p').first()).toBeVisible();
    await expect(page.locator('div:nth-child(4) > .MuiPaper-root > div > p > .MuiTypography-root').first()).toBeVisible();
  
  
    // Check for Chicken BBQ Ranch
    await expect(page.locator('text=Chicken BBQ Ranch')).toBeVisible();
    await expect(page.locator('text=Grilled Chicken, Mushrooms, Onions, BBQ Sauce Drizzle on a Ranch Sauce Base')).toBeVisible();
    await expect(page.locator('text=$ 770.00')).toBeVisible();
    await expect(page.locator('text=$ 1470.00')).toBeVisible();
  
    // Check for Spicy Buffalo Ranch
    await expect(page.locator('text=Spicy Buffalo Ranch')).toBeVisible();
    await expect(page.locator('text=Sliced Chicken Poppers, Green Peppers, Mushrooms, Onions, Tomatoes, Ranch Drizzl...')).toBeVisible();
    await expect(page.locator('div:nth-child(5) > .MuiPaper-root > div > p').first()).toBeVisible();
    await expect(page.locator('div:nth-child(5) > .MuiPaper-root > div > p > .MuiTypography-root').first()).toBeVisible();
  
    // Check for Hot Popper Passion
    await expect(page.locator('text=Hot Popper Passion')).toBeVisible();
    await expect(page.locator('text=Tandoori Chicken Popper, Jalapeno, Green Pepper, Onion, Buffalo Sauce Drizzle wi...')).toBeVisible();
    await expect(page.locator('div:nth-child(6) > .MuiPaper-root > div > p').first()).toBeVisible();
    await expect(page.locator('div:nth-child(6) > .MuiPaper-root > div > p > .MuiTypography-root').first()).toBeVisible();
  
  
    // Check for Cheese
    await expect(page.getByText('Cheese', { exact: true })).toBeVisible();
    await expect(page.locator('text=Cheese and Pizza Sauce Base')).toBeVisible();
    await expect(page.locator('div:nth-child(7) > .MuiPaper-root > div > p').first()).toBeVisible();
    await expect(page.locator('div:nth-child(7) > .MuiPaper-root > div > p > .MuiTypography-root').first()).toBeVisible();
  
    // Check for American Hot
    await expect(page.getByText('American Hot').first()).toBeVisible();
    await expect(page.getByText('Pepperoni, Jalapenos and Extra Cheese on a Pizza Sauce Base', { exact: true })).toBeVisible();
    await expect(page.locator('text=$ 5.00')).toBeVisible();
  });
  


test('check for italian food east', async ({ page }) => {
  await page.goto('http://localhost:3000/#/restaurant/italian-food-east');

  // Check each pizza item
  await expect(page.locator('text=Cheese Pizza')).toBeVisible();
  await expect(page.getByText('Veggie Pizza', { exact: true })).toBeVisible();
  await expect(page.locator('text=Pepperoni Pizza')).toBeVisible();
  await expect(page.locator('text=Margherita Pizza')).toBeVisible();
  await expect(page.locator('text=BBQ Chicken Pizza')).toBeVisible();
  await expect(page.locator('text=Hawaiian Pizza')).toBeVisible();
  await expect(page.locator('text=Buffalo Pizza')).toBeVisible();
  await expect(page.locator('text=Pizza Capricciosa')).toBeVisible();
  await expect(page.locator('text=Kale And Sausage Pizza')).toBeVisible();
  await expect(page.locator('text=Deluxe Veggie Pizza')).toBeVisible();
  await expect(page.locator('text=Mexican Green Wave Pizza')).toBeVisible();
});


test('check if specific pasta items exist', async ({ page }) => {
  await page.goto('http://localhost:3000/#/restaurant/italian-food-east');

  // Check each pasta item
  await expect(page.locator('p.MuiTypography-body1:has-text("Spaghetti")')).toBeVisible();
  await expect(page.locator('p.MuiTypography-body1:has-text("Ravioli")')).toBeVisible();
  await expect(page.locator('p.MuiTypography-body1:has-text("Penne Pasta")')).toBeVisible();
  await expect(page.locator('p.MuiTypography-body1:has-text("Macaroni")')).toBeVisible();
  await expect(page.locator('p.MuiTypography-body1:has-text("Lasagna")')).toBeVisible();
  await expect(page.locator('p.MuiTypography-body1:has-text("Gnocchi")')).toBeVisible();
  await expect(page.locator('p.MuiTypography-body1:has-text("Linguine")')).toBeVisible();
  await expect(page.locator('p.MuiTypography-body1:has-text("Vermicelli")')).toBeVisible();
});


test('Verify elements and interact with them', async ({ page }) => {
  await page.goto('http://localhost:3000/#/restaurant/italian-food-east');

  // Verify the "Add" button for Coke is present and click it
  const cokeAddButton = page.locator('.makeStyles-imageContainer-6 > .MuiButtonBase-root');
  await expect(cokeAddButton).toBeVisible();
  await cokeAddButton.click();

  // Verify the price of Sprite and assert it is correct
  const spritePrice = page.getByText('$ 5.00', { exact: true });
  await expect(spritePrice).toBeVisible();

});

test('check presence of footer elements', async ({ page }) => {
  await page.goto('http://localhost:3000/#/restaurant/italian-food-east');

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
