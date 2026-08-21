"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getModeHomeRoute, useAppMode } from "@/lib/mode";
import HomeScreen from ".";

export default function ModeHome() {
  const router = useRouter();
  const { mode, isSingleVendor } = useAppMode();

  useEffect(() => {
    if (isSingleVendor) router.replace(getModeHomeRoute(mode));
  }, [isSingleVendor, mode, router]);

  if (isSingleVendor) {
    return (
      <div
        className="min-h-[60vh] bg-dispatch-ground dark:bg-dispatch-ink"
        aria-busy="true"
      />
    );
  }

  return <HomeScreen />;
}
