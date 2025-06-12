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


const EnategaInfo: React.FC = () => {
  return (
    <div className="mt-[80px] mb-[80px]">
      <div className="flex flex-col justify-center items-center my-[20px]">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold m-4">
          LIFE TASTES BETTER WITH ENATEGA
        </h1>
        <p className="m-4 text-xl md:text-2xl lg:text-3xl">
          Almost everything delivered to you – quickly, reliably, and affordably
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
        <MoveableCard
          image={deliveryFee}
          heading={"Real support from real people"}
          subText={
            "Our world-class support team has your back, with friendly assistance and fast response times. "
          }
        />
        <MoveableCard
          image={ZeroDelivery}
          heading={"0 € delivery fees with Enatega"}
          subText={
            "Enjoy zero delivery fees from the best restaurants and stores in your city."
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-[30px] mb-[30px]">
        <HomeCard image={CustomerApp} heading={"Fresh Groceries Delivered"} subText={"Go to Enatega App"} link={"https://play.google.com/store/apps/details?id=com.enatega.multivendor&hl=en"}/>
        <HomeCard image={RestaurantApp} heading={"Restaurants Earn More"} subText={"Go to Enatega Restaurant App"} link={"https://play.google.com/store/apps/details?id=multivendor.enatega.restaurant&hl=en"} />
        <HomeCard image={RiderApp} heading={"Riders Reaches Fast"} subText={"Go to Enatega Rider App"} link={"https://play.google.com/store/apps/details?id=com.enatega.multirider&hl=en"}/>
      </div>
    </div>
  );
};

export default EnategaInfo;
