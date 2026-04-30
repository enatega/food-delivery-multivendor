"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

// components
import EmailForm from '@/lib/ui/useable-components/RiderandRestaurantsInfos/Form';
import Heading from '@/lib/ui/useable-components/RiderandRestaurantsInfos/Heading/Heading';
import SideContainers from '@/lib/ui/useable-components/RiderandRestaurantsInfos/SideContainers/SideCard';
import WhyCardsList from '@/lib/ui/useable-components/RiderandRestaurantsInfos/WhyCards/WhyCardsList';
import WhyChoose from '@/lib/ui/useable-components/RiderandRestaurantsInfos/WhyChoose';
import StartingImage from '@/lib/ui/useable-components/RiderandRestaurantsInfos/StartingImage/StartingImage';

// images
import WorldClassCustomers from "@/public/assets/images/png/WorldClassCustomer.webp";
import enategaApp from "@/public/assets/images/png/enategaApp.png";
import growth from "@/public/assets/images/png/Growth.png";
import getMoreOrders from "@/public/assets/images/png/GetMoreOrders.png";
import deliverMoreCustomers from "@/public/assets/images/png/deliverToCustomer.png";
import restaurantBanner from "@/public/assets/images/png/restaurant-banner.png";

const RestInfo = () => {
  const t = useTranslations();

  const cards = [
    {
      heading: t("grow_with_Enatega"),
      text: t("access_active_customer_base"),
      image: growth,
      color: "#f7fbfe"
    },
    {
      heading: t("get_more_orders"),
      text: t("increase_orders_reaching_customers"),
      image: getMoreOrders,
      color: "#faf7fc"
    },
    {
      heading: t("deliver_to_more_customers"),
      text: t("rider_partners_deliver_in_30_minutes"),
      image: deliverMoreCustomers,
      color: "#fbfbfb"
    }
  ];

  const sideCards = [
    {
      image: enategaApp,
      heading: t("how_Enatega_works"),
      subHeading: t("how_Enatega_works_desc"),
      right: false
    },
    {
      image: WorldClassCustomers,
      heading: t("world_class_customer_support"),
      subHeading: t("world_class_customer_support_desc"),
      right: true
    }
  ];

  return (
    <div className='w-screen h-auto'>
      <Heading
        heading={t("reach_more_customers_and_grow_your_business_with_Enatega")}
        subHeading={t("partner_with_Enatega_to_create_more_sales")}
      />
      <StartingImage image={restaurantBanner} />
      <WhyChoose
        heading={t("why_deliver_with_Enatega")}
        subHeading={t("rider_partner_earn_money_flexible_schedule")}
      />
      <WhyCardsList cards={cards} />
      <SideContainers sideCards={sideCards} />
      <hr className='w-[30%] ml-12 border-4 border-primary-color my-12 rounded' />
      <EmailForm
        heading={t("become_a_restaurant")}
        role={t("vendor_registration")}
      />
    </div>
  );
};

export default RestInfo;
