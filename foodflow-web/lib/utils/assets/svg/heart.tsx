// Heart SVG component update
import React from "react";
import { ISvgComponentProps } from "../../interfaces";

interface IHeartSvgProps extends ISvgComponentProps {
  filled?: boolean;
}

export default function HeartSvg(props: IHeartSvgProps) {
  const { width = "22", height = "22", color = "#0F172A", filled = false } = props;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className="transition-all duration-300 ease-in-out"
    >
      {/* Light mode */}
      <path
        d="M12 21C12 21 3 13.5 3 7.5C3 4.46243 5.46243 2 8.5 2C10.0485 2 11.4447 2.65952 12.4364 3.70833L12 4.1443L11.5636 3.70833C12.5553 2.65952 13.9515 2 15.5 2C18.5376 2 21 4.46243 21 7.5C21 13.5 12 21 12 21Z"
        fill={filled ? "#0EA5E9" : "none"}
        stroke={filled ? "#0EA5E9" : color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={` block dark:hidden transition-all duration-300 ${filled ? 'scale-105' : 'scale-100'}`}
      />
      {/* Dark mode */}

      <path
        
        d="M12 21C12 21 3 13.5 3 7.5C3 4.46243 5.46243 2 8.5 2C10.0485 2 11.4447 2.65952 12.4364 3.70833L12 4.1443L11.5636 3.70833C12.5553 2.65952 13.9515 2 15.5 2C18.5376 2 21 4.46243 21 7.5C21 13.5 12 21 12 21Z"
        fill={filled ? "#0EA5E9" : "none"}
        stroke={filled ? "#0EA5E9" : "#ffffff"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={` hidden dark:block transition-all duration-300 ${filled ? 'scale-105' : 'scale-100'}`}
      />
    </svg>
  );
}