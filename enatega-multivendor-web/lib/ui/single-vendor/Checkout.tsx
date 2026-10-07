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
import useCheckoutDestination from "./useCheckoutDestination";
import CheckoutSummary from "./CheckoutSummary";
import CheckoutExtras from "./CheckoutExtras";
import OrderPlacedState from "./OrderPlacedState";
import {
  CHECKOUT_FIELD_CLASS,
  CHECKOUT_SECTION_CLASS,
  StepHeading,
} from "./CheckoutSection";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiCreditCard,
  FiMapPin,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";

export default function SingleVendorCheckout() {
  const router = useRouter();
  const { mode } = useAppMode();
  const environment = getModeEnvironment(mode);
  const { profile, cart, clearCart } = useUser();
  const [pickup, setPickup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [tip, setTip] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [priority, setPriority] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [schedule, setSchedule] = useState<any>(null);
  // Set once the order is placed and we are leaving checkout (tracking page or
  // payment provider). Keeps the "Your cart is empty" view from flashing after
  // the cart is cleared, and keeps Place order disabled during the hand-off.
  const [isLeavingCheckout, setLeavingCheckout] = useState(false);
  const idempotencyKey = useRef(
    `sv-web-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const { address, latitude, longitude, hasDeliveryCoordinates } =
    useCheckoutDestination();
  const checkout = useQuery(SINGLE_VENDOR_CALCULATE_CHECKOUT, {
    variables: {
      isPickup: pickup,
      latDestination: latitude,
      longDestination: longitude,
      coupon: coupon || undefined,
    },
    skip: !profile || (!pickup && !hasDeliveryCoordinates),
    // The cart prefetches this quote, so render it immediately and refresh.
    // Place order stays disabled while loading, so it always uses a fresh
    // checkoutQuoteId.
    fetchPolicy: "cache-and-network",
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
    setLeavingCheckout(true);
    if (paymentMethod === "COD") {
      router.replace(`/order/${order.orderId}/tracking`);
      clearCart();
      return;
    }
    try {
      await startOnlinePayment(order);
    } catch (error) {
      setLeavingCheckout(false);
      throw error;
    }
  };

  const startOnlinePayment = async (order: { _id: string }) => {
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

  if (isLeavingCheckout)
    return <OrderPlacedState isOnlinePayment={paymentMethod !== "COD"} />;
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
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const isMissingAddress = !pickup && !hasDeliveryCoordinates;
  const paymentOptions = [
    {
      value: "COD",
      label: pickup ? "Cash on pickup" : "Cash on delivery",
      description: pickup
        ? "Pay when you collect your order"
        : "Pay when your order arrives",
      icon: FaMoneyBillWave,
    },
    {
      value: "STRIPE",
      label: "Card",
      description: "Card, Apple Pay or Google Pay · Secure checkout",
      icon: FiCreditCard,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-5 lg:px-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Checkout
        </h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          {itemCount} {itemCount === 1 ? "item" : "items"} · Review your details
          and place your order
        </p>
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-5">
        <div className="space-y-4">
          <section className={CHECKOUT_SECTION_CLASS}>
            <StepHeading title="How would you like your order?" />
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {[
                {
                  isPickup: false,
                  label: "Delivery",
                  description: "Delivered to your address",
                  icon: FiTruck,
                },
                {
                  isPickup: true,
                  label: "Pickup",
                  description: "Collect it from the store",
                  icon: FiShoppingBag,
                },
              ].map((option) => {
                const isSelected = pickup === option.isPickup;
                const Icon = option.icon;
                return (
                  <button
                    key={option.label}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setPickup(option.isPickup)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 ${
                      isSelected
                        ? "border-primary-color bg-primary-light/60 dark:bg-gray-900"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-900/60"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isSelected ? "bg-primary-color text-dispatch-ink" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
                    >
                      <Icon aria-hidden className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                        {option.label}
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </span>
                    </span>
                    {isSelected && (
                      <FiCheckCircle
                        aria-hidden
                        className="h-4 w-4 shrink-0 text-primary-dark"
                      />
                    )}
                  </button>
                );
              })}
            </div>
            {!pickup &&
              (address?.deliveryAddress && hasDeliveryCoordinates ? (
                <div className="mt-2.5 flex items-start gap-2.5 rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-900/60">
                  <FiMapPin
                    aria-hidden
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Delivering to{address.label ? ` · ${address.label}` : ""}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {address.deliveryAddress}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  role="alert"
                  className="mt-2.5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
                >
                  <FiAlertCircle
                    aria-hidden
                    className="mt-0.5 h-4 w-4 shrink-0"
                  />
                  <p className="text-sm">
                    <span className="font-semibold">
                      No delivery address selected.
                    </span>{" "}
                    Add and select a delivery address from your profile, or
                    switch to pickup.
                  </p>
                </div>
              ))}
          </section>

          <section className={CHECKOUT_SECTION_CLASS}>
            <StepHeading title="Payment method" />
            <div className="mt-3 space-y-2" role="radiogroup">
              {paymentOptions.map((option) => {
                const isSelected = paymentMethod === option.value;
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-color/60 ${
                      isSelected
                        ? "border-primary-color bg-primary-light/60 dark:bg-gray-900"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-900/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={isSelected}
                      onChange={() => setPaymentMethod(option.value)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${isSelected ? "border-primary-color bg-primary-color" : "border-gray-300 dark:border-gray-600"}`}
                    >
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </span>
                    </span>
                    <Icon
                      aria-hidden
                      className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                    />
                  </label>
                );
              })}
            </div>
          </section>

          <section className={CHECKOUT_SECTION_CLASS}>
            <StepHeading
              title={pickup ? "Pickup time" : "Delivery time"}
              hint="Order now or schedule it for later"
            />
            <div className="relative mt-3">
              <label htmlFor="checkout-schedule" className="sr-only">
                {pickup ? "Pickup time" : "Delivery time"}
              </label>
              <FiClock
                aria-hidden
                className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              />
              <select
                id="checkout-schedule"
                value={schedule ? JSON.stringify(schedule) : ""}
                onChange={(event) =>
                  setSchedule(
                    event.target.value ? JSON.parse(event.target.value) : null,
                  )
                }
                className={`${CHECKOUT_FIELD_CLASS} cursor-pointer appearance-none pe-10 ps-10`}
              >
                <option value="">As soon as possible</option>
                {(scheduleQuery.data?.getScheduleByDay ?? []).flatMap(
                  (day: any) =>
                    (day.timings ?? []).flatMap((timing: any) =>
                      (timing.times ?? []).map((time: any) => {
                        const value = {
                          dayId: day.dayId,
                          scheduleTimeId: time.id,
                        };
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
              <FiChevronDown
                aria-hidden
                className="pointer-events-none absolute end-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              />
            </div>
          </section>

          <CheckoutExtras
            pickup={pickup}
            coupon={coupon}
            onCouponChange={setCoupon}
            onApplyCoupon={() => void checkout.refetch()}
            instructions={instructions}
            onInstructionsChange={setInstructions}
            tip={tip}
            onTipChange={setTip}
            priority={priority}
            onPriorityChange={setPriority}
          />
        </div>

        <CheckoutSummary
          cart={cart}
          summary={summary}
          isQuoteLoading={checkout.loading}
          isPlacing={placeState.loading}
          isLeavingCheckout={isLeavingCheckout}
          isMissingAddress={isMissingAddress}
          pickup={pickup}
          paymentMethod={paymentMethod}
          errorMessage={placeState.error?.message}
          onPlaceOrder={() => void submit()}
        />
      </div>
    </div>
  );
}
