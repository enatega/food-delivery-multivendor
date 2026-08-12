"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { APP_MODES } from "./constants";
import { isRouteCompatible } from "./routes";
import { useAppMode } from "./AppModeContext";
import { modeStorage } from "./storage";

export default function ModeRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, singleVendorAvailable, switchMode } = useAppMode();
  const compatible = isRouteCompatible(pathname, mode);

  useEffect(() => {
    if (!compatible && mode === APP_MODES.SINGLE) router.replace("/discovery");
  }, [compatible, mode, router]);

  useEffect(() => {
    const pending = modeStorage.get("pendingOrderNavigation");
    if (!pending) return;
    modeStorage.remove("pendingOrderNavigation");
    router.push(pending);
  }, [mode, router]);

  if (compatible) return children;
  if (mode === APP_MODES.SINGLE) return <div className="min-h-[50vh]" aria-busy="true" />;
  return <div className="mx-auto my-16 max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Open in Single Vendor</h1><p className="mt-3 text-gray-600 dark:text-gray-300">This page belongs to the Single Vendor service. Your Multi Vendor cart and orders will remain saved.</p><button disabled={!singleVendorAvailable} onClick={() => void switchMode(APP_MODES.SINGLE)} className="mt-6 rounded-full bg-primary-color px-6 py-3 font-semibold text-white disabled:opacity-50">Open Single Vendor</button></div>;
}
