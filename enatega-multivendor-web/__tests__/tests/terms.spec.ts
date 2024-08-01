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
  
  test('Check if specific elements exist on the page', async ({ page }) => {
    await page.goto('http://localhost:3000/#/terms');
  
    const termsOfUse = await page.getByRole('heading', { name: 'Orders', exact: true });
    await expect(termsOfUse).toBeVisible();

    const whenYouPlaceAnOrder = await page.locator('text=When you place an Order with enatega');
    await expect(whenYouPlaceAnOrder).toBeVisible();
  
    const minimumOrderValue = await page.locator('text=Minimum Order Value');
    await expect(minimumOrderValue).toBeVisible();
  
    const specialInstructions = await page.locator('text=Special Instructions');
    await expect(specialInstructions).toBeVisible();
  
    const allergens = await page.locator('text=Allergens');
    await expect(allergens).toBeVisible();
  
    const priorToPlacingOrder = await page.locator('text=Prior to placing the Order');
    await expect(priorToPlacingOrder).toBeVisible();
  
    const placingOrder = await page.getByRole('heading', { name: 'Placing the Order', exact: true });
    await expect(placingOrder).toBeVisible();
  
    const cancellingOrder = await page.locator('text=Cancelling an Order');
    await expect(cancellingOrder).toBeVisible();
  
    const refunds = await page.getByRole('heading', { name: 'Refunds', exact: true });
    await expect(refunds).toBeVisible();
  
    const onlinePaymentOrders = await page.locator('text=Online Payment Orders');
    await expect(onlinePaymentOrders).toBeVisible();
  
    const cashOnDeliveryOrders = await page.locator('text=Cash-on-Delivery Orders');
    await expect(cashOnDeliveryOrders).toBeVisible();
  
    const reservesRightToCancel = await page.locator('text=reserves the right to cancel any Order');
    await expect(reservesRightToCancel).toBeVisible();
  });

  test('Check if specific elements exist on the Prices and Payments section', async ({ page }) => {
    await page.goto('http://localhost:3000/#/terms');
  
    const pricesAndPaymentsHeading = await page.locator('text=Prices and Payments');
    await expect(pricesAndPaymentsHeading).toBeVisible();

    const pricesQuoted = await page.locator('text=Prices quoted on the Platform shall be displayed in the applicable country’s national currency');
    await expect(pricesQuoted).toBeVisible();
  
    const includeTax = await page.locator('text=include TAX, VAT or such other equivalent tax');
    await expect(includeTax).toBeVisible();
  
    const excludeTax = await page.locator('text=exclude TAX, VAT or such other equivalent tax');
    await expect(excludeTax).toBeVisible();
  
    const breakdownOfPrices = await page.locator('text=A breakdown of the prices and additional charges are displayed before Checkout');
    await expect(breakdownOfPrices).toBeVisible();
  
    const deliveryFeesChargeable = await page.locator('text=Delivery fees are chargeable on every Order unless');
    await expect(deliveryFeesChargeable).toBeVisible();
  
    const optForPickUp = await page.locator('text=you opt to collect your Order directly from the Vendor');
    await expect(optForPickUp).toBeVisible();
  
    const validPromotionalVoucher = await page.locator('text=you have a valid promotional or discount voucher and apply it at Checkout');
    await expect(validPromotionalVoucher).toBeVisible();
  
    const pricesSubjectToChange = await page.locator('text=Prices indicated on the Platforms are as at the time of each Order and may be subject to change');
    await expect(pricesSubjectToChange).toBeVisible();
  
    const paymentMethods = await page.locator('text=You can choose to pay for an Order using any of the different payment methods offered on the Platforms');
    await expect(paymentMethods).toBeVisible();
  
    const paymentPartners = await page.locator('text=Our payment partners: Visa, Mastercard, American Express, Google Pay, PayPal, Apple Pay');
    await expect(paymentPartners).toBeVisible();
  
    const cashOnDelivery = await page.getByRole('heading', { name: 'Cash-on-Delivery Orders' });
    await expect(cashOnDelivery).toBeVisible();
  
    const suchOtherPaymentMethod = await page.locator('text=Such other payment method we offer from time to time');
    await expect(suchOtherPaymentMethod).toBeVisible();
  
    const creditInAccount = await page.locator('text=If you have existing credit in your enatega account or valid promotional or discount vouchers');
    await expect(creditInAccount).toBeVisible();
  
    const emailConfirmation = await page.locator('text=After an Order is successfully placed, you will receive an email confirmation from us with your Order receipt');
    await expect(emailConfirmation).toBeVisible();
  
    const paymentMethodsHeading = await page.getByRole('heading', { name: 'Payment Methods', exact: true });
    await expect(paymentMethodsHeading).toBeVisible();
  
    const enategaReservesRight = await page.locator('text=Enatega reserves the right to offer additional payment methods and/or remove existing payment methods');
    await expect(enategaReservesRight).toBeVisible();
  
    const sufficientFunds = await page.locator('text=You must ensure that you have sufficient funds on your credit and debit card to fulfil payment of an Order');
    await expect(sufficientFunds).toBeVisible();
  });
  

test('Check essential elements in Delivery, Pick-Up and Vendor Delivery section', async ({ page }) => {
    await page.goto('http://localhost:3000/#/terms');

    const deliveryHeading = await page.locator('text=Delivery, Pick-Up and Vendor Delivery');
    await expect(deliveryHeading).toBeVisible();

    const deliveryAreas = await page.getByRole('heading', { name: 'Delivery Areas', exact: true });
    await expect(deliveryAreas).toBeVisible();
  
    const deliveryTime = await page.getByRole('heading', { name: 'Delivery Time', exact: true });
    await expect(deliveryTime).toBeVisible();
  
    const unsuccessfulDeliveries = await page.locator('text=Unsuccessful or Failed Deliveries');
    await expect(unsuccessfulDeliveries).toBeVisible();
  
    const noShowCancellations = await page.locator('text=No-show Cancellations');
    await expect(noShowCancellations).toBeVisible();
  
    const wrongOrder = await page.locator('text=Wrong Order, Missing Items, Defective Goods');
    await expect(wrongOrder).toBeVisible();
  
    const orderPickUp = await page.locator('text=Order Pick-Up');
    await expect(orderPickUp).toBeVisible();
  
    const vendorDelivery = await page.getByRole('heading', { name: 'Vendor Delivery', exact: true });
    await expect(vendorDelivery).toBeVisible();
  });

  test('Check essential elements in Vouchers, Discounts and Promotions section', async ({ page }) => {
    await page.goto('http://localhost:3000/#/terms');
  
    const vouchersHeading = await page.locator('text=Vouchers, Discounts and Promotions');
    await expect(vouchersHeading).toBeVisible();
  
    const vouchersPromo = await page.locator('text=marketing and promotional campaigns which offer voucher codes, discounts, and other promotional offers');
    await expect(vouchersPromo).toBeVisible();
  
    const platformUse = await page.locator('text=Vouchers can only be used on our Platforms');
    await expect(platformUse).toBeVisible();
  
    const noCashExchange = await page.locator('text=Vouchers cannot be exchanged for cash');
    await expect(noCashExchange).toBeVisible();
  
    const voidVoucher = await page.locator('text=void, discontinue or reject the use of any Voucher without prior notice');
    await expect(voidVoucher).toBeVisible();
  
    const excludeVendors = await page.locator('text=exclude certain Vendors from the use of Vouchers at any time without prior notice');
    await expect(excludeVendors).toBeVisible();
  });
  

test('should check for specific text in the document', async ({ page }) => {
  await page.goto('http://localhost:3000/#/terms');

 const mainHeading = await page.locator('text=Representations, Warranties and Limitation of Liabilities');
 await expect(mainHeading).toBeVisible();

 // Check for sub-heading texts
 const representationsHeading = await page.locator('text=Representations and Warranties');
 await expect(representationsHeading).toBeVisible();

 const limitationHeading = await page.getByRole('heading', { name: 'Limitation of Liability', exact: true });
 await expect(limitationHeading).toBeVisible();

 const vendorsHeading = await page.locator('text=Vendor’s representations');
 await expect(vendorsHeading).toBeVisible();

 // Check for shorter snippets of text
 const representationsTextSnippet = await page.locator('text=your use of or reliance upon the Platforms and any content');
 await expect(representationsTextSnippet).toBeVisible();

 const limitationTextSnippet = await page.locator('text=the enatega entities, their agents, representatives, and service providers');
 await expect(limitationTextSnippet).toBeVisible();

 const vendorsTextSnippet = await page.locator('text=actions or omissions of the Vendor');
 await expect(vendorsTextSnippet).toBeVisible();

 const vendorLiabilityHeading = await page.locator('text=Vendor Liability');
  await expect(vendorLiabilityHeading).toBeVisible();

  const vendorLiabilityText = await page.locator('text=Vendors are responsible for the preparation, condition and quality of Goods. In cases of Vendor Delivery, Vendors are responsible for delivery of the Goods and/or Orders. Enatega shall not be liable for any loss or damage arising from your contractual relationship with the Vendor.');
  await expect(vendorLiabilityText).toBeVisible();

  const personalDataHeading = await page.locator('text=Personal Data (Personal Information) Protection');
  await expect(personalDataHeading).toBeVisible();

  const personalDataText = await page.locator('text=You agree and consent to enatega and any of its affiliate companies collecting, using, processing and disclosing your Personal Data in accordance with these Terms and as further described in our Privacy Policy. Our Privacy Policy is available via the links on our Platforms, and shall form a part of these Terms.');
  await expect(personalDataText).toBeVisible();

  const indemnityHeading = await page.locator('text=Indemnity');
  await expect(indemnityHeading).toBeVisible();

  const indemnityText = await page.locator('text=You agree to indemnify, defend, hold harmless enatega, its directors, officers, employees, representatives, agents, and affiliates, from any and all third party claims, liability, damages and/or costs (including but not limited to, legal fees) arising from your use of the Platforms or your breach of these Terms.');
  await expect(indemnityText).toBeVisible();

  const ThirdParty = await page.getByRole('heading', { name: 'Third Party Links and Websites', exact: true });
  await expect(ThirdParty).toBeVisible();
  
  const Termination = await page.getByRole('heading', { name: 'Termination', exact: true });
  await expect(Termination).toBeVisible();
    
  const Amendments = await page.getByRole('heading', { name: 'Amendments', exact: true });
  await expect(Amendments).toBeVisible();

  const Severability = await page.getByRole('heading', { name: 'Severability', exact: true });
  await expect(Severability).toBeVisible();

  const GoverningLaw = await page.getByRole('heading', { name: 'Governing Law', exact: true });
  await expect(GoverningLaw).toBeVisible();

  const ContactUs = await page.getByRole('heading', { name: 'Contact Us', exact: true });
  await expect(ContactUs).toBeVisible();

  const PrevailingLanguage = await page.getByRole('heading', { name: 'Prevailing Language', exact: true });
  await expect(PrevailingLanguage).toBeVisible();
});

test('should check for footer element existence', async ({ page }) => {
  await page.goto('http://localhost:3000/#/terms');

  // Locate the footer element
  const footer = await page.locator('div.MuiGrid-root.MuiGrid-container.css-1vam7s3-MuiGrid-root');
  
  // Check if the footer element is visible
  await expect(footer).toBeVisible();

  // Optional: Check for specific text within the footer
  await expect(footer.locator('h4').filter({ hasText: /^Enatega$/ })).toBeVisible();
  await expect(footer.locator('text=Enatega is an open-source delivery management platform for the future. We prioritize innovation, flexibility, and affordability, and offer a scalable, customizable solution that streamlines your delivery processes.')).toBeVisible();
  await expect(footer.locator('text=Links')).toBeVisible();
  await expect(footer.locator('text=Home')).toBeVisible();
  await expect(footer.locator('text=Privacy Policy')).toBeVisible();
  await expect(footer.locator('text=Terms and Conditions')).toBeVisible();
  await expect(footer.getByText('Enatega – © 2022 All Rights').first()).toBeVisible();
  await expect(footer.locator('text=Follow Us')).toBeVisible();
});

test('should redirect to the Home page when clicking the Home link', async ({ page }) => {
  await page.goto('http://localhost:3000/#/terms');

  await Promise.all([
    page.waitForNavigation(), // Wait for the navigation 
    page.click('a[href="#/"]') 
  ]);

  await expect(page).toHaveURL('http://localhost:3000/#/');
});

test('should redirect to the Privacy Policy page when clicking the Privacy Policy link', async ({ page }) => {
  await page.goto('http://localhost:3000/#/terms');

  await Promise.all([
    page.waitForNavigation(), // Wait for the navigation
    page.click('a[href="#/privacy"]') 
  ]);

  // Verify the URL after the redirection
  await expect(page).toHaveURL('http://localhost:3000/#/privacy');
});