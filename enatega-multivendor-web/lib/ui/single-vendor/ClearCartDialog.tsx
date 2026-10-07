"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useTranslations } from "next-intl";
import Image from "@/lib/ui/useable-components/safe-image";

interface ClearCartDialogProps {
  visible: boolean;
  itemCount: number;
  /** Up to the first few item images, shown as a stacked preview. */
  images: string[];
  onCancel: () => void;
  onConfirm: () => void;
}

// Confirmation drawn inside the cart panel (not a portal dialog) so it never
// fights the cart sidebar's own overlay stacking.
export default function ClearCartDialog({
  visible,
  itemCount,
  images,
  onCancel,
  onConfirm,
}: ClearCartDialogProps) {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const previews = images.filter(Boolean).slice(0, 3);
  const extra = itemCount - previews.length;

  useEffect(() => {
    if (!visible) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCancel();
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [onCancel, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="clear-cart-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onCancel}
          className="absolute inset-0 z-30 flex items-center justify-center bg-[#151914]/45 p-6 backdrop-blur-[2px]"
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="clear-cart-title"
            aria-describedby="clear-cart-description"
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="w-full max-w-sm rounded-3xl border border-dispatch-line bg-dispatch-surface p-6 text-center shadow-dispatch-overlay dark:border-gray-700 dark:bg-gray-900"
          >
            {/* Stacked item preview with a trash badge */}
            <div className="relative mx-auto mb-5 flex h-16 w-fit items-center justify-center">
              {previews.length > 0 ? (
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {previews.map((src, index) => (
                    <motion.div
                      key={`${src}-${index}`}
                      initial={{ opacity: 0, y: 8, rotate: 0 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        rotate: (index - (previews.length - 1) / 2) * 8,
                      }}
                      transition={{ delay: 0.06 * index + 0.05 }}
                      className="relative h-14 w-14 overflow-hidden rounded-2xl bg-dispatch-map ring-[3px] ring-dispatch-surface dark:bg-gray-800 dark:ring-gray-900"
                    >
                      <Image
                        src={src}
                        alt=""
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  ))}
                  {extra > 0 && (
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-dispatch-map text-sm font-bold tabular-nums text-dispatch-ink ring-[3px] ring-dispatch-surface dark:bg-gray-800 dark:text-white dark:ring-gray-900">
                      +{extra}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-red-50 dark:bg-red-950/30" />
              )}
              <motion.span
                aria-hidden
                initial={{ scale: 0 }}
                animate={
                  reduceMotion
                    ? { scale: 1 }
                    : { scale: 1, rotate: [0, -14, 12, -8, 0] }
                }
                transition={{
                  scale: {
                    type: "spring",
                    stiffness: 500,
                    damping: 18,
                    delay: 0.2,
                  },
                  rotate: { duration: 0.6, delay: 0.35 },
                }}
                className="absolute -bottom-2 -end-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_6px_16px_rgba(239,68,68,0.4)] ring-[3px] ring-dispatch-surface dark:ring-gray-900"
              >
                <FiTrash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
              </motion.span>
            </div>

            <h3
              id="clear-cart-title"
              className="font-dispatch text-lg font-semibold tracking-[-0.02em] text-dispatch-ink dark:text-white"
            >
              {t("are_you_sure_label")}
            </h3>
            <p
              id="clear-cart-description"
              className="mx-auto mt-1.5 max-w-[17rem] text-sm text-dispatch-muted dark:text-gray-400"
            >
              This will remove all {itemCount}{" "}
              {itemCount === 1 ? t("item_label") : t("items_label")} from your
              cart. This can&apos;t be undone.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <button
                ref={cancelRef}
                type="button"
                onClick={onCancel}
                className="h-11 rounded-xl border border-dispatch-line bg-dispatch-surface text-sm font-semibold text-dispatch-ink transition-colors hover:bg-dispatch-map focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              >
                {t("cancel_label")}
              </button>
              <motion.button
                type="button"
                onClick={onConfirm}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-red-500 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(239,68,68,0.3)] transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                <FiTrash2 aria-hidden className="h-3.5 w-3.5" />
                {t("clear_cart_button")}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
