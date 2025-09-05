
// components/DirectionHandler.tsx
"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

export function DirectionHandler() {
  const locale = useLocale();

  useEffect(() => {
    const isRTL = ["ar", "hr", "fa", "ur"].includes(locale);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [locale]);

  return null
}