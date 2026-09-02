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
      className={`mx-auto w-full max-w-dispatch-page px-4 sm:px-5 lg:px-6 xl:px-8 ${className || ""}`}
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
