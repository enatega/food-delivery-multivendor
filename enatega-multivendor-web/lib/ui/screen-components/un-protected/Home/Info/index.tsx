import MoveableCard from "@/lib/ui/useable-components/Moveable-Card";
import React from "react";
import TranparentButton from "@/lib/ui/useable-components/Home-Buttons/TranparentButton";

import riderImg from '@/public/assets/images/png/riderImg.webp'
import reachNewCustomers from '@/public/assets/images/png/reachNewCustomers.jpg'
import { useTranslations } from "next-intl";
const Info = () => {
  const t = useTranslations()
  const CourierButton = <TranparentButton text={t("for_riders")} link={"/rider"} />;
  const MerchantButton = <TranparentButton text={t("for_rest")} link={"/restaurantInfo"}/>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <MoveableCard
        button={CourierButton}
        image={
          riderImg
        }
        heading={t('MoveableCardHomeScreen.title1')}
        subText={
          t('MoveableCardHomeScreen.subText1')
        }
      />
      <MoveableCard
        button={MerchantButton}
        image={
         reachNewCustomers
        }
        heading={t('MoveableCardHomeScreen.title2')}
        subText={
          t('MoveableCardHomeScreen.subText2')
        }
      />
    </div>
  );
};

export default Info;
