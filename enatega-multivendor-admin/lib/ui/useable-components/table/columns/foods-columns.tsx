// import ActionMenu from '../../action-menu';
import Image from 'next/image';

// Interface
import { IActionMenuProps, IFoodNew } from '@/lib/utils/interfaces';

import ActionMenu from '../../action-menu';
import { ApolloError, useMutation } from '@apollo/client';
import {
  GET_FOODS_BY_RESTAURANT_ID,
  UPDATE_FOOD_OUT_OF_STOCK,
  GET_ALL_FOODS_PAGINATED,
} from '@/lib/api/graphql';
import { useContext, useState } from 'react';
import { ToastContext } from '@/lib/context/global/toast.context';
import CustomInputSwitch from '../../custom-input-switch';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useTranslations } from 'next-intl';

export const FOODS_TABLE_COLUMNS = ({
  menuItems,
  currentPage = 1,
  pageSize = 10,
}: {
  menuItems: IActionMenuProps<IFoodNew>['items'];
  currentPage?: number;
  pageSize?: number;
}) => {
  // Hooks
  const t = useTranslations();

  // Context
  const { showToast } = useContext(ToastContext);
  const {
    restaurantLayoutContextData: { restaurantId },
  } = useContext(RestaurantLayoutContext);

  // State
  const [isFoodLoading, setIsFoodLoading] = useState<string>('');
  const restaurantIdStored = localStorage.getItem('restaurantId');
  // API
  const [updateFoodOutOfStock] = useMutation(UPDATE_FOOD_OUT_OF_STOCK, {
    refetchQueries: [
      {
        query: GET_ALL_FOODS_PAGINATED,
        variables: {
          restaurantId: restaurantIdStored,
          page: currentPage,
          limit: pageSize,
        },
      },
    ],
    onCompleted: () => {
      showToast({
        type: 'success',
        title: t('Food Stock'),
        message: t(`Food stock status has been changed`),
      });
      setIsFoodLoading('');
    },
    onError: ({ networkError, graphQLErrors }: ApolloError) => {
      showToast({
        type: 'error',
        title: t('Food Stock'),
        message:
          networkError?.message ??
          graphQLErrors[0]?.message ??
          t('Food Stock status failed'),
      });
      setIsFoodLoading('');
    },
  });

  // Handlers
  const onUpdateFoodOutOfStock = async (foodId: string, categoryId: string) => {
    try {
      setIsFoodLoading(foodId);

      await updateFoodOutOfStock({
        variables: {
          id: foodId,
          categoryId,
          restaurant: restaurantId,
        },
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: t('Food Stock'),
        message: t('Food Stock status failed'),
      });
      setIsFoodLoading('');
    }
  };

  return [
    { headerName: t('Title'), propertyName: 'title' },
    { headerName: t('Description'), propertyName: 'description' },
    {
      headerName: t('Category'),
      propertyName: 'category.label',
      body: (item: IFoodNew) => <div>{item?.category?.label ?? ''}</div>,
    },
    {
      headerName: t('Deal'),
      propertyName: 'deal',
      body: (item: IFoodNew) => {
        // Get all variations with deals
        const variationsWithDeals =
          item?.variations?.filter((v) => v.deal) || [];

        if (variationsWithDeals.length === 0) {
          return (
            <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
          );
        }

        // Helper to get deal info (handles both IFoodDealType and IDealFormValues)
        const getDealInfo = (deal: any) => {
          const name = deal.name || deal.dealName || '';
          const type = deal.type || deal.discountType || 'PERCENTAGE';
          const value = deal.value || deal.discountValue || 0;
          const symbol = type === 'PERCENTAGE' ? '%' : '€';
          return { name, type, value, symbol };
        };

        // If only one variation has a deal, show it directly
        if (variationsWithDeals.length === 1) {
          const variation = variationsWithDeals[0];
          const { name, value, symbol } = getDealInfo(variation.deal);
          return (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md inline-block w-fit">
                {name}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {variation.title}: {value}
                {symbol} Off
              </span>
            </div>
          );
        }

        // If multiple variations have deals, show them in a compact list
        return (
          <div className="flex flex-col gap-1 max-w-[200px]">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {variationsWithDeals.length}{' '}
              {variationsWithDeals.length === 1 ? 'Deal' : 'Deals'}
            </span>
            <div className="flex flex-col gap-1 max-h-[80px] overflow-y-auto">
              {variationsWithDeals.map((variation, index) => {
                const { value, symbol } = getDealInfo(variation.deal);
                return (
                  <div key={index} className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded inline-block">
                      {variation.title}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {value}
                      {symbol}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      },
    },
    {
      headerName: t('Image'),
      propertyName: 'image',
      body: (item: IFoodNew) =>
        item.image ? (
          <Image src={item.image} width={40} height={40} alt="item.png" />
        ) : (
          <></>
        ),
    },
    {
      headerName: t('Out of Stock'),
      propertyName: 'isOutOfStock',
      body: (item: IFoodNew) => {
        return (
          <CustomInputSwitch
            loading={isFoodLoading === item._id}
            isActive={item.isOutOfStock}
            onChange={() =>
              onUpdateFoodOutOfStock(item._id, item.category?.code ?? '')
            }
          />
        );
      },
    },
    {
      propertyName: 'actions',
      body: (option: IFoodNew) => {
        return <ActionMenu items={menuItems} data={option} />;
      },
    },
  ];
};
