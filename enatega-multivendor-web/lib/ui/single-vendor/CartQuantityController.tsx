"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "@/lib/context/auth/auth.context";
import useToast from "@/lib/hooks/useToast";
import useUser from "@/lib/hooks/useUser";

interface CartQuantityControllerProps {
  foodId: string;
  categoryId?: string;
  variationId?: string;
  foodTitle?: string;
  variationTitle?: string;
  image?: string;
  unitPrice?: number;
  variant?: "overlay" | "details";
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
}: CartQuantityControllerProps) {
  const { authToken, setIsAuthModalVisible } = useAuth();
  const { cart, setSingleVendorItemQuantity } = useUser();
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const cartItem = cart.find(
    (item) => item._id === foodId && item.variation._id === variationId,
  );
  const quantity = cartItem?.quantity ?? 0;
  const isDetails = variant === "details";

  const changeQuantity = async (nextQuantity: number) => {
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
        addons: [],
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
      setIsUpdating(false);
    }
  };

  const stopEvent = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  if (quantity === 0) {
    return (
      <motion.button
        type="button"
        disabled={isUpdating}
        aria-label={`Add ${foodTitle || "product"} to cart`}
        onClick={(event) => {
          stopEvent(event);
          void changeQuantity(1);
        }}
        whileHover={{ scale: isDetails ? 1.015 : 1.08 }}
        whileTap={{ scale: isDetails ? 0.98 : 0.9 }}
        className={`${
          isDetails
            ? "relative h-14 w-full min-w-[190px] gap-3 rounded-2xl border-transparent bg-primary-color px-5 text-white shadow-[0_10px_24px_rgba(90,193,47,0.28)] hover:brightness-95 sm:w-auto"
            : "absolute end-2.5 top-2.5 h-9 min-w-9"
        } z-20 inline-flex items-center justify-center ${isDetails ? "" : "rounded-full border border-primary-color/25 bg-white text-primary-color shadow-[0_5px_18px_rgba(0,0,0,0.16)] hover:bg-primary-light dark:bg-gray-900 dark:hover:bg-gray-800"} transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/50 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70`}
      >
        {isDetails ? (
          <>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <FiShoppingBag aria-hidden className="h-[18px] w-[18px]" />
            </span>
            <span className="font-semibold tracking-[-0.01em]">
              Add to cart
            </span>
            <span className="ms-auto inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary-color shadow-sm">
              <FiPlus aria-hidden className="h-4 w-4" />
            </span>
          </>
        ) : (
          <FiPlus aria-hidden className="h-4 w-4" />
        )}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 25 }}
      onClick={stopEvent}
      className={`${
        isDetails
          ? "relative h-14 w-full min-w-[190px] justify-between rounded-2xl border-transparent bg-primary-color px-2.5 shadow-[0_10px_24px_rgba(90,193,47,0.28)] sm:w-auto"
          : "absolute end-2.5 top-2.5 h-9 rounded-full border border-primary-color bg-white px-1 shadow-[0_5px_18px_rgba(0,0,0,0.16)] dark:bg-gray-900"
      } z-20 inline-flex items-center gap-1`}
      role="group"
      aria-label={`${foodTitle || "Product"} quantity`}
      aria-busy={isUpdating}
    >
      <motion.button
        type="button"
        disabled={isUpdating}
        aria-label={quantity <= 1 ? "Remove from cart" : "Decrease quantity"}
        onClick={(event) => {
          stopEvent(event);
          void changeQuantity(Math.max(0, quantity - 1));
        }}
        whileTap={{ scale: 0.82 }}
        className={`${isDetails ? "h-10 w-10 bg-white/15 hover:bg-white/25" : "h-7 w-7 bg-primary-color hover:brightness-95"} inline-flex items-center justify-center rounded-xl text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-wait disabled:opacity-70`}
      >
        {quantity <= 1 ? <FiTrash2 aria-hidden /> : <FiMinus aria-hidden />}
      </motion.button>

      <span
        className={`${isDetails ? "min-w-14 text-lg text-white" : "min-w-7 text-sm text-gray-900 dark:text-white"} relative inline-flex h-8 items-center justify-center overflow-hidden font-bold tabular-nums`}
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={quantity}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
      </span>

      <motion.button
        type="button"
        disabled={isUpdating}
        aria-label="Increase quantity"
        onClick={(event) => {
          stopEvent(event);
          void changeQuantity(quantity + 1);
        }}
        whileTap={{ scale: 0.82 }}
        className={`${isDetails ? "h-10 w-10 bg-white text-primary-color hover:bg-white/90" : "h-7 w-7 bg-primary-color text-white hover:brightness-95"} inline-flex items-center justify-center rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-wait disabled:opacity-70`}
      >
        <FiPlus aria-hidden />
      </motion.button>
    </motion.div>
  );
}
