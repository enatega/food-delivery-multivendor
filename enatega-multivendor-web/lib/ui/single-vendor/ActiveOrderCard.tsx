"use client";

import { useQuery, useSubscription } from "@apollo/client";
import Link from "next/link";

import {
  SINGLE_VENDOR_ORDER_STATUS,
  SINGLE_VENDOR_RECENT_ACTIVE_ORDER,
} from "@/lib/api/graphql/single-vendor";
import { useAuth } from "@/lib/context/auth/auth.context";
import useCurrencyFormatter from "@/lib/hooks/useCurrencyFormatter";
import useUser from "@/lib/hooks/useUser";
import Image from "@/lib/ui/useable-components/safe-image";

const ACTIVE_STATUSES = ["PENDING", "ACCEPTED", "ASSIGNED", "PICKED"];

function getOrderMessage(status: string, isPickedUp: boolean) {
  if (status === "PICKED") {
    return isPickedUp ? "Ready for collection" : "Your order is on the way";
  }
  if (status === "ASSIGNED") return "A courier has been assigned";
  if (status === "ACCEPTED") {
    return isPickedUp
      ? "Your collection is being prepared"
      : "Your order is being prepared";
  }
  return "We have received your order";
}

function formatEta(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function SingleVendorActiveOrderCard() {
  const { authToken } = useAuth();
  const { profile } = useUser();
  const { formatCurrency } = useCurrencyFormatter();
  const recent = useQuery(SINGLE_VENDOR_RECENT_ACTIVE_ORDER, {
    skip: !authToken,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
  const update = useSubscription(SINGLE_VENDOR_ORDER_STATUS, {
    variables: { userId: profile?._id || "" },
    skip: !profile?._id,
  });

  if (!authToken) return null;
  if (recent.loading && !recent.data) {
    return (
      <div
        className="my-6 h-44 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"
        aria-label="Loading active order"
      />
    );
  }
  if (recent.error && !recent.data) {
    return (
      <div className="my-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-900 dark:bg-red-950/20">
        <p className="text-sm text-red-600 dark:text-red-300">
          Your active order could not be loaded.
        </p>
        <button
          type="button"
          onClick={() => void recent.refetch()}
          className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 dark:border-red-800 dark:text-red-300"
        >
          Try again
        </button>
      </div>
    );
  }

  const initialOrder = recent.data?.recentActiveOrder?.rawOrder;
  const updatedOrder = update.data?.orderStatusChanged?.rawOrder;
  const updateMatches =
    updatedOrder &&
    (!initialOrder ||
      updatedOrder._id === initialOrder._id ||
      updatedOrder.orderId === initialOrder.orderId);
  const order = updateMatches ? updatedOrder : initialOrder;

  if (!order || !ACTIVE_STATUSES.includes(order.orderStatus)) return null;

  const progress = Math.max(ACTIVE_STATUSES.indexOf(order.orderStatus) + 1, 1);
  const itemCount = (order.items || []).reduce(
    (total: number, item: { quantity?: number }) =>
      total + (item.quantity || 0),
    0,
  );
  const eta = formatEta(
    order.eta?.estimatedArrivalAt ||
      order.eta?.windowEndAt ||
      order.expectedTime,
  );
  const destination = order.isPickedUp
    ? order.restaurant?.address
    : order.deliveryAddress?.deliveryAddress;

  return (
    <section className="my-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Link
        href={`/order/${order.orderId}/tracking`}
        aria-label={`Track active order ${order.orderId}`}
        className="group block p-5 sm:p-6"
      >
        <div className="flex items-start gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-light text-primary-color dark:bg-gray-700">
            {order.restaurant?.image ? (
              <Image
                src={order.restaurant.image}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 10.5V20h16v-9.5M3 9l2-5h14l2 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 9c0 1.4 1.1 2.5 2.5 2.5S8 10.4 8 9c0 1.4 1.1 2.5 2.5 2.5S13 10.4 13 9c0 1.4 1.1 2.5 2.5 2.5S18 10.4 18 9c0 1.4 1.1 2.5 2.5 2.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold tracking-wide text-primary-color uppercase">
                  Active order
                </p>
                <h2 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl dark:text-white">
                  {getOrderMessage(
                    order.orderStatus,
                    Boolean(order.isPickedUp),
                  )}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {order.restaurant?.name || "Current order"}
                  {eta ? ` · Expected by ${eta}` : ""}
                </p>
              </div>
              <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-color dark:bg-gray-700">
                {order.orderStatus.charAt(0) +
                  order.orderStatus.slice(1).toLowerCase()}
              </span>
            </div>

            <div
              className="mt-5 flex gap-2"
              aria-label={`${progress} of 4 order stages completed`}
            >
              {ACTIVE_STATUSES.map((status, index) => (
                <span
                  key={status}
                  className={`h-1.5 flex-1 rounded-full ${index < progress ? "bg-primary-color" : "bg-gray-200 dark:bg-gray-600"}`}
                />
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
              <span>#{order.orderId}</span>
              <span>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(order.orderAmount)}
              </span>
              {destination && (
                <span className="max-w-sm truncate">{destination}</span>
              )}
              <span className="ms-auto font-semibold text-primary-color transition group-hover:translate-x-0.5">
                Track order →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
