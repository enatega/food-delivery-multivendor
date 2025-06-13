import MoveableCard from "@/lib/ui/useable-components/Moveable-Card";
import TinyTiles from "@/lib/ui/useable-components/tinyTiles";
import React from "react";
import TranparentButton from "@/lib/ui/useable-components/Home-Buttons/TranparentButton";

import competetiveEarning  from "@/public/assets/images/png/competitiveEarning.webp"
import flexibleHours  from "@/public/assets/images/png/flexibleHours.webp"

import Banner2 from "@/public/assets/images/png/Banner2.webp"

const Couriers:React.FC = () => {
  const EarningButton = <TranparentButton text={"Learn More"} link={'restaurantInfo'} />;
  const FLexiblegButton = <TranparentButton text={"Learn More"} link={'rider'} />;
  const EarnWhereButton = <TranparentButton text={"Get started"} link={'rider'} />;
  return (
    <div className="my-[60px]">
      <MoveableCard
        image={
          Banner2
        }
        heading={"For Riders"}
        subText={"EARN WHEN AND WHERE YOU WANT"}
        button={EarnWhereButton}
        middle={true}
      />
      <div className="grid gird-cols-1 md:grid-cols-2 my-[30px] gap-8">
        <MoveableCard
          image={competetiveEarning}
          heading={"Competitive earnings"}
          subText={
            "The more you deliver, the more money you can earn. Get paid per delivery and for distance covered."
          }
          button={EarningButton}
        />
        <MoveableCard
          image={flexibleHours}
          heading={"Flexible hours"}
          subText={
            "Choose your own hours and set your own schedule. Plus, no delivery experience required."
          }
          button={FLexiblegButton}
        />
      </div>

      <TinyTiles
        image={
          "https://images.ctfassets.net/23u853certza/QScF4OasY8MBTmzrKJfv1/9afd4f8a826825cc097fb36606a81963/3DCourier.webp?w=200&q=90&fm=webp"
        }
        heading={"Become a Enatega rider"}
        buttonText={"For riders"}
        backColor={"#eaf7fc"}
        link={"/rider"}
      />
    </div>
  );
};

export default Couriers;
