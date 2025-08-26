import React from "react";
import { ISvgComponentProps } from "../../interfaces";

export default function OtherSvg(props: ISvgComponentProps) {
  const { width = "22", height = "22", color = "#0F172A" } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.87891 8.01884C11.0505 6.99372 12.95 6.99372 14.1215 8.01884C15.2931 9.04397 15.2931 10.706 14.1215 11.7312C13.9176 11.9096 13.6917 12.0569 13.4513 12.1733C12.7056 12.5341 12.0002 13.1716 12.0002 14V14.75M21 12.5C21 17.4706 16.9706 21.5 12 21.5C7.02944 21.5 3 17.4706 3 12.5C3 7.52944 7.02944 3.5 12 3.5C16.9706 3.5 21 7.52944 21 12.5ZM12 17.75H12.0075V17.7575H12V17.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
