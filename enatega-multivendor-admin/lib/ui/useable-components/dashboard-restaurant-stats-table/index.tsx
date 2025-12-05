import React from 'react';
import { IDashboardRestaurantStatsTableComponentsProps } from '@/lib/utils/interfaces';
import DashboardStatsTableSkeleton from '../custom-skeletons/dashboard.stats.table.skeleton';
import {
  formatNumber,
  formatNumberWithCurrency,
} from '@/lib/utils/methods/currency';
import { DASHBOARD_PAYMENT_METHOD_SUB_TITLE } from '@/lib/utils/constants';
import { useTranslations } from 'next-intl';

export default function DashboardRestaurantStatsTable({
  loading,
  title,
  data,
  amountConfig,
}: IDashboardRestaurantStatsTableComponentsProps) {
  // Hooks
  const t = useTranslations();

  if (loading) return <DashboardStatsTableSkeleton />;

  const {
    total_orders,
    total_sales,
    total_sales_without_delivery,
    total_delivery_fee,
  } = data;

  return (
    <div className="w-full h-auto mx-auto">
      <div className="bg-white dark:bg-dark-950 h-full shadow-md rounded-lg border border-gray-300">
        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-t-lg">
          <h2 className="text-lg font-bold text-gray-800">
            {t(
              DASHBOARD_PAYMENT_METHOD_SUB_TITLE[
                title as keyof typeof DASHBOARD_PAYMENT_METHOD_SUB_TITLE
              ].toString()
            )}
          </h2>
          <i className="fas fa-arrow-down text-primary-dark"></i>
        </div>
        <div className="p-4 max-h-50 overflow-auto ">
          <div className={`flex justify-between py-2`}>
            <span className="text-gray-800">{t('Total Orders')}</span>
            <span className="text-gray-800">
              {amountConfig ? formatNumber(total_orders) : total_orders}
            </span>
          </div>

          <div className={`flex justify-between py-2`}>
            <span className="text-gray-800">{t('Total Sales')}</span>
            <span className="text-gray-800">
              {amountConfig
                ? formatNumberWithCurrency(total_sales, amountConfig.currency)
                : total_sales}
            </span>
          </div>

          <div className={`flex justify-between py-2`}>
            <span className="text-gray-800">
              {t('Total Sales Without Delivery')}
            </span>
            <span className="text-gray-800">
              {amountConfig
                ? formatNumberWithCurrency(
                    total_sales_without_delivery,
                    amountConfig.currency
                  )
                : total_sales_without_delivery}
            </span>
          </div>

          <div className={`flex justify-between py-2`}>
            <span className="text-gray-800">{t('Total Delivery Fee')}</span>
            <span className="text-gray-800">
              {amountConfig
                ? formatNumberWithCurrency(
                    total_delivery_fee,
                    amountConfig.currency
                  )
                : total_delivery_fee}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
