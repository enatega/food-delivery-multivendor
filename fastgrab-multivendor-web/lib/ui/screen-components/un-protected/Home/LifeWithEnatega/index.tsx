// libraries
import React from "react";

// Components
import HomeCard from "@/lib/ui/useable-components/Home-Card";
import MoveableCard from "@/lib/ui/useable-components/Moveable-Card";

// images
import deliveryFee from "@/public/assets/images/png/deliveryFee.webp";
import ZeroDelivery from "@/public/assets/images/png/0delivery.webp";
import RestaurantApp from "@/public/assets/images/png/restaurantApp.png"
import RiderApp from "@/public/assets/images/png/riderApp.png"
import CustomerApp from "@/public/assets/images/png/CustomerApp.png"
import { useTranslations } from "next-intl";


const EnategaInfo: React.FC = () => {
  const t = useTranslations();
  return (
    <div className="mt-[80px] mb-[80px]">
      <div className="flex flex-col justify-center items-center my-[20px]">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold m-4">
          {t("InfoCardHomeScreen.tagLine")}
        </h1>
        <p className="m-4 text-xl md:text-2xl lg:text-3xl">
                    {t("InfoCardHomeScreen.subHeading")}

        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
        <MoveableCard
          image={deliveryFee}
          heading={t("InfoCardHomeScreen.Title1")}

          subText={t("InfoCardHomeScreen.SubText1")}

        />
        <MoveableCard
          image={ZeroDelivery}
          heading={t("InfoCardHomeScreen.Title2")}
          subText={t("InfoCardHomeScreen.SubText2")}

        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-[30px] mb-[30px]">
        <HomeCard image={CustomerApp} heading={t('Apps.heading1')} subText={t('Apps.subHeading1')} link={"https://play.google.com/store/apps/details?id=com.enatega.multivendor&hl=en"}/>
        <HomeCard image={RestaurantApp} heading={t('Apps.heading2')} subText={t('Apps.subHeading2')} link={"https://play.google.com/store/apps/details?id=multivendor.enatega.restaurant&hl=en"} />
        <HomeCard image={RiderApp} heading={t('Apps.heading3')} subText={t('Apps.subHeading3')} link={"https://play.google.com/store/apps/details?id=com.enatega.multirider&hl=en"}/>
      </div>
    </div>
  );
};

export default EnategaInfo;
