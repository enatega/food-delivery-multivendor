// GraphQL API imports
import { GET_RESTAURANTS, updateCommission } from '@/lib/api/graphql';

// Context imports
import { ToastContext } from '@/lib/context/global/toast.context';

// Custom hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
// UI components
import Table from '@/lib/ui/useable-components/table';

// Utility functions
import { generateDummyCommissionRates } from '@/lib/utils/dummy';

// Type definitions
import { IQueryResult, IRestaurantResponse } from '@/lib/utils/interfaces';

// Apollo Client hooks
import { useMutation } from '@apollo/client';

// React hooks
import { useContext, useEffect, useState } from 'react';

// Table column definitions
import { COMMISSION_RATE_ACTIONS } from '@/lib/utils/constants';

import CommissionRateHeader from '../header/table-header';
import { useTranslations } from 'next-intl';
import { COMMISSION_RATE_COLUMNS } from '@/lib/ui/useable-components/table/columns/comission-rate-columns';

interface RestaurantsData {
  restaurants: IRestaurantResponse[];
}

export default function CommissionRateMain() {
  //Hooks
  const t = useTranslations();

  // States
  const [restaurants, setRestaurants] = useState<IRestaurantResponse[]>([]);
  const [editingRestaurantIds, setEditingRestaurantIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedRestaurants, setSelectedRestaurants] = useState<
    IRestaurantResponse[]
  >([]);
  const [loadingRestaurant, setLoadingRestaurant] = useState<string | null>(
    null
  );
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Context
  const { showToast } = useContext(ToastContext);

  // Query
  const { data, error, refetch, loading } = useQueryGQL(GET_RESTAURANTS, {
    fetchPolicy: 'network-only',
  }) as IQueryResult<RestaurantsData | undefined, undefined>;

  // Mutation
  const [updateCommissionMutation] = useMutation(updateCommission);

  // Handlers
  const handleSave = async (restaurantId: string) => {
    const restaurant = restaurants.find((r) => r._id === restaurantId);
    if (restaurant) {
      setLoadingRestaurant(restaurantId);
      if(restaurant?.commissionRate>100){
        setLoadingRestaurant(null);
        return showToast({
          type:"error",
          title:t('Commission Updated'),
          message:t('As commission rate is a %age value so it cannot exceed a max value of 100')
        })
      }
      try {
        await updateCommissionMutation({
          variables: {
            id: restaurantId,
            commissionRate: parseFloat(String(restaurant?.commissionRate)),
          },
        });
        showToast({
          type: 'success',
          title: t('Commission Updated'),
          message: `${t('Commission rate updated for')} ${restaurant.name}`,
          duration: 2000,
        });
        setEditingRestaurantIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(restaurantId);
          return newSet;
        });
        refetch();
      } catch (error) {
        showToast({
          type: 'error',
          title: t('Error'),
          message: `${t('Error updating commission rate for')} ${restaurant.name}`,
          duration: 2000,
        });
      } finally {
        setLoadingRestaurant(null);
      }
    }
  };

  const handleCommissionRateChange = (restaurantId: string, value: number) => {
    setRestaurants((prevRestaurants) =>
      prevRestaurants.map((restaurant) =>
        restaurant._id === restaurantId
          ? { ...restaurant, commissionRate: value }
          : restaurant
      )
    );
    setEditingRestaurantIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(restaurantId);
      return newSet;
    });
  };

  const getFilteredRestaurants = () => {
    return restaurants.filter((restaurant) => {
      const nameMatches = restaurant.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Always show restaurants that are currently being edited
      if (editingRestaurantIds.has(restaurant._id)) {
        return true;
      }

      // Apply name filter
      if (!nameMatches) {
        return false;
      }

      // If no commission rate filters are applied, show all name matches
      if (selectedActions.length === 0) {
        return true;
      }

      // Apply commission rate filters
      return selectedActions.some((action) => {
        switch (action) {
          case COMMISSION_RATE_ACTIONS.MORE_THAN_5:
            return restaurant.commissionRate > 5;
          case COMMISSION_RATE_ACTIONS.MORE_THAN_10:
            return restaurant.commissionRate > 10;
          case COMMISSION_RATE_ACTIONS.MORE_THAN_20:
            return restaurant.commissionRate > 20;
          default:
            return false;
        }
      });
    });
  };

  // Use Effects
  useEffect(() => {
    if (data?.restaurants) {
      let updatedRestaurants = data.restaurants.map((v) => {
        let obj = { ...v };
        console.log(v.commissionRate);
        // if (v.commissionRate === null) obj['commissionRate'] = 25;

        return obj;
      });
      setRestaurants(updatedRestaurants);
    } else if (error) {
      showToast({
        type: 'error',
        title: t('Error Fetching Restaurants'),
        message: t(
          'An error occurred while fetching restaurants. Please try again later.'
        ),
        duration: 2000,
      });
    }
  }, [data, error]);

  return (
    <div className="p-3">
      <Table
        data={
          loading ? generateDummyCommissionRates() : getFilteredRestaurants()
        }
        setSelectedData={setSelectedRestaurants}
        selectedData={selectedRestaurants}
        columns={COMMISSION_RATE_COLUMNS({
          handleSave,
          handleCommissionRateChange,
          loadingRestaurant,
        })}
        loading={loading}
        header={
          <CommissionRateHeader
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
            onSearch={setSearchTerm}
          />
        }
      />
    </div>
  );
}
