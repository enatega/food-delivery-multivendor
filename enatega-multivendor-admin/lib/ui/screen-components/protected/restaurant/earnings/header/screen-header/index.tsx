// GraphQL
import { GET_EARNING } from '@/lib/api/graphql/queries/earnings';

// Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import StatsCard from '@/lib/ui/useable-components/stats-card';

// Icons
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

// Contexts
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

// Hooks
import { useQuery } from '@apollo/client';
import { useContext } from 'react';
import { useTranslations } from 'next-intl';
import { IEarningsRestaurantHeaderComponentProps, UserTypeEnum } from '@/lib/utils/interfaces/earnings.interface';
import { onUseLocalStorage } from '@/lib/utils/methods';

const EarningsRestaurantHeader = ({ earnings }: IEarningsRestaurantHeaderComponentProps) => {
  // Hooks
  const t = useTranslations();

  // Contexts
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);



  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text={t('Earnings')} />
      </div>
      <div className="grid grid-cols-1 items-center gap-6 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <StatsCard
          label={t('Total Stores Earning')}
          total={earnings?.storeTotal || 0}
          icon={faDollarSign}
          loading={false}
        />
      </div>
    </div>
  );
};

export default EarningsRestaurantHeader;
