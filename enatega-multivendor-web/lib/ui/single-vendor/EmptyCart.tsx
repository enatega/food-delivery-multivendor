"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { useTranslations } from "next-intl";

// Drawn with the theme's CSS variables (like FavoritesEmptyState) so it follows
// the deployment's brand color and light/dark mode automatically.
const PRIMARY = "var(--primary-color)";
const PRIMARY_DARK = "var(--primary-dark)";
const INK = "var(--dispatch-ink)";
const SURFACE = "var(--dispatch-surface)";

// Little "items" orbiting the empty bag, waiting to drop in.
const floatingItems = [
  { x: 44, y: 76, size: 14, delay: 0 },
  { x: 160, y: 60, size: 11, delay: 0.9 },
  { x: 166, y: 128, size: 9, delay: 1.8 },
];

const sparkles = [
  { x: 52, y: 132, delay: 0.4 },
  { x: 150, y: 96, delay: 1.5 },
  { x: 76, y: 38, delay: 2.3 },
];

function EmptyCartIllustration() {
  const reduceMotion = useReducedMotion();
  const loop = (duration: number, delay = 0) =>
    reduceMotion
      ? { duration: 0 }
      : { duration, delay, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <svg
      viewBox="0 0 210 190"
      className="h-40 w-40 md:h-48 md:w-48"
      role="img"
      aria-hidden="true"
    >
      {/* Soft backdrop */}
      <circle cx="105" cy="98" r="78" fill={PRIMARY} fillOpacity="0.1" />
      <motion.circle
        cx="105"
        cy="98"
        r="88"
        fill="none"
        stroke={PRIMARY}
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="4 9"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 40, repeat: Infinity, ease: "linear" }
        }
      />

      {/* Ground shadow breathes opposite to the bag's bob */}
      <motion.ellipse
        cx="105"
        cy="166"
        rx="34"
        ry="5"
        fill={INK}
        fillOpacity="0.08"
        animate={reduceMotion ? undefined : { scaleX: [1, 0.86, 1] }}
        transition={loop(3)}
      />

      {/* Shopping bag */}
      <motion.g
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={loop(3)}
      >
        <path
          d="M84 82V70a21 21 0 0 1 42 0v12"
          fill="none"
          stroke={INK}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect x="60" y="76" width="90" height="82" rx="16" fill={PRIMARY} />
        <path
          d="M60 94h90"
          stroke={PRIMARY_DARK}
          strokeOpacity="0.55"
          strokeWidth="2"
        />
        <circle cx="84" cy="86" r="3.5" fill={INK} />
        <circle cx="126" cy="86" r="3.5" fill={INK} />

        {/* Face: blinking eyes and a small "o" mouth */}
        <motion.g
          style={{ transformOrigin: "105px 118px" }}
          animate={reduceMotion ? undefined : { scaleY: [1, 1, 0.1, 1, 1] }}
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 4,
                  times: [0, 0.46, 0.5, 0.54, 1],
                  repeat: Infinity,
                }
          }
        >
          <circle cx="92" cy="118" r="4" fill={INK} />
          <circle cx="118" cy="118" r="4" fill={INK} />
        </motion.g>
        <ellipse cx="105" cy="136" rx="5" ry="4" fill={INK} />
        <circle cx="82" cy="130" r="5" fill={SURFACE} fillOpacity="0.35" />
        <circle cx="128" cy="130" r="5" fill={SURFACE} fillOpacity="0.35" />
      </motion.g>

      {/* Floating items */}
      {floatingItems.map(({ x, y, size, delay }) => (
        <motion.rect
          key={`${x}-${y}`}
          x={x - size / 2}
          y={y - size / 2}
          width={size}
          height={size}
          rx={size / 3.5}
          fill={SURFACE}
          stroke={PRIMARY_DARK}
          strokeWidth="2"
          style={{ transformOrigin: `${x}px ${y}px` }}
          animate={
            reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, 12, 0] }
          }
          transition={loop(3.2, delay)}
        />
      ))}

      {/* Twinkling sparkles */}
      {sparkles.map(({ x, y, delay }) => (
        <motion.path
          key={`${x}-${y}`}
          d={`M${x} ${y - 6}v12M${x - 6} ${y}h12`}
          stroke={PRIMARY_DARK}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ opacity: 0.6 }}
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.15, 0.9, 0.15], scale: [0.7, 1.1, 0.7] }
          }
          transition={loop(2.4, delay)}
        />
      ))}
    </svg>
  );
}

export default function SingleVendorEmptyCart({
  onBrowse,
}: {
  onBrowse: () => void;
}) {
  const t = useTranslations();
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
      <EmptyCartIllustration />
      <h3 className="mt-4 font-dispatch text-xl font-semibold tracking-[-0.02em] text-dispatch-ink dark:text-white">
        {t("your_cart_is_empty")}
      </h3>
      <p className="mt-1.5 max-w-xs text-sm text-dispatch-muted dark:text-gray-400">
        {t("add_items_to_cart_to_continue")}
      </p>
      <Link
        href="/browse"
        onClick={onBrowse}
        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-primary-color px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 focus-visible:ring-offset-2"
      >
        {t("tab_browse")}
        <FiArrowRight
          aria-hidden
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100"
        />
      </Link>
    </div>
  );
}
