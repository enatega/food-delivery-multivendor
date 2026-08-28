"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image, { type StaticImageData } from "next/image";

import mealBowl from "@/public/assets/images/landing/quiet-orbit/meal-bowl.webp";
import groceryBag from "@/public/assets/images/landing/quiet-orbit/grocery-bag.webp";
import essentialsParcel from "@/public/assets/images/landing/quiet-orbit/essentials-parcel.webp";
import LandingCitySearch from "./LandingCitySearch";
import {
  getNextLandingCategory,
  type LandingCategoryId,
} from "./landing-state";

type Category = {
  id: LandingCategoryId;
  index: string;
  image: StaticImageData;
  stageImageClassName: string;
  stageFrameClassName: string;
  stageInsetClassName: string;
  previewImageClassName: string;
};

const categories: Category[] = [
  {
    id: "food",
    index: "01",
    image: mealBowl,
    stageImageClassName: "max-h-[86%] w-[86%] max-w-[210px] sm:max-h-full sm:w-[90%] sm:max-w-[440px]",
    stageFrameClassName: "inset-0",
    stageInsetClassName: "pb-[18%]",
    previewImageClassName: "h-[68%] w-[84%]",
  },
  {
    id: "groceries",
    index: "02",
    image: groceryBag,
    stageImageClassName: "h-auto max-h-[220px] w-[82%] max-w-[200px] sm:h-[110%] sm:max-h-[350px] sm:w-auto sm:max-w-[350px]",
    stageFrameClassName: "-top-[25%] inset-x-0 bottom-0 sm:-top-[30%]",
    stageInsetClassName: "pb-[12%] sm:pb-[15%]",
    previewImageClassName: "h-[82%] w-[76%]",
  },
  {
    id: "essentials",
    index: "03",
    image: essentialsParcel,
    stageImageClassName: "max-h-[92%] w-[86%] max-w-[210px] sm:max-h-full sm:w-[88%] sm:max-w-[420px]",
    stageFrameClassName: "inset-0",
    stageInsetClassName: "pb-[9%]",
    previewImageClassName: "h-[76%] w-[78%]",
  },
];

const orbitPath = "M146 160C65 220 24 330 50 438C82 548 220 594 355 565C410 553 458 532 495 503C605 455 720 335 746 226C769 129 695 66 585 42C416 5 252 54 146 160Z";

export default function QuietOrbitHero() {
  const t = useTranslations("Landing");
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<LandingCategoryId>("food");
  const [canAutoRotate, setCanAutoRotate] = useState(false);
  const active = categories.find((category) => category.id === activeCategory)!;
  const previews = categories.filter((category) => category.id !== activeCategory);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let isIntersecting = false;
    const updatePlayback = () => {
      setCanAutoRotate(
        isIntersecting && document.visibilityState === "visible",
      );
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        updatePlayback();
      },
      { threshold: 0.25 },
    );

    observer.observe(hero);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, []);

  useEffect(() => {
    if (!canAutoRotate) return;

    const timer = window.setTimeout(() => {
      setActiveCategory((current) => getNextLandingCategory(current));
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [activeCategory, canAutoRotate]);

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-dispatch-ground">
      <div className="mx-auto grid max-w-dispatch-page items-center gap-5 px-6 pb-10 pt-14 md:px-8 lg:h-[clamp(620px,70svh,690px)] lg:min-h-[620px] lg:grid-cols-[minmax(0,43fr)_minmax(0,57fr)] lg:px-12 lg:py-6 xl:px-16">
        <div className="relative z-20 py-4 lg:py-7">
          <p className="mb-7 text-xs font-semibold uppercase tracking-[0.16em] text-dispatch-muted sm:text-sm">{t("hero.eyebrow")}</p>
          <h1 className="text-[clamp(2rem,8.6vw,2.3rem)] font-medium leading-[0.98] tracking-[-0.035em] text-dispatch-ink sm:text-[clamp(3.2rem,4.65vw,4.9rem)]">
            <span className="block lg:whitespace-nowrap">{t("hero.title")}</span>
            <span className="font-editorial mt-2 block whitespace-nowrap font-medium italic leading-[0.92] text-primary-dark">{t("hero.accent")}</span>
          </h1>
          <p className="mt-8 max-w-[43ch] text-base leading-7 text-dispatch-muted sm:text-lg sm:leading-8">{t("hero.body")}</p>

          <div className="mt-8 max-w-[690px]">
            <LandingCitySearch />
            <div role="tablist" aria-label={t("categories.label")} className="mt-5 flex items-center gap-7 border-b border-dispatch-line sm:gap-10">
              {categories.map((category) => {
                const selected = category.id === activeCategory;
                return (
                  <button key={category.id} id={`quiet-orbit-tab-${category.id}`} type="button" role="tab" aria-selected={selected} aria-controls="quiet-orbit-product" onClick={() => setActiveCategory(category.id)} className={`relative min-h-12 pb-3 text-sm font-semibold transition-colors focus-visible:outline-none sm:text-base ${selected ? "text-dispatch-ink" : "text-dispatch-muted hover:text-dispatch-ink"}`}>
                    {t(`categories.${category.id}`)}
                    <span aria-hidden className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary-dark transition-transform duration-300 rtl:origin-right ${selected ? "scale-x-100" : "scale-x-0"}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div id="quiet-orbit-product" role="tabpanel" aria-labelledby={`quiet-orbit-tab-${activeCategory}`} className="relative min-h-[400px] sm:min-h-[430px] md:min-h-[545px] lg:min-h-[590px]">
          <svg aria-hidden className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 780 590" fill="none" preserveAspectRatio="xMidYMid meet">
            <path id="quiet-orbit-track" d={orbitPath} stroke="var(--primary-dark)" strokeWidth="4" strokeLinecap="round" />
            <path d="M146 160C300 60 520 40 630 92C740 144 740 238 690 322C640 406 545 475 495 503" stroke="var(--dispatch-muted)" strokeWidth="1.3" strokeLinecap="round" opacity="0.62" />
            {!reduceMotion && ["0s", "-3.6s", "-7.2s"].map((begin) => (
              <circle key={begin} r="5" fill="var(--primary-dark)">
                <animateMotion dur="10.8s" begin={begin} repeatCount="indefinite"><mpath href="#quiet-orbit-track" /></animateMotion>
              </circle>
            ))}
            <circle cx="146" cy="160" r="7" fill="var(--dispatch-ground)" stroke="var(--primary-dark)" strokeWidth="3" />
            <circle cx="495" cy="503" r="7" fill="var(--dispatch-ground)" stroke="var(--primary-dark)" strokeWidth="3" />
          </svg>

          <div className="absolute bottom-[9%] left-[13%] z-[2] h-[52%] w-[68%] sm:bottom-[5%] sm:left-[16%] sm:h-[55%] sm:w-[51%]">
            <div className="absolute inset-x-0 bottom-0 h-[31%]">
              <div className="absolute inset-x-0 bottom-0 h-[72%] rounded-[0_0_50%_50%] bg-[#d8e1cc] shadow-[0_24px_34px_rgba(21,25,20,0.12)] dark:bg-[#293126]" />
              <div className="absolute inset-x-0 top-0 h-[64%] rounded-[50%] bg-[#eaf0e2] shadow-[inset_0_-10px_18px_rgba(111,128,96,0.14)] dark:bg-[#354031]" />
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active.id} initial={reduceMotion ? false : { opacity: 0, y: 12, clipPath: "inset(12% 0 0 0)" }} animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }} exit={reduceMotion ? undefined : { opacity: 0, y: -8, clipPath: "inset(0 0 12% 0)" }} transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }} className={`absolute flex items-end justify-center ${active.stageFrameClassName} ${active.stageInsetClassName}`}>
                <Image src={active.image} alt={t(`categories.${active.id}`)} priority={active.id === "food"} sizes="(max-width: 1024px) 58vw, 29vw" className={`object-contain drop-shadow-[0_24px_28px_rgba(21,25,20,0.14)] ${active.stageImageClassName}`} />
              </motion.div>
            </AnimatePresence>
          </div>

          {previews.map((preview, index) => (
            <button key={preview.id} type="button" onClick={() => setActiveCategory(preview.id)} aria-label={t("categories.show", { category: t(`categories.${preview.id}`) })} className={`absolute z-10 flex h-20 w-20 items-center justify-center rounded-full bg-[#f1f7e9] shadow-[0_14px_30px_rgba(21,25,20,0.11)] transition-transform duration-500 hover:scale-[1.03] focus-visible:outline-none dark:bg-dispatch-map dark:shadow-[0_14px_30px_rgba(0,0,0,0.3)] sm:h-40 sm:w-40 ${index === 0 ? "right-[3%] top-[5%] sm:right-[16%] sm:top-[3%]" : "bottom-[6%] right-[3%] sm:bottom-[3%] sm:right-[10%]"}`}>
              <Image src={preview.image} alt="" sizes="160px" className={`object-contain ${preview.previewImageClassName}`} />
              <span className="absolute -right-2 -top-6 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.06em] text-dispatch-muted sm:text-xs rtl:-left-2 rtl:right-auto"><span className="text-primary-dark">{preview.index}</span>{" "}{t(`categories.orbit.${preview.id}`)}</span>
            </button>
          ))}

          <p className="absolute left-[18%] top-[25%] text-xs font-semibold uppercase tracking-[0.06em] text-dispatch-muted sm:left-[22%] sm:top-[36%] sm:text-sm"><span className="text-primary-dark">{active.index}</span>{" "}{t(`categories.orbit.${active.id}`)}</p>
        </div>
      </div>
    </section>
  );
}
