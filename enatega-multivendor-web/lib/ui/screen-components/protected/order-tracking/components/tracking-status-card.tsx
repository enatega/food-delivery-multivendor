"use client"
import React from "react"
import { IOrderTrackingDetail } from "@/lib/utils/interfaces/order-tracking-detail.interface"
import { useTranslations } from "next-intl"

interface TrackingStatusCardProps {
  orderTrackingDetails: IOrderTrackingDetail
}

function TrackingStatusCard({ orderTrackingDetails }: TrackingStatusCardProps) {
  const t = useTranslations()
  // Helper to determine the step status
  const getStepStatus = (stepIndex: number) => {
    const STATUS_ORDER = [
      "PENDING",
      "ACCEPTED",
      "ASSIGNED",
      "PICKED",
      "DELIVERED",
    ]
    const currentStatus = orderTrackingDetails?.orderStatus || "PENDING"

    if (currentStatus === "CANCELLED") {
      return "inactive"
    }

    // Special case: When order is DELIVERED, mark all steps as completed
    if (currentStatus === "DELIVERED" || currentStatus === "COMPLETED") {
      return "completed"
    }

    const currentStatusIndex = STATUS_ORDER.indexOf(currentStatus)

    if (currentStatusIndex === -1) return "inactive"

    if (stepIndex < currentStatusIndex) {
      return "completed" // Steps before current status
    } else if (stepIndex === currentStatusIndex) {
      return "active" // Current step
    } else {
      return "inactive" // Future steps
    }
  }

  // Get dynamic estimated delivery time
  const getEstimatedDeliveryTime = () => {
    if (!orderTrackingDetails?.createdAt) return "20 - 30 min"

    const selectedPrepTime = orderTrackingDetails.selectedPrepTime || 0

    // Format a date to HH:MM format
    const formatTimeHHMM = (date: Date) => {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    // Handle different order statuses according to specified requirements
    switch (orderTrackingDetails.orderStatus) {
      case "PENDING":
        // For PENDING, show when the order was placed
        if (orderTrackingDetails.createdAt) {
          const createdTime = new Date(orderTrackingDetails.createdAt)
          return formatTimeHHMM(createdTime)
        }
        return "20 - 30 min" // Fallback

      case "ACCEPTED":
        // For ACCEPTED, show the range [(selectedPrepTime - 10) - selectedPrepTime] minutes
        if (selectedPrepTime > 0) {
          const minTime = Math.max(0, selectedPrepTime - 10)
          return `${minTime} - ${selectedPrepTime} min`
        }
        return "20 - 30 min" // Fallback

      case "PICKED":
        // For PICKED, show the exact time when rider picked up the order
        if (orderTrackingDetails.pickedAt) {
          const pickedTime = new Date(orderTrackingDetails.pickedAt)
          return formatTimeHHMM(pickedTime)
        }
        return "10 - 15 min" // Fallback

      case "DELIVERED":
      case "COMPLETED":
        // For DELIVERED, show the exact delivery time
        if (orderTrackingDetails.deliveredAt) {
          const deliveredTime = new Date(orderTrackingDetails.deliveredAt)
          return formatTimeHHMM(deliveredTime)
        }
        return "Delivered" // Fallback

      case "CANCELLED":
        // For CANCELLED, show the cancellation time
        if (orderTrackingDetails.cancelledAt) {
          const cancelledTime = new Date(orderTrackingDetails.cancelledAt)
          return formatTimeHHMM(cancelledTime)
        }
        return "Cancelled" // Fallback

      case "ASSIGNED":
        // For ASSIGNED, use the assigned time or expected delivery time
        if (orderTrackingDetails.assignedAt) {
          const assignedTime = new Date(orderTrackingDetails.assignedAt)
          return formatTimeHHMM(assignedTime)
        }
        // Fallback to the selectedPrepTime if available
        if (selectedPrepTime > 0) {
          const minTime = Math.max(0, selectedPrepTime - 10)
          return `${minTime} - ${selectedPrepTime} min`
        }
        return "15 - 25 min" // Default fallback

      default:
        return "20 - 30 min" // Default fallback for unknown status
    }
  }

  const StoreType = localStorage.getItem("currentShopType") || "store"

  const isRestaurant = StoreType.toLowerCase() === "restaurant"

  const getStatusMessage = () => {
    const status = orderTrackingDetails?.orderStatus
    const now = new Date()

    switch (status) {
      case "PENDING":
        return isRestaurant ? t("PendingRestaurant") : t("PendingStore")

      case "ACCEPTED": {
        if (orderTrackingDetails.preparationTime) {
          const prepTime = new Date(orderTrackingDetails.preparationTime)
          if (prepTime > now) {
            const minLeft = Math.ceil(
              (prepTime.getTime() - now.getTime()) / 60000
            )
            const riderMessage = orderTrackingDetails.isPickedUp
              ? ""
              : t.raw("Assigned")
            return isRestaurant
              ? t("AcceptedRestaurantPrep", { min: minLeft, riderMessage })
              : t("AcceptedStorePrep", { min: minLeft, riderMessage })
          }
        }

        if (orderTrackingDetails.acceptedAt) {
          const acceptedTime = new Date(orderTrackingDetails.acceptedAt)
          const timeElapsed = Math.floor(
            (now.getTime() - acceptedTime.getTime()) / 60000
          )
          const riderMessage = orderTrackingDetails.isPickedUp
            ? ""
            : t.raw("Assigned")
          return isRestaurant
            ? t("AcceptedRestaurantElapsed", { min: timeElapsed, riderMessage })
            : t("AcceptedStoreElapsed", { min: timeElapsed, riderMessage })
        }

        const riderMessage = orderTrackingDetails.isPickedUp
          ? ""
          : t("Assigned")
        return isRestaurant
          ? t("AcceptedRestaurantSimple", { riderMessage })
          : t("AcceptedStoreSimple", { riderMessage })
      }
      case "ASSIGNED": {
        return t("Assigned")
      }
      case "PICKED": {
        if (orderTrackingDetails.pickedAt) {
          const pickedTime = new Date(orderTrackingDetails.pickedAt)
          const timeElapsed = Math.floor(
            (now.getTime() - pickedTime.getTime()) / 60000
          )
          return t("PickedElapsed", { min: timeElapsed })
        }
        return t("Picked")
      }
      case "DELIVERED": {
        if (orderTrackingDetails.deliveredAt) {
          const deliveredTime = new Date(orderTrackingDetails.deliveredAt)
          const deliveredString = deliveredTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          return isRestaurant
            ? t("DeliveredRestaurant", { time: deliveredString })
            : t("DeliveredStore", { time: deliveredString })
        }
        return isRestaurant
          ? t("DeliveredSimpleRestaurant")
          : t("DeliveredSimpleStore")
      }
      case "COMPLETED": {
        return t("Completed")
      }
      case "CANCELLED": {
        return orderTrackingDetails.reason || t("Cancelled")
      }
      default:
        return t("Processing")
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm sm:text-base font-semibold">
          {orderTrackingDetails.orderStatus === "DELIVERED"
            ? "Delivered"
            : t("estimated_Delivery_time")}
        </h3>

        {orderTrackingDetails.orderStatus === "CANCELLED" && (
          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs">
            {t("order_status_cancelled_label")}
          </span>
        )}
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
            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
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
            <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
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
            <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
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
        <div className="text-xl sm:text-2xl font-bold dark:text-white">
          {getEstimatedDeliveryTime()}
        </div>
      </div>

      {/* Segmented Progress Bars */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[0, 1, 2, 3, 4].map((index) => {
          const status = getStepStatus(index)
          return (
            <div
              key={index}
              className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  status === "completed"
                    ? "bg-green-500"
                    : status === "active"
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-200"
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
          )
        })}
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{getStatusMessage()}</p>

      {/* Real-time update indicator */}
      {orderTrackingDetails.orderStatus !== "DELIVERED" &&
        orderTrackingDetails.orderStatus !== "COMPLETED" &&
        orderTrackingDetails.orderStatus !== "CANCELLED" && (
          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            {t("live_updates_enabled_label")}
          </div>
        )}
    </div>
  )
}

export default TrackingStatusCard
