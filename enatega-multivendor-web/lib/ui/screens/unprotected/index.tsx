"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  FiArrowUpRight,
  FiClock,
  FiMapPin,
  FiNavigation,
  FiStar,
} from "react-icons/fi";

import { FETCH_ALL_SHOP_TYPES } from "@/lib/api/graphql/queries/shop-type";
import { useUserAddress } from "@/lib/context/address/address.context";
import useLocation from "@/lib/hooks/useLocation";
import useNearByRestaurantsPreview from "@/lib/hooks/useNearByRestaurantsPreview";
import useSetUserCurrentLocation from "@/lib/hooks/useSetUserCurrentLocation";
import type { IRestaurant } from "@/lib/utils/interfaces/restaurants.interface";
import { isRestaurantOpen } from "@/lib/utils/constants/isRestaurantOpen";
import HomeSearch from "@/lib/ui/useable-components/Home-search";
import Image from "@/lib/ui/useable-components/safe-image";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";

function vendorHref(vendor: IRestaurant) {
  const segment = vendor.shopType === "restaurant" ? "restaurant" : "store";
  return `/${segment}/${vendor.slug}/${vendor._id}`;
}

function VendorMeta({ vendor }: { vendor: IRestaurant }) {
  const t = useTranslations();
  const open = isRestaurantOpen(vendor);

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dispatch-muted">
      {vendor.deliveryTime != null && (
        <span className="inline-flex items-center gap-1 tabular-nums">
          <FiClock aria-hidden />
          {vendor.deliveryTime} {t("min_label")}
        </span>
      )}
      {vendor.reviewAverage != null && (
        <span className="inline-flex items-center gap-1 tabular-nums">
          <FiStar aria-hidden className="text-primary-dark" />
          {vendor.reviewAverage}
        </span>
      )}
      {!open && <span className="text-red-600">{t("closed_label")}</span>}
    </div>
  );
}

function VendorBoard({ vendors }: { vendors: IRestaurant[] }) {
  const [featured, ...supporting] = vendors.slice(0, 4);

  if (!featured) {
    return (
      <div
        className="min-h-0 px-4 py-8 sm:px-5 md:min-h-[520px] md:px-6 md:py-12 lg:px-8"
        aria-hidden="true"
      >
        <div className="grid min-h-[280px] animate-pulse grid-cols-[48%_1fr] overflow-hidden rounded-2xl border border-dispatch-line bg-dispatch-surface">
          <div className="bg-dispatch-map" />
          <div className="space-y-3 p-6">
            <div className="h-5 w-20 rounded-md bg-dispatch-line" />
            <div className="h-7 w-3/5 rounded-md bg-dispatch-line" />
            <div className="h-4 w-2/5 rounded-md bg-dispatch-line" />
            <div className="mt-8 h-4 w-1/2 rounded-md bg-dispatch-line" />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="flex min-h-[104px] items-center gap-3 rounded-xl border border-dispatch-line bg-dispatch-surface p-2.5"
            >
              <div className="h-20 w-20 shrink-0 animate-pulse rounded-lg bg-dispatch-map" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-4/5 rounded bg-dispatch-line" />
                <div className="h-3 w-1/2 rounded bg-dispatch-line" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 min-w-0 px-4 py-8 sm:px-5 md:min-h-[520px] md:px-6 md:py-12 lg:px-8">
      <div className="flex h-full min-w-0 flex-col justify-center">
        <Link
          href={vendorHref(featured)}
          className="group grid min-h-[180px] grid-cols-[46%_1fr] overflow-hidden rounded-2xl border border-dispatch-line bg-dispatch-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color sm:min-h-[280px] sm:grid-cols-[48%_1fr]"
        >
          <div className="relative min-h-44 overflow-hidden bg-dispatch-map sm:min-h-full">
            <Image
              src={featured.image}
              alt={featured.name}
              fill
              sizes="(max-width: 640px) 100vw, 32vw"
              className="object-cover transition duration-500 group-hover:scale-[1.025]"
            />
          </div>
          <div className="flex min-w-0 flex-col justify-center p-4 sm:p-6 lg:p-8">
            <p className="line-clamp-2 text-lg font-medium tracking-[-0.025em] text-dispatch-ink sm:text-3xl">
              {featured.name}
            </p>
            {!!featured.cuisines?.length && (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-dispatch-muted">
                {featured.cuisines.join(" · ")}
              </p>
            )}
            <VendorMeta vendor={featured} />
          </div>
        </Link>

        {!!supporting.length && (
          <div className="mt-3 grid min-w-0 auto-cols-[240px] grid-flow-col gap-3 overflow-x-auto pb-1 sm:grid-cols-3 sm:grid-flow-row sm:overflow-visible sm:pb-0">
            {supporting.map((vendor) => (
              <Link
                key={vendor._id}
                href={vendorHref(vendor)}
                className="group min-w-0 overflow-hidden rounded-xl border border-dispatch-line bg-dispatch-surface p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color sm:flex sm:min-h-[132px] sm:items-center sm:gap-3"
              >
                <span className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-dispatch-map sm:h-28 sm:w-28 sm:shrink-0">
                  <Image
                    src={vendor.image}
                    alt={vendor.name}
                    fill
                    sizes="80px"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="mt-2 block min-w-0 sm:mt-0">
                  <span className="block truncate text-xs font-medium text-dispatch-ink sm:text-sm">
                    {vendor.name}
                  </span>
                  <span className="hidden sm:block">
                    <VendorMeta vendor={vendor} />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MarketplaceCard({ vendor }: { vendor: IRestaurant }) {
  return (
    <Link
      href={vendorHref(vendor)}
      className="group grid min-w-0 grid-cols-[42%_1fr] overflow-hidden rounded-xl border border-dispatch-line bg-dispatch-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color"
    >
      <div className="relative min-h-28 overflow-hidden bg-dispatch-map">
        <Image
          src={vendor.image}
          alt={vendor.name}
          fill
          sizes="(max-width: 640px) 42vw, (max-width: 1024px) 18vw, 12vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="min-w-0 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-medium text-dispatch-ink">
              {vendor.name}
            </h3>
            {!!vendor.cuisines?.length && (
              <p className="mt-1 truncate text-xs text-dispatch-muted">
                {vendor.cuisines.join(" · ")}
              </p>
            )}
          </div>
          <FiArrowUpRight
            aria-hidden
            className="mt-0.5 hidden shrink-0 text-dispatch-muted transition-colors group-hover:text-primary-dark sm:block"
          />
        </div>
        <VendorMeta vendor={vendor} />
      </div>
    </Link>
  );
}

function MarketplaceSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-dispatch-line bg-dispatch-surface"
          aria-hidden="true"
        >
          <div className="grid min-h-28 grid-cols-[42%_1fr]">
            <div className="animate-pulse bg-dispatch-map" />
            <div className="space-y-2 p-3">
              <div className="h-4 w-3/4 animate-pulse bg-dispatch-line" />
              <div className="h-3 w-1/2 animate-pulse bg-dispatch-line" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MarketplaceHome() {
  const t = useTranslations();
  const router = useRouter();
  const { userAddress } = useUserAddress();
  const { getCurrentLocation } = useLocation();
  const { onSetUserLocation } = useSetUserCurrentLocation();
  const { queryData, loading } = useNearByRestaurantsPreview(true, 1, 10);
  const shopTypes = useQuery(FETCH_ALL_SHOP_TYPES, {
    fetchPolicy: "cache-and-network",
  });
  const shopTypeData = shopTypes.data?.fetchAllShopTypes?.data || [];

  const locateAndDiscover = () => {
    getCurrentLocation(onSetUserLocation);
    router.push("/discovery");
  };

  return (
    <main className="overflow-hidden bg-dispatch-ground text-dispatch-ink">
      <section className="border-b border-dispatch-line">
        <div className="mx-auto grid min-w-0 max-w-dispatch-page md:grid-cols-[minmax(340px,36%)_1fr]">
          <div className="flex min-h-[430px] min-w-0 flex-col justify-center px-4 py-12 sm:px-5 md:min-h-[520px] md:px-6 lg:px-8">
            {userAddress?.deliveryAddress && (
              <div className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary-dark">
                <FiMapPin aria-hidden />
                <span className="max-w-[34ch] truncate">
                  {userAddress.deliveryAddress}
                </span>
              </div>
            )}
            <h1 className="max-w-[19ch] text-4xl font-medium leading-[1.1] tracking-[-0.03em] text-dispatch-ink sm:text-[2.75rem] lg:text-[2.85rem]">
              {t("restaurant_and_stores_title")}{" "}
              <span className="block text-primary-dark">{t("near_you")}</span>
            </h1>
            <p className="mt-5 max-w-[42ch] text-base font-normal leading-6 text-dispatch-muted">
              {t("InfoCardHomeScreen.subHeading")}
            </p>

            <div className="mt-7 max-w-[440px]">
              <HomeSearch />
              <button
                type="button"
                onClick={locateAndDiscover}
                className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-color px-5 text-sm font-medium text-dispatch-ink transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color"
              >
                <FiNavigation aria-hidden />
                {t("show_items_btn")}
              </button>
              <button
                type="button"
                onClick={locateAndDiscover}
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary-dark underline decoration-primary-disabled underline-offset-4 hover:decoration-primary-dark"
              >
                <FiMapPin aria-hidden />
                {t("current_location_btn")}
              </button>
            </div>
          </div>

          <VendorBoard vendors={queryData} />
        </div>
      </section>

      <section className="border-b border-dispatch-line bg-dispatch-ground">
        <PaddingContainer className="py-7">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-medium tracking-[-0.02em] sm:text-2xl">
              {t("shop-types")}
            </h2>
            <Link
              href="/discovery"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-dark"
            >
              {t("see_all")}
              <FiArrowUpRight aria-hidden />
            </Link>
          </div>
          <div className="grid auto-cols-[112px] grid-flow-col gap-5 overflow-x-auto pb-2 scrollbar-thin sm:auto-cols-[128px]">
            {shopTypes.loading && !shopTypeData.length
              ? Array.from({ length: 7 }, (_, index) => (
                  <div key={index} className="space-y-2" aria-hidden="true">
                    <div className="aspect-[4/3] animate-pulse rounded-xl bg-dispatch-line" />
                    <div className="mx-auto h-3 w-3/4 animate-pulse rounded bg-dispatch-line" />
                  </div>
                ))
              : shopTypeData.map((shopType) => (
                  <Link
                    href={`/shop-type/${shopType.slug}`}
                    key={shopType._id}
                    className="group min-w-0 text-center text-sm font-normal text-dispatch-ink"
                  >
                    {shopType.image && (
                      <span className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-dispatch-map ring-1 ring-dispatch-line">
                        <Image
                          src={shopType.image}
                          alt=""
                          fill
                          sizes="128px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                        />
                      </span>
                    )}
                    <span className="mt-2 block truncate">{shopType.name}</span>
                  </Link>
                ))}
          </div>
        </PaddingContainer>
      </section>

      <section className="py-10 sm:py-14">
        <PaddingContainer>
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-medium tracking-[-0.025em] sm:text-3xl">
              {t("generic_listing_heading")}
            </h2>
            <Link
              href="/restaurants"
              className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary-dark"
            >
              {t("see_all")}
              <FiArrowUpRight aria-hidden />
            </Link>
          </div>

          {loading && !queryData.length ? (
            <MarketplaceSkeleton />
          ) : queryData.length ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {queryData.slice(0, 10).map((vendor) => (
                <MarketplaceCard vendor={vendor} key={vendor._id} />
              ))}
            </div>
          ) : (
            <div className="border-y border-dispatch-line py-14 text-center text-sm text-dispatch-muted">
              {t("no_data_available_to_show")}
            </div>
          )}
        </PaddingContainer>
      </section>
    </main>
  );
}
