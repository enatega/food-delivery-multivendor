"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

import deliveryBag from "@/public/assets/images/landing/quiet-orbit/delivery-bag.webp";
import { getJourneyStage } from "./landing-state";

const stageIds = ["choose", "moving", "arrived"] as const;

function Doorway() {
  return (
    <svg aria-hidden viewBox="0 0 150 240" className="h-full w-full" fill="none">
      <path d="M26 222V55C26 26 49 8 75 8C101 8 124 26 124 55V222" stroke="currentColor" strokeWidth="2" />
      <path d="M39 222V67C39 43 55 28 75 28C95 28 111 43 111 67V222" stroke="currentColor" strokeWidth="2" />
      <path d="M49 221V80H101V221" stroke="currentColor" strokeWidth="2" />
      <circle cx="91" cy="151" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M16 222H134V232H16V222Z" stroke="currentColor" strokeWidth="2" />
      <path d="M3 232H147" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function ScrollJourney() {
  const t = useTranslations("Landing");
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeStage, setActiveStage] = useState(reduceMotion ? 2 : 0);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsWide(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 92,
    damping: 28,
    mass: 0.38,
  });
  const bagX = useTransform(progress, [0, 0.5, 1], [-12, 0, 12]);
  const bagY = useTransform(progress, [0, 0.5, 1], [5, -8, 0]);
  const bagRotate = useTransform(progress, [0, 0.5, 1], [-2, 0, 2]);
  const sageOpacity = useTransform(progress, [0.28, 1], [0, 1]);

  useMotionValueEvent(progress, "change", (value) => {
    if (!reduceMotion) setActiveStage(getJourneyStage(value));
  });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="journey-title"
      className="relative bg-dispatch-ground md:h-[300svh]"
    >
      <div className="relative overflow-hidden px-6 py-20 md:sticky md:top-[72px] md:flex md:h-[calc(100svh-72px)] md:min-h-[650px] md:items-center md:px-8 md:py-10 lg:px-12 xl:px-16">
        <motion.div
          aria-hidden
          style={{ opacity: reduceMotion ? 1 : sageOpacity }}
          className="absolute inset-0 bg-primary-light dark:bg-dispatch-map"
        />

        <div className="relative mx-auto w-full max-w-dispatch-page">
          <div className="grid items-center gap-10 md:grid-cols-[minmax(300px,.7fr)_minmax(0,1.3fr)] md:gap-6 lg:grid-cols-[minmax(420px,.72fr)_minmax(0,1.28fr)]">
            <div className="relative z-10 md:pr-8 rtl:md:pl-8 rtl:md:pr-0">
              <div className="hidden md:absolute md:-left-11 md:top-1 md:block md:h-56 md:w-4 rtl:md:-right-11 rtl:md:left-auto">
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-dispatch-line" />
                {stageIds.map((stage, index) => (
                  <span
                    key={stage}
                    className={`absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full ring-1 transition-colors duration-300 ${
                      index <= activeStage
                        ? "bg-primary-dark ring-primary-dark"
                        : "bg-dispatch-ground ring-dispatch-muted"
                    }`}
                    style={{ top: `${index * 50}%` }}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-dispatch-muted sm:text-sm">
                {t("journey.eyebrow")}
              </p>
              <h2
                id="journey-title"
                className="mt-7 max-w-[12ch] text-balance text-[clamp(3rem,5vw,5rem)] font-medium leading-[0.98] tracking-[-0.035em] text-dispatch-ink"
              >
                {t("journey.title")}
                <span className="font-editorial mt-2 block italic leading-[0.92] text-primary-dark">
                  {t("journey.accent")}
                </span>
              </h2>
            </div>

            <div className="relative md:min-h-[540px] lg:min-h-[620px]">
              <svg
                aria-hidden
                viewBox="0 0 940 620"
                preserveAspectRatio="none"
                className="absolute inset-0 hidden h-full w-full overflow-visible md:block"
              >
                <path
                  d="M-10 92H180C216 92 220 124 220 158V200C220 238 253 246 292 246H410C470 246 478 300 478 345V430C478 478 512 492 560 492H686C742 492 760 456 788 424L836 370H950"
                  fill="none"
                  stroke="var(--dispatch-line)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M-10 92H180C216 92 220 124 220 158V200C220 238 253 246 292 246H410C470 246 478 300 478 345V430C478 478 512 492 560 492H686C742 492 760 456 788 424L836 370H950"
                  fill="none"
                  stroke="var(--primary-dark)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={{ pathLength: reduceMotion ? 1 : progress }}
                />
              </svg>

              <div className="relative h-[390px] md:static md:h-auto">
                <div className="absolute inset-x-[8%] top-[30%] h-[44%] rounded-[50%] bg-[#e5ecda] shadow-[0_28px_52px_rgba(21,25,20,0.1)] dark:bg-[#293126] dark:shadow-[0_28px_52px_rgba(0,0,0,0.3)] md:inset-x-[18%] md:top-[24%] md:h-[48%]" />
                <motion.div
                  style={
                    reduceMotion
                      ? undefined
                      : { x: bagX, y: bagY, rotate: bagRotate }
                  }
                  className="absolute inset-x-[14%] top-[18%] z-10 flex h-[70%] items-center justify-center md:inset-x-[24%] md:top-[18%] md:h-[58%]"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={deliveryBag}
                      alt={t("journey.bagAlt")}
                      priority={false}
                      sizes="(max-width: 768px) 72vw, 38vw"
                      className="h-full w-full object-contain drop-shadow-[0_26px_30px_rgba(21,25,20,0.17)]"
                    />
                    <Image
                      src="/assets/images/svgs/logo.svg"
                      alt=""
                      width={203}
                      height={48}
                      className="absolute left-[21%] top-[48%] h-auto w-[39%] opacity-90"
                    />
                  </div>
                </motion.div>

                <div className="absolute right-[2%] top-[3%] h-44 w-28 text-primary-dark md:right-[2%] md:top-[4%] md:h-52 md:w-32 lg:h-60 lg:w-36 rtl:left-[2%] rtl:right-auto">
                  <Doorway />
                </div>
              </div>

              <div className="relative mt-2 grid gap-0 pl-6 before:absolute before:bottom-5 before:left-[5px] before:top-5 before:w-px before:bg-dispatch-line md:absolute md:inset-0 md:mt-0 md:block md:pl-0 md:before:hidden rtl:pl-0 rtl:pr-6 rtl:before:left-auto rtl:before:right-[5px]">
                {stageIds.map((stage, index) => {
                  const isActive = !isWide || index === activeStage;
                  const isComplete = !isWide || index < activeStage;
                  const desktopPosition = [
                    "md:left-[1%] md:top-[2%] md:w-[28%]",
                    "md:bottom-[-1%] md:left-[22%] md:w-[28%]",
                    "md:bottom-[7%] md:right-[1%] md:w-[27%]",
                  ][index];
                  return (
                    <motion.article
                      key={stage}
                      animate={
                        reduceMotion
                          ? { y: 0 }
                          : { y: isActive ? 0 : 8 }
                      }
                      transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                      className={`relative border-t border-dispatch-line py-4 transition-opacity duration-[380ms] before:absolute before:-left-[26px] before:top-[21px] before:h-[11px] before:w-[11px] before:rounded-full before:border before:border-primary-dark before:bg-dispatch-ground md:absolute md:pb-0 md:pt-4 md:before:hidden rtl:before:-right-[26px] rtl:before:left-auto ${isActive ? "opacity-100" : "opacity-[var(--quiet-inactive-opacity)]"} ${desktopPosition}`}
                    >
                      <div className="flex items-baseline gap-2">
                        <span className={`text-sm font-semibold ${isActive || isComplete ? "text-primary-dark" : "text-dispatch-muted"}`}>
                          0{index + 1}
                        </span>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-dispatch-ink">
                          {t(`journey.stages.${stage}.title`)}
                        </h3>
                      </div>
                      <p className="mt-2 max-w-[24ch] text-sm leading-6 text-dispatch-muted">
                        {t(`journey.stages.${stage}.body`)}
                      </p>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
