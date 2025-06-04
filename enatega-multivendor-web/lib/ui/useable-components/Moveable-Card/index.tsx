"use client"
import Image from "next/image";
import React from "react";
import styles from "./Movable.module.css"; // Ensure this path is correct
import { MoveableProps } from "@/lib/utils/interfaces/Home-interfaces";
import { useEffect, useState } from "react";
const MoveableCard: React.FC<MoveableProps> = ({
  heading,
  subText,
  button,
  image,
  middle = false,
  height = "600px",
}) => {
  const [responsiveHeight, setResponsiveHeight] = useState(height);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 700) {
        setResponsiveHeight("400px");
      } else {
        setResponsiveHeight(height);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [height]);

  return (
    <div
      className={`${styles.cardContainer} bg-green-300 rounded-3xl cursor-pointer`}
      style={{ height: responsiveHeight }}
    >
      {/* Image container */}
      <Image
        src={
          image ||
          "https://images.ctfassets.net/23u853certza/0V5KYLmUImbVPRBerxy9b/78c9f84e09efbde9e124e74e6eef8fad/photocard_courier_v4.jpg?w=1200&q=90&fm=webp"
        }
        alt="Main Image"
        layout="fill"
        className={`${styles.imageContainer} c`}
      />

      {/* Text container */}

      {middle == false ? (
        <div
          className={`absolute inset-0 flex items-start justify-between  flex-col p-5  ${styles.textContainer}`}
        >
          <div>
            <h1 className="text-white text-2xl md:3xl lg:text-4xl font-extrabold mb-3">
              {heading}
            </h1>
            <p className="text-white text-md text-lg ">{subText}</p>
          </div>
          <div>{button && button}</div>
        </div>
      ) : (
        <div>
          <div
            className={`absolute inset-0 flex items-center justify-center  flex-col p-5  ${styles.textContainer}`}
          >
            <div className="  ">
              <h1 className="text-white text-2xl font-bold mb-3 text-center">
                {heading}
              </h1>
              <p className="text-white md:text-5xl text-4xl font-extrabold text-center">
                {subText}
              </p>
            </div>
            <div className="my-3">{button && button}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoveableCard;
