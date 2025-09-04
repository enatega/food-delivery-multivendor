// lib/context/DirectionContext.tsx
"use client";

import { createContext, useContext } from "react";

const DirectionContext = createContext<"rtl" | "ltr">("ltr");

export const DirectionProvider = ({
  dir,
  children,
}: {
  dir: "rtl" | "ltr";
  children: React.ReactNode;
}) => {
  return (
    <DirectionContext.Provider value={dir}>{children}</DirectionContext.Provider>
  );
};

export const useDirection = () => useContext(DirectionContext);
