"use client";

import useUser from "@/lib/hooks/useUser";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAppMode } from "@/lib/mode";

const COUPON_STORAGE_KEY = "applied_coupon";
const COUPON_TEXT_STORAGE_KEY = "coupon_text";
const COUPON_APPLIED_STORAGE_KEY = "is_coupon_applied";
const COUPON_RESTAURANT_KEY = "coupon_restaurant_id";
const PENDING_STRIPE_ORDER_ID_KEY = "pending_stripe_order_id";
const PENDING_STRIPE_STARTED_AT_KEY = "pending_stripe_started_at";

export default function StripeOrderRecovery() {
  const router = useRouter();
  const pathname = usePathname();
  const { clearCart, orders } = useUser();
  const { isSingleVendor } = useAppMode();
  const isRedirectingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || isRedirectingRef.current) return;

    const pendingOrderId = onUseLocalStorage(
      "get",
      PENDING_STRIPE_ORDER_ID_KEY,
    );
    if (!pendingOrderId) return;

    const isTrackingPage = pathname.includes("/tracking");
    const matchingOrder = orders.find(
      (order) => order.orderId === pendingOrderId,
    );

    if (!matchingOrder?._id) return;
    const trackingReference = isSingleVendor
      ? matchingOrder.orderId
      : matchingOrder._id;
    if (isTrackingPage && pathname.includes(trackingReference)) {
      onUseLocalStorage("delete", PENDING_STRIPE_ORDER_ID_KEY);
      onUseLocalStorage("delete", PENDING_STRIPE_STARTED_AT_KEY);
      return;
    }

    isRedirectingRef.current = true;

    const finalizeStripeOrder = async () => {
      await clearCart();
      onUseLocalStorage("delete", COUPON_STORAGE_KEY);
      onUseLocalStorage("delete", COUPON_TEXT_STORAGE_KEY);
      onUseLocalStorage("delete", COUPON_APPLIED_STORAGE_KEY);
      onUseLocalStorage("delete", COUPON_RESTAURANT_KEY);
      onUseLocalStorage("delete", PENDING_STRIPE_ORDER_ID_KEY);
      onUseLocalStorage("delete", PENDING_STRIPE_STARTED_AT_KEY);
      router.replace(`/order/${trackingReference}/tracking`);
    };

    void finalizeStripeOrder();
  }, [clearCart, isSingleVendor, orders, pathname, router]);

  return null;
}
