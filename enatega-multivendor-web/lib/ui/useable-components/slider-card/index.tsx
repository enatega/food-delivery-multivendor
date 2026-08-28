"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Carousel } from "primereact/carousel";

import { ISliderCardComponentProps } from "@/lib/utils/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

import { useRouter } from "next/navigation";

import Card from "../card";
import CustomButton from "../button";
import { useTranslations } from "next-intl";
const responsiveOptions = [
  { breakpoint: "1536px", numVisible: 6, numScroll: 1 },
  { breakpoint: "1280px", numVisible: 5, numScroll: 1 },
  { breakpoint: "1024px", numVisible: 4, numScroll: 1 },
  { breakpoint: "640px", numVisible: 2, numScroll: 1 }, // If screen width is ≤ 640px, show 2 items
  { breakpoint: "425px", numVisible: 2, numScroll: 1 },
  { breakpoint: "320px", numVisible: 1, numScroll: 1 },
];

const SliderCard = <T,>({
  title,
  data,
  last,
  heading,
}: ISliderCardComponentProps<T>) => {
  const t = useTranslations();
  const [numVisible, setNumVisible] = useState(getNumVisible());
  const [isModalOpen, setIsModalOpen] = useState({ value: false, id: "" });
  const headingLabel = t.has(heading) ? t(heading) : heading;
  const carouselRef = useRef<React.ElementRef<typeof Carousel>>(null);
  const shouldUseFixedCardColumns =
    data?.length > 0 && data.length < numVisible;
  const fixedColumnStyle = {
    "--slider-card-column-width": `${100 / numVisible}%`,
  } as React.CSSProperties;

  const handleUpdateIsModalOpen = useCallback(
    (value: boolean, id: string) => {
      if (isModalOpen.value !== value || isModalOpen.id !== id) {
        console.log("value, id", value, id);
        setIsModalOpen({ value, id });
      }
    },
    [isModalOpen],
  );

  const router = useRouter();

  function getNumVisible() {
    if (typeof window === "undefined") return 5;

    const width = window.innerWidth;
    let visibleItems = 8;

    responsiveOptions.forEach((option) => {
      if (width <= parseInt(option.breakpoint)) {
        visibleItems = option.numVisible;
      }
    });

    return visibleItems;
  }

  const clickCarouselNavigator = (
    selector: ".p-carousel-prev" | ".p-carousel-next",
  ) => {
    const carouselElement = carouselRef.current?.getElement();
    const navigatorButton =
      carouselElement?.querySelector<HTMLButtonElement>(selector);

    navigatorButton?.click();
  };

  const next = () => {
    clickCarouselNavigator(".p-carousel-next");
  };

  const prev = () => {
    clickCarouselNavigator(".p-carousel-prev");
  };

  // Effects
  useEffect(() => {
    const handleResize = () => setNumVisible(getNumVisible());

    const handleDeviceChange = () => {
      setNumVisible(getNumVisible());
    };

    window.addEventListener("resize", handleResize);
    window
      .matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
      .addEventListener("change", handleDeviceChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window
        .matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
        .removeEventListener("change", handleDeviceChange);
    };
  }, []);

  // see all click handler
  const onSeeAllClick = () => {
    router.push(`/see-all/${title?.toLocaleLowerCase().replace(/\s/g, "-")}`);
  };

  // Check if RTL (client-side only)
  const [isRTL, setIsRTL] = useState(false);
  useEffect(() => {
    setIsRTL(document.documentElement.dir === "rtl");
  }, []);

  return (
    data?.length > 0 && (
      <section className={`mt-5 ${last && "mb-10"}`}>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-medium tracking-[-0.02em] text-dispatch-ink sm:text-xl dark:text-white">
            {headingLabel}
          </h2>
          <div className="flex items-center justify-end gap-x-2">
            {/* See All Button */}
            <CustomButton
              label={t("see_all")}
              onClick={onSeeAllClick}
              className="text-sm font-medium text-primary-color transition-colors hover:text-primary-hover md:text-base"
            />

            {/* Navigation Buttons */}
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
          </div>
        </div>

        <Carousel
          ref={carouselRef}
          value={data}
          className={`w-full discovery-carousel custom-navigation-carousel restaurant-card-carousel ${shouldUseFixedCardColumns ? "low-count-carousel" : ""} ${isRTL ? "rtl-carousel" : ""}`}
          style={shouldUseFixedCardColumns ? fixedColumnStyle : undefined}
          itemTemplate={(item) => (
            <div className="mx-1.5 h-full py-1">
              <Card
                item={item}
                isModalOpen={isModalOpen}
                handleUpdateIsModalOpen={handleUpdateIsModalOpen}
              />
            </div>
          )}
          numVisible={numVisible}
          numScroll={1}
          circular
          responsiveOptions={responsiveOptions}
          showIndicators={false}
          showNavigators
        />
      </section>
    )
  );
};

export default SliderCard;
