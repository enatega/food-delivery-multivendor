import React from "react";
import { ISvgComponentProps } from "../../interfaces";

export default function ClockSvg(props: ISvgComponentProps) {
  const { width = "22", height = "22", color = "#4B5563", isBlue=false } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 8V16H22M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
        stroke={isBlue ? '#0EA5E9' : color }
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
