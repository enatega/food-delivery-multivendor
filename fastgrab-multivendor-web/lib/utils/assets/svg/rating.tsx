import React from "react";
import { ISvgComponentProps } from "../../interfaces";

export default function RatingSvg(props: ISvgComponentProps) {
  const { width = "22", height = "22", color = "#4B5563" } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.2426 20.2426C17.8995 22.5858 14.1005 22.5858 11.7574 20.2426M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16ZM13 13C13 13.5523 12.7761 14 12.5 14C12.2239 14 12 13.5523 12 13C12 12.4477 12.2239 12 12.5 12C12.7761 12 13 12.4477 13 13ZM12.5 13H12.51V13.02H12.5V13ZM20 13C20 13.5523 19.7761 14 19.5 14C19.2239 14 19 13.5523 19 13C19 12.4477 19.2239 12 19.5 12C19.7761 12 20 12.4477 20 13ZM19.5 13H19.51V13.02H19.5V13Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
