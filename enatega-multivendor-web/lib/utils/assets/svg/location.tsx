import React from "react";
import { ISvgComponentProps } from "../../interfaces";

export default function LocationSvg(props: ISvgComponentProps) {
  const { width = "32", height = "32" } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 14C20 16.2091 18.2091 18 16 18C13.7909 18 12 16.2091 12 14C12 11.7909 13.7909 10 16 10C18.2091 10 20 11.7909 20 14Z"
        stroke={"var(--primary-color)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 14C26 23.5228 16 29 16 29C16 29 6 23.5228 6 14C6 8.47715 10.4772 4 16 4C21.5228 4 26 8.47715 26 14Z"
        stroke={"var(--primary-color)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
