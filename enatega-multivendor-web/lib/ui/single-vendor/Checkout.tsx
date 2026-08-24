"use client";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  SINGLE_VENDOR_CALCULATE_CHECKOUT,
  SINGLE_VENDOR_PLACE_ORDER,
  SINGLE_VENDOR_SCHEDULE,
} from "@/lib/api/graphql/single-vendor";
import {
  getModeEnvironment,
  modeStorage,
  useAppMode,
  useModeSensitiveOperation,
} from "@/lib/mode";
import { getAccessToken } from "@/lib/utils/methods/auth";
import useUser from "@/lib/hooks/useUser";
import useCurrencyFormatter from "@/lib/hooks/useCurrencyFormatter";
import { useUserAddress } from "@/lib/context/address/address.context";

const toCheckoutCoordinate = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
};

export default function SingleVendorCheckout() {
  const router = useRouter();
  const { mode } = useAppMode();
  const environment = getModeEnvironment(mode);
  const { profile, cart, clearCart } = useUser();
  const { userAddress } = useUserAddress();
  const { currencySymbol, currency, formatCurrency } = useCurrencyFormatter();
  const [pickup, setPickup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [tip, setTip] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [priority, setPriority] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [schedule, setSchedule] = useState<any>(null);
  const idempotencyKey = useRef(
    `sv-web-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const profileAddress =
    profile?.addresses?.find((item) => item.selected) ??
    profile?.addresses?.[0];
  const userAddressCoordinates = userAddress?.location?.coordinates;
  const hasUserAddressCoordinates =
    toCheckoutCoordinate(userAddressCoordinates?.[1]) !== null &&
    toCheckoutCoordinate(userAddressCoordinates?.[0]) !== null;
  const address = hasUserAddressCoordinates ? userAddress : profileAddress;
  const coordinates = address?.location?.coordinates ?? [];
  const latitude = toCheckoutCoordinate(coordinates[1]);
  const longitude = toCheckoutCoordinate(coordinates[0]);
  const hasDeliveryCoordinates = latitude !== null && longitude !== null;
  const checkout = useQuery(SINGLE_VENDOR_CALCULATE_CHECKOUT, {
    variables: {
      isPickup: pickup,
      latDestination: latitude,
      longDestination: longitude,
      coupon: coupon || undefined,
    },
    skip: !profile || (!pickup && !hasDeliveryCoordinates),
    fetchPolicy: "network-only",
  });
  const scheduleQuery = useQuery(SINGLE_VENDOR_SCHEDULE);
  const [placeOrder, placeState] = useMutation(SINGLE_VENDOR_PLACE_ORDER);
  useModeSensitiveOperation(placeState.loading);
  const summary = checkout.data?.calculateCheckout;

  const submit = async () => {
    if (
      !profile ||
      (!pickup && (!address || !hasDeliveryCoordinates)) ||
      !cart.length
    )
      return;
    const result = await placeOrder({
      variables: {
        paymentMethod,
        address: pickup
          ? {
              label: "Pickup",
              deliveryAddress: "",
              details: "",
              longitude: "0",
              latitude: "0",
            }
          : {
              label: address!.label,
              deliveryAddress: address!.deliveryAddress,
              details: address!.details || "",
              longitude: String(longitude),
              latitude: String(latitude),
            },
        tipping: pickup ? 0 : tip,
        orderDate: new Date().toISOString(),
        isPickedUp: pickup,
        specialInstructions: instructions,
        instructions,
        isPriority: priority,
        couponCode: coupon || undefined,
        checkoutQuoteId: summary?.checkoutQuoteId,
        idempotencyKey: idempotencyKey.current,
        scheduleData: schedule
          ? {
              isScheduled: true,
              dayId: schedule.dayId,
              scheduleTimeId: schedule.scheduleTimeId,
            }
          : undefined,
      },
    });
    const order = result.data?.placeOrder;
    if (!order) return;
    if (paymentMethod === "COD") {
      clearCart();
      router.replace(`/order/${order.orderId}/tracking`);
      return;
    }
    modeStorage.set("pending_stripe_order_id", order._id);
    modeStorage.set("pending_stripe_started_at", String(Date.now()));
    const response = await fetch(
      `${environment.restUrl}stripe/create-web-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken(mode)}`,
        },
        body: JSON.stringify({
          id: order._id,
          payment_method: paymentMethod === "PAYPAL" ? "paypal" : "card",
        }),
      },
    );
    const payload = await response.json();
    if (!response.ok || !payload.checkoutUrl)
      throw new Error(payload.error || "Unable to start payment");
    window.location.assign(payload.checkoutUrl);
  };

  if (!cart.length)
    return (
      <div className="mx-auto my-16 max-w-lg text-center">
        <h1 className="text-2xl font-bold dark:text-white">
          Your cart is empty
        </h1>
        <button
          onClick={() => router.push("/browse")}
          className="mt-5 rounded-full bg-primary-color px-6 py-3 font-semibold text-white"
        >
          Browse products
        </button>
      </div>
    );
  return (
    <div className="mx-auto grid max-w-5xl gap-6 py-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Checkout
        </h1>
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="font-semibold dark:text-white">Fulfillment</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => setPickup(false)}
              className={`rounded-xl border p-3 ${!pickup ? "border-primary-color bg-primary-light text-primary-color" : "border-gray-200 dark:border-gray-700"}`}
            >
              Delivery
            </button>
            <button
              onClick={() => setPickup(true)}
              className={`rounded-xl border p-3 ${pickup ? "border-primary-color bg-primary-light text-primary-color" : "border-gray-200 dark:border-gray-700"}`}
            >
              Pickup
            </button>
          </div>
          {!pickup && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              {address?.deliveryAddress ||
                "Add and select a delivery address from your profile."}
            </p>
          )}
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="font-semibold dark:text-white">Payment</h2>
          <div className="mt-3 space-y-2">
            {[
              ["COD", "Cash on delivery"],
              ["STRIPE", "Card / Apple Pay / Google Pay"],
              ["PAYPAL", "PayPal"],
            ].map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700"
              >
                <input
                  type="radio"
                  checked={paymentMethod === value}
                  onChange={() => setPaymentMethod(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <label className="font-semibold dark:text-white">Delivery time</label>
          <select
            value={schedule ? JSON.stringify(schedule) : ""}
            onChange={(event) =>
              setSchedule(
                event.target.value ? JSON.parse(event.target.value) : null,
              )
            }
            className="mt-3 w-full rounded-xl border border-gray-200 bg-transparent p-3 dark:border-gray-700 dark:text-white"
          >
            <option value="">As soon as possible</option>
            {(scheduleQuery.data?.getScheduleByDay ?? []).flatMap((day: any) =>
              (day.timings ?? []).flatMap((timing: any) =>
                (timing.times ?? []).map((time: any) => {
                  const value = { dayId: day.dayId, scheduleTimeId: time.id };
                  return (
                    <option
                      key={`${day.dayId}-${time.id}`}
                      value={JSON.stringify(value)}
                    >
                      {day.day}: {time.startTime}–{time.endTime}
                    </option>
                  );
                }),
              ),
            )}
          </select>
          <label className="mt-5 block font-semibold dark:text-white">
            Voucher code
          </label>
          <input
            value={coupon}
            onChange={(event) => setCoupon(event.target.value)}
            onBlur={() => void checkout.refetch()}
            placeholder="Optional"
            className="mt-3 w-full rounded-xl border border-gray-200 bg-transparent p-3 dark:border-gray-700 dark:text-white"
          />
          <label className="mt-5 block font-semibold dark:text-white">
            Order instructions
          </label>
          <textarea
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            className="mt-3 w-full rounded-xl border border-gray-200 bg-transparent p-3 dark:border-gray-700 dark:text-white"
          />
          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm dark:text-gray-200">
              Tip ({currencySymbol || currency}){" "}
              <input
                type="number"
                min="0"
                value={tip}
                onChange={(event) => setTip(Number(event.target.value))}
                className="ms-2 w-24 rounded-lg border p-2 dark:border-gray-700 dark:bg-gray-900"
              />
            </label>
            <label className="text-sm dark:text-gray-200">
              <input
                type="checkbox"
                checked={priority}
                onChange={(event) => setPriority(event.target.checked)}
                className="me-2"
              />
              Priority delivery
            </label>
          </div>
        </section>
      </div>
      <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-xl font-semibold dark:text-white">Order summary</h2>
        {checkout.loading ? (
          <div className="my-5 h-32 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700" />
        ) : (
          <dl className="my-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatCurrency(summary?.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{formatCurrency(summary?.deliveryCharges)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Tax</dt>
              <dd>{formatCurrency(summary?.taxAmount)}</dd>
            </div>
            {summary?.totalDiscount > 0 && (
              <div className="flex justify-between text-primary-color">
                <dt>Discount</dt>
                <dd>{formatCurrency(-summary.totalDiscount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t pt-3 text-base font-bold dark:border-gray-700">
              <dt>Total</dt>
              <dd>{formatCurrency(summary?.grandTotal)}</dd>
            </div>
          </dl>
        )}
        <button
          disabled={
            placeState.loading ||
            checkout.loading ||
            (!pickup && !hasDeliveryCoordinates)
          }
          onClick={() => void submit()}
          className="w-full rounded-full bg-primary-color px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          {placeState.loading ? "Placing order…" : "Place order"}
        </button>
        {placeState.error && (
          <p className="mt-3 text-sm text-red-600">
            {placeState.error.message}
          </p>
        )}
      </aside>
    </div>
  );
}
