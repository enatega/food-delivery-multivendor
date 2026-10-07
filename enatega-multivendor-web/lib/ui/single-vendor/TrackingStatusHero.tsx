"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import type { IOrderTrackingDetail } from "@/lib/utils/interfaces/order-tracking-detail.interface";
import type { IOrderTracking } from "@/lib/utils/interfaces/orders.interface";
import {
  formatEtaTime,
  formatEtaWindow,
  isTrackingLocationStale,
  parseBackendDate,
} from "@/lib/utils/methods/order-eta";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type Illustration = "placed" | "preparing" | "on-the-way" | "delivered";

interface Step {
  key: string;
  label: string;
  /** Statuses that mean this step is the current one. */
  statuses: string[];
  timestamp?: string | null;
}

// Lottie files are fetched once per session and shared across re-renders.
const illustrationCache: Partial<Record<Illustration, object>> = {};

function useIllustration(name: Illustration | null) {
  const [data, setData] = useState<object | null>(
    name ? (illustrationCache[name] ?? null) : null,
  );
  useEffect(() => {
    if (!name) return setData(null);
    if (illustrationCache[name]) return setData(illustrationCache[name]!);
    let cancelled = false;
    setData(null);
    fetch(`/assets/lottie/tracking/${name}.json`)
      .then((response) => response.json())
      .then((json) => {
        illustrationCache[name] = json;
        if (!cancelled) setData(json);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [name]);
  return data;
}

const formatClock = (value?: string | null) => {
  const date = parseBackendDate(value);
  return date
    ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : null;
};

export default function TrackingStatusHero({
  order,
  trackingData,
  isPickup,
}: {
  order: IOrderTrackingDetail;
  trackingData?: IOrderTracking | null;
  isPickup: boolean;
}) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const status = order.orderStatus || "PENDING";
  const isCancelled = status === "CANCELLED";
  const isDone = status === "DELIVERED" || status === "COMPLETED";
  const eta = trackingData?.eta || order.eta;
  const etaWindow = formatEtaWindow(eta);
  const showEta =
    !isPickup &&
    ["ACCEPTED", "ASSIGNED", "PICKED", "ON_ROUTE"].includes(status) &&
    Boolean(etaWindow);

  const steps: Step[] = isPickup
    ? [
        {
          key: "placed",
          label: "Order placed",
          statuses: ["PENDING"],
          timestamp: order.createdAt || order.orderDate,
        },
        {
          key: "preparing",
          label: "Preparing",
          statuses: ["ACCEPTED", "ASSIGNED"],
          timestamp: order.acceptedAt,
        },
        {
          key: "ready",
          label: "Ready for pickup",
          statuses: ["PICKED", "ON_ROUTE"],
          timestamp: order.pickedAt,
        },
        {
          key: "collected",
          label: "Collected",
          statuses: ["DELIVERED", "COMPLETED"],
          timestamp: order.deliveredAt,
        },
      ]
    : [
        {
          key: "placed",
          label: "Order placed",
          statuses: ["PENDING"],
          timestamp: order.createdAt || order.orderDate,
        },
        {
          key: "preparing",
          label: "Preparing",
          statuses: ["ACCEPTED"],
          timestamp: order.acceptedAt,
        },
        {
          key: "assigned",
          label: "Rider assigned",
          statuses: ["ASSIGNED"],
          timestamp: order.assignedAt,
        },
        {
          key: "on-the-way",
          label: "On the way",
          statuses: ["PICKED", "ON_ROUTE"],
          timestamp: order.pickedAt,
        },
        {
          key: "delivered",
          label: "Delivered",
          statuses: ["DELIVERED", "COMPLETED"],
          timestamp: order.deliveredAt,
        },
      ];
  const currentIndex = isDone
    ? steps.length - 1
    : Math.max(
        steps.findIndex((step) => step.statuses.includes(status)),
        0,
      );

  const illustration: Illustration | null = isCancelled
    ? null
    : isDone
      ? "delivered"
      : status === "PENDING"
        ? "placed"
        : !isPickup && (status === "PICKED" || status === "ON_ROUTE")
          ? "on-the-way"
          : "preparing";
  const animationData = useIllustration(illustration);

  const getHeadline = () => {
    if (isCancelled) return "Order cancelled";
    if (isDone) return isPickup ? "Order collected" : "Order delivered";
    switch (status) {
      case "PENDING":
        return "Order received";
      case "ACCEPTED":
        return "Preparing your order";
      case "ASSIGNED":
        return isPickup ? "Preparing your order" : "Rider assigned";
      case "PICKED":
      case "ON_ROUTE":
        return isPickup ? "Ready for pickup" : "On the way to you";
      default:
        return "Processing your order";
    }
  };

  const getMessage = () => {
    if (isCancelled)
      return order.reason || "This order was cancelled. You won't be charged.";
    if (isDone) {
      const time = formatClock(order.deliveredAt);
      return isPickup
        ? `Picked up${time ? ` at ${time}` : ""}. Enjoy your meal!`
        : `Delivered${time ? ` at ${time}` : ""}. Enjoy your meal!`;
    }
    switch (status) {
      case "PENDING":
        return "We're confirming your order with the kitchen.";
      case "ACCEPTED": {
        const readyAt = parseBackendDate(eta?.readyAt);
        if (readyAt && readyAt.getTime() > now) {
          const minutes = Math.ceil((readyAt.getTime() - now) / 60000);
          return `The kitchen is preparing your food — ready in about ${minutes} min.`;
        }
        return readyAt
          ? "Preparation is taking a little longer than expected."
          : "The kitchen is preparing your food.";
      }
      case "ASSIGNED":
        return isPickup
          ? "The kitchen is preparing your food."
          : "A rider has been assigned and will pick up your order soon.";
      case "PICKED":
      case "ON_ROUTE": {
        if (isPickup) return "Your order is ready. Head over to collect it.";
        if (isTrackingLocationStale(trackingData?.riderLocation, eta, now)) {
          const updatedAt = formatEtaTime(
            trackingData?.riderLocation?.recordedAt || eta?.lastLocationAt,
          );
          return updatedAt
            ? `Rider location temporarily unavailable — last updated ${updatedAt}.`
            : "Rider location temporarily unavailable.";
        }
        return "Your rider has picked up your order and is heading your way.";
      }
      default:
        return "We're processing your order.";
    }
  };

  return (
    <section
      aria-label="Order status"
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_4px_16px_rgba(21,25,20,0.035)] dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex flex-col items-center gap-4 p-5 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-start">
        <div
          aria-hidden
          className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-primary-light/50 sm:h-36 sm:w-36 dark:bg-gray-900"
        >
          {isCancelled ? (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <FiX className="h-8 w-8" />
            </span>
          ) : animationData ? (
            <Lottie
              animationData={animationData}
              loop={!isDone}
              autoplay
              className="h-full w-full"
            />
          ) : (
            <span className="skeleton-surface h-20 w-20 animate-pulse rounded-full" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {!isCancelled && !isDone && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary-dark dark:bg-gray-900">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-color opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-color" />
                </span>
                Live
              </span>
            )}
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {isPickup ? "Pickup order" : "Delivery order"}
            </span>
          </div>
          <h1
            className={`mt-1.5 text-xl font-bold tracking-tight sm:text-2xl ${isCancelled ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}
          >
            {getHeadline()}
          </h1>
          <p
            className="mt-1 text-sm text-gray-600 dark:text-gray-300"
            aria-live="polite"
          >
            {getMessage()}
          </p>
          {showEta && (
            <div className="mt-3 inline-flex items-baseline gap-2 rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-900/60">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Estimated arrival
              </span>
              <span className="text-lg font-bold tabular-nums text-gray-900 dark:text-white">
                {etaWindow}
              </span>
            </div>
          )}
        </div>
      </div>

      {!isCancelled && (
        <ol className="flex border-t border-gray-100 px-3 py-4 sm:px-5 dark:border-gray-700">
          {steps.map((step, index) => {
            const isComplete = index < currentIndex || isDone;
            const isCurrent = index === currentIndex && !isDone;
            const time =
              isComplete || isCurrent ? formatClock(step.timestamp) : null;
            return (
              <li
                key={step.key}
                aria-current={isCurrent ? "step" : undefined}
                className="relative flex flex-1 flex-col items-center text-center"
              >
                {index > 0 && (
                  <span
                    aria-hidden
                    className={`absolute end-1/2 top-3.5 h-0.5 w-full -translate-y-1/2 ${index <= currentIndex || isDone ? "bg-primary-color" : "bg-gray-200 dark:bg-gray-700"}`}
                  />
                )}
                <span
                  className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                    isComplete
                      ? "border-primary-color bg-primary-color text-white"
                      : isCurrent
                        ? "border-primary-color bg-white text-primary-dark ring-4 ring-primary-color/20 dark:bg-gray-800"
                        : "border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800"
                  }`}
                >
                  {isComplete ? (
                    <FiCheck
                      aria-hidden
                      className="h-3.5 w-3.5"
                      strokeWidth={3}
                    />
                  ) : isCurrent ? (
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary-color" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  )}
                </span>
                <span
                  className={`mt-2 px-1 text-[11px] font-semibold leading-tight sm:text-xs ${isComplete || isCurrent ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}
                >
                  {step.label}
                </span>
                {time && (
                  <span className="mt-0.5 text-[10px] tabular-nums text-gray-500 sm:text-[11px] dark:text-gray-400">
                    {time}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
