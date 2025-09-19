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
  { breakpoint: "1280px", numVisible: 6, numScroll: 1 },
  { breakpoint: "1024px", numVisible: 4, numScroll: 1 },
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
  
}) => {
  const [page, setPage] = useState(0);
  const [numVisible, setNumVisible] = useState(getNumVisible());
  const [userInteracted, setUserInteracted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  function getNumVisible() {
    if (typeof window === "undefined") return 6;
    const width = window.innerWidth;
    if (width > 1280) return 6;
    const option = responsiveOptions.find(
      (opt) => width <= parseInt(opt.breakpoint)
    );
    return option ? option.numVisible : 6;
  }

  const numScroll = 1;
  const totalItems = data?.length || 0;

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
  useEffect(() => {
    setIsRTL(document.documentElement.dir === "rtl");
  }, []);

  return (
    data?.length > 0 && (
      <div className={`${last && "mb-20"}`}>
        <div className="flex justify-between mx-[6px]">
          <span className="font-inter font-bold text-xl sm:text-2xl leading-8 tracking-normal text-gray-900 dark:text-white">
            {title}
          </span>
          <div className="flex items-center justify-end gap-x-2 mb-2">
            {pathname !== "/store" &&
              pathname !== "/restaurants" &&
              !cuisines && (
                <CustomButton
                  label={t("see_all")}
                  onClick={onSeeAllClick}
                  className="text-[#0EA5E9] transition-colors duration-200 text-sm md:text-base "
                />
              )}
            {data.length > numVisible && (
              <div className="gap-x-2 hidden md:flex">
                <button
                  className="w-8 h-8 flex items-center justify-center shadow-md rounded-full dark:bg-gray-800"
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
                  className="w-8 h-8 flex items-center justify-center shadow-md rounded-full dark:bg-gray-800"
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
        <div
          className=""
          style={{
            width: data.length < 4 ? "max-content" : "100%",
            minWidth: "300px",
          }}
        >
          <Carousel
            value={data}
            className={`discovery-carousel ${isRTL ? "rtl-carousel" : ""}`} // Add RTL class
            itemTemplate={(item) => (
              <SquareCard item={item} showLogo={showLogo} cuisines={cuisines} />
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
      </div>
    )
  );
};

export default CuisinesSliderCard;
