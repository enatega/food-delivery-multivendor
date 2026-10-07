"use client";
import { FiTag, FiZap } from "react-icons/fi";
import useCurrencyFormatter from "@/lib/hooks/useCurrencyFormatter";
import {
  CHECKOUT_FIELD_CLASS,
  CHECKOUT_FIELD_LABEL_CLASS,
  CHECKOUT_SECTION_CLASS,
  StepHeading,
} from "./CheckoutSection";

const TIP_PRESETS = [0, 2, 5, 10];

interface CheckoutExtrasProps {
  pickup: boolean;
  coupon: string;
  onCouponChange: (value: string) => void;
  onApplyCoupon: () => void;
  instructions: string;
  onInstructionsChange: (value: string) => void;
  tip: number;
  onTipChange: (value: number) => void;
  priority: boolean;
  onPriorityChange: (value: boolean) => void;
}

export default function CheckoutExtras({
  pickup,
  coupon,
  onCouponChange,
  onApplyCoupon,
  instructions,
  onInstructionsChange,
  tip,
  onTipChange,
  priority,
  onPriorityChange,
}: CheckoutExtrasProps) {
  const { currencySymbol, currency, formatCurrency } = useCurrencyFormatter();
  return (
    <section className={CHECKOUT_SECTION_CLASS}>
      <StepHeading title="Extras" hint="All optional" />
      <div className="mt-3 space-y-4">
        <div>
          <label
            htmlFor="checkout-voucher"
            className={CHECKOUT_FIELD_LABEL_CLASS}
          >
            Voucher code
          </label>
          <div className="mt-1.5 flex gap-2">
            <div className="relative min-w-0 flex-1">
              <FiTag
                aria-hidden
                className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              />
              <input
                id="checkout-voucher"
                value={coupon}
                onChange={(event) => onCouponChange(event.target.value)}
                onBlur={onApplyCoupon}
                placeholder="Enter code"
                className={`${CHECKOUT_FIELD_CLASS} ps-10 uppercase placeholder:normal-case`}
              />
            </div>
            <button
              type="button"
              disabled={!coupon.trim()}
              onClick={onApplyCoupon}
              className="shrink-0 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-900 transition-colors hover:border-primary-color hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-transparent dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
            >
              Apply
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="checkout-instructions"
            className={CHECKOUT_FIELD_LABEL_CLASS}
          >
            Order instructions
          </label>
          <textarea
            id="checkout-instructions"
            rows={2}
            value={instructions}
            onChange={(event) => onInstructionsChange(event.target.value)}
            placeholder={
              pickup
                ? "Anything the store should know?"
                : "E.g. ring the bell, leave at the door"
            }
            className={`${CHECKOUT_FIELD_CLASS} mt-1.5 resize-none`}
          />
        </div>

        {!pickup && (
          <>
            <div>
              <span className={CHECKOUT_FIELD_LABEL_CLASS}>Tip your rider</span>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {TIP_PRESETS.map((amount) => {
                  const isSelected = tip === amount;
                  return (
                    <button
                      key={amount}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => onTipChange(amount)}
                      className={`h-9 min-w-[64px] rounded-lg border px-3 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 ${
                        isSelected
                          ? "border-primary-color bg-primary-light/60 text-primary-dark dark:bg-gray-900"
                          : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900/60"
                      }`}
                    >
                      {amount === 0 ? "None" : formatCurrency(amount)}
                    </button>
                  );
                })}
                <div className="relative">
                  <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {currencySymbol || currency}
                  </span>
                  <input
                    type="number"
                    min="0"
                    inputMode="decimal"
                    aria-label="Custom tip amount"
                    placeholder="Other"
                    value={TIP_PRESETS.includes(tip) ? "" : tip}
                    onChange={(event) =>
                      onTipChange(Math.max(0, Number(event.target.value)))
                    }
                    className={`${CHECKOUT_FIELD_CLASS} h-9 w-24 py-0 ps-7`}
                  />
                </div>
              </div>
            </div>

            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-2.5 transition-colors hover:bg-gray-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-color/60 dark:border-gray-700 dark:hover:bg-gray-900/60">
              <span className="flex items-center gap-3">
                <FiZap
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-primary-dark"
                />
                <span>
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">
                    Priority delivery
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Get your order sent out first
                  </span>
                </span>
              </span>
              <input
                type="checkbox"
                checked={priority}
                onChange={(event) => onPriorityChange(event.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className="relative h-6 w-11 shrink-0 rounded-full bg-gray-200 transition-colors after:absolute after:start-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-primary-color peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5 dark:bg-gray-700"
              />
            </label>
          </>
        )}
      </div>
    </section>
  );
}
