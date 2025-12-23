import MoveableCard from "@/lib/ui/useable-components/Moveable-Card";
import TinyTiles from "@/lib/ui/useable-components/tinyTiles";
import React from "react";
import TranparentButton from "@/lib/ui/useable-components/Home-Buttons/TranparentButton";

import competetiveEarning from "@/public/assets/images/png/competitiveEarning.webp"
import flexibleHours from "@/public/assets/images/png/flexibleHours.webp"

import Banner2 from "@/public/assets/images/png/Banner2.webp"
import { useTranslations } from "next-intl";

import reachNewCustomersImg from "@/public/assets/images/png/reachNewCustomers.jpg"

const Couriers: React.FC = () => {
  const t = useTranslations();
  const EarningButton = <TranparentButton text={t('learn_more_btn')} link={'restaurantInfo'} />;
  const FLexiblegButton = <TranparentButton text={t('learn_more_btn')} link={'rider'} />;
  const EarnWhereButton = <TranparentButton text={t('get_started_btn')} link={'rider'} />;
  return (
    <div className="my-[60px]">
      <MoveableCard
        image={
          Banner2
        }
        heading={t('RidersInfoCards.heading1')}
        subText={t('RidersInfoCards.subHeading1')}
        button={EarnWhereButton}
        middle={true}
      />
      <div className="grid gird-cols-1 md:grid-cols-2 my-[30px] gap-8">
        <MoveableCard
          image={competetiveEarning}
          heading={t('RidersInfoCards.heading2')}
          subText={
            t('RidersInfoCards.subHeading2')
          }
          button={EarningButton}
        />
        <MoveableCard
          image={flexibleHours}
          heading={t('RidersInfoCards.heading3')}
          subText={
            t('RidersInfoCards.subHeading3')
          }
          button={FLexiblegButton}
        />
      </div>

      <TinyTiles
        image={
          reachNewCustomersImg.src
        }
        heading={t('RidersInfoCards.TinyTile.heading')}
        buttonText={t('RidersInfoCards.TinyTile.subText')}
        backColor={"#eaf7fc"}
        link={"/rider"}
      />
    </div>
  );
};

export default Couriers;
