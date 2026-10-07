"use client";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  SINGLE_VENDOR_CALCULATE_CHECKOUT,
  SINGLE_VENDOR_SCHEDULE,
} from "@/lib/api/graphql/single-vendor";
import useUser from "@/lib/hooks/useUser";
import Image from "@/lib/ui/useable-components/safe-image";
import useCurrencyFormatter from "@/lib/hooks/useCurrencyFormatter";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowRight,
  FiShoppingBag,
  FiTag,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useTranslations } from "next-intl";
import useCheckoutDestination from "./useCheckoutDestination";
import SingleVendorEmptyCart from "./EmptyCart";
import CartQuantityController from "./CartQuantityController";
import ClearCartDialog from "./ClearCartDialog";

const CHECKOUT_ROUTE = "/order/checkout";

export default function SingleVendorCart({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const t = useTranslations();
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const client = useApolloClient();
  const { profile, cart, calculateSubtotal, clearCart } = useUser();
  const { formatCurrency } = useCurrencyFormatter();
  const { latitude, longitude, hasDeliveryCoordinates } =
    useCheckoutDestination();
  const cartSignature = cart
    .map((item) => `${item.key}:${item.quantity}`)
    .join("|");

  // Warm the checkout route, its code and its first quote while the cart is
  // open, so "Continue to checkout" renders immediately. Variables match the
  // checkout page's defaults (delivery, no coupon).
  const prefetchCheckout = useCallback(() => {
    if (!cartSignature) return;
    router.prefetch(CHECKOUT_ROUTE);
    void import("./Checkout");
    void client.query({ query: SINGLE_VENDOR_SCHEDULE }).catch(() => {});
    if (!profile || !hasDeliveryCoordinates) return;
    void client
      .query({
        query: SINGLE_VENDOR_CALCULATE_CHECKOUT,
        variables: {
          isPickup: false,
          latDestination: latitude,
          longDestination: longitude,
          coupon: undefined,
        },
        fetchPolicy: "network-only",
      })
      .catch(() => {});
  }, [
    cartSignature,
    client,
    hasDeliveryCoordinates,
    latitude,
    longitude,
    profile,
    router,
  ]);

  useEffect(() => {
    // Debounced so rapid cart edits trigger one quote request.
    const handle = window.setTimeout(prefetchCheckout, 300);
    return () => window.clearTimeout(handle);
  }, [prefetchCheckout]);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const dealsSavings = cart.reduce(
    (total, item) =>
      total +
      Math.max(
        Number(item.actualUnitPrice ?? 0) -
          Number(item.discountedUnitPrice ?? item.price ?? 0),
        0,
      ) *
        item.quantity,
    0,
  );

  return (
    <div className="relative flex h-full flex-col bg-dispatch-surface text-dispatch-ink dark:bg-gray-800 dark:text-white">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-dispatch-line px-6 pb-4 pt-6 dark:border-gray-700">
        <div className="flex min-w-0 items-center gap-2.5">
          <h2 className="truncate font-dispatch text-xl font-semibold tracking-[-0.02em]">
            Your cart
          </h2>
          {itemCount > 0 && (
            <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-semibold tabular-nums text-dispatch-ink dark:bg-primary-color/15 dark:text-primary-color">
              {itemCount} {itemCount === 1 ? t("item_label") : t("items_label")}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => setIsClearConfirmOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <FiTrash2 aria-hidden className="h-3.5 w-3.5" />
              Clear cart
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="group inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dispatch-map text-dispatch-muted transition hover:bg-dispatch-line hover:text-dispatch-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <FiX
              aria-hidden
              className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>

      {cart.length ? (
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence initial={false}>
            {cart.map((item) => {
              const unitPrice = Number(
                item.discountedUnitPrice ?? item.price ?? 0,
              );
              const originalUnitPrice = Number(item.actualUnitPrice ?? 0);
              const hasDeal = originalUnitPrice > unitPrice;
              const meta = [item.variationTitle, ...(item.optionTitles ?? [])]
                .filter(Boolean)
                .join(" · ");
              return (
                <motion.div
                  key={item.key}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  className="mb-3 overflow-hidden last:mb-0"
                >
                  <div className="flex gap-3 rounded-2xl border border-dispatch-line bg-dispatch-surface p-3 shadow-[0_4px_16px_rgba(21,25,20,0.035)] transition-colors hover:border-primary-disabled dark:border-gray-700 dark:bg-gray-900">
                    <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-dispatch-map ring-1 ring-inset ring-black/5 dark:bg-gray-800">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt=""
                          width={76}
                          height={76}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="line-clamp-1 text-[15px] font-semibold leading-tight tracking-[-0.01em]">
                        {item.foodTitle || item.title}
                      </p>
                      {meta && (
                        <p className="mt-1 line-clamp-1 text-xs text-dispatch-muted dark:text-gray-400">
                          {meta}
                        </p>
                      )}
                      <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-2">
                        <span className="text-xs tabular-nums text-dispatch-muted dark:text-gray-400">
                          {formatCurrency(unitPrice)} each
                        </span>
                        {hasDeal && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2 py-1 text-[11px] font-semibold leading-none text-dispatch-ink dark:bg-primary-color/15 dark:text-primary-color">
                            <FiTag aria-hidden className="h-3 w-3" />
                            Save{" "}
                            {formatCurrency(
                              (originalUnitPrice - unitPrice) * item.quantity,
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end justify-between gap-2">
                      <div className="flex items-baseline gap-1.5 leading-none">
                        {hasDeal && (
                          <span className="text-xs tabular-nums text-dispatch-muted line-through decoration-1 dark:text-gray-400">
                            {formatCurrency(originalUnitPrice * item.quantity)}
                          </span>
                        )}
                        <span className="text-[15px] font-bold tabular-nums">
                          {formatCurrency(unitPrice * item.quantity)}
                        </span>
                      </div>
                      <CartQuantityController
                        variant="inline"
                        foodId={item._id}
                        categoryId={item.categoryId}
                        variationId={item.variation?._id}
                        foodTitle={item.foodTitle || item.title}
                        variationTitle={item.variationTitle}
                        image={item.image}
                        unitPrice={unitPrice}
                        addons={item.addons}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <SingleVendorEmptyCart onBrowse={onClose} />
      )}

      {cart.length > 0 && (
        <div className="shrink-0 border-t border-dispatch-line bg-dispatch-surface px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 shadow-[0_-10px_30px_rgba(21,25,20,0.05)] dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 space-y-2 text-sm">
            {dealsSavings > 0 && (
              <>
                <div className="flex items-center justify-between text-dispatch-muted dark:text-gray-400">
                  <span>Items total</span>
                  <span className="tabular-nums line-through decoration-1">
                    {formatCurrency(Number(calculateSubtotal()) + dealsSavings)}
                  </span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-2.5 py-1 text-xs text-dispatch-ink dark:bg-primary-color/15 dark:text-primary-color">
                    <FiTag aria-hidden className="h-3 w-3" />
                    Deals savings
                  </span>
                  <span className="tabular-nums text-dispatch-ink dark:text-primary-color">
                    {`−${formatCurrency(dealsSavings)}`}
                  </span>
                </div>
                <div className="border-t border-dashed border-dispatch-line dark:border-gray-700" />
              </>
            )}
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-lg font-bold">Subtotal</span>
              <span className="text-lg font-bold tabular-nums">
                {formatCurrency(calculateSubtotal())}
              </span>
            </div>
            <p className="text-xs text-dispatch-muted dark:text-gray-400">
              Delivery and taxes calculated at checkout
            </p>
          </div>
          <motion.button
            type="button"
            onClick={() => {
              onClose();
              router.push(CHECKOUT_ROUTE);
            }}
            onPointerEnter={prefetchCheckout}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex h-14 w-full items-center justify-between gap-3 overflow-hidden rounded-2xl bg-primary-color py-2 pe-2 ps-5 text-[#151914] shadow-[0_10px_24px_rgba(90,193,47,0.32)] transition-[filter,box-shadow] hover:brightness-[1.03] hover:shadow-[0_14px_30px_rgba(90,193,47,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
          >
            {/* Light sweep on hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -start-1/3 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-700 group-hover:start-[110%] group-hover:opacity-100"
            />
            <span className="relative inline-flex items-center gap-2.5 font-semibold tracking-[-0.01em]">
              <FiShoppingBag
                aria-hidden
                className="h-[18px] w-[18px]"
                strokeWidth={2.4}
              />
              Continue to checkout
            </span>
            <span className="relative inline-flex h-10 items-center gap-2 rounded-xl bg-[#151914] px-3 text-sm font-semibold tabular-nums text-white">
              {formatCurrency(calculateSubtotal())}
              <FiArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100"
              />
            </span>
          </motion.button>
        </div>
      )}
      <ClearCartDialog
        visible={isClearConfirmOpen && cart.length > 0}
        itemCount={itemCount}
        images={cart.map((item) => item.image)}
        onCancel={() => setIsClearConfirmOpen(false)}
        onConfirm={() => {
          setIsClearConfirmOpen(false);
          clearCart();
        }}
      />
    </div>
  );
}
