import React from 'react';
import { IDashboardStatsTableComponentsProps } from '@/lib/utils/interfaces';
import DashboardStatsTableSkeleton from '../custom-skeletons/dashboard.stats.table.skeleton';
import {
  formatNumber,
  formatNumberWithCurrency,
} from '@/lib/utils/methods/currency';
import { useTranslations } from 'next-intl';

export default function DashboardStatsTable({
  loading,
  title,
  data,
  amountConfig,
}: IDashboardStatsTableComponentsProps) {
  const t = useTranslations();

  if (loading) return <DashboardStatsTableSkeleton />;

  return (
    <div className="w-full mx-auto">
      <div className="bg-white dark:bg-dark-900 dark:text-white shadow-md rounded-lg border border-gray-300 dark:border-dark-600">
        <div className="flex justify-between items-center bg-gray-100 dark:bg-dark-900 p-4 rounded-t-lg">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {t(title)}
          </h2>
          <i className="fas fa-arrow-down text-primary-dark"></i>
        </div>
        <div className="p-4 max-h-40 overflow-y-auto ">
          {data.map((item, index: number) => (
            <div
              key={index}
              className={`flex justify-between py-2 ${index !== data.length - 1 ? 'border-b border-gray-300 dark:border-dark-600' : ''}`}
            >
              <span className="text-gray-800 dark:text-white">
                {t(item.label)}
              </span>
              <span className="text-gray-800 dark:text-white">
                {amountConfig
                  ? amountConfig?.format === 'currency'
                    ? formatNumberWithCurrency(
                        item.value,
                        amountConfig.currency
                      )
                    : formatNumber(item.value)
                  : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
