// Interfaces
import { IActionMenuProps } from '@/lib/utils/interfaces';
import { IUserPointsDistribution } from '@/lib/ui/screens/super-admin/referral-wallet';

// Hooks
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

export const USER_POINTS_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IUserPointsDistribution>['items'];
}) => {
  // Hooks
  const t = useTranslations();

  // Columns
  const user_points_columns = useMemo(
    () => [
      {
        headerName: t('User Name'),
        propertyName: 'userName',
        body: (rowData: IUserPointsDistribution) => (
          <div className="flex items-center gap-3">
            {rowData.avatar && (
              <img
                src={rowData.avatar}
                alt={rowData.userName}
                className="h-10 w-10 rounded-full object-cover"
              />
            )}
            <span className="font-medium">{rowData.userName}</span>
          </div>
        ),
      },
      {
        headerName: t('Total Referrals'),
        propertyName: 'totalReferrals',
      },
      {
        headerName: t('Points Earned'),
        propertyName: 'pointsEarned',
        body: (rowData: IUserPointsDistribution) => (
          <span>{rowData.pointsEarned.toLocaleString()} pts</span>
        ),
      },
      {
        headerName: t('Points Redeemed'),
        propertyName: 'pointsRedeemed',
        body: (rowData: IUserPointsDistribution) => (
          <span>{rowData.pointsRedeemed.toLocaleString()} pts</span>
        ),
      },
      {
        headerName: t('Current Balance'),
        propertyName: 'currentBalance',
        body: (rowData: IUserPointsDistribution) => (
          <span className="font-semibold">
            {rowData.currentBalance.toLocaleString()} pts
          </span>
        ),
      },
      {
        headerName: t('Status'),
        propertyName: 'status',
        body: (rowData: IUserPointsDistribution) => {
          const isActive = rowData.status === 'Active';
          const bgColor = isActive ? 'bg-green-100' : 'bg-gray-100';
          const textColor = isActive ? 'text-green-800' : 'text-gray-800';
          return (
            <span className={'rounded-full px-3 py-1 text-xs font-medium ' + bgColor + ' ' + textColor}>
              {rowData.status}
            </span>
          );
        },
      },
      {
        headerName: t('Joined At'),
        propertyName: 'joinedAt',
        body: (rowData: IUserPointsDistribution) =>
          new Date(rowData.joinedAt).toLocaleDateString(),
      },
    ],
    [menuItems, t]
  );
  return user_points_columns;
};
