"use client";

import { getImageProps } from "next/image";

import { GET_CONFIG } from "@/lib/api/graphql/queries";
import {
  SINGLE_VENDOR_CONFIGURATION,
  SINGLE_VENDOR_DISCOVERY,
} from "@/lib/api/graphql/single-vendor";
import { getApolloClient } from "@/lib/hooks/useSetApollo";
import { APP_MODES, getModeEnvironment } from "@/lib/mode";
import { normalizeMediaUrl } from "@/lib/utils/media-url";

// Must match the variables used by SingleVendorDiscovery so the prefetched
// result is the cache entry the page reads.
export const SINGLE_VENDOR_DISCOVERY_VARIABLES = {
  previewLimit: 10,
  dealLimit: 20,
};

// Must match the `sizes` of the rendered images so the browser picks (and
// caches) the same srcset candidate the page will request.
const BANNER_SIZES = "(max-width: 1024px) 100vw, 84vw";
const CATEGORY_SIZES =
  "(max-width: 320px) 92vw, (max-width: 425px) 46vw, (max-width: 640px) 31vw, (max-width: 1024px) 16vw, (max-width: 1280px) 14vw, (max-width: 1536px) 12vw, 10vw";
const PRODUCT_SIZES = "(max-width: 640px) 50vw, 20vw";

const PRODUCTS_PER_SECTION = 5;
const REFRESH_AFTER_MS = 60_000;
// Same check as the banner carousel, which renders these as <video>.
const VIDEO_FILE = /\.mp4|\.webm|video/;

let lastPrefetchAt = 0;
let inFlight: Promise<void> | null = null;
const preloadedImages = new Set<string>();

function preloadImage(source: string | undefined, sizes: string) {
  if (!source || VIDEO_FILE.test(source)) return;
  const src = normalizeMediaUrl(
    source,
    getModeEnvironment(APP_MODES.SINGLE).restUrl,
  );
  if (!src || preloadedImages.has(src)) return;
  preloadedImages.add(src);

  try {
    const { props } = getImageProps({ src, alt: "", fill: true, sizes });
    const image = new window.Image();
    image.decoding = "async";
    if (props.sizes) image.sizes = props.sizes;
    if (props.srcSet) image.srcset = props.srcSet;
    image.src = props.src;
  } catch {
    // Host not allowed by next/image; the page will fall back on its own.
    preloadedImages.delete(src);
  }
}

function preloadDiscoveryImages(discovery: any) {
  if (!discovery) return;
  discovery.banners?.forEach((banner: any) =>
    preloadImage(banner?.file, BANNER_SIZES),
  );
  discovery.categories?.forEach((category: any) =>
    preloadImage(category?.image || category?.icon, CATEGORY_SIZES),
  );
  [
    discovery.deals?.limitedTime?.items,
    discovery.deals?.weekly?.items,
    ...(discovery.categories || []).map((category: any) => category?.items),
  ].forEach((items: any[] | undefined) =>
    items
      ?.slice(0, PRODUCTS_PER_SECTION)
      .forEach((item) => preloadImage(item?.image, PRODUCT_SIZES)),
  );
}

/**
 * Warms the single-vendor Apollo cache (configuration + discovery) and the
 * browser image cache while the user is still in multivendor mode, so the
 * Discovery page renders immediately after toggling.
 */
export function prefetchSingleVendorDiscovery(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (inFlight) return inFlight;
  if (Date.now() - lastPrefetchAt < REFRESH_AFTER_MS) return Promise.resolve();

  const client = getApolloClient(APP_MODES.SINGLE);
  inFlight = Promise.allSettled([
    client.query({
      query: SINGLE_VENDOR_DISCOVERY,
      variables: SINGLE_VENDOR_DISCOVERY_VARIABLES,
      fetchPolicy: "network-only",
    }),
    client.query({ query: SINGLE_VENDOR_CONFIGURATION }),
    client.query({
      query: GET_CONFIG,
      context: { appMode: APP_MODES.MULTI },
    }),
  ])
    .then(([discovery]) => {
      if (discovery.status === "fulfilled") {
        lastPrefetchAt = Date.now();
        preloadDiscoveryImages(discovery.value.data?.singleVendorDiscovery);
      }
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}
