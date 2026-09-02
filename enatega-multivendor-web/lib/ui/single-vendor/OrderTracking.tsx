"use client";

import { useQuery, useSubscription } from "@apollo/client";
import { useContext, useMemo } from "react";
import Link from "next/link";

import {
  SINGLE_VENDOR_ORDER_DETAILS,
  SINGLE_VENDOR_ORDER_STATUS,
  SINGLE_VENDOR_RECENT_ACTIVE_ORDER,
  SINGLE_VENDOR_TRACKING,
  SINGLE_VENDOR_TRACKING_UPDATED,
} from "@/lib/api/graphql/single-vendor";
import { GoogleMapsContext } from "@/lib/context/global/google-maps.context";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import useUser from "@/lib/hooks/useUser";
import GoogleMapTrackingComponent from "@/lib/ui/screen-components/protected/order-tracking/components/gm-tracking-comp";
import TrackingHelpCard from "@/lib/ui/screen-components/protected/order-tracking/components/tracking-help-card";
import TrackingOrderDetails from "@/lib/ui/screen-components/protected/order-tracking/components/tracking-order-details";
import TrackingStatusCard from "@/lib/ui/screen-components/protected/order-tracking/components/tracking-status-card";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import type { IOrderTrackingDetail } from "@/lib/utils/interfaces/order-tracking-detail.interface";
import type { IOrderTracking } from "@/lib/utils/interfaces/orders.interface";
import {
  getSingleVendorTrackingStatus,
  isSingleVendorLiveTrackingStatus,
} from "./orderTrackingStatus";
import {
  getGeoJsonCoordinate,
  getSingleVendorTrackingAmounts,
  normalizeSingleVendorTrackingOrder,
} from "./singleVendorOrderTracking";

export default function SingleVendorOrderTracking({
  orderId,
}: {
  orderId: string;
}) {
  const { profile } = useUser();
  const { isLoaded, loadError: mapLoadError } = useContext(GoogleMapsContext);
  const { GOOGLE_MAPS_KEY } = useConfig();
  const isLegacyObjectId = /^[a-f\d]{24}$/i.test(orderId);
  const legacyOrder = useQuery(SINGLE_VENDOR_RECENT_ACTIVE_ORDER, {
    skip: !isLegacyObjectId,
    fetchPolicy: "network-only",
  });
  const recentOrder = legacyOrder.data?.recentActiveOrder?.rawOrder;
  const resolvedOrderId = isLegacyObjectId
    ? recentOrder?._id === orderId
      ? recentOrder.orderId
      : ""
    : orderId;
  const details = useQuery(SINGLE_VENDOR_ORDER_DETAILS, {
    variables: { orderId: resolvedOrderId },
    skip: !resolvedOrderId,
    fetchPolicy: "network-only",
  });
  const initialOrder = details.data?.orderDetailsPage?.rawOrder;
  const summaryData = details.data?.orderDetailsPage?.data;
  const orderUpdate = useSubscription(SINGLE_VENDOR_ORDER_STATUS, {
    variables: { userId: profile?._id || "" },
    skip: !profile?._id,
  });
  const subscribedOrder = orderUpdate.data?.orderStatusChanged?.rawOrder;
  const matchesTrackedOrder =
    subscribedOrder &&
    initialOrder &&
    (String(subscribedOrder._id) === String(initialOrder._id) ||
      String(subscribedOrder.orderId) === String(initialOrder.orderId));
  const order = matchesTrackedOrder
    ? { ...initialOrder, ...subscribedOrder }
    : initialOrder;
  const orderStatus = getSingleVendorTrackingStatus(order);
  const trackingId = order?._id;
  const isCustomerPickup =
    order?.deliveryType === "PICKUP" ||
    (!order?.deliveryType && Boolean(order?.isPickedUp));
  const trackingEnabled =
    Boolean(trackingId) &&
    !isCustomerPickup &&
    isSingleVendorLiveTrackingStatus(orderStatus);
  const tracking = useQuery(SINGLE_VENDOR_TRACKING, {
    variables: { id: trackingId || "" },
    skip: !trackingEnabled,
    fetchPolicy: "network-only",
  });
  const live = useSubscription(SINGLE_VENDOR_TRACKING_UPDATED, {
    variables: { id: trackingId || "" },
    skip: !trackingEnabled,
  });
  const latest =
    live.data?.subscriptionOrderTracking ?? tracking.data?.orderTracking;
  const status =
    getSingleVendorTrackingStatus({
      ...order,
      orderStatus: latest?.status || order?.orderStatus,
    }) || "PENDING";
  const eta = latest?.eta || order?.eta;
  const destination = useMemo(() => {
    const etaLatitudeValue = eta?.destination?.latitude;
    const etaLongitudeValue = eta?.destination?.longitude;
    const etaLatitude = Number(etaLatitudeValue);
    const etaLongitude = Number(etaLongitudeValue);
    if (
      etaLatitudeValue !== null &&
      etaLatitudeValue !== undefined &&
      etaLongitudeValue !== null &&
      etaLongitudeValue !== undefined &&
      Number.isFinite(etaLatitude) &&
      Number.isFinite(etaLongitude)
    ) {
      return { lat: etaLatitude, lng: etaLongitude };
    }

    return getGeoJsonCoordinate(order?.deliveryAddress?.location);
  }, [eta?.destination, order?.deliveryAddress?.location]);
  const storeLocation = useMemo(() => {
    const restaurantLocation = getGeoJsonCoordinate(
      order?.restaurant?.location,
    );
    if (restaurantLocation) return restaurantLocation;

    const etaLatitudeValue = eta?.origin?.latitude;
    const etaLongitudeValue = eta?.origin?.longitude;
    const etaLatitude = Number(etaLatitudeValue);
    const etaLongitude = Number(etaLongitudeValue);
    return etaLatitudeValue !== null &&
      etaLatitudeValue !== undefined &&
      etaLongitudeValue !== null &&
      etaLongitudeValue !== undefined &&
      Number.isFinite(etaLatitude) &&
      Number.isFinite(etaLongitude)
      ? { lat: etaLatitude, lng: etaLongitude }
      : null;
  }, [eta?.origin, order?.restaurant?.location]);
  const riderLocation = latest?.riderLocation || null;
  const normalizedOrder = useMemo(
    () =>
      order
        ? normalizeSingleVendorTrackingOrder(order, summaryData, status, eta)
        : null,
    [eta, order, status, summaryData],
  );
  const summaryAmounts = useMemo(
    () =>
      normalizedOrder ? getSingleVendorTrackingAmounts(normalizedOrder) : null,
    [normalizedOrder],
  );
  const trackingData = useMemo(
    () =>
      ({
        ...latest,
        eta,
        riderLocation,
      }) as IOrderTracking,
    [eta, latest, riderLocation],
  );
  const showLiveMap = trackingEnabled && Boolean(destination);

  if (details.loading || (isLegacyObjectId && legacyOrder.loading)) {
    return (
      <div className="w-screen pb-20 dark:bg-gray-900">
        <div className="skeleton-surface h-[400px] animate-pulse" />
        <PaddingContainer className="mt-8">
          <div className="skeleton-surface h-44 max-w-2xl animate-pulse rounded-xl" />
        </PaddingContainer>
      </div>
    );
  }

  if (!order || !normalizedOrder || !summaryAmounts) {
    return (
      <div className="mx-auto my-12 max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/20">
        <p className="font-semibold text-red-600 dark:text-red-300">
          This order could not be loaded.
        </p>
        <p className="mt-2 text-sm text-red-500 dark:text-red-400">
          Open your active orders to use the latest tracking link.
        </p>
        <Link
          href="/profile/order-history"
          className="mt-5 inline-block rounded-xl bg-primary-color px-5 py-2.5 font-semibold text-dispatch-ink"
        >
          View my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-screen flex-col bg-dispatch-ground pb-20 text-dispatch-ink dark:bg-gray-900 dark:text-gray-100">
      <div className="scrollable-container flex-1">
        {showLiveMap && (
          <section aria-label="Order locations and delivery route">
            {!GOOGLE_MAPS_KEY ? (
              <TrackingUnavailable message="The interactive map is not configured." />
            ) : mapLoadError ? (
              <TrackingUnavailable message="Google Maps could not be loaded. Please try again." />
            ) : destination ? (
              <GoogleMapTrackingComponent
                isLoaded={isLoaded}
                destination={destination}
                origin={storeLocation}
                eta={trackingEnabled ? eta : null}
                riderLocation={riderLocation}
                requireBackendRoute={trackingEnabled && Boolean(riderLocation)}
                showStaticLoadingImage={false}
              />
            ) : (
              <TrackingUnavailable message="The customer location is unavailable for this order." />
            )}
          </section>
        )}

        <div className="mt-8 md:mt-10">
          <PaddingContainer>
            <div className="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
              <TrackingStatusCard
                orderTrackingDetails={normalizedOrder as IOrderTrackingDetail}
                trackingData={trackingData}
              />

              <div className="w-full md:w-auto md:flex-none">
                <TrackingHelpCard />
                {normalizedOrder.rider?.phone && (
                  <a
                    href={`tel:${normalizedOrder.rider.phone}`}
                    className="mt-3 block min-h-11 w-full rounded-xl bg-primary-color px-5 py-3 text-center text-sm font-semibold text-dispatch-ink transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus md:max-w-xs"
                  >
                    Contact courier
                  </a>
                )}
              </div>
            </div>

            <div className="flex justify-center md:justify-start">
              <TrackingOrderDetails
                orderTrackingDetails={normalizedOrder as IOrderTrackingDetail}
                summaryAmounts={summaryAmounts}
                showCancelAction={false}
              />
            </div>
          </PaddingContainer>
        </div>
      </div>
    </div>
  );
}

function TrackingUnavailable({ message }: { message: string }) {
  return (
    <div className="flex h-[400px] items-center justify-center bg-dispatch-map px-6 text-center dark:bg-gray-950">
      <div className="max-w-md">
        <i
          className="pi pi-map-marker text-2xl text-primary-color"
          aria-hidden
        />
        <p className="mt-3 font-semibold text-dispatch-ink dark:text-gray-100">
          Map temporarily unavailable
        </p>
        <p className="mt-2 text-sm text-dispatch-muted dark:text-gray-400">
          {message}
        </p>
      </div>
    </div>
  );
}
