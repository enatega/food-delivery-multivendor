"use client";
import Link from "next/link";
import {
  FiCreditCard,
  FiDollarSign,
  FiHelpCircle,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiShoppingBag,
  FiTag,
} from "react-icons/fi";
import Image from "@/lib/ui/useable-components/safe-image";
import useCurrencyFormatter from "@/lib/hooks/useCurrencyFormatter";
import { getOrderVariationPricing } from "@/lib/ui/screen-components/protected/order-tracking/services/tracking-pricing";
import { parseBackendDate } from "@/lib/utils/methods/order-eta";
import type { getSingleVendorTrackingAmounts } from "./singleVendorOrderTracking";

type TrackingAmounts = ReturnType<typeof getSingleVendorTrackingAmounts>;

const CARD_CLASS =
  "rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_4px_16px_rgba(21,25,20,0.035)] sm:p-5 dark:border-gray-700 dark:bg-gray-800";

const addonsUnitPrice = (item: any) =>
  (item.addons ?? []).reduce(
    (sum: number, addon: any) =>
      sum +
      (addon.options ?? []).reduce(
        (optionSum: number, option: any) =>
          optionSum + Number(option.price || 0),
        0,
      ),
    0,
  );

export function TrackingItemsCard({ order }: { order: any }) {
  const { formatCurrency } = useCurrencyFormatter();
  const items: any[] = order.items ?? [];
  const itemCount = items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );
  return (
    <section aria-label="Items in this order" className={CARD_CLASS}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Your items
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>
      <ul className="mt-3 divide-y divide-gray-100 dark:divide-gray-700">
        {items.map((item, index) => {
          const pricing = getOrderVariationPricing(item.variation);
          const addons = addonsUnitPrice(item);
          const quantity = Number(item.quantity || 0);
          const finalTotal = (pricing.finalUnitPrice + addons) * quantity;
          const originalTotal = (pricing.originalUnitPrice + addons) * quantity;
          const meta = [
            item.variation?.title,
            ...(item.addons ?? []).flatMap((addon: any) =>
              (addon.options ?? []).map((option: any) => option.title),
            ),
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            <li
              key={item._id || index}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    width={44}
                    height={44}
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
                    {quantity}×
                  </span>{" "}
                  {item.title}
                </p>
                <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                  {pricing.hasDiscount && (
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
                {item.specialInstructions && (
                  <p className="mt-0.5 line-clamp-1 text-xs italic text-gray-500 dark:text-gray-400">
                    “{item.specialInstructions}”
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end">
                <span
                  className={`text-sm font-semibold tabular-nums ${pricing.hasDiscount ? "text-primary-dark" : "text-gray-900 dark:text-white"}`}
                >
                  {formatCurrency(finalTotal)}
                </span>
                {pricing.hasDiscount && (
                  <span className="text-xs tabular-nums text-gray-400 line-through">
                    {formatCurrency(originalTotal)}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {order.instructions && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-900/60">
          <FiMessageSquare
            aria-hidden
            className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
          />
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Order instructions
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {order.instructions}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export function TrackingBillCard({
  order,
  amounts,
  isPickup,
}: {
  order: any;
  amounts: TrackingAmounts;
  isPickup: boolean;
}) {
  const { formatCurrency } = useCurrencyFormatter();
  const placedAt = parseBackendDate(order.createdAt || order.orderDate);
  const isCash = order.paymentMethod === "COD";
  const rows: Array<{ label: string; value: number; negative?: boolean }> = [
    { label: "Subtotal", value: amounts.subtotal },
    { label: "Deal savings", value: amounts.dealDiscount, negative: true },
    ...(isPickup
      ? []
      : [{ label: "Delivery fee", value: amounts.deliveryCharge }]),
    { label: "Tax", value: amounts.tax },
    { label: "Rider tip", value: amounts.tip },
    { label: "Small order fee", value: amounts.minimumOrderFee },
    { label: "Priority delivery", value: amounts.priorityDeliveryFee },
    { label: "Discount", value: amounts.discount, negative: true },
    { label: "Credits applied", value: amounts.creditsApplied, negative: true },
  ].filter((row) => row.label === "Subtotal" || row.value > 0);

  return (
    <section aria-label="Order summary" className={CARD_CLASS}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {order.restaurant?.name || "Order"}
          </p>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Order #{order.orderId}
          </h2>
        </div>
        {placedAt && (
          <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
            {placedAt.toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-900/60">
        <FiMapPin
          aria-hidden
          className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark"
        />
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {isPickup ? "Pick up from" : "Delivering to"}
          </p>
          <p className="text-sm text-gray-900 dark:text-white">
            {isPickup
              ? order.restaurant?.address || order.restaurant?.name
              : order.deliveryAddress?.deliveryAddress}
          </p>
        </div>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex justify-between ${row.negative ? "font-medium text-primary-dark" : ""}`}
          >
            <dt>{row.label}</dt>
            <dd className="tabular-nums">
              {row.negative ? "-" : ""}
              {formatCurrency(row.value)}
            </dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
          <dt className="text-base font-semibold text-gray-900 dark:text-white">
            Total
          </dt>
          <dd className="text-xl font-bold tabular-nums text-gray-900 dark:text-white">
            {formatCurrency(amounts.total || order.orderAmount)}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-gray-200 px-3 py-2.5 text-sm dark:border-gray-700">
        {isCash ? (
          <FiDollarSign aria-hidden className="h-4 w-4 text-gray-500" />
        ) : (
          <FiCreditCard aria-hidden className="h-4 w-4 text-gray-500" />
        )}
        <span className="text-gray-700 dark:text-gray-200">
          {isCash
            ? isPickup
              ? "Cash on pickup"
              : "Cash on delivery"
            : "Paid by card"}
        </span>
      </div>
    </section>
  );
}

export function TrackingHelpActions({
  riderPhone,
}: {
  riderPhone?: string | null;
}) {
  return (
    <div className={`${CARD_CLASS} space-y-2`}>
      {riderPhone && (
        <a
          href={`tel:${riderPhone}`}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary-color text-sm font-semibold text-dispatch-ink transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60"
        >
          <FiPhone aria-hidden className="h-4 w-4" />
          Call your rider
        </a>
      )}
      <Link
        href="/profile/getHelp"
        className="flex items-center gap-3 rounded-xl px-1 py-1.5 text-sm transition-colors hover:text-primary-dark"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          <FiHelpCircle aria-hidden className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium text-gray-900 dark:text-white">
            Need help with your order?
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            Our support team is here for you
          </span>
        </span>
      </Link>
    </div>
  );
}
