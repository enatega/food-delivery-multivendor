import React from "react";
import { ISvgComponentProps } from "../../interfaces";

export default function homeTabSvg(props: ISvgComponentProps) {
  const { width = "22", height = "15", color = "#F0F9FF"} = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.25 11L10.2045 2.04551C10.6438 1.60617 11.3562 1.60617 11.7955 2.04551L20.75 11M3.5 8.75001V18.875C3.5 19.4963 4.00368 20 4.625 20H8.75V15.125C8.75 14.5037 9.25368 14 9.875 14H12.125C12.7463 14 13.25 14.5037 13.25 15.125V20H17.375C17.9963 20 18.5 19.4963 18.5 18.875V8.75001M7.25 20H15.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
