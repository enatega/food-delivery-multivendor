import React from "react";
import { Cards } from "@/lib/utils/interfaces/Rider-restaurant.interface";
import Image from "next/image";

const Card: React.FC<Cards> = ({ image, heading, text }) => {
  return (
    <div
      className={`bg-[#f7fbfe]  dark:bg-gray-800 flex items-center justify-center flex-col  rounded-2xl p-4`}
    >
      <div className="relative w-[300px] h-[300px] flex items-center justify-center ">
        <Image src={image} alt="img" className="object-cover" />
      </div>

      <div className="flex items-center justify-center flex-col my-6">
        <h1 className="font-semibold text-[25px] my-[30px] dark:text-white">
          {heading}
        </h1>
        <p className="font-light text-[16px] text-[#6d7073] dark:text-gray-400 mb-[20px]">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Card;
