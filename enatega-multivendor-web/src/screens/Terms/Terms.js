/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useContext, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import { Header, LoginHeader } from "../../components/Header";
import UserContext from "../../context/User";
import Analytics from "../../utils/analytics";
import useStyle from "./styles";

function Terms() {
  useEffect(async()=>{
    await Analytics.track(Analytics.events.NAVIGATE_TO_TERMS)
  },[])
  const classes = useStyle();
  const { isLoggedIn } = useContext(UserContext);
  return (
    <Grid className={classes.root}>
      {isLoggedIn ? <Header /> : <LoginHeader showIcon />}
      <Grid container className={classes.mainContainer}>
        <Box className={classes.imageContainer}>
          <Typography variant="h4" color="textPrimary" align="center" className={classes.title}>
            TERMS AND CONDITIONS | ENATEGA
          </Typography>
        </Box>
        <Grid container item xs={12} className={classes.mainContainer}>
          <Grid item xs={1} md={1} />
          <Grid container item xs={10} sm={10} md={9}>
            <ol className={classes.boldText}>
              <Typography variant="subtitle2" className={classes.MV3}>
                Published: 2021
              </Typography>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  TERMS OF USE
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  These Terms of Use (“<b>Terms</b>”) govern your use of the websites and mobile applications provided
                  by enatega (collectively the “<b>Platforms</b>”). Please read these Terms carefully. By accessing and
                  using the Platforms, you agree that you have read, understood and accepted the Terms including any
                  additional terms and conditions and any policies referenced herein, available on the Platforms or
                  available by hyperlink. If you do not agree or fall within the Terms, please do not use the Platforms.
                </Typography>
                <Typography variant="subtitle2">
                  The Platforms may be used by (i) natural persons who have reached 18 years of age and (ii) corporate
                  legal entities, e.g companies. Where applicable, these Terms shall be subject to country-specific
                  provisions as set out herein.
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  Users below the age of 18 must obtain consent from parent(s) or legal guardian(s), who by accepting
                  these Terms shall agree to take responsibility for your actions and any charges associated with your
                  use of the Platforms and/or purchase of Goods. If you do not have consent from your parent(s) or legal
                  guardian(s), you must stop using/accessing the Platforms immediately.
                </Typography>
                <Typography variant="subtitle2">
                  Enatega reserves the right to change or modify these Terms (including our policies which are
                  incorporated into these Terms) at any time. You are strongly recommended to read these Terms
                  regularly. You will be deemed to have agreed to the amended Terms by your continued use of the
                  Platforms following the date on which the amended Terms are posted.
                </Typography>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Enatega
                </Typography>
                <ul className={classes.bullet}>
                  <li>
                    <Typography variant="subtitle2">What we do</Typography>
                    <Typography variant="subtitle2" className={classes.MV2}>
                      Through our Platforms, enatega links you to the vendors (“<b>Vendors</b>”) for you to order a
                      variety of goods including prepared meals, non-prepared food and miscellaneous non-food items
                      (hereinafter collectively referred to as "<b>Goods</b>") to be delivered to you. When you place an
                      order for Goods from our Vendors (“<b>Order</b>”), enatega acts as an agent on behalf of that
                      Vendor to facilitate, process and conclude the order and subsequently for either us or the Vendor
                      to deliver your Order to you. Vendors may be owned and operated by third party vendors, our
                      affiliate companies, or us.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">How to contact us</Typography>
                    <Typography variant="subtitle2" className={classes.MV2}>
                      For customer support, you may reach out to us via email or through our in-app customer support
                      chat feature.{" "}
                    </Typography>
                  </li>
                </ul>
              </li>
              <li>
                <Typography variant="subtitle2" className={clsx(classes.boldText, classes.MV3)}>
                  Use of the Platforms and enatega Account
                </Typography>
                <Typography variant="subtitle2">
                  You will need to register for a enatega account for you to use the Platform. When you register for a
                  enatega account we will ask you to provide your personal information including a valid email address,
                  a mobile phone number and a unique password. To purchase an Order, depending on which payment method
                  you opt for, you may need to provide us with your credit card details. Your unique password should not
                  be shared with anyone and you agree to keep it secret at all times. You are solely responsible for
                  keeping your password safe. Save for cases of fraud or abuse which are not your fault, you accept that
                  all Orders placed under your enatega account are your sole responsibility.
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  enatega shall not be liable for Orders that encounter delivery issues due to incomplete, incorrect or
                  missing information provided by you. You are obliged to provide information that is complete, accurate
                  and truthful for the proper processing of the Order, including your delivery address and contact
                  information.
                </Typography>
                <Typography variant="subtitle2">
                  If you wish to delete your enatega account, please send us an email requesting the same. We may
                  restrict, suspend or terminate your enatega account and/or use of the Platforms, if we reasonably
                  believe that:
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  someone other than you is using your enatega account; or
                </Typography>
                <Typography variant="subtitle2">
                  where you are suspected or discovered to have been involved in any activity or conduct that is in
                  breach of these Terms, our policies and guidelines, or involved in activity or conduct which we deem
                  in our sole discretion to be an abuse of the Platforms.
                </Typography>
              </li>
              <li>
                <Typography variant="subtitle2" className={clsx(classes.boldText, classes.MV3)}>
                  Restrictions
                </Typography>
                <Typography variant="subtitle2">Activities Prohibited on the Platforms</Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  In processing your order we may send your information to credit reference and fraud prevention
                  agencies.
                </Typography>
                <Typography variant="subtitle2">
                  The following is a non-exhaustive list of the types of conduct that are illegal or prohibited on the
                  Platforms. Enatega reserves the right to investigate and take appropriate legal action against anyone
                  who, in enatega's sole discretion, engages in any of the prohibited activities. Prohibited activities
                  include, but are not limited to the following:
                </Typography>
                <ul className={classes.bullet}>
                  <li>
                    <Typography variant="subtitle2">
                      using the Platforms for any purpose in violation of local, state, or federal laws or regulations;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      posting any content that infringes the intellectual property rights, privacy rights, publicity
                      rights, trade secret rights, or any other rights of any party;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      posting content that is unlawful, obscene, defamatory, threatening, harassing, abusive,
                      slanderous, hateful, or embarrassing to any other person or entity as determined by enatega in its
                      sole discretion or pursuant to local community standards;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      posting content that constitutes cyber-bullying, as determined by enatega in its sole discretion;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      posting content that depicts any dangerous, life-threatening, or otherwise risky behavior;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      posting telephone numbers, street addresses, or last names of any person;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      posting URLs to external websites or any form of HTML or programming code;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      posting anything that may be “spam,” as determined by enatega in its sole discretion;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">impersonating another person when posting content;</Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      harvesting or otherwise collecting information about others, including e-mail addresses, without
                      their consent;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      allowing any other person or entity to use your identification for posting or viewing comments;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      harassing, threatening, stalking, or abusing any person on the Platforms;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      engaging in any other conduct that restricts or inhibits any other person from using or enjoying
                      the Websites, or which, in the sole discretion of enatega, exposes enatega or any of its
                      customers, suppliers, or any other parties to any liability or detriment of any type; or
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      encouraging other people to engage in any prohibited activities as described herein.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      enatega reserves the right but is not obligated to do any or all of the following:
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      investigate an allegation that any content posted on the Platforms does not conform to these Terms
                      and determine in its sole discretion to remove or request the removal of the content;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      remove content which is abusive, illegal, or disruptive, or that otherwise fails to conform with
                      these Terms;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      suspend or terminate a user’s access to the Platforms or their enatega Account upon any breach of
                      these Terms;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      monitor, edit, or disclose any content on the Platforms; and
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      edit or delete any content posted on the Platforms, regardless of whether such content violates
                      these standards.
                    </Typography>
                  </li>
                </ul>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Intellectual Property
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  All trademarks, logos, images, and service marks, including these Terms as displayed on the Platforms
                  or in our marketing material, whether registered or unregistered, are the intellectual property of
                  enatega and/or third parties who have authorised us with the use (collectively the “<b>Trademarks</b>
                  ”). You may not use, copy, reproduce, republish, upload, post, transmit, distribute, or modify these
                  Trademarks in any way without our prior express written consent. The use of enatega's trademarks on
                  any other website not approved by us is strictly prohibited. Enatega will aggressively enforce its
                  intellectual property rights to the fullest extent of the law, including criminal prosecution. Enatega
                  neither warrants nor represents that your use of materials displayed on the Platforms will not
                  infringe rights of third parties not owned by or affiliated with enatega. Use of any materials on the
                  Platforms is at your own risk.
                </Typography>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Restrictions on Goods
                </Typography>
                <ul className={classes.bullet}>
                  <li>
                    <Typography variant="subtitle2">
                      Some of the Goods we offer on our Platforms are subject to restrictions for purchase (“
                      <b>Restricted Goods</b>”)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      Alcohol / Alcoholic Products (“<b>Alcohol</b>”){" "}
                    </Typography>
                    <Typography variant="subtitle2" className={classes.MV2}>
                      To purchase Alcohol, you must be of the statutory legal age. Enatega, the Vendor and their
                      delivery riders, as the case may be, reserve the right in their sole discretion:
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      to ask for valid proof of age (e.g. ID card) to any persons before they deliver Alcohol;
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      to refuse delivery if you are unable to prove you are of legal age; and/or
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      to refuse delivery to any persons for any reason whatsoever.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      Cigarettes/Tobacco Products (“<b>Tobacco</b>”)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      We may offer Tobacco on some of our Platforms where the laws allow. By offering Tobacco for sale
                      on our Platforms, we do not purport to advertise, promote or encourage the purchase or use of
                      Tobacco in any way.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      To purchase Tobacco, you must be of the statutory legal age. Enatega, the Vendor and their
                      delivery riders, as the case may be, reserve the right in their sole discretion:
                    </Typography>
                    <ul className={classes.circle}>
                      <li>
                        <Typography variant="subtitle2">
                          to ask for valid proof of age (e.g. ID card) to any persons before they deliver Tobacco;
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="subtitle2">
                          to refuse delivery if you are unable to prove you are of legal age; and/or
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="subtitle2">
                          to refuse delivery to any persons for any reason whatsoever.
                        </Typography>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      Any offer for any Alcohol and Tobacco made on the Platforms is void when it is prohibited by law.
                    </Typography>
                  </li>
                </ul>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Orders
                </Typography>
                <ul className={classes.bullet}>
                  <li>
                    <Typography variant="subtitle2">
                      When you place an Order with enatega, enatega will confirm your order by sending you a
                      confirmation email containing the Order receipt. Where applicable, Orders will include delivery
                      fees and any applicable tax (e.g. goods and services tax, value-added tax, etc.).
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      Minimum Order Value - Some of our Vendors require a minimum order value (“<b>MOV</b>”) before an
                      Order can be placed and delivered to you. Where an applicable Order fails to meet the MOV, you
                      will have the option of paying the difference to meet the MOV or to add more Goods to your Order.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      Special Instructions – enatega and the Vendor (as the case may be) reasonably endeavour to comply
                      with your special instructions for an Order. However in some cases where this is not feasible,
                      possible or commercially reasonable, enatega and/or the Vendor reserve the right to proceed to
                      prepare the Order in accordance with standard operating procedures. Neither enatega nor the Vendor
                      shall be responsible to replace or refund an Order which does not conform to special instructions
                      provided by you.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      Allergens – enatega is not obligated to provide ingredient information or allergen information on
                      the Platforms. Further, enatega does not guarantee that the Goods sold by Vendors are free of
                      allergens. If you have allergies, allergic reactions or dietary restrictions and requirements,
                      please contact the Vendor before placing an Order on our Platforms.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      Please note that your Order may be subject to additional terms and conditions provided by the
                      Vendor.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">Prior to placing the Order</Typography>
                    <ul className={classes.circle}>
                      <li>
                        <Typography variant="subtitle2">
                          You are required to provide the delivery address in order for the Platform to display the
                          Vendors available in your delivery area.
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="subtitle2">
                          Once you select a Vendor, you will be taken to that Vendor’s menu page for you to select and
                          add your Goods to the cart.
                        </Typography>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Typography variant="subtitle2">Placing the Order</Typography>
                    <ul className={classes.circle}>
                      <li>
                        <Typography variant="subtitle2">
                          To complete an Order, please follow the onscreen instructions after clicking ‘Checkout’. You
                          may be required to provide additional details for us to complete your Order. You are required
                          to review and confirm that all the information you provide, including the amounts, delivery
                          details, personal details, payment information, and voucher codes (if applicable) is true,
                          accurate and complete before you click “PLACE ORDER”. An Order is successfully placed when you
                          receive an email confirmation containing your Order receipt from us.
                        </Typography>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Typography variant="subtitle2">Cancelling an Order</Typography>
                    <ul className={classes.circle}>
                      <li>
                        <Typography variant="subtitle2">
                          Please contact us immediately via our in-app customer support chat feature if you wish to
                          cancel your Order after it has been placed. You have the right to cancel your Order provided a
                          Vendor has not yet accepted your Order.
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="subtitle2">Refunds</Typography>
                        <ul>
                          <li>
                            <Typography variant="subtitle2">Online Payment Orders</Typography>
                            <Typography variant="subtitle2">
                              You have the right to a refund for a cancelled Order only if a Vendor has not yet accepted
                              your Order. Should you still decide to cancel your Order after it has been accepted by the
                              Vendor, you understand that no refunds (whether in whole or in part) will be issued to you
                              and you forfeit the delivery of your cancelled Order.
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="subtitle2">Cash-on-Delivery Orders </Typography>
                            <Typography variant="subtitle2">
                              You have the right to cancel your Order only if a Vendor has not yet accepted your Order.
                              Should you still decide to cancel your Order after it has been accepted by the Vendor, you
                              understand that you shall forfeit the delivery of your cancelled Order and
                              cash-on-delivery may be removed from your list of available payment methods for your
                              future orders.
                            </Typography>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      Enatega reserves the right to cancel any Order and/or suspend, deactivate or terminate your
                      enatega account in its sole discretion if it reasonably suspects or detects fraudulent behavior or
                      activity associated with your enatega account and/or with your Order.{" "}
                    </Typography>
                  </li>
                </ul>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Prices and Payments
                </Typography>
                <ul className={classes.bullet}>
                  <li>
                    <Typography variant="subtitle2">
                      Prices quoted on the Platform shall be displayed in the applicable country’s national currency and
                      subject to applicable tax. Prices and offers on the Platforms may vary from the prices and you
                      accept that offers offered by our Vendors (either on their own websites, mobile applications, or
                      at their brick-and-mortar outlets).
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">include TAX, VAT or such other equivalent tax; or</Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">exclude TAX, VAT or such other equivalent tax.</Typography>
                    <Typography variant="subtitle2" className={classes.MV2}>
                      A breakdown of the prices and additional charges are displayed before Checkout. When you place an
                      Order, you agree to all amounts, additional charges and the final ‘Total’ amount which is
                      displayed to you.{" "}
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">Delivery fees are chargeable on every Order unless:</Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      you opt to collect your Order directly from the Vendor (“<b>Pick-Up</b>”);
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      you have a valid promotional or discount voucher and apply it at Checkout; or
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">unless stated otherwise.</Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      Prices indicated on the Platforms are as at the time of each Order and may be subject to change.
                    </Typography>
                    <li>
                      <Typography variant="subtitle2">
                        You can choose to pay for an Order using any of the different payment methods offered on the
                        Platforms including:
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="subtitle2">
                        Our payment partners: Visa, Mastercard, American Express, Google Pay, PayPal, Apple Pay;
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="subtitle2">Cash-on-Delivery; or</Typography>
                    </li>
                  </li>
                  <li>
                    <Typography variant="subtitle2">Such other payment method we offer from time to time.</Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      If you have existing credit in your enatega account or valid promotional or discount vouchers, you
                      can use this pay for part or all of your Order as the case may be.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      After an Order is successfully placed, you will receive an email confirmation from us with your
                      Order receipt. Delivery fees will not appear in your Order receipt if you opt for Pick-Up.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">Payment Methods</Typography>
                    <Typography variant="subtitle2" className={classes.MV2}>
                      Enatega reserves the right to offer additional payment methods and/or remove existing payment
                      methods at anytime in its sole discretion. If you choose to pay using an online payment method,
                      the payment shall be processed by our third party payment service provider(s). With your consent,
                      your credit card / payment information will be stored with our third party payment service
                      provider(s) for future orders. Enatega does not store your credit card or payment information.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      You must ensure that you have sufficient funds on your credit and debit card to fulfil payment of
                      an Order. Insofar as required, enatega takes responsibility for payments made on our Platforms
                      including refunds, chargebacks, cancellations and dispute resolution, provided if reasonable and
                      justifiable and in accordance with these Terms.
                    </Typography>
                  </li>
                </ul>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Delivery, Pick-Up and Vendor Delivery
                </Typography>
                <ul className={classes.bullet}>
                  <li>
                    <Typography variant="subtitle2">Delivery Areas</Typography>
                    <Typography variant="subtitle2" className={classes.MV2}>
                      You understand that our Vendors offer their Goods in specific delivery areas and our Vendors vary
                      from delivery area to delivery area. By entering your delivery address on the Platforms, you will
                      see the Vendors that we make available to you at that time. Delivery areas may expand, shrink or
                      change depending on weather and traffic conditions and situations of force majeure.{" "}
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">Delivery Time</Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      Enatega shall deliver your Order to the delivery address provided by You. You may choose for your
                      Order to be delivered “ASAP” or scheduled for a specific time. An estimated delivery time will be
                      provided to you in your email confirmation but delivery times shall vary depending on factors that
                      are not controlled by us (e.g. order quantity, distance, time of day (peak periods), weather
                      conditions, traffic conditions, etc.). You can view the remaining delivery time of an Order when
                      you click on ‘My orders’ on the Platforms. You acknowledge that the delivery time we provide is
                      only an estimate and Orders may arrive earlier or later. To ensure that you do not miss a delivery
                      of an Order, you should ensure that either you or someone is at the delivery location to receive
                      the Order once an Order is placed. If your Order contains Alcohol or Tobacco (if applicable) and
                      you or the recipient is or appears to be below the legal age, or fails to provide a valid proof of
                      ID, enatega reserves the right not to deliver your Order to you.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">Unsuccessful or Failed Deliveries </Typography>
                  </li>
                  <ul className={classes.circle}>
                    <li>
                      <Typography variant="subtitle2">
                        In cases where we attempt to deliver an Order but we are unable to do so due to the reasons
                        caused by you, including but not limited to:
                      </Typography>
                      <ul>
                        <li>
                          <Typography variant="subtitle2">
                            no one was present or available to receive the Order; or
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="subtitle2">
                            customer was uncontactable despite attempts to reach the customer via the phone number
                            provided; or
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="subtitle2">
                            lack of appropriate or sufficient access to deliver the Order successfully;
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="subtitle2">
                            lack of a suitable or secure location to leave the Order; or
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="subtitle2">
                            in the case of Restricted Goods, customer did not meet the statutory age requirements or
                            delivery did not deem it safe or appropriate for the customer to receive the Restricted
                            Goods.
                          </Typography>
                        </li>
                      </ul>
                      <li>
                        <Typography variant="subtitle2">No-show Cancellations</Typography>
                        <Typography variant="subtitle2" className={classes.MV2}>
                          If you remain uncontactable or fail to receive the Order within ten (10) minutes from the time
                          the Order arrives at your delivery address, enatega reserves the right to cancel the Order
                          without refund or remedy to you.
                        </Typography>
                      </li>
                    </li>
                  </ul>
                  <li>
                    <Typography variant="subtitle2">Wrong Order, Missing Items, Defective Goods</Typography>
                    <Typography variant="subtitle2" className={classes.MV2}>
                      Upon receipt of your Order, if you discover that there are issues with your Order (e.g. wrong
                      order, defective order, or missing items) please contact customer support via one of the methods
                      indicated in Clause 1.3 above immediately. In some cases, enatega may request for photographic
                      proof and/or additional information to properly investigate the issue with your Order. If we
                      determine that the Order and/or Goods you received are not of satisfactory condition or quality,
                      we will compensate you for your Order or parts of your Order.
                    </Typography>
                    <li>
                      <Typography variant="subtitle2">Order Pick-Up</Typography>
                    </li>
                    <ul className={classes.circle}>
                      <li>
                        <Typography variant="subtitle2">
                          Where available, you will have the option of collecting your Order in-person directly from the
                          Vendor’s premises ("<b>Pick-Up</b>") instead of having the Order delivered to You. Your email
                          confirmation will indicate the time for you to Pick-Up the Order (“Collection Time”). The
                          Vendor will prepare the Order by the Collection Time. In some cases, a reasonable delay may be
                          expected. The Vendor agrees to hold the Order for you at the Vendor’s premises for no more
                          than a reasonable period of twenty (20) minutes from the Collection Time (“<b>Holding Time</b>
                          ”) and shall not be obliged to provide the Order to you if you fail to Pick-Up your Order
                          within the Holding Time.
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="subtitle2">
                          In the event of unreasonable delays in Pick-Up attributable to you, you bear the risk of any
                          damage or loss of Goods or any deterioration in quality or change in condition of the Goods
                          (e.g. changes in the temperature fit for consumption). In this case, you shall not be entitled
                          to a replacement, refund or replacement of the Goods. You alone are responsible for inspecting
                          the Goods/Order when you Pick-Up your Order and shall report any issues and/or defects to the
                          Vendor before leaving the Vendor’s premises.
                        </Typography>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Typography variant="subtitle2">Vendor Delivery</Typography>
                    <Typography variant="subtitle2" className={classes.MV2}>
                      In some cases, our Vendors will deliver the Order to you (“Vendor Delivery”). While we will use
                      reasonable efforts to provide prior notice to you on Vendor Delivery, this may not always be
                      possible. Where Vendor Delivery applies, we may ask you to contact the Vendor directly in the
                      event of issues or delays in your delivery. Enatega shall not be responsible in any way for Orders
                      or Goods that are delivered by Vendors.{" "}
                    </Typography>
                  </li>
                </ul>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Vouchers, Discounts and Promotions
                </Typography>
                <ul className={classes.bullet}>
                  <li>
                    <Typography variant="subtitle2">
                      From time to time, enatega may run marketing and promotional campaigns which offer voucher codes,
                      discounts, and other promotional offers to be used on the Platforms (“<b>Vouchers</b>”). Vouchers
                      are subject to validity periods, redemption periods, and in certain cases, may only be used once.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      Unless otherwise stated, Vouchers can only be used on our Platforms.{" "}
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">Vouchers cannot be exchanged for cash.</Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      Enatega reserves the right to void, discontinue or reject the use of any Voucher without prior
                      notice Individual restaurants terms & conditions apply
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">
                      We may exclude certain Vendors from the use of Vouchers at any time without prior notice to you.
                    </Typography>
                  </li>
                </ul>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Representations, Warranties and Limitation of Liabilities
                </Typography>
                <ul className={classes.bullet}>
                  <li>
                    <Typography variant="subtitle2">Representations and Warranties</Typography>
                    <Typography variant="subtitle2" className={classes.MV2}>
                      You acknowledge and agree that the content on the Platforms are provided on an “as is” and “as
                      available” basis, and that your use of or reliance upon the Platforms and any content, goods,
                      products or services accessed or obtained thereby is at your sole risk and discretion. While
                      enatega makes reasonable efforts to ensure the provision of the Platforms and the services we
                      offer, are available at all times, we do not warrant or represent that the Platforms shall be
                      provided in a manner which is secure, timely, uninterrupted, error-free, free of technical
                      difficulties, defects or viruses. Please expect temporary interruptions of the Platform due to
                      scheduled or regular system maintenance work, downtimes attributable to internet or electronic
                      communications or events of force majeure.
                    </Typography>
                    <Typography variant="subtitle2">Limitation of Liability</Typography>
                    <Typography variant="subtitle2" className={classes.MV2}>
                      To the extent permitted by law, enatega (which shall include its employees, directors, agents,
                      representatives, affiliates and parent company) exclude all liability (whether arising in
                      contract, in negligence or otherwise) for loss or damage which you or any third party may incur in
                      connection with our Platforms, our services, and any website linked to our Platforms and any
                      content or material posted on it. Your exclusive remedy with respect to your use of the Platforms
                      is to discontinue your use of the Platforms. The enatega entities, their agents, representatives,
                      and service providers shall not be liable for any indirect, special, incidental, consequential, or
                      exemplary damages arising from your use of the Platforms or for any other claim related in any way
                      to your use of the Platforms. These exclusions for indirect, special, consequential, and exemplary
                      damages include, without limitation, damages for lost profits, lost data, loss of goodwill, work
                      stoppage, work stoppage, computer failure, or malfunction, or any other commercial damages or
                      losses, even if the enatega entities, their agents, representatives, and service providers have
                      been advised of the possibility thereof and regardless of the legal or equitable theory upon which
                      the claim is based. Because some states or jurisdictions do not allow the exclusion or the
                      limitation of liability for consequential or incidental damages, in such states or jurisdictions,
                      enatega, the enatega entities, its agents, representatives and service providers' liability shall
                      be limited to the extent permitted by law.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="subtitle2">Vendor’s representations</Typography>
                    <Typography variant="subtitle2" className={classes.MV2}>
                      Enatega shall neither be liable for actions or omissions of the Vendor nor you in regard to
                      provision of the Goods and where Vendor Delivery applies to your Order. Enatega does not assume
                      any liability for the quantity, quality, condition or other representations of the Goods and/or
                      services provided by Vendors or guarantee the accuracy or completeness of the information
                      (including menu information, photos and images of the Goods) displayed on the Vendor’s
                      listing/offering on the Platform. Nothing in these Terms shall exclude Vendor’s liability for
                      death or personal injury arising from Vendor’s gross negligence or willful misconduct.
                    </Typography>
                  </li>
                </ul>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Vendor Liability
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  Vendors are responsible for the preparation, condition and quality of Goods. In cases of Vendor
                  Delivery, Vendors are responsible for delivery of the Goods and/or Orders. Enatega shall not be liable
                  for any loss or damage arising from your contractual relationship with the Vendor.
                </Typography>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Personal Data (Personal Information) Protection
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  You agree and consent to enatega and any of its affiliate companies collecting, using, processing and
                  disclosing your Personal Data in accordance with these Terms and as further described in our Privacy
                  Policy. Our Privacy Policy is available via the links on our Platforms, and shall form a part of these
                  Terms.
                </Typography>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Indemnity
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  You agree to indemnify, defend, hold harmless enatega, its directors, officers, employees,
                  representatives, agents, and affiliates, from any and all third party claims, liability, damages
                  and/or costs (including but not limited to, legal fees) arising from your use of the Platforms or your
                  breach of these Terms.
                </Typography>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Third Party Links and Websites
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  The Platforms may contain links to other third party websites and by clicking on these links, you
                  agree to do so at your own risk. Enatega does not control or endorse these third party websites or
                  links and shall not be responsible for the content of these linked pages. Enatega accepts no liability
                  or responsibility for any loss or damage which may be suffered by you in relation to your access and
                  use of these third party links and websites.
                </Typography>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Termination
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  Enatega has the right to terminate, suspend or delete your account and access to the Platforms,
                  including any delivery service we provide to you in respect of an Order, for any reason, including,
                  without limitation, if enatega, in its sole discretion, considers your use to be unacceptable, or in
                  the event of any breach by you of the Terms. Enatega may, but shall be under no obligation to, provide
                  you a warning prior to termination of your use of the Websites.
                </Typography>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Amendments
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  Enatega may amend these Terms at any time in its sole discretion. The amended Terms shall be effective
                  immediately upon posting and you agree to the new Terms by continued use of the Platforms. It is your
                  responsibility to check the Terms regularly. If you do not agree with the amended Terms, whether in
                  whole or in part, you must stop using the Platforms immediately.
                </Typography>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Severability
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  If any provision of these Terms of Use is found to be invalid by any court having competent
                  jurisdiction, the invalidity of such provision shall not affect the validity of the remaining
                  provisions of these Terms of Use, which shall remain in full force and effect. No waiver of any
                  provision in these Terms of Use shall be deemed a further or continuing waiver of such provision or
                  any other provision.
                </Typography>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Governing Law
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  These Terms shall be governed and construed in accordance with the laws of the country / courts of
                  jurisdiction.
                </Typography>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Contact Us
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  If you wish to contact us regarding any questions or comments you may have, please send an email to
                  our customer support email or via our in-app customer support chat feature.
                </Typography>
              </li>
              <li>
                <Typography variant="subtitle2" className={classes.boldText}>
                  Prevailing Language
                </Typography>
                <Typography variant="subtitle2" className={classes.MV3}>
                  In the event of a dispute as to the Terms, the English version shall prevail. The English language
                  version of these Terms shall control in all respects and shall prevail in case of any inconsistencies
                  with translated versions.
                </Typography>
              </li>
            </ol>
          </Grid>
        </Grid>
      </Grid>
      <Footer />
    </Grid>
  );
}

export default React.memo(Terms);
