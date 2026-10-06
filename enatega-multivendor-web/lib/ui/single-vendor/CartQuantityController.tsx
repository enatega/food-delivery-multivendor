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
  variant?: "overlay" | "details";
  isOutOfStock?: boolean;
  addons?: SingleVendorCartAddonSelection[];
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
  const decreaseLabel = quantity <= 1 ? "Remove from cart" : "Decrease quantity";
  const spring = { type: "spring", stiffness: 460, damping: 32 } as const;

  const animatedCount = (className: string) => (
    <span
      className={`relative inline-flex items-center justify-center overflow-hidden font-bold tabular-nums ${className}`}
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={quantity}
          initial={{ opacity: 0, y: 12, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.7 }}
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
                <span className="tabular-nums">{formatCurrency(unitPrice)}</span>
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

  // Card overlay: a single pill anchored to the image corner that expands
  // from a "+" badge into a stepper once the item is in the cart.
  return (
    <div
      onClick={stopEvent}
      role="group"
      aria-label={`${foodTitle || "Product"} quantity`}
      aria-busy={isUpdating}
      className={`absolute end-2.5 top-2.5 z-20 flex h-10 items-center rounded-full p-1 shadow-[0_8px_22px_rgba(21,25,20,0.22)] backdrop-blur-md transition-colors duration-200 ${
        isActive
          ? "bg-[#151914]/90 ring-1 ring-white/10"
          : "bg-white/95 ring-1 ring-black/5 dark:bg-gray-900/95 dark:ring-white/10"
      }`}
    >
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key="stepper"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={spring}
            className="flex items-center overflow-hidden"
          >
            <motion.button
              type="button"
              disabled={isUpdating}
              aria-label={decreaseLabel}
              onClick={(event) => {
                stopEvent(event);
                void changeQuantity(Math.max(0, quantity - 1));
              }}
              whileTap={{ scale: 0.85 }}
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-wait disabled:opacity-60 ${quantity <= 1 ? "hover:bg-red-500" : "hover:bg-white/20"}`}
            >
              {quantity <= 1 ? (
                <FiTrash2 aria-hidden className="h-3.5 w-3.5" />
              ) : (
                <FiMinus aria-hidden className="h-4 w-4" />
              )}
            </motion.button>
            {animatedCount(
              `h-8 min-w-8 px-1 text-sm text-white ${isUpdating ? "opacity-60" : ""}`,
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
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
        whileHover={isOutOfStock ? undefined : { scale: 1.06 }}
        whileTap={isOutOfStock ? undefined : { scale: 0.85 }}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-color text-[#151914] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
      >
        <FiPlus aria-hidden className="h-4 w-4" strokeWidth={2.75} />
      </motion.button>
    </div>
  );
}
