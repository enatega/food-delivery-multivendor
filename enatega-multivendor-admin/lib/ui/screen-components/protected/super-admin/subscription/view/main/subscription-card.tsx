import React from 'react';
import { Menu } from 'primereact/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import { ISubscriptionPlan } from '@/lib/ui/screens/super-admin/subscription';

export const SubscriptionCard = ({
  plan,
  onDeactivate,
  baseMonthlyPrice,
}: {
  plan: ISubscriptionPlan;
  onDeactivate: (id: string) => void;
  baseMonthlyPrice?: number | null;
}) => {
  const t = useTranslations();
  const menu = React.useRef<Menu>(null);

  const formatPlanName = (interval: string, count: number) => {
    if (interval === 'month') {
      if (count === 1) return t('Monthly Plan');
      if (count === 3) return t('3 Months Plan');
      if (count === 6) return t('6 Months Plan');
      if (count === 12) return t('Yearly Plan');
      return `${count} ${t('Months Plan')}`;
    }
    if (interval === 'year') {
      if (count === 1) return t('Yearly Plan');
      return `${count} ${t('Years Plan')}`;
    }
    return `${count} ${interval} ${t('Plan')}`;
  };

  const formattedInterval = formatPlanName(plan.interval, plan.intervalCount);

  // Helper for price display (e.g. / Monthly, / Yearly)
  const formatPriceSuffix = (interval: string, count: number) => {
    if (interval === 'month') {
      if (count === 1) return t('Monthly');
      if (count === 12) return t('Yearly');
    }
    return `${count} ${interval}s`;
  };
  const formattedSuffix = formatPriceSuffix(plan.interval, plan.intervalCount);

  // Calculate savings
  let savingsPercent = 0;
  if (
    baseMonthlyPrice &&
    baseMonthlyPrice > 0 &&
    plan.interval === 'month' &&
    plan.intervalCount > 1
  ) {
    const totalIfMonthly = baseMonthlyPrice * plan.intervalCount;
    // For savings, we compare total cost of standard monthly plans over same period vs this plan's price
    // e.g. Monthly $10, Yearly $100.
    // 12 months * $10 = $120. Savings = $120 - $100 = $20. ((120-100)/120)*100 = 16.6%
    const savings = totalIfMonthly - plan.amount;
    if (savings > 0) {
      savingsPercent = Math.round((savings / totalIfMonthly) * 100);
    }
  }

  const getMenuItems = () => [
    {
      label: t('Deactivate'),
      command: () => onDeactivate(plan.id),
    },
  ];

  return (
    <div className="relative rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md h-full flex flex-col">
      {/* Menu */}
      <div className="absolute right-4 top-4">
        <Menu model={getMenuItems()} popup ref={menu} />
        <button
          onClick={(e) => menu.current?.toggle(e)}
          className="rounded p-2 hover:bg-gray-100"
        >
          <FontAwesomeIcon
            icon={faEllipsisV}
            className="h-4 w-4 text-gray-600"
          />
        </button>
      </div>

      {/* Plan Header */}
      <div className="mb-4 rounded-t-lg bg-gray-100 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-semibold text-gray-900 capitalize">
            {formattedInterval}
          </h3>
          {savingsPercent > 0 && (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
              {t('Save')} {savingsPercent}%
            </span>
          )}
        </div>
      </div>

      {/* Pricing */}
      <div className="mb-4 p-4 pt-0">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">
            €{plan.amount.toFixed(2)}
          </span>
          <span className="ml-2 text-gray-600 capitalize">
            / {formattedSuffix}
          </span>
        </div>
      </div>

      {/* Reward/Info */}
      {plan.productName && (
        <div className="space-y-3 p-4 mt-auto">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faTrophy}
              className="h-4 w-4 text-gray-700"
            />
            <span className="text-sm text-gray-700">
              {t('Unlimited €1 Deliveries')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
