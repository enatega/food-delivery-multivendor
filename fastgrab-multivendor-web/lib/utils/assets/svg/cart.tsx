import React from "react";
import { ISvgComponentProps } from "../../interfaces";

export default function CardSvg(props: ISvgComponentProps) {
  const { width = "16", height = "16", color = "#F0F9FF" } = props;

  return (
    <svg
      width={width}
      height={height}
      color={color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2 13h13l3-9H6"></path>
    </svg>
  );
}
