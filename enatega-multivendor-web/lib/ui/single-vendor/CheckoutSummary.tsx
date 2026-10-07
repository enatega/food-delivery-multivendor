"use client";
import { FiGift, FiLock, FiShoppingBag, FiTag } from "react-icons/fi";
import Image from "@/lib/ui/useable-components/safe-image";
import useCurrencyFormatter from "@/lib/hooks/useCurrencyFormatter";
import type { CartItem } from "@/lib/context/User/User.context";

interface CheckoutSummaryProps {
  cart: CartItem[];
  summary: any;
  isQuoteLoading: boolean;
  isPlacing: boolean;
  isLeavingCheckout: boolean;
  isMissingAddress: boolean;
  pickup: boolean;
  paymentMethod: string;
  errorMessage?: string;
  onPlaceOrder: () => void;
}

export default function CheckoutSummary({
  cart,
  summary,
  isQuoteLoading,
  isPlacing,
  isLeavingCheckout,
  isMissingAddress,
  pickup,
  paymentMethod,
  errorMessage,
  onPlaceOrder,
}: CheckoutSummaryProps) {
  const { formatCurrency } = useCurrencyFormatter();
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_4px_16px_rgba(21,25,20,0.035)] lg:sticky lg:top-24 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
        Order summary
      </h2>
      <ul className="mt-3 max-h-56 space-y-2.5 overflow-y-auto border-b border-gray-100 pb-3 dark:border-gray-700">
        {cart.map((item) => {
          const meta = [item.variationTitle, ...(item.optionTitles ?? [])]
            .filter(Boolean)
            .join(" · ");
          const unitPrice = Number(item.discountedUnitPrice ?? item.price ?? 0);
          const originalUnitPrice = Number(item.actualUnitPrice ?? 0);
          const hasDeal = originalUnitPrice > unitPrice;
          return (
            <li key={item.key} className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiShoppingBag
                    aria-hidden
                    className="h-4 w-4 text-gray-400"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-white">
                  <span className="text-gray-500 dark:text-gray-400">
                    {item.quantity}×
                  </span>{" "}
                  {item.foodTitle || item.title}
                </p>
                <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                  {hasDeal && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-light px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-dark dark:bg-gray-900">
                      <FiTag aria-hidden className="h-2.5 w-2.5" />
                      Deal
                    </span>
                  )}
                  {meta && (
                    <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                      {meta}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end">
                <span
                  className={`text-sm font-medium tabular-nums ${hasDeal ? "text-primary-dark" : "text-gray-900 dark:text-white"}`}
                >
                  {formatCurrency(unitPrice * item.quantity)}
                </span>
                {hasDeal && (
                  <span className="text-xs tabular-nums text-gray-400 line-through">
                    {formatCurrency(originalUnitPrice * item.quantity)}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {summary?.discountDetails?.dealDiscount > 0 && (
        <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-primary-color/40 bg-primary-light/60 px-3 py-2 dark:bg-gray-900">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-color text-dispatch-ink">
            <FiGift aria-hidden className="h-4 w-4" />
          </span>
          <p className="text-xs text-gray-700 dark:text-gray-200">
            You&apos;re saving{" "}
            <span className="font-bold text-primary-dark">
              {formatCurrency(summary.discountDetails.dealDiscount)}
            </span>{" "}
            with deals on this order
          </p>
        </div>
      )}
      {isQuoteLoading && !summary ? (
        <div className="skeleton-surface my-4 h-28 animate-pulse rounded-xl" />
      ) : (
        <dl className="my-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">
              {formatCurrency(
                Number(summary?.subtotal ?? 0) +
                  Number(summary?.discountDetails?.dealDiscount ?? 0),
              )}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>{pickup ? "Pickup" : "Delivery"}</dt>
            <dd className="tabular-nums">
              {Number(summary?.deliveryCharges ?? 0) === 0
                ? "Free"
                : formatCurrency(summary?.deliveryCharges)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax</dt>
            <dd className="tabular-nums">
              {formatCurrency(summary?.taxAmount)}
            </dd>
          </div>
          {summary?.discountDetails?.dealDiscount > 0 && (
            <div className="flex items-center justify-between font-medium text-primary-dark">
              <dt className="inline-flex items-center gap-1.5">
                <FiTag aria-hidden className="h-3.5 w-3.5" />
                Deal savings
              </dt>
              <dd className="tabular-nums">
                {formatCurrency(-summary.discountDetails.dealDiscount)}
              </dd>
            </div>
          )}
          <div className="flex items-baseline justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
            <dt className="text-base font-semibold text-gray-900 dark:text-white">
              Total
            </dt>
            <dd className="text-xl font-bold tabular-nums text-gray-900 dark:text-white">
              {formatCurrency(summary?.grandTotal)}
            </dd>
          </div>
        </dl>
      )}
      <button
        type="button"
        disabled={
          isPlacing || isLeavingCheckout || isQuoteLoading || isMissingAddress
        }
        onClick={onPlaceOrder}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-color px-5 font-semibold text-dispatch-ink shadow-[0_6px_16px_rgba(90,193,47,0.28)] transition-[filter,box-shadow] hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none dark:focus-visible:ring-offset-gray-800 dark:disabled:bg-gray-700 dark:disabled:text-gray-300"
      >
        <FiLock aria-hidden className="h-4 w-4" />
        {isPlacing
          ? "Placing order…"
          : summary?.grandTotal != null
            ? `Place order · ${formatCurrency(summary.grandTotal)}`
            : "Place order"}
      </button>
      {isMissingAddress && (
        <p className="mt-2 text-center text-xs text-amber-700 dark:text-amber-300">
          Select a delivery address to continue.
        </p>
      )}
      {errorMessage && (
        <p
          role="alert"
          className="mt-2 rounded-lg bg-red-50 p-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
        >
          {errorMessage}
        </p>
      )}
      {!isMissingAddress && !errorMessage && (
        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          {paymentMethod === "COD"
            ? "You'll pay when you get your order."
            : "You'll complete payment on the next screen."}
        </p>
      )}
    </aside>
  );
}
