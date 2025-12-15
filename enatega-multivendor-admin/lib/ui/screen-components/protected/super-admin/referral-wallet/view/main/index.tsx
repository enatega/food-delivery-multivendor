'use client';

// Components
import Table from '@/lib/ui/useable-components/table';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Hooks
import { useState } from 'react';
import { useTranslations } from 'next-intl';

// Interfaces
import { IEditState } from '@/lib/utils/interfaces';
import {
  IUserPointsDistribution,
  ILoyaltyLevel,
  IReferralLevel,
} from '@/lib/ui/screens/super-admin/referral-wallet';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPen } from '@fortawesome/free-solid-svg-icons';

// Columns
import { USER_POINTS_COLUMNS } from '@/lib/ui/useable-components/table/columns/user-points-columns';

interface IReferralWalletMainProps {
  handleLoyaltyLevelsClick: () => void;
  handleReferralLevelsClick: () => void;
  isEditingLoyalty: IEditState<ILoyaltyLevel>;
  setIsEditingLoyalty: (editing: IEditState<ILoyaltyLevel>) => void;
  isEditingReferral: IEditState<IReferralLevel>;
  setIsEditingReferral: (editing: IEditState<IReferralLevel>) => void;
  setLoyaltyLevelsVisible: (visible: boolean) => void;
  setReferralLevelsVisible: (visible: boolean) => void;
}

export default function ReferralWalletMain({
  handleLoyaltyLevelsClick,
  handleReferralLevelsClick,
  isEditingLoyalty,
  setIsEditingLoyalty,
  isEditingReferral,
  setIsEditingReferral,
  setLoyaltyLevelsVisible,
  setReferralLevelsVisible,
}: IReferralWalletMainProps) {
  const t = useTranslations();

  // States
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  // Filters
  const filters = {
    global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
  };

  // Mock data for User Points Distribution
  const mockUsers: IUserPointsDistribution[] = [
    {
      _id: '1',
      userName: 'John Doe',
      avatar: 'https://via.placeholder.com/40',
      totalReferrals: 15,
      pointsEarned: 1500,
      pointsRedeemed: 500,
      currentBalance: 1000,
      status: 'Active',
      joinedAt: '2024-01-15',
    },
    {
      _id: '2',
      userName: 'Jane Smith',
      avatar: 'https://via.placeholder.com/40',
      totalReferrals: 23,
      pointsEarned: 2300,
      pointsRedeemed: 800,
      currentBalance: 1500,
      status: 'Active',
      joinedAt: '2024-02-10',
    },
    {
      _id: '3',
      userName: 'Mike Johnson',
      avatar: 'https://via.placeholder.com/40',
      totalReferrals: 8,
      pointsEarned: 800,
      pointsRedeemed: 200,
      currentBalance: 600,
      status: 'Inactive',
      joinedAt: '2024-03-05',
    },
  ];

  // Static Loyalty Levels
  const loyaltyLevels = [
    { name: 'Silver', points: 2000 },
    { name: 'Gold', points: 5000 },
    { name: 'Platinum', points: 5000 },
  ];

  // Static Referral Levels
  const referralLevels = [
    { name: 'Level 1 (Direct)', points: 200 },
    { name: 'Level 2 (Indirect)', points: 150 },
    { name: 'Level 3 (Indirect)', points: 100 },
    { name: 'Max Referrals', points: 50, unit: 'per user' },
  ];

  // Table columns
  const columns = USER_POINTS_COLUMNS({
    menuItems: [],
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left side - Table */}
      <div className="lg:col-span-2">
        <div className="card border dark:border-dark-600 dark:bg-dark-950">
          <h2 className=" text-lg font-semibold dark:text-white">
            {t('User Points Distribution')}
          </h2>
          <p className="text-sm  mb-4 text-gray-500 dark:text-gray-400">
            {t('Configure points for referral tiers.')}
          </p>
          <Table data={mockUsers} columns={columns} filters={filters} />
        </div>
      </div>

      {/* Right side - Cards */}
      <div className="flex flex-col gap-6">
        {/* Referral Levels Card */}
        <div className="card border dark:border-dark-600 dark:bg-dark-950">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold dark:text-white">{t('Referral Levels')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('Configure points for referral tiers.')}
              </p>
            </div>
            <button
              onClick={handleReferralLevelsClick}
              className="text-black dark:text-white hover:text-primary-color dark:hover:text-primary-color"
            >
              <FontAwesomeIcon
                icon={faPen}
                className="h-5 w-5 border dark:border-dark-600 rounded-full px-2 py-2.5 shadow-md"
              />
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {referralLevels.map((level, index) => (
              <div key={index}>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {level.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {level.points} {level.unit || 'pts'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty Levels Card */}
        <div className="card border dark:border-dark-600 dark:bg-dark-950">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold dark:text-white">{t('Loyalty Levels')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('Define points for loyalty levels.')}
              </p>
            </div>
            <button
              onClick={handleLoyaltyLevelsClick}
              className="text-black dark:text-white hover:text-primary-color dark:hover:text-primary-color"
            >
              <FontAwesomeIcon
                icon={faPen}
                className="h-5 w-5 border dark:border-dark-600 rounded-full px-2 py-2.5 shadow-md"
              />
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {loyaltyLevels.map((level, index) => (
              <div key={index}>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {level.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {level.points.toLocaleString()} pts
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
