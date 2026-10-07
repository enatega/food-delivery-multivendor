"use client";
import { motion, useReducedMotion } from "framer-motion";
import { FiCreditCard, FiMapPin } from "react-icons/fi";

// Shown while checkout hands off to order tracking or the payment provider:
// an animated success check, then a hint of where the customer is going next.
export default function OrderPlacedState({
  isOnlinePayment,
}: {
  isOnlinePayment: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const NextIcon = isOnlinePayment ? FiCreditCard : FiMapPin;
  // Stroke-draw props for an SVG shape; skipped entirely for reduced motion.
  const draw = (delay: number, duration: number) => ({
    initial: reduceMotion ? false : { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: {
      pathLength: { delay, duration, ease: "easeOut" as const },
      opacity: { delay, duration: 0.01 },
    },
  });

  return (
    <div
      className="mx-auto my-16 flex max-w-lg flex-col items-center px-4 text-center"
      aria-busy="true"
      role="status"
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        {!reduceMotion &&
          [0, 1].map((ring) => (
            <motion.span
              key={ring}
              aria-hidden
              className="absolute inset-0 rounded-full bg-primary-color/25"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.5], opacity: [0.6, 0] }}
              transition={{
                delay: 0.7 + ring * 0.6,
                duration: 1.6,
                repeat: Infinity,
                repeatDelay: 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        <motion.svg
          aria-hidden
          viewBox="0 0 52 52"
          className="relative h-20 w-20"
          initial={reduceMotion ? false : { scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
        >
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            className="fill-primary-color"
            initial={reduceMotion ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            style={{ originX: "50%", originY: "50%" }}
            transition={{ delay: 0.35, duration: 0.3, ease: "easeOut" }}
          />
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            fill="none"
            strokeWidth="3"
            className="stroke-primary-color"
            {...draw(0, 0.45)}
          />
          <motion.path
            d="M15 27l7 7 15-16"
            fill="none"
            stroke="white"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...draw(0.55, 0.35)}
          />
        </motion.svg>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.35 }}
      >
        <h1 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">
          Order placed!
        </h1>
        <p className="mt-1.5 inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <NextIcon aria-hidden className="h-4 w-4 text-primary-dark" />
          {isOnlinePayment
            ? "Redirecting you to secure payment"
            : "Opening order tracking"}
          <span aria-hidden className="inline-flex gap-0.5">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="h-1 w-1 rounded-full bg-current"
                animate={reduceMotion ? undefined : { opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: dot * 0.2,
                }}
              />
            ))}
          </span>
        </p>
      </motion.div>
    </div>
  );
}
