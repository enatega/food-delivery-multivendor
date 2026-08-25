"use client";
import { useRouter } from "next/navigation";
import useUser from "@/lib/hooks/useUser";
import Image from "@/lib/ui/useable-components/safe-image";
import useCurrencyFormatter from "@/lib/hooks/useCurrencyFormatter";

export default function SingleVendorCart({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { cart, calculateSubtotal, clearCart } = useUser();
  const { formatCurrency } = useCurrencyFormatter();
  return (
    <div className="flex h-full flex-col p-5 dark:text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your cart</h2>
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700"
        >
          ×
        </button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto py-5">
        {cart.length ? (
          cart.map((item) => (
            <div
              key={item.key}
              className="flex gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700"
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{item.foodTitle || item.title}</p>
                <p className="text-sm text-gray-500">{item.variationTitle}</p>
                <p className="text-sm">Quantity: {item.quantity}</p>
              </div>
              <div className="text-end">
                {item.dealInfo?.discountType && (
                  <span className="mb-1 inline-block rounded-md bg-primary-light px-1.5 py-1 text-xs font-bold uppercase leading-none text-primary-dark dark:bg-primary-color/15">
                    {item.dealInfo.discountType === "PERCENTAGE"
                      ? `${item.dealInfo.discountValue}% OFF`
                      : `${formatCurrency(item.dealInfo.discountValue)} OFF`}
                  </span>
                )}
                <p className="font-semibold text-primary-dark">
                  {formatCurrency(
                    Number(item.discountedUnitPrice ?? item.price ?? 0) *
                      item.quantity,
                  )}
                </p>
                {Number(item.actualUnitPrice ?? 0) >
                  Number(item.discountedUnitPrice ?? item.price ?? 0) && (
                  <p className="text-xs text-gray-500 line-through dark:text-gray-400">
                    {formatCurrency(
                      Number(item.actualUnitPrice) * item.quantity,
                    )}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="py-12 text-center text-gray-500">
            Your Single Vendor cart is empty.
          </p>
        )}
      </div>
      {cart.length > 0 && (
        <div className="border-t pt-4 dark:border-gray-700">
          {cart.some(
            (item) =>
              Number(item.actualUnitPrice ?? 0) >
              Number(item.discountedUnitPrice ?? item.price ?? 0),
          ) && (
            <div className="mb-2 flex justify-between text-sm text-primary-dark">
              <span>Deals savings</span>
              <span>
                -
                {formatCurrency(
                  cart.reduce(
                    (total, item) =>
                      total +
                      Math.max(
                        Number(item.actualUnitPrice ?? 0) -
                          Number(item.discountedUnitPrice ?? item.price ?? 0),
                        0,
                      ) *
                        item.quantity,
                    0,
                  ),
                )}
              </span>
            </div>
          )}
          <div className="mb-4 flex justify-between text-lg font-bold">
            <span>Subtotal</span>
            <span>{formatCurrency(calculateSubtotal())}</span>
          </div>
          <button
            onClick={() => {
              onClose();
              router.push("/order/checkout");
            }}
            className="w-full rounded-full bg-primary-color py-3 font-semibold text-white"
          >
            Continue to checkout
          </button>
          <button
            onClick={() => clearCart()}
            className="mt-2 w-full py-2 text-sm text-red-600"
          >
            Clear cart
          </button>
        </div>
      )}
    </div>
  );
}
