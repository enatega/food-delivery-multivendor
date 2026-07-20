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
  { breakpoint: "1280px", numVisible: 4, numScroll: 1 }, // If screen width is ≤ 1280px, show 4 items
  { breakpoint: "1024px", numVisible: 3, numScroll: 1 }, // If screen width is ≤ 1024px, show 3 items
  { breakpoint: "640px", numVisible: 2, numScroll: 1 }, // If screen width is ≤ 640px, show 2 items
  { breakpoint: "425px", numVisible: 1, numScroll: 1 }, // If screen width is ≤ 425px, show 1 item
];

const SliderCard = <T,>({
  title,
  data,
  last,
  heading,
}: ISliderCardComponentProps<T>) => {
  const t = useTranslations();
  const [numVisible, setNumVisible] = useState(getNumVisible());
  const [isModalOpen, setIsModalOpen] = useState({value: false, id: ""});
  const headingLabel = t.has(heading) ? t(heading) : heading;
  const carouselRef = useRef<React.ElementRef<typeof Carousel>>(null);
  const shouldUseFixedCardColumns = data?.length > 0 && data.length < numVisible;
  const fixedColumnStyle = {
    "--slider-card-column-width": `${100 / numVisible}%`,
  } as React.CSSProperties;

  const handleUpdateIsModalOpen = useCallback((value: boolean, id: string) => {
    if (isModalOpen.value !== value || isModalOpen.id !== id) {
      console.log("value, id", value, id);
      setIsModalOpen({ value, id });
    }
  }, [isModalOpen]);

  const router = useRouter();

  function getNumVisible() {
    if (typeof window === "undefined") return 4;

    const width = window.innerWidth;
    let visibleItems = 4;

    responsiveOptions.forEach((option) => {
      if (width <= parseInt(option.breakpoint)) {
        visibleItems = option.numVisible;
      }
    });

    return visibleItems;
  }

  const clickCarouselNavigator = (selector: ".p-carousel-prev" | ".p-carousel-next") => {
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
      <div className={`mt-9 ${last && "mb-20"}`}>
        <div className="flex justify-between mx-[6px] ">
          <span className="font-inter font-bold text-xl sm:text-2xl leading-8 tracking-normal text-gray-900 dark:text-white">
            {headingLabel}
          </span>
          <div className="flex items-center justify-end gap-x-2">
            {/* See All Button */}
            <CustomButton
              label={t("see_all")}
              onClick={onSeeAllClick}
              className="text-secondary-color transition-colors duration-200 text-sm md:text-base "
            />

            {/* Navigation Buttons */}
            <div className="gap-x-2 hidden md:flex">
              <button
                className="w-8 h-8 flex items-center justify-center  shadow-md  rounded-full dark:bg-gray-800"
                onClick={prev}
              >
                {isRTL ? <FontAwesomeIcon className="dark:text-white" icon={faAngleRight} /> : <FontAwesomeIcon className="dark:text-white" icon={faAngleLeft} /> } 
              </button> 
              <button
                className="w-8 h-8 flex items-center justify-center  shadow-md rounded-full dark:bg-gray-800"
                onClick={next}
              >
                 {isRTL ? <FontAwesomeIcon className="dark:text-white" icon={faAngleLeft} />  : <FontAwesomeIcon className="dark:text-white" icon={faAngleRight} /> }
              </button>
            </div>
          </div>
        </div>

        <Carousel
          ref={carouselRef}
          value={data}
          className={`w-full discovery-carousel custom-navigation-carousel restaurant-card-carousel ${shouldUseFixedCardColumns ? "low-count-carousel" : ""} ${isRTL ? "rtl-carousel" : ""}`}
          style={shouldUseFixedCardColumns ? fixedColumnStyle : undefined}
          itemTemplate={(item) => <Card item={item} isModalOpen={isModalOpen} handleUpdateIsModalOpen={handleUpdateIsModalOpen} />}
          numVisible={numVisible}
          numScroll={1}
          circular
          responsiveOptions={responsiveOptions}
          showIndicators={false}
          showNavigators
        />
      </div>
    )
  );
};

export default SliderCard;
