import { IPaddingContainer } from "@/lib/utils/interfaces";
import React from "react";

export default function PaddingContainer({
  children,
  style = {},
  height,
  paddingTop,
  paddingBottom,
  className,
}: IPaddingContainer) {
  return (
    <div
      className={`w-full px-4 md:px-6 lg:px-12 xl:px-20 2xl:px-[80px] ${className}`}
      style={{
        height,
        paddingTop,
        paddingBottom,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
