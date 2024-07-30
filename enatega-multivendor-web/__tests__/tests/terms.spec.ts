import { test, expect } from '@playwright/test';


test('check if specific elements exist', async ({ page }) => {
    await page.goto('http://localhost:3000/#/terms'); 

    const divSelector = 'div:has-text("TERMS AND CONDITIONS | ENATEGA")';

  // Check if the <div> element contains the correct text
  const divElement = await page.getByText('TERMS AND CONDITIONS | ENATEGAPublished: 2021TERMS OF USEThese Terms of Use (“');
  await expect(divElement).toBeVisible(); 

  // Verify that the <h4> within the <div> contains the correct text
  const h4Text = 'TERMS AND CONDITIONS | ENATEGA';
  const h4Element = divElement.locator(`h4:has-text("${h4Text}")`);
  await expect(h4Element).toHaveText(h4Text);
  });


test('check if the text exists in h6 elements within a list item', async ({ page }) => {
    await page.goto('http://localhost:3000/#/terms');
       
  // Check for the presence of the text "TERMS OF USE"
  const termsOfUse = await page.getByRole('heading', { name: 'TERMS OF USE', exact: true });
  await expect(termsOfUse).toBeVisible();

  const termsText = await page.locator('text=These Terms of Use (“Terms”) govern your use of the websites and mobile applications provided by enatega');
  await expect(termsText).toBeVisible();

  const platformsText = await page.locator('text=The Platforms may be used by (i) natural persons who have reached 18 years of age and (ii) corporate legal entities, e.g companies.');
  await expect(platformsText).toBeVisible();

  const usersText = await page.locator('text=Users below the age of 18 must obtain consent from parent(s) or legal guardian(s), who by accepting these Terms shall agree to take responsibility for your actions and any charges associated with your use of the Platforms and/or purchase of Goods.');
  await expect(usersText).toBeVisible();

  const changeTermsText = await page.locator('text=Enatega reserves the right to change or modify these Terms (including our policies which are incorporated into these Terms) at any time.');
  await expect(changeTermsText).toBeVisible();

  const enategaText = await page.getByRole('link', { name: 'Enatega' });
  await expect(enategaText).toBeVisible();

  // Check for the presence of the text "What we do"
  const whatWeDoText = await page.locator('text=What we do');
  await expect(whatWeDoText).toBeVisible();

  const platformsText2 = await page.locator('text=Through our Platforms, enatega links you to the vendors (“Vendors”) for you to order a variety of goods including prepared meals, non-prepared food and miscellaneous non-food items (hereinafter collectively referred to as "Goods") to be delivered to you. When you place an order for Goods from our Vendors (“Order”), enatega acts as an agent on behalf of that Vendor to facilitate, process and conclude the order and subsequently for either us or the Vendor to deliver your Order to you. Vendors may be owned and operated by third party vendors, our affiliate companies, or us.');
  await expect(platformsText2).toBeVisible();

  // Check for the presence of the text "How to contact us"
  const contactUsText = await page.locator('text=How to contact us');
  await expect(contactUsText).toBeVisible();

  const supportText = await page.locator('text=For customer support, you may reach out to us via email or through our in-app customer support chat feature.');
  await expect(supportText).toBeVisible();

  const useOfPlatformsText = await page.locator('text=Use of the Platforms and enatega Account');
  await expect(useOfPlatformsText).toBeVisible();

  const registerText = await page.locator('text=You will need to register for a enatega account for you to use the Platform. When you register for a enatega account we will ask you to provide your personal information including a valid email address, a mobile phone number and a unique password. To purchase an Order, depending on which payment method you opt for, you may need to provide us with your credit card details. Your unique password should not be shared with anyone and you agree to keep it secret at all times. You are solely responsible for keeping your password safe. Save for cases of fraud or abuse which are not your fault, you accept that all Orders placed under your enatega account are your sole responsibility.');
  await expect(registerText).toBeVisible();

  const liabilityText = await page.locator('text=enatega shall not be liable for Orders that encounter delivery issues due to incomplete, incorrect or missing information provided by you. You are obliged to provide information that is complete, accurate and truthful for the proper processing of the Order, including your delivery address and contact information.');
  await expect(liabilityText).toBeVisible();

  const deleteAccountText = await page.locator('text=If you wish to delete your enatega account, please send us an email requesting the same. We may restrict, suspend or terminate your enatega account and/or use of the Platforms, if we reasonably believe that:');
  await expect(deleteAccountText).toBeVisible();

  const someoneElseUsingAccountText = await page.locator('text=someone other than you is using your enatega account; or');
  await expect(someoneElseUsingAccountText).toBeVisible();

  const breachText = await page.locator('text=where you are suspected or discovered to have been involved in any activity or conduct that is in breach of these Terms, our policies and guidelines, or involved in activity or conduct which we deem in our sole discretion to be an abuse of the Platforms.');
  await expect(breachText).toBeVisible();

  const intellectualPropertyHeaderText = await page.getByRole('heading', { name: 'Intellectual Property', exact: true })
  await expect(intellectualPropertyHeaderText).toBeVisible();

  const intellectualPropertyText1 = await page.locator('text=All trademarks, logos, images, and service marks, including these Terms as displayed on the Platforms or in our marketing material, whether registered or unregistered, are the intellectual property of enatega and/or third parties who have authorised us with the use (collectively the “Trademarks”).');
  await expect(intellectualPropertyText1).toBeVisible();

  const intellectualPropertyText2 = await page.locator('text=You may not use, copy, reproduce, republish, upload, post, transmit, distribute, or modify these Trademarks in any way without our prior express written consent.');
  await expect(intellectualPropertyText2).toBeVisible();

  const intellectualPropertyText3 = await page.locator('text=The use of enatega\'s trademarks on any other website not approved by us is strictly prohibited.');
  await expect(intellectualPropertyText3).toBeVisible();

  const intellectualPropertyText4 = await page.locator('text=Enatega will aggressively enforce its intellectual property rights to the fullest extent of the law, including criminal prosecution.');
  await expect(intellectualPropertyText4).toBeVisible();

  const intellectualPropertyText5 = await page.locator('text=Enatega neither warrants nor represents that your use of materials displayed on the Platforms will not infringe rights of third parties not owned by or affiliated with enatega.');
  await expect(intellectualPropertyText5).toBeVisible();

  const intellectualPropertyText6 = await page.locator('text=Use of any materials on the Platforms is at your own risk.');
  await expect(intellectualPropertyText6).toBeVisible();
  });
  