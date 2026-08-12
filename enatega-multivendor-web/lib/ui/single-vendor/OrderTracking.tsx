"use client";
import { useQuery, useSubscription } from "@apollo/client";
import Link from "next/link";
import {
  SINGLE_VENDOR_ORDER_DETAILS,
  SINGLE_VENDOR_ORDER_STATUS,
  SINGLE_VENDOR_RECENT_ACTIVE_ORDER,
  SINGLE_VENDOR_TRACKING,
  SINGLE_VENDOR_TRACKING_UPDATED,
} from "@/lib/api/graphql/single-vendor";
import useCurrencyFormatter from "@/lib/hooks/useCurrencyFormatter";
import useUser from "@/lib/hooks/useUser";
import GoogleMapTrackingComponent from "@/lib/ui/screen-components/protected/order-tracking/components/gm-tracking-comp";
import { GoogleMapsContext } from "@/lib/context/global/google-maps.context";
import { useContext, useMemo } from "react";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import {
  formatEtaTime,
  formatEtaWindow,
  isTrackingLocationStale,
} from "@/lib/utils/methods/order-eta";
import {
  getSingleVendorTrackingStatus,
  isSingleVendorLiveTrackingStatus,
  SINGLE_VENDOR_TRACKING_STAGES,
} from "./orderTrackingStatus";

export default function SingleVendorOrderTracking({
  orderId,
}: {
  orderId: string;
}) {
  const { formatCurrency } = useCurrencyFormatter();
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
  const trackingEnabled =
    Boolean(trackingId) && isSingleVendorLiveTrackingStatus(orderStatus);
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
  const isPickupOrder =
    order?.deliveryType === "PICKUP" ||
    (!order?.deliveryType && Boolean(order?.isPickedUp));
  const destination = useMemo(() => {
    const etaDestination = eta?.destination;
    const etaLat = Number(etaDestination?.latitude);
    const etaLng = Number(etaDestination?.longitude);
    if (Number.isFinite(etaLat) && Number.isFinite(etaLng)) {
      return { lat: etaLat, lng: etaLng };
    }

    const coordinates = order?.deliveryAddress?.location?.coordinates;
    const lat = Number(coordinates?.[1]);
    const lng = Number(coordinates?.[0]);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  }, [eta?.destination, order?.deliveryAddress?.location?.coordinates]);
  // Only the dedicated tracking query/subscription is authoritative for the
  // live rider coordinate. ETA origin is route metadata, not rider GPS.
  const riderLocation = latest?.riderLocation || null;
  const hasBackendRoute = Boolean(eta?.encodedPolyline);
  const showLiveMap =
    !isPickupOrder &&
    Boolean(destination) &&
    isSingleVendorLiveTrackingStatus(status);
  const etaWindow = formatEtaWindow(eta);
  const trackingStale = isTrackingLocationStale(riderLocation, eta);
  const lastTrackingUpdate = formatEtaTime(
    riderLocation?.recordedAt || eta?.lastLocationAt,
  );
  const stageIndex = SINGLE_VENDOR_TRACKING_STAGES.indexOf(
    status as (typeof SINGLE_VENDOR_TRACKING_STAGES)[number],
  );
  if (details.loading || (isLegacyObjectId && legacyOrder.loading))
    return (
      <div className="h-96 animate-pulse rounded-3xl bg-gray-100 dark:bg-gray-800" />
    );
  if (!order)
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
          className="mt-5 inline-block rounded-full bg-primary-color px-5 py-2.5 font-semibold text-white"
        >
          View my orders
        </Link>
      </div>
    );
  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">Order</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            #{order.orderId}
          </h1>
        </div>
        <span className="rounded-full bg-primary-light px-4 py-2 font-semibold text-primary-color">
          {status}
        </span>
      </div>
      {showLiveMap && destination && (
        <section className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-4 dark:border-gray-700">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                Live delivery tracking
              </h2>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Your courier location and route update automatically.
              </p>
            </div>
            {GOOGLE_MAPS_KEY && riderLocation && hasBackendRoute && (
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary-color dark:bg-gray-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary-color" />
                {trackingStale ? "Last known location" : "Live"}
              </span>
            )}
          </div>
          {!GOOGLE_MAPS_KEY ? (
            <TrackingUnavailable message="The interactive map is not configured. Add the shared Google Maps browser key to enable live tracking." />
          ) : mapLoadError ? (
            <TrackingUnavailable message="Google Maps could not be loaded. Check that the shared browser key allows this web origin and has Maps JavaScript API enabled." />
          ) : !riderLocation ? (
            <TrackingUnavailable message="Waiting for the rider’s first GPS location…" />
          ) : !hasBackendRoute ? (
            <TrackingUnavailable message="The backend is calculating the road route from the rider to your address…" />
          ) : (
            <GoogleMapTrackingComponent
              isLoaded={isLoaded}
              destination={destination}
              eta={eta}
              riderLocation={riderLocation}
              requireBackendRoute
              showStaticLoadingImage={false}
            />
          )}
        </section>
      )}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-bold dark:text-white">
            Delivery progress
          </h2>
          <div className="mt-6 space-y-5">
            {SINGLE_VENDOR_TRACKING_STAGES.map((stage, index) => (
              <div key={stage} className="flex items-center gap-4">
                <div
                  className={`h-4 w-4 rounded-full ${index <= stageIndex ? "bg-primary-color" : "bg-gray-200 dark:bg-gray-600"}`}
                />
                <span
                  className={
                    index <= stageIndex
                      ? "font-semibold text-gray-900 dark:text-white"
                      : "text-gray-400"
                  }
                >
                  {stage.charAt(0) + stage.slice(1).toLowerCase()}
                </span>
              </div>
            ))}
          </div>
          {eta && (
            <div className="mt-8 rounded-xl bg-primary-light p-4 text-primary-color dark:bg-gray-700">
              <p className="text-sm font-semibold">Estimated arrival</p>
              <p className="mt-1 text-xl font-bold">
                {etaWindow ||
                  formatEtaTime(eta.estimatedArrivalAt) ||
                  "Calculating…"}
              </p>
              <p className="mt-1 text-sm">
                {trackingStale && lastTrackingUpdate
                  ? `Rider location temporarily unavailable — last updated ${lastTrackingUpdate}`
                  : isSingleVendorLiveTrackingStatus(status)
                    ? "Your order is on the way."
                    : "We’re updating your delivery estimate."}
              </p>
            </div>
          )}
        </section>
        <aside className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="font-bold dark:text-white">Order summary</h2>
          <div className="my-4 space-y-3">
            {order.items?.map((item: any) => (
              <div
                key={item._id}
                className="flex justify-between text-sm text-gray-600 dark:text-gray-300"
              >
                <span>
                  {item.quantity} × {item.title}
                </span>
                <span>{item.variation?.title}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t pt-4 font-bold dark:border-gray-700 dark:text-white">
            <span>Total</span>
            <span>{formatCurrency(order.orderAmount)}</span>
          </div>
          {order.rider?.phone && (
            <a
              href={`tel:${order.rider.phone}`}
              className="mt-5 block w-full rounded-full bg-primary-color py-3 text-center font-semibold text-white"
            >
              Contact courier
            </a>
          )}
          <Link
            href="/profile/getHelp"
            className="mt-3 block text-center text-sm text-primary-color"
          >
            Get help
          </Link>
        </aside>
      </div>
    </div>
  );
}

function TrackingUnavailable({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center bg-gray-50 px-6 text-center dark:bg-gray-900">
      <div className="max-w-md">
        <p className="font-semibold text-gray-800 dark:text-gray-100">
          Live route temporarily unavailable
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>
      </div>
    </div>
  );
}
