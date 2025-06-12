import MoveableCard from "@/lib/ui/useable-components/Moveable-Card";
import React from "react";
import TranparentButton from "@/lib/ui/useable-components/Home-Buttons/TranparentButton";

import riderImg from '@/public/assets/images/png/riderImg.webp'
import reachNewCustomers from '@/public/assets/images/png/reachNewCustomers.jpg'
const Info = () => {
  const CourierButton = <TranparentButton text={"For riders"} link={"/rider"} />;
  const MerchantButton = <TranparentButton text={"For restaurants" } link={"/restaurantInfo"}/>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <MoveableCard
        button={CourierButton}
        image={
          riderImg
        }
        heading={"Becoming a courier partner"}
        subText={
          "Earn by delivering to local customers. Set Your own schedule,deliver when and where you want"
        }
      />
      <MoveableCard
        button={MerchantButton}
        image={
         reachNewCustomers
        }
        heading={"Reach new customers"}
        subText={
          "We help you to grow your business by helping thousands of people find your venue."
        }
      />
    </div>
  );
};

export default Info;
