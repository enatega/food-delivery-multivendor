"use client";
import { useMutation, useQuery } from "@apollo/client";
import {
  SINGLE_VENDOR_CANCEL_MEMBERSHIP,
  SINGLE_VENDOR_CREATE_MEMBERSHIP,
  SINGLE_VENDOR_CREDITS,
  SINGLE_VENDOR_FAVORITES,
  SINGLE_VENDOR_MEMBERSHIP_PLANS,
  SINGLE_VENDOR_REFERRAL,
  SINGLE_VENDOR_UPDATE_MEMBERSHIP,
  SINGLE_VENDOR_VOUCHERS,
} from "@/lib/api/graphql/single-vendor";
import SingleVendorProductSection from "./ProductSection";
import { normalizeProducts } from "./Discovery";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo, useState } from "react";
import useUser from "@/lib/hooks/useUser";
import useCurrencyFormatter from "@/lib/hooks/useCurrencyFormatter";

const Shell = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="py-6">
    <h1 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">
      {title}
    </h1>
    {children}
  </div>
);
export function FavoriteProducts() {
  const { data, loading } = useQuery(SINGLE_VENDOR_FAVORITES, {
    variables: { limit: 50, skip: 0 },
  });
  return (
    <Shell title="Favorite products">
      {loading ? (
        <p>Loading…</p>
      ) : (
        <SingleVendorProductSection
          title=""
          products={normalizeProducts(data?.getFavoriteFoodsSingleVendor?.data)}
        />
      )}
    </Shell>
  );
}
export function Vouchers() {
  const { data, loading } = useQuery(SINGLE_VENDOR_VOUCHERS);
  return (
    <Shell title="Vouchers">
      <div className="grid gap-3 sm:grid-cols-2">
        {loading ? (
          <p>Loading…</p>
        ) : (
          (data?.couponsbyRestaurant ?? []).map((item: any) => (
            <div
              key={item._id}
              className="rounded-2xl border border-dashed border-primary-color bg-primary-light p-5 dark:bg-gray-800"
            >
              <p className="font-bold text-primary-color">{item.title}</p>
              <p className="mt-2 dark:text-gray-200">
                {item.discount}% discount
              </p>
            </div>
          ))
        )}
      </div>
    </Shell>
  );
}
export function Wallet() {
  const { data, loading } = useQuery(SINGLE_VENDOR_CREDITS);
  const { formatCurrency } = useCurrencyFormatter();
  return (
    <Shell title="Wallet">
      <div className="rounded-3xl bg-primary-color p-8 text-white">
        <p>Available credits</p>
        <p className="mt-2 text-4xl font-bold">
          {loading
            ? "—"
            : formatCurrency(data?.getAllUserCredits?.credits ?? 0)}
        </p>
      </div>
    </Shell>
  );
}
function MembershipForm({ plans }: { plans: any[] }) {
  const stripe = useStripe();
  const elements = useElements();
  const { profile } = useUser();
  const { formatCurrency } = useCurrencyFormatter();
  const [selected, setSelected] = useState(plans[0]?.id || "");
  const [message, setMessage] = useState("");
  const [create, createState] = useMutation(SINGLE_VENDOR_CREATE_MEMBERSHIP);
  const [update, updateState] = useMutation(SINGLE_VENDOR_UPDATE_MEMBERSHIP);
  const [cancel, cancelState] = useMutation(SINGLE_VENDOR_CANCEL_MEMBERSHIP);
  const submit = async () => {
    if (profile?.stripe_plan_id) {
      const result = await update({
        variables: { input: { newStripePriceId: selected } },
      });
      setMessage(
        result.data?.updateSubscription?.message || "Membership updated.",
      );
      return;
    }
    const card = elements?.getElement(CardElement);
    if (!stripe || !card) return;
    const payment = await stripe.createPaymentMethod({ type: "card", card });
    if (payment.error) {
      setMessage(payment.error.message || "Card could not be verified.");
      return;
    }
    const result = await create({
      variables: {
        input: {
          stripePriceId: selected,
          paymentMethodId: payment.paymentMethod.id,
        },
      },
    });
    setMessage(
      result.data?.createSubscription?.message || "Membership activated.",
    );
  };
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan: any) => (
          <button
            type="button"
            onClick={() => setSelected(plan.id)}
            key={plan.id}
            className={`rounded-2xl border p-5 text-left dark:bg-gray-800 ${selected === plan.id ? "border-primary-color ring-2 ring-primary-color/20" : "border-gray-200 dark:border-gray-700"}`}
          >
            <h2 className="font-bold dark:text-white">{plan.productName}</h2>
            <p className="my-3 text-2xl font-bold text-primary-color">
              {formatCurrency(plan.amount)}
            </p>
            <p className="text-sm text-gray-500">
              Every {plan.intervalCount} {plan.interval}
            </p>
          </button>
        ))}
      </div>
      {!profile?.stripe_plan_id && (
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      )}
      <div className="mt-5 flex gap-3">
        <button
          disabled={!selected || createState.loading || updateState.loading}
          onClick={() => void submit()}
          className="rounded-full bg-primary-color px-6 py-3 font-semibold text-white disabled:opacity-50"
        >
          {profile?.stripe_plan_id ? "Update membership" : "Start membership"}
        </button>
        {profile?.stripe_plan_id && (
          <button
            disabled={cancelState.loading}
            onClick={async () => {
              const result = await cancel();
              setMessage(
                result.data?.cancelSubscription?.message ||
                  "Membership cancelled.",
              );
            }}
            className="rounded-full border border-red-300 px-6 py-3 text-red-600"
          >
            Cancel
          </button>
        )}
      </div>
      {message && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          {message}
        </p>
      )}
    </>
  );
}
export function Membership() {
  const { STRIPE_PUBLIC_KEY } = useConfig();
  const stripePromise = useMemo(
    () => (STRIPE_PUBLIC_KEY ? loadStripe(STRIPE_PUBLIC_KEY) : null),
    [STRIPE_PUBLIC_KEY],
  );
  const { data, loading } = useQuery(SINGLE_VENDOR_MEMBERSHIP_PLANS);
  const plans = data?.getAllSubscriptionPlans?.plans ?? [];
  return (
    <Shell title="Membership">
      {loading ? (
        <p>Loading…</p>
      ) : !stripePromise ? (
        <p>Membership payments are temporarily unavailable.</p>
      ) : (
        <Elements stripe={stripePromise}>
          <MembershipForm plans={plans} />
        </Elements>
      )}
    </Shell>
  );
}
export function Referral() {
  const { data, loading } = useQuery(SINGLE_VENDOR_REFERRAL);
  const code = data?.getMyReferralCode ?? "";
  return (
    <Shell title="Refer a friend">
      <div className="max-w-xl rounded-3xl bg-primary-light p-8 text-center dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-300">
          Share your referral code with friends.
        </p>
        <p className="my-5 text-3xl font-bold tracking-widest text-primary-color">
          {loading ? "…" : code}
        </p>
        <button
          onClick={() => void navigator.clipboard.writeText(code)}
          className="rounded-full bg-primary-color px-6 py-3 font-semibold text-white"
        >
          Copy code
        </button>
      </div>
    </Shell>
  );
}
