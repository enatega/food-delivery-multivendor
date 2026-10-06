"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

// Drawn with the theme's CSS variables (not a Lottie with baked-in colors) so
// it follows the deployment's brand color and light/dark mode automatically.
const PRIMARY = "var(--primary-color)";
const PRIMARY_DARK = "var(--primary-dark)";
const INK = "var(--dispatch-ink)";
const SURFACE = "var(--dispatch-surface)";

const HEART_PATH =
  "M0 6.2C-3.1 1.4-11.2 2.4-11.2 9c0 5.6 6.5 10.3 11.2 13.6C4.7 19.3 11.2 14.6 11.2 9 11.2 2.4 3.1 1.4 0 6.2Z";

const floatingHearts = [
  { x: 52, y: 70, scale: 0.42, delay: 0 },
  { x: 160, y: 58, scale: 0.34, delay: 1.1 },
  { x: 150, y: 120, scale: 0.28, delay: 2.2 },
];

const sparkles = [
  { x: 40, y: 122, delay: 0.4 },
  { x: 172, y: 92, delay: 1.6 },
  { x: 70, y: 40, delay: 2.4 },
];

function FavoritesIllustration() {
  const reduceMotion = useReducedMotion();
  const loop = (duration: number, delay = 0) =>
    reduceMotion
      ? { duration: 0 }
      : { duration, delay, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <svg
      viewBox="0 0 210 190"
      className="h-40 w-40 md:h-56 md:w-56"
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

      {/* Shopping bag, gently bobbing */}
      <motion.g
        animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
        transition={loop(4)}
      >
        <ellipse
          cx="105"
          cy="160"
          rx="40"
          ry="5"
          fill={INK}
          fillOpacity="0.08"
        />
        <path
          d="M86 72v-6a19 19 0 0 1 38 0v6"
          fill="none"
          stroke={INK}
          strokeOpacity="0.55"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect
          x="66"
          y="70"
          width="78"
          height="82"
          rx="14"
          fill={SURFACE}
          stroke={INK}
          strokeOpacity="0.14"
          strokeWidth="2"
        />
        <rect
          x="66"
          y="70"
          width="78"
          height="16"
          rx="8"
          fill={PRIMARY}
          fillOpacity="0.18"
        />
        <circle cx="86" cy="80" r="3" fill={INK} fillOpacity="0.5" />
        <circle cx="124" cy="80" r="3" fill={INK} fillOpacity="0.5" />

        {/* Beating heart on the bag */}
        <g transform="translate(105 100) scale(1.35)">
          <motion.path
            d={HEART_PATH}
            fill={PRIMARY}
            stroke={PRIMARY_DARK}
            strokeWidth="1"
            animate={
              reduceMotion ? undefined : { scale: [1, 1.14, 1, 1.08, 1] }
            }
            transition={loop(1.8)}
          />
        </g>
      </motion.g>

      {/* Hearts drifting up */}
      {floatingHearts.map(({ x, y, scale, delay }) => (
        <motion.g
          key={`${x}-${y}`}
          initial={{ opacity: reduceMotion ? 0.7 : 0 }}
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0, 0.85, 0], y: [0, -26] }
          }
          transition={loop(3.3, delay)}
        >
          <path
            d={HEART_PATH}
            transform={`translate(${x} ${y}) scale(${scale})`}
            fill={PRIMARY}
          />
        </motion.g>
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

export default function FavoritesEmptyState() {
  const t = useTranslations();
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-8 text-center">
      <FavoritesIllustration />
      <h2 className="mt-4 text-xl font-semibold text-dispatch-ink md:text-2xl">
        {t("favorite_products_empty_title")}
      </h2>
      <p className="mt-2 text-sm text-dispatch-muted md:text-base">
        {t("favorite_products_empty_description")}
      </p>
      <Link
        href="/browse"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-primary-color px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus focus-visible:ring-offset-2"
      >
        {t("favorite_products_empty_cta")}
      </Link>
    </div>
  );
}
