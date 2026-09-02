"use client";
// core
import React, { useEffect, useState } from "react";
import { Carousel } from "primereact/carousel";
// interfaces
import { CuisinesSliderCardComponent } from "@/lib/utils/interfaces";
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
// router
import { useRouter, usePathname } from "next/navigation";
// ui components
import SquareCard from "../square-card";
import CustomButton from "../button";
import { useTranslations } from "next-intl";

const responsiveOptions = [
  { breakpoint: "1536px", numVisible: 8, numScroll: 1 },
  { breakpoint: "1280px", numVisible: 7, numScroll: 1 },
  { breakpoint: "1024px", numVisible: 6, numScroll: 1 },
  { breakpoint: "640px", numVisible: 3, numScroll: 1 },
  { breakpoint: "425px", numVisible: 2, numScroll: 1 },
  { breakpoint: "320px", numVisible: 1, numScroll: 1 },
];

const CuisinesSliderCard: CuisinesSliderCardComponent = ({
  title,
  data,
  last,
  showLogo,
  cuisines,
  shopTypes,
  itemHref,
}) => {
  const [page, setPage] = useState(0);
  const [numVisible, setNumVisible] = useState(getNumVisible());
  const [userInteracted, setUserInteracted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  function getNumVisible() {
    if (typeof window === "undefined") return 8;
    const width = window.innerWidth;
    if (width <= 320) return 1;
    if (width <= 425) return 2;
    if (width <= 640) return 3;
    if (width <= 1024) return 6;
    if (width <= 1280) return 7;
    if (width <= 1536) return 8;
    return 10;
  }

  const numScroll = 1;
  const totalItems = data?.length || 0;
  const shouldUseFixedCardColumns = totalItems > 0 && totalItems < numVisible;
  const fixedColumnStyle = {
    "--cuisine-card-column-width": `${100 / numVisible}%`,
  } as React.CSSProperties;

  const next = () => {
    setUserInteracted(true);
    const maxPage = totalItems - numVisible;
    setPage((prevPage) => (prevPage < maxPage ? prevPage + numScroll : 0));
  };

  const prev = () => {
    setUserInteracted(true);
    const maxPage = totalItems - numVisible;
    setPage((prevPage) => (prevPage > 0 ? prevPage - numScroll : maxPage));
  };

  // Handle resize
  useEffect(() => {
    const handleResize = () => setNumVisible(getNumVisible());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (data.length <= numVisible || userInteracted) return;

    const interval = setInterval(() => {
      const maxPage = data.length - numVisible;
      setPage((prevPage) => (prevPage < maxPage ? prevPage + 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, [data.length, numVisible, userInteracted]);

  // Resume auto-scroll after 30s
  useEffect(() => {
    if (!userInteracted) return;
    const timeout = setTimeout(() => setUserInteracted(false), 30000);
    return () => clearTimeout(timeout);
  }, [userInteracted]);

  const onSeeAllClick = () => {
    router.push(`/see-all/${title?.toLocaleLowerCase().replace(/\s/g, "-")}`);
  };

  // Check if RTL (client-side only)
  const [isRTL, setIsRTL] = useState(false);
  const headingLabel = t.has(title) ? t(title) : title;
  useEffect(() => {
    setIsRTL(document.documentElement.dir === "rtl");
  }, []);

  return (
    data?.length > 0 && (
      <section className={`mt-8 sm:mt-10 ${last && "mb-10"}`}>
        <div className="flex items-center justify-between">
          <h2 className="font-dispatch text-lg font-medium tracking-[-0.02em] text-dispatch-ink sm:text-xl dark:text-white">
            {headingLabel}
          </h2>
          <div className="mb-2 flex items-center justify-end gap-x-2">
            {pathname !== "/store" &&
              pathname !== "/restaurants" &&
              !cuisines &&
              !shopTypes && (
                <CustomButton
                  label={t("see_all")}
                  onClick={onSeeAllClick}
                  className="text-sm font-medium text-primary-color transition-colors hover:text-primary-hover md:text-base"
                />
              )}
            {data.length > numVisible && (
              <div className="gap-x-2 hidden md:flex">
                <button
                  type="button"
                  aria-label={headingLabel}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-dispatch-muted transition hover:bg-dispatch-map hover:text-primary-dark dark:bg-gray-900"
                  onClick={prev}
                >
                  {isRTL ? (
                    <FontAwesomeIcon
                      className="dark:text-white"
                      icon={faAngleRight}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="dark:text-white"
                      icon={faAngleLeft}
                    />
                  )}
                </button>
                <button
                  type="button"
                  aria-label={headingLabel}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-dispatch-muted transition hover:bg-dispatch-map hover:text-primary-dark dark:bg-gray-900"
                  onClick={next}
                >
                  {isRTL ? (
                    <FontAwesomeIcon
                      className="dark:text-white"
                      icon={faAngleLeft}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="dark:text-white"
                      icon={faAngleRight}
                    />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full">
          <Carousel
            value={data}
            className={`discovery-carousel cuisine-card-carousel ${shouldUseFixedCardColumns ? "low-count-carousel" : ""} ${isRTL ? "rtl-carousel" : ""}`}
            style={shouldUseFixedCardColumns ? fixedColumnStyle : undefined}
            itemTemplate={(item) => (
              <SquareCard
                item={item}
                showLogo={showLogo}
                cuisines={cuisines}
                shoptype={shopTypes}
                href={itemHref?.(item)}
              />
            )}
            numVisible={numVisible}
            numScroll={1}
            responsiveOptions={responsiveOptions}
            showIndicators={false}
            showNavigators={false}
            page={page}
            onPageChange={(e) => setPage(e.page)}
          />
        </div>
      </section>
    )
  );
};

export default CuisinesSliderCard;
