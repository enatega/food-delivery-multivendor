// Core
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Interface
import { IStatsCardProps } from '@/lib/utils/interfaces';

// Methods
import { formatNumber, formatNumberWithCurrency } from '@/lib/utils/methods';
import DashboardStatsCardSkeleton from '../custom-skeletons/dasboard.stats.card.skeleton';
import { TrendingUpSVG } from '@/lib/utils/assets/svgs/trending-up';
import { TrendingDownSVG } from '@/lib/utils/assets/svgs/trending-down';

export default function StatsCard({
  label,
  total,
  description,
  currencySymbol,
  route,
  loading = false,
  amountConfig,
  isClickable = true,
  icon,
  SvgIcon,
  positiveTrending,
  trendChange,
}: IStatsCardProps) {
  const stats_card = () => (
    <div
      className={`card flex flex-col justify-between min-h-28 bg-white border border-gray-200 dark:bg-dark-900 dark:border-dark-600 dark:text-white ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-gray-600 dark:text-white">{label}</span>

        {icon ? <FontAwesomeIcon icon={icon} /> : SvgIcon && <SvgIcon />}
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
        <div className="flex text-sm gap-x-2">
          {positiveTrending !== undefined && <span>
            {positiveTrending ? <TrendingUpSVG /> : <TrendingDownSVG />}
          </span>}
          {positiveTrending !== undefined && <span className={`${positiveTrending ? "text-[#00B69B]" :"text-[#F93C65]"}`}>{trendChange}</span>}
          <span className='text-[#606060]'>{description}</span>
        </div>
      )}
    </div>
  );

  return loading ? (
    <DashboardStatsCardSkeleton />
  ) : isClickable ? (
    <Link href={route ?? ''}>{stats_card()}</Link>
  ) : (
    stats_card()
  );
}
