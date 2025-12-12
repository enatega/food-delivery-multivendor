'use client';

// Components
import StatsCard from '@/lib/ui/useable-components/stats-card';

// Icons
import {
  faCoins,
  faUsers,
  faWallet,
  faChartLine,
  faArrowUp,
  faArrowDown,
  faArrowTrendDown,
  faArrowTrendUp,
} from '@fortawesome/free-solid-svg-icons';

// Hooks
import { useTranslations } from 'next-intl';

interface IReferralWalletHeaderProps {
  handleAdjustPointsClick: () => void;
}

export default function ReferralWalletHeader({
  handleAdjustPointsClick,
}: IReferralWalletHeaderProps) {
  const t = useTranslations();

  // Mock stats data - Replace with actual GraphQL query
  const statsData = {
    pointsDistributed: {
      value: 43300,
      change: 2,
      isIncrease: true,
    },
    vendorsSharing: {
      value: 25500,
      change: 5.2,
      isIncrease: true,
    },
    pointsHeld: {
      value: 20000,
      change: 1.8,
      isIncrease: false,
    },
    totalVendors: {
      value: 1850,
      change: 3.5,
      isIncrease: true,
    },
  };

  return (
    <div className="mb-6 flex flex-col gap-5">
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold">
          {t('Referral Points Management')}
        </h1>
        <button
          onClick={handleAdjustPointsClick}
          className="h-10 rounded-md bg-black px-6 text-white hover:bg-gray-800"
        >
          {t('Adjust Points')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label={t('Points Distributed')}
          total={statsData.pointsDistributed.value.toLocaleString() + ' pts'}
          description={`${statsData.pointsDistributed.change}% ${statsData.pointsDistributed.isIncrease ? t('up') : t('down')} ${t('from last week')}`}
          descriptionIcon={
            statsData.pointsDistributed.isIncrease
              ? faArrowTrendUp
              : faArrowTrendDown
          }
          icon={faCoins}
          isClickable={false}
        />
        <StatsCard
          label={t('Vendors Sharing Earnings')}
          total={statsData.vendorsSharing.value.toLocaleString() + ' pts'}
          description={`${statsData.vendorsSharing.change}% ${statsData.vendorsSharing.isIncrease ? t('up') : t('down')} ${t('from last week')}`}
          descriptionIcon={
            statsData.vendorsSharing.isIncrease
              ? faArrowTrendUp
              : faArrowTrendDown
          }
          icon={faChartLine}
          isClickable={false}
        />
        <StatsCard
          label={t('Points Held')}
          total={statsData.pointsHeld.value.toLocaleString() + ' pts'}
          description={`${statsData.pointsHeld.change}% ${statsData.pointsHeld.isIncrease ? t('up') : t('down')} ${t('from last week')}`}
          descriptionIcon={
            statsData.pointsHeld.isIncrease ? faArrowTrendUp : faArrowTrendDown
          }
          icon={faWallet}
          isClickable={false}
        />
        <StatsCard
          label={t('Total vendors')}
          total={statsData.totalVendors.value.toLocaleString() + ' users'}
          description={`${statsData.totalVendors.change}% ${statsData.totalVendors.isIncrease ? t('up') : t('down')} ${t('from last week')}`}
          descriptionIcon={
            statsData.totalVendors.isIncrease
              ? faArrowTrendUp
              : faArrowTrendDown
          }
          icon={faUsers}
          isClickable={false}
        />
      </div>
    </div>
  );
}
