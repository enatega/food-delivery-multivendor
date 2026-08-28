"use client";

import { Carousel } from "primereact/carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import type { ModeProduct } from "@/lib/mode/types";
import SingleVendorProductCard from "./ProductCard";

const responsiveOptions = [
  { breakpoint: "1536px", numVisible: 6, numScroll: 1 },
  { breakpoint: "1280px", numVisible: 5, numScroll: 1 },
  { breakpoint: "1024px", numVisible: 4, numScroll: 1 },
  { breakpoint: "640px", numVisible: 2, numScroll: 1 },
  { breakpoint: "425px", numVisible: 2, numScroll: 1 },
  { breakpoint: "320px", numVisible: 1, numScroll: 1 },
];

function getVisibleCount() {
  if (typeof window === "undefined") return 5;
  const width = window.innerWidth;
  if (width <= 320) return 1;
  if (width <= 640) return 2;
  if (width <= 1024) return 4;
  if (width <= 1280) return 5;
  if (width <= 1536) return 6;
  return 8;
}

export function SingleVendorProductSectionSkeleton() {
  return (
    <section className="mt-8 animate-pulse sm:mt-10" aria-busy="true">
      <div className="skeleton-line mb-4 h-6 w-48" />
      <div className="grid grid-cols-2 gap-3 max-[320px]:grid-cols-1 min-[641px]:grid-cols-4 min-[1025px]:grid-cols-5 min-[1281px]:grid-cols-6 min-[1537px]:grid-cols-8">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="skeleton-ring overflow-hidden rounded-xl border bg-dispatch-surface"
          >
            <div className="skeleton-surface aspect-[16/9]" />
            <div className="space-y-2 p-2.5">
              <div className="skeleton-line h-4 w-3/4" />
              <div className="skeleton-line h-3 w-full" />
              <div className="skeleton-line h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SingleVendorProductSection({
  title,
  products,
}: {
  title: string;
  products: ModeProduct[];
}) {
  const [page, setPage] = useState(0);
  const [numVisible, setNumVisible] = useState(getVisibleCount);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const handleResize = () => setNumVisible(getVisibleCount());
    setIsRTL(document.documentElement.dir === "rtl");
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (products.length <= numVisible || userInteracted) return;

    const interval = window.setInterval(() => {
      const maxPage = products.length - numVisible;
      setPage((current) => (current < maxPage ? current + 1 : 0));
    }, 3000);

    return () => window.clearInterval(interval);
  }, [numVisible, products.length, userInteracted]);

  useEffect(() => {
    if (!userInteracted) return;
    const timeout = window.setTimeout(() => setUserInteracted(false), 30000);
    return () => window.clearTimeout(timeout);
  }, [userInteracted]);

  if (!products.length) return null;

  const maxPage = Math.max(products.length - numVisible, 0);
  const shouldUseFixedCardColumns = products.length < numVisible;
  const fixedColumnStyle = {
    "--single-product-column-width": `${100 / numVisible}%`,
  } as React.CSSProperties;
  const move = (direction: -1 | 1) => {
    setUserInteracted(true);
    setPage((current) => {
      if (direction === 1) return current < maxPage ? current + 1 : 0;
      return current > 0 ? current - 1 : maxPage;
    });
  };

  return (
    <section className="mt-8 sm:mt-10" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-medium tracking-[-0.02em] text-dispatch-ink sm:text-xl dark:text-white">
          {title}
        </h2>

        {products.length > numVisible && (
          <div className="hidden items-center gap-x-2 md:flex">
            <button
              type="button"
              aria-label={title}
              onClick={() => move(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-dispatch-muted transition hover:bg-dispatch-map hover:text-primary-dark dark:bg-gray-900 dark:text-white"
            >
              <FontAwesomeIcon icon={isRTL ? faAngleRight : faAngleLeft} />
            </button>
            <button
              type="button"
              aria-label={title}
              onClick={() => move(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-dispatch-muted transition hover:bg-dispatch-map hover:text-primary-dark dark:bg-gray-900 dark:text-white"
            >
              <FontAwesomeIcon icon={isRTL ? faAngleLeft : faAngleRight} />
            </button>
          </div>
        )}
      </div>

      <Carousel
        value={products}
        className={`discovery-carousel single-vendor-product-carousel ${shouldUseFixedCardColumns ? "low-count-carousel" : ""} ${isRTL ? "rtl-carousel" : ""}`}
        style={shouldUseFixedCardColumns ? fixedColumnStyle : undefined}
        itemTemplate={(product) => (
          <div className="mx-1.5 mb-5 h-full py-2">
            <SingleVendorProductCard product={product} />
          </div>
        )}
        numVisible={numVisible}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        showIndicators={false}
        showNavigators={false}
        page={page}
        onPageChange={(event) => {
          setUserInteracted(true);
          setPage(event.page);
        }}
      />
    </section>
  );
}
