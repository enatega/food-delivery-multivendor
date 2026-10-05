"use client";
import dynamic from "next/dynamic";
import { useAppMode } from "@/lib/mode";

// Load only the active mode's checkout. The multivendor checkout (maps,
// payments, etc.) is large and was being downloaded on every single-vendor
// checkout visit.
const CheckoutLoading = () => (
  <div className="mx-auto max-w-5xl py-8" aria-busy="true">
    <div className="skeleton-surface h-96 animate-pulse rounded-2xl" />
  </div>
);
const SingleVendorCheckout = dynamic(
  () => import("@/lib/ui/single-vendor/Checkout"),
  { loading: CheckoutLoading },
);
const MultiVendorCheckout = dynamic(() => import("./index"), {
  loading: CheckoutLoading,
});

export default function ModeCheckout() {
  const { isSingleVendor } = useAppMode();
  return isSingleVendor ? <SingleVendorCheckout /> : <MultiVendorCheckout />;
}
