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
      <div className="bg-white shadow-md rounded-lg border border-gray-300">
        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-t-lg">
          <h2 className="text-lg font-bold text-gray-800">{t(title)}</h2>
          <i className="fas fa-arrow-down text-green-500"></i>
        </div>
        <div className="p-4 max-h-40 overflow-y-auto ">
          {data.map((item, index: number) => (
            <div
              key={index}
              className={`flex justify-between py-2 ${index !== data.length - 1 ? 'border-b border-gray-300' : ''}`}
            >
              <span className="text-gray-800">{t(item.label)}</span>
              <span className="text-gray-800">
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
