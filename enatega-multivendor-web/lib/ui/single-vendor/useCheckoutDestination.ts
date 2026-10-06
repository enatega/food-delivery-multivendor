"use client";

import { useUserAddress } from "@/lib/context/address/address.context";
import useUser from "@/lib/hooks/useUser";

const toCheckoutCoordinate = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
};

/**
 * Delivery destination used to price a single-vendor checkout. Shared by the
 * checkout page and the cart's prefetch so both request the same
 * calculateCheckout cache entry.
 */
export default function useCheckoutDestination() {
  const { profile } = useUser();
  const { userAddress } = useUserAddress();
  const profileAddress =
    profile?.addresses?.find((item) => item.selected) ??
    profile?.addresses?.[0];
  const userAddressCoordinates = userAddress?.location?.coordinates;
  const hasUserAddressCoordinates =
    toCheckoutCoordinate(userAddressCoordinates?.[1]) !== null &&
    toCheckoutCoordinate(userAddressCoordinates?.[0]) !== null;
  const address = hasUserAddressCoordinates ? userAddress : profileAddress;
  const coordinates = address?.location?.coordinates ?? [];
  const latitude = toCheckoutCoordinate(coordinates[1]);
  const longitude = toCheckoutCoordinate(coordinates[0]);

  return {
    address,
    latitude,
    longitude,
    hasDeliveryCoordinates: latitude !== null && longitude !== null,
  };
}
