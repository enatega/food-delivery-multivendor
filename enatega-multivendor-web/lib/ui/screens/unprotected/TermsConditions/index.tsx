import React from "react";
import Image from "next/image";
import OnePara from "@/lib/ui/screen-components/un-protected/TermsConditions/OnePara";

const ParasData = [
  {
    number: "1.",
    head: "TERMS OF USE",
    paras: [
      "These Terms of Use (“Terms”) govern your use of the websites and mobile applications provided by enatega (collectively the “Platforms”). Please read these Terms carefully. By accessing and using the Platforms, you agree that you have read, understood and accepted the Terms including any additional terms and conditions and any policies referenced herein, available on the Platforms or available by hyperlink. If you do not agree or fall within the Terms, please do not use the Platforms.",
      "The Platforms may be used by (i) natural persons who have reached 18 years of age and (ii) corporate legal entities, e.g companies. Where applicable, these Terms shall be subject to country-specific provisions as set out herein.",
      "Users below the age of 18 must obtain consent from parent(s) or legal guardian(s), who by accepting these Terms shall agree to take responsibility for your actions and any charges associated with your use of the Platforms and/or purchase of Goods. If you do not have consent from your parent(s) or legal guardian(s), you must stop using/accessing the Platforms immediately.",
      "Enatega reserves the right to change or modify these Terms (including our policies which are incorporated into these Terms) at any time. You are strongly recommended to read these Terms regularly. You will be deemed to have agreed to the amended Terms by your continued use of the Platforms following the date on which the amended Terms are posted.",
    ],
  },

  {
    number: "2.",
    head: "Use of the Platforms and enatega Account",
    paras: [
      "You will need to register for a enatega account for you to use the Platform. When you register for a enatega account we will ask you to provide your personal information including a valid email address, a mobile phone number and a unique password. To purchase an Order, depending on which payment method you opt for, you may need to provide us with your credit card details. Your unique password should not be shared with anyone and you agree to keep it secret at all times. You are solely responsible for keeping your password safe. Save for cases of fraud or abuse which are not your fault, you accept that all Orders placed under your enatega account are your sole responsibility.",
      "enatega shall not be liable for Orders that encounter delivery issues due to incomplete, incorrect or missing information provided by you. You are obliged to provide information that is complete, accurate and truthful for the proper processing of the Order, including your delivery address and contact information.",
      "If you wish to delete your enatega account, please send us an email requesting the same. We may restrict, suspend or terminate your enatega account and/or use of the Platforms, if we reasonably believe that:",
      "someone other than you is using your enatega account; or where you are suspected or discovered to have been involved in any activity or conduct that is in breach of these Terms, our policies and guidelines, or involved in activity or conduct which we deem in our sole discretion to be an abuse of the Platforms.",
    ],
  },
  {
    number: "3.",
    head: "Intellectual Property",
    paras: [
      "All trademarks, logos, images, and service marks, including these Terms as displayed on the Platforms or in our marketing material, whether registered or unregistered, are the intellectual property of enatega and/or third parties who have authorised us with the use (collectively the “Trademarks”). You may not use, copy, reproduce, republish, upload, post, transmit, distribute, or modify these Trademarks in any way without our prior express written consent. The use of enatega's trademarks on any other website not approved by us is strictly prohibited. Enatega will aggressively enforce its intellectual property rights to the fullest extent of the law, including criminal prosecution. Enatega neither warrants nor represents that your use of materials displayed on the Platforms will not infringe rights of third parties not owned by or affiliated with enatega. Use of any materials on the Platforms is at your own risk.",
    ],
  },
  {
    number: "4. ",
    head: "Vendor Liability",
    paras: [
      "Vendors are responsible for the preparation, condition and quality of Goods. In cases of Vendor Delivery, Vendors are responsible for delivery of the Goods and/or Orders. Enatega shall not be liable for any loss or damage arising from your contractual relationship with the Vendor.",
    ],
  },
  {
    number: "5.",
    head: "Personal Data (Personal Information) Protection",
    paras: [
      "You agree and consent to enatega and any of its affiliate companies collecting, using, processing and disclosing your Personal Data in accordance with these Terms and as further described in our Privacy Policy. Our Privacy Policy is available via the links on our Platforms, and shall form a part of these Terms.",
    ],
  },
  {
    number: "6.",
    head: "Indemnity",
    paras: [
      "You agree to indemnify, defend, hold harmless enatega, its directors, officers, employees, representatives, agents, and affiliates, from any and all third party claims, liability, damages and/or costs (including but not limited to, legal fees) arising from your use of the Platforms or your breach of these Terms.",
    ],
  },
  {
    number: "7.",
    head: "Third Party Links and Websites",
    paras: [
      "The Platforms may contain links to other third party websites and by clicking on these links, you agree to do so at your own risk. Enatega does not control or endorse these third party websites or links and shall not be responsible for the content of these linked pages. Enatega accepts no liability or responsibility for any loss or damage which may be suffered by you in relation to your access and use of these third party links and websites.",
    ],
  },
  {
    number: "8.",
    head: "Termination",
    paras: [
      "Enatega has the right to terminate, suspend or delete your account and access to the Platforms, including any delivery service we provide to you in respect of an Order, for any reason, including, without limitation, if enatega, in its sole discretion, considers your use to be unacceptable, or in the event of any breach by you of the Terms. Enatega may, but shall be under no obligation to, provide you a warning prior to termination of your use of the Websites.",
    ],
  },
  {
    number: "9.",
    head: "Amendments",
    paras: [
      "Enatega may amend these Terms at any time in its sole discretion. The amended Terms shall be effective immediately upon posting and you agree to the new Terms by continued use of the Platforms. It is your responsibility to check the Terms regularly. If you do not agree with the amended Terms, whether in whole or in part, you must stop using the Platforms immediately.Severability",
    ],
  },
  {
    number: "10.",
    head: "Severability",
    paras: [
      "If any provision of these Terms of Use is found to be invalid by any court having competent jurisdiction, the invalidity of such provision shall not affect the validity of the remaining provisions of these Terms of Use, which shall remain in full force and effect. No waiver of any provision in these Terms of Use shall be deemed a further or continuing waiver of such provision or any other provision.",
    ],
  },
  {
    number: "11.",
    head: "Governing Law",
    paras: [
      "These Terms shall be governed and construed in accordance with the laws of the country / courts of jurisdiction.Contact",
    ],
  },
  {
    number: "12.",
    head: "Contact Us",
    paras: [
      "If you wish to contact us regarding any questions or comments you may have, please send an email to our customer support email or via our in-app customer support chat feature.",
    ],
  },
  {
    number: "13.",
    head: "Prevailing Language",
    paras: [
      "In the event of a dispute as to the Terms, the English version shall prevail. The English language version of these Terms shall control in all respects and shall prevail in case of any inconsistencies with translated versions.",
    ],
  },
];

const ListDatas = [
  {
    number: "14.",
    head: "Restrictions",
    paras: [],
    list: [
      {
        text: 'What we do Through our Platforms, enatega links you to the vendors (“Vendors”) for you to order a variety of goods including prepared meals, non-prepared food and miscellaneous non-food items (hereinafter collectively referred to as "Goods") to be delivered to you. When you place an order for Goods from our Vendors (“Order”), enatega acts as an agent on behalf of that Vendor to facilitate, process and conclude the order and subsequently for either us or the Vendor to deliver your Order to you. Vendors may be owned and operated by third party vendors, our affiliate companies, or us.',
        subList: [],
      },
      {
        text: "How to contact usFor customer support, you may reach out to us via email or through our in-app customer support chat feature.",
        subList: [],
      },
    ],
  },

  {
    number: "15.",
    head: "Enatega",
    paras: [
      "Activities Prohibited on the PlatformsIn processing your order we may send your information to credit reference and fraud prevention agencies.The following is a non-exhaustive list of the types of conduct that are illegal or prohibited on the Platforms. Enatega reserves the right to investigate and take appropriate legal action against anyone who, in enatega's sole discretion, engages in any of the prohibited activities. Prohibited activities include, but are not limited to the following:",
    ],
    list: [
      {
        text: "using the Platforms for any purpose in violation of local, state, or federal laws or regulations",
        subList: [],
      },
      {
        text: "posting any content that infringes the intellectual property rights, privacy rights, publicity rights, trade secret rights, or any other rights of any party",
        subList: [],
      },
      {
        text: "posting content that is unlawful, obscene, defamatory, threatening, harassing, abusive, slanderous, hateful, or embarrassing to any other person or entity as determined by enatega in its sole discretion or pursuant to local community standards",
        subList: [],
      },
      {
        text: "posting content that constitutes cyber-bullying, as determined by enatega in its sole discretion",
        subList: [],
      },
      {
        text: "posting content that depicts any dangerous, life-threatening, or otherwise risky behavior",
        subList: [],
      },
      {
        text: "posting telephone numbers, street addresses, or last names of any person",
        subList: [],
      },
      {
        text: "posting URLs to external websites or any form of HTML or programming code",
        subList: [],
      },
      {
        text: "posting anything that may be “spam,” as determined by enatega in its sole discretion",
        subList: [],
      },
      {
        text: "impersonating another person when posting content",
        subList: [],
      },
      {
        text: "harvesting or otherwise collecting information about others, including e-mail addresses, without their consent",
        subList: [],
      },
      {
        text: "allowing any other person or entity to use your identification for posting or viewing comments;",
        subList: [],
      },
      {
        text: "harassing, threatening, stalking, or abusing any person on the Platforms",
        subList: [],
      },
      {
        text: "engaging in any other conduct that restricts or inhibits any other person from using or enjoying the Websites, or which, in the sole discretion of enatega, exposes enatega or any of its customers, suppliers, or any other parties to any liability or detriment of any type; or encouraging other people to engage in any prohibited activities as described herein.",
        subList: [],
      },
      {
        text: "enatega reserves the right but is not obligated to do any or all of the following:",
        subList: [],
      },
      {
        text: "investigate an allegation that any content posted on the Platforms does not conform to these Terms and determine in its sole discretion to remove or request the removal of the content",
        subList: [],
      },
      {
        text: "remove content which is abusive, illegal, or disruptive, or that otherwise fails to conform with these Terms",
        subList: [],
      },
      {
        text: "suspend or terminate a user’s access to the Platforms or their enatega Account upon any breach of these Terms",
        subList: [],
      },
      {
        text: "monitor, edit, or disclose any content on the Platforms; and edit or delete any content posted on the Platforms, regardless of whether such content violates these standards",
        subList: [],
      },
    ],
  },

  {
    number: "16.",
    head: "Restrictions on Goods",
    paras: [""],
    list: [
      {
        text: "Some of the Goods we offer on our Platforms are subject to restrictions for purchase (“Restricted Goods”)",
        subList: [],
      },
      {
        text: "Alcohol / Alcoholic Products (“Alcohol”) To purchase Alcohol, you must be of the statutory legal age. Enatega, the Vendor and their delivery riders, as the case may be, reserve the right in their sole discretion",
        subList: [],
      },
      {
        text: "to ask for valid proof of age (e.g. ID card) to any persons before they deliver Alcohol",
        subList: [],
      },
      {
        text: "to refuse delivery if you are unable to prove you are of legal age; and/or to refuse delivery to any persons for any reason whatsoever.",
        subList: [],
      },
      { text: "Cigarettes/Tobacco Products (“Tobacco”)", subList: [] },
      {
        text: "We may offer Tobacco on some of our Platforms where the laws allow. By offering Tobacco for sale on our Platforms, we do not purport to advertise, promote or encourage the purchase or use of Tobacco in any way.",

        subList: [],
      },
      {
        text: "To purchase Tobacco, you must be of the statutory legal age. Enatega, the Vendor and their delivery riders, as the case may be, reserve the right in their sole discretion:",
        subList: [
          "to ask for valid proof of age (e.g. ID card) to any persons before they deliver Tobacco",
          "to refuse delivery if you are unable to prove you are of legal age; and/or to refuse delivery to any persons for any reason whatsoever",
        ],
      },
      {
        text: "Any offer for any Alcohol and Tobacco made on the Platforms is void when it is prohibited by law.",
        subList: [],
      },
    ],
  },

  {
    number: "17.",
    head: "Orders",
    paras: [""],

    list: [
      {
        text: "When you place an Order with enatega, enatega will confirm your order by sending you a confirmation email containing the Order receipt. Where applicable, Orders will include delivery fees and any applicable tax (e.g. goods and services tax, value-added tax, etc.).",
        subList: [],
      },
      {
        text: "Minimum Order Value - Some of our Vendors require a minimum order value (“MOV”) before an Order can be placed and delivered to you. Where an applicable Order fails to meet the MOV, you will have the option of paying the difference to meet the MOV or to add more Goods to your Order.",
        subList: [],
      },
      {
        text: "Special Instructions – enatega and the Vendor (as the case may be) reasonably endeavour to comply with your special instructions for an Order. However in some cases where this is not feasible, possible or commercially reasonable, enatega and/or the Vendor reserve the right to proceed to prepare the Order in accordance with standard operating procedures. Neither enatega nor the Vendor shall be responsible to replace or refund an Order which does not conform to special instructions provided by you",
        subList: [],
      },
      {
        text: "Allergens – enatega is not obligated to provide ingredient information or allergen information on the Platforms. Further, enatega does not guarantee that the Goods sold by Vendors are free of allergens. If you have allergies, allergic reactions or dietary restrictions and requirements, please contact the Vendor before placing an Order on our Platforms.",
        subList: [],
      },
      {
        text: "Please note that your Order may be subject to additional terms and conditions provided by the Vendor.",
        subList: [],
      },
    ],
  },

  {
    number: "18.",
    head: "Prices and Payments",
    paras: [
      "Prices quoted on the Platform shall be displayed in the applicable country’s national currency and subject to applicable tax. Prices and offers on the Platforms may vary from the prices and you accept that offers offered by our Vendors (either on their own websites, mobile applications, or at their brick-and-mortar outlets).",
      "A breakdown of the prices and additional charges are displayed before Checkout. When you place an Order, you agree to all amounts, additional charges and the final ‘Total’ amount which is displayed to you.",
      "Prices indicated on the Platforms are as at the time of each Order and may be subject to change.",
      "After an Order is successfully placed, you will receive an email confirmation from us with your Order receipt. Delivery fees will not appear in your Order receipt if you opt for Pick-Up.",
    ],
    list: [
      { text: "Prices may include TAX, VAT or such other equivalent tax; or" },
      { text: "Prices may exclude TAX, VAT or such other equivalent tax." },
      { text: "Delivery fees are chargeable on every Order unless:" },
      {
        text: "You opt to collect your Order directly from the Vendor ('Pick-Up');",
      },
      {
        text: "You have a valid promotional or discount voucher and apply it at Checkout  or unless stated otherwise.",
      },
      {
        text: "You can choose to pay for an Order using any of the different payment methods offered on the Platforms including:",
      },
      {
        text: "Our payment partners: Visa, Mastercard, American Express, Google Pay, PayPal, Apple Pay;",
      },
      { text: "Cash-on-Delivery; or" },
      { text: "Such other payment method we offer from time to time." },
      {
        text: "If you have existing credit in your Enatega account or valid promotional or discount vouchers, you can use this to pay for part or all of your Order as the case may be.",
      },
    ],
  },
  {
    number: "19.",
    head: "Delivery, Pick-Up and Vendor Delivery",
    paras: [
      "You understand that our Vendors offer their Goods in specific delivery areas and our Vendors vary from delivery area to delivery area. By entering your delivery address on the Platforms, you will see the Vendors that we make available to you at that time. Delivery areas may expand, shrink or change depending on weather and traffic conditions and situations of force majeure.",
      "Enatega shall deliver your Order to the delivery address provided by You. You may choose for your Order to be delivered “ASAP” or scheduled for a specific time. An estimated delivery time will be provided to you in your email confirmation but delivery times shall vary depending on factors that are not controlled by us (e.g. order quantity, distance, time of day (peak periods), weather conditions, traffic conditions, etc.). You can view the remaining delivery time of an Order when you click on ‘My orders’ on the Platforms. You acknowledge that the delivery time we provide is only an estimate and Orders may arrive earlier or later. To ensure that you do not miss a delivery of an Order, you should ensure that either you or someone is at the delivery location to receive the Order once an Order is placed. If your Order contains Alcohol or Tobacco (if applicable) and you or the recipient is or appears to be below the legal age, or fails to provide a valid proof of ID, enatega reserves the right not to deliver your Order to you.",
      "Where available, you will have the option of collecting your Order in-person directly from the Vendor’s premises ('Pick-Up') instead of having the Order delivered to You. Your email confirmation will indicate the time for you to Pick-Up the Order ('Collection Time'). The Vendor will prepare the Order by the Collection Time. In some cases, a reasonable delay may be expected. The Vendor agrees to hold the Order for you at the Vendor’s premises for no more than a reasonable period of twenty (20) minutes from the Collection Time ('Holding Time') and shall not be obliged to provide the Order to you if you fail to Pick-Up your Order within the Holding Time.",
      "In the event of unreasonable delays in Pick-Up attributable to you, you bear the risk of any damage or loss of Goods or any deterioration in quality or change in condition of the Goods (e.g. changes in the temperature fit for consumption). In this case, you shall not be entitled to a replacement, refund or replacement of the Goods. You alone are responsible for inspecting the Goods/Order when you Pick-Up your Order and shall report any issues and/or defects to the Vendor before leaving the Vendor’s premises.",
      "In some cases, our Vendors will deliver the Order to you ('Vendor Delivery'). While we will use reasonable efforts to provide prior notice to you on Vendor Delivery, this may not always be possible. Where Vendor Delivery applies, we may ask you to contact the Vendor directly in the event of issues or delays in your delivery. Enatega shall not be responsible in any way for Orders or Goods that are delivered by Vendors.",
    ],
    list: [
      { text: "Unsuccessful or Failed Deliveries may occur due to:" },
      { text: "No one being present or available to receive the Order;" },
      {
        text: "Customer being uncontactable despite attempts to reach via the provided phone number;",
      },
      {
        text: "Lack of appropriate or sufficient access to deliver the Order successfully;",
      },
      { text: "Lack of a suitable or secure location to leave the Order;" },
      {
        text: "In the case of Restricted Goods, the customer did not meet the statutory age requirements or it was deemed unsafe to deliver.",
      },
      { text: "No-show Cancellations may happen if:" },
      {
        text: "You remain uncontactable or fail to receive the Order within 10 minutes from its arrival at your delivery address. Enatega may cancel the Order without refund or remedy.",
      },
      { text: "Wrong Order, Missing Items, Defective Goods:" },
      {
        text: "Contact customer support immediately via a method listed in Clause 1.3.",
      },
      {
        text: "Enatega may request photographic proof or additional information for investigation.",
      },
      {
        text: "If the Order is deemed unsatisfactory, Enatega will compensate for all or part of your Order.",
      },
    ],
  },
  {
    number: "20.",
    head: "Vouchers, Discounts and Promotions",
    paras: [
      "From time to time, Enatega may run marketing and promotional campaigns which offer voucher codes, discounts, and other promotional offers to be used on the Platforms ('Vouchers'). Vouchers are subject to validity periods, redemption periods, and in certain cases, may only be used once.",
    ],
    list: [
      {
        text: "Unless otherwise stated, Vouchers can only be used on our Platforms.",
      },
      { text: "Vouchers cannot be exchanged for cash." },
      {
        text: "Enatega reserves the right to void, discontinue or reject the use of any Voucher without prior notice.",
      },
      { text: "Individual restaurant terms & conditions apply." },
      {
        text: "We may exclude certain Vendors from the use of Vouchers at any time without prior notice to you.",
      },
    ],
  },

  {
    number: "20.",
    head: "Representations, Warranties and Limitation of Liabilities",
    paras: [
      "You acknowledge and agree that the content on the Platforms are provided on an “as is” and “as available” basis, and that your use of or reliance upon the Platforms and any content, goods, products or services accessed or obtained thereby is at your sole risk and discretion. While Enatega makes reasonable efforts to ensure the provision of the Platforms and the services we offer are available at all times, we do not warrant or represent that the Platforms shall be provided in a manner which is secure, timely, uninterrupted, error-free, free of technical difficulties, defects or viruses. Please expect temporary interruptions of the Platform due to scheduled or regular system maintenance work, downtimes attributable to internet or electronic communications, or events of force majeure.",

      "To the extent permitted by law, Enatega (which shall include its employees, directors, agents, representatives, affiliates, and parent company) exclude all liability (whether arising in contract, in negligence or otherwise) for loss or damage which you or any third party may incur in connection with our Platforms, our services, and any website linked to our Platforms and any content or material posted on it. Your exclusive remedy with respect to your use of the Platforms is to discontinue your use of the Platforms. The Enatega entities, their agents, representatives, and service providers shall not be liable for any indirect, special, incidental, consequential, or exemplary damages arising from your use of the Platforms or for any other claim related in any way to your use of the Platforms. These exclusions for indirect, special, consequential, and exemplary damages include, without limitation, damages for lost profits, lost data, loss of goodwill, work stoppage, computer failure, or malfunction, or any other commercial damages or losses, even if the Enatega entities, their agents, representatives, and service providers have been advised of the possibility thereof and regardless of the legal or equitable theory upon which the claim is based. Because some states or jurisdictions do not allow the exclusion or the limitation of liability for consequential or incidental damages, in such states or jurisdictions, Enatega, the Enatega entities, its agents, representatives and service providers' liability shall be limited to the extent permitted by law.",

      "Enatega shall neither be liable for actions or omissions of the Vendor nor you in regard to provision of the Goods and where Vendor Delivery applies to your Order. Enatega does not assume any liability for the quantity, quality, condition or other representations of the Goods and/or services provided by Vendors or guarantee the accuracy or completeness of the information (including menu information, photos and images of the Goods) displayed on the Vendor’s listing/offering on the Platform. Nothing in these Terms shall exclude Vendor’s liability for death or personal injury arising from Vendor’s gross negligence or willful misconduct.",
    ],
    list: [],
  },
];

const TermsConditions = () => {
  return (
    <div>
      <div className="relative w-screen h-[400px]">
        <Image
          alt="image"
          src="https://images.deliveryhero.io/image/foodpanda/cms-hero.jpg?width=2000&height=500"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-white text-3xl md:text-5xl font-bold text-center">
            Enatega Terms and Conditions
          </h1>
        </div>
      </div>

      <div className="w-[90%] mx-auto">
        {ParasData?.map((item) => {
          return <OnePara Para={item} key={item.head} />;
        })}
        {ListDatas?.map((item) => {
          return <OnePara Para={item} key={item.head} />;
        })}
      </div>
    </div>
  );
};

export default TermsConditions;
