import React from "react";
import { ISvgComponentProps } from "../../interfaces";

export default function InfoSvg(props: ISvgComponentProps) {
  const { width = "22", height = "22", color = "#0EA5E9" } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 15L15.0553 14.9723C15.8195 14.5903 16.6799 15.2805 16.4727 16.1093L15.5273 19.8907C15.3201 20.7195 16.1805 21.4097 16.9447 21.0277L17 21M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16ZM16 11H16.01V11.01H16V11Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
