import React from "react";
import { ISvgComponentProps } from "../../interfaces";

export default function MenuSvg(props: ISvgComponentProps) {
  const { width = "22", height = "15", color = "#111827" } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 16C11.5 16.2761 11.2761 16.5 11 16.5C10.7239 16.5 10.5 16.2761 10.5 16C10.5 15.7239 10.7239 15.5 11 15.5C11.2761 15.5 11.5 15.7239 11.5 16ZM11.5 16H11M16.5 16C16.5 16.2761 16.2761 16.5 16 16.5C15.7239 16.5 15.5 16.2761 15.5 16C15.5 15.7239 15.7239 15.5 16 15.5C16.2761 15.5 16.5 15.7239 16.5 16ZM16.5 16H16M21.5 16C21.5 16.2761 21.2761 16.5 21 16.5C20.7239 16.5 20.5 16.2761 20.5 16C20.5 15.7239 20.7239 15.5 21 15.5C21.2761 15.5 21.5 15.7239 21.5 16ZM21.5 16H21M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
