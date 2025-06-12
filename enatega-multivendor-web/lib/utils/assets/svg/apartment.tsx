import React from "react";
import { ISvgComponentProps } from "../../interfaces";

export default function AppartmentSvg(props: ISvgComponentProps) {
  const { width = "22", height = "22", color = "#0F172A" } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.75 19.5H17.25M1.5 1.5H16.5M2.25 1.5V19.5M15.75 1.5V19.5M6 5.25H7.5M6 8.25H7.5M6 11.25H7.5M10.5 5.25H12M10.5 8.25H12M10.5 11.25H12M6 19.5V16.125C6 15.5037 6.50368 15 7.125 15H10.875C11.4963 15 12 15.5037 12 16.125V19.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
