"use client";

import { Carousel } from "primereact/carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import type { ModeProduct } from "@/lib/mode/types";
import SingleVendorProductCard from "./ProductCard";

const responsiveOptions = [
  { breakpoint: "1280px", numVisible: 4, numScroll: 1 },
  { breakpoint: "1024px", numVisible: 3, numScroll: 1 },
  { breakpoint: "640px", numVisible: 2, numScroll: 1 },
  { breakpoint: "425px", numVisible: 1, numScroll: 1 },
];

function getVisibleCount() {
  if (typeof window === "undefined") return 5;
  const width = window.innerWidth;
  if (width > 1280) return 5;
  const option = responsiveOptions.find(
    ({ breakpoint }) => width <= Number.parseInt(breakpoint),
  );
  return option?.numVisible ?? 5;
}

export function SingleVendorProductSectionSkeleton() {
  return (
    <section className="mt-7 animate-pulse" aria-busy="true">
      <div className="mx-[6px] mb-4 h-7 w-48 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className={`${index > 1 ? "hidden md:block" : ""} ${index > 3 ? "md:hidden xl:block" : ""} h-64 rounded-md bg-gray-100 dark:bg-gray-800`}
          />
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
  const move = (direction: -1 | 1) => {
    setUserInteracted(true);
    setPage((current) => {
      if (direction === 1) return current < maxPage ? current + 1 : 0;
      return current > 0 ? current - 1 : maxPage;
    });
  };

  return (
    <section className="mt-7" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-[6px] mb-2 flex items-center justify-between">
        <h2 className="font-inter text-xl leading-8 font-bold tracking-normal text-gray-900 sm:text-2xl dark:text-white">
          {title}
        </h2>

        {products.length > numVisible && (
          <div className="hidden items-center gap-x-2 md:flex">
            <button
              type="button"
              aria-label={`Previous ${title}`}
              onClick={() => move(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={isRTL ? faAngleRight : faAngleLeft} />
            </button>
            <button
              type="button"
              aria-label={`Next ${title}`}
              onClick={() => move(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={isRTL ? faAngleLeft : faAngleRight} />
            </button>
          </div>
        )}
      </div>

      <Carousel
        value={products}
        className={`discovery-carousel single-vendor-product-carousel ${isRTL ? "rtl-carousel" : ""}`}
        itemTemplate={(product) => (
          <div className="mx-2 mb-6 h-full py-2">
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
