"use client";
import React, { useEffect, useState } from "react";
import { IOrderTrackingDetail } from "@/lib/utils/interfaces/order-tracking-detail.interface";
import type { IOrderTracking } from "@/lib/utils/interfaces/orders.interface";
import { useTranslations } from "next-intl";
import {
  formatEtaTime,
  formatEtaWindow,
  isTrackingLocationStale,
  parseBackendDate,
} from "@/lib/utils/methods/order-eta";

interface TrackingStatusCardProps {
  orderTrackingDetails: IOrderTrackingDetail;
  trackingData?: IOrderTracking | null;
}

function TrackingStatusCard({
  orderTrackingDetails,
  trackingData,
}: TrackingStatusCardProps) {
  const t = useTranslations();
  const [now, setNow] = useState(Date.now());
  const eta = trackingData?.eta || orderTrackingDetails.eta;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  // Helper to determine the step status
  const getStepStatus = (stepIndex: number) => {
    const STATUS_ORDER = [
      "PENDING",
      "ACCEPTED",
      "ASSIGNED",
      "PICKED",
      "ON_ROUTE",
      "DELIVERED",
    ];
    const currentStatus = orderTrackingDetails?.orderStatus || "PENDING";

    if (currentStatus === "CANCELLED") {
      return "inactive";
    }

    // Special case: When order is DELIVERED, mark all steps as completed
    if (currentStatus === "DELIVERED" || currentStatus === "COMPLETED") {
      return "completed";
    }

    const currentStatusIndex = STATUS_ORDER.indexOf(currentStatus);

    if (currentStatusIndex === -1) return "inactive";

    if (stepIndex < currentStatusIndex) {
      return "completed"; // Steps before current status
    } else if (stepIndex === currentStatusIndex) {
      return "active"; // Current step
    } else {
      return "inactive"; // Future steps
    }
  };

  const etaWindow = formatEtaWindow(eta);
  const showEta =
    !orderTrackingDetails.isPickedUp &&
    ["ACCEPTED", "ASSIGNED", "PICKED", "ON_ROUTE"].includes(
      orderTrackingDetails.orderStatus,
    ) &&
    Boolean(etaWindow);
  const isRestaurant =
    orderTrackingDetails.restaurant?.shopType?.toLowerCase() !== "grocery";

  const getStatusMessage = () => {
    const status = orderTrackingDetails?.orderStatus;
    const nowDate = new Date(now);

    switch (status) {
      case "PENDING":
        return isRestaurant ? t("PendingRestaurant") : t("PendingStore");

      case "ACCEPTED": {
        const readyAt = parseBackendDate(eta?.readyAt);
        if (readyAt) {
          if (readyAt > nowDate) {
            const minLeft = Math.ceil(
              (readyAt.getTime() - nowDate.getTime()) / 60000,
            );
            return isRestaurant
              ? t("AcceptedRestaurantPrep", { min: minLeft, riderMessage: "" })
              : t("AcceptedStorePrep", { min: minLeft, riderMessage: "" });
          }
          return "Preparation is taking a little longer.";
        }
        return isRestaurant
          ? t("AcceptedRestaurantSimple", { riderMessage: "" })
          : t("AcceptedStoreSimple", { riderMessage: "" });
      }
      case "ASSIGNED": {
        const readyAt = parseBackendDate(eta?.readyAt);
        if (readyAt && readyAt.getTime() <= now) {
          return "Preparation is taking a little longer. Your rider is assigned.";
        }
        return t("Assigned");
      }
      case "PICKED": {
        if (isTrackingLocationStale(trackingData?.riderLocation, eta, now)) {
          const updatedAt = formatEtaTime(
            trackingData?.riderLocation?.recordedAt || eta?.lastLocationAt,
          );
          return updatedAt
            ? `Rider location temporarily unavailable — last updated ${updatedAt}.`
            : "Rider location temporarily unavailable.";
        }
        return t("Picked");
      }
      case "ON_ROUTE": {
        return t("Picked");
      }
      case "DELIVERED": {
        const deliveredTime = parseBackendDate(
          orderTrackingDetails.deliveredAt,
        );
        if (deliveredTime) {
          const deliveredString = deliveredTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          return isRestaurant
            ? t("DeliveredRestaurant", { time: deliveredString })
            : t("DeliveredStore", { time: deliveredString });
        }
        return isRestaurant
          ? t("DeliveredSimpleRestaurant")
          : t("DeliveredSimpleStore");
      }
      case "COMPLETED": {
        return t("Completed");
      }
      case "CANCELLED": {
        return orderTrackingDetails.reason || t("Cancelled");
      }
      default:
        return t("Processing");
    }
  };
  const currentStatusLabel = orderTrackingDetails.orderStatus
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (character) => character.toUpperCase());

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-3">
        {showEta ? (
          <h3 className="text-sm sm:text-base font-semibold dark:text-white">
            {t("estimated_Delivery_time")}
          </h3>
        ) : (
          <span />
        )}

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            orderTrackingDetails.orderStatus === "CANCELLED"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : "bg-primary-light text-secondary-color dark:bg-[#2E3B23] dark:text-primary-color"
          }`}
        >
          {orderTrackingDetails.orderStatus === "CANCELLED"
            ? t("order_status_cancelled_label")
            : currentStatusLabel}
        </span>
      </div>

      {/* Status indicator with icon */}
      <div className="flex items-center mb-3">
        {/* Status icon based on order status */}
        <div className="mr-3 rtl:ml-3">
          {orderTrackingDetails.orderStatus === "PENDING" && (
            <div className="w-8 h-8 flex items-center justify-center bg-orange-100 dark:bg-orange-900 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-orange-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {orderTrackingDetails.orderStatus === "ACCEPTED" && (
            <div className="w-8 h-8 flex items-center justify-center bg-primary-light dark:bg-[#2E3B23] rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-secondary-color"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {orderTrackingDetails.orderStatus === "ASSIGNED" && (
            <div className="w-8 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          )}
          {orderTrackingDetails.orderStatus === "PICKED" && (
            <div className="w-8 h-8 flex items-center justify-center bg-primary-light dark:bg-primary-light rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary-color"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
            </div>
          )}
          {(orderTrackingDetails.orderStatus === "DELIVERED" ||
            orderTrackingDetails.orderStatus === "COMPLETED") && (
            <div className="w-8 h-8 flex items-center justify-center bg-primary-color dark:bg-primary-light rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {orderTrackingDetails.orderStatus === "CANCELLED" && (
            <div className="w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-900 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        {showEta && (
          <div className="text-xl sm:text-2xl font-bold dark:text-white">
            {etaWindow}
          </div>
        )}
      </div>

      {/* Segmented Progress Bars */}
      <div
        className="mb-4 grid grid-cols-6 gap-2"
        aria-label={`Delivery progress: ${currentStatusLabel}`}
      >
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const status = getStepStatus(index);
          return (
            <div
              key={index}
              className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  status === "completed"
                    ? "bg-primary-color"
                    : status === "active"
                      ? "bg-primary-color animate-pulse"
                      : "bg-gray-200 dark:bg-gray-700"
                }`}
                style={{
                  width:
                    status === "completed"
                      ? "100%"
                      : status === "active"
                        ? "75%"
                        : "0%",
                }}
              />
            </div>
          );
        })}
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
        {getStatusMessage()}
      </p>

      {/* Real-time update indicator */}
      {orderTrackingDetails.orderStatus !== "DELIVERED" &&
        orderTrackingDetails.orderStatus !== "COMPLETED" &&
        orderTrackingDetails.orderStatus !== "CANCELLED" && (
          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 bg-primary-color rounded-full mr-2 animate-pulse"></span>
            {t("live_updates_enabled_label")}
          </div>
        )}
    </div>
  );
}

export default TrackingStatusCard;
