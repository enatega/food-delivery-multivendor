import React from "react";
import { ISvgComponentProps } from "../../interfaces";

export default function OfficeSvg(props: ISvgComponentProps) {
  const { width = "22", height = "22", color = "#0F172A",darkColor } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* light mode */}
      <path
      className="dark:hidden"
        d="M2.25 21.5H21.75M3.75 3.5V21.5M14.25 3.5V21.5M20.25 8V21.5M6.75 7.25H7.5M6.75 10.25H7.5M6.75 13.25H7.5M10.5 7.25H11.25M10.5 10.25H11.25M10.5 13.25H11.25M6.75 21.5V18.125C6.75 17.5037 7.25368 17 7.875 17H10.125C10.7463 17 11.25 17.5037 11.25 18.125V21.5M3 3.5H15M14.25 8H21M17.25 11.75H17.2575V11.7575H17.25V11.75ZM17.25 14.75H17.2575V14.7575H17.25V14.75ZM17.25 17.75H17.2575V17.7575H17.25V17.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* dark mode */}
      <path
        className="hidden dark:block"
        d="M2.25 21.5H21.75M3.75 3.5V21.5M14.25 3.5V21.5M20.25 8V21.5M6.75 7.25H7.5M6.75 10.25H7.5M6.75 13.25H7.5M10.5 7.25H11.25M10.5 10.25H11.25M10.5 13.25H11.25M6.75 21.5V18.125C6.75 17.5037 7.25368 17 7.875 17H10.125C10.7463 17 11.25 17.5037 11.25 18.125V21.5M3 3.5H15M14.25 8H21M17.25 11.75H17.2575V11.7575H17.25V11.75ZM17.25 14.75H17.2575V14.7575H17.25V14.75ZM17.25 17.75H17.2575V17.7575H17.25V17.75Z"
        stroke={darkColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
