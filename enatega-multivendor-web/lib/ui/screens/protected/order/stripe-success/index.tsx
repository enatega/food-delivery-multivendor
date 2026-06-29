"use client";

import { ORDERS } from "@/lib/api/graphql";
import useUser from "@/lib/hooks/useUser";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";
import { IOrder, IOrdersResponse } from "@/lib/utils/interfaces";
import { useApolloClient } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const COUPON_STORAGE_KEY = "applied_coupon";
const COUPON_TEXT_STORAGE_KEY = "coupon_text";
const COUPON_APPLIED_STORAGE_KEY = "is_coupon_applied";
const COUPON_RESTAURANT_KEY = "coupon_restaurant_id";
const PENDING_STRIPE_ORDER_ID_KEY = "pending_stripe_order_id";
const PENDING_STRIPE_STARTED_AT_KEY = "pending_stripe_started_at";
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 60000;

export default function StripeSuccessScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const client = useApolloClient();
  const { clearCart } = useUser();
  const [isTimedOut, setIsTimedOut] = useState(false);
  const finalizingRef = useRef(false);

  const pendingOrderId = useMemo(() => {
    const queryOrderId =
      searchParams.get("id") ||
      searchParams.get("orderId") ||
      searchParams.get("reference");

    if (queryOrderId) {
      if (typeof window !== "undefined") {
        localStorage.setItem(PENDING_STRIPE_ORDER_ID_KEY, queryOrderId);
        localStorage.setItem(
          PENDING_STRIPE_STARTED_AT_KEY,
          Date.now().toString(),
        );
      }
      return queryOrderId;
    }

    if (typeof window !== "undefined") {
      return localStorage.getItem(PENDING_STRIPE_ORDER_ID_KEY) || "";
    }

    return "";
  }, [searchParams]);

  const clearPendingStripeState = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PENDING_STRIPE_ORDER_ID_KEY);
      localStorage.removeItem(PENDING_STRIPE_STARTED_AT_KEY);
    }
  }, []);

  const cleanupConfirmedOrder = useCallback(async () => {
    await clearCart();
    onUseLocalStorage("delete", COUPON_STORAGE_KEY);
    onUseLocalStorage("delete", COUPON_TEXT_STORAGE_KEY);
    onUseLocalStorage("delete", COUPON_APPLIED_STORAGE_KEY);
    onUseLocalStorage("delete", COUPON_RESTAURANT_KEY);
    clearPendingStripeState();
  }, [clearCart, clearPendingStripeState]);

  const finalizeOrder = useCallback(
    async (order: IOrder) => {
      if (finalizingRef.current || !order?._id) return;
      finalizingRef.current = true;
      await cleanupConfirmedOrder();
      router.replace(`/order/${order._id}/tracking`);
    },
    [cleanupConfirmedOrder, router],
  );

  const findConfirmedOrder = useCallback(async () => {
    if (!pendingOrderId) return null;

    try {
      const result = await client.query<IOrdersResponse>({
        query: ORDERS,
        variables: { page: 1, limit: 300 },
        fetchPolicy: "network-only",
      });

      return (
        result.data?.orders?.find(
          (order) => order.orderId === pendingOrderId,
        ) || null
      );
    } catch {
      return null;
    }
  }, [client, pendingOrderId]);

  useEffect(() => {
    if (!pendingOrderId) {
      setIsTimedOut(true);
      return;
    }

    let isMounted = true;

    const run = async () => {
      const startedAt =
        typeof window !== "undefined"
          ? Number(localStorage.getItem(PENDING_STRIPE_STARTED_AT_KEY)) ||
            Date.now()
          : Date.now();

      while (isMounted && !finalizingRef.current) {
        const matchedOrder = await findConfirmedOrder();
        if (matchedOrder) {
          await finalizeOrder(matchedOrder);
          return;
        }

        if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
          if (isMounted) {
            setIsTimedOut(true);
          }
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [finalizeOrder, findConfirmedOrder, pendingOrderId]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-color" />
        <h1 className="text-2xl font-semibold text-neutral-900">
          {isTimedOut ? "Payment submitted" : "Confirming your order"}
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          {isTimedOut
            ? "Your payment was submitted successfully. We're still waiting for the backend confirmation, so your order may appear in a moment."
            : "Your card payment was submitted. We're waiting for the backend to confirm the order before sending you to tracking."}
        </p>

        {pendingOrderId ? (
          <p className="mt-4 text-xs text-neutral-400">
            Reference: {pendingOrderId}
          </p>
        ) : null}

        {isTimedOut ? (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              className="rounded-full bg-primary-color px-5 py-3 text-sm font-medium text-white"
              onClick={() => router.push("/profile/order-history")}
            >
              View my orders
            </button>
            <button
              className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700"
              onClick={() => router.push("/")}
            >
              Continue browsing
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
