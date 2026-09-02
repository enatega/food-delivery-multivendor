"use client";

import { useAppMode } from "@/lib/mode";
import Image from "@/lib/ui/useable-components/safe-image";
import { IGetBannersResponse } from "@/lib/utils/interfaces";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  type SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
} from "react-icons/fi";

type Banner = IGetBannersResponse["banners"][number];
type Direction = -1 | 1;

const AUTOPLAY_DURATION = 7000;
const DIAL_EASE = [0.22, 1, 0.36, 1] as const;
const DIAL_SLOTS = {
  top: { x: 28, y: 33, scale: 0.9 },
  center: { x: 62, y: 152, scale: 1 },
  bottom: { x: 28, y: 271, scale: 0.9 },
} as const;

const isVideoFile = (file?: string) =>
  Boolean(
    file?.includes(".mp4") ||
    file?.includes(".webm") ||
    file?.includes("video"),
  );

const parseParameters = (rawParameters?: string | string[]) => {
  if (typeof rawParameters === "string") {
    try {
      return JSON.parse(rawParameters) as Record<string, string>;
    } catch {
      return {};
    }
  }
  if (Array.isArray(rawParameters)) {
    return Object.fromEntries(
      rawParameters
        .map((entry) => entry.split("="))
        .filter(([key, value]) => key && value),
    );
  }
  return {};
};

const primePreviewFrame = (event: SyntheticEvent<HTMLVideoElement>) => {
  const video = event.currentTarget;
  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  video.currentTime = duration > 0 ? Math.min(0.5, duration / 10) : 0.1;
};

const getBannerKey = (item: Banner) =>
  item._id || `${item.file}|${item.title}|${item.screen}`;

export default function OrbitBannerCarousel({
  items: suppliedItems,
}: {
  items: Banner[];
}) {
  const router = useRouter();
  const t = useTranslations();
  const { isSingleVendor } = useAppMode();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const pointerStart = useRef<number | null>(null);
  const itemOrderRef = useRef<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);

  const items = useMemo(() => {
    const itemByKey = new Map<string, Banner>();
    suppliedItems.forEach((item) => itemByKey.set(getBannerKey(item), item));

    const retainedKeys = itemOrderRef.current.filter((key) =>
      itemByKey.has(key),
    );
    suppliedItems.forEach((item) => {
      const key = getBannerKey(item);
      if (!retainedKeys.includes(key)) retainedKeys.push(key);
    });
    itemOrderRef.current = retainedKeys;

    return retainedKeys
      .map((key) => itemByKey.get(key))
      .filter((item): item is Banner => Boolean(item));
  }, [suppliedItems]);

  const activeItem = items[activeIndex];
  const previousIndex = (activeIndex - 1 + items.length) % items.length;
  const nextIndex = (activeIndex + 1) % items.length;
  const previousItem = items[previousIndex];
  const nextItem = items[nextIndex];

  const dialItems = useMemo(
    () =>
      [
        { index: previousIndex, slot: "top" as const },
        { index: activeIndex, slot: "center" as const },
        { index: nextIndex, slot: "bottom" as const },
      ].filter(
        (entry, entryIndex, entries) =>
          entries.findIndex((candidate) => candidate.index === entry.index) ===
          entryIndex,
      ),
    [activeIndex, nextIndex, previousIndex],
  );

  const move = useCallback(
    (nextDirection: Direction) => {
      setDirection(nextDirection);
      setActiveIndex(
        (currentIndex) =>
          (currentIndex + nextDirection + items.length) % items.length,
      );
    },
    [items.length],
  );

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(0);
  }, [activeIndex, items.length]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () =>
      setIsDocumentVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  const shouldPlay = isInView && isDocumentVisible && !isHovered;

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    if (shouldPlay) void video.play().catch(() => undefined);
    else video.pause();
  }, [activeItem?._id, shouldPlay]);

  useEffect(() => {
    if (!shouldPlay || items.length < 2) return;
    const timer = window.setTimeout(() => move(1), AUTOPLAY_DURATION);
    return () => window.clearTimeout(timer);
  }, [activeIndex, items.length, move, shouldPlay]);

  const navigateForBanner = (item: Banner) => {
    if (isSingleVendor) {
      const parameters = parseParameters(item.parameters);
      const screen = item.screen?.toLowerCase();
      const categoryId = parameters.categoryId || parameters.id || item.slug;
      const foodId = parameters.foodId || parameters.productId || parameters.id;
      if (screen === "category" && categoryId) {
        router.push(`/category/${categoryId}`);
      } else if (screen === "product" && foodId) {
        router.push(`/product/${foodId}`);
      } else if (screen?.includes("deal")) {
        router.push("/deals");
      } else {
        router.push("/browse");
      }
      return;
    }

    if (item.action === "Navigate Specific Restaurant") {
      router.push(
        `/${item.shopType === "restaurant" ? "restaurant" : "store"}/${item.slug}/${item.screen}`,
      );
    } else if (item.screen === "Top Brands") {
      router.push("/see-all/popular-stores");
    } else if (item.screen === "Near By Restaurants") {
      router.push("/see-all/restaurants-near-you");
    } else {
      router.push("/store");
    }
  };

  if (!activeItem) return null;

  const transition = reduceMotion
    ? { duration: 0.18 }
    : { duration: 0.7, ease: DIAL_EASE };

  return (
    <section
      ref={sectionRef}
      className="relative mt-5 outline-none sm:mt-7"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsHovered(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }}
      onPointerDown={(event) => {
        pointerStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (pointerStart.current === null) return;
        const distance = event.clientX - pointerStart.current;
        if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
        pointerStart.current = null;
      }}
    >
      <div
        className={`grid ${items.length > 1 ? "lg:grid-cols-[minmax(0,1fr)_240px] xl:grid-cols-[minmax(0,1fr)_280px]" : ""}`}
      >
        <article className="relative z-10 h-[260px] overflow-hidden rounded-[28px] bg-dispatch-map text-white sm:h-[320px] lg:h-[390px] lg:rounded-r-[195px]">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={`hero-media-${getBannerKey(activeItem)}`}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.015 }}
              animate={{
                opacity: 1,
                scale: shouldPlay && !reduceMotion ? 1.03 : 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: reduceMotion ? 0.18 : 0.32 },
                scale: {
                  duration: shouldPlay && !reduceMotion ? 7 : 0.32,
                  ease: shouldPlay && !reduceMotion ? "linear" : DIAL_EASE,
                },
              }}
            >
              {isVideoFile(activeItem.file) ? (
                <video
                  ref={heroVideoRef}
                  muted
                  playsInline
                  loop
                  autoPlay
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src={activeItem.file} type="video/mp4" />
                  <source src={activeItem.file} type="video/webm" />
                </video>
              ) : (
                <Image
                  src={activeItem.file}
                  fill
                  priority
                  alt={activeItem.title}
                  sizes="(max-width: 1024px) 100vw, 84vw"
                  className="object-cover"
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/42 to-black/5"
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`hero-content-${getBannerKey(activeItem)}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.18 }}
              className="absolute bottom-10 left-5 z-10 max-w-[min(590px,72%)] sm:bottom-12 sm:left-8 lg:bottom-14"
            >
              {activeItem.screen && (
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-white/[0.82] sm:text-sm">
                  {activeItem.screen}
                </p>
              )}
              {activeItem.title && (
                <h2 className="line-clamp-2 text-2xl font-semibold leading-[1.06] tracking-[-0.025em] text-white sm:text-4xl lg:text-[2.75rem]">
                  {activeItem.title}
                </h2>
              )}
              {activeItem.description && (
                <p className="mt-2 line-clamp-2 max-w-[65ch] text-sm leading-6 text-white/[0.88] sm:text-base">
                  {activeItem.description}
                </p>
              )}
              <button
                type="button"
                onClick={() => navigateForBanner(activeItem)}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-[#151914] shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition hover:bg-primary-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {activeItem.buttonText || t("show_items_btn")}
                <FiArrowRight aria-hidden />
              </button>
            </motion.div>
          </AnimatePresence>

          {items.length > 1 && (
            <div className="absolute inset-x-5 bottom-4 z-10 flex gap-1.5 sm:inset-x-8 sm:bottom-5 lg:right-24">
              {items.map((item, index) => (
                <span
                  key={getBannerKey(item)}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className={`h-[3px] min-w-3 flex-1 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color focus-visible:ring-offset-2 focus-visible:ring-offset-black ${index === activeIndex ? "bg-primary-color" : "bg-white/[0.38] hover:bg-white/65"}`}
                />
              ))}
            </div>
          )}
        </article>

        {items.length > 1 && (
          <aside className="relative z-20 mt-3 min-w-0 lg:-ml-6 lg:mt-0 lg:h-[390px]">
            <svg
              aria-hidden
              viewBox="0 0 280 390"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
              fill="none"
            >
              <path
                d="M0 0C116 76 116 314 0 390"
                stroke="var(--primary-color)"
                strokeOpacity="0.24"
                strokeWidth="1.2"
              />
              <circle cx="62" cy="76" r="3" fill="var(--primary-color)" />
              <circle cx="87" cy="195" r="4" fill="var(--primary-color)" />
              <circle cx="62" cy="314" r="3" fill="var(--primary-color)" />
            </svg>

            <div className="hidden lg:block">
              <AnimatePresence initial={false} custom={direction}>
                {dialItems.map(({ index, slot }) => {
                  const item = items[index];
                  const isActive = slot === "center";
                  const position = DIAL_SLOTS[slot];
                  const enterFrom =
                    direction === 1
                      ? { x: DIAL_SLOTS.bottom.x, y: 390 }
                      : { x: DIAL_SLOTS.top.x, y: -96 };
                  const exitTo =
                    direction === 1
                      ? { x: DIAL_SLOTS.top.x, y: -96 }
                      : { x: DIAL_SLOTS.bottom.x, y: 390 };

                  return (
                    <motion.button
                      key={getBannerKey(item)}
                      type="button"
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => {
                        if (slot === "top") move(-1);
                        if (slot === "bottom") move(1);
                      }}
                      initial={
                        reduceMotion
                          ? { opacity: 0 }
                          : { ...enterFrom, opacity: 0, scale: 0.82 }
                      }
                      animate={{
                        x: position.x,
                        y: position.y,
                        opacity: 1,
                        scale: position.scale,
                      }}
                      exit={
                        reduceMotion
                          ? { opacity: 0 }
                          : { ...exitTo, opacity: 0, scale: 0.82 }
                      }
                      transition={transition}
                      className="group absolute left-0 top-0 flex w-[250px] items-center gap-4 text-left focus-visible:outline-none"
                    >
                      <span className="relative block h-[86px] w-[86px] shrink-0">
                        <span
                          className={`absolute inset-0 overflow-hidden rounded-full border-[3px] border-white bg-dispatch-map shadow-[0_9px_26px_rgba(21,25,20,0.18)] transition-shadow ${isActive ? "ring-2 ring-primary-color ring-offset-2 ring-offset-dispatch-surface" : "group-hover:ring-2 group-hover:ring-primary-color"}`}
                        >
                          {isVideoFile(item.file) ? (
                            <video
                              muted
                              playsInline
                              preload="metadata"
                              onLoadedMetadata={primePreviewFrame}
                              className="absolute inset-0 h-full w-full object-cover"
                            >
                              <source src={item.file} type="video/mp4" />
                              <source src={item.file} type="video/webm" />
                            </video>
                          ) : (
                            <Image
                              src={item.file}
                              fill
                              alt={item.title}
                              sizes="92px"
                              className="object-cover"
                            />
                          )}
                        </span>
                        {isActive && (
                          <span className="absolute -bottom-1 -left-1 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-dispatch-surface bg-primary-color text-primary-text shadow-[0_5px_14px_rgba(21,25,20,0.2)]">
                            <FiPlay aria-hidden className="translate-x-px" />
                          </span>
                        )}
                      </span>
                      {(item.title || item.screen) && (
                        <span
                          className={`line-clamp-2 max-w-[132px] text-sm leading-5 transition-colors ${isActive ? "font-medium text-dispatch-ink" : "font-normal text-dispatch-muted group-hover:text-primary-dark"}`}
                        >
                          {item.title || item.screen}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-4 overflow-hidden py-2 lg:hidden">
              {dialItems.map(({ index, slot }) => {
                const item = items[index];
                const isActive = slot === "center";
                return (
                  <motion.button
                    layout
                    key={getBannerKey(item)}
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => {
                      if (slot === "top") move(-1);
                      if (slot === "bottom") move(1);
                    }}
                    transition={transition}
                    className={`relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-full border-[3px] border-white bg-dispatch-map shadow-[0_7px_20px_rgba(21,25,20,0.16)] ${isActive ? "scale-110 ring-2 ring-primary-color ring-offset-2 ring-offset-dispatch-surface" : ""}`}
                  >
                    {isVideoFile(item.file) ? (
                      <video
                        muted
                        playsInline
                        preload="metadata"
                        onLoadedMetadata={primePreviewFrame}
                        className="absolute inset-0 h-full w-full object-cover"
                      >
                        <source src={item.file} type="video/mp4" />
                        <source src={item.file} type="video/webm" />
                      </video>
                    ) : (
                      <Image
                        src={item.file}
                        fill
                        alt={item.title}
                        sizes="72px"
                        className="object-cover"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-2 flex items-center justify-end gap-2 lg:absolute lg:bottom-0 lg:right-0 lg:mt-0">
              <button
                type="button"
                aria-label={previousItem?.title}
                onClick={() => move(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-dispatch-surface text-dispatch-ink shadow-[0_7px_20px_rgba(21,25,20,0.12)] transition hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color"
              >
                <FiChevronLeft aria-hidden />
              </button>
              <button
                type="button"
                aria-label={nextItem?.title || t("next_button")}
                onClick={() => move(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-dispatch-surface text-dispatch-ink shadow-[0_7px_20px_rgba(21,25,20,0.12)] transition hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color"
              >
                <FiChevronRight aria-hidden />
              </button>
              <span className="ml-2 text-xs tabular-nums text-dispatch-muted">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(items.length).padStart(2, "0")}
              </span>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
