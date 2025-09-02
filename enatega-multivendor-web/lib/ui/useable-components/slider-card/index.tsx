"use client";

import React, { useCallback, useEffect, useState } from "react";
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
}: ISliderCardComponentProps<T>) => {
  const [page, setPage] = useState(0);
  const t = useTranslations()
  const [numVisible, setNumVisible] = useState(getNumVisible());
  const [isModalOpen, setIsModalOpen] = useState({value: false, id: ""});

  const handleUpdateIsModalOpen = useCallback((value: boolean, id: string) => {
    if (isModalOpen.value !== value || isModalOpen.id !== id) {
      console.log("value, id", value, id);
      setIsModalOpen({ value, id });
    }
  }, [isModalOpen]);

  const router = useRouter();

  function getNumVisible() {
    if (typeof window === "undefined") return;
    // Get the current screen width
    const width = window.innerWidth;

    // Find the matching responsive option
    const option =
      responsiveOptions.find((opt) => width <= parseInt(opt.breakpoint)) ||
      responsiveOptions[0];

    return option.numVisible || 0;
  }

  const next = () => {
    setPage((prevPage) =>
      prevPage < totalPages - 1 ? prevPage + numScroll : 0
    ); // Reset to first page at the end
  };

  const prev = () => {
    setPage((prevPage) =>
      prevPage > 0 ? prevPage - numScroll : totalPages - 1
    ); // Go to last page if at start
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

  const numScroll = 1; // Scroll by 1 item
  const totalPages =
    Math.ceil((data?.length - (numVisible || 0)) / numScroll) + 1; // Total pages

  // see all click handler
  const onSeeAllClick = () => {
    router.push(`/see-all/${title?.toLocaleLowerCase().replace(/\s/g, "-")}`);
  };

  return (
    data?.length > 0 && (
      <div className={`${last && "mb-20"}`}>
        <div className="flex justify-between mx-[6px]">
          <span className="font-inter font-bold text-xl sm:text-2xl leading-8 tracking-normal text-gray-900 dark:text-white">
            {title}
          </span>
          <div className="flex items-center justify-end gap-x-2">
            {/* See All Button */}
            <CustomButton
              label={t("see_all")}
              onClick={onSeeAllClick}
              className="text-[#0EA5E9] transition-colors duration-200 text-sm md:text-base "
            />

            {/* Navigation Buttons */}
            <div className="gap-x-2 hidden md:flex">
              <button
                className="w-8 h-8 flex items-center justify-center  shadow-md  rounded-full dark:bg-gray-800"
                onClick={prev}
              >
                <FontAwesomeIcon icon={faAngleLeft} className="dark:text-white" />
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center  shadow-md rounded-full dark:bg-gray-800"
                onClick={next}
              >
                <FontAwesomeIcon icon={faAngleRight} className="dark:text-white"  />
              </button>
            </div>
          </div>
        </div>

        <Carousel
          value={data}
          className="w-[100%] "
          itemTemplate={(item) => <Card item={item} isModalOpen={isModalOpen} handleUpdateIsModalOpen={handleUpdateIsModalOpen} />}
          numVisible={numVisible}
          numScroll={1}
          circular
          responsiveOptions={responsiveOptions}
          showIndicators={false}
          showNavigators={false}
          page={page}
        />
      </div>
    )
  );
};

export default SliderCard;
