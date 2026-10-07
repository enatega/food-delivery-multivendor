"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { useRef, useState } from "react";
import { useAuth } from "@/lib/context/auth/auth.context";
import useToast from "@/lib/hooks/useToast";
import useUser from "@/lib/hooks/useUser";
import useCurrencyFormatter from "@/lib/hooks/useCurrencyFormatter";
import { useTranslations } from "next-intl";
import {
  isSingleVendorCartConfiguration,
  type SingleVendorCartAddonSelection,
} from "@/lib/mode/singleVendorCart";

interface CartQuantityControllerProps {
  foodId: string;
  categoryId?: string;
  variationId?: string;
  foodTitle?: string;
  variationTitle?: string;
  image?: string;
  unitPrice?: number;
  variant?: "overlay" | "details" | "inline";
  isOutOfStock?: boolean;
  addons?: SingleVendorCartAddonSelection[];
  /** Overlay placement classes; defaults to the top-end image corner. */
  className?: string;
}

export default function CartQuantityController({
  foodId,
  categoryId,
  variationId,
  foodTitle,
  variationTitle,
  image,
  unitPrice,
  variant = "overlay",
  isOutOfStock = false,
  addons = [],
  className = "end-2.5 top-2.5",
}: CartQuantityControllerProps) {
  const t = useTranslations();
  const { authToken, setIsAuthModalVisible } = useAuth();
  const { cart, setSingleVendorItemQuantity } = useUser();
  const { showToast } = useToast();
  const { formatCurrency } = useCurrencyFormatter();
  const [isUpdating, setIsUpdating] = useState(false);
  const updatePendingRef = useRef(false);
  const cartItem = cart.find((item) =>
    variationId
      ? isSingleVendorCartConfiguration(item, foodId, variationId, addons)
      : false,
  );
  const quantity = cartItem?.quantity ?? 0;
  const isDetails = variant === "details";
  // Inline: a light, static stepper for cart rows (same behavior as overlay).
  const isInline = variant === "inline";

  const changeQuantity = async (nextQuantity: number) => {
    if (updatePendingRef.current) return;
    if (isOutOfStock && nextQuantity > quantity) return;
    if (!authToken) {
      setIsAuthModalVisible(true);
      return;
    }

    if (!categoryId || !variationId) {
      showToast({
        type: "error",
        title: "Cart unavailable",
        message: "This product cannot be added to the cart right now.",
      });
      return;
    }

    try {
      updatePendingRef.current = true;
      setIsUpdating(true);
      await setSingleVendorItemQuantity({
        foodId,
        categoryId,
        variationId,
        quantity: nextQuantity,
        foodTitle,
        variationTitle,
        image,
        unitPrice,
        addons,
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Cart update failed",
        message:
          error instanceof Error
            ? error.message
            : "Please try updating your cart again.",
      });
    } finally {
      updatePendingRef.current = false;
      setIsUpdating(false);
    }
  };

  const stopEvent = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const isActive = quantity > 0;
  // Direction of the last change, so the count rolls up on add and down on remove.
  // Only recomputed when the quantity actually changes, so unrelated
  // re-renders keep the last direction.
  const lastChangeRef = useRef({ quantity, direction: 1 });
  if (lastChangeRef.current.quantity !== quantity) {
    lastChangeRef.current = {
      quantity,
      direction: quantity > lastChangeRef.current.quantity ? 1 : -1,
    };
  }
  const direction = lastChangeRef.current.direction;
  const decreaseLabel =
    quantity <= 1 ? "Remove from cart" : "Decrease quantity";
  const spring = { type: "spring", stiffness: 460, damping: 32 } as const;

  const animatedCount = (className: string) => (
    <span
      className={`relative inline-flex items-center justify-center overflow-hidden font-bold tabular-nums ${className}`}
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.span
          key={quantity}
          custom={direction}
          variants={{
            enter: (dir: number) => ({ opacity: 0, y: 12 * dir, scale: 0.7 }),
            center: { opacity: 1, y: 0, scale: 1 },
            exit: (dir: number) => ({ opacity: 0, y: -12 * dir, scale: 0.7 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.18 }}
        >
          {quantity}
        </motion.span>
      </AnimatePresence>
    </span>
  );

  if (isDetails) {
    if (!isActive) {
      return (
        <motion.button
          type="button"
          disabled={isUpdating || isOutOfStock}
          aria-label={
            isOutOfStock
              ? `${foodTitle || "Product"} is out of stock`
              : `Add ${foodTitle || "product"} to cart`
          }
          onClick={(event) => {
            stopEvent(event);
            void changeQuantity(1);
          }}
          whileHover={isOutOfStock ? undefined : { y: -1 }}
          whileTap={isOutOfStock ? undefined : { scale: 0.98 }}
          className="group/add relative inline-flex h-14 w-full items-center justify-between gap-4 rounded-2xl bg-primary-color py-2 pe-2 ps-5 text-[#151914] shadow-[0_10px_24px_rgba(90,193,47,0.32)] transition-[filter,box-shadow] hover:brightness-[1.03] hover:shadow-[0_14px_30px_rgba(90,193,47,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none sm:w-auto sm:min-w-[260px] dark:focus-visible:ring-offset-gray-800 dark:disabled:bg-gray-700 dark:disabled:text-gray-300"
        >
          <span className="inline-flex items-center gap-2.5 font-semibold tracking-[-0.01em]">
            <FiShoppingBag aria-hidden className="h-[18px] w-[18px]" />
            {isOutOfStock ? t("out_of_stock_label") : "Add to cart"}
          </span>
          {!isOutOfStock && (
            <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#151914] px-3 text-sm font-semibold text-white">
              {typeof unitPrice === "number" && (
                <span className="tabular-nums">
                  {formatCurrency(unitPrice)}
                </span>
              )}
              <FiPlus
                aria-hidden
                className="h-4 w-4 transition-transform duration-200 group-hover/add:rotate-90"
              />
            </span>
          )}
        </motion.button>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={spring}
        onClick={stopEvent}
        role="group"
        aria-label={`${foodTitle || "Product"} quantity`}
        aria-busy={isUpdating}
        className="inline-flex h-14 w-full items-center justify-between gap-2 rounded-2xl border border-primary-color/50 bg-primary-light p-1.5 sm:w-auto sm:min-w-[260px] dark:bg-gray-900"
      >
        <motion.button
          type="button"
          disabled={isUpdating}
          aria-label={decreaseLabel}
          onClick={(event) => {
            stopEvent(event);
            void changeQuantity(Math.max(0, quantity - 1));
          }}
          whileTap={{ scale: 0.88 }}
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#151914] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 disabled:cursor-wait disabled:opacity-60 dark:bg-gray-800 dark:text-white ${quantity <= 1 ? "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400" : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}
        >
          {quantity <= 1 ? (
            <FiTrash2 aria-hidden className="h-[18px] w-[18px]" />
          ) : (
            <FiMinus aria-hidden className="h-[18px] w-[18px]" />
          )}
        </motion.button>

        <div className="flex min-w-0 flex-1 flex-col items-center leading-none">
          {animatedCount("h-6 text-lg text-gray-900 dark:text-white")}
          <span
            className={`mt-1 text-[11px] font-medium text-dispatch-muted dark:text-gray-400 ${isUpdating ? "animate-pulse" : ""}`}
          >
            {isUpdating
              ? "Updating…"
              : typeof unitPrice === "number"
                ? `In cart · ${formatCurrency(unitPrice * quantity)}`
                : "In cart"}
          </span>
        </div>

        <motion.button
          type="button"
          disabled={isUpdating || isOutOfStock}
          aria-label="Increase quantity"
          onClick={(event) => {
            stopEvent(event);
            void changeQuantity(quantity + 1);
          }}
          whileTap={{ scale: 0.88 }}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-color text-[#151914] shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 disabled:cursor-wait disabled:opacity-60"
        >
          <FiPlus aria-hidden className="h-[18px] w-[18px]" />
        </motion.button>
      </motion.div>
    );
  }

  // Card overlay: a compact "+" badge on the image corner that grows into a
  // glassy stepper once the item is in the cart. The inline variant reuses it
  // as a light pill in cart rows.
  return (
    <motion.div
      layout
      transition={spring}
      onClick={stopEvent}
      role="group"
      aria-label={`${foodTitle || "Product"} quantity`}
      aria-busy={isUpdating}
      style={{ borderRadius: 999 }}
      className={`${isInline ? "relative" : `absolute ${className} z-20`} flex items-center gap-1 p-[3px] backdrop-blur-md transition-[background-color,box-shadow] duration-200 ${
        isInline
          ? "bg-dispatch-map ring-1 ring-dispatch-line dark:bg-gray-800 dark:ring-gray-700"
          : isActive
            ? "bg-[#151914]/85 shadow-[0_10px_24px_rgba(21,25,20,0.32)] ring-1 ring-white/10"
            : "bg-white/90 shadow-[0_6px_16px_rgba(21,25,20,0.18)] ring-1 ring-black/5 dark:bg-gray-900/90 dark:ring-white/10"
      }`}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {isActive && (
          <motion.div
            key="stepper"
            initial={{ opacity: 0, scale: 0.6, x: 12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 12 }}
            transition={spring}
            className="flex items-center gap-0.5"
          >
            <motion.button
              type="button"
              disabled={isUpdating}
              aria-label={decreaseLabel}
              onClick={(event) => {
                stopEvent(event);
                void changeQuantity(Math.max(0, quantity - 1));
              }}
              whileTap={{ scale: 0.82 }}
              className={`inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-wait disabled:opacity-60 ${
                isInline
                  ? `bg-white text-dispatch-ink shadow-sm focus-visible:ring-primary-color/60 dark:bg-gray-900 dark:text-white ${quantity <= 1 ? "hover:bg-red-500 hover:text-white" : "hover:bg-dispatch-line dark:hover:bg-gray-700"}`
                  : `bg-white/[0.12] text-white focus-visible:ring-white/70 ${quantity <= 1 ? "hover:bg-red-500" : "hover:bg-white/25"}`
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={quantity <= 1 ? "trash" : "minus"}
                  initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex"
                >
                  {quantity <= 1 ? (
                    <FiTrash2 aria-hidden className="h-3.5 w-3.5" />
                  ) : (
                    <FiMinus
                      aria-hidden
                      className="h-3.5 w-3.5"
                      strokeWidth={3}
                    />
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.button>
            {animatedCount(
              `h-[30px] min-w-[22px] px-0.5 text-[13px] ${isInline ? "text-dispatch-ink dark:text-white" : "text-white"} ${isUpdating ? "opacity-60" : ""}`,
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout="position"
        type="button"
        disabled={isUpdating || isOutOfStock}
        aria-label={
          isOutOfStock
            ? `${foodTitle || "Product"} is out of stock`
            : isActive
              ? "Increase quantity"
              : `Add ${foodTitle || "product"} to cart`
        }
        onClick={(event) => {
          stopEvent(event);
          void changeQuantity(quantity + 1);
        }}
        whileHover={isOutOfStock ? undefined : { scale: 1.08 }}
        whileTap={isOutOfStock ? undefined : { scale: 0.82 }}
        className="group/plus relative inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-primary-color text-[#151914] shadow-[inset_0_-2px_0_rgba(21,25,20,0.12)] transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
      >
        {/* Ripple that pulses out each time a unit is added. */}
        <AnimatePresence initial={false}>
          {isActive && direction > 0 && (
            <motion.span
              key={`ripple-${quantity}`}
              aria-hidden
              initial={{ scale: 1, opacity: 0.55 }}
              animate={{ scale: 1.9, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 rounded-full bg-primary-color"
            />
          )}
        </AnimatePresence>
        <FiPlus
          aria-hidden
          className="relative h-4 w-4 transition-transform duration-300 group-hover/plus:rotate-90"
          strokeWidth={3}
        />
      </motion.button>
    </motion.div>
  );
}
