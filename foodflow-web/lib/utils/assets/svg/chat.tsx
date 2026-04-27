import React from "react";
import { ISvgComponentProps } from "../../interfaces";

export default function ChatSvg(props: ISvgComponentProps) {
  const { width = "22", height = "22", color = "#0EA5E9" } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 28 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 8H20M8 12H14M1 14.0125C1 16.1472 2.49788 18.0054 4.60995 18.3159C6.11462 18.5372 7.63632 18.7061 9.17314 18.8207C9.64006 18.8555 10.0669 19.1003 10.3266 19.4899L14 25L17.6733 19.49C17.9331 19.1004 18.3599 18.8556 18.8268 18.8208C20.3636 18.7062 21.8853 18.5373 23.39 18.3161C25.5021 18.0056 27 16.1474 27 14.0126V5.98741C27 3.85261 25.5021 1.99444 23.39 1.68391C20.3254 1.23335 17.1901 1 14.0004 1C10.8103 1 7.67482 1.23339 4.60996 1.68403C2.49789 1.99458 1 3.85275 1 5.98752V14.0125Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
