// Core
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

// Interface
import { IStatsCardProps } from '@/lib/utils/interfaces';

// Methods
import { formatNumber, formatNumberWithCurrency } from '@/lib/utils/methods';
import DashboardStatsCardSkeleton from '../custom-skeletons/dasboard.stats.card.skeleton';

export default function StatsCard({
  label,
  total,
  description,
  currencySymbol,
  icon,
  route,
  loading = false,
  amountConfig,
  isClickable = true,
}: IStatsCardProps) {
  const stats_card = () => (
    <div
      className={`card flex flex-col justify-between min-h-28 bg-white border border-gray-200 dark:bg-dark-900 dark:border-dark-600 dark:text-white ${isClickable ? 'cursor-pointer' : 'cursor-default'
        }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-gray-600 dark:text-white">{label}</span>

        {icon && <FontAwesomeIcon icon={icon} />}
      </div>
      <div className="text-2xl font-bold">
        {currencySymbol ? currencySymbol : ''}
        {amountConfig
          ? amountConfig?.format === 'currency'
            ? formatNumberWithCurrency(total, amountConfig.currency)
            : formatNumber(total)
          : total}
      </div>
      {description && (
        <div className="text-sm text-primary-dark dark:text-white"> {description}</div>
      )}
    </div>
  );

  return loading ? (
    <DashboardStatsCardSkeleton />
  ) : isClickable ?
    (
      <Link href={route ?? ''}>{stats_card()}</Link>
    ) : (
      stats_card()
    );
}
